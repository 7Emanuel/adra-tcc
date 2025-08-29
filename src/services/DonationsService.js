import donationsData from '../data/donations.json';

export class DonationsService {
  static getBankData() {
    return donationsData.bank;
  }

  static getPixData() {
    return donationsData.pix;
  }

  static generatePixQR(amount = null) {
    let payload = donationsData.pix.payload;
    
    if (amount && amount > 0) {
      // Adicionar valor ao payload PIX se especificado
      // Formato: valor em centavos
      const valueInCents = Math.round(amount * 100);
      const valueString = valueInCents.toString().padStart(2, '0');
      
      // Inserir valor no payload (simplificado)
      // Em uma implementação real, seria necessário recalcular o CRC
      payload = payload.replace('6304A1B2', `54${valueString.length}${valueString}6304A1B2`);
    }
    
    return payload;
  }

  static formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  static validateAmount(amount) {
    const numericAmount = parseFloat(amount);
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return { isValid: false, error: 'Valor deve ser maior que zero' };
    }
    
    if (numericAmount > 10000) {
      return { isValid: false, error: 'Valor máximo permitido é R$ 10.000,00' };
    }
    
    if (numericAmount < 1) {
      return { isValid: false, error: 'Valor mínimo é R$ 1,00' };
    }
    
    return { isValid: true, amount: numericAmount };
  }

  static getSuggestedAmounts() {
    return [10, 25, 50, 100, 200, 500];
  }

  static formatBankAccount() {
    const bank = this.getBankData();
    return `${bank.bankName}\nAgência: ${bank.agency}\nConta: ${bank.account}\nCNPJ: ${bank.cnpj}`;
  }

  static copyToClipboard(text) {
    return navigator.clipboard.writeText(text).then(() => {
      return true;
    }).catch(() => {
      // Fallback para navegadores sem suporte a clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    });
  }

  static generateDonationReceipt(amount, method, timestamp = new Date()) {
    return {
      id: `DOA${timestamp.getTime()}`,
      amount: this.formatCurrency(amount),
      method: method,
      date: timestamp.toLocaleDateString('pt-BR'),
      time: timestamp.toLocaleTimeString('pt-BR'),
      organization: 'ADRA - Agência de Desenvolvimento e Recursos Assistenciais'
    };
  }

  static saveDonationIntent(donationData) {
    try {
      const donations = this.getDonationHistory();
      donations.push({
        ...donationData,
        timestamp: new Date().toISOString(),
        status: 'intent' // intenção de doação registrada
      });
      
      localStorage.setItem('adra_donation_history', JSON.stringify(donations));
      return true;
    } catch (error) {
      console.error('Erro ao salvar intenção de doação:', error);
      return false;
    }
  }

  static getDonationHistory() {
    try {
      const history = localStorage.getItem('adra_donation_history');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Erro ao recuperar histórico de doações:', error);
      return [];
    }
  }

  static clearDonationHistory() {
    try {
      localStorage.removeItem('adra_donation_history');
      return true;
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
      return false;
    }
  }
}
