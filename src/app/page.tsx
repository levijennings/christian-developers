export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm text-brand-600 ring-1 ring-brand-200 mb-8">
          ✝️ Faith-Driven Tech Community
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Code with <span className="text-brand-500">purpose</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl">
          Join a community of Christian developers. Find faith-aligned jobs, connect with mentors, and grow your career while honoring your calling.
        </p>
        <div className="mt-10 flex items-center gap-x-6">
          <a href="/signup" className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors">
            Join the Community
          </a>
          <a href="/jobs" className="text-sm font-semibold leading-6 text-gray-900">
            Browse Jobs <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </main>
  );
}
