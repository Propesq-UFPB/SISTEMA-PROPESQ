import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet"
import { Loader2 } from "lucide-react"

import logo from "@/utils/img/logo_propesq.png"
import { useAuth, type Role } from "@/context/AuthContext"
import {
  authService,
  authStorage,
} from "@/features/auth/api/authService"
import { ApiError } from "@/services/apiClient"

type BackendRole =
  | "ALUNO"
  | "DISCENTE"
  | "COORDENADOR"
  | "GESTOR"
  | "ADMIN"
  | "ADMINISTRADOR"
  | string

function normalizeRole(role?: BackendRole): Role {
  const normalizedRole = role?.trim().toUpperCase()

  switch (normalizedRole) {
    case "ALUNO":
    case "DISCENTE":
      return "DISCENTE"

    case "COORDENADOR":
      return "COORDENADOR"

    case "ADMIN":
    case "ADMINISTRADOR":
      return "ADMINISTRADOR"
    
    case "GESTOR":
      return "GESTOR"

    default:
      return "DISCENTE"
  }
}

function destination(role: Role) {
  switch (role) {
    case "GESTOR":
    case "ADMINISTRADOR":
      return "/dashboard"

    case "COORDENADOR":
      return "/coordenador/projetos"

    case "DISCENTE":
    default:
      return "/discente/projetos"
  }
}

export default function Login() {
  const navigate = useNavigate()

  const {
    setAuthenticatedUser,
    loginMock,
  } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mockRole, setMockRole] = useState<Role>("DISCENTE")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const mockMode = import.meta.env.VITE_AUTH_MODE === "mock"

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)
    setError("")

    try {
      if (mockMode) {
        loginMock(email || "usuario@ufpb.br", mockRole)
        navigate(destination(mockRole), { replace: true })
        return
      }

      const response = await authService.login(email, password)

      const backendRole =
        response.user?.funcao

      const normalizedRole = normalizeRole(backendRole)

      const savedUser = authStorage.save(response)

      const authenticatedUser = {
        ...savedUser,
        role: normalizedRole,
      }

      localStorage.setItem(
        "auth_user",
        JSON.stringify(authenticatedUser),
      )

      setAuthenticatedUser(authenticatedUser)

      navigate(destination(normalizedRole), {
        replace: true,
      })
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Falha ao conectar com o servidor.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-light via-white to-primary/5 px-4">
      <Helmet>
        <title>Login • PROPESQ UFPB</title>
      </Helmet>

      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-neutral-light bg-white px-6 py-7 shadow-card"
      >
        <div className="mb-7 flex flex-col items-center gap-3 text-center">
          <img
            src={logo}
            alt="PROPESQ UFPB"
            className="h-10 w-auto"
          />

          <div>
            <h1 className="text-base font-bold text-primary">
              Acesso à Plataforma
            </h1>

            <p className="text-xs text-neutral">
              Entre com suas credenciais.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-primary">
            E-mail

            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-neutral/20 px-3 py-2.5 font-normal text-neutral outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              placeholder="seuemail@ufpb.br"
            />
          </label>

          <label className="block text-sm font-semibold text-primary">
            Senha

            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-neutral/20 px-3 py-2.5 font-normal text-neutral outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              placeholder="Digite sua senha"
            />
          </label>

          {mockMode && (
            <label className="block text-sm font-semibold text-primary">
              Perfil de teste

              <select
                value={mockRole}
                onChange={(event) =>
                  setMockRole(event.target.value as Role)
                }
                className="mt-2 w-full rounded-xl border border-neutral/20 bg-white px-3 py-2.5 font-normal text-neutral outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              >
                <option value="DISCENTE">
                  Discente
                </option>

                <option value="COORDENADOR">
                  Coordenador
                </option>

                <option value="ADMINISTRADOR">
                  Administrador
                </option>

                <option value="GESTOR">
                  Gestor
                </option>
              </select>
            </label>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <Loader2
                size={16}
                className="animate-spin"
              />
            )}

            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </form>
    </div>
  )
}
