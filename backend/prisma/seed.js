const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create organizations
  const acme = await prisma.organization.upsert({
    where: { slug: 'acme' },
    update: {},
    create: {
      name: 'Acme Corp',
      slug: 'acme',
    },
  });

  const techstart = await prisma.organization.upsert({
    where: { slug: 'techstart' },
    update: {},
    create: {
      name: 'TechStart Inc',
      slug: 'techstart',
    },
  });

  const hashedPassword = await bcrypt.hash('Admin@2024!', 10);

  // Create users for Acme Corp
  await prisma.user.upsert({
    where: { email: 'admin@acme.com' },
    update: {},
    create: {
      email: 'admin@acme.com',
      password: hashedPassword,
      role: 'admin',
      organizationId: acme.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'manager@acme.com' },
    update: {},
    create: {
      email: 'manager@acme.com',
      password: hashedPassword,
      role: 'manager',
      organizationId: acme.id,
    },
  });

  // Create users for TechStart Inc
  await prisma.user.upsert({
    where: { email: 'admin@techstart.com' },
    update: {},
    create: {
      email: 'admin@techstart.com',
      password: hashedPassword,
      role: 'admin',
      organizationId: techstart.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'member@techstart.com' },
    update: {},
    create: {
      email: 'member@techstart.com',
      password: hashedPassword,
      role: 'member',
      organizationId: techstart.id,
    },
  });

  // Create services for Acme Corp
  await prisma.service.createMany({
    data: [
      { name: 'Website', status: 'operational', organizationId: acme.id },
      { name: 'API', status: 'operational', organizationId: acme.id },
      { name: 'Database', status: 'degraded-performance', organizationId: acme.id },
    ],
  });

  // Create services for TechStart Inc
  await prisma.service.createMany({
    data: [
      { name: 'Mobile App', status: 'operational', organizationId: techstart.id },
      { name: 'Payment API', status: 'operational', organizationId: techstart.id },
      { name: 'Analytics', status: 'operational', organizationId: techstart.id },
    ],
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });