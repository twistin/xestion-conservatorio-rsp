
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDarkMode } from '../../hooks/useDarkMode';
import { USER_MENU_ITEMS, ICONS, APP_NAME, ROUTES } from '../../constants';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.login);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-dark-surface shadow-md dark:shadow-neutral-dark/50 flex items-center justify-between px-6">
      <div className="flex items-center">
        {!sidebarOpen && (
             <button
                onClick={() => setSidebarOpen(true)}
                className="mr-4 p-2 rounded-md text-neutral-medium dark:text-neutral-light hover:bg-neutral-light dark:hover:bg-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Expandir barra lateral"
              >
            <i className={`${ICONS.expand} text-lg`}></i>
          </button>
        )}
         {!sidebarOpen && <span className="text-xl font-bold font-display text-primary dark:text-white">{APP_NAME}</span>}
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-neutral-light dark:hover:bg-neutral-dark text-neutral-medium dark:text-neutral-light"
          aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo escuro"}
        >
          <i className={`${isDarkMode ? ICONS.lightMode : ICONS.darkMode} text-xl`}></i>
        </button>

        <Link to={ROUTES.notifications}
          className="p-2 rounded-full hover:bg-neutral-light dark:hover:bg-neutral-dark text-neutral-medium dark:text-neutral-light relative"
          aria-label="Notificacións"
        >
          <i className={`${ICONS.notifications} text-xl`}></i>
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-status-red ring-2 ring-white dark:ring-dark-surface"></span>
        </Link>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 p-1 rounded-full hover:bg-neutral-light dark:hover:bg-neutral-dark"
          >
            <img
              src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=2563EB&color=fff&rounded=true`}
              alt="Avatar do usuario"
              className="w-8 h-8 rounded-full object-cover"
            />
            {user && <span className="hidden md:inline text-sm font-medium text-neutral-dark dark:text-neutral-light">{user.firstName} {user.lastName}</span>}
            <i className={`fa-solid fa-chevron-down text-xs text-neutral-medium dark:text-neutral-light transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}></i>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-surface rounded-md shadow-lg py-1 z-50 border border-neutral-light dark:border-neutral-medium">
              <div className="px-4 py-2 border-b border-neutral-light dark:border-neutral-medium">
                <p className="text-sm font-semibold text-neutral-dark dark:text-neutral-light">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-neutral-medium dark:text-gray-400">{user?.role}</p>
              </div>
              {USER_MENU_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center px-4 py-2 text-sm text-neutral-dark dark:text-neutral-light hover:bg-neutral-light dark:hover:bg-neutral-dark"
                >
                  <i className={`${item.icon} mr-2 w-4 text-center text-neutral-medium dark:text-gray-400`}></i>
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-neutral-dark dark:text-neutral-light hover:bg-neutral-light dark:hover:bg-neutral-dark border-t border-neutral-light dark:border-neutral-medium"
              >
                <i className={`${ICONS.logout} mr-2 w-4 text-center text-neutral-medium dark:text-gray-400`}></i>
                Pechar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;