export async function POST(request) {
  try {
    const { message, conversationHistory, userContext } = await request.json();

    const systemPrompt = `You are a helpful payment assistant AI. You can help users with:
1. Sending money to other users (by username OR account number)
2. Searching for products in the shopping catalog
3. Buying products (triggers payment to store)
4. Checking account balance
5. Viewing transaction history

User Context:
${userContext ? `- Logged in as: ${userContext.username}
- Bank: ${userContext.bank}
- Account: ${userContext.accountNumber}
- Balance: $${userContext.balance}` : '- Not logged in'}

CRITICAL: Respond with ONLY pure JSON. NO markdown, NO code blocks, NO explanations outside the JSON.

When user asks about products (show me, find, search, I want, looking for), extract search terms.

Available products include: laptops, headphones, smartphones, watches, speakers, coffee makers, vacuum cleaners, air purifiers, blenders, toaster ovens, kettles, food processors.

Response format (pure JSON only):
{"intent":"search_product","message":"I'll search for [item] for you. Here are the results:","data":{"query":"search term"}}
{"intent":"transfer","message":"I'll help you send $X to [name]. Please confirm.","data":{"recipient":"username","amount":50}}
{"intent":"buy_product","message":"You're about to buy [product]. Please confirm.","data":{"product_id":"LAPTOP-Pro-123456","product_name":"TechPro Laptop","price":999.99}}
{"intent":"general","message":"Your friendly conversational response here.","data":{}}

Extract only the KEY WORDS for search. "show me laptops" → query: "laptop"
NEVER return product data in the JSON response, just the search query.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // Call Groq API directly via fetch
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || '';
    
    // Try to parse as JSON, fallback to general response
    let parsedResponse;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || 
                       aiResponse.match(/```\s*([\s\S]*?)\s*```/) ||
                       [null, aiResponse];
      
      parsedResponse = JSON.parse(jsonMatch[1] || aiResponse);
      
      // Clean up the message to remove any JSON formatting
      if (parsedResponse.message && typeof parsedResponse.message === 'string') {
        parsedResponse.message = parsedResponse.message
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .replace(/^\{[\s\S]*?\}$/g, '')
          .trim();
      }
    } catch {
      // If not valid JSON, treat as a general conversational response
      parsedResponse = {
        intent: 'general',
        message: aiResponse
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .replace(/^\{[\s\S]*?\}$/g, '')
          .trim(),
        data: {}
      };
    }

    return Response.json(parsedResponse);
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { 
        intent: 'general',
        message: 'I apologize, but I encountered an error processing your request. Please try again.',
        data: {},
        error: error.message 
      },
      { status: 200 } // Return 200 to prevent frontend error
    );
  }
}
