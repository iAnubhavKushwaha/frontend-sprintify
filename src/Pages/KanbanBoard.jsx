// src/Pages/KanbanBoard.jsx - MINIMAL VERSION
import { useEffect, useState, useCallback, useContext } from "react";
import { getProjects } from "../services/projectService";
import { getTicketsByProject, updateTicket } from "../services/ticketService";
import { AuthContext } from "../context/AuthContext";
import Kanban from "../components/Tickets/Kanban";
import { FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const KanbanBoard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getProjects();
        const projectsArray = Array.isArray(data) ? data : [];
        setProjects(projectsArray);

        if (projectsArray.length > 0) {
          setSelectedProject(projectsArray[0]);
        }
      } catch (error) {
        console.error("❌ Error fetching projects:", error);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Fetch tickets when project changes
  const fetchTickets = useCallback(async (projectId) => {
    if (!projectId) return;
    try {
      const data = await getTicketsByProject(projectId);
      setTickets(Array.isArray(data) ? data : []);
      setError("");
    } catch (error) {
      console.error("❌ Error fetching tickets:", error);
      setError("Failed to load tickets");
      setTickets([]);
    }
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchTickets(selectedProject._id);
    }
  }, [selectedProject, fetchTickets]);

  // Update ticket handler (only for status/assignee changes)
  const handleUpdateTicket = async (ticketId, updateData) => {
    try {
      await updateTicket(ticketId, updateData);
      await fetchTickets(selectedProject._id);
      setSuccess("Ticket updated successfully! ✅");
      setTimeout(() => setSuccess(""), 2000);
    } catch (error) {
      console.error("❌ Failed to update ticket:", error);
      setError(error.response?.data?.msg || "Failed to update ticket");
      setTimeout(() => setError(""), 3000);
    }
  };

  // Get team members
  const getTeamMembers = () => {
    if (!selectedProject) return [];

    const members = [];

    if (selectedProject.owner) {
      const owner = {
        _id: selectedProject.owner._id || selectedProject.owner,
        name: selectedProject.owner.name || "Project Owner",
        email: selectedProject.owner.email || "",
        role: "Owner",
      };
      members.push(owner);
    }

    if (selectedProject.teamMembers && Array.isArray(selectedProject.teamMembers)) {
      selectedProject.teamMembers.forEach((memberObj) => {
        const member = memberObj.user;
        if (member && !members.find((m) => m._id === (member._id || member))) {
          const teamMember = {
            _id: member._id || member,
            name: member.name || member.email || "Team Member",
            email: member.email || "",
            role: memberObj.role || "Member",
          };
          members.push(teamMember);
        }
      });
    }

    return members;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading Kanban board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full space-y-6">
      {/* Simple Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center">
          📋 Kanban Board
        </h1>
        <p className="text-slate-600">
          Visual workflow management
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Project Selection - Minimal */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between">
          <select
            value={selectedProject?._id || ""}
            onChange={(e) =>
              setSelectedProject(
                projects.find((p) => p._id === e.target.value) || null
              )
            }
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">Choose a project...</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
          </select>

          {selectedProject && (
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <FiUsers size={16} />
                <span>{getTeamMembers().length} members</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🎫</span>
                <span>{tickets.length} tickets</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Kanban Board - Full Height */}
      {selectedProject ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-[calc(100vh-260px)] overflow-auto">
          <Kanban
            tickets={tickets}
            onUpdateTicket={handleUpdateTicket}
            teamMembers={getTeamMembers()}
            currentUser={user}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Select a Project
            </h3>
            <p className="text-gray-500 mb-6">
              Choose a project above to view your Kanban board
            </p>
            {projects.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-400">
                  You don't have any projects yet.
                </p>
                <button
                  onClick={() => navigate('/projects')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Project
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;