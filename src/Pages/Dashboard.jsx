// src/pages/Dashboard.jsx
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '../services/projectService';
import StatCard from '../components/Dashboard/StatCard';
import ProjectSummaryCard from '../components/Dashboard/ProjectSummaryCard';
import PendingInvitations from '../components/Dashboard/PendingInvitations'; // Add this import
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Get user from AuthContext
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const totalTickets = projects.reduce((sum, p) => sum + (p.ticketCount || 0), 0);
  const totalTeamMembers = projects.reduce(
    (sum, p) => sum + (p.teamMembers?.length || 0),
    0
  );
  const recentProjects = projects.slice(0, 3);

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Function to refresh projects after accepting invitation
  const refreshProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Error refreshing projects:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-3">
            {getGreeting()}, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-blue-100 text-lg opacity-90">
            Welcome back to Sprintify. Here's what's happening with your projects.
          </p>
        </div>
      </div>

      {/* Pending Invitations - Add this here */}
      <PendingInvitations onAccept={refreshProjects} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
          <StatCard 
            title="Total Projects" 
            value={projects.length}
            icon="📁"
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
          <StatCard 
            title="Active Tickets" 
            value={totalTickets}
            icon="🎫"
            color="text-green-600"
            bgColor="bg-green-50"
          />
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
          <StatCard 
            title="Team Members" 
            value={totalTeamMembers}
            icon="👥"
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Recent Projects</h2>
          <button 
            onClick={() => navigate('/projects')}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            View All →
          </button>
        </div>
        
        {recentProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No projects found</h3>
            <p className="text-slate-500 mb-4">Create your first project to get started</p>
            <button 
              onClick={() => navigate('/projects')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProjects.map((project, index) => (
              <div 
                key={project._id}
                className="transform hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProjectSummaryCard
                  project={project}
                  onClick={() => navigate(`/projects/${project._id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-xl">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => navigate('/projects')}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            ➕ Create Project
          </button>
          <button 
            onClick={() => navigate('/tickets')}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            🎫 New Ticket
          </button>
          <button 
            onClick={() => navigate('/kanban')}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            📊 Kanban Board
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            ⚙️ Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;