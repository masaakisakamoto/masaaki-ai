export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black px-6 py-12 flex flex-col items-center justify-center">
      
      <section className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-semibold">
          Masaaki Sakamoto
        </h1>

        <p className="text-lg">
          Designing AI systems, not just using them
        </p>

        <p className="text-sm text-gray-600">
          Building AI Factory, open-source tools, and long-term systems for human × AI collaboration
        </p>

        <div className="flex gap-4 justify-center mt-6">
          <a href="/projects" className="border px-4 py-2">
            Projects
          </a>
          <a href="https://github.com/masaakisakamoto" target="_blank" rel="noopener noreferrer" className="border px-4 py-2">
            GitHub
          </a>
          <a href="https://x.com/masaaki_s" target="_blank" rel="noopener noreferrer" className="border px-4 py-2">
            X
          </a>
        </div>
      </section>

    </main>
  );
}