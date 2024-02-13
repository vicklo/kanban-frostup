
/**
 * Niet slecht, maar als je bijvoorbeeld Swagger gebruikt, kan je ook je interfaces daar definieren.
 * Dan kan je die interfaces ook gebruiken in je Vue app (automatisch gegenereerd).
 * Kan ik wel een keer laten zien.
 * Enige nitpick: "task" kan je beter "Task" noemen, omdat het zo ook als entity heet.
 */
export interface Task {
  id: number;
  title: string;
  priority: string;
  description: string;
  lane: string;
}
