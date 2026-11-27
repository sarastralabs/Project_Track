import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { ProjectStatus, ProjectType, UserRole } from "@sarastra/shared";

import { connectMongo, disconnectMongo } from "./connection.js";

const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../../apps/api/.env");
loadEnv({ path: envPath });

import { Client } from "./models/client.js";
import { Project } from "./models/project.js";
import { ProjectTemplate } from "./models/project-template.js";
import { User } from "./models/user.js";

async function seed() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME ?? "sarastra_hub";
  if (!uri) {
    throw new Error("MONGODB_URI is required");
  }

  await connectMongo(uri, dbName);

  const ownerEmail = "owner@sarastralabs.com";
  let owner = await User.findOne({ email: ownerEmail });
  if (!owner) {
    owner = await User.create({
      name: "Sarastra Owner",
      email: ownerEmail,
      role: UserRole.OWNER,
      emailVerified: true,
    });
  }

  let team = await User.findOne({ email: "dev@sarastralabs.com" });
  if (!team) {
    team = await User.create({
      name: "Team Dev",
      email: "dev@sarastralabs.com",
      role: UserRole.TEAM,
      emailVerified: true,
    });
  }

  let client = await Client.findOne({ name: "Acme Sample Client" });
  if (!client) {
    client = await Client.create({
      name: "Acme Sample Client",
      company: "Acme Pvt Ltd",
      contacts: [{ name: "Priya", email: "priya@acme.example", isPrimary: true }],
    });
  }

  const websiteTemplate = await ProjectTemplate.findOneAndUpdate(
    { name: "Website default", type: ProjectType.WEBSITE },
    {
      $setOnInsert: {
        name: "Website default",
        type: ProjectType.WEBSITE,
        description: "Default website milestones",
        defaultMilestones: [
          { title: "Discovery", order: 1 },
          { title: "Design", order: 2 },
          { title: "Build", order: 3 },
          { title: "Launch", order: 4 },
        ],
      },
    },
    { upsert: true, new: true },
  );

  const existingProject = await Project.findOne({ title: "Acme Marketing Site" });
  if (!existingProject) {
    await Project.create({
      title: "Acme Marketing Site",
      type: ProjectType.WEBSITE,
      status: ProjectStatus.ACTIVE,
      clientId: client._id,
      ownerId: owner._id,
      memberIds: [team._id],
      templateId: websiteTemplate?._id,
      milestones: [
        { title: "Discovery", status: "DONE", order: 1 },
        { title: "Design", status: "IN_PROGRESS", order: 2 },
        { title: "Build", status: "PENDING", order: 3 },
        { title: "Launch", status: "PENDING", order: 4 },
      ],
      progressPercent: 35,
      tags: ["website", "priority"],
    });
  }

  console.log("Seed complete:", {
    owner: owner.email,
    team: team.email,
    client: client.name,
  });

  await disconnectMongo();
}

seed().catch(async (error) => {
  console.error(error);
  await disconnectMongo().catch(() => undefined);
  process.exit(1);
});
