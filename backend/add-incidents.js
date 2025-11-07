const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addIncidents() {
  try {
    // Get Acme Corp organization
    const acme = await prisma.organization.findUnique({
      where: { slug: 'acme' }
    });

    if (!acme) {
      console.log('Acme organization not found');
      return;
    }

    // Get some services
    const services = await prisma.service.findMany({
      where: { organizationId: acme.id }
    });

    if (services.length === 0) {
      console.log('No services found');
      return;
    }

    // Create a sample incident
    const incident = await prisma.incident.create({
      data: {
        title: 'API Response Time Issues',
        description: 'We are experiencing slower than normal response times on our API endpoints. Our team is investigating the issue.',
        status: 'investigating',
        serviceIds: JSON.stringify([services[1].id]), // API service
        organizationId: acme.id,
        createdBy: 'user-1' // admin user
      }
    });

    // Add an update to the incident
    await prisma.incidentUpdate.create({
      data: {
        incidentId: incident.id,
        message: 'We have identified the root cause and are working on a fix.',
        updatedBy: 'user-1'
      }
    });

    console.log('Sample incident created successfully');
  } catch (error) {
    console.error('Error creating incident:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addIncidents();