import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { adminApi } from '../services/adminApi';

const AdminLoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!password.trim()) {
      setError('Informe a senha.');
      return;
    }
    setLoading(true);
    try {
      await adminApi.login(password.trim());
      setPassword('');
      onClose?.();
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Erro ao entrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Acesso do Administrador"
      size="sm"
      primaryAction={{ label: loading ? 'Entrando...' : 'Entrar', onClick: handleSubmit, disabled: loading }}
      secondaryAction={{ label: 'Cancelar', onClick: onClose, disabled: loading }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>
      </form>
    </Modal>
  );
};

export default AdminLoginModal;
