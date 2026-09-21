export interface Experience {
  role: string;
  company: string;
  companyUrl?: string;
  duration: string;
  description: string[];
  upcoming?: boolean;
  accentColor: string;
}

export const experiences: Experience[] = [
  {
    role: "Flutter Developer",
    company: "To Do List — School Project",
    duration: "Dec 2024",
    description: [
      "Implemented task management with features like add, edit, and delete tasks",
      "Built task management functionality for updating, adding, and deleting tasks",
      "Designed and implemented an intuitive user interface with Flutter widgets",
    ],
    accentColor: "#34D399",
  },
  {
    role: "Back-end Developer",
    company: "Packing Management System — Mentor Project",
    duration: "July–Aug 2024",
    description: [
      "Developed a Laravel landing page for an admin dashboard analytics system",
      "Implemented data aggregation for analytics visuals on the authentication part",
      "Implemented chart data and set up dynamic data numbers",
      "Tested API endpoints for tickets and users",
    ],
    accentColor: "#F472B6",
  },
];
