// src/components/Layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { Home,Ticket, Settings, X, FolderOpen, Layout } from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
  { name: "Projects", path: "/projects", icon: <FolderOpen size={20} /> },
  { name: "Kanban Board", path: "/kanban", icon: <Layout size={20} /> },
  { name: "Tickets", path: "/tickets", icon: <Ticket size={20} /> },
];

const Sidebar = ({ isOpen, isMobile, onClose }) => {
  return (
    <>
      {/* Desktop Sidebar - Always visible on lg+ */}
      <aside className={`
        ${isMobile ? 'fixed' : 'relative'}
        ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
        ${isMobile ? 'z-50' : 'z-0'}
        w-64 h-screen bg-gradient-to-b from-slate-800 to-slate-900 shadow-xl 
        flex flex-col justify-between border-r border-slate-700
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
      `}>
        
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <h1 className="text-xl font-bold text-white">Sprintify</h1>
            </div>
            
            {/* Close button - Only show on mobile */}
            {isMobile && (
              <button
                onClick={onClose}
                className="lg:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
          
          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => isMobile && onClose()} // Close sidebar on mobile when item clicked
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg transform scale-105" 
                      : "text-slate-300 hover:text-white hover:bg-slate-700"
                  }`
                }
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700">
          <NavLink
            to="/settings"
            onClick={() => isMobile && onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? "bg-blue-600 text-white shadow-lg transform scale-105" 
                  : "text-slate-300 hover:text-white hover:bg-slate-700"
              }`
            }
          >
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;