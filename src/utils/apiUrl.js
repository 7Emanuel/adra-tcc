// Utility para construir URLs da API consistentemente
export const getApiUrl = (path = '') => {
  // Remove barras duplas e garante que path comece com /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Se VITE_API_URL estiver definido, use ele
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL}${cleanPath}`;
  }
  
  // Para desenvolvimento local
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return import.meta.env.VITE_USE_LOCAL_API === 'true' 
      ? `http://localhost:3000${cleanPath}`
      : `https://emanuelprado.alwaysdata.net${cleanPath}`;
  }
  
  // Para produção (Vercel, etc) - usar path relativo
  return cleanPath;
};

export default getApiUrl;