import React from "react"
import AnimateIn from "@/components/AnimateIn"
import bgImage from "@/utils/img/bg1.png"

type NewsItem = {
  title: string
  description?: string
  image: string
  tag: string
  date: string
  href?: string
}

const NEWS_DATA: NewsItem[] = [
  {
    title:
      "Propesq realiza reunião estratégica para planejamento das ações de pesquisa em 2026",
    description:
      "Encontro reuniu coordenações e diretores de centro para alinhar metas, indicadores e prioridades institucionais.",
    tag: "Gestão",
    date: "18 de fevereiro de 2026",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200&auto=format&fit=crop",
    href: "#",
  },
  {
    title:
      "Coordenação-Geral de Pesquisa divulga novo fluxo para submissão de projetos institucionais",
    description:
      "Atualização visa otimizar análise documental e reduzir o tempo médio de tramitação interna.",
    tag: "Normativas",
    date: "10 de fevereiro de 2026",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
    href: "#",
  },
  {
    title:
      "Propesq apresenta relatório anual de desempenho da pesquisa na UFPB",
    description:
      "Documento destaca crescimento no número de projetos cadastrados e ampliação da captação de recursos externos.",
    tag: "Institucional",
    date: "02 de fevereiro de 2026",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    href: "#",
  },
  {
    title:
      "Nova plataforma digital da Propesq integra cadastro, acompanhamento e avaliação de projetos",
    description:
      "Sistema permitirá maior transparência nos processos e acompanhamento em tempo real pelos pesquisadores.",
    tag: "Inovação",
    date: "25 de janeiro de 2026",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
    href: "#",
  },
  {
    title:
      "Propesq reforça diretrizes para prestação de contas de projetos financiados",
    description:
      "Medida busca padronizar procedimentos e garantir conformidade com exigências das agências de fomento.",
    tag: "Gestão",
    date: "12 de janeiro de 2026",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&auto=format&fit=crop",
    href: "#",
  },
]

const News: React.FC = () => {
  const mainNews = NEWS_DATA[0]
  const secondaryNews = NEWS_DATA.slice(1)

  return (
    <section id="news" className="w-full relative">

      {/*IMAGEM DE FUNDO */}
      <div
        className="w-full h-[450px] md:h-[420px] bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* BLOCO BRANCO SOBREPOSTO */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 -mt-32 md:-mt-40">
        <div className="bg-white shadow-lg border border-slate-200 p-8 md:p-10">

          {/* Título */}
          <AnimateIn>
            <div className="mb-8">
              <div className="h-[3px] w-14 bg-blue-800 mb-3" />
              <h2 className="text-xl md:text-2xl font-semibold text-blue-900">
                Notícias
              </h2>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

            {/* Destaque */}
            <AnimateIn>
              <article className="border border-slate-200 flex flex-col group relative h-full">

                <span className="absolute left-0 top-0 h-full w-[3px] bg-blue-800 origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100" />

                <div className="w-full aspect-[4/3] overflow-hidden">
                  <img
                    src={mainNews.image}
                    alt={mainNews.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <p className="text-[11px] text-blue-800 font-medium mb-2">
                    {mainNews.tag}
                  </p>

                  <a
                    href={mainNews.href ?? "#"}
                    className="text-base md:text-lg font-semibold text-slate-900 leading-snug"
                  >
                    {mainNews.title}
                  </a>

                  {mainNews.description && (
                    <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                      {mainNews.description}
                    </p>
                  )}

                  <div className="flex-1" />

                  <p className="mt-3 text-xs text-slate-500">
                    {mainNews.date}
                  </p>
                </div>
              </article>
            </AnimateIn>

            {/* Grid secundário */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {secondaryNews.map((news, index) => (
                <AnimateIn key={index} delay={index * 70}>
                  <article className="border border-slate-200 flex flex-col group relative h-full">

                    <span className="absolute left-0 top-0 h-full w-[3px] bg-blue-800 origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100" />

                    <div className="w-full aspect-[16/9] overflow-hidden">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-[10px] text-blue-800 font-medium mb-1">
                        {news.tag}
                      </p>

                      <a
                        href={news.href ?? "#"}
                        className="text-sm font-semibold text-slate-900 leading-snug"
                      >
                        {news.title}
                      </a>

                      <div className="flex-1" />

                      <p className="mt-2 text-xs text-slate-500">
                        {news.date}
                      </p>
                    </div>
                  </article>
                </AnimateIn>
              ))}
            </div>
          </div>

          {/* Link */}
          <div className="mt-10 text-right">
            <a
              href="/noticias"
              className="text-blue-900 text-sm font-medium hover:underline"
            >
              Mais Notícias →
            </a>
          </div>

        </div>
      </div>

    </section>
  )
}

export default News
