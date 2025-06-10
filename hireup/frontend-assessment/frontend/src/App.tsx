import {
  useState,
  useEffect,
  useRef,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import axios from "axios";
import marvelLogo from "./assets/images/Marvel_Logo.png";

interface Superhero {
  id: number;
  name: string;
  biography?: {
    fullName?: string;
    publisher?: string;
  };
  images?: {
    sm?: string;
  };
}

function App() {
  const [query, setQuery] = useState<string>("");
  const [focused, setFocused] = useState<boolean>(false);
  const [results, setResults] = useState<Superhero[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [noResult, setNoResult] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const [selectedHero, setSelectedHero] = useState<Superhero | null>(null);

  const listRef = useRef<HTMLUListElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);

    // Run initially
    checkIsMobile();

    // Listen for resize
    window.addEventListener("resize", checkIsMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setActiveIndex(-1);
        return;
      }

      setLoading(true);

      try {
        const response = await axios.get<Superhero[]>(
          `http://localhost:1337/superheroes?name_like=${encodeURIComponent(
            query
          )}`
        );
        setResults(response.data);
        setActiveIndex(response.data.length > 0 ? 0 : -1);
        setNoResult(response.data.length > 0 ? false : true);
      } catch (error) {
        console.error("Error fetching superheroes:", error);
        setResults([]);
        setActiveIndex(-1);
        setNoResult(true);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimeout);
  }, [query]);

  useEffect(() => {
    const listEl = listRef.current;
    if (listEl && activeIndex >= 0) {
      const itemEl = listEl.children[activeIndex] as HTMLElement;
      if (itemEl) {
        const itemTop = itemEl.offsetTop;
        const itemBottom = itemTop + itemEl.offsetHeight;
        if (itemTop < listEl.scrollTop) {
          listEl.scrollTop = itemTop;
        } else if (itemBottom > listEl.scrollTop + listEl.clientHeight) {
          listEl.scrollTop = itemBottom - listEl.clientHeight;
        }
      }
    }
  }, [activeIndex]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.target.value);
    setNoResult(false);
    setFocused(true);
  };

  const handleFocus = (): void => {
    setFocused(true);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>): void => {
    setTimeout(() => setFocused(false), 200);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1 < results.length ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 >= 0 ? prev - 1 : results.length - 1));
    } else if (
      e.key === "Enter" &&
      activeIndex >= 0 &&
      activeIndex < results.length
    ) {
      const selected = results[activeIndex];
      setQuery(selected.name);
      setFocused(false);
      setSelectedHero(selected);
      console.log(selected.name);
    } else if (e.key === "Enter" && noResult) {
      setNoResult(false);
      setSelectedHero(null);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-white">
        <header className="flex flex-col justify-center items-center md:flex-row md:justify-between md:bg-red-600 md:py-4 md:px-20 md:shadow">
          <div className="flex w-full py-4 justify-center md:py-0 md:justify-start md:w-fit bg-red-600">
            <img src={marvelLogo} alt="Logo" className="w-32" />
          </div>

          <div className="relative w-full py-6 px-20 md:w-1/3 md:py-0 md:px-0 transition-all duration-300 bg-white rounded-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
              />
              {loading && (
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="w-5 h-5 animate-spin text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {noResult && !loading && (
              <div
                className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-2 shadow-md h-50 flex flex-col justify-center items-center"
                style={isMobile ? { width: "calc(100% - 160px)" } : {}}
              >
                <p className="text-xl font-bold text-red-600">Oh No!</p>
                <p>No results found for "{query}"!</p>
              </div>
            )}

            {focused && results.length > 0 && (
              <ul
                ref={listRef}
                className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-2 shadow-md max-h-100 overflow-auto"
                style={isMobile ? { width: "calc(100% - 160px)" } : {}}
              >
                {results.map((hero, index) => (
                  <li
                    key={hero.id}
                    className={`px-4 py-4 cursor-pointer ${
                      index === activeIndex
                        ? "bg-blue-100"
                        : "hover:bg-gray-100"
                    }`}
                    onMouseDown={() => {
                      setQuery(hero.name);
                      setFocused(false);
                      console.log(hero.name);
                      setSelectedHero(hero);
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <div className="flex gap-4 items-center sm:items-start">
                      {hero.images?.sm ? (
                        <img
                          src={hero.images.sm}
                          alt={`${hero.id} image`}
                          className="w-16 h-16 rounded-full"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-300 flex flex-col justify-center items-center text-[8px]">
                          <p>IMAGE</p>
                          <p>NOT</p>
                          <p>FOUND</p>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium">{hero.name}</span>
                        <span className="text-sm text-gray-500 hidden sm:block">
                          {hero.biography?.publisher}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </header>

        {selectedHero && (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl font-bold text-red-600 mb-4">
              {selectedHero.name}
            </h2>
            {selectedHero.images?.sm ? (
              <img
                src={selectedHero.images.sm}
                alt={selectedHero.name}
                className="w-40 h-40 rounded-full mb-4"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-gray-300 flex justify-center items-center mb-4 text-sm">
                IMAGE NOT FOUND
              </div>
            )}
            <p className="text-lg text-gray-700">
              Full Name:{" "}
              <span className="font-semibold">
                {selectedHero.biography?.fullName || "N/A"}
              </span>
            </p>
            <p className="text-lg text-gray-700">
              Publisher:{" "}
              <span className="font-semibold">
                {selectedHero.biography?.publisher || "Unknown"}
              </span>
            </p>
          </div>
        )}

        {!selectedHero && (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl font-bold text-red-600">
              Search a hero
            </h2>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
