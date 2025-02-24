import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronsUp } from 'lucide-react'; // Import icon for the button

const ScrollToTop = () => {
  const [showScroll, setShowScroll] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 200 && (window.scrollY + window.innerHeight) < document.documentElement.scrollHeight - 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return (
    showScroll && (
      <button
        className="fixed bottom-8 right-6 z-10 text-black bg-white py-1 px-2 shadow-gray-500 rounded-full shadow-md transition"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ChevronsUp size={30} />
      </button>
    )
  );
};

export default ScrollToTop;
