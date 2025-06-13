import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NAV_ITEMS, APP_NAME, ICONS, ROUTES } from '../../constants';
import { UserRole } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();

  const filteredNavItems = NAV_ITEMS.filter(item => user && item.roles.includes(user.role));

  return (
    <div className={`transition-all duration-300 ease-in-out bg-primary dark:bg-neutral-dark text-white flex flex-col ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-blue-700 dark:border-neutral-medium">
        {isOpen && <span className="text-xl font-bold font-display">{APP_NAME}</span>}
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-blue-700 dark:hover:bg-neutral-medium focus:outline-none focus:ring-2 focus:ring-white"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <i className={`${isOpen ? ICONS.collapse : ICONS.expand} text-lg`}></i>
          </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 space-y-2">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center py-2.5 px-4 rounded-md transition-colors duration-200 hover:bg-blue-700 dark:hover:bg-neutral-medium ${isActive ? 'bg-blue-700 dark:bg-neutral-medium font-semibold' : ''} ${isOpen ? '' : 'justify-center'}`
            }
            title={item.label}
          >
            <i className={`${item.icon} text-lg ${isOpen ? 'mr-3' : ''}`}></i>
            {isOpen && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      {/* Optional Footer */}
      {isOpen && (
        <div className="p-4 border-t border-blue-700 dark:border-neutral-medium">
          <p className="text-xs text-center text-blue-200 dark:text-gray-400">© {new Date().getFullYear()} {APP_NAME}</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

// Añadir al menú los nuevos módulos del estudiante
// El menú ya usa NAV_ITEMS, que ahora incluye los módulos avanzados del estudiante según el rol.
// No se requiere más acción en Sidebar, ya que filtra por roles automáticamente.
