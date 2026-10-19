import './globals.css';
import { StoreProvider } from '@/context/StoreContext';

export const metadata = {
  title: 'Prakriti Pure - 100% Shuddh & Natural Food Supplies | Desi Ghee, Multigrain Atta, Organic Pulses',
  description: 'Shop 100% pure traditional natural food supplies: Vedic A2 Bilona Desi Ghee, Stone-ground Multigrain Atta, Unpolished Pulses, and Cold-pressed Oils. Direct from farm to kitchen.',
  keywords: 'organic food, multigrain atta, a2 desi ghee, bilona ghee, unpolished pulses, cold pressed mustard oil, natural sweeteners, farm fresh india'
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi-IN">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>" />
      </head>
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
