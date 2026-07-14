import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"

const INITIAL = {
  banco: "Banco do Brasil",
  agencia: "1234-5",
  conta: "98765-4",
  tipo: "Conta Corrente",
}

export default function BankDataForm() {
  const [form, setForm] = useState(INITIAL)
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Dados Bancários • PROPESQ</title>
      </Helmet>

      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <div className="space-y-6">
          <header className="w-full rounded-2xl border border-neutral/30 bg-white px-6 py-6">
            <h1 className="text-2xl font-bold text-primary">Dados Bancários</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
              Informe a conta para recebimento de bolsas. Os dados ficam vinculados
              ao seu perfil de discente.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-neutral/30 bg-white p-6"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="text-neutral">Banco</span>
                <input
                  className="mt-1 w-full rounded-lg border border-neutral/30 px-3 py-2 text-primary"
                  value={form.banco}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, banco: e.target.value }))
                    setSaved(false)
                  }}
                />
              </label>

              <label className="block text-sm">
                <span className="text-neutral">Tipo de conta</span>
                <select
                  className="mt-1 w-full rounded-lg border border-neutral/30 px-3 py-2 text-primary"
                  value={form.tipo}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, tipo: e.target.value }))
                    setSaved(false)
                  }}
                >
                  <option>Conta Corrente</option>
                  <option>Conta Poupança</option>
                </select>
              </label>

              <label className="block text-sm">
                <span className="text-neutral">Agência</span>
                <input
                  className="mt-1 w-full rounded-lg border border-neutral/30 px-3 py-2 text-primary"
                  value={form.agencia}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, agencia: e.target.value }))
                    setSaved(false)
                  }}
                />
              </label>

              <label className="block text-sm">
                <span className="text-neutral">Conta</span>
                <input
                  className="mt-1 w-full rounded-lg border border-neutral/30 px-3 py-2 text-primary"
                  value={form.conta}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, conta: e.target.value }))
                    setSaved(false)
                  }}
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
              >
                Salvar dados bancários
              </button>
              <Link
                to="/discente/perfil"
                className="rounded-lg border border-neutral/30 px-4 py-2 text-sm text-primary"
              >
                Voltar
              </Link>
              {saved && (
                <span className="text-sm text-primary">Dados salvos (protótipo).</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
