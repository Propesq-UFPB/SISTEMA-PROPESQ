import React from "react"

type SystemItem = {
  title: string
  keyword: string
  description: string
  link: string
}

const SYSTEMS: SystemItem[] = [
  {
    title: "SIGPRPG",
    keyword: "Gestão",
    description: "Sistema institucional de pós-graduação e pesquisa.",
    link: "http://150.165.209.3/sigprpg/login/",
  },
  {
    title: "Validação de Documentos",
    keyword: "Autenticidade",
    description: "Verificação de documentos acadêmicos oficiais.",
    link: "http://150.165.209.3/sigprpg/login/",
  },
  {
    title: "Bases de Pesquisa",
    keyword: "Conhecimento",
    description: "Portais e bases científicas da UFPB.",
    link: "https://www.biblioteca.ufpb.br/biblioteca/contents/menu/copy_of_servicos/copy_of_portais-de-pesquisa-e-bases-de-dados",
  },
]

const Systems: React.FC = () => {
  return (
    <section
      id="systems"
      className="w-full bg-primary/5 py-12 md:py-14"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Faixa */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Texto curto */}
          <div className="max-w-xl">
            <h2 className="text-sm md:text-2xl font-bold text-primary">
              Sistemas institucionais
            </h2>

            <p className="mt-2 text-sm md:text-base text-neutral">
              Acesso rápido aos principais sistemas e bases de apoio à pesquisa.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:max-w-3xl">
            {SYSTEMS.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group
                  rounded-xl bg-white
                  border-2 border-primary
                  px-5 py-4
                  transition-all duration-300
                  hover:bg-primary
                "
              >
                <span className="block text-[10px] uppercase tracking-widest text-neutral group-hover:text-white/80">
                  {item.keyword}
                </span>

                <h3 className="mt-1 text-sm md:text-base font-semibold text-primary group-hover:text-white">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs text-neutral group-hover:text-white/90">
                  {item.description}
                </p>

                <span className="mt-2 inline-block text-xs font-semibold text-primary group-hover:text-white">
                  Acessar →
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Systems
