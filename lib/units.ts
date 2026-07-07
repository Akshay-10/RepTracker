export type WeightUnit = "kg" | "lb";

const KG_TO_LB = 2.2046226218;

export function normalizeWeightUnit(value: unknown): WeightUnit {
  return value === "lb" ? "lb" : "kg";
}

export function kgToUnit(valueKg: number, unit: WeightUnit) {
  return unit === "lb" ? valueKg * KG_TO_LB : valueKg;
}

export function unitToKg(value: number, unit: WeightUnit) {
  return unit === "lb" ? value / KG_TO_LB : value;
}

export function displayWeight(
  valueKg: number | null | undefined,
  unit: WeightUnit,
  digits = 1,
) {
  if (valueKg === null || valueKg === undefined || Number.isNaN(valueKg)) {
    return "—";
  }
  return `${kgToUnit(valueKg, unit).toFixed(digits)} ${unit}`;
}

export function displayWeightValue(
  valueKg: number | null | undefined,
  unit: WeightUnit,
  digits = 1,
) {
  if (valueKg === null || valueKg === undefined || Number.isNaN(valueKg)) {
    return "";
  }
  return kgToUnit(valueKg, unit).toFixed(digits);
}

export function displayLoadInput(valueKg: number, unit: WeightUnit) {
  const value = kgToUnit(valueKg, unit);
  if (!Number.isFinite(value)) return "0";
  if (value === 0) return "0";
  return Number(value.toFixed(unit === "lb" ? 1 : 2)).toString();
}

export function displayVolume(valueKg: number, unit: WeightUnit) {
  return `${Math.round(kgToUnit(valueKg, unit)).toLocaleString()} ${unit}`;
}

export function convertVolumePoint<T extends { volume: number }>(
  point: T,
  unit: WeightUnit,
) {
  return {
    ...point,
    volume: Math.round(kgToUnit(point.volume, unit)),
  };
}

export function displayRecordResult(
  weightKg: number | null | undefined,
  reps: number | null | undefined,
  estimatedOneRepMaxKg: number | null | undefined,
  unit: WeightUnit,
) {
  if (typeof weightKg === "number" && Number.isFinite(weightKg) && reps) {
    return `${displayWeight(weightKg, unit)} × ${reps}`;
  }
  if (typeof weightKg === "number" && Number.isFinite(weightKg)) {
    return displayWeight(weightKg, unit);
  }
  return `${displayWeight(estimatedOneRepMaxKg ?? 0, unit)} est. 1RM`;
}
