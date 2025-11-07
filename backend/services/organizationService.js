const { v4: uuidv4 } = require('uuid');
const db = require('../models/database');

class OrganizationService {
  createOrganization(name, createdBy) {
    const orgId = uuidv4();
    return db.create('organizations', orgId, {
      name,
      createdBy,
      settings: {
        publicPage: true,
        customDomain: null
      }
    });
  }

  getOrganization(id) {
    return db.findById('organizations', id);
  }

  updateOrganization(id, updates) {
    return db.update('organizations', id, updates);
  }

  getOrganizationMembers(organizationId) {
    return db.findAll('users', { organizationId });
  }

  inviteUser(organizationId, email, role = 'member') {
    const inviteId = uuidv4();
    return db.create('invites', inviteId, {
      organizationId,
      email,
      role,
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
  }
}

module.exports = new OrganizationService();