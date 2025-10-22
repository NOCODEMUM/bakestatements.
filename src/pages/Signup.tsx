import React from 'react'
import { SignupForm } from '../components/auth/SignupForm'
import { Header } from '../components/layout/Header'

export function Signup() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-12">
        <SignupForm />
      </div>
    </div>
  )
}