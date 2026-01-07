import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronDown } from "lucide-react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    {
      code: "vi",
      name: "Tiếng Việt",
      flag: "https://img.icons8.com/?size=100&id=2egPD0I7yi4-&format=png&color=000000",
      nativeName: "Vietnamese",
    },
    {
      code: "en",
      name: "English",
      flag: "https://img.icons8.com/?size=100&id=t3NE3BsOAQwq&format=png&color=000000",
      nativeName: "English",
    },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("language", langCode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 px-3 py-2 rounded-full bg-white/50   transition-all duration-300 "
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        {/* Gradient Background on Hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content */}
        <div className="relative flex items-center gap-2">
          <span className="hidden sm:inline text-sm font-medium text-slate-700 group-hover:text-[orange-600] transition-colors duration-300">
            <img
              src={currentLanguage.flag}
              alt={currentLanguage.name}
              className="size-8 rounded-full object-cover inline-block"
            />
          </span>
          <ChevronDown
            className={`size-3.5 text-slate-400 group-hover:text-[orange-600] transition-all duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-pink-500/20 border border-pink-100/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
          role="menu"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-orange-100/50 bg-gradient-to-r from-orange-50/50 to-amber-50/50">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Select Language
            </p>
          </div>

          {/* Language Options */}
          <div className="py-2">
            {languages.map((lang, index) => {
              const isActive = i18n.language === lang.code;

              return (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-[orange-600]/10 to-[#FF8C1A]/10 text-[orange-600]"
                        : "text-slate-700 hover:bg-gradient-to-r hover:from-orange-50/80 hover:to-amber-50/80"
                    }
                    ${index !== 0 ? "border-t border-slate-100/50" : ""}
                  `}
                  role="menuitem"
                >
                  {/* Flag */}
                  <span className="text-2xl flex-shrink-0">
                    <img
                      src={lang.flag}
                      alt={lang.name}
                      className="size-6 rounded-full object-cover"
                    />
                  </span>

                  {/* Language Info */}
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-medium ${
                        isActive ? "text-[orange-600]" : "text-slate-700"
                      }`}
                    >
                      {lang.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {lang.nativeName}
                    </div>
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
                        <Check
                          className="w-3.5 h-3.5 text-white"
                          strokeWidth={3}
                        />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
