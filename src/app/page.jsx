export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-neutral-900 mb-4">
        Travel Pilot
      </h1>
      <p className="text-lg text-neutral-600 mb-8 text-center max-w-md">
        Your AI-powered travel planning companion. Coming soon.
      </p>
      <a
        href="/dashboard"
        className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
      >
        Get Started
      </a>
    </main>
  );
}
