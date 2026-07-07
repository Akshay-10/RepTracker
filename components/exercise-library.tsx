"use client";

import {
  ArrowRight,
  Dumbbell,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeading } from "@/components/ui";
import type { LiveLibraryExercise } from "@/lib/live-data";

export function ExerciseLibrary({
  catalog,
}: {
  catalog: LiveLibraryExercise[];
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [equipment, setEquipment] = useState("All");
  const [movement, setMovement] = useState("All");
  const equipmentOptions = useMemo(
    () => ["All", ...new Set(catalog.map((item) => item.equipment))],
    [catalog],
  );
  const movementOptions = useMemo(
    () => ["All", ...new Set(catalog.map((item) => item.movement))],
    [catalog],
  );
  const muscleFilters = useMemo(
    () => [
      "All",
      ...new Set(
        catalog.flatMap((item) => [item.target, ...item.secondary]).filter(Boolean),
      ),
    ],
    [catalog],
  );
  const exercises = useMemo(() => {
    return catalog.filter((item) => {
      const matchesFilter =
        filter === "All" ||
        item.target.toLowerCase().includes(filter.toLowerCase()) ||
        item.secondary.some((muscle) =>
          muscle.toLowerCase().includes(filter.toLowerCase()),
        );
      const haystack = `${item.name} ${item.target} ${item.movement} ${item.equipment}`.toLowerCase();
      return (
        matchesFilter &&
        (equipment === "All" || item.equipment === equipment) &&
        (movement === "All" || item.movement === movement) &&
        haystack.includes(query.toLowerCase())
      );
    });
  }, [catalog, query, filter, equipment, movement]);

  return (
    <>
      <PageHeading
        eyebrow="MOVEMENT LIBRARY"
        title="Find the right tool."
        copy="Explore the movements in your plan, understand their intent, and choose compatible variations."
        actions={<span className="source-pill ai">Live catalog</span>}
      />

      <div className="library-toolbar">
        <label className="search-field">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search exercises, muscles, equipment…"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search">
              <X size={15} />
            </button>
          )}
        </label>
        <label className="filter-select">
          <span>Equipment</span>
          <select value={equipment} onChange={(event) => setEquipment(event.target.value)}>
            {equipmentOptions.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
        </label>
        <label className="filter-select">
          <span>Movement</span>
          <select value={movement} onChange={(event) => setMovement(event.target.value)}>
            {movementOptions.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <div className="filter-pills">
        {muscleFilters.map((item) => (
          <button
            className={filter === item ? "active" : ""}
            onClick={() => setFilter(item)}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="library-count">
        <span><strong>{exercises.length}</strong> movements</span>
          <span>Sorted by <strong>Muscle and name</strong></span>
      </div>

      {exercises.length ? (
        <div className="exercise-grid">
          {exercises.map((item, index) => (
            <Link className="library-card" href={`/exercises/${item.id}`} key={item.id}>
              <div className={`exercise-visual visual-${index % 5}`}>
                <span className="exercise-visual-index">{String(index + 1).padStart(2, "0")}</span>
                <Dumbbell size={36} strokeWidth={1.2} />
                <span className="equipment-pill">{item.equipment}</span>
              </div>
              <div className="library-card-body">
                <div>
                  <span className="muscle-pill">{item.target}</span>
                  {item.variants.length >= 3 && (
                    <span className="smart-pill"><Sparkles size={11} /> SMART SWAP</span>
                  )}
                </div>
                <h3>{item.name}</h3>
                <p>{item.focus}</p>
                <div className="library-card-footer">
                  <span>{item.sets} × {item.repMin}–{item.repMax}</span>
                  <span>{item.variants.length} variations</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="library-empty">
          <Search size={28} />
          <h3>No matching movements</h3>
          <p>Try a different muscle, equipment type, or search term.</p>
          <button className="button button-secondary" onClick={() => {
            setFilter("All");
            setEquipment("All");
            setMovement("All");
            setQuery("");
          }}>
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
