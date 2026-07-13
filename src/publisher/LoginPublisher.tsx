import React, { useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Mail, Lock, ArrowLeft } from "lucide-react"
import LogoImg from "@/utils/img/logo_propesq.png"

const STORAGE_KEY = "publisher_session"

type PublisherSession = {
  email: string
  role: "PUBLICADOR"
  loggedAt: string
}

export default function LoginPublisher() {
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // 1) tenta recuperar "from" (rota que o usuário tentou abrir antes do login)
  // 2) tenta recuperar "?redirect=/publisher/..."
  // 3) fallback: lista de notícias
  const redirectTo = useMemo(() => {
    const stateFrom =
      (location.state as any)?.from?.pathname ||
      (location.state as any)?.from ||
      ""

    const sp = new URLSearchParams(location.search)
    const queryRedirect = sp.get("redirect") || ""

    const candidate = queryRedirect || stateFrom || "/publisher/news"

    // segurança básica: só permite redirects internos do publisher
    if (candidate.startsWith("/publisher/")) return candidate
    return "/publisher/news"
  }, [location.state, location.search])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    setTimeout(() => {
      const emailOk = email.includes("@")
      const passwordOk = password.trim().length > 0

      if (emailOk && passwordOk) {
        const session: PublisherSession = {
          email,
          role: "PUBLICADOR",
          loggedAt: new Date().toISOString(),
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(session))

        navigate(redirectTo, { replace: true })
      } else {
        setError("Informe um e-mail válido e uma senha.")
      }

      setLoading(false)
    }, 600)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md">
        {/* Botão voltar */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"
          type="button"
        >
          <ArrowLeft size={16} />
          Voltar para o portal
        </button>

        {/* Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-200">
          {/* Título + Logo */}
          <div className="mb-6 text-center flex flex-col items-center">
            {/* Logo */}
            <img
              src={LogoImg}
              alt="Logo Propesq"
              className="h-20 w-auto mb-4 object-contain"
            />

            <h1 className="text-2xl font-bold text-slate-900">
              Painel de Publicações
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Acesso exclusivo para publicação de notícias
            </p>
          </div>


          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                E-mail
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="publicador@propesq.br"
                  className="
                    w-full pl-10 pr-3 py-2.5
                    border border-slate-300
                    rounded-xl
                    text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900
                  "
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="
                    w-full pl-10 pr-3 py-2.5
                    border border-slate-300
                    rounded-xl
                    text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900
                  "
                />
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full h-11
                bg-blue-900 text-white
                rounded-xl
                text-sm font-semibold
                transition-all duration-200
                hover:bg-blue-800
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {loading ? "Entrando..." : "Entrar no painel"}
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}
