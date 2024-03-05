import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      style={{ backgroundColor: "transparent", border: "none" }}
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <FiSun size={32} color="#FDB813" />
      ) : (
        <FiMoon size={32} color="#4D5B6B" />
      )}
    </button>
  );
};

export default DarkModeToggle;
