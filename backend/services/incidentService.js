const { v4: uuidv4 } = require('uuid');
const db = require('../models/database');

class IncidentService {
  getAllIncidents(organizationId) {
    return db.findAll('incidents', { organizationId });
  }

  getIncidentById(id) {
    return db.findById('incidents', id);
  }

  createIncident(title, description, serviceIds, organizationId, createdBy) {
    const incidentId = uuidv4();
    return db.create('incidents', incidentId, {
      title,
      description,
      serviceIds,
      status: 'investigating',
      organizationId,
      createdBy,
      updates: []
    });
  }

  updateIncident(id, updates) {
    return db.update('incidents', id, updates);
  }

  addIncidentUpdate(id, message, updatedBy) {
    const incident = db.findById('incidents', id);
    if (!incident) return null;

    const update = {
      id: uuidv4(),
      message,
      updatedBy,
      timestamp: new Date()
    };

    incident.updates.push(update);
    return db.update('incidents', id, incident);
  }

  resolveIncident(id) {
    return this.updateIncident(id, { status: 'resolved', resolvedAt: new Date() });
  }

  deleteIncident(id) {
    return db.delete('incidents', id);
  }

  createMaintenance(title, description, serviceIds, scheduledStart, scheduledEnd, organizationId, createdBy) {
    const maintenanceId = uuidv4();
    return db.create('maintenances', maintenanceId, {
      title,
      description,
      serviceIds,
      status: 'scheduled',
      scheduledStart: new Date(scheduledStart),
      scheduledEnd: new Date(scheduledEnd),
      organizationId,
      createdBy
    });
  }

  getAllMaintenances(organizationId) {
    return db.findAll('maintenances', { organizationId });
  }

  updateMaintenance(id, updates) {
    return db.update('maintenances', id, updates);
  }
}

module.exports = new IncidentService();