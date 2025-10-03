import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Rola para o topo sempre que o pathname mudar
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Suave e com fallback para topo imediato
    try {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch {
      // Alguns navegadores não suportam 'instant'
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
