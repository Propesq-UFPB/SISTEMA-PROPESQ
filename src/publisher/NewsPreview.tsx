// src/publisher/NewsPreview.tsx
import React, { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, Pencil, ExternalLink } from "lucide-react"

type NewsStatus = "RASCUNHO" | "EM_REVISÃO" | "PUBLICADA" | "ARQUIVADA"

type NewsItem = {
  id: string
  title: string
  description?: string
  tag: string
  status: NewsStatus
  createdAt: string // ISO
  updatedAt?: string // ISO
  publishAt?: string // ISO
  author?: string
  coverUrl?: string
  content?: string
  slug: string
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: "n1",
    title: "PET Ciência da Computação abre seleção para novos estudantes bolsistas e voluntários",
    description:
      "Inscrições ocorrem de 3 a 12 de fevereiro de 2026; processo seletivo oferece 7 vagas no total.",
    tag: "Processo Seletivo",
    status: "PUBLICADA",
    createdAt: "2026-01-27T10:30:00.000Z",
    updatedAt: "2026-01-28T12:12:00.000Z",
    publishAt: "2026-01-27T12:00:00.000Z",
    author: "Equipe PROPESQ",
    slug: "pet-ciencia-da-computacao-abre-selecao-para-novos-estudantes",
    coverUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop",
    content:
      "Conteúdo exemplo.\n\nAqui você vai colocar o corpo completo da notícia.\n\n• Item 1\n• Item 2\n\nAcesse o edital e confira prazos e requisitos.",
  },
  {
    id: "n2",
    title: "LAVID abre seleções para pesquisadores e estudantes bolsistas no projeto VLibras",
    description:
      "Oportunidades para atuação em pesquisa e desenvolvimento com foco em acessibilidade e Libras.",
    tag: "Processo Seletivo",
    status: "EM_REVISÃO",
    createdAt: "2026-01-15T14:00:00.000Z",
    updatedAt: "2026-01-16T09:45:00.000Z",
    author: "Comunicação",
    slug: "lavid-abre-selecoes-para-pesquisadores-e-estudantes-vlibras",
    content:
      "Texto em revisão.\n\nAdicione informações do edital, requisitos e prazos.\n\nInclua links e contatos.",
  },
  {
    id: "n3",
    title: "PROPESQ divulga orientações para submissão de relatórios de IC 2025",
    description:
      "Confira o passo a passo e prazos para envio dos relatórios parciais e finais.",
    tag: "Comunicado",
    status: "RASCUNHO",
    createdAt: "2026-02-05T09:10:00.000Z",
    author: "Secretaria",
    slug: "propesq-divulga-orientacoes-para-submissao-de-relatorios-ic-2025",
    content:
      "Rascunho inicial.\n\nInclua datas, links e contato.\n\n—\nPROPESQ/UFPB",
  },
  {
    id: "n4",
    title: "Resultado preliminar: bolsas de iniciação científica 2026",
    description:
      "Lista preliminar disponível para consulta; período de recursos aberto conforme edital.",
    tag: "Resultado",
    status: "ARQUIVADA",
    createdAt: "2025-12-18T11:25:00.000Z",
    publishAt: "2025-12-19T12:00:00.000Z",
    author: "Coordenação",
    slug: "resultado-preliminar-bolsas-iniciacao-cientifica-2026",
    content:
      "Conteúdo arquivado.\n\nMotivo: substituído por publicação final.",
  },
]

function formatDateBR(iso?: string) {
  if (!iso) return "—"
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const yy = d.getFullYear()
  return `${dd}/${mm}/${yy}`
}

function readingTime(text: string) {
  const words = text
    .replace(/\n/g, " ")
    .split(" ")
    .map((w) => w.trim())
    .filter(Boolean).length
  const mins = Math.max(1, Math.round(words / 180))
  return `${mins} min de leitura`
}

function statusLabel(status: NewsStatus) {
  if (status === "EM_REVISÃO") return "EM REVISÃO"
  return status
}

function statusPill(status: NewsStatus) {
  const base =
    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border"
  switch (status) {
    case "PUBLICADA":
      return `${base} bg-emerald-50 text-emerald-800 border-emerald-200`
    case "EM_REVISÃO":
      return `${base} bg-amber-50 text-amber-900 border-amber-200`
    case "RASCUNHO":
      return `${base} bg-slate-50 text-slate-700 border-slate-200`
    case "ARQUIVADA":
      return `${base} bg-rose-50 text-rose-800 border-rose-200`
    default:
      return `${base} bg-slate-50 text-slate-700 border-slate-200`
  }
}

function renderTextAsParagraphs(content?: string) {
  const safe = (content ?? "").trim()
  if (!safe) return <p className="text-slate-600">Sem conteúdo.</p>

  const blocks = safe
    .split(/\n{2,}/g)
    .map((b) => b.trim())
    .filter(Boolean)

  return (
    <div className="space-y-4 text-slate-800 leading-relaxed">
      {blocks.map((b, idx) => {
        // lista simples por bullets “• ”
        if (b.includes("\n• ") || b.startsWith("• ")) {
          const lines = b
            .split("\n")
            .map((x) => x.trim())
            .filter(Boolean)
          return (
            <ul key={idx} className="list-disc pl-6 space-y-1">
              {lines.map((l, i) => (
                <li key={i}>{l.replace(/^•\s*/, "")}</li>
              ))}
            </ul>
          )
        }

        // fallback parágrafo
        return (
          <p key={idx} className="whitespace-pre-wrap">
            {b}
          </p>
        )
      })}
    </div>
  )
}

export default function NewsPreview() {
  const { id } = useParams<{ id: string }>()
  const [notFound] = useState(false) // mantido simples

  const item = useMemo(() => MOCK_NEWS.find((n) => n.id === id), [id])

  if (notFound || !item) {
    return (
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-12">
        <h1 className="text-2xl font-bold text-slate-900">Prévia indisponível</h1>
        <p className="text-sm text-slate-600 mt-2">
          Não encontramos a notícia solicitada (ID: <span className="font-semibold">{id}</span>).
        </p>
        <div className="mt-6">
          <Link
            to="/publisher/news"
            className="
              inline-flex items-center gap-2
              h-11 px-4 rounded-xl
              bg-blue-900 text-white text-sm font-semibold
              hover:bg-blue-800 transition-colors
            "
          >
            <ArrowLeft size={18} />
            Voltar para lista
          </Link>
        </div>
      </div>
    )
  }

  const metaDate = item.publishAt ?? item.createdAt
  const read = readingTime(item.content ?? "")

  return (
    <div className="w-full">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex flex-col gap-4">
          {/* Botão voltar */}
          <Link
            to="/publisher/news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 w-fit"
          >
            <ArrowLeft size={18} />
            Voltar
          </Link>

          {/* Linha título + ações */}
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            {/* Título */}
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-slate-900 truncate">
                Pré-visualização
              </h1>
              <p className="text-sm text-slate-600 mt-1 truncate">
                Veja como a notícia pode aparecer no portal.
              </p>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2 flex-wrap md:justify-end">
              <span className={statusPill(item.status)}>
                {statusLabel(item.status)}
              </span>

              <Link
                to={`/publisher/news/${item.id}/edit`}
                className="
                  inline-flex items-center gap-2
                  h-11 px-4 rounded-xl
                  border border-slate-300 bg-white
                  text-sm font-semibold text-slate-900
                  hover:bg-slate-50 transition-colors
                "
                title="Voltar para editar"
              >
                <Pencil size={18} />
                Editar
              </Link>

              <Link
                to={`/news/${item.slug}`}
                className="
                  inline-flex items-center gap-2
                  h-11 px-4 rounded-xl
                  border border-blue-900 bg-blue-900
                  text-sm font-semibold text-white
                  hover:bg-blue-800 transition-colors
                "
                title="Abrir no portal público"
              >
                <ExternalLink size={18} />
                Abrir no portal
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* “Portal-like” layout */}
      <main className="max-w-4xl mx-auto px-6 pt-6 pb-12">
        {/* Cover */}
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="bg-slate-100">
            {item.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.coverUrl} alt={item.title} className="w-full h-[320px] object-cover" />
            ) : (
              <div className="w-full h-[320px] flex items-center justify-center text-slate-500">
                Sem imagem de capa
              </div>
            )}
          </div>

          {/* Content */}
          <article className="p-6 md:p-10">
            {/* Tag + date */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {item.tag}
              </span>

              <span className="text-xs text-slate-500">
                {formatDateBR(metaDate)} • {read}
              </span>
            </div>

            {/* Title */}
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              {item.title}
            </h2>

            {/* Description */}
            {item.description && (
              <p className="mt-4 text-base md:text-lg text-slate-600 leading-relaxed">
                {item.description}
              </p>
            )}

            {/* Author */}
            {item.author && (
              <div className="mt-5 text-sm text-slate-500">
                Por <span className="font-semibold text-slate-700">{item.author}</span>
              </div>
            )}

            <div className="mt-8 h-px bg-slate-200" />

            {/* Body */}
            <div className="mt-8">{renderTextAsParagraphs(item.content)}</div>
          </article>
        </div>

      </main>
    </div>
  )
}
