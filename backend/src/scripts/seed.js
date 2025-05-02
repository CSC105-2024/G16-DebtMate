import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting to seed database...");

  // Delete all existing records first
  await prisma.user.deleteMany();

  console.log("Creating sample users...");

  // Create some default users
  const defaultPassword = await bcrypt.hash("password123", 10);

  const users = [
    {
      name: "Alan Smith",
      username: "alan123",
      email: "alan@example.com",
      password: defaultPassword,
    },
    {
      name: "Beauz Johnson",
      username: "beauz456",
      email: "beauz@example.com",
      password: defaultPassword,
    },
    {
      name: "Colde Williams",
      username: "colde789",
      email: "colde@example.com",
      password: defaultPassword,
    },
    {
      name: "Diana Brown",
      username: "diana123",
      email: "diana@example.com",
      password: defaultPassword,
    },
    {
      name: "Eduardo Davis",
      username: "eduardo456",
      email: "eduardo@example.com",
      password: defaultPassword,
    },
  ];

  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  console.log("Database seeding completed");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
