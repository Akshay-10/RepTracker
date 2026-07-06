"use client";

import {
  ArrowRight,
  ChevronDown,
  Dumbbell,
  Filter,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { getLibraryExercises } from "@/lib/data";
import { PageHeading } from "@/components/ui";

const filters = ["All", "Chest", "Lats", "Biceps", "Triceps", "Side delts", "Quads", "Hamstrings", "Abs"];

export function ExerciseLibrary() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const exercises = useMemo(() => {
    const items = getLibraryExercises();
    return items.filter((item) => {
      const matchesFilter =
        filter === "All" ||
        item.target.toLowerCase().includes(filter.toLowerCase()) ||
        item.secondary.some((muscle) =>
          muscle.toLowerCase().includes(filter.toLowerCase()),
        );
      const haystack = `${item.name} ${item.target} ${item.movement} ${item.equipment}`.toLowerCase();
      return matchesFilter && haystack.includes(query.toLowerCase());
    });
  }, [query, filter]);

  return (
    <>
      <PageHeading
        eyebrow="MOVEMENT LIBRARY"
        title="Find the right tool."
        copy="Explore the movements in your plan, understand their intent, and choose compatible variations."
        actions={
          <button className="button button-secondary">
            <SlidersHorizontal size={16} /> Advanced filters
          </button>
        }
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
        <button className="filter-button">
          <Filter size={17} /> Equipment <ChevronDown size={15} />
        </button>
        <button className="filter-button">
          Movement <ChevronDown size={15} />
        </button>
      </div>

      <div className="filter-pills">
        {filters.map((item) => (
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
        <span>Sorted by <strong>Plan relevance</strong> <ChevronDown size={14} /></span>
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
          <button className="button button-secondary" onClick={() => { setFilter("All"); setQuery(""); }}>
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
