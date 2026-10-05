import { StoreProvider } from './state/store';
import Header from './components/Header';
import Hero from './components/Hero';
import SyncSimulator from './components/SyncSimulator';
import ModuleConsole from './components/ModuleConsole';
import Architecture from './components/Architecture';
import Footer from './components/Footer';
import Toast from './components/Toast';

export default function App() {
  return (
    <StoreProvider>
      <Header />
      <main>
        <Hero />
        <SyncSimulator />
        <ModuleConsole />
        <Architecture />
      </main>
      <Footer />
      <Toast />
    </StoreProvider>
  );
}
