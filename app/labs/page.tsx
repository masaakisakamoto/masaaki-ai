import Link from "next/link";
import { Suspense } from "react";
import LabsContent from "./LabsContent";

export default function LabsPage() {
  return (
    <Suspense fallback={<LabsFallback />}>
      <LabsContent />
    </Suspense>
  );
}

function LabsFallback() {
  return (
    <main className="min-h-screen bg-white text-black px-6 py-16">
      <div className="flex justify-between items-center text-sm text-gray-400">
        <Link
          href="/"
          className="uppercase tracking-[0.2em] transition hover:text-black"
        >
          MASAAKI AI
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/projects" className="hover:text-black transition">
            Projects
          </Link>
          <Link href="/labs" className="hover:text-black transition">
            Labs
          </Link>

          <div className="inline-flex rounded-full border border-black/10 bg-white p-1 shadow-sm">
            <span className="rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white">
              EN
            </span>
            <span className="rounded-full px-3 py-1.5 text-xs font-medium text-neutral-500">
              JA
            </span>
          </div>
        </div>
      </div>

      <section className="mt-20 max-w-4xl">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
          Labs
        </p>

        <h1 className="mt-6 text-[52px] md:text-[72px] font-semibold leading-[1.05] tracking-tight">
          Experimental systems,
          <br />
          long-term explorations.
        </h1>

        <p className="mt-8 text-[17px] text-gray-500 max-w-xl leading-relaxed">
          Early systems, prototypes, and foundations
          <br />
          I&apos;m building over time.
        </p>
      </section>
    </main>
  );
}
