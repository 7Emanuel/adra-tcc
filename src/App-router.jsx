import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import RequireVerified from './components/guards/RequireVerified';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));

// Donor routes
const Donor = lazy(() => import('./pages/Donor/Donor'));
const DonorTransfer = lazy(() => import('./pages/Donor/DonorTransferencia'));
const DonorItems = lazy(() => import('./pages/Donor/DonorItens'));

// Beneficiary routes
const Atuation = lazy(() => import('./pages/Beneficiary/Atuacao'));
const NewRequest = lazy(() => import('./pages/Beneficiary/NovoPedido'));

// Public pages
const PublicUnits = lazy(() => import('./pages/Unidades'));
const Privacy = lazy(() => import('./pages/Privacidade'));
const Terms = lazy(() => import('./pages/Termos'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Legacy routes for compatibility
const Doar = lazy(() => import('./pages/Doar'));
const DecisorNecessitado = lazy(() => import('./pages/DecisorNecessitado'));
const LoginCadastro = lazy(() => import('./pages/LoginCadastro'));
const PaginaEsperaValidacao = lazy(() => import('./pages/PaginaEsperaValidacao'));
const PaginaPedidoDoacao = lazy(() => import('./pages/PaginaPedidoDoacao'));
const AdminValidacao = lazy(() => import('./pages/AdminValidacao'));
const BeneficiaryLanding = lazy(() => import('./pages/Beneficiary/BeneficiaryLanding'));
const SuccessPage = lazy(() => import('./pages/Beneficiary/SuccessPage'));
const Dashboard = lazy(() => import('./pages/Beneficiary/Dashboard'));

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <SuspenseWrapper><Home /></SuspenseWrapper>
      },
      
      // Donor routes
      {
        path: 'doador',
        element: <SuspenseWrapper><Donor /></SuspenseWrapper>
      },
      {
        path: 'doador/transferencia',
        element: <SuspenseWrapper><DonorTransfer /></SuspenseWrapper>
      },
      {
        path: 'doador/itens',
        element: <SuspenseWrapper><DonorItems /></SuspenseWrapper>
      },
      {
        path: 'doador/unidades',
        element: <SuspenseWrapper><DonorUnits /></SuspenseWrapper>
      },
      {
        path: 'doador/confirmacao',
        element: <SuspenseWrapper><DonorConfirm /></SuspenseWrapper>
      },
      {
        path: 'doador/obrigado',
        element: <SuspenseWrapper><DonorThanks /></SuspenseWrapper>
      },
      
      // Beneficiary registration
      {
        path: 'necessitado',
        element: <SuspenseWrapper><BeneficiaryWizard /></SuspenseWrapper>
      },
      {
        path: 'espera',
        element: <SuspenseWrapper><WaitValidation /></SuspenseWrapper>
      },
      
      // Protected beneficiary area
      {
        path: 'atuacao',
        element: (
          <RequireVerified>
            <SuspenseWrapper><Atuation /></SuspenseWrapper>
          </RequireVerified>
        ),
        children: [
          {
            index: true,
            element: <SuspenseWrapper><Requests /></SuspenseWrapper>
          },
          {
            path: 'pedidos/novo',
            element: <SuspenseWrapper><NewRequest /></SuspenseWrapper>
          },
          {
            path: 'pedidos/:id',
            element: <SuspenseWrapper><RequestDetails /></SuspenseWrapper>
          },
          {
            path: 'unidades',
            element: <SuspenseWrapper><UnitsPage /></SuspenseWrapper>
          },
          {
            path: 'perfil',
            element: <SuspenseWrapper><ProfilePage /></SuspenseWrapper>
          }
        ]
      },
      
      // Public pages
      {
        path: 'unidades',
        element: <SuspenseWrapper><PublicUnits /></SuspenseWrapper>
      },
      {
        path: 'privacidade',
        element: <SuspenseWrapper><Privacy /></SuspenseWrapper>
      },
      {
        path: 'termos',
        element: <SuspenseWrapper><Terms /></SuspenseWrapper>
      },
      
      // Legacy routes for backward compatibility
      {
        path: 'doar',
        element: <SuspenseWrapper><Doar /></SuspenseWrapper>
      },
      {
        path: 'preciso-de-ajuda',
        element: <SuspenseWrapper><DecisorNecessitado /></SuspenseWrapper>
      },
      {
        path: 'login-cadastro',
        element: <SuspenseWrapper><LoginCadastro /></SuspenseWrapper>
      },
      {
        path: 'espera-validacao',
        element: <SuspenseWrapper><PaginaEsperaValidacao /></SuspenseWrapper>
      },
      {
        path: 'pedir-doacao',
        element: <SuspenseWrapper><PaginaPedidoDoacao /></SuspenseWrapper>
      },
      {
        path: 'admin-validacao',
        element: <SuspenseWrapper><AdminValidacao /></SuspenseWrapper>
      },
      {
        path: 'beneficiario',
        element: <SuspenseWrapper><BeneficiaryLanding /></SuspenseWrapper>
      },
      {
        path: 'beneficiario/cadastro',
        element: <SuspenseWrapper><BeneficiaryWizard /></SuspenseWrapper>
      },
      {
        path: 'beneficiario/verificacao',
        element: <SuspenseWrapper><WaitValidation /></SuspenseWrapper>
      },
      {
        path: 'beneficiario/sucesso',
        element: <SuspenseWrapper><SuccessPage /></SuspenseWrapper>
      },
      {
        path: 'beneficiario/dashboard',
        element: <SuspenseWrapper><Dashboard /></SuspenseWrapper>
      },
      
      // 404 route
      {
        path: '*',
        element: <SuspenseWrapper><NotFound /></SuspenseWrapper>
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
