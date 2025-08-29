import acceptableItemsData from '../data/acceptableItems.json';
import requestedItemsData from '../data/requested_items.json';

export class ItemsService {
  static getAcceptableItems() {
    return acceptableItemsData.aceitaveis;
  }

  static getNonAcceptableItems() {
    return acceptableItemsData.nao_aceitos;
  }

  static getDonationTips() {
    return acceptableItemsData.dicas;
  }

  static getRequestedItems() {
    return requestedItemsData;
  }

  static isItemAcceptable(itemName) {
    const acceptable = this.getAcceptableItems();
    const nonAcceptable = this.getNonAcceptableItems();
    
    const itemLower = itemName.toLowerCase();
    
    const isAcceptable = acceptable.some(item => 
      item.toLowerCase().includes(itemLower) || itemLower.includes(item.toLowerCase())
    );
    
    const isNonAcceptable = nonAcceptable.some(item => 
      item.toLowerCase().includes(itemLower) || itemLower.includes(item.toLowerCase())
    );
    
    if (isNonAcceptable) {
      return { acceptable: false, reason: 'Item não aceito pelas unidades ADRA' };
    }
    
    if (isAcceptable) {
      return { acceptable: true, reason: 'Item aceito pelas unidades ADRA' };
    }
    
    return { acceptable: null, reason: 'Consulte a unidade mais próxima para confirmar' };
  }

  static searchItems(query, includeNonAcceptable = false) {
    const acceptable = this.getAcceptableItems();
    const nonAcceptable = includeNonAcceptable ? this.getNonAcceptableItems() : [];
    
    const allItems = [
      ...acceptable.map(item => ({ name: item, type: 'acceptable' })),
      ...nonAcceptable.map(item => ({ name: item, type: 'non-acceptable' }))
    ];
    
    if (!query || query.trim() === '') {
      return allItems;
    }
    
    const queryLower = query.toLowerCase();
    
    return allItems.filter(item => 
      item.name.toLowerCase().includes(queryLower)
    );
  }

  static categorizeItems(items) {
    return items.map(item => ({
      ...item,
      category: this.getItemCategory(item.name)
    }));
  }

  static getItemCategory(itemName) {
    const itemLower = itemName.toLowerCase();
    
    const categories = {
      'alimentos': ['alimentos', 'comida', 'bebida', 'água'],
      'roupas': ['roupas', 'calçados', 'vestuário', 'sapatos'],
      'higiene': ['higiene', 'limpeza', 'sabonete', 'shampoo'],
      'bebês': ['bebês', 'fraldas', 'bebê', 'criança'],
      'educação': ['livros', 'material escolar', 'educação', 'escola'],
      'casa': ['cobertores', 'cama', 'móveis', 'utensílios'],
      'brinquedos': ['brinquedos', 'jogos', 'brincadeiras']
    };
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => itemLower.includes(keyword))) {
        return category;
      }
    }
    
    return 'outros';
  }

  static validateDonationList(items) {
    const errors = [];
    const warnings = [];
    
    if (!items || items.length === 0) {
      errors.push('Lista de doação não pode estar vazia');
      return { isValid: false, errors, warnings };
    }
    
    items.forEach((item, index) => {
      if (!item.name || item.name.trim() === '') {
        errors.push(`Item ${index + 1}: Nome é obrigatório`);
      }
      
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantidade deve ser maior que zero`);
      }
      
      const acceptableCheck = this.isItemAcceptable(item.name);
      if (acceptableCheck.acceptable === false) {
        warnings.push(`Item ${index + 1}: ${acceptableCheck.reason}`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static formatDonationList(items) {
    return items.map(item => 
      `${item.quantity}x ${item.name}${item.description ? ` (${item.description})` : ''}`
    ).join('\n');
  }

  static generateDonationSummary(items) {
    const total = items.length;
    const categories = {};
    
    items.forEach(item => {
      const category = this.getItemCategory(item.name);
      categories[category] = (categories[category] || 0) + 1;
    });
    
    return {
      totalItems: total,
      categoriesCount: Object.keys(categories).length,
      categories,
      mostCommonCategory: Object.entries(categories)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'outros'
    };
  }

  static saveDonationList(items, donorInfo = {}) {
    try {
      const donationList = {
        id: `LIST${Date.now()}`,
        items,
        donorInfo,
        createdAt: new Date().toISOString(),
        summary: this.generateDonationSummary(items)
      };
      
      const savedLists = this.getSavedDonationLists();
      savedLists.push(donationList);
      
      localStorage.setItem('adra_donation_lists', JSON.stringify(savedLists));
      return donationList.id;
    } catch (error) {
      console.error('Erro ao salvar lista de doação:', error);
      return null;
    }
  }

  static getSavedDonationLists() {
    try {
      const lists = localStorage.getItem('adra_donation_lists');
      return lists ? JSON.parse(lists) : [];
    } catch (error) {
      console.error('Erro ao recuperar listas salvas:', error);
      return [];
    }
  }

  static deleteDonationList(listId) {
    try {
      const lists = this.getSavedDonationLists();
      const filteredLists = lists.filter(list => list.id !== listId);
      localStorage.setItem('adra_donation_lists', JSON.stringify(filteredLists));
      return true;
    } catch (error) {
      console.error('Erro ao deletar lista:', error);
      return false;
    }
  }
}
