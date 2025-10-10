export type EditorMode = "plan" | "routes" | "points";

export type EditorNode = {
  id: number;
  position: { x: number; z: number };
  parentId: number | null;
};

export const MODE_FILES: Record<EditorMode, string> = {
  plan: "floorPlan.json",
  routes: "data.json",
  points: "checkpoints.json",
};

export const MODE_COLORS: Record<EditorMode, string> = {
  plan: "#e53935",
  routes: "#1e88e5",
  points: "#43a047",
};


