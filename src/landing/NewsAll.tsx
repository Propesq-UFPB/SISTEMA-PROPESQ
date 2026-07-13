// src/pages/NewsAll.tsx
import React, { useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import AnimateIn from "@/components/AnimateIn"
import bgHero from "@/utils/img/bg1.png"
import { ArrowLeft } from "lucide-react"

type NewsItem = {
  title: string
  description?: string
  image: string
  tag: string // categoria
  date: string
  href?: string
}

const NEWS_DATA: NewsItem[] = [
  {
    title:
      "Propesq publica edital interno para cadastro e atualização de projetos de pesquisa",
    description:
      "Pesquisadores devem realizar atualização cadastral na nova plataforma institucional dentro do prazo estabelecido.",
    tag: "Editais",
    date: "20 de fevereiro de 2026",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&auto=format&fit=crop",
    href: "#",
  },
  {
    title:
      "Coordenação-Geral de Pesquisa apresenta novo fluxo de avaliação de projetos",
    description:
      "Mudança busca reduzir tempo de análise e padronizar critérios técnicos entre os avaliadores institucionais.",
    tag: "Gestão",
    date: "14 de fevereiro de 2026",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200&auto=format&fit=crop",
    href: "#",
  },
  {
    title:
      "Propesq abre período para submissão de relatórios anuais de projetos vigentes",
    description:
      "Coordenadores devem enviar relatório técnico e financeiro por meio do sistema até a data limite estabelecida.",
    tag: "Prazos",
    date: "5 de fevereiro de 2026",
    image:
      "https://images.unsplash.com/photo-1532619187608-e5375cab36aa?q=80&w=1200&auto=format&fit=crop",
    href: "#",
  },
  {
    title:
      "Propesq atualiza normas para acompanhamento de projetos externos",
    description:
      "Novas diretrizes estabelecem critérios para registro, execução e prestação de contas de projetos financiados.",
    tag: "Normativas",
    date: "22 de janeiro de 2026",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop",
    href: "#",
  },
  {
    title:
      "Relatório institucional aponta crescimento na captação de recursos para pesquisa",
    description:
      "Indicadores mostram aumento no número de projetos financiados por agências de fomento nacionais.",
    tag: "Institucional",
    date: "10 de janeiro de 2026",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
    href: "#",
  },
  {
    title:
      "Propesq implementa painel de indicadores para monitoramento estratégico",
    description:
      "Ferramenta permitirá acompanhamento em tempo real de projetos ativos, prazos e produção científica.",
    tag: "Inovação",
    date: "18 de dezembro de 2025",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    href: "#",
  },
  {
    title:
      "Manual de procedimentos para coordenadores de pesquisa é disponibilizado",
    description:
      "Documento orienta sobre cadastro, execução, prestação de contas e encerramento de projetos institucionais.",
    tag: "Orientações",
    date: "30 de novembro de 2025",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    href: "#",
  },
  {
    title:
      "Propesq promove oficina sobre elaboração de propostas para agências de fomento",
    description:
      "Evento abordou estratégias de submissão e critérios de avaliação utilizados pelas principais agências.",
    tag: "Eventos",
    date: "12 de novembro de 2025",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    href: "#",
  },
  {
    title:
      "Seminário de Gestão da Pesquisa reúne coordenadores de centros acadêmicos",
    description:
      "Encontro discutiu planejamento estratégico, metas institucionais e integração entre unidades.",
    tag: "Eventos",
    date: "Outubro de 2025",
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200&auto=format&fit=crop",
    href: "#",
  },
  {
    title:
      "Propesq realiza encontro técnico sobre prestação de contas e conformidade",
    description:
      "Capacitação orientou coordenadores quanto às exigências legais e procedimentos administrativos.",
    tag: "Eventos",
    date: "Setembro de 2025",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    href: "#",
  },
  {
    title:
      "Mostra Institucional de Projetos de Pesquisa apresenta resultados à comunidade",
    description:
      "Evento destacou impactos científicos e sociais das pesquisas desenvolvidas na universidade.",
    tag: "Eventos",
    date: "Agosto de 2025",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
    href: "#",
  },
  {
    title:
      "Propesq realiza semana de alinhamento estratégico para planejamento 2026",
    description:
      "Equipe técnica e coordenações discutiram metas, indicadores e otimização de processos internos.",
    tag: "Institucional",
    date: "Julho de 2025",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop",
    href: "#",
  },
]

const CATEGORY_ORDER = ["Processo Seletivo", "Institucional", "Eventos"]

function slugifyCategory(cat: string) {
  return cat
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
}

const NewsAll: React.FC = () => {
  const navigate = useNavigate()
  const grouped = useMemo(() => {
    const map = new Map<string, NewsItem[]>()
    for (const item of NEWS_DATA) {
      const arr = map.get(item.tag) ?? []
      arr.push(item)
      map.set(item.tag, arr)
    }
    // ordena por data 
    return map
  }, [])

  const categories = useMemo(() => {
    const existing = Array.from(grouped.keys())
    // mantém a ordem desejada e adiciona qualquer categoria nova no fim
    const ordered = [
      ...CATEGORY_ORDER.filter((c) => existing.includes(c)),
      ...existing.filter((c) => !CATEGORY_ORDER.includes(c)),
    ]
    return ordered
  }, [grouped])

  return (
    <main className="w-full">
      {/* HERO FUNDO + CAIXA BRANCA SOBREPOSTA */}
      <div
        className="w-full h-[320px] md:h-[380px] bg-cover bg-center"
        style={{ backgroundImage: `url(${bgHero})` }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 -mt-24 md:-mt-28 relative z-10">
        <div className="bg-white border border-slate-200 shadow-sm">
          <div className="px-6 md:px-10 py-8 md:py-10">

            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 mb-4 text-sm font-medium text-black hover:underline underline-offset-4">
                <ArrowLeft size={16} />
                    Voltar
            </button>

            {/* Seções por categoria */}
            <div className="space-y-12">
              {categories.map((cat, catIdx) => {
                const items = grouped.get(cat) ?? []
                const anchor = slugifyCategory(cat)

                return (
                  <section key={cat} id={anchor} className="scroll-mt-24">
                    {/* Título da categoria */}
                    <AnimateIn delay={catIdx * 60}>
                      <div className="flex items-end justify-between gap-6 mb-6">
                        <div>

                          <div className="h-[3px] w-16 bg-blue-900 mb-3" />
                          <Link
                            to={`/noticias/${anchor}`}
                            className="inline-flex items-center gap-2 text-2xl md:text-3xl font-semibold text-blue-900 hover:underline underline-offset-4"
                          >
                            {cat} <span aria-hidden>→</span>
                          </Link>
                        </div>
                      </div>
                    </AnimateIn>

                    {/* Grid de cards (4 por linha) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
                      {items.slice(0, 8).map((news, idx) => (
                        <AnimateIn key={`${cat}-${idx}`} delay={idx * 50}>
                          <article className="flex flex-col">
                            <a
                              href={news.href ?? "#"}
                              className="block overflow-hidden border border-slate-200"
                            >
                              <div className="w-full aspect-[4/3] bg-slate-100">
                                <img
                                  src={news.image}
                                  alt={news.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </a>

                            <div className="pt-4">
                              <a
                                href={news.href ?? "#"}
                                className="block font-semibold text-slate-900 leading-snug hover:underline underline-offset-4"
                              >
                                {news.title}
                              </a>

                              {news.description && (
                                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                                  {news.description}
                                </p>
                              )}

                              <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
                                {news.date}
                              </div>
                            </div>
                          </article>
                        </AnimateIn>
                      ))}
                    </div>

                    {/* "Mais {Categoria} →" (direita)*/}
                    <div className="mt-6 text-right">
                      <Link
                        to={`/noticias/${anchor}`}
                        className="text-blue-900 text-sm font-semibold hover:underline underline-offset-4"
                      >
                        Mais {cat} <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </section>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Espaço inferior (pra não “cortar” a sombra) */}
      <div className="h-14" />
    </main>
  )
}

export default NewsAll
