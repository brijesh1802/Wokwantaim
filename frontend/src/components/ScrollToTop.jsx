
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronsUp } from 'lucide-react';

const ScrollToTop = () => {
  const [showScroll, setShowScroll] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 200 && (window.scrollY + window.innerHeight) < document.documentElement.scrollHeight - 390);
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
        className="fixed bottom-8 right-6 text-black bg-white py-1 px-2 shadow-gray-500 rounded-full shadow-md transition z-10"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ChevronsUp size={30} />
      </button>
    )
  );
};

export default ScrollToTop;

