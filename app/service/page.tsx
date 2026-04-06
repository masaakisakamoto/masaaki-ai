import { Suspense } from "react";
import ServiceContent from "./ServiceContent";

export default function ServicePage() {
  return (
    <Suspense fallback={<ServiceFallback />}>
      <ServiceContent />
    </Suspense>
  );
}

function ServiceFallback() {
  return (
    <main className="min-h-screen bg-white text-black px-6 py-16">
      <div className="flex justify-between items-center text-sm text-gray-400">
        <a
          href="/"
          className="uppercase tracking-[0.2em] transition hover:text-black"
        >
          MASAAKI AI
        </a>

        <div className="inline-flex rounded-full border border-black/10 bg-white p-1 shadow-sm">
          <span className="rounded-full px-3 py-1.5 text-xs font-medium bg-black text-white">
            EN
          </span>
          <span className="rounded-full px-3 py-1.5 text-xs font-medium text-neutral-500">
            JA
          </span>
        </div>
      </div>

      <section className="mt-20 max-w-4xl">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
          Service
        </p>

        <h1 className="mt-6 text-[52px] md:text-[72px] font-semibold leading-[1.05] tracking-tight">
          Production services,
          <br />
          actively shipped.
        </h1>

        <p className="mt-8 text-[17px] text-gray-500 max-w-xl leading-relaxed">
          Services built for real use,
          <br />
          with clarity, care, and long-term potential.
        </p>
      </section>
    </main>
  );
}
