import React from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import bgHero from "@/utils/img/bg1.png"

type ArchiveItem = {
  period: string
  title: string
  link?: string
  subitems?: {
    label: string
    link?: string
  }[]
}

const ARCHIVES: ArchiveItem[] = [
  {
    period: "2022–2023",
    title: "Vol. 29 · XXXI ENIC",
    link: "https://periodicos.ufpb.br/index.php/enic/issue/view/3307",
  },
  {
    period: "2021–2022",
    title: "Vol. 28 · XXX ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/serie-iniciados/iniciados-vol-28-2022-xxx-enic-2021-2022.pdf",
  },
  {
    period: "2020–2021",
    title: "Vol. 27 · XXIX ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/serie-iniciados/iniciados-vol-27-2021-xxix-enic-2020-2021.pdf",
  },
  {
    period: "2019–2020",
    title: "Vol. 26 · XXVIII ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/serie-iniciados/iniciados-vol-26-2020-xxviii-2019-2020.pdf",
  },
  {
    period: "2018–2019",
    title: "Vol. 25 · XXVII ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/serie-iniciados/iniciadosvol25.pdf",
  },
  {
    period: "2017–2018",
    title: "Vol. 24 · XXVI ENIC",
    link: "https://drive.google.com/file/d/1qMdl1gdAwDYndwko6FMtfiPEOqPmQbff/view",
  },
  {
    period: "2016–2017",
    title: "Vol. 23 · XXV ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/serie-iniciados/iniciados_vol23_2018_enic2017.pdf",
    subitems: [
      {
        label: "Revista Eletrônica",
        link: "https://viewer.joomag.com/s%C3%A9rie-iniciados-vol-23/0985563001533823944?short&",
      },
    ],
  },
  {
    period: "2012–2016",
    title: "Série Especial (Vols. 19, 20, 21, 22)",
    link: "#",
    subitems: [
      { label: "XXI, XXII, XXIII, XXIV ENIC", link: "#" },
    ],
  },
  {
    period: "2011–2012",
    title: "Vol. 18 · XX ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/serie-iniciados/iniciados_vol18_2013_enic2012.pdf",
  },
  {
    period: "2010–2011",
    title: "Vol. 17 · XIX ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/serie-iniciados/iniciados_vol17_xix_enic.pdf",
  },
  {
    period: "2009–2010",
    title: "Vol. 16 · XVIII ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/serie-iniciados/iniciados_vol16_xviii_enic.pdf",
  },
  {
    period: "2008–2009",
    title: "Vol. 15 · XVII ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/serie-iniciados/iniciados_vol15_xvii_enic.pdf",
  },
  {
    period: "2007–2008",
    title: "CD-ROM",
    link: "#",
  },
  {
    period: "2006–2007",
    title: "Vol. 13 · XV ENIC",
    link: "https://www.propesq.ufpb.br/propesq/contents/downloads/serie-iniciados/livros_iniciados_2008.pdf",
  },
]

const AwardedWorks: React.FC = () => {
  const navigate = useNavigate()

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

            {/* Topo */}
            <div className="mb-8">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-900 hover:underline underline-offset-4"
              >
                <ArrowLeft size={16} />
                Voltar
              </button>

              <h1 className="mt-4 text-3xl md:text-4xl font-semibold text-blue-900">
                Série Iniciados — Trabalhos premiados
              </h1>

              <div className="mt-4 h-[3px] w-16 bg-blue-900" />

              <p className="mt-6 max-w-3xl text-slate-700 leading-relaxed">
                Coletânea dos trabalhos premiados apresentados nos Encontros de
                Iniciação Científica (ENIC), publicados no âmbito da Série Iniciados.
              </p>

              <p className="mt-4 text-sm text-slate-600">
                Para mais informações, acesse o site oficial:{" "}
                <a
                  href="https://www.propesq.ufpb.br/enic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-900 font-semibold hover:underline underline-offset-4"
                >
                  www.propesq.ufpb.br/enic
                </a>
              </p>
            </div>

            {/* Arquivos */}
            <section aria-label="Arquivos">
              <h2 className="text-sm font-semibold tracking-widest text-slate-700 mb-4">
                ARQUIVOS
              </h2>

              <div className="overflow-hidden border border-slate-200">
                <table className="w-full border-collapse bg-white">
                  <thead>
                    <tr className="bg-slate-50 text-xs md:text-sm text-slate-600">
                      <th className="text-left px-6 py-3 font-medium border-r border-slate-200">
                        Vigência
                      </th>
                      <th className="text-left px-6 py-3 font-medium">
                        Série Iniciados
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {ARCHIVES.map((item, index) => (
                      <tr
                        key={index}
                        className="border-t border-slate-200 hover:bg-slate-50/60 transition"
                      >
                        <td className="px-6 py-5 font-medium text-blue-900 border-r border-slate-200 align-top whitespace-nowrap">
                          {item.period}
                        </td>

                        <td className="px-6 py-5">
                          <div className="space-y-2">
                            {item.link ? (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-blue-900 font-semibold hover:underline underline-offset-4"
                              >
                                {item.title}
                              </a>
                            ) : (
                              <span className="block font-semibold text-blue-900">
                                {item.title}
                              </span>
                            )}

                            {item.subitems && (
                              <div className="text-xs text-blue-900/80 space-y-1">
                                {item.subitems.map((sub, i) => (
                                  <a
                                    key={i}
                                    href={sub.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block hover:underline underline-offset-4"
                                  >
                                    {sub.label}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* Espaço inferior */}
      <div className="h-14" />
    </main>
  )
}

export default AwardedWorks
