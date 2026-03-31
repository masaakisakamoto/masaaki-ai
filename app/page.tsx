export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black px-6 py-12 flex flex-col items-center justify-center">
      <section className="max-w-2xl text-center space-y-6">
        <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
          MASAAKI AI
        </p>

        <h1 className="text-4xl font-semibold tracking-tight">
          Masaaki Sakamoto
        </h1>

        <div className="space-y-1">
          <p className="text-lg">AI Systems Engineer</p>
          <p className="text-lg">Human Systems × AI Integrator</p>
          <p className="text-lg text-gray-700">Exploring the Human Body</p>
        </div>

        <div className="pt-2">
          <p className="text-xs uppercase tracking-[0.22em] text-gray-500">
            Masaaki Office
          </p>

          <p className="mt-2 text-sm text-gray-700">
            Where trust meets human potential
          </p>
          <p className="text-sm text-gray-700">
            — powered by Human × AI
          </p>
        </div>

        <div className="flex gap-4 justify-center mt-6 flex-wrap">
          <a
            href="/projects"
            className="border px-4 py-2 transition hover:bg-black hover:text-white"
          >
            Projects
          </a>
          <a
            href="/labs"
            className="border px-4 py-2 transition hover:bg-black hover:text-white"
          >
            Labs
          </a>
          <a
            href="https://github.com/masaakisakamoto"
            target="_blank"
            rel="noopener noreferrer"
            className="border px-4 py-2 transition hover:bg-black hover:text-white"
          >
            GitHub
          </a>
          <a
            href="https://x.com/masaaki_s"
            target="_blank"
            rel="noopener noreferrer"
            className="border px-4 py-2 transition hover:bg-black hover:text-white"
          >
            X
          </a>
        </div>
      </section>
    </main>
  );
}
