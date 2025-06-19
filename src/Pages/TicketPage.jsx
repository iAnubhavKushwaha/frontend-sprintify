// src/Pages/TicketPage.jsx 
import { useEffect, useState, useCallback, useContext } from "react";  
import { getProjects } from "../services/projectService";  
import {  
  createTicket,  
  getTicketsByProject,  
  updateTicket,  
} from "../services/ticketService";  
import { AuthContext } from "../context/AuthContext";  
import { useNavigate, useLocation } from "react-router-dom";  
import TicketList from "../components/Tickets/TicketList";  
import CreateTicketDialog from "../components/Tickets/CreateTicketDialog";  
import { FiPlus, FiUsers, FiFilter, FiGrid, FiRefreshCw } from "react-icons/fi";  

const TicketPage = () => {  
  const { user } = useContext(AuthContext);  
  const navigate = useNavigate();  
  const location = useLocation();  
  
  const [projects, setProjects] = useState([]);  
  const [selectedProject, setSelectedProject] = useState(null);  
  const [tickets, setTickets] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [showDialog, setShowDialog] = useState(false);  
  const [error, setError] = useState("");  
  const [success, setSuccess] = useState("");  

  // Filters  
  const [filterPriority, setFilterPriority] = useState("all");  
  const [filterStatus, setFilterStatus] = useState("all");  
  const [filterAssignee, setFilterAssignee] = useState("all");  

  // Check if a specific project was passed from navigation  
  useEffect(() => {  
    if (location.state?.selectedProject) {  
      setSelectedProject(location.state.selectedProject);  
    }  
  }, [location.state]);  

  useEffect(() => {  
    const fetchProjects = async () => {  
      try {  
        setLoading(true);  
        const data = await getProjects();  
        const projectsArray = Array.isArray(data) ? data : [];  
        setProjects(projectsArray);  

        // If no project from navigation, select first one  
        if (!selectedProject && projectsArray.length > 0) {  
          setSelectedProject(projectsArray[0]);  
        }  
      } catch (error) {  
        console.error("Error fetching projects:", error);  
        setError("Failed to load projects");  
      } finally {  
        setLoading(false);  
      }  
    };  
    fetchProjects();  
  }, [selectedProject]);  

  const fetchTickets = useCallback(async (projectId) => {  
    if (!projectId) return;  
    try {  
      const data = await getTicketsByProject(projectId);  
      setTickets(Array.isArray(data) ? data : []);  
      setError("");  
    } catch (error) {  
      console.error("Error fetching tickets:", error);  
      setError("Failed to load tickets");  
      setTickets([]);  
    }  
  }, []);  

  useEffect(() => {  
    if (selectedProject) {  
      fetchTickets(selectedProject._id);  
    }  
  }, [selectedProject, fetchTickets]);  

  const handleCreateTicket = async (formData) => {  
    if (!selectedProject) {  
      return { success: false, error: "No project selected" };  
    }  

    try {  
      await createTicket({  
        ...formData,  
        projectId: selectedProject._id,  
      });  

      setSuccess("Ticket created successfully! 🎉");  
      setShowDialog(false);  
      await fetchTickets(selectedProject._id);  
      setTimeout(() => setSuccess(""), 3000);  
      return { success: true };  
    } catch (error) {  
      console.error("Failed to create ticket:", error);  
      const errorMessage = error.response?.data?.msg || "Failed to create ticket";  
      setError(errorMessage);  
      return { success: false, error: errorMessage };  
    }  
  };  

  const handleUpdateTicket = async (ticketId, updateData) => {  
    try {  
      await updateTicket(ticketId, updateData);  
      await fetchTickets(selectedProject._id);  
      setSuccess("Ticket updated successfully!");  
      setTimeout(() => setSuccess(""), 2000);  
    } catch (error) {  
      console.error("Failed to update ticket:", error);  
      setError(error.response?.data?.msg || "Failed to update ticket");  
      setTimeout(() => setError(""), 3000);  
    }  
  };  

  const handleRefresh = async () => {  
    if (selectedProject) {  
      await fetchTickets(selectedProject._id);  
      setSuccess("Tickets refreshed!");  
      setTimeout(() => setSuccess(""), 1500);  
    }  
  };  

  const getFilteredTickets = () => {  
    return tickets.filter((ticket) => {  
      const priorityMatch = filterPriority === "all" || ticket.priority === filterPriority;  
      const statusMatch = filterStatus === "all" || ticket.status === filterStatus;  
      const assigneeMatch =  
        filterAssignee === "all" ||  
        (filterAssignee === "unassigned" && !ticket.assignee) ||  
        (ticket.assignee && ticket.assignee._id === filterAssignee);  
      return priorityMatch && statusMatch && assigneeMatch;  
    });  
  };  

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

  const canManageTickets = () => {  
    if (!selectedProject || !user) return false;  

    const userId = String(user._id || '');  
    if (!userId) return false;  
    
    const projectOwnerId = String(selectedProject.owner?._id || selectedProject.owner || '');  
    if (projectOwnerId === userId) return true;  

    if (selectedProject.teamMembers && selectedProject.teamMembers.length > 0) {  
      const isMember = selectedProject.teamMembers.some((memberObj) => {  
        if (!memberObj.user) return false;  
        const memberId = String(memberObj.user._id || memberObj.user || '');  
        return memberId === userId;  
      });  
      return isMember;  
    }  

    return false;  
  };  

  const clearFilters = () => {  
    setFilterPriority("all");  
    setFilterStatus("all");  
    setFilterAssignee("all");  
  };  

  const hasActiveFilters = filterPriority !== "all" || filterStatus !== "all" || filterAssignee !== "all";  

  if (loading) {  
    return (  
      <div className="flex items-center justify-center min-h-96">  
        <div className="text-center">  
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>  
          <p className="text-slate-600">Loading tickets...</p>  
        </div>  
      </div>  
    );  
  }  

  return (  
    <div className="space-y-6">  
      {/* Header */}  
      <div className="flex items-center justify-between">  
        <div>  
          <h1 className="text-2xl font-bold text-gray-800 mb-2">  
            🎫 Ticket Management  
          </h1>  
          <p className="text-gray-600">  
            Create, organize and track your project tasks  
          </p>  
        </div>  
        
        {/* Quick Actions */}  
        <div className="flex items-center space-x-3">  
          <button  
            onClick={handleRefresh}  
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"  
            title="Refresh tickets"  
          >  
            <FiRefreshCw size={16} />  
            <span className="hidden sm:inline">Refresh</span>  
          </button>  
          
          <button  
            onClick={() => navigate('/kanban')}  
            className="flex items-center space-x-2 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"  
          >  
            <FiGrid size={16} />  
            <span>Kanban View</span>  
          </button>  
        </div>  
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

      {/* Project Selection & Stats */}  
      <div className="bg-white rounded-lg shadow-sm border p-6">  
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">  
          <div className="flex-1">  
            <label className="block text-sm font-medium text-gray-700 mb-2">  
              📁 Select Project  
            </label>  
            <select  
              value={selectedProject?._id || ""}  
              onChange={(e) =>  
                setSelectedProject(  
                  projects.find((p) => p._id === e.target.value) || null  
                )  
              }  
              className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"  
            >  
              <option value="">Choose a project...</option>  
              {projects.map((project) => (  
                <option key={project._id} value={project._id}>  
                  {project.title} ({project.teamMembers?.length || 0} members)  
                </option>  
              ))}  
            </select>  
          </div>  

          {selectedProject && (  
            <div className="flex items-center space-x-6 text-sm text-gray-600 bg-slate-50 px-4 py-3 rounded-lg">  
              <div className="flex items-center space-x-1">  
                <FiUsers size={16} />  
                <span>{getTeamMembers().length} members</span>  
              </div>  
              <div className="flex items-center space-x-1">  
                <span>🎫</span>  
                <span>{tickets.length} total</span>  
              </div>  
              <div className="flex items-center space-x-1">  
                <span>📋</span>  
                <span>{getFilteredTickets().length} filtered</span>  
              </div>  
            </div>  
          )}  
        </div>  
      </div>  

      {selectedProject ? (  
        <>  
          {/* Controls & Filters */}  
          <div className="bg-white rounded-lg shadow-sm border p-6">  
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">  
              {/* Create Button */}  
              <div>  
                {canManageTickets() ? (  
                  <button  
                    onClick={() => setShowDialog(true)}  
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"  
                  >  
                    <FiPlus size={18} />  
                    <span>Create New Ticket</span>  
                  </button>  
                ) : (  
                  <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">  
                    🔒 You can only view tickets in this project  
                  </div>  
                )}  
              </div>  

              {/* Filters */}  
              <div className="flex flex-wrap items-center gap-3">  
                <div className="flex items-center space-x-2">  
                  <FiFilter className="text-gray-400" size={16} />  
                  <span className="text-sm text-gray-600 font-medium">Filters:</span>  
                </div>  

                <select  
                  value={filterPriority}  
                  onChange={(e) => setFilterPriority(e.target.value)}  
                  className="border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 bg-white"  
                >  
                  <option value="all">All Priorities</option>  
                  <option value="Low">🟢 Low</option>  
                  <option value="Medium">🟡 Medium</option>  
                  <option value="High">🔴 High</option>  
                </select>  

                <select  
                  value={filterStatus}  
                  onChange={(e) => setFilterStatus(e.target.value)}  
                  className="border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 bg-white"  
                >  
                  <option value="all">All Status</option>  
                  <option value="To Do">📋 To Do</option>  
                  <option value="In Progress">⚡ In Progress</option>  
                  <option value="In Review">👀 In Review</option>  
                  <option value="Done">✅ Done</option>  
                </select>  

                <select  
                  value={filterAssignee}  
                  onChange={(e) => setFilterAssignee(e.target.value)}  
                  className="border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 bg-white"  
                >  
                  <option value="all">All Assignees</option>  
                  <option value="unassigned">👤 Unassigned</option>  
                  {getTeamMembers().map((member) => (  
                    <option key={member._id} value={member._id}>  
                      👤 {member.name}  
                    </option>  
                  ))}  
                </select>  

                {hasActiveFilters && (  
                  <button  
                    onClick={clearFilters}  
                    className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"  
                  >  
                    Clear All  
                  </button>  
                )}  
              </div>  
            </div>  
          </div>  

          {/* Tickets List */}  
          <div className="bg-white rounded-lg shadow-sm border">  
            <TicketList  
              tickets={getFilteredTickets()}  
              onUpdateTicket={handleUpdateTicket}  
              teamMembers={getTeamMembers()}  
              currentUser={user}  
              canManage={canManageTickets()}  
            />  
          </div>  
        </>  
      ) : (  
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎫</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Project Selected
          </h3>
          <p className="text-gray-500 mb-6">
            Select a project above to start managing tickets
          </p>
          {projects.length === 0 ? (
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
          ) : (
            <button
              onClick={() => setSelectedProject(projects[0])}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Select First Project
            </button>
          )}
        </div>
      )}

      {/* Create Ticket Dialog */}
      <CreateTicketDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onSubmit={handleCreateTicket}
        teamMembers={getTeamMembers()}
        projectTitle={selectedProject?.title || ""}
      />
    </div>
  );
};

export default TicketPage;