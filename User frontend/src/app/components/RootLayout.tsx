import { Outlet } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { AppProvider } from '../context/AppContext';
import { AuthModal } from './AuthModal';

export const RootLayout = () => {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <AuthModal />
    </AppProvider>
  );
};
