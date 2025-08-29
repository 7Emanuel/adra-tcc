import adraUnitsData from '../data/adra_units.json';

export class UnitsService {
  static getAllUnits() {
    return adraUnitsData.adraUnits;
  }

  static getUnitById(id) {
    return adraUnitsData.adraUnits.find(unit => unit.id === id);
  }

  static getUnitsByType(type) {
    return adraUnitsData.adraUnits.filter(unit => unit.tipo === type);
  }

  static getNearestUnits(userLat, userLng, maxResults = 5) {
    const unitsWithDistance = adraUnitsData.adraUnits.map(unit => ({
      ...unit,
      distance: this.calculateDistance(userLat, userLng, unit.lat, unit.lng)
    }));

    return unitsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, maxResults);
  }

  static calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Raio da Terra em km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  static toRad(value) {
    return value * Math.PI / 180;
  }

  static formatDistance(distance) {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  }

  static getOpeningStatus(unit) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = domingo, 1 = segunda, etc.
    
    // Assumindo horário padrão: Segunda a Sexta 8h-17h
    if (currentDay === 0 || currentDay === 6) {
      return { isOpen: false, status: 'Fechado - Final de semana' };
    }
    
    if (currentHour >= 8 && currentHour < 17) {
      return { isOpen: true, status: 'Aberto agora' };
    }
    
    if (currentHour < 8) {
      return { isOpen: false, status: `Abre às 8h (em ${8 - currentHour}h)` };
    }
    
    return { isOpen: false, status: 'Fechado - Abre amanhã às 8h' };
  }
}
