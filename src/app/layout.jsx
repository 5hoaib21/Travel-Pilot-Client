import './globals.css';

export const metadata = {
  title: 'Travel Pilot — Your AI Travel Planner',
  description:
    'Plan smarter. Travel better. AI-powered itineraries, budget breakdowns, and personalized recommendations.',
};

const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('travel-pilot-theme');
      if (!theme) {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-[--bg-page] text-[--text-body]">{children}</body>
    </html>
  )
}
