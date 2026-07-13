// não estamos usando

import React, { useMemo, useState } from "react"
import { Helmet } from "react-helmet"
import Card from "@/components/Card"
import {
  Save,
  Bell,
  ShieldCheck,
  UserRound,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Settings2,
  CheckCircle2,
} from "lucide-react"

type SettingsForm = {
  nome: string
  email: string
  matricula: string
  curso: string
  receberEmailEditais: boolean
  receberEmailRelatorios: boolean
  receberEmailEnic: boolean
  receberNotificacaoSistema: boolean
  receberNotificacaoProjetos: boolean
  perfilVisivelParaOrientadores: boolean
  exibirHistoricoAcademico: boolean
  idiomaSistema: string
  temaPreferido: string
}

const INITIAL_FORM: SettingsForm = {
  nome: "Mariana Martins",
  email: "mariana@academico.ufpb.br",
  matricula: "20230012345",
  curso: "Ciência de Dados e Inteligência Artificial",
  receberEmailEditais: true,
  receberEmailRelatorios: true,
  receberEmailEnic: true,
  receberNotificacaoSistema: true,
  receberNotificacaoProjetos: true,
  perfilVisivelParaOrientadores: true,
  exibirHistoricoAcademico: false,
  idiomaSistema: "pt-BR",
  temaPreferido: "claro",
}

export default function DisSettings() {
  const [form, setForm] = useState<SettingsForm>(INITIAL_FORM)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const completion = useMemo(() => {
    const fields = [form.nome, form.email, form.matricula, form.curso]
    const filled = fields.filter((value) => value.trim().length > 0).length
    return Math.round((filled / fields.length) * 100)
  }, [form])

  function updateField<K extends keyof SettingsForm>(
    field: K,
    value: SettingsForm[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)

    setTimeout(() => {
      setSaving(false)
      setSaved(true)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Configurações • PROPESQ</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">
        {/* HEADER */}
        <header>
          <h1 className="text-2xl font-bold text-primary">
            Configurações do Discente
          </h1>
          <p className="mt-1 text-base text-neutral">
            Gerencie suas preferências de conta, notificações e privacidade no sistema.
          </p>
        </header>

        {/* RESUMO */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <UserRound size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Perfil</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {form.nome}
                </div>
                <div className="mt-1 text-xs text-neutral">
                  {form.curso}
                </div>
              </div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <Settings2 size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Completude</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {completion}%
                </div>
                <div className="mt-1 text-xs text-neutral">
                  Dados básicos preenchidos
                </div>
              </div>
            </div>
          </Card>

          <Card
            title=""
            className="bg-white border border-neutral/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} className="text-primary" />
              <div>
                <div className="text-sm text-neutral">Privacidade</div>
                <div className="mt-1 text-sm font-semibold text-primary">
                  {form.perfilVisivelParaOrientadores ? "Visível" : "Restrita"}
                </div>
                <div className="mt-1 text-xs text-neutral">
                  Configuração atual do perfil
                </div>
              </div>
            </div>
          </Card>
        </section>

        <form onSubmit={handleSave} className="space-y-5">
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2 space-y-5">
              {/* DADOS DA CONTA */}
              <Card
                title={
                  <h2 className="text-sm font-semibold text-primary">
                    Dados da conta
                  </h2>
                }
                className="bg-white border border-neutral/30 rounded-2xl p-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Nome
                    </label>
                    <input
                      type="text"
                      value={form.nome}
                      onChange={(e) => updateField("nome", e.target.value)}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary
                      "
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary
                      "
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Matrícula
                    </label>
                    <input
                      type="text"
                      value={form.matricula}
                      onChange={(e) => updateField("matricula", e.target.value)}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary
                      "
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Curso
                    </label>
                    <input
                      type="text"
                      value={form.curso}
                      onChange={(e) => updateField("curso", e.target.value)}
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary
                      "
                    />
                  </div>
                </div>
              </Card>

              {/* NOTIFICAÇÕES */}
              <Card
                title={
                  <h2 className="text-sm font-semibold text-primary">
                    Preferências de notificações
                  </h2>
                }
                className="bg-white border border-neutral/30 rounded-2xl p-8"
              >
                <div className="space-y-4">
                  <label className="flex items-start gap-3 text-sm text-primary">
                    <input
                      type="checkbox"
                      checked={form.receberEmailEditais}
                      onChange={(e) =>
                        updateField("receberEmailEditais", e.target.checked)
                      }
                      className="mt-1 h-4 w-4 rounded border-neutral/40"
                    />
                    <span>Receber notificações por e-mail sobre editais</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm text-primary">
                    <input
                      type="checkbox"
                      checked={form.receberEmailRelatorios}
                      onChange={(e) =>
                        updateField("receberEmailRelatorios", e.target.checked)
                      }
                      className="mt-1 h-4 w-4 rounded border-neutral/40"
                    />
                    <span>Receber avisos sobre relatórios e prazos</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm text-primary">
                    <input
                      type="checkbox"
                      checked={form.receberEmailEnic}
                      onChange={(e) =>
                        updateField("receberEmailEnic", e.target.checked)
                      }
                      className="mt-1 h-4 w-4 rounded border-neutral/40"
                    />
                    <span>Receber comunicações relacionadas ao ENIC</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm text-primary">
                    <input
                      type="checkbox"
                      checked={form.receberNotificacaoSistema}
                      onChange={(e) =>
                        updateField("receberNotificacaoSistema", e.target.checked)
                      }
                      className="mt-1 h-4 w-4 rounded border-neutral/40"
                    />
                    <span>Receber notificações gerais do sistema</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm text-primary">
                    <input
                      type="checkbox"
                      checked={form.receberNotificacaoProjetos}
                      onChange={(e) =>
                        updateField("receberNotificacaoProjetos", e.target.checked)
                      }
                      className="mt-1 h-4 w-4 rounded border-neutral/40"
                    />
                    <span>Receber atualizações relacionadas a projetos e vínculos</span>
                  </label>
                </div>
              </Card>

              {/* PRIVACIDADE */}
              <Card
                title={
                  <h2 className="text-sm font-semibold text-primary">
                    Privacidade e visualização
                  </h2>
                }
                className="bg-white border border-neutral/30 rounded-2xl p-8"
              >
                <div className="space-y-4">
                  <label className="flex items-start gap-3 text-sm text-primary">
                    <input
                      type="checkbox"
                      checked={form.perfilVisivelParaOrientadores}
                      onChange={(e) =>
                        updateField("perfilVisivelParaOrientadores", e.target.checked)
                      }
                      className="mt-1 h-4 w-4 rounded border-neutral/40"
                    />
                    <span>Permitir visualização do meu perfil por orientadores</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm text-primary">
                    <input
                      type="checkbox"
                      checked={form.exibirHistoricoAcademico}
                      onChange={(e) =>
                        updateField("exibirHistoricoAcademico", e.target.checked)
                      }
                      className="mt-1 h-4 w-4 rounded border-neutral/40"
                    />
                    <span>Exibir histórico acadêmico em contextos institucionais autorizados</span>
                  </label>
                </div>
              </Card>

              {/* PREFERÊNCIAS */}
              <Card
                title={
                  <h2 className="text-sm font-semibold text-primary">
                    Preferências do sistema
                  </h2>
                }
                className="bg-white border border-neutral/30 rounded-2xl p-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Idioma
                    </label>
                    <select
                      value={form.idiomaSistema}
                      onChange={(e) =>
                        updateField("idiomaSistema", e.target.value)
                      }
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary
                      "
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Tema preferido
                    </label>
                    <select
                      value={form.temaPreferido}
                      onChange={(e) =>
                        updateField("temaPreferido", e.target.value)
                      }
                      className="
                        w-full rounded-xl border border-neutral/30 bg-white
                        px-4 py-3 text-sm text-primary outline-none
                        focus:border-primary
                      "
                    >
                      <option value="claro">Claro</option>
                      <option value="escuro">Escuro</option>
                      <option value="sistema">Seguir sistema</option>
                    </select>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-5">
              {/* RESUMO */}
              <Card
                title={
                  <h2 className="text-sm font-semibold text-primary">
                    Resumo das preferências
                  </h2>
                }
                className="bg-white border border-neutral/30 rounded-2xl p-8"
              >
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Bell size={16} className="mt-0.5 text-primary" />
                    <span className="text-neutral">
                      Notificações por e-mail:{" "}
                      <span className="font-medium text-primary">
                        {form.receberEmailEditais ||
                        form.receberEmailRelatorios ||
                        form.receberEmailEnic
                          ? "Ativas"
                          : "Desativadas"}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail size={16} className="mt-0.5 text-primary" />
                    <span className="text-neutral">
                      Notificações do sistema:{" "}
                      <span className="font-medium text-primary">
                        {form.receberNotificacaoSistema ? "Ativas" : "Desativadas"}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    {form.perfilVisivelParaOrientadores ? (
                      <Eye size={16} className="mt-0.5 text-primary" />
                    ) : (
                      <EyeOff size={16} className="mt-0.5 text-primary" />
                    )}
                    <span className="text-neutral">
                      Visibilidade do perfil:{" "}
                      <span className="font-medium text-primary">
                        {form.perfilVisivelParaOrientadores ? "Permitida" : "Restrita"}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <Smartphone size={16} className="mt-0.5 text-primary" />
                    <span className="text-neutral">
                      Tema:{" "}
                      <span className="font-medium text-primary">
                        {form.temaPreferido === "claro"
                          ? "Claro"
                          : form.temaPreferido === "escuro"
                          ? "Escuro"
                          : "Seguir sistema"}
                      </span>
                    </span>
                  </div>
                </div>
              </Card>

              {/* STATUS DE SALVAMENTO */}
              <Card
                title={
                  <h2 className="text-sm font-semibold text-primary">
                    Salvar alterações
                  </h2>
                }
                className="bg-white border border-neutral/30 rounded-2xl p-8"
              >
                <div className="space-y-4">
                  {saved && (
                    <div className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success font-medium">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} />
                        Configurações salvas com sucesso.
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={saving}
                    className="
                      w-full inline-flex items-center justify-center gap-2
                      rounded-xl bg-primary px-4 py-3
                      text-sm font-semibold text-white
                      hover:opacity-90 transition disabled:opacity-60
                    "
                  >
                    <Save size={16} />
                    {saving ? "Salvando..." : "Salvar configurações"}
                  </button>
                </div>
              </Card>
            </div>
          </section>
        </form>
      </div>
    </div>
  )
}
