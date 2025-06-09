import { useState, useEffect } from "react";
import Icon from "./components/Icon";

const navItems: string[] = [
  "Dashboard",
  "Search",
  "Bookings",
  "Job Board",
  "How to Guide",
];

const App = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeHash, setActiveHash] = useState<string>(window.location.hash);

  const toggleMenu = (): void => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const formatHash = (item: string) => `#${item.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="bg-white border-b-2 border-gray-300 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <Icon name="IconHireuplogo" aria-label="HireUp Logo" className="w-28 fill-cyan-500"/>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
        {navItems.map((item) => {
            const href = formatHash(item);
            const isActive = activeHash === href;

            return (
              <a
                key={item}
                href={href}
                className={` hover:text-cyan-500 transition-colors duration-200  
                  ${isActive ? "border-b-3 border-cyan-500" : ""}`}
              >
                {item}
              </a>
            );
          })}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className={`md:hidden focus:outline-none p-1.5 ${isOpen ? "bg-gray-300 rounded-full" : "" }`}
          aria-label="Toggle menu"
        >
          <Icon name="IconHamburger" aria-label="Hamburger Icon" className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Items */}
      {isOpen && (
        <div className="md:hidden border-t-2 border-gray-300 shadow-sm">
          {navItems.map((item: string) => {
            const href = formatHash(item);
            const isActive = activeHash === href; 
            
            return (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={toggleMenu}
              className={`flex items-center gap-2 p-3 border-b-2 border-gray-200 last:border-b-0
                ${isActive ? "bg-blue-50" : "" }`}
            >
              <Icon name="IconIcon" aria-label={`${item} Icon`} className="w-4 h-4 fill-gray-300" />
              {item}
            </a>
          )})}
        </div>
      )}
    </div>
  );
};

export default App;
