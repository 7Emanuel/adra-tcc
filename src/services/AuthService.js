// Mock Auth Service para desenvolvimento
// Em produção, isso será substituído por chamadas de API reais

export const AuthService = {
  // Simula um banco de dados de usuários
  mockUsers: [
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao@email.com',
      telefone: '(11) 99999-9999',
      senha: '123456',
      // Novo fluxo: status de verificação manual
      // 'pending' | 'approved' | 'rejected'
      verificationStatus: 'pending',
      // Compatibilidade retroativa (não usar diretamente no novo fluxo)
      isVerified: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria@email.com',
      telefone: '(11) 88888-8888',
      senha: '123456',
      verificationStatus: 'approved', // Usuário já aprovado para teste
      isVerified: true,
      createdAt: new Date().toISOString()
    }
  ],

  // Registrar novo usuário
  register(userData) {
    const { nome, email, telefone, senha } = userData;
    
    // Verificar se email já existe
    const existingUser = this.mockUsers.find(user => user.email === email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    // Criar novo usuário
    const newUser = {
      id: this.mockUsers.length + 1,
      nome,
      email,
      telefone,
      senha, // Em produção, a senha seria hasheada
      // Novo: começa como pendente para validação manual do admin
      verificationStatus: 'pending',
      // Campo legado para compatibilidade com checagens antigas
      isVerified: false,
      createdAt: new Date().toISOString()
    };

    this.mockUsers.push(newUser);
    
    // Salvar usuário logado (sem a senha)
    const userToSave = { ...newUser };
    delete userToSave.senha;
    localStorage.setItem('adra_user', JSON.stringify(userToSave));
    
    return userToSave;
  },

  // Fazer login
  login(email, senha) {
    const user = this.mockUsers.find(u => u.email === email && u.senha === senha);
    
    if (!user) {
      return null; // Credenciais inválidas
    }

    // Salvar usuário logado (sem a senha)
    const userToSave = { ...user };
    delete userToSave.senha;
    localStorage.setItem('adra_user', JSON.stringify(userToSave));
    
    return userToSave;
  },

  // Logout
  logout() {
    localStorage.removeItem('adra_user');
    localStorage.removeItem('adra_donation_draft');
    localStorage.removeItem('adra_verification_attempts');
  },

  // Obter usuário atual
  getUser() {
    const userData = localStorage.getItem('adra_user');
    return userData ? JSON.parse(userData) : null;
  },

  // Verificar se está logado
  isLoggedIn() {
    return this.getUser() !== null;
  },

  // Verificar se o usuário está verificado
  isVerified() {
    const user = this.getUser();
    // Considera verificado apenas quando status for 'approved'
    return !!user && (user.verificationStatus === 'approved' || user.isVerified === true);
  },

  // Definir status de verificação (novo fluxo)
  // Aceita: 'pending' | 'approved' | 'rejected' | boolean (legado)
  setVerificationStatus(status) {
    const user = this.getUser();
    if (!user) return;

    // Normaliza entrada booleana legado
    let normalized = status;
    if (typeof status === 'boolean') {
      normalized = status ? 'approved' : 'pending';
    }

    // Aplica alterações no usuário em sessão
    user.verificationStatus = normalized;
    // Mantém campo legado em sincronia
    user.isVerified = normalized === 'approved';
    localStorage.setItem('adra_user', JSON.stringify(user));

    // Atualiza também no mockUsers
    const mockUser = this.mockUsers.find(u => u.id === user.id);
    if (mockUser) {
      mockUser.verificationStatus = normalized;
      mockUser.isVerified = normalized === 'approved';
    }
  },

  // Simular autenticação automática (para o fluxo antigo se necessário)
  simulateLogin() {
    // Criar usuário temporário para demonstração
    const tempUser = {
      id: 999,
      nome: 'Usuário Demonstração',
      email: 'demo@adra.com',
      telefone: '(11) 99999-9999',
      verificationStatus: 'pending',
      isVerified: false,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('adra_user', JSON.stringify(tempUser));
    return tempUser;
  },

  // Simular validação por admin (para teste)
  simulateAdminValidation(email, status = 'approved') {
    const user = this.mockUsers.find(u => u.email === email);
    if (user) {
      user.verificationStatus = status;
      user.isVerified = status === 'approved';
      
      // Se o usuário está logado, atualizar também no localStorage
      const currentUser = this.getUser();
      if (currentUser && currentUser.email === email) {
        currentUser.verificationStatus = status;
        currentUser.isVerified = status === 'approved';
        localStorage.setItem('adra_user', JSON.stringify(currentUser));
      }
      
      console.log(`🔧 Simulação: Usuário ${email} teve status alterado para ${status}`);
      return user;
    }
    return null;
  },

  // Sincronizar status do usuário com o backend
  async syncUserStatusWithBackend() {
    const user = this.getUser();
    if (!user || !user.email) return null;

    try {
      const response = await fetch(`http://localhost:3000/api/beneficiaries/status?email=${encodeURIComponent(user.email)}`);
      const data = await response.json();
      
      if (data.exists) {
        let updatedStatus;
        switch (data.status) {
          case 'validated':
          case 'approved':
            updatedStatus = 'approved';
            break;
          case 'rejected':
            updatedStatus = 'rejected';
            break;
          default:
            updatedStatus = 'pending';
        }
        
        // Atualiza o usuário no localStorage
        const updatedUser = {
          ...user,
          verificationStatus: updatedStatus,
          isVerified: updatedStatus === 'approved'
        };
        
        localStorage.setItem('adra_user', JSON.stringify(updatedUser));
        
        // Atualiza também no mockUsers se existir
        const mockUser = this.mockUsers.find(u => u.email === user.email);
        if (mockUser) {
          mockUser.verificationStatus = updatedStatus;
          mockUser.isVerified = updatedStatus === 'approved';
        }
        
        return updatedUser;
      }
    } catch (error) {
      console.warn('Erro ao sincronizar status com backend:', error);
    }
    
    return user;
  },

  // Para debug: listar todos os usuários
  getAllUsers() {
    return this.mockUsers.map(user => ({
      id: user.id,
      nome: user.nome,
      email: user.email,
      verificationStatus: user.verificationStatus,
      isVerified: user.isVerified
    }));
  }
};
