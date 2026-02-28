#!/usr/bin/env node
/**
 * Promote an existing user to ADMIN by email.
 * Usage: node scripts/promote-admin.js <email>
 * Example: node scripts/promote-admin.js vishaltinani60@gmail.com
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node scripts/promote-admin.js <email>');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error('User not found with email:', email);
    process.exit(1);
  }

  if (user.role === 'ADMIN') {
    console.log('User is already an admin:', email);
    return;
  }

  await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' },
  });

  console.log('Promoted to ADMIN:', email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
