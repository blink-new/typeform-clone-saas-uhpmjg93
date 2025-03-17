import { useState } from 'react'
import { AuthProvider } from '@/contexts/auth-context'
import { SignupPage } from '@/pages/signup'

function App() {
  return (
    <AuthProvider>
      <SignupPage />
    </AuthProvider>
  )
}

export default App