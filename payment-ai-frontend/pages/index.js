import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [userContext, setUserContext] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginForm, setLoginForm] = useState({ bank: 'bank1', username: '', password: '' })
  const [pendingTransfer, setPendingTransfer] = useState(null)
  const [storeAccount, setStoreAccount] = useState(null)
  const recognitionRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Fetch store account info
    fetch('http://localhost:8003/store-account')
      .then(res => res.json())
      .then(data => setStoreAccount(data))
      .catch(() => {})
      
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        handleSendMessage(transcript)
      }
      
      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [userContext])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const apiUrl = loginForm.bank === 'bank1' 
      ? 'http://localhost:8001' 
      : 'http://localhost:8002'
    
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginForm.username,
          password: loginForm.password
        })
      })
      
      const data = await response.json()
      
      if (data.access_token) {
        setUserContext({
          username: data.user.username,
          accountNumber: data.user.account_number,
          balance: data.user.balance,
          token: data.access_token,
          bank: loginForm.bank
        })
        setShowLoginModal(false)
        addMessage('system', `Welcome ${data.user.username}! You're logged in with account ${data.user.account_number}. Balance: $${data.user.balance}`)
      } else {
        alert('Login failed')
      }
    } catch (error) {
      alert('Login error: ' + error.message)
    }
  }

  const handleLogout = () => {
    setUserContext(null)
    addMessage('system', 'You have been logged out.')
  }

  const addMessage = (sender, text, data = null) => {
    setMessages(prev => [...prev, { sender, text, data, timestamp: new Date() }])
  }

  const handleSendMessage = async (text = input) => {
    if (!text.trim()) return
    
    addMessage('user', text)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.slice(-6).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          })),
          userContext
        })
      })

      const aiResponse = await response.json()
      
      if (aiResponse.intent === 'transfer' && aiResponse.data) {
        if (!userContext) {
          addMessage('assistant', 'Please login first to make transfers.')
          setShowLoginModal(true)
        } else {
          // Look up account number by username or use account number directly
          const recipientAccount = await lookupAccountByUsername(aiResponse.data.recipient)
          
          if (!recipientAccount) {
            addMessage('assistant', `I couldn't find a user named "${aiResponse.data.recipient}". Please check the name and try again.`)
          } else {
            setPendingTransfer({
              toAccount: recipientAccount,
              amount: aiResponse.data.amount,
              description: text
            })
            addMessage('assistant', aiResponse.message)
          }
        }
      } else if (aiResponse.intent === 'search_product') {
        addMessage('assistant', aiResponse.message)
        const products = await searchProducts(aiResponse.data.query)
        if (products && products.length > 0) {
          addMessage('products', `Found ${products.length} products:`, products)
        }
      } else if (aiResponse.intent === 'buy_product' && aiResponse.data) {
        if (!userContext) {
          addMessage('assistant', 'Please login first to make purchases.')
          setShowLoginModal(true)
        } else if (!storeAccount) {
          addMessage('assistant', 'Store account not available. Please try again.')
        } else {
          setPendingTransfer({
            toAccount: storeAccount.account_number,
            amount: aiResponse.data.price,
            description: `Purchase: ${aiResponse.data.product_name}`,
            isProductPurchase: true
          })
          addMessage('assistant', aiResponse.message)
        }
      } else {
        addMessage('assistant', aiResponse.message, aiResponse.data)
      }
    } catch (error) {
      addMessage('assistant', 'Sorry, I encountered an error. Please try again.')
    }
    
    setIsLoading(false)
  }

  const searchProducts = async (query) => {
    try {
      const response = await fetch('/api/search-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      return await response.json()
    } catch (error) {
      return []
    }
  }

  const lookupAccountByUsername = async (recipient) => {
    // If recipient looks like an account number, return it as-is
    if (recipient && (recipient.startsWith('BANK1') || recipient.startsWith('BANK2'))) {
      return recipient
    }
    
    // Otherwise, look up the username in both banks
    const username = recipient.toLowerCase()
    try {
      // Check Bank 1
      const bank1Response = await fetch(`${process.env.NEXT_PUBLIC_BANK1_API || 'http://localhost:8001'}/users`)
      const bank1Data = await bank1Response.json()
      const bank1User = bank1Data.users.find(u => u.username.toLowerCase() === username)
      if (bank1User) return bank1User.account_number
      
      // Check Bank 2
      const bank2Response = await fetch(`${process.env.NEXT_PUBLIC_BANK2_API || 'http://localhost:8002'}/users`)
      const bank2Data = await bank2Response.json()
      const bank2User = bank2Data.users.find(u => u.username.toLowerCase() === username)
      if (bank2User) return bank2User.account_number
      
      return null
    } catch (error) {
      console.error('Username lookup error:', error)
      return null
    }
  }

  const confirmTransfer = async () => {
    if (!pendingTransfer || !userContext) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAccount: userContext.accountNumber,
          toAccount: pendingTransfer.toAccount,
          amount: pendingTransfer.amount,
          token: userContext.token,
          description: pendingTransfer.description
        })
      })

      const result = await response.json()
      
      if (result.success) {
        const successMsg = pendingTransfer.isProductPurchase 
          ? `✅ Purchase successful! Paid $${pendingTransfer.amount}. Transaction ID: ${result.transaction_id}`
          : `✅ Transfer successful! Transaction ID: ${result.transaction_id}`
        addMessage('system', successMsg)
        // Update balance
        setUserContext(prev => ({
          ...prev,
          balance: prev.balance - pendingTransfer.amount
        }))
      } else {
        addMessage('system', `❌ Payment failed: ${result.message}`)
      }
    } catch (error) {
      addMessage('system', `❌ Payment error: ${error.message}`)
    }
    
    setPendingTransfer(null)
    setIsLoading(false)
  }

  const handleBuyProduct = (product) => {
    if (!userContext) {
      addMessage('assistant', 'Please login first to make purchases.')
      setShowLoginModal(true)
      return
    }
    if (!storeAccount) {
      addMessage('assistant', 'Store account not available. Please try again.')
      return
    }
    setPendingTransfer({
      toAccount: storeAccount.account_number,
      amount: product.price,
      description: `Purchase: ${product.name}`,
      isProductPurchase: true,
      productDetails: product
    })
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Rajdhani', 'Orbitron', -apple-system, BlinkMacSystemFont, 'Segoe UI', monospace", background: '#000000' }}>
      {/* Sidebar */}
      <div style={{ width: 320, background: 'linear-gradient(180deg, rgba(0,30,60,0.85) 0%, rgba(0,10,25,0.95) 100%)', backdropFilter: 'blur(20px) saturate(180%)', boxShadow: '4px 0 30px rgba(0,100,255,0.3), inset -1px 0 0 rgba(0,150,255,0.2)', padding: '30px 20px', borderRight: '1px solid rgba(0,150,255,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 30, padding: '15px', background: 'rgba(0,100,255,0.1)', border: '1px solid rgba(0,150,255,0.3)', clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)' }}>
          <div style={{ width: 50, height: 50, background: 'linear-gradient(135deg, #0066ff 0%, #00ccff 100%)', clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginRight: 15, boxShadow: '0 0 20px rgba(0,150,255,0.6)' }}>
            💳
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 24, color: '#00ccff', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>PAYMENT AI</h2>
            <p style={{ margin: 0, fontSize: 11, color: '#0099ff', textTransform: 'uppercase', letterSpacing: '1px' }}>NEURAL INTERFACE</p>
          </div>
        </div>
        
        {userContext ? (
          <div style={{ marginTop: 20, padding: 20, background: 'linear-gradient(135deg, rgba(0,100,255,0.2) 0%, rgba(0,50,150,0.3) 100%)', backdropFilter: 'blur(10px)', clipPath: 'polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%)', border: '1px solid rgba(0,150,255,0.4)', color: '#fff', boxShadow: '0 8px 32px rgba(0,100,255,0.3), inset 0 0 20px rgba(0,150,255,0.1)' }}>
            <div style={{ fontSize: 10, color: '#0099ff', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '2px' }}>ACTIVE USER</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#00ccff', textTransform: 'uppercase' }}>{userContext.username}</div>
            <div style={{ fontSize: 10, marginTop: 8, color: '#0099ff', fontFamily: 'monospace', letterSpacing: '1px' }}>{userContext.accountNumber}</div>
            <div style={{ marginTop: 15, padding: 15, background: 'rgba(0,0,0,0.4)', clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)', border: '1px solid rgba(0,150,255,0.3)' }}>
              <div style={{ fontSize: 10, color: '#0099ff', textTransform: 'uppercase', letterSpacing: '1px' }}>BALANCE</div>
              <div style={{ fontSize: 28, fontWeight: 700, marginTop: 5, color: '#00ff88', textShadow: '0 0 10px rgba(0,255,136,0.5)' }}>${userContext.balance.toFixed(2)}</div>
            </div>
            <button onClick={handleLogout} style={{ marginTop: 15, padding: 12, width: '100%', background: 'rgba(255,0,80,0.2)', color: '#ff0050', border: '1px solid rgba(255,0,80,0.5)', clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)', cursor: 'pointer', fontSize: 12, fontWeight: 700, transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '1px' }}>
              🚪 DISCONNECT
            </button>
          </div>
        ) : (
          <button onClick={() => setShowLoginModal(true)} style={{ marginTop: 20, padding: 15, width: '100%', background: 'linear-gradient(135deg, rgba(0,100,255,0.3) 0%, rgba(0,150,255,0.2) 100%)', color: '#00ccff', border: '1px solid rgba(0,150,255,0.5)', clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)', cursor: 'pointer', fontSize: 14, fontWeight: 700, boxShadow: '0 4px 20px rgba(0,100,255,0.4)', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '1px' }}>
            🔐 CONNECT BANK
          </button>
        )}

        <div style={{ marginTop: 40, padding: 20, background: 'rgba(0,50,100,0.3)', backdropFilter: 'blur(10px)', clipPath: 'polygon(0 0, 100% 0, 100% 98%, 0 100%)', border: '1px solid rgba(0,150,255,0.2)' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: 14, color: '#00ccff', textTransform: 'uppercase', letterSpacing: '2px' }}>⚡ FUNCTIONS</h3>
          <div style={{ fontSize: 13, color: '#0099ff', lineHeight: 2.2 }}>
            <div>▸ INSTANT TRANSFER</div>
            <div>▸ PRODUCT PURCHASE</div>
            <div>▸ BALANCE CHECK</div>
            <div>▸ VOICE CONTROL</div>
            <div>▸ SEARCH ENGINE</div>
          </div>
        </div>

        <div style={{ marginTop: 20, padding: 15, background: 'rgba(0,0,0,0.5)', clipPath: 'polygon(0 0, 100% 0, 100% 95%, 0 100%)', border: '1px solid rgba(0,150,255,0.2)', fontSize: 11, color: '#0099ff' }}>
          <strong style={{ color: '#00ccff', textTransform: 'uppercase', letterSpacing: '1px' }}>// COMMANDS:</strong><br/>
          <span style={{ color: '#00ff88' }}>&gt;</span> Send $50 to bob<br/>
          <span style={{ color: '#00ff88' }}>&gt;</span> Find headphones<br/>
          <span style={{ color: '#00ff88' }}>&gt;</span> Check balance
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'radial-gradient(ellipse at top, rgba(0,50,100,0.3) 0%, rgba(0,0,0,0.8) 100%)' }}>
        {/* Header */}
        <div style={{ padding: '20px 30px', background: 'linear-gradient(90deg, rgba(0,30,60,0.9) 0%, rgba(0,50,100,0.7) 100%)', backdropFilter: 'blur(20px)', boxShadow: '0 2px 30px rgba(0,100,255,0.3), inset 0 -1px 0 rgba(0,150,255,0.3)', borderBottom: '1px solid rgba(0,150,255,0.3)' }}>
          <h1 style={{ margin: 0, fontSize: 28, color: '#00ccff', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 700, textShadow: '0 0 20px rgba(0,200,255,0.5)' }}>
            💬 NEURAL INTERFACE
          </h1>
          <p style={{ margin: '5px 0 0 0', color: '#0099ff', fontSize: 13, textTransform: 'uppercase', letterSpacing: '2px' }}>AI-POWERED TRANSACTION SYSTEM</p>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '30px', background: 'transparent', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,100,255,0.03) 2px, rgba(0,100,255,0.03) 4px)', pointerEvents: 'none' }}></div>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: 80, position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 64, marginBottom: 20, filter: 'drop-shadow(0 0 20px rgba(0,200,255,0.6))' }}>⚡</div>
              <h2 style={{ color: '#00ccff', fontSize: 28, textTransform: 'uppercase', letterSpacing: '3px', textShadow: '0 0 20px rgba(0,200,255,0.5)' }}>SYSTEM READY</h2>
              <p style={{ color: '#0099ff', fontSize: 14, textTransform: 'uppercase', letterSpacing: '2px' }}>AWAITING COMMAND INPUT</p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: 20, display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', position: 'relative', zIndex: 1 }}>
              {msg.sender !== 'user' && msg.sender !== 'products' && (
                <div style={{ width: 40, height: 40, clipPath: 'polygon(20% 0, 100% 0, 80% 100%, 0 100%)', background: msg.sender === 'system' ? 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)' : 'linear-gradient(135deg, #0066ff 0%, #00ccff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, fontSize: 20, flexShrink: 0, boxShadow: '0 0 20px rgba(0,150,255,0.5)' }}>
                  {msg.sender === 'system' ? '⚡' : '🤖'}
                </div>
              )}
              <div style={{ maxWidth: msg.sender === 'products' ? '85%' : '65%' }}>
                {msg.sender === 'products' ? (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#00ccff', marginBottom: 15, textTransform: 'uppercase', letterSpacing: '2px', textShadow: '0 0 10px rgba(0,200,255,0.5)' }}>{msg.text}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 15 }}>
                      {msg.data && msg.data.map((product, i) => (
                        <div key={i} style={{ background: 'linear-gradient(135deg, rgba(0,30,60,0.8) 0%, rgba(0,10,25,0.9) 100%)', backdropFilter: 'blur(20px)', clipPath: 'polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%)', border: '1px solid rgba(0,150,255,0.3)', boxShadow: '0 8px 32px rgba(0,100,255,0.3), inset 0 0 20px rgba(0,150,255,0.05)', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,150,255,0.5), inset 0 0 30px rgba(0,200,255,0.1)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,100,255,0.3), inset 0 0 20px rgba(0,150,255,0.05)'; }}>
                          <div style={{ height: 180, background: `linear-gradient(135deg, ${product.brand === 'TechPro' ? 'rgba(0,100,255,0.3), rgba(0,150,255,0.1)' : 'rgba(0,255,136,0.3), rgba(0,200,100,0.1)'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, borderBottom: '1px solid rgba(0,150,255,0.2)', clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)' }}>
                            {product.category === 'Electronics' ? '📱' : '🏠'}
                          </div>
                          <div style={{ padding: 20 }}>
                            <div style={{ fontSize: 10, color: '#00ff88', fontWeight: 700, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '2px' }}>{product.brand}</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: '#00ccff', marginBottom: 8, textTransform: 'uppercase' }}>{product.name}</div>
                            <div style={{ fontSize: 12, color: '#0099ff', marginBottom: 12, lineHeight: 1.4 }}>{product.description}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                              <div style={{ fontSize: 24, fontWeight: 700, color: '#00ff88', textShadow: '0 0 10px rgba(0,255,136,0.5)' }}>${product.price}</div>
                              <button onClick={() => handleBuyProduct(product)} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, rgba(0,100,255,0.3) 0%, rgba(0,150,255,0.2) 100%)', color: '#00ccff', border: '1px solid rgba(0,150,255,0.5)', clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)', cursor: 'pointer', fontSize: 11, fontWeight: 700, boxShadow: '0 4px 12px rgba(0,100,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.2s' }}>
                                🛒 ACQUIRE
                              </button>
                            </div>
                            <div style={{ marginTop: 10, fontSize: 10, color: '#0099ff', textTransform: 'uppercase', letterSpacing: '1px' }}>STOCK: {product.stock} UNITS</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ 
                    padding: 16, 
                    clipPath: msg.sender === 'user' ? 'polygon(5% 0, 100% 0, 100% 100%, 0 100%)' : 'polygon(0 0, 95% 0, 100% 100%, 0 100%)',
                    background: msg.sender === 'user' 
                      ? 'linear-gradient(135deg, rgba(0,100,255,0.3) 0%, rgba(0,150,255,0.2) 100%)' 
                      : msg.sender === 'system' 
                        ? 'linear-gradient(135deg, rgba(0,255,136,0.2) 0%, rgba(0,200,100,0.1) 100%)' 
                        : 'linear-gradient(135deg, rgba(0,50,100,0.3) 0%, rgba(0,30,60,0.4) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: msg.sender === 'user' ? '1px solid rgba(0,150,255,0.4)' : '1px solid rgba(0,150,255,0.3)',
                    color: msg.sender === 'user' ? '#00ccff' : msg.sender === 'system' ? '#00ff88' : '#00ccff',
                    boxShadow: msg.sender === 'user' ? '0 4px 16px rgba(0,100,255,0.3), inset 0 0 20px rgba(0,150,255,0.1)' : '0 4px 16px rgba(0,100,255,0.2), inset 0 0 20px rgba(0,150,255,0.05)',
                    fontSize: 14,
                    lineHeight: 1.6,
                    textShadow: msg.sender === 'system' ? '0 0 5px rgba(0,255,136,0.3)' : 'none'
                  }}>
                    {msg.text}
                  </div>
                )}
              </div>
              {msg.sender === 'user' && (
                <div style={{ width: 40, height: 40, clipPath: 'polygon(0 0, 80% 0, 100% 100%, 20% 100%)', background: 'linear-gradient(135deg, #0066ff 0%, #00ccff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 12, fontSize: 20, flexShrink: 0, boxShadow: '0 0 20px rgba(0,200,255,0.5)' }}>
                  👤
                </div>
              )}
            </div>
          ))}
          
          {pendingTransfer && (
            <div style={{ padding: 25, background: 'linear-gradient(135deg, rgba(255,150,0,0.15) 0%, rgba(255,100,0,0.1) 100%)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,150,0,0.5)', clipPath: 'polygon(0 0, 100% 0, 100% 98%, 98% 100%, 0 100%)', marginTop: 20, boxShadow: '0 8px 32px rgba(255,150,0,0.3), inset 0 0 30px rgba(255,150,0,0.1)', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                <div style={{ fontSize: 32, marginRight: 12 }}>⚠️</div>
                <div>
                  <strong style={{ fontSize: 18, color: '#ffaa00', textTransform: 'uppercase', letterSpacing: '2px' }}>AUTHORIZATION REQUIRED</strong>
                  <div style={{ fontSize: 11, color: '#ff8800', marginTop: 2, textTransform: 'uppercase', letterSpacing: '1px' }}>VERIFY TRANSACTION DETAILS</div>
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: 15, clipPath: 'polygon(0 0, 100% 0, 100% 95%, 0 100%)', marginBottom: 15, border: '1px solid rgba(255,150,0,0.2)' }}>
                <div style={{ marginBottom: 8, color: '#00ccff', fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px' }}><strong>TARGET:</strong> <span style={{ color: '#00ff88' }}>{pendingTransfer.isProductPurchase ? 'ShopStore' : pendingTransfer.toAccount}</span></div>
                <div style={{ marginBottom: 8, color: '#00ccff', fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px' }}><strong>AMOUNT:</strong> <span style={{ fontSize: 20, color: '#ffaa00', fontWeight: 700, textShadow: '0 0 10px rgba(255,170,0,0.5)' }}>${(pendingTransfer.amount || 0).toFixed(2)}</span></div>
                {pendingTransfer.description && <div style={{ color: '#00ccff', fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px' }}><strong>DETAILS:</strong> <span style={{ color: '#0099ff' }}>{pendingTransfer.description}</span></div>}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={confirmTransfer} disabled={isLoading} style={{ flex: 1, padding: 14, background: 'linear-gradient(135deg, rgba(0,255,136,0.2) 0%, rgba(0,200,100,0.3) 100%)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.5)', clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)', cursor: 'pointer', fontSize: 13, fontWeight: 700, boxShadow: '0 4px 16px rgba(0,255,136,0.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  ✓ CONFIRM
                </button>
                <button onClick={() => setPendingTransfer(null)} style={{ flex: 1, padding: 14, background: 'linear-gradient(135deg, rgba(255,0,80,0.2) 0%, rgba(200,0,50,0.3) 100%)', color: '#ff0050', border: '1px solid rgba(255,0,80,0.5)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 5% 100%)', cursor: 'pointer', fontSize: 13, fontWeight: 700, boxShadow: '0 4px 16px rgba(255,0,80,0.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  ✗ ABORT
                </button>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '20px 30px', background: 'linear-gradient(90deg, rgba(0,30,60,0.9) 0%, rgba(0,50,100,0.7) 100%)', backdropFilter: 'blur(20px)', boxShadow: '0 -2px 30px rgba(0,100,255,0.3), inset 0 1px 0 rgba(0,150,255,0.3)', borderTop: '1px solid rgba(0,150,255,0.3)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="ENTER COMMAND..."
              disabled={isLoading}
              style={{ flex: 1, padding: 16, fontSize: 14, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,150,255,0.3)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 5px 100%)', outline: 'none', transition: 'all 0.2s', color: '#00ccff', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase' }}
              onFocus={(e) => { e.target.style.borderColor = '#00ccff'; e.target.style.boxShadow = '0 0 20px rgba(0,200,255,0.3), inset 0 0 10px rgba(0,150,255,0.1)' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(0,150,255,0.3)'; e.target.style.boxShadow = 'none' }}
            />
            <button
              onClick={toggleVoiceInput}
              style={{ padding: '16px 20px', background: isListening ? 'linear-gradient(135deg, rgba(255,0,80,0.3) 0%, rgba(200,0,50,0.4) 100%)' : 'linear-gradient(135deg, rgba(0,100,255,0.3) 0%, rgba(0,150,255,0.2) 100%)', color: isListening ? '#ff0050' : '#00ccff', border: '1px solid ' + (isListening ? 'rgba(255,0,80,0.5)' : 'rgba(0,150,255,0.5)'), clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)', cursor: 'pointer', fontSize: 20, boxShadow: '0 4px 16px rgba(0,100,255,0.3)', transition: 'all 0.2s' }}
            >
              {isListening ? '⏹' : '🎤'}
            </button>
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
              style={{ padding: '16px 28px', background: isLoading || !input.trim() ? 'rgba(50,50,50,0.5)' : 'linear-gradient(135deg, rgba(0,255,136,0.3) 0%, rgba(0,200,100,0.4) 100%)', color: isLoading || !input.trim() ? '#666' : '#00ff88', border: '1px solid ' + (isLoading || !input.trim() ? 'rgba(100,100,100,0.3)' : 'rgba(0,255,136,0.5)'), clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)', cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700, boxShadow: '0 4px 16px rgba(0,255,136,0.3)', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '1px' }}
            >
              {isLoading ? '⏳ PROCESSING' : '📨 EXECUTE'}
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(0,30,60,0.95) 0%, rgba(0,50,100,0.95) 100%)', backdropFilter: 'blur(20px)', padding: 40, clipPath: 'polygon(0 0, 100% 0, 100% 98%, 98% 100%, 0 100%)', width: 450, boxShadow: '0 20px 60px rgba(0,100,255,0.5), inset 0 0 40px rgba(0,150,255,0.1)', border: '1px solid rgba(0,150,255,0.3)' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: 28, color: '#00ccff', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 700, textShadow: '0 0 20px rgba(0,200,255,0.5)' }}>🔐 BANK ACCESS</h2>
            <p style={{ margin: '0 0 25px 0', color: '#0099ff', fontSize: 12, textTransform: 'uppercase', letterSpacing: '2px' }}>SECURE AUTHENTICATION REQUIRED</p>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 11, fontWeight: 700, color: '#00ccff', textTransform: 'uppercase', letterSpacing: '2px' }}>SELECT BANK:</label>
                <select value={loginForm.bank} onChange={(e) => setLoginForm({...loginForm, bank: e.target.value})} style={{ width: '100%', padding: 14, fontSize: 13, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,150,255,0.3)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 5px 100%)', outline: 'none', transition: 'all 0.2s', color: '#00ccff', fontFamily: 'monospace', letterSpacing: '1px' }} onFocus={(e) => { e.target.style.borderColor = '#00ccff'; e.target.style.boxShadow = '0 0 20px rgba(0,200,255,0.3)' }} onBlur={(e) => { e.target.style.borderColor = 'rgba(0,150,255,0.3)'; e.target.style.boxShadow = 'none' }}>
                  <option value="bank1">🏦 BANK 1</option>
                  <option value="bank2">🏦 BANK 2</option>
                </select>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 11, fontWeight: 700, color: '#00ccff', textTransform: 'uppercase', letterSpacing: '2px' }}>USERNAME:</label>
                <input type="text" value={loginForm.username} onChange={(e) => setLoginForm({...loginForm, username: e.target.value})} style={{ width: '100%', padding: 14, fontSize: 13, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,150,255,0.3)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 5px 100%)', outline: 'none', transition: 'all 0.2s', color: '#00ccff', fontFamily: 'monospace', letterSpacing: '1px' }} onFocus={(e) => { e.target.style.borderColor = '#00ccff'; e.target.style.boxShadow = '0 0 20px rgba(0,200,255,0.3)' }} onBlur={(e) => { e.target.style.borderColor = 'rgba(0,150,255,0.3)'; e.target.style.boxShadow = 'none' }} required />
              </div>
              <div style={{ marginBottom: 25 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 11, fontWeight: 700, color: '#00ccff', textTransform: 'uppercase', letterSpacing: '2px' }}>PASSWORD:</label>
                <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} style={{ width: '100%', padding: 14, fontSize: 13, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,150,255,0.3)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 5px 100%)', outline: 'none', transition: 'all 0.2s', color: '#00ccff', fontFamily: 'monospace', letterSpacing: '1px' }} onFocus={(e) => { e.target.style.borderColor = '#00ccff'; e.target.style.boxShadow = '0 0 20px rgba(0,200,255,0.3)' }} onBlur={(e) => { e.target.style.borderColor = 'rgba(0,150,255,0.3)'; e.target.style.boxShadow = 'none' }} required />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" style={{ flex: 1, padding: 14, background: 'linear-gradient(135deg, rgba(0,100,255,0.3) 0%, rgba(0,150,255,0.2) 100%)', color: '#00ccff', border: '1px solid rgba(0,150,255,0.5)', clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)', cursor: 'pointer', fontSize: 13, fontWeight: 700, boxShadow: '0 4px 16px rgba(0,100,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  AUTHENTICATE
                </button>
                <button type="button" onClick={() => setShowLoginModal(false)} style={{ flex: 1, padding: 14, background: 'rgba(50,50,50,0.5)', color: '#666', border: '1px solid rgba(100,100,100,0.3)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 5% 100%)', cursor: 'pointer', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  ABORT
                </button>
              </div>
            </form>
            <div style={{ marginTop: 25, padding: 18, background: 'rgba(0,0,0,0.5)', clipPath: 'polygon(0 0, 100% 0, 100% 95%, 0 100%)', border: '1px solid rgba(0,150,255,0.2)', fontSize: 11, color: '#0099ff' }}>
              <strong style={{ color: '#00ccff', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '2px' }}>// TEST ACCOUNTS:</strong>
              <div style={{ lineHeight: 1.8, fontFamily: 'monospace' }}>
                <span style={{ color: '#00ff88' }}>BANK 1:</span> alice/password123 <em style={{ fontSize: 10, color: '#0099ff' }}>($5,000)</em><br/>
                <span style={{ color: '#00ff88' }}>BANK 1:</span> bob/password123 <em style={{ fontSize: 10, color: '#0099ff' }}>($3,000)</em><br/>
                <span style={{ color: '#00ff88' }}>BANK 2:</span> charlie/password123 <em style={{ fontSize: 10, color: '#0099ff' }}>($7,000)</em><br/>
                <span style={{ color: '#00ff88' }}>BANK 2:</span> diana/password123 <em style={{ fontSize: 10, color: '#0099ff' }}>($4,000)</em>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
