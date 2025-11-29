export async function POST(request) {
  try {
    const { fromAccount, toAccount, amount, token, description } = await request.json();
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_API}/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from_account: fromAccount,
        to_account: toAccount,
        amount: parseFloat(amount),
        token,
        description
      })
    });

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Failed to process transfer' }, { status: 500 });
  }
}
