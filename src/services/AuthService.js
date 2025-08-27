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
      isVerified: false,
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
    return user && user.isVerified;
  },

  // Definir status de verificação
  setVerificationStatus(isVerified) {
    const user = this.getUser();
    if (user) {
      user.isVerified = isVerified;
      localStorage.setItem('adra_user', JSON.stringify(user));
      
      // Atualizar também no mockUsers
      const mockUser = this.mockUsers.find(u => u.id === user.id);
      if (mockUser) {
        mockUser.isVerified = isVerified;
      }
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
      isVerified: false,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('adra_user', JSON.stringify(tempUser));
    return tempUser;
  }
};
