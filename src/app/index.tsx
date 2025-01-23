import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './providers';
import { AppRoutes } from './router';
import { Header } from "../widgets/ui/Header";
import { Footer } from "../widgets/ui/Footer";

const App = () => {
  return (
    <BrowserRouter>
      <AppProviders>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </AppProviders>
    </BrowserRouter>
  );
};

export default App;