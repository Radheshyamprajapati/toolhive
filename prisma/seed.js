const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const password = bcrypt.hashSync("demo1234", 10);

  const john = await prisma.user.create({
    data: {
      name: "John Electrician",
      email: "john@demo.com",
      password,
      role: "TRADESMAN",
      location: "Austin, TX",
    },
  });

  const sarah = await prisma.user.create({
    data: {
      name: "Sarah Builder",
      email: "sarah@demo.com",
      password,
      role: "TRADESMAN",
      location: "Denver, CO",
    },
  });

  const tom = await prisma.user.create({
    data: {
      name: "Tom Renter",
      email: "tom@demo.com",
      password,
      role: "USER",
      location: "Chicago, IL",
    },
  });

  const tools = [
    {
      name: "Bosch Rotary Hammer",
      description: "Heavy-duty concrete drill, 850W, includes 3 bits.",
      category: "Power Tools",
      pricePerDay: 18,
      location: "Austin, TX",
      condition: "Excellent",
      image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400",
      ownerId: john.id,
    },
    {
      name: "Mini Excavator Kubota U-17",
      description: "Compact excavator suitable for small earthmoving jobs.",
      category: "Heavy Machinery",
      pricePerDay: 450,
      location: "Denver, CO",
      condition: "Good",
      image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=400",
      ownerId: sarah.id,
    },
    {
      name: "DeWalt Cordless Drill Set",
      description: "20V max, includes two batteries and charger.",
      category: "Power Tools",
      pricePerDay: 12,
      location: "Austin, TX",
      condition: "Like New",
      image: "https://images.unsplash.com/photo-1517164852305-99a3e65bb47e?w=400",
      ownerId: john.id,
    },
    {
      name: "Bosch Laser Level",
      description: "Self-leveling cross-line laser, perfect for construction.",
      category: "Measuring Tools",
      pricePerDay: 8,
      location: "Denver, CO",
      condition: "Excellent",
      image: "https://images.unsplash.com/photo-1526948531399-320e7e40f0ca?w=400",
      ownerId: sarah.id,
    },
    {
      name: "Heavy Duty Generac Generator",
      description: "7500W portable generator, electric start.",
      category: "Generators",
      pricePerDay: 60,
      location: "Chicago, IL",
      condition: "Good",
      image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400",
      ownerId: tom.id,
    },
    {
      name: "Werner Extension Ladder",
      description: "28 ft aluminum extension ladder, 300 lb rating.",
      category: "Ladders",
      pricePerDay: 15,
      location: "Austin, TX",
      condition: "Good",
      image: "https://images.unsplash.com/photo-1590005354167-6da94370c0b6?w=400",
      ownerId: john.id,
    },
    {
      name: "Bauer Table Saw",
      description: "10-inch sliding compound miter saw.",
      category: "Power Tools",
      pricePerDay: 30,
      location: "Denver, CO",
      condition: "Good",
      image: "https://images.unsplash.com/photo-1527683601-d6a58494c6a3?w=400",
      ownerId: sarah.id,
    },
    {
      name: "Ridgid Wet/Dry Vacuum",
      description: "16 gallon, 5 HP, perfect for cleanup.",
      category: "Cleaning",
      pricePerDay: 10,
      location: "Chicago, IL",
      condition: "New",
      image: "https://images.unsplash.com/photo-1621842057727-e31eeaeb0f96?w=400",
      ownerId: tom.id,
    },
  ];

  for (const tool of tools) {
    await prisma.tool.create({ data: tool });
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
