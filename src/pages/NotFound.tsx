import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="text-center space-y-3">
        <div className="text-4xl font-bold text-ufpb-blue">404</div>
        <p>Página não encontrada</p>
        <Link to="/" className="btn btn-primary">Voltar</Link>
      </div>
    </div>
  )
}
