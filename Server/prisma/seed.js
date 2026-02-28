/* eslint-disable no-console */
const bcrypt = require('bcrypt');
const { PrismaClient, Role } = require('@prisma/client');

const prisma = new PrismaClient();

// Default admin credentials (use env vars to override)
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@sofa.com';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: DEFAULT_ADMIN_EMAIL },
  });

  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);

  if (existingAdmin) {
    // Update password and ensure role is ADMIN (in case it was changed)
    await prisma.user.update({
      where: { email: DEFAULT_ADMIN_EMAIL },
      data: { password: passwordHash, role: Role.ADMIN },
    });
    console.log('Admin user updated. Use these credentials to log in to the dashboard:');
  } else {
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: DEFAULT_ADMIN_EMAIL,
        password: passwordHash,
        role: Role.ADMIN,
      },
    });
    console.log('Admin user created. Use these credentials to log in to the dashboard:');
  }

  console.log('');
  console.log('  Email:    ', DEFAULT_ADMIN_EMAIL);
  console.log('  Password: ', DEFAULT_ADMIN_PASSWORD);
  console.log('');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

