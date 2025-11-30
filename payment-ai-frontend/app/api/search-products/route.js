export async function POST(request) {
  try {
    const { query } = await request.json();
    
    // Use environment variable or default to localhost
    const apiUrl = process.env.SHOPPING_API_URL || 'http://localhost:8003';
    console.log('🔍 Searching products:', query, 'API:', apiUrl);
    
    const response = await fetch(`${apiUrl}/products/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query || "" })
    });

    if (!response.ok) {
      throw new Error(`Shopping API returned ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Search complete:', data.length, 'products found');
    return Response.json(data);
  } catch (error) {
    console.error('❌ Search products error:', error.message);
    console.error('Stack:', error.stack);
    return Response.json([], { status: 200 }); // Return empty array instead of error
  }
}
