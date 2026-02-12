import { Routes, Route } from "react-router-dom";

// --- PAGES ---
import Home from "@/pages/Home";

// --- COMPONENTS ---
import { PageLayout } from "@/components/Dna/PageLayout";

export default function App() {
  return (
    <Routes>

      {/* --- CONVERSION PAGES (Wrapped in PageLayout with Header/Footer) --- */}
      <Route
        path="/"
        element={
          <PageLayout>
            <Home />
          </PageLayout>
        }
      />

      
    </Routes>
  );
}