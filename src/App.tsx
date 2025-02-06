import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import FAQ from "./pages/FAQ";
import Careers from "./pages/Careers";
import Roadmap from "./pages/Roadmap";
import Dashboard from "./pages/Dashboard";
import API from "./pages/API";
import Orders from "./pages/Orders";
import Staking from "./pages/Staking";
import Pools from "./pages/Pools";
import Arbitrage from "./pages/Arbitrage";
import CopyTrade from "./pages/CopyTrade";
import AIAnalysis from "./pages/AIAnalysis";

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/api" element={<API />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/staking" element={<Staking />} />
            <Route path="/pools" element={<Pools />} />
            <Route path="/arbitrage" element={<Arbitrage />} />
            <Route path="/copy-trade" element={<CopyTrade />} />
            <Route path="/ai-analysis" element={<AIAnalysis />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
