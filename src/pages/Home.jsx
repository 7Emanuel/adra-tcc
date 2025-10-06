import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Modal from '../components/Modal';
import FeatureCard from '../components/FeatureCard';
import StepCard from '../components/StepCard';

const Home = () => {
  const navigate = useNavigate();
  const [isDoarModalOpen, setIsDoarModalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  // Navegar para o hub de doações em vez de abrir modal
  const handleDoarClick = () => navigate('/doar');
  const handleAjudaClick = () => navigate('/preciso-de-ajuda');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onDoarClick={handleDoarClick} />

      <main>
        {/* Hero Section */}
        <section id="inicio" className="pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                  Transforme vidas com a sua doação.
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Juntos, podemos levar esperança a quem mais precisa.
                </p>
                
                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button 
                    variant="primary" 
                    size="xl" 
                    onClick={handleDoarClick}
                    className="w-full sm:w-auto"
                  >
                    Quero Doar
                  </Button>
                  <Button 
                    variant="accent" 
                    size="xl" 
                    onClick={handleAjudaClick}
                    className="w-full sm:w-auto"
                  >
                    Preciso de Ajuda
                  </Button>
                </div>
              </div>

              {/* Image/Illustration */}
              <div className="flex-1 flex justify-center">
                <div className="w-full max-w-md h-96 rounded-3xl shadow-2xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=1200&auto=format&fit=crop" alt="Ação solidária" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Como Funciona Section */}
        <section id="como-funciona" className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-4">
              Como Funciona
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Duas jornadas simples e seguras para conectar doadores com quem precisa de ajuda.
            </p>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Doadores */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Para Doadores
                </h3>
                <div className="space-y-6">
                  <StepCard
                    step="1"
                    title="Escolha como doar"
                    description="Escolha o tipo de doação (itens ou transferência)."
                    icon={
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                    }
                  />
                  <StepCard
                    step="2"
                    title="Combine a entrega"
                    description="Combine a melhor forma de entrega."
                    icon={
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    }
                  />
                  <StepCard
                    step="3"
                    title="Acompanhe o impacto"
                    description="Acompanhe o impacto da sua ajuda."
                    icon={
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    }
                  />
                </div>
              </div>

              {/* Quem Precisa */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Para Quem Precisa
                </h3>
                <div className="space-y-6">
                  <StepCard
                    step="1"
                    title="Informe suas necessidades"
                    description="Informe suas necessidades com clareza."
                    icon={
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    }
                  />
                  <StepCard
                    step="2"
                    title="Compartilhe seu endereço"
                    description="Compartilhe seu endereço para visita da equipe."
                    icon={
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    }
                  />
                  <StepCard
                    step="3"
                    title="Aguarde validação"
                    description="Aguarde validação e receba acompanhamento."
                    icon={
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Áreas de Atuação Section */}
        <section id="areas-atuacao" className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-4">
              Áreas de Atuação
            </h2>
            <p className="text-lg text-gray-900-secondary text-center mb-12 max-w-2xl mx-auto">
              Trabalhamos em diversas frentes para oferecer assistência completa e dignidade para todos.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                title="Segurança Alimentar"
                description={[
                  "Garantimos acesso a alimentos nutritivos através de distribuições organizadas e programas de agricultura familiar.",
                  "Atuamos com parcerias locais para criar redes sustentáveis de alimentação em comunidades vulneráveis."
                ]}
                icon={
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              
              <FeatureCard
                title="Assistência Emergencial"
                description={[
                  "Resposta rápida em situações de emergência com distribuição de itens essenciais e apoio imediato.",
                  "Coordenamos esforços com autoridades locais para maximizar o impacto da ajuda humanitária."
                ]}
                icon={
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
              />
              
              <FeatureCard
                title="Educação & Capacitação"
                description={[
                  "Programas educacionais e de capacitação profissional para promover autonomia e desenvolvimento pessoal.",
                  "Oferecemos cursos técnicos e workshops que conectam pessoas com oportunidades de trabalho e renda."
                ]}
                icon={
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                }
              />
              
              <FeatureCard
                title="Saúde & Higiene"
                description={[
                  "Promoção de saúde básica através de campanhas de prevenção e distribuição de itens de higiene essenciais.",
                  "Parcerias com profissionais de saúde para oferecer atendimento básico em comunidades carentes."
                ]}
                icon={
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                }
              />
              
              <FeatureCard
                title="Geração de Renda"
                description={[
                  "Apoio ao empreendedorismo local através de microcrédito e capacitação para pequenos negócios.",
                  "Criamos oportunidades sustentáveis de trabalho que fortalecem a economia comunitária."
                ]}
                icon={
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              
              <FeatureCard
                title="Comunidade & Voluntariado"
                description={[
                  "Fortalecimento dos laços comunitários através de programas de voluntariado e atividades coletivas.",
                  "Mobilizamos redes de apoio local que criam conexões duradouras entre vizinhos e famílias."
                ]}
                icon={
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
              />
            </div>
          </div>
        </section>

        {/* Transparência & Segurança Section */}
        <section id="transparencia" className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Transparência & Segurança
              </h2>
              <p className="text-lg text-gray-900-secondary mb-12">
                Nossa plataforma é construída com os mais altos padrões de segurança e transparência para garantir confiança em todas as operações.
              </p>

              <div className="bg-gray-50 rounded-2xl p-8 mb-8">
                <ul className="space-y-6">
                  <li className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 mb-2">Dados Protegidos (HTTPS/JWT no futuro)</h3>
                      <p className="text-gray-900-secondary">Implementaremos criptografia de ponta para proteger todas as informações pessoais e transações realizadas na plataforma.</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 mb-2">Parceria Institucional ADRA</h3>
                      <p className="text-gray-900-secondary">Contamos com a experiência e credibilidade da ADRA, uma organização com décadas de atuação em assistência humanitária.</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 mb-2">Processos com Validação e Registro</h3>
                      <p className="text-gray-900-secondary">Todas as atividades passam por validação rigorosa e são registradas para garantir transparência e prestação de contas.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <Button variant="secondary" size="lg" disabled>
                Saiba mais (em breve)
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Final Section */}
        <section className="py-16 px-4 bg-adra-green">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Pronto para fazer a diferença?
            </h2>
            <p className="text-xl text-white text-opacity-90 mb-8 max-w-2xl mx-auto">
              Junte-se à nossa comunidade e seja parte da mudança que você quer ver no mundo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                variant="secondary" 
                size="xl" 
                onClick={handleDoarClick}
                className="w-full sm:w-auto bg-white text-adra-green hover:bg-gray-100"
              >
                Quero Doar
              </Button>
              <Button 
                variant="accent" 
                size="xl" 
                onClick={handleAjudaClick}
                className="w-full sm:w-auto"
              >
                Preciso de Ajuda
              </Button>
            </div>
            
            <p className="text-sm text-white text-opacity-75">
              Cadastros e mapas serão habilitados nas próximas etapas.
            </p>
          </div>
        </section>
      </main>

      {/* Admin entry button (discreto no canto) */}
      <button
        onClick={() => setAdminOpen(true)}
        aria-label="Entrar como administrador"
        title="Entrar como administrador"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center justify-center rounded-full border border-gray-300 bg-white/80 text-gray-600 shadow-md backdrop-blur px-3 py-2 hover:bg-white hover:text-adra-green hover:shadow-lg opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-adra-green"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c.828 0 1.5.672 1.5 1.5S12.828 14 12 14s-1.5-.672-1.5-1.5S11.172 11 12 11z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V9a4 4 0 118 0v2m-9 0h10a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5a2 2 0 012-2z" />
        </svg>
        <span className="ml-2 hidden sm:inline text-xs font-medium">Admin</span>
      </button>

      {/* Footer */}
      <Footer />

      {/* Modal Admin */}
      <Modal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        title="Entrar como administrador"
        primaryAction={{
          label: 'Entrar',
          onClick: async () => {
            try {
              const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ password: adminPassword })
              });
              if (!res.ok) throw new Error('Falha ao autenticar');
              setAdminOpen(false);
              navigate('/admin');
            } catch (e) {
              alert('Senha incorreta ou servidor indisponível.');
            }
          }
        }}
        secondaryAction={{ label: 'Cancelar', onClick: () => setAdminOpen(false) }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
        <input
          type="password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          placeholder="Digite a senha do administrador"
          className="form-input"
        />
        <p className="text-xs text-gray-500 mt-2">Senha padrão: 12345678910</p>
      </Modal>

      {/* Modals auxiliares existentes */}
      <Modal
        isOpen={isDoarModalOpen}
        onClose={() => setIsDoarModalOpen(false)}
        title="Como doar agora"
        primaryAction={{
          label: "Começar Doação",
          onClick: () => {
            setIsDoarModalOpen(false);
            navigate('/doar');
          }
        }}
        secondaryAction={{
          label: "Cancelar",
          onClick: () => setIsDoarModalOpen(false)
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            O processo de doação é simples e seguro:
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Escolha o tipo de doação (itens específicos ou contribuição financeira)</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Defina a melhor forma de entrega ou transferência</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Receba confirmação e acompanhe o impacto da sua doação</span>
            </li>
          </ul>
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              🎯 Pronto para fazer a diferença? Clique em "Começar Doação" para iniciar!
            </p>
          </div>
        </div>
      </Modal>

      {/* Admin login modal removido para ambiente de desenvolvimento */}
    </div>
  );
};

export default Home;
