'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null)
  const [showSwagger, setShowSwagger] = useState(false)

  useEffect(() => {
    fetch('/api/docs')
      .then(res => res.json())
      .then(data => setSpec(data))
      .catch(err => console.error('Error loading API spec:', err))
  }, [])

  if (showSwagger && spec) {
    return (
      <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '20px'}}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              padding: '30px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px'}}>
                <div>
                  <h1 style={{fontSize: '2rem', fontWeight: '800', margin: '0 0 10px 0'}}>
                    Interactive API Documentation
                  </h1>
                  <p style={{opacity: 0.9, margin: 0}}>Test your endpoints directly in the browser</p>
                </div>
                <button 
                  onClick={() => setShowSwagger(false)}
                  className="hover:bg-white/30 transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  ← Back to Overview
                </button>
              </div>
            </div>
            <SwaggerUI 
              spec={spec}
              docExpansion="list"
              defaultModelsExpandDepth={2}
              tryItOutEnabled={true}
            />
          </div>
        </div>
      </div>
    )
  }

  if (!spec) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
        }}>
          <div className="animate-spin" style={{
            width: '60px',
            height: '60px',
            border: '4px solid #667eea',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            margin: '0 auto 20px'
          }}></div>
          <div style={{fontSize: '1.2rem', color: '#1f2937', fontWeight: '600'}}>
            Loading API Documentation...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      margin: 0,
      padding: 0,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '20px'}}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '30px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px'}}>
            <div style={{flex: 1}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px'}}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)'
                }}>
                  <svg width="30" height="30" fill="none" stroke="white" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h1 style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  margin: 0
                }}>
                  API Documentation
                </h1>
              </div>
              <p style={{
                fontSize: '1.2rem',
                color: '#6b7280',
                margin: '10px 0 0 0',
                maxWidth: '600px'
              }}>
                Interaktive API Dokumentation für das User Management System. 
                Teste alle Endpoints direkt in deinem Browser mit einer modernen, benutzerfreundlichen Oberfläche.
              </p>
            </div>
            <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
              <div style={{
                padding: '8px 16px',
                borderRadius: '25px',
                fontSize: '0.9rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: '#d1fae5',
                color: '#065f46'
              }}>
                ✓ Live API
              </div>
              <div style={{
                padding: '8px 16px',
                borderRadius: '25px',
                fontSize: '0.9rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: '#dbeafe',
                color: '#1e40af'
              }}>
                v1.0.0
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {[
            { icon: "✓", number: "4", label: "Endpoints", color: "#d1fae5", textColor: "#065f46" },
            { icon: "🔒", number: "JWT", label: "Authentication", color: "#dbeafe", textColor: "#1e40af" },
            { icon: "❤️", number: "REST", label: "API Standard", color: "#e9d5ff", textColor: "#7c3aed" },
            { icon: "⚡", number: "Fast", label: "Response Time", color: "#fed7aa", textColor: "#c2410c" }
          ].map((stat, index) => (
            <div key={index} className="hover:transform hover:-translate-y-2 transition-all duration-300" style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '15px',
              padding: '25px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: stat.color,
                  color: stat.textColor,
                  fontSize: '1.5rem'
                }}>
                  {stat.icon}
                </div>
                <div>
                  <p style={{fontSize: '2rem', fontWeight: '800', color: '#1f2937', margin: 0}}>
                    {stat.number}
                  </p>
                  <p style={{fontSize: '0.9rem', color: '#6b7280', margin: 0}}>
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Start */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            ⚡ Quick Start Guide
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {[
              { num: "1", title: "User registrieren", desc: "POST /auth/register - Erstelle einen neuen Benutzer", color: "#dbeafe", textColor: "#1e40af" },
              { num: "2", title: "Login & Token erhalten", desc: "POST /auth/login - Authentifizierung und JWT Token", color: "#d1fae5", textColor: "#065f46" },
              { num: "3", title: "Geschützte Routen nutzen", desc: "Bearer Token für authentifizierte Requests verwenden", color: "#e9d5ff", textColor: "#7c3aed" }
            ].map((step, index) => (
              <div key={index} style={{display: 'flex', alignItems: 'flex-start', gap: '15px'}}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '1.1rem',
                  flexShrink: 0,
                  background: step.color,
                  color: step.textColor
                }}>
                  {step.num}
                </div>
                <div>
                  <p style={{fontWeight: '600', color: '#1f2937', margin: '0 0 5px 0'}}>
                    {step.title}
                  </p>
                  <p style={{color: '#6b7280', fontSize: '0.9rem', margin: 0}}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Container */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{display: 'grid', gap: '20px'}}>
            {[
              { method: "POST", path: "/api/auth/register", desc: "Neuen Benutzer registrieren", methodColor: "#d1fae5", methodText: "#065f46" },
              { method: "POST", path: "/api/auth/login", desc: "Benutzer anmelden und JWT Token erhalten", methodColor: "#d1fae5", methodText: "#065f46" },
              { method: "GET", path: "/api/auth/me", desc: "Aktuelle Benutzerdaten abrufen (authentifiziert)", methodColor: "#dbeafe", methodText: "#1e40af" },
              { method: "GET", path: "/api/users", desc: "Alle Benutzer abrufen (authentifiziert)", methodColor: "#dbeafe", methodText: "#1e40af" }
            ].map((endpoint, index) => (
              <div key={index} className="hover:transform hover:-translate-y-1 transition-all duration-300" style={{
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                cursor: 'pointer'
              }}>
                <div style={{
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      background: endpoint.methodColor,
                      color: endpoint.methodText
                    }}>
                      {endpoint.method}
                    </span>
                    <div>
                      <div style={{
                        fontFamily: "'Monaco', 'Menlo', monospace",
                        fontWeight: '600',
                        color: '#1f2937'
                      }}>
                        {endpoint.path}
                      </div>
                      <div style={{color: '#6b7280', fontSize: '0.9rem'}}>
                        {endpoint.desc}
                      </div>
                    </div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      background: '#d1fae5',
                      color: '#065f46'
                    }}>
                      Ready
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{marginTop: '40px', textAlign: 'center'}}>
            <button 
              onClick={() => setShowSwagger(true)}
              className="hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1.1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              Öffne interaktive Swagger UI
            </button>
          </div>
        </div>
      </div>

      <div style={{textAlign: 'center', padding: '40px 20px', color: 'rgba(255, 255, 255, 0.8)'}}>
        <p>🚀 User Management API v1.0.0 - Powered by Next.js & Prisma</p>
      </div>
    </div>
  )
}