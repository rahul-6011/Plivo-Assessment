const { v4: uuidv4 } = require('uuid');
const db = require('../models/database');

class ServiceService {
  getAllServices(organizationId) {
    return db.findAll('services', { organizationId });
  }

  getServiceById(id) {
    return db.findById('services', id);
  }

  createService(name, organizationId) {
    const serviceId = uuidv4();
    return db.create('services', serviceId, {
      name,
      status: 'operational',
      organizationId
    });
  }

  updateService(id, updates) {
    return db.update('services', id, updates);
  }

  updateServiceStatus(id, status, updatedBy) {
    const service = this.updateService(id, { status });
    
    if (service) {
      // Add to status history
      const historyId = uuidv4();
      db.create('statusHistory', historyId, {
        serviceId: id,
        status,
        updatedBy,
        timestamp: new Date()
      });
    }
    
    return service;
  }

  deleteService(id) {
    return db.delete('services', id);
  }

  getStatusHistory(serviceId) {
    return db.findAll('statusHistory', { serviceId })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
}

module.exports = new ServiceService();