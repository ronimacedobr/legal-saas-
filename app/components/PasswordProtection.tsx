'use client'

import { useState, useEffect } from 'react'

// Password can be set via environment variable NEXT_PUBLIC_APP_PASSWORD
// Default password: legal2024 (change this in production)
const PASSWORD = process.env.NEXT_PUBLIC_APP_PASSWORD || 'legal2024'
const STORAGE_KEY = 'legal_saas_authenticated'

export default function PasswordProtection({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const authenticated = sessionStorage.getItem(STORAGE_KEY) === 'true'
    setIsAuthenticated(authenticated)
    setIsLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true')
      setIsAuthenticated(true)
      setPassword('')
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#666666]">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-serif">
        <div className="w-full max-w-md px-6">
          <div className="bg-white border border-[#dbdad7] rounded-lg p-8 shadow-sm">
            <h1 className="text-2xl font-serif text-[#262626] mb-2">Protected Access</h1>
            <p className="text-[#666666] text-sm mb-6">Please enter the password to continue</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-2 border border-[#dbdad7] rounded focus:outline-none focus:border-[#262626] text-[#262626]"
                  autoFocus
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#262626] text-white py-2 px-4 rounded hover:bg-[#404040] transition-colors"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}


