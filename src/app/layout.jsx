import './globals.css';

export const metadata = {
  title: 'Travel Pilot — Your AI Travel Planner',
  description:
    'Plan smarter. Travel better. AI-powered itineraries, budget breakdowns, and personalized recommendations.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
