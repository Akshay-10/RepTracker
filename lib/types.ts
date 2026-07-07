export type ExerciseKind = "main" | "accessory" | "isolation";
export type JointStress = "low" | "moderate" | "high";
export type TrainingFocus = "strength" | "hypertrophy" | "pump" | "joint relief";

export type ExerciseVariant = {
  id?: string;
  name: string;
  angle: string;
  equipment: string;
  jointStress: JointStress;
};

export type WorkoutExercise = {
  id: string;
  slotId?: string;
  name: string;
  target: string;
  secondary: string[];
  movement: string;
  focus: string;
  equipment: string;
  sets: number;
  repMin: number;
  repMax: number;
  rest: number;
  previousBest: string;
  lastWeight: number;
  kind: ExerciseKind;
  goal: TrainingFocus;
  reason: string;
  formTip: string;
  mistake: string;
  variants: ExerciseVariant[];
  selectedVariant?: ExerciseVariant;
};

export type WorkoutDay = {
  databaseId?: string;
  key: string;
  day: string;
  shortDay: string;
  title: string;
  focus: string;
  duration: number;
  intensity: "Build" | "Heavy" | "Volume" | "Recovery";
  warmup: string[];
  exercises: WorkoutExercise[];
};

export type LoggedSet = {
  exerciseId: string;
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
};

export type CoachResponse = {
  summary: string;
  recommendations: Array<{
    type: string;
    exercise?: string;
    exercise_to_replace?: string;
    suggested_exercise?: string;
    reason: string;
  }>;
  warnings: string[];
  next_actions: string[];
  confidence: "low" | "medium" | "high";
  source?: "local" | "ai" | "cache";
};
