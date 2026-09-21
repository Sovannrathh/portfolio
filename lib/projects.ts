export interface Project {
  title: string;
  subtitle?: string;
  description: string;
  image?: string; // path to screenshot / preview image
  video?: string; // path to video preview (takes precedence over image)
  liveUrl?: string; // live demo link (optional)
  githubUrl: string; // GitHub repo link
  tags: string[]; // tech stack tags
  accentColor: string; // accent colour used for the card
}


export const projects: Project[] = [
  {
    title: "Packing Management System",
    subtitle: "Admin dashboard analytics — Mentor Project",
    description:
      "A Laravel-based admin dashboard with an analytics landing page, authentication, dynamic charts, and API-driven ticket and user management.",
    githubUrl: "#", // TODO: add repo link
    tags: ["PHP", "Laravel", "Analytics", "REST API"],
    accentColor: "#F472B6",
  },
  {
    title: "To Do List",
    subtitle: "Flutter mobile app — School Project",
    description:
      "A task management mobile app built with Flutter, supporting adding, editing, updating, and deleting tasks through an intuitive UI.",
    githubUrl: "#", // TODO: add repo link
    tags: ["Flutter", "Dart", "Mobile"],
    accentColor: "#34D399",
  },
];
