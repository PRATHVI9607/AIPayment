import useSWR from 'swr'
import { useState } from 'react'

const fetcher = (url) => fetch(url).then(r => r.json())

export default function Home() {
  const { data, error } = useSWR('http://localhost:8003/products', fetcher)
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'rgba(30,0,0,0.9)', backdropFilter: 'blur(20px)', padding: 40, clipPath: 'polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%)', textAlign: 'center', boxShadow: '0 20px 60px rgba(255,0,80,0.5)', border: '1px solid rgba(255,0,80,0.3)' }}>
        <div style={{ fontSize: 48, marginBottom: 15 }}>❌</div>
        <h2 style={{ color: '#ff0050', textTransform: 'uppercase', letterSpacing: '2px' }}>CONNECTION FAILED</h2>
      </div>
    </div>
  )
  
  if (!data) return (
    <div style={{ minHeight: '100vh', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'rgba(0,30,60,0.9)', backdropFilter: 'blur(20px)', padding: 40, clipPath: 'polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%)', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,100,255,0.5)', border: '1px solid rgba(0,150,255,0.3)' }}>
        <div style={{ fontSize: 48, marginBottom: 15 }}>⏳</div>
        <h2 style={{ color: '#00ccff', textTransform: 'uppercase', letterSpacing: '2px' }}>LOADING DATA...</h2>
      </div>
    </div>
  )

  const filteredProducts = data.filter(p => {
    const matchesBrand = selectedBrand === 'all' || p.brand === selectedBrand
    const matchesSearch = searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesBrand && matchesSearch
  })

  const brands = ['all', ...new Set(data.map(p => p.brand))]

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top, rgba(0,50,100,0.3) 0%, #000000 100%)', fontFamily: "'Rajdhani', 'Orbitron', monospace" }}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'linear-gradient(135deg, rgba(0,50,100,0.9) 0%, rgba(0,30,60,0.95) 100%)', backdropFilter: 'blur(20px)', boxShadow: '0 4px 20px rgba(0,100,255,0.3)', padding: '25px 40px', borderBottom: '1px solid rgba(0,150,255,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg, rgba(0,100,255,0.5) 0%, rgba(0,150,255,0.3) 100%)', clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, marginRight: 15, boxShadow: '0 0 30px rgba(0,150,255,0.5)' }}>
              🛍️
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 32, color: '#00ccff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', textShadow: '0 0 20px rgba(0,200,255,0.5)' }}>
                SHOPSTORE
              </h1>
              <p style={{ margin: '5px 0 0 0', color: '#0099ff', fontSize: 11, textTransform: 'uppercase', letterSpacing: '2px' }}>// PREMIUM ELECTRONICS</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#0099ff', textTransform: 'uppercase', letterSpacing: '2px' }}>CATALOG:</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#00ccff', fontFamily: 'monospace' }}>{data.length}</div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="🔍 SEARCH PRODUCTS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: '14px 20px', fontSize: 13, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,150,255,0.3)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 5px 100%)', outline: 'none', transition: 'all 0.2s', color: '#00ccff', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'monospace' }}
            onFocus={(e) => { e.target.style.borderColor = '#00ccff'; e.target.style.boxShadow = '0 0 20px rgba(0,200,255,0.3)' }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(0,150,255,0.3)'; e.target.style.boxShadow = 'none' }}
          />
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            style={{ padding: '14px 20px', fontSize: 13, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,150,255,0.3)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 5px 100%)', outline: 'none', color: '#00ccff', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'monospace' }}
          >
            {brands.map(brand => (
              <option key={brand} value={brand}>
                {brand === 'all' ? '🏷️ ALL BRANDS' : `🏷️ ${brand.toUpperCase()}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ padding: 40 }}>
        <div style={{ marginBottom: 25, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 20, color: '#00ccff', textTransform: 'uppercase', letterSpacing: '3px', textShadow: '0 0 15px rgba(0,200,255,0.5)' }}>
            {selectedBrand === 'all' ? '// ALL PRODUCTS' : `// ${selectedBrand.toUpperCase()} COLLECTION`}
          </h2>
          <div style={{ color: '#0099ff', fontSize: 12, textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'monospace' }}>
            SHOWING {filteredProducts.length} ITEM{filteredProducts.length !== 1 ? 'S' : ''}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 25 }}>
          {filteredProducts.map(p => (
            <div key={p.product_id} style={{ background: 'linear-gradient(135deg, rgba(0,50,100,0.4) 0%, rgba(0,30,60,0.5) 100%)', backdropFilter: 'blur(15px)', clipPath: 'polygon(0 0, 100% 0, 100% 98%, 98% 100%, 0 100%)', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,100,255,0.3), inset 0 0 30px rgba(0,150,255,0.1)', border: '1px solid rgba(0,150,255,0.3)', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,100,255,0.5), inset 0 0 30px rgba(0,150,255,0.2)' }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,100,255,0.3), inset 0 0 30px rgba(0,150,255,0.1)' }}>
              <div style={{ height: 200, background: `linear-gradient(135deg, ${p.brand === 'TechPro' ? 'rgba(0,100,255,0.3), rgba(0,150,255,0.2)' : 'rgba(0,200,255,0.3), rgba(0,100,200,0.2)'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, position: 'relative' }}>
                {p.category === 'Electronics' ? '📱' : '🏠'}
                <div style={{ position: 'absolute', top: 15, right: 15, background: 'rgba(0,0,0,0.5)', padding: '6px 12px', clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)', fontSize: 10, fontWeight: 700, color: '#00ccff', border: '1px solid rgba(0,150,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {p.brand}
                </div>
              </div>
              <div style={{ padding: 25 }}>
                <div style={{ fontSize: 10, color: '#0099ff', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '2px' }}>{p.category}</div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 18, fontWeight: 700, color: '#00ccff', lineHeight: 1.3, textTransform: 'uppercase', letterSpacing: '1px' }}>{p.name}</h3>
                <p style={{ margin: '0 0 15px 0', fontSize: 12, color: '#0099ff', lineHeight: 1.6 }}>{p.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: '#00ff88', fontFamily: 'monospace', textShadow: '0 0 15px rgba(0,255,136,0.5)' }}>
                      ${p.price}
                    </div>
                    <div style={{ fontSize: 10, color: '#0099ff', marginTop: 3, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {p.stock > 0 ? `✓ ${p.stock} IN STOCK` : '✗ OUT OF STOCK'}
                    </div>
                  </div>
                  <button style={{ padding: '12px 24px', background: p.stock > 0 ? 'linear-gradient(135deg, rgba(0,100,255,0.4) 0%, rgba(0,150,255,0.3) 100%)' : 'rgba(50,50,50,0.5)', color: p.stock > 0 ? '#00ccff' : '#666', border: p.stock > 0 ? '1px solid rgba(0,150,255,0.5)' : '1px solid rgba(100,100,100,0.3)', clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)', cursor: p.stock > 0 ? 'pointer' : 'not-allowed', fontSize: 11, fontWeight: 700, boxShadow: p.stock > 0 ? '0 4px 12px rgba(0,100,255,0.4)' : 'none', textTransform: 'uppercase', letterSpacing: '1px' }} disabled={p.stock === 0}>
                    {p.stock > 0 ? '🛒 ADD' : 'SOLD OUT'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, background: 'linear-gradient(135deg, rgba(0,50,100,0.4) 0%, rgba(0,30,60,0.5) 100%)', backdropFilter: 'blur(20px)', clipPath: 'polygon(0 0, 100% 0, 100% 98%, 98% 100%, 0 100%)', marginTop: 20, border: '1px solid rgba(0,150,255,0.3)' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🔍</div>
            <h3 style={{ fontSize: 24, color: '#00ccff', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '2px' }}>NO PRODUCTS FOUND</h3>
            <p style={{ color: '#0099ff', textTransform: 'uppercase', letterSpacing: '1px', fontSize: 12 }}>TRY ADJUSTING YOUR SEARCH</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0,50,100,0.9) 0%, rgba(0,30,60,0.95) 100%)', backdropFilter: 'blur(20px)', padding: 30, textAlign: 'center', marginTop: 40, borderTop: '1px solid rgba(0,150,255,0.3)' }}>
        <p style={{ margin: 0, color: '#0099ff', fontSize: 11, textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'monospace' }}>
          // BACKEND: LOCALHOST:8003 • FRONTEND: PORT 3003
        </p>
        <p style={{ margin: '10px 0 0 0', color: '#0099ff', fontSize: 11, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>
          USE PAYMENT AI CHATBOT FOR VOICE PURCHASES
        </p>
      </div>
    </div>
  )
}

