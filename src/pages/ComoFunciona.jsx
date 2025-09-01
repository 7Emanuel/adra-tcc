import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';

export default function ComoFunciona() {
  const passosDoacaoTransferencia = [
    {
      numero: 1,
      titulo: "Você faz a doação",
      descricao: "Escolhe o valor e faz a transferência via PIX ou depósito bancário.",
      icone: "💰"
    },
    {
      numero: 2,
      titulo: "Enviamos confirmação",
      descricao: "Recebe confirmação por e-mail e recibo fiscal em até 5 dias úteis.",
      icone: "📧"
    },
    {
      numero: 3,
      titulo: "Compramos mantimentos",
      descricao: "Usamos 100% da doação para comprar alimentos e itens essenciais.",
      icone: "🛒"
    },
    {
      numero: 4,
      titulo: "Distribuímos às famílias",
      descricao: "Entregamos diretamente às famílias cadastradas e verificadas.",
      icone: "❤️"
    }
  ];

  const passosItens = [
    {
      numero: 1,
      titulo: "Separe os itens",
      descricao: "Verifique nossa lista de itens aceitos e separe suas doações.",
      icone: "📦"
    },
    {
      numero: 2,
      titulo: "Encontre uma unidade",
      descricao: "Use nosso mapa para localizar a unidade ADRA mais próxima.",
      icone: "📍"
    },
    {
      numero: 3,
      titulo: "Entregue ou agende coleta",
      descricao: "Leve pessoalmente ou ligue para agendar nossa coleta gratuita.",
      icone: "🚚"
    },
    {
      numero: 4,
      titulo: "Triagem e distribuição",
      descricao: "Organizamos e distribuímos seus itens para quem mais precisa.",
      icone: "✅"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header da Página */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Como Funciona a Doação
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Entenda como suas doações chegam até as famílias que mais precisam com total transparência e eficiência.
            </p>
          </div>

          {/* Missão e Transparência */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossa Missão</h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                A ADRA (Agência de Desenvolvimento e Recursos Assistenciais) existe para servir a humanidade, 
                especialmente os mais necessitados, independente de idade, etnia, gênero ou crenças religiosas. 
                Trabalhamos para um mundo onde todas as pessoas possam viver com dignidade e esperança.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Transparência Total</h3>
                <p className="text-gray-600">
                  Todos os recursos são rastreados e relatórios detalhados são enviados aos doadores.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Impacto Direto</h3>
                <p className="text-gray-600">
                  95% dos recursos vão diretamente para os programas assistenciais.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Rede Global</h3>
                <p className="text-gray-600">
                  Presente em mais de 120 países com 80 anos de experiência humanitária.
                </p>
              </div>
            </div>
          </div>

          {/* Fluxo de Doação por Transferência */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Doação por Transferência
            </h2>
            
            <div className="grid md:grid-cols-4 gap-8">
              {passosDoacaoTransferencia.map((passo, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-white border-4 border-green-500 rounded-full flex items-center justify-center mx-auto text-3xl">
                      {passo.icone}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {passo.numero}
                    </div>
                    {index < passosDoacaoTransferencia.length - 1 && (
                      <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-green-200 transform -translate-y-1/2"></div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{passo.titulo}</h3>
                  <p className="text-gray-600 text-sm">{passo.descricao}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fluxo de Doação de Itens */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Doação de Itens Físicos
            </h2>
            
            <div className="grid md:grid-cols-4 gap-8">
              {passosItens.map((passo, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-white border-4 border-blue-500 rounded-full flex items-center justify-center mx-auto text-3xl">
                      {passo.icone}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {passo.numero}
                    </div>
                    {index < passosItens.length - 1 && (
                      <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-blue-200 transform -translate-y-1/2"></div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{passo.titulo}</h3>
                  <p className="text-gray-600 text-sm">{passo.descricao}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Números e Impacto */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl text-white p-8 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Nosso Impacto em 2024</h2>
              <p className="text-xl opacity-90">
                Juntos, estamos transformando vidas e comunidades
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">12.500</div>
                <div className="text-lg opacity-90">Famílias Atendidas</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">450</div>
                <div className="text-lg opacity-90">Toneladas de Alimentos</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">R$ 2.8M</div>
                <div className="text-lg opacity-90">Recursos Mobilizados</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">95%</div>
                <div className="text-lg opacity-90">Recursos Diretos</div>
              </div>
            </div>
          </div>

          {/* Certificações e Parcerias */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Certificações e Parcerias
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">OSCIP Certificada</h3>
                <p className="text-sm text-gray-600">
                  Organização da Sociedade Civil de Interesse Público
                </p>
              </div>
              
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Parceiro ONU</h3>
                <p className="text-sm text-gray-600">
                  Consultor especial do ECOSOC das Nações Unidas
                </p>
              </div>
              
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Certificado Doar</h3>
                <p className="text-sm text-gray-600">
                  Selo de transparência e prestação de contas
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Resumido */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Perguntas Frequentes
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Como posso ter certeza de que minha doação chegará aos necessitados?
                </h3>
                <p className="text-gray-600">
                  Enviamos relatórios trimestrais com fotos e histórias reais das famílias atendidas. 
                  Você também pode agendar uma visita às nossas unidades para conhecer nosso trabalho de perto.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Recebo algum comprovante para dedução no Imposto de Renda?
                </h3>
                <p className="text-gray-600">
                  Sim! Enviamos o recibo fiscal em até 5 dias úteis após a confirmação da doação. 
                  Doações para a ADRA podem ser deduzidas até o limite de 6% do imposto devido.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Existe um valor mínimo para doação?
                </h3>
                <p className="text-gray-600">
                  Não há valor mínimo. Toda contribuição, por menor que seja, faz a diferença na vida de alguém. 
                  Com R$ 20 já conseguimos fornecer uma cesta básica para uma família por uma semana.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gray-900 rounded-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para fazer a diferença?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Escolha como quer contribuir e transforme vidas hoje mesmo
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/doar/transferencia">
                <Button variant="primary" size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                  Doar por Transferência
                </Button>
              </Link>
              <Link to="/doar/itens">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100">
                  Doar Itens Físicos
                </Button>
              </Link>
            </div>
          </div>

          {/* Botão Voltar */}
          <div className="mt-8 text-center">
            <Link to="/doar">
              <Button variant="secondary" size="lg">
                ← Voltar ao Hub de Doações
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
