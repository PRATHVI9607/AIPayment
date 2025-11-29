export async function POST(request) {
  try {
    const { fromAccount, toAccount, amount, token, description } = await request.json();
    
    // Validate required fields
    if (!fromAccount || !toAccount || !amount || !token) {
      console.error('Missing required fields:', { fromAccount, toAccount, amount, token });
      return Response.json({ 
        success: false, 
        message: 'Missing required fields for transfer' 
      }, { status: 400 });
    }

    // Validate amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      console.error('Invalid amount:', amount);
      return Response.json({ 
        success: false, 
        message: 'Invalid amount' 
      }, { status: 400 });
    }
    
    const gatewayUrl = process.env.PAYMENT_GATEWAY_URL || 'http://localhost:8000';
    console.log('Sending transfer to gateway:', { fromAccount, toAccount, amount: parsedAmount });
    
    const response = await fetch(`${gatewayUrl}/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from_account: fromAccount,
        to_account: toAccount,
        amount: parsedAmount,
        token,
        description: description || ''
      })
    });

    const data = await response.json();
    console.log('Gateway response:', data);
    return Response.json(data);
  } catch (error) {
    console.error('Transfer API error:', error);
    return Response.json({ 
      success: false, 
      message: 'Failed to process transfer', 
      error: error.message 
    }, { status: 500 });
  }
}
