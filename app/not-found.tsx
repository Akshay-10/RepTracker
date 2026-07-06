import Link from "next/link";
import { ArrowLeft, Dumbbell } from "lucide-react";

export default function NotFound() {
  return (
    <main className="centered-page">
      <div className="empty-orbit">
        <Dumbbell size={30} />
      </div>
      <p className="eyebrow">404 · RACK EMPTY</p>
      <h1>That set does not exist.</h1>
      <p className="muted">Let’s get you back to today’s work.</p>
      <Link className="button button-primary" href="/dashboard">
        <ArrowLeft size={17} />
        Back to dashboard
      </Link>
    </main>
  );
}
