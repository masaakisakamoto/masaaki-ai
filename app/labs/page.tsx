export default function LabsPage() {
  return (
    <main className="min-h-screen bg-white text-black px-6 py-16">
      
      {/* Header */}
      <div className="flex justify-between items-center text-sm text-gray-400">
        <p className="uppercase tracking-[0.2em]">MASAAKI AI</p>
        <a href="/projects" className="hover:opacity-60">
          Projects
        </a>
      </div>

      {/* Hero */}
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
          I’m building over time.
        </p>
      </section>

      {/* Cards */}
      <section className="mt-20 grid md:grid-cols-2 gap-12 max-w-4xl">

        {/* Card 1 */}
        <div className="rounded-[28px] border border-gray-200 p-10 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition duration-300">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
            Lab 01
          </p>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight">
            Motion Engine
          </h2>

          <p className="mt-5 text-gray-500 leading-relaxed">
            An AI foundation for making human movement visible.
          </p>

          <a
            href="https://motionengine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block text-sm text-black hover:opacity-60"
          >
            Visit motionengine.ai →
          </a>
        </div>

        {/* Card 2 */}
        <div className="rounded-[28px] border border-dashed border-gray-200 p-10 text-gray-400">
          <p className="text-xs uppercase tracking-[0.25em]">
            Future Lab
          </p>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight">
            Coming next
          </h2>

          <p className="mt-5 leading-relaxed">
            More experimental systems will appear here over time.
          </p>
        </div>

      </section>
    </main>
  );
}
