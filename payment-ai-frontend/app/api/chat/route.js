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

When user wants to send money, extract:
- recipient username (like "bob", "alice", "charlie", "diana") OR account number (format: BANK1XXXXXXXX or BANK2XXXXXXXX)
- amount (number)

When user wants to search products, extract:
- search query (product name/description)
- optional: brand (TechPro or HomeStyle)
- optional: price range

When user wants to BUY a product, extract:
- product_id (from previous search results)
- product name for confirmation

Respond in a conversational, helpful manner. If you need more information, ask for it.
Format your responses as JSON with this structure:
{
  "intent": "transfer" | "search_product" | "buy_product" | "check_balance" | "view_transactions" | "general",
  "message": "your response to the user",
  "data": { /* extracted data based on intent */ }
}

For transfer intent, return: { "recipient": "username or account", "amount": number }
For search_product intent, return: { "query": "search term", "brand": "optional", "category": "optional" }
For buy_product intent, return: { "product_id": "uuid", "product_name": "name", "price": amount }`;

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
      parsedResponse = JSON.parse(aiResponse);
    } catch {
      parsedResponse = {
        intent: 'general',
        message: aiResponse,
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
