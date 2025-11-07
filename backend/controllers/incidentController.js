const prisma = require('../lib/prisma');

class IncidentController {
  async getAllIncidents(req, res) {
    try {
      const incidents = await prisma.incident.findMany({
        where: { organizationId: req.user.organizationId },
        include: { updates: true },
        orderBy: { createdAt: 'desc' }
      });
      res.json(incidents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPublicIncidents(req, res) {
    try {
      const { org } = req.query;
      if (!org) {
        return res.status(400).json({ error: 'Organization slug required' });
      }
      
      const organization = await prisma.organization.findUnique({
        where: { slug: org }
      });
      
      if (!organization) {
        return res.status(404).json({ error: 'Organization not found' });
      }
      
      const incidents = await prisma.incident.findMany({
        where: { organizationId: organization.id },
        include: { updates: true },
        orderBy: { createdAt: 'desc' }
      });
      res.json(incidents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createIncident(req, res) {
    try {
      const { title, description, serviceIds } = req.body;
      const incident = await prisma.incident.create({
        data: {
          title,
          description,
          serviceIds: JSON.stringify(serviceIds),
          organizationId: req.user.organizationId,
          createdBy: req.user.id
        },
        include: { updates: true }
      });
      
      req.io.emit('incidentCreated', incident);
      res.status(201).json(incident);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateIncident(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const incident = incidentService.updateIncident(id, updates);
      
      if (!incident) {
        return res.status(404).json({ error: 'Incident not found' });
      }

      req.io.emit('incidentUpdated', incident);
      res.json(incident);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async addIncidentUpdate(req, res) {
    try {
      const { id } = req.params;
      const { message } = req.body;
      
      await prisma.incidentUpdate.create({
        data: {
          incidentId: id,
          message,
          updatedBy: req.user.id
        }
      });
      
      const incident = await prisma.incident.findUnique({
        where: { id },
        include: { updates: true }
      });

      req.io.emit('incidentUpdated', incident);
      res.json(incident);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async resolveIncident(req, res) {
    try {
      const { id } = req.params;
      const incident = await prisma.incident.update({
        where: { id },
        data: { 
          status: 'resolved',
          resolvedAt: new Date()
        },
        include: { updates: true }
      });

      req.io.emit('incidentUpdated', incident);
      res.json(incident);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllMaintenances(req, res) {
    try {
      const maintenances = incidentService.getAllMaintenances(req.user.organizationId);
      res.json(maintenances);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPublicMaintenances(req, res) {
    try {
      const maintenances = incidentService.getAllMaintenances('org-1');
      res.json(maintenances);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createMaintenance(req, res) {
    try {
      const { title, description, serviceIds, scheduledStart, scheduledEnd } = req.body;
      const maintenance = incidentService.createMaintenance(
        title, 
        description, 
        serviceIds, 
        scheduledStart, 
        scheduledEnd,
        req.user.organizationId, 
        req.user.id
      );
      
      req.io.emit('maintenanceCreated', maintenance);
      res.status(201).json(maintenance);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new IncidentController();