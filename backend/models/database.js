// In-memory database
class Database {
  constructor() {
    this.users = new Map();
    this.organizations = new Map();
    this.services = new Map();
    this.incidents = new Map();
    this.maintenances = new Map();
    this.statusHistory = new Map();
    this.invites = new Map();
    this.teams = new Map();
    
    // Initialize with default data
    this.initializeData();
  }

  initializeData() {
    // Multiple organizations
    const org1Id = 'org-1';
    this.organizations.set(org1Id, {
      id: org1Id,
      name: 'Acme Corp',
      slug: 'acme',
      createdAt: new Date()
    });

    const org2Id = 'org-2';
    this.organizations.set(org2Id, {
      id: org2Id,
      name: 'TechStart Inc',
      slug: 'techstart',
      createdAt: new Date()
    });

    // Acme Corp users
    const admin1Id = 'user-1';
    this.users.set(admin1Id, {
      id: admin1Id,
      email: 'admin@acme.com',
      password: '$2a$10$OcVRgrqRblg8VP83m9CUcewGqd0x1EIuOw27eHh/kbqwZfgjD9W1K', // Admin@2024!
      role: 'admin',
      organizationId: org1Id,
      createdAt: new Date()
    });

    const manager1Id = 'user-2';
    this.users.set(manager1Id, {
      id: manager1Id,
      email: 'manager@acme.com',
      password: '$2a$10$OcVRgrqRblg8VP83m9CUcewGqd0x1EIuOw27eHh/kbqwZfgjD9W1K', // Admin@2024!
      role: 'manager',
      organizationId: org1Id,
      createdAt: new Date()
    });

    // TechStart Inc users
    const admin2Id = 'user-3';
    this.users.set(admin2Id, {
      id: admin2Id,
      email: 'admin@techstart.com',
      password: '$2a$10$OcVRgrqRblg8VP83m9CUcewGqd0x1EIuOw27eHh/kbqwZfgjD9W1K', // Admin@2024!
      role: 'admin',
      organizationId: org2Id,
      createdAt: new Date()
    });

    const member2Id = 'user-4';
    this.users.set(member2Id, {
      id: member2Id,
      email: 'member@techstart.com',
      password: '$2a$10$OcVRgrqRblg8VP83m9CUcewGqd0x1EIuOw27eHh/kbqwZfgjD9W1K', // Admin@2024!
      role: 'member',
      organizationId: org2Id,
      createdAt: new Date()
    });

    // Acme Corp services
    const acmeServices = [
      { id: 'svc-1', name: 'Website', status: 'operational', organizationId: org1Id },
      { id: 'svc-2', name: 'API', status: 'operational', organizationId: org1Id },
      { id: 'svc-3', name: 'Database', status: 'degraded-performance', organizationId: org1Id }
    ];

    // TechStart Inc services
    const techstartServices = [
      { id: 'svc-4', name: 'Mobile App', status: 'operational', organizationId: org2Id },
      { id: 'svc-5', name: 'Payment API', status: 'operational', organizationId: org2Id },
      { id: 'svc-6', name: 'Analytics', status: 'operational', organizationId: org2Id }
    ];

    [...acmeServices, ...techstartServices].forEach(service => {
      this.services.set(service.id, {
        ...service,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
  }

  // Generic CRUD operations
  create(collection, id, data) {
    this[collection].set(id, { id, ...data, createdAt: new Date() });
    return this[collection].get(id);
  }

  findById(collection, id) {
    return this[collection].get(id);
  }

  findAll(collection, filter = {}) {
    const items = Array.from(this[collection].values());
    if (Object.keys(filter).length === 0) return items;
    
    return items.filter(item => {
      return Object.entries(filter).every(([key, value]) => item[key] === value);
    });
  }

  update(collection, id, data) {
    const existing = this[collection].get(id);
    if (!existing) return null;
    
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this[collection].set(id, updated);
    return updated;
  }

  delete(collection, id) {
    return this[collection].delete(id);
  }
}

module.exports = new Database();