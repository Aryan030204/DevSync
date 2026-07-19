const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const connectDb = require("../config/database");
const User = require("../models/User");

const FIRST_NAMES = [
  "Aarav",
  "Maya",
  "Rohan",
  "Zara",
  "Ishaan",
  "Kiara",
  "Dev",
  "Anika",
  "Vihaan",
  "Meera",
  "Arjun",
  "Naina",
  "Kabir",
  "Tara",
];

const LAST_NAMES = [
  "Sharma",
  "Patel",
  "Reddy",
  "Kapoor",
  "Gupta",
  "Nair",
  "Joshi",
  "Mehta",
  "Saxena",
  "Bose",
];

const ABOUTS = [
  "Frontend engineer who enjoys building clean product flows.",
  "Backend-focused developer working on APIs and distributed systems.",
  "Full-stack builder exploring developer tools and AI products.",
  "Mobile engineer shipping polished user experiences.",
  "Data-minded developer who likes dashboards and automation.",
  "Product engineer interested in performance and design systems.",
];

const SKILL_SETS = [
  ["React", "JavaScript", "Tailwind CSS"],
  ["Node.js", "Express", "MongoDB"],
  ["TypeScript", "Next.js", "PostgreSQL"],
  ["Python", "Django", "Redis"],
  ["Java", "Spring Boot", "MySQL"],
  ["Docker", "AWS", "CI/CD"],
  ["React Native", "Firebase", "Expo"],
  ["GraphQL", "Apollo", "Jest"],
];

const PHOTO_URLS = [
  "https://randomuser.me/api/portraits/men/11.jpg",
  "https://randomuser.me/api/portraits/women/12.jpg",
  "https://randomuser.me/api/portraits/men/13.jpg",
  "https://randomuser.me/api/portraits/women/14.jpg",
  "https://randomuser.me/api/portraits/men/15.jpg",
  "https://randomuser.me/api/portraits/women/16.jpg",
  "https://randomuser.me/api/portraits/men/17.jpg",
  "https://randomuser.me/api/portraits/women/18.jpg",
  "https://randomuser.me/api/portraits/men/19.jpg",
  "https://randomuser.me/api/portraits/women/20.jpg",
];

function pick(list, index) {
  return list[index % list.length];
}

function buildSeedUsers() {
  return Array.from({ length: 10 }, (_, index) => {
    const firstName = pick(FIRST_NAMES, index * 3 + 1);
    const lastName = pick(LAST_NAMES, index * 2 + 2);
    const skillSet = pick(SKILL_SETS, index);
    const gender = index % 3 === 0 ? "male" : index % 3 === 1 ? "female" : "others";

    return {
      firstName,
      lastName,
      emailId: `seed.user${index + 1}@devsync.app`,
      password: "DevSync@123",
      age: 22 + index,
      gender,
      photoUrl: pick(PHOTO_URLS, index),
      about: pick(ABOUTS, index),
      skills: skillSet,
    };
  });
}

async function seedUsers() {
  await connectDb();

  const seedUsersData = buildSeedUsers();
  const hashedPassword = await bcrypt.hash("DevSync@123", 10);

  const operations = seedUsersData.map((user) => ({
    updateOne: {
      filter: { emailId: user.emailId },
      update: {
        $set: {
          ...user,
          password: hashedPassword,
        },
      },
      upsert: true,
    },
  }));

  const result = await User.bulkWrite(operations);
  const totalSeededUsers = await User.countDocuments({
    emailId: { $regex: /^seed\.user\d+@devsync\.app$/ },
  });

  console.log(
    JSON.stringify(
      {
        acknowledged: result.acknowledged,
        insertedCount: result.upsertedCount || 0,
        modifiedCount: result.modifiedCount || 0,
        matchedCount: result.matchedCount || 0,
        totalSeededUsers,
        loginPassword: "DevSync@123",
      },
      null,
      2
    )
  );
}

seedUsers()
  .catch((error) => {
    console.error("Failed to seed users:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
