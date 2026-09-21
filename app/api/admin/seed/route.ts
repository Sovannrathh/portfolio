import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import Project from "@/models/Project";
import Certification from "@/models/Certification";
import Social from "@/models/Social";
import SkillCategory from "@/models/SkillCategory";
import HeroModel from "@/models/Hero";
import AboutModel from "@/models/About";

/**
 * POST /api/admin/seed
 *
 * Seeds the database with the current static data from the codebase.
 * Requires a secret key in the request body to prevent accidental runs.
 * Only creates data if collections are empty (safe to re-run).
 */
export async function POST(req: NextRequest) {
  const { secret, adminUsername, adminPassword } = await req.json();

  if (secret !== process.env.SEED_SECRET) {
    return Response.json({ error: "Invalid seed secret" }, { status: 403 });
  }

  await dbConnect();

  const results: Record<string, string> = {};

  // 1. Seed admin (only if none exist)
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0 && adminUsername && adminPassword) {
    await Admin.create({ username: adminUsername, password: adminPassword });
    results.admin = "Created";
  } else {
    results.admin = adminCount > 0 ? "Already exists" : "Skipped (no credentials)";
  }

  // 2. Seed hero
  const heroCount = await HeroModel.countDocuments();
  if (heroCount === 0) {
    await HeroModel.create({
      greeting: "Hey, I'm",
      name: "Kim Sovannrath",
      tagline:
        "Web developer intern who enjoys solving problems and learning new things through code — from Laravel back ends to Flutter apps.",
      splineUrl:
        "https://prod.spline.design/AeryvEqWxr2qjINc/scene.splinecode",
    });
    results.hero = "Created";
  } else {
    results.hero = "Already exists";
  }

  // 3. Seed about
  const aboutCount = await AboutModel.countDocuments();
  if (aboutCount === 0) {
    await AboutModel.create({
      heading: "Who I am & What I offer",
      paragraphs: [
        "I'm Kim Sovannrath — a curious and enthusiastic web developer intern who loves solving problems and learning new things through coding. I work well in teams where I can learn from others and share ideas, and I'm always ready for feedback that helps me improve.",
        "Currently studying Computer Science with a specialization in Software Engineering at CADT, I'm aiming toward designing, maintaining, and developing software systems — with hands-on experience across Laravel back ends and Flutter mobile apps.",
      ],
    });
    results.about = "Created";
  } else {
    results.about = "Already exists";
  }

  // 4. Seed projects
  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    await Project.insertMany([
      {
        title: "Packing Management System",
        subtitle: "Admin dashboard analytics — Mentor Project",
        description:
          "A Laravel-based admin dashboard with an analytics landing page, authentication, dynamic charts, and API-driven ticket and user management.",
        githubUrl: "#",
        tags: ["PHP", "Laravel", "Analytics", "REST API"],
        accentColor: "#F472B6",
        order: 0,
      },
      {
        title: "To Do List",
        subtitle: "Flutter mobile app — School Project",
        description:
          "A task management mobile app built with Flutter, supporting adding, editing, updating, and deleting tasks through an intuitive UI.",
        githubUrl: "#",
        tags: ["Flutter", "Dart", "Mobile"],
        accentColor: "#34D399",
        order: 1,
      },
    ]);
    results.projects = `Created 2`;
  } else {
    results.projects = `Already has ${projectCount}`;
  }

  // 5. Seed certifications
  const certCount = await Certification.countDocuments();
  if (certCount === 0) {
    results.certifications = `None to seed`;
  } else {
    results.certifications = `Already has ${certCount}`;
  }

  // 6. Seed socials
  const socialCount = await Social.countDocuments();
  if (socialCount === 0) {
    results.socials = `None to seed`;
  } else {
    results.socials = `Already has ${socialCount}`;
  }

  // 7. Seed skill categories
  const skillCount = await SkillCategory.countDocuments();
  if (skillCount === 0) {
    await SkillCategory.insertMany([
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
    ]);
    results.skills = `Created 3 categories`;
  } else {
    results.skills = `Already has ${skillCount} categories`;
  }

  return Response.json({ success: true, results });
}
