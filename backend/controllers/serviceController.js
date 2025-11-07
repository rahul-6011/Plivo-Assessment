const prisma = require('../lib/prisma');

class ServiceController {
  async getAllServices(req, res) {
    try {
      const services = await prisma.service.findMany({
        where: { organizationId: req.user.organizationId }
      });
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPublicServices(req, res) {
    try {
      const { org } = req.query;
      if (!org) {
        return res.status(400).json({ error: 'Organization slug required' });
      }
      
      // Find organization by slug
      const organization = await prisma.organization.findUnique({
        where: { slug: org }
      });
      
      if (!organization) {
        return res.status(404).json({ error: 'Organization not found' });
      }
      
      const services = await prisma.service.findMany({
        where: { organizationId: organization.id }
      });
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createService(req, res) {
    try {
      const { name } = req.body;
      const service = await prisma.service.create({
        data: {
          name,
          organizationId: req.user.organizationId
        }
      });
      
      // Emit real-time update
      req.io.emit('serviceCreated', service);
      
      res.status(201).json(service);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateService(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const service = await prisma.service.update({
        where: { id },
        data: updates
      });

      // Emit real-time update
      req.io.emit('serviceUpdated', service);
      
      res.json(service);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateServiceStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const service = await prisma.service.update({
        where: { id },
        data: { status }
      });
      
      // Add to status history
      await prisma.statusHistory.create({
        data: {
          serviceId: id,
          status,
          updatedBy: req.user.id
        }
      });

      // Emit real-time update
      req.io.emit('statusUpdated', { serviceId: id, status, service });
      
      res.json(service);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteService(req, res) {
    try {
      const { id } = req.params;
      await prisma.service.delete({
        where: { id }
      });

      // Emit real-time update
      req.io.emit('serviceDeleted', { serviceId: id });
      
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getStatusHistory(req, res) {
    try {
      const { id } = req.params;
      const history = await prisma.statusHistory.findMany({
        where: { serviceId: id },
        orderBy: { timestamp: 'desc' }
      });
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ServiceController();