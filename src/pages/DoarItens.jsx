import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';

export default function DoarItens() {
  const itensAceitos = [
    {
      categoria: "Roupas e Calçados",
      itens: [
        "Roupas em bom estado (adulto e infantil)",
        "Sapatos e tênis conservados",
        "Cobertores e edredons",
        "Toalhas e lençóis",
        "Roupas íntimas novas (lacradas)"
      ]
    },
    {
      categoria: "Alimentos Não Perecíveis",
      itens: [
        "Arroz, feijão, macarrão",
        "Óleo, açúcar, sal",
        "Enlatados em geral",
        "Leite em pó ou longa vida",
        "Farinhas e grãos"
      ]
    },
    {
      categoria: "Móveis e Eletrodomésticos",
      itens: [
        "Geladeira em funcionamento",
        "Fogão em bom estado",
        "Móveis conservados",
        "Colchões em boa condição",
        "Utensílios domésticos"
      ]
    },
    {
      categoria: "Produtos de Higiene",
      itens: [
        "Sabonete, shampoo, pasta de dente",
        "Papel higiênico",
        "Fraldas descartáveis",
        "Produtos de limpeza",
        "Absorventes femininos"
      ]
    },
    {
      categoria: "Material Escolar",
      itens: [
        "Cadernos e livros",
        "Lápis, canetas e borrachas",
        "Mochilas escolares",
        "Material de arte",
        "Calculadoras"
      ]
    }
  ];

  const itensNaoAceitos = [
    "Roupas rasgadas ou muito desgastadas",
    "Sapatos furados ou quebrados",
    "Alimentos vencidos ou próximos ao vencimento",
    "Medicamentos (por questões de segurança)",
    "Eletrodomésticos quebrados ou defeituosos",
    "Móveis com cupim ou muito danificados",
    "Produtos de higiene vencidos",
    "Materiais cortantes ou perigosos",
    "Livros ou materiais com conteúdo inadequado",
    "Brinquedos quebrados ou perigosos"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header da Página */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Doação de Itens Físicos
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sua doação de itens pode transformar vidas. Veja o que aceitamos e encontre a unidade ADRA mais próxima de você.
            </p>
          </div>

          {/* Informações Importantes */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Importante saber:</h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• Todos os itens devem estar limpos e em bom estado de conservação</li>
                  <li>• Separamos e organizamos as doações antes da distribuição</li>
                  <li>• Você pode entregar diretamente em uma de nossas unidades</li>
                  <li>• Para grandes volumes, entre em contato para agendarmos a coleta</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Itens Aceitos */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Itens Aceitos</h2>
              </div>

              <div className="space-y-6">
                {itensAceitos.map((categoria, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{categoria.categoria}</h3>
                    <ul className="space-y-1">
                      {categoria.itens.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-600 text-sm flex items-center">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Itens Não Aceitos */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Itens Não Aceitos</h2>
              </div>

              <p className="text-gray-600 mb-6 text-sm">
                Para garantir a segurança e qualidade das doações, não podemos aceitar os seguintes itens:
              </p>

              <ul className="space-y-3">
                {itensNaoAceitos.map((item, index) => (
                  <li key={index} className="text-gray-600 text-sm flex items-start">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-800 text-sm">
                  <strong>Dúvidas?</strong> Entre em contato conosco pelo telefone (11) 1234-5678 
                  ou e-mail itens@adra.org.br antes de levar sua doação.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Pronto para doar?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Encontre a unidade ADRA mais próxima de você e veja horários de funcionamento, 
              endereços e como chegar.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/doar/itens/unidades">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Encontrar Unidade Próxima
                </Button>
              </Link>
              
              <a 
                href="tel:+5511123456789" 
                className="inline-flex"
              >
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Agendar Coleta
                </Button>
              </a>
            </div>
          </div>

          {/* Botão Voltar */}
          <div className="mt-8">
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
