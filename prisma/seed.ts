import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  await prisma.savedCollege.deleteMany();
  await prisma.review.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();

  const colleges = [
    { name: "Indian Institute of Technology Bombay", location: "Mumbai", state: "Maharashtra", type: "Public", fees: 250000, rating: 4.8, description: "Premier engineering institution in India.", established: 1958, website: "https://www.iitb.ac.in" },
    { name: "Indian Institute of Technology Delhi", location: "New Delhi", state: "Delhi", type: "Public", fees: 240000, rating: 4.7, description: "Top ranked technical university in India.", established: 1961, website: "https://home.iitd.ac.in" },
    { name: "BITS Pilani", location: "Pilani", state: "Rajasthan", type: "Private", fees: 550000, rating: 4.5, description: "Leading private technical university.", established: 1964, website: "https://www.bits-pilani.ac.in" },
    { name: "NIT Trichy", location: "Tiruchirappalli", state: "Tamil Nadu", type: "Public", fees: 150000, rating: 4.4, description: "Top National Institute of Technology.", established: 1964, website: "https://www.nitt.edu" },
    { name: "VIT Vellore", location: "Vellore", state: "Tamil Nadu", type: "Private", fees: 480000, rating: 4.2, description: "Popular private engineering university.", established: 1984, website: "https://vit.ac.in" },
    { name: "Delhi Technological University", location: "New Delhi", state: "Delhi", type: "Public", fees: 180000, rating: 4.1, description: "Formerly Delhi College of Engineering.", established: 1941, website: "https://www.dtu.ac.in" },
  ];

  for (const data of colleges) {
    const college = await prisma.college.create({ data });
    console.log("Created:", college.name);

    await prisma.course.createMany({
      data: [
        { name: "B.Tech Computer Science", duration: 4, fees: data.fees, seats: 120, collegeId: college.id },
        { name: "B.Tech Electronics", duration: 4, fees: data.fees - 10000, seats: 90, collegeId: college.id },
        { name: "M.Tech AI", duration: 2, fees: data.fees + 50000, seats: 40, collegeId: college.id },
      ],
    });

    await prisma.placement.create({
      data: {
        year: 2024,
        averagePackage: Math.floor(Math.random() * 10 + 10),
        highestPackage: Math.floor(Math.random() * 30 + 40),
        placementRate: Math.floor(Math.random() * 20 + 80),
        collegeId: college.id,
      },
    });
  }

  console.log("✅ Seed complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
