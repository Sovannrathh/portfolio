/**
 * Seed script — run once to populate MongoDB with all current portfolio data
 * and create your admin account.
 *
 * Usage:
 *   npm run seed
 *
 * Requires in .env.local:
 *   MONGODB_URI=...
 *   ADMIN_USERNAME=...
 *   ADMIN_PASSWORD=...
 */

import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/* ------------------------------------------------------------------ */
/*  Inline Mongoose schemas (avoids path-alias issues outside Next)    */
/* ------------------------------------------------------------------ */

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const HeroSchema = new mongoose.Schema({
  greeting: { type: String, default: "Hey, I'm" },
  name: { type: String, required: true },
  tagline: { type: String, required: true },
  splineUrl: { type: String },
}, { timestamps: true });

const AboutSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  paragraphs: [{ type: String }],
}, { timestamps: true });

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String, required: true },
  image: { type: String },
  video: { type: String },
  liveUrl: { type: String },
  githubUrl: { type: String, required: true },
  tags: [{ type: String }],
  accentColor: { type: String, default: "#3B82F6" },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const CertificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const SocialSchema = new mongoose.Schema({
  platform: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const SkillSchema = new mongoose.Schema({ name: String, iconKey: String }, { _id: false });
const SkillCategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  categoryIconKey: { type: String, required: true },
  color: String,
  gradientFrom: String,
  gradientTo: String,
  gradientColor: String,
  span: { type: String, default: "col-span-3 lg:col-span-1" },
  skills: [SkillSchema],
  order: { type: Number, default: 0 },
}, { timestamps: true });

/* ------------------------------------------------------------------ */
/*  Models                                                             */
/* ------------------------------------------------------------------ */

const Admin          = mongoose.models.Admin          || mongoose.model("Admin", AdminSchema);
const Hero           = mongoose.models.Hero           || mongoose.model("Hero", HeroSchema);
const About          = mongoose.models.About          || mongoose.model("About", AboutSchema);
const Project        = mongoose.models.Project        || mongoose.model("Project", ProjectSchema);
const Certification  = mongoose.models.Certification  || mongoose.model("Certification", CertificationSchema);
const Social         = mongoose.models.Social         || mongoose.model("Social", SocialSchema);
const SkillCategory  = mongoose.models.SkillCategory  || mongoose.model("SkillCategory", SkillCategorySchema);

/* ------------------------------------------------------------------ */
/*  Main seed function                                                 */
/* ------------------------------------------------------------------ */

const heroData = {
  greeting: "Hey, I'm",
  name: "Kim Sovannrath",
  tagline: "Web developer intern who enjoys solving problems and learning new things through code\u00A0\u2014 from Laravel back ends to Flutter apps.",
  splineUrl: "https://prod.spline.design/AeryvEqWxr2qjINc/scene.splinecode",
};

const aboutData = {
  heading: "Who I am & What I offer",
  paragraphs: [
    "I'm Kim Sovannrath \u2014 a curious and enthusiastic web developer intern who loves solving problems and learning new things through coding. I work well in teams where I can learn from others and share ideas, and I'm always ready for feedback that helps me improve.",
    "Currently studying Computer Science with a specialization in Software Engineering at CADT, I'm aiming toward designing, maintaining, and developing software systems \u2014 with hands-on experience across Laravel back ends and Flutter mobile apps.",
  ],
};

const projectsData = [
  {
    title: "Packing Management System",
    subtitle: "Admin dashboard analytics \u2014 Mentor Project",
    description: "A Laravel-based admin dashboard with an analytics landing page, authentication, dynamic charts, and API-driven ticket and user management.",
    githubUrl: "#",
    tags: ["PHP", "Laravel", "Analytics", "REST API"],
    accentColor: "#F472B6",
    order: 0,
  },
  {
    title: "To Do List",
    subtitle: "Flutter mobile app \u2014 School Project",
    description: "A task management mobile app built with Flutter, supporting adding, editing, updating, and deleting tasks through an intuitive UI.",
    githubUrl: "#",
    tags: ["Flutter", "Dart", "Mobile"],
    accentColor: "#34D399",
    order: 1,
  },
];

const certificationsData: { name: string; image: string; link?: string; order: number }[] = [];

const socialsData: { platform: string; url: string; order: number }[] = [];

const skillCategoriesData = [
  {
    title: "Programming Languages",
    categoryIconKey: "Code2",
    color: "#F472B5",
    gradientFrom: "#F472B6",
    gradientTo: "#FBBF24",
    gradientColor: "#F472B6",
    span: "col-span-1",
    skills: [
      { name: "C / C++", iconKey: "cpp" },
      { name: "HTML", iconKey: "html" },
      { name: "CSS", iconKey: "css" },
    ],
    order: 0,
  },
  {
    title: "Frameworks",
    categoryIconKey: "Monitor",
    color: "#60A5FA",
    gradientFrom: "#60A5FA",
    gradientTo: "#A78BFA",
    gradientColor: "#60A5FA",
    span: "col-span-1",
    skills: [
      { name: "PHP", iconKey: "php" },
      { name: "Laravel", iconKey: "laravel" },
      { name: "Flutter", iconKey: "flutter" },
    ],
    order: 1,
  },
  {
    title: "Tools",
    categoryIconKey: "Database",
    color: "#34D399",
    gradientFrom: "#34D399",
    gradientTo: "#FBBF24",
    gradientColor: "#34D399",
    span: "col-span-1",
    skills: [
      { name: "Git", iconKey: "git" },
      { name: "GitHub", iconKey: "github" },
      { name: "Postman", iconKey: "postman" },
    ],
    order: 2,
  },
];

/* ------------------------------------------------------------------ */
/*  Main seed function                                                 */
/* ------------------------------------------------------------------ */

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ MONGODB_URI is not set. Add it to your .env.local file.");
    process.exit(1);
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    console.error("❌ ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env.local");
    process.exit(1);
  }

  console.log("\n🌱 Portfolio Database Seeder\n");
  console.log("⏳ Connecting to MongoDB…");
  await mongoose.connect(uri);
  console.log("✅ Connected\n");

  const results: Record<string, string> = {};

  // 1. Admin
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(adminPassword, salt);
    await Admin.create({ username: adminUsername, password: hashed });
    results["Admin"] = `✅ Created (${adminUsername})`;
  } else {
    results["Admin"] = "⏭️  Already exists — skipped";
  }

  // 2. Hero
  const heroCount = await Hero.countDocuments();
  if (heroCount === 0) {
    await Hero.create(heroData);
    results["Hero"] = "✅ Created";
  } else {
    results["Hero"] = "⏭️  Already exists — skipped";
  }

  // 3. About
  const aboutCount = await About.countDocuments();
  if (aboutCount === 0) {
    await About.create(aboutData);
    results["About"] = "✅ Created";
  } else {
    results["About"] = "⏭️  Already exists — skipped";
  }

  // 4. Projects
  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    await Project.insertMany(projectsData);
    results["Projects"] = `✅ Created ${projectsData.length} projects`;
  } else {
    results["Projects"] = `⏭️  Already has ${projectCount} — skipped`;
  }

  // 5. Certifications
  const certCount = await Certification.countDocuments();
  if (certCount === 0) {
    await Certification.insertMany(certificationsData);
    results["Certifications"] = `✅ Created ${certificationsData.length} certifications`;
  } else {
    results["Certifications"] = `⏭️  Already has ${certCount} — skipped`;
  }

  // 6. Socials
  const socialCount = await Social.countDocuments();
  if (socialCount === 0) {
    await Social.insertMany(socialsData);
    results["Socials"] = `✅ Created ${socialsData.length} socials`;
  } else {
    results["Socials"] = `⏭️  Already has ${socialCount} — skipped`;
  }

  // 7. Skill Categories
  const skillCount = await SkillCategory.countDocuments();
  if (skillCount === 0) {
    await SkillCategory.insertMany(skillCategoriesData);
    results["Skills"] = `✅ Created ${skillCategoriesData.length} categories`;
  } else {
    results["Skills"] = `⏭️  Already has ${skillCount} — skipped`;
  }

  // Print summary
  console.log("─".repeat(45));
  for (const [key, val] of Object.entries(results)) {
    console.log(`  ${key.padEnd(18)} ${val}`);
  }
  console.log("─".repeat(45));
  console.log("\n🎉 Seed complete! Log in at /admin\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
