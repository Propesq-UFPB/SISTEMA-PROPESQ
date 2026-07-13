import React from "react"
import { Instagram, Youtube } from "lucide-react"
import AnimateIn from "@/components/AnimateIn"

import EmecQR from "@/utils/img/e-mec-qr-branco-full.svg"
import FalaBr from "@/utils/img/falabr-branco.svg"
import GovLogo from "@/utils/img/gov.png"

const Contact: React.FC = () => {
  return (
    <section id="contact" className="w-full bg-[#123567] text-white py-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* ================== BLOCO SUPERIOR ================== */}
        <div className="flex flex-col md:flex-row justify-between gap-10">

          {/* ESQUERDA */}
          <div className="space-y-4 text-sm md:text-base">
            <div>
              <p className="font-semibold text-lg">
                Universidade Federal da Paraíba
              </p>
              <p>Campus I - Cidade Universitária - João Pessoa - PB - Brasil</p>
              <p>CEP: 58051-900</p>
            </div>

            <p>Telefone: +55 (83) 3216-7567</p>

            {/* Ícones sociais - AUMENTADOS */}
            <div className="flex items-center gap-6 pt-3">
              <a
                href="https://www.instagram.com/propesqufpb/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition"
              >
                <Instagram size={36} strokeWidth={1.5} />
              </a>

              <a
                href="https://www.youtube.com/@propesqufpb"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition"
              >
                <Youtube size={36} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* DIREITA — QR CODE */}
          <div className="border border-white/40 p-4 flex flex-col items-center text-center">
            <img src={EmecQR} alt="QR Code e-MEC UFPB" className="w-40" />
          </div>
        </div>

        {/* LINHA DIVISÓRIA */}
        <div className="border-t border-white/30 my-8" />

        {/* ================== BLOCO CENTRAL ================== */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm gap-6">

          <p>© 2026 Universidade Federal da Paraíba.</p>

          <div className="flex flex-wrap justify-center gap-5 text-center">
            <a href="https://www.ufpb.br/ouvidoria/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Ouvidoria
            </a>
            <a href="https://www.ufpb.br/acesso-a-informacao/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Acesso à Informação
            </a>
            <a href="https://www.ufpb.br/comu/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              CoMu
            </a>
            <a href="https://www.ufpb.br/cia/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Acessibilidade
            </a>
            <a href="https://dados.gov.br/dados/organizacoes/visualizar/universidade-federal-da-paraiba" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Dados Abertos UFPB
            </a>
            <a href="https://www.gov.br/mds/pt-br/pt-br/acesso-a-informacao/privacidade-e-protecao-de-dados" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Privacidade e Proteção de Dados
            </a>
          </div>
        </div>

        {/* ================== BLOCO INFERIOR ================== */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mt-10">

          {/* FalaBR + Acesso Informação */}
          <div className="flex items-center gap-6">
            <a href="https://falabr.cgu.gov.br/web/home" target="_blank" rel="noopener noreferrer">
              <img src={FalaBr} alt="FalaBR" className="h-10" />
            </a>

            <a
              href="https://www.gov.br/acessoainformacao/pt-br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
            >
              Acesso à Informação
            </a>
          </div>

          {/* Logo Governo */}
          <img
            src={GovLogo}
            alt="Governo do Brasil"
            className="h-14"
          />
        </div>

      </div>
    </section>
  )
}

export default Contact
