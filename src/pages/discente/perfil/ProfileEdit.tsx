import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"

const INITIAL = {
  nome: "Mariana Martins",
  email: "mariana@academico.ufpb.br",
  telefone: "(83) 99999-9999",
  curriculoLattes: "http://lattes.cnpq.br/1234567890123456",
}

export default function ProfileEdit() {
  const [form, setForm] = useState(INITIAL)
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Editar Perfil • PROPESQ</title>
      </Helmet>

      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <div className="space-y-6">
          <header className="w-full rounded-2xl border border-neutral/30 bg-white px-6 py-6">
            <h1 className="text-2xl font-bold text-primary">Editar Perfil</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
              Atualize seus dados de contato e currículo Lattes. Dados acadêmicos
              oficiais são sincronizados pelo sistema institucional.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-neutral/30 bg-white p-6"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="text-neutral">Nome</span>
                <input
                  className="mt-1 w-full rounded-lg border border-neutral/30 px-3 py-2 text-primary"
                  value={form.nome}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, nome: e.target.value }))
                    setSaved(false)
                  }}
                />
              </label>

              <label className="block text-sm">
                <span className="text-neutral">E-mail</span>
                <input
                  type="email"
                  className="mt-1 w-full rounded-lg border border-neutral/30 px-3 py-2 text-primary"
                  value={form.email}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, email: e.target.value }))
                    setSaved(false)
                  }}
                />
              </label>

              <label className="block text-sm">
                <span className="text-neutral">Telefone</span>
                <input
                  className="mt-1 w-full rounded-lg border border-neutral/30 px-3 py-2 text-primary"
                  value={form.telefone}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, telefone: e.target.value }))
                    setSaved(false)
                  }}
                />
              </label>

              <label className="block text-sm sm:col-span-2">
                <span className="text-neutral">Currículo Lattes</span>
                <input
                  className="mt-1 w-full rounded-lg border border-neutral/30 px-3 py-2 text-primary"
                  value={form.curriculoLattes}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, curriculoLattes: e.target.value }))
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
                Salvar alterações
              </button>
              <Link
                to="/discente/perfil"
                className="rounded-lg border border-neutral/30 px-4 py-2 text-sm text-primary"
              >
                Voltar
              </Link>
              {saved && (
                <span className="text-sm text-primary">Alterações salvas (protótipo).</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
