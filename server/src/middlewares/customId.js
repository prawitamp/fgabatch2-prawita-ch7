const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function generateCustomId() {
  let newId = '';

  const transaction = await prisma.$transaction(async (prisma) => {
    const lastUser = await prisma.users.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true },
    });

    if (lastUser) {
      const lastIdNumber = parseInt(lastUser.id.substring(7), 10);
      const newIdNumber = lastIdNumber + 1;
      newId = `U${new Date().toISOString().slice(2, 10).replace(/-/g, '')}${newIdNumber.toString().padStart(4, '0')}`;
    } else {
      newId = `U${new Date().toISOString().slice(2, 10).replace(/-/g, '')}0001`;
    }

    const existingUser = await prisma.users.findUnique({
      where: { id: newId },
    });

    if (existingUser) {
      throw new Error('Generated ID already exists. Please retry.');
    }

    return newId;
  });

  return transaction;
}

module.exports = generateCustomId;
