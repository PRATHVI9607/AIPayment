export async function POST(request) {
  try {
    const { query } = await request.json();
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_SHOPPING_API}/products/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Failed to search products' }, { status: 500 });
  }
}
