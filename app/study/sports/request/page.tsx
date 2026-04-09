import Link from "next/link";
import SportsRequestForm from "@/components/study/SportsRequestForm";

export default function SportsRequestPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 text-black md:px-10 md:py-20">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/study/sports"
          className="text-sm uppercase tracking-[0.24em] text-black/45 transition hover:text-black"
        >
          Sports
        </Link>

        <SportsRequestForm />
      </div>
    </main>
  );
}
