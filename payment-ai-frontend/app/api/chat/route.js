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

IMPORTANT: Always respond ONLY with valid JSON. Never include the JSON structure in your message field.

When user wants to send money, extract:
- recipient username (like "bob", "alice", "charlie", "diana") OR account number (format: BANK1XXXXXXXX or BANK2XXXXXXXX)
- amount (number)

When user wants to search products, extract:
- search query (product name/description)

When user wants to BUY a product, extract:
- product_id (from previous search results)
- product name and price for confirmation

Respond in a conversational, helpful manner. Format your responses as ONLY this JSON structure (no markdown, no code blocks):
{
  "intent": "transfer" | "search_product" | "buy_product" | "general",
  "message": "your natural language response to the user (NO JSON in this field)",
  "data": { /* extracted data based on intent */ }
}

For transfer intent data: { "recipient": "username or account", "amount": number }
For search_product intent data: { "query": "search term" }
For buy_product intent data: { "product_id": "LAPTOP-Pro-123456", "product_name": "name", "price": amount }

Example responses:
{"intent":"search_product","message":"I'll search for laptops for you. Here are the results:","data":{"query":"laptops"}}
{"intent":"transfer","message":"I'll help you send $50 to bob. Please confirm this transfer.","data":{"recipient":"bob","amount":50}}`;

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
