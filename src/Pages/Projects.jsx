// client/src/pages/Projects.jsx
import { useEffect, useState, useContext } from 'react';
import { getProjects, createProject } from '../services/projectService';
import { AuthContext } from '../context/AuthContext';
import { FiPlus, FiX, FiUsers, FiCalendar, FiUser, FiMail } from 'react-icons/fi';
import TeamInvitation from '../components/Project/TeamInvitation';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [teamEmails, setTeamEmails] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const refreshProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Error refreshing projects:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const members = teamEmails
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);

      await createProject({ title, description, teamMembers: members });
      
      setSuccess('Project created successfully! 🎉');
      setTitle('');
      setDescription('');
      setTeamEmails('');
      setFormOpen(false);

      // Refresh projects list
      await refreshProjects();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create project. Please try again.');
      console.error('Error creating project:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowTeamModal(true);
  };

  const formatDate = (date) => {
    if (!date) return 'No date';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProjectInitial = (title) => {
    return title ? title.charAt(0).toUpperCase() : 'P';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Projects</h1>
            <p className="text-blue-100 opacity-90">
              Manage and organize your projects efficiently
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setFormOpen(!formOpen)}
              className="flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-lg"
            >
              {formOpen ? <FiX size={18} /> : <FiPlus size={18} />}
              <span>{formOpen ? 'Cancel' : 'New Project'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg shadow-sm">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-sm">
          {error}
        </div>
      )}

      {/* Create Project Form */}
      {formOpen && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">Create New Project</h2>
            <p className="text-slate-600 mt-1">Fill in the details to create your project</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter project title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Describe your project goals and objectives"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Team Member Emails (Optional)
              </label>
              <input
                type="text"
                value={teamEmails}
                onChange={(e) => setTeamEmails(e.target.value)}
                placeholder="john@example.com, jane@example.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <p className="text-xs text-slate-500 mt-1">
                Separate multiple emails with commas. You can also invite members later.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Project'
                )}
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects Grid */}
      <div>
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No projects yet</h3>
            <p className="text-slate-500 mb-6">Create your first project to get started</p>
            <button
              onClick={() => setFormOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                All Projects ({projects.length})
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <div
                  key={project._id}
                  className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer group"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-lg ml-4 group-hover:scale-110 transition-transform">
                      {getProjectInitial(project.title)}
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center text-sm text-slate-600">
                      <FiUser size={16} className="mr-2 text-slate-400" />
                      <span>Created by {project.owner?.name || user?.name || 'You'}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-slate-600">
                      <FiUsers size={16} className="mr-2 text-slate-400" />
                      <span>{project.teamMembers?.length || 0} team members</span>
                    </div>

                    <div className="flex items-center text-sm text-slate-600">
                      <FiCalendar size={16} className="mr-2 text-slate-400" />
                      <span>Created {formatDate(project.createdAt)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Active
                      </span>
                      <div className="flex items-center space-x-1 text-blue-600 text-sm font-medium group-hover:text-blue-700">
                        <FiMail size={14} />
                        <span>Manage Team →</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Team Management Modal */}
      {showTeamModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  Team Management - {selectedProject.title}
                </h2>
                <button
                  onClick={() => setShowTeamModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <TeamInvitation 
                project={selectedProject} 
                onInvitationSent={() => {
                  refreshProjects();
                }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;