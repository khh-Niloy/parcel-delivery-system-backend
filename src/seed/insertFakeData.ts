import mongoose, { Types } from "mongoose";
import { faker } from "@faker-js/faker";
import { User } from "../app/modules/user/user.model";
import { AvailableStatus, ExperienceLevel, Role, VehicleType } from "../app/modules/user/user.interface";
import { envVars } from "../app/config/env.config";

function generateBDNumber(): string {
    let number = "01";
    for (let i = 0; i < 9; i++) {
      number += Math.floor(Math.random() * 10); // 0-9
    }
    return number;
}

function generateBDAddress(): string {
  const bdDistricts = [
    "Dhaka", "Chattogram", "Khulna", "Rajshahi", "Sylhet",
    "Barishal", "Rangpur", "Mymensingh", "Cumilla", "Gazipur",
    "Narayanganj", "Jessore", "Cox's Bazar", "Bogura", "Pabna"
  ];
  return `${faker.location.streetAddress()}, ${faker.helpers.arrayElement(bdDistricts)}, Bangladesh`;
}
  
// ------------------- Helper to create a user ------------------- //
function createUser(role: Role) {
  const baseUser = {
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    phone: generateBDNumber(),
    password: "123456", // dummy password
    address: {
      latitude: parseFloat((20.7 + Math.random() * (26.7 - 20.7)).toFixed(6)),
      longitude: parseFloat((88.0 + Math.random() * (92.7 - 88.0)).toFixed(6)),
      address: generateBDAddress()
    },
    role: role,
    auths: [] as any[]
  };

//   if (role === Role.DELIVERY_AGENT) {
//     return {
//       ...baseUser,
//       availableStatus: AvailableStatus.OFFLINE,
//       completedDeliveries: 0,
//       vehicleType: faker.helpers.arrayElement([
//         VehicleType.bike,
//         VehicleType.car,
//         VehicleType.van,
//         VehicleType.other
//       ]),
//       licenseNumber: faker.string.alphanumeric(10),
//       experienceLevel: faker.helpers.arrayElement([
//         ExperienceLevel.BEGINNER,
//         ExperienceLevel.INTERMEDIATE,
//         ExperienceLevel.EXPERT
//       ]),
//       currentLocation: {
//         latitude: parseFloat((20.7 + Math.random() * (26.7 - 20.7)).toFixed(6)),
//         longitude: parseFloat((88.0 + Math.random() * (92.7 - 88.0)).toFixed(6))
//       },
//       assignedParcels: [],
//       currentParcelId: null
//     };
//   }

  return baseUser;
}

// ------------------- Seed Function ------------------- //
async function seedDatabase() {
  await mongoose.connect(envVars.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // ---------- Create Users ----------
  const totalSenders = 2000;
  const totalReceivers = 2000;
  const totalDeliveryAgents = 1;

  console.log("Creating senders...");
  const senders = await User.insertMany(
    Array.from({ length: totalSenders }, () => createUser(Role.SENDER))
  );

  console.log("Creating receivers...");
  const receivers = await User.insertMany(
    Array.from({ length: totalReceivers }, () => createUser(Role.RECEIVER))
  );

//   console.log("Creating delivery agents...");
//   const deliveryAgents = await User.insertMany(
//     Array.from({ length: totalDeliveryAgents }, () => createUser(Role.DELIVERY_AGENT))
//   );

  await mongoose.disconnect();
}

seedDatabase().catch((err) => console.error(err));
