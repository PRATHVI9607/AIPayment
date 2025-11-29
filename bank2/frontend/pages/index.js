import useSWR from 'swr'

const fetcher = (url) => fetch(url).then(r => r.json())

export default function Bank2() {
  const { data, error } = useSWR('http://localhost:8002/users', fetcher, { refreshInterval: 3000 })

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

  const totalBalance = data.users.reduce((sum, u) => sum + u.balance, 0)

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top, rgba(0,50,100,0.3) 0%, #000000 100%)', padding: 40, fontFamily: "'Rajdhani', 'Orbitron', monospace" }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0,50,100,0.4) 0%, rgba(0,30,60,0.5) 100%)', backdropFilter: 'blur(20px)', clipPath: 'polygon(0 0, 100% 0, 100% 98%, 98% 100%, 0 100%)', padding: 40, marginBottom: 30, boxShadow: '0 20px 60px rgba(0,100,255,0.3), inset 0 0 40px rgba(0,150,255,0.1)', border: '1px solid rgba(0,150,255,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, rgba(0,100,255,0.5) 0%, rgba(0,150,255,0.3) 100%)', clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, marginRight: 20, boxShadow: '0 0 30px rgba(0,150,255,0.5)' }}>
              🏦
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 42, color: '#00ccff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', textShadow: '0 0 20px rgba(0,200,255,0.5)' }}>
                BANK 2 DASHBOARD
              </h1>
              <p style={{ margin: '8px 0 0 0', color: '#0099ff', fontSize: 12, textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'monospace' }}>
                // PORT 3002 • BACKEND: LOCALHOST:8002
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#0099ff', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '2px' }}>TOTAL ASSETS:</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#00ff88', textShadow: '0 0 20px rgba(0,255,136,0.5)', fontFamily: 'monospace' }}>
              ${totalBalance.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 30 }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(0,100,255,0.3) 0%, rgba(0,150,255,0.2) 100%)', backdropFilter: 'blur(15px)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 5% 100%)', padding: 30, boxShadow: '0 8px 24px rgba(0,100,255,0.4)', border: '1px solid rgba(0,150,255,0.3)' }}>
          <div style={{ fontSize: 11, color: '#0099ff', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '2px' }}>TOTAL ACCOUNTS:</div>
          <div style={{ fontSize: 38, fontWeight: 700, color: '#00ccff', fontFamily: 'monospace' }}>{data.users.length}</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, rgba(0,100,255,0.3) 0%, rgba(0,150,255,0.2) 100%)', backdropFilter: 'blur(15px)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 5% 100%)', padding: 30, boxShadow: '0 8px 24px rgba(0,100,255,0.4)', border: '1px solid rgba(0,150,255,0.3)' }}>
          <div style={{ fontSize: 11, color: '#0099ff', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '2px' }}>AVG BALANCE:</div>
          <div style={{ fontSize: 38, fontWeight: 700, color: '#00ccff', fontFamily: 'monospace' }}>${(totalBalance / data.users.length).toFixed(2)}</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, rgba(0,100,255,0.3) 0%, rgba(0,150,255,0.2) 100%)', backdropFilter: 'blur(15px)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 5% 100%)', padding: 30, boxShadow: '0 8px 24px rgba(0,100,255,0.4)', border: '1px solid rgba(0,150,255,0.3)' }}>
          <div style={{ fontSize: 11, color: '#0099ff', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '2px' }}>STATUS:</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#00ff88', textShadow: '0 0 15px rgba(0,255,136,0.5)' }}>🟢 ACTIVE</div>
        </div>
      </div>

      {/* Users Grid */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0,50,100,0.4) 0%, rgba(0,30,60,0.5) 100%)', backdropFilter: 'blur(20px)', clipPath: 'polygon(0 0, 100% 0, 100% 98%, 98% 100%, 0 100%)', padding: 40, boxShadow: '0 20px 60px rgba(0,100,255,0.3), inset 0 0 40px rgba(0,150,255,0.1)', border: '1px solid rgba(0,150,255,0.3)' }}>
        <h2 style={{ margin: '0 0 25px 0', fontSize: 24, color: '#00ccff', textTransform: 'uppercase', letterSpacing: '3px' }}>// ACCOUNT HOLDERS:</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {data.users.map(u => (
            <div key={u.account_number} style={{ background: 'linear-gradient(135deg, rgba(0,100,255,0.4) 0%, rgba(0,150,255,0.3) 100%)', backdropFilter: 'blur(15px)', clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)', padding: 25, color: 'white', boxShadow: '0 8px 24px rgba(0,150,255,0.4), inset 0 0 30px rgba(0,200,255,0.1)', border: '1px solid rgba(0,150,255,0.4)', transition: 'transform 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,150,255,0.6), inset 0 0 30px rgba(0,200,255,0.2)' }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,150,255,0.4), inset 0 0 30px rgba(0,200,255,0.1)' }}>
              <div style={{ fontSize: 48, marginBottom: 15 }}>👤</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '2px', color: '#00ccff' }}>{u.username}</div>
              <div style={{ fontSize: 11, fontFamily: 'monospace', opacity: 0.9, marginBottom: 15, color: '#0099ff', letterSpacing: '1px' }}>{u.account_number}</div>
              <div style={{ padding: 15, background: 'rgba(0,0,0,0.5)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 5px 100%)', border: '1px solid rgba(0,150,255,0.3)' }}>
                <div style={{ fontSize: 10, opacity: 0.9, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '2px', color: '#0099ff' }}>BALANCE:</div>
                <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'monospace', color: '#00ff88', textShadow: '0 0 15px rgba(0,255,136,0.5)' }}>${u.balance.toFixed(2)}</div>
              </div>
              <div style={{ marginTop: 15, fontSize: 11, opacity: 0.8, fontFamily: 'monospace', lineHeight: 1.8, color: '#00ccff' }}>
                📧 {u.email}<br/>
                📞 {u.phone}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

