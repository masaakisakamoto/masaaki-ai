import Link from "next/link";
import FeedbackForm from "@/components/study/FeedbackForm";

export default function StudyFeedbackPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 text-black md:px-10 md:py-20">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/study"
          className="text-sm uppercase tracking-[0.24em] text-black/45 transition hover:text-black"
        >
          Study
        </Link>

        <section className="mt-8 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.24em] text-black/45">
            Feedback
          </p>
          <h1 className="mt-5 text-4xl font-medium tracking-tight md:text-6xl">
            この知識空間を、
            <br />
            より良く育てるために。
          </h1>
          <p className="mt-8 text-base leading-8 text-black/68 md:text-lg">
            分かりづらかったこと、もっと知りたいこと、役に立ったこと。
            <br className="hidden md:block" />
            その声は、この場所を次に進めるための大切なヒントになります。
          </p>
        </section>

        <FeedbackForm />
      </div>
    </main>
  );
}
