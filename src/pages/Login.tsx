import React from 'react'
import { LoginForm } from '../components/auth/LoginForm'
import { Header } from '../components/layout/Header'

export function Login() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-12">
        <LoginForm />
      </div>
    </div>
  )
}