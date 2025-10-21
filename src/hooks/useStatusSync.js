import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';

/**
 * Hook para sincronizar automaticamente o status do usuário com o backend
 * Útil para páginas onde o usuário está aguardando validação
 */
export function useStatusSync(options = {}) {
  const {
    intervalMs = 10000, // Verifica a cada 10 segundos por padrão
    enabled = true,
    onStatusChange = null
  } = options;
  
  const navigate = useNavigate();
  const [lastStatus, setLastStatus] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const user = AuthService.getUser();
    if (!user) return;

    // Define o status inicial
    if (!lastStatus) {
      setLastStatus(user.verificationStatus || 'pending');
    }

    const checkStatus = async () => {
      if (isChecking) return; // Evita chamadas simultâneas
      
      setIsChecking(true);
      try {
        const updatedUser = await AuthService.syncUserStatusWithBackend();
        if (updatedUser) {
          const newStatus = updatedUser.verificationStatus;
          
          // Se o status mudou, executa callback e navega
          if (newStatus !== lastStatus) {
            setLastStatus(newStatus);
            
            if (onStatusChange) {
              onStatusChange(newStatus, lastStatus);
            }
            
            // Navega automaticamente baseado no novo status
            if (newStatus === 'approved' || newStatus === 'validated') {
              navigate('/conta-validada', { replace: true });
            } else if (newStatus === 'rejected') {
              // Força reload da página atual para mostrar a mensagem de rejeição
              window.location.reload();
            }
          }
        }
      } catch (error) {
        console.warn('Erro ao verificar status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    // Verifica imediatamente
    checkStatus();

    // Configura intervalo para verificações periódicas
    const interval = setInterval(checkStatus, intervalMs);

    return () => {
      clearInterval(interval);
    };
  }, [enabled, intervalMs, lastStatus, navigate, onStatusChange, isChecking]);

  return {
    isChecking,
    lastStatus
  };
}