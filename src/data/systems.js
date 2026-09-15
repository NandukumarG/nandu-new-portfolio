export const fullStackProjects = [
  {
    id: "01",
    name: "FieldOps",
    category: "Full stack",
    type: "Operations, without the friction.",
    description:
      "A considered workspace that brings people, resources, and everyday operations together.",
    tags: ["React", "FastAPI", "PostgreSQL"],
    visual: "operations",
    challenge:
      "Field teams need a clear shared picture of their work. This concept explores how tasks, people, and activity can live in one focused workspace.",
    approach:
      "A React interface pairs with a proposed FastAPI service and PostgreSQL data model. Role-based access, optimistic updates, and an auditable activity stream shape the architecture.",
  },
  {
    id: "02",
    name: "Launchpad",
    category: "Deployment",
    type: "From commit to confidence.",
    description:
      "An exploration of a quieter, more transparent path from source code to production.",
    tags: ["Docker", "GitHub Actions", "AWS"],
    visual: "deployment",
    challenge:
      "Shipping should be repeatable and easy to understand. This concept makes every deployment stage visible, from a new commit to a healthy production service.",
    approach:
      "The proposed pipeline builds an immutable container, runs checks, and promotes the same artifact through staging and production, with health checks and a rollback path.",
  },
];
