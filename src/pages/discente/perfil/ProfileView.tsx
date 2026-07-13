import React from "react"
import { Helmet } from "react-helmet"

/* ================= MOCK ================= */

const perfil = {
  nome: "Mariana Martins",
  email: "mariana@academico.ufpb.br",
  cpf: "123.456.789-00",
  curriculoLattes: "http://lattes.cnpq.br/1234567890123456",
  matricula: "20230012345",
  curso: "Ciência de Dados e Inteligência Artificial",
  centro: "CI - Centro de Informática",
  telefone: "(83) 99999-9999",
}

const dadosBancarios = {
  banco: "Banco do Brasil",
  agencia: "1234-5",
  conta: "98765-4",
  tipo: "Conta Corrente",
}

/* ================= COMPONENTE ================= */

export default function ProfileView() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <Helmet>
        <title>Meu Perfil • PROPESQ</title>
      </Helmet>

      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <div className="space-y-6">
          {/* HEADER */}
          <header className="w-full rounded-2xl border border-neutral/30 bg-white px-6 py-6">
            <h1 className="text-2xl font-bold text-primary">Meu Perfil</h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral">
              Consulte seus dados pessoais, acadêmicos e bancários vinculados ao
              seu perfil.
            </p>
          </header>

          {/* DADOS GERAIS + BANCÁRIOS */}
          <section className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-neutral/30 bg-white p-6">
              <h2 className="mb-5 text-sm font-semibold text-primary">
                Dados pessoais e acadêmicos
              </h2>

              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div>
                  <div className="text-neutral">Nome</div>
                  <div className="mt-1 font-medium text-primary">
                    {perfil.nome}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">E-mail</div>
                  <div className="mt-1 font-medium text-primary">
                    {perfil.email}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">CPF</div>
                  <div className="mt-1 font-medium text-primary">
                    {perfil.cpf}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Telefone</div>
                  <div className="mt-1 font-medium text-primary">
                    {perfil.telefone}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Matrícula</div>
                  <div className="mt-1 font-medium text-primary">
                    {perfil.matricula}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Curso</div>
                  <div className="mt-1 font-medium text-primary">
                    {perfil.curso}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="text-neutral">Currículo Lattes</div>
                  <a
                    href={perfil.curriculoLattes}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block break-all font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {perfil.curriculoLattes}
                  </a>
                </div>

                <div className="sm:col-span-2">
                  <div className="text-neutral">Centro</div>
                  <div className="mt-1 font-medium text-primary">
                    {perfil.centro}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral/30 bg-white p-6">
              <h2 className="mb-5 text-sm font-semibold text-primary">
                Dados bancários
              </h2>

              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div>
                  <div className="text-neutral">Banco</div>
                  <div className="mt-1 font-medium text-primary">
                    {dadosBancarios.banco}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Tipo de conta</div>
                  <div className="mt-1 font-medium text-primary">
                    {dadosBancarios.tipo}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Agência</div>
                  <div className="mt-1 font-medium text-primary">
                    {dadosBancarios.agencia}
                  </div>
                </div>

                <div>
                  <div className="text-neutral">Conta</div>
                  <div className="mt-1 font-medium text-primary">
                    {dadosBancarios.conta}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}