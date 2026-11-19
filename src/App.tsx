import { Routes, Route } from "react-router";
import { toastConfig } from "react-simple-toasts";
import "react-simple-toasts/dist/style.css";
import "react-simple-toasts/dist/theme/dark.css";
import "react-simple-toasts/dist/theme/success.css";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AboutPage from "@/pages/about";
import HomePage from "@/pages/home";
import NotFoundPage from "@/pages/not-found";

toastConfig({
  maxVisibleToasts: 3,
  position: "bottom-center",
  theme: "dark",
});

const App = () => {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <Header />
      <main className="relative flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
