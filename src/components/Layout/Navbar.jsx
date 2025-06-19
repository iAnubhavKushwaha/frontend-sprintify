// src/components/Layout/Navbar.jsx
import { useState, useEffect, useRef, useContext } from "react";
import { FiMenu, FiX, FiBell, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios';

const Navbar = ({ onMenuClick, sidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  
  // Get user and logout from AuthContext
  const { user, logout } = useContext(AuthContext);

  // Fetch all projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/projects', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAllProjects(response.data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    
    // Debounce search
    const searchTimeout = setTimeout(() => {
      const filtered = allProjects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setSearchLoading(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, allProjects]);

  // Handle project selection
  const handleProjectSelect = (project) => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    // Navigate to tickets page with this project selected
    navigate('/tickets', { state: { selectedProject: project } });
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate("/login");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper functions
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayName = () => {
    if (!user) return "User";
    return user.name || "User";
  };

  const getDisplayEmail = () => {
    if (!user) return "user@sprintify.com";
    return user.email || "user@sprintify.com";
  };

  return (
    <nav className="w-full bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-800 shadow-lg px-4 sm:px-6 lg:px-8 py-3">
      <div className="flex justify-between items-center">
        
        {/* Left side - Hamburger + Search */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Mobile hamburger menu */}
          <button
            onClick={onMenuClick}
            className="lg:hidden text-white hover:text-blue-200 focus:outline-none p-2 rounded-md hover:bg-blue-800 transition-colors"
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {/* Search Bar - Now takes more space */}
          <div className="flex-1 max-w-lg" ref={searchRef}>
            <div className="relative">
              {/* Search Input */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  className="w-full pl-10 pr-4 py-2 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white text-slate-700 placeholder-slate-500 transition-all"
                />
                
                {/* Clear button */}
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchOpen && (searchQuery || searchResults.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                  {searchLoading ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-slate-500 text-sm mt-2">Searching...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      <div className="px-3 py-2 text-xs font-medium text-slate-500 uppercase tracking-wide border-b border-slate-100">
                        Projects ({searchResults.length})
                      </div>
                      {searchResults.map((project) => (
                        <button
                          key={project._id}
                          onClick={() => handleProjectSelect(project)}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-slate-50 last:border-b-0 transition-colors group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                              <span className="text-blue-600 font-bold text-sm">
                                {project.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700 truncate">
                                {project.name}
                              </p>
                              {project.description && (
                                <p className="text-xs text-slate-500 truncate">
                                  {project.description}
                                </p>
                              )}
                              <div className="flex items-center mt-1 space-x-2">
                                <span className="text-xs text-slate-400">
                                  {project.teamMembers?.length || 0} members
                                </span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className="text-xs text-slate-400">
                                  {project.status || 'Active'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : searchQuery ? (
                    <div className="p-4 text-center">
                      <p className="text-slate-500 text-sm">No projects found for "{searchQuery}"</p>
                      <button
                        onClick={() => navigate('/projects')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                      >
                        View all projects →
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-slate-500 text-sm">Start typing to search projects...</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Notifications + User menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="hidden sm:block text-white hover:text-blue-200 p-2 rounded-md hover:bg-blue-800 transition-colors relative">
            <FiBell size={20} />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-3 text-white hover:text-blue-200 focus:outline-none p-2 rounded-md hover:bg-blue-800 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-white text-sm font-bold">
                  {getUserInitials(getDisplayName())}
                </span>
              </div>
              <span className="hidden md:block text-sm font-medium">{getDisplayName()}</span>
              <svg className="hidden md:block w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* User dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
                  <p className="text-xs text-gray-500">{getDisplayEmail()}</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    👤 Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    ⚙️ Settings
                  </button>

                </div>
                <div className="border-t border-gray-100 py-2">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;