import { useState } from 'react';
import { FiUser,} from 'react-icons/fi';

const Kanban = ({ tickets, onUpdateTicket, teamMembers}) => {
  const [showAssignDropdown, setShowAssignDropdown] = useState(null);

  const columns = [
    { id: 'To Do', title: 'To Do', color: 'bg-gray-200', emoji: '📋' },
    { id: 'In Progress', title: 'In Progress', color: 'bg-blue-200', emoji: '⚡' },
    { id: 'In Review', title: 'In Review', color: 'bg-yellow-200', emoji: '👀' },
    { id: 'Done', title: 'Done', color: 'bg-green-200', emoji: '✅' }
  ];

  const getTicketsByStatus = (status) => {
    return tickets.filter(ticket => ticket.status === status);
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    await onUpdateTicket(ticketId, { status: newStatus });
  };

  const handleAssigneeChange = async (ticketId, newAssignee) => {
    await onUpdateTicket(ticketId, { assignee: newAssignee || null });
    setShowAssignDropdown(null);
  };

  const toggleAssignDropdown = (ticketId) => {
    setShowAssignDropdown(showAssignDropdown === ticketId ? null : ticketId);
  };

  const getPriorityEmoji = (priority) => {
    switch(priority) {
      case 'High': return '🔴';
      case 'Medium': return '🟡';
      case 'Low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((column) => {
        const columnTickets = getTicketsByStatus(column.id);
        
        return (
          <div key={column.id} className="bg-gray-50 rounded-lg p-4 min-h-96">
            <div className={`${column.color} rounded-lg p-3 mb-4`}>
              <h3 className="font-semibold flex items-center">
                <span className="mr-2">{column.emoji}</span>
                {column.title} 
                <span className="ml-2 bg-white bg-opacity-70 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {columnTickets.length}
                </span>
              </h3>
            </div>

            <div className="space-y-3">
              {columnTickets.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">No tickets</p>
                </div>
              ) : (
                columnTickets.map((ticket) => (
                  <div key={ticket._id} className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow relative">
                    {/* Ticket Header */}
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-sm text-gray-800 flex-1 pr-2">
                        {ticket.title}
                      </h4>
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">{getPriorityEmoji(ticket.priority)}</span>
                      </div>
                    </div>

                    {ticket.description && (
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {ticket.description}
                      </p>
                    )}
                    
                    {/* Priority Badge */}
                    <div className="flex justify-between items-center mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ticket.priority === 'High' ? 'bg-red-100 text-red-800' :
                        ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticket.priority}
                      </span>
                      
                      {/* Status Dropdown */}
                      <select
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                        className="text-xs border rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="To Do">📋 To Do</option>
                        <option value="In Progress">⚡ In Progress</option>
                        <option value="In Review">👀 In Review</option>
                        <option value="Done">✅ Done</option>
                      </select>
                    </div>
                    
                    {/* Assignment Section */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div className="flex items-center space-x-2 flex-1">
                        {ticket.assignee ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {ticket.assignee.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <span className="text-xs text-gray-700 truncate">
                              {ticket.assignee.name || ticket.assignee.email || 'Unknown'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-gray-400">
                            <div className="w-6 h-6 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                              <FiUser size={12} />
                            </div>
                            <span className="text-xs">Unassigned</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Assignment Button */}
                      <div className="relative">
                        <button
                          onClick={() => toggleAssignDropdown(ticket._id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Assign ticket"
                        >
                          <FiUser size={14} className="text-gray-500" />
                        </button>
                        
                        {/* Assignment Dropdown */}
                        {showAssignDropdown === ticket._id && (
                          <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                            <div className="p-2">
                              <div className="text-xs font-medium text-gray-700 mb-2 px-2">
                                Assign to:
                              </div>
                              
                              <button
                                onClick={() => handleAssigneeChange(ticket._id, '')}
                                className={`w-full text-left px-3 py-2 text-xs rounded hover:bg-gray-50 flex items-center space-x-2 ${
                                  !ticket.assignee ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                }`}
                              >
                                <div className="w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center">
                                  <FiUser size={10} />
                                </div>
                                <span>Unassigned</span>
                              </button>
                              
                              {teamMembers.map((member) => (
                                <button
                                  key={member._id}
                                  onClick={() => handleAssigneeChange(ticket._id, member._id)}
                                  className={`w-full text-left px-3 py-2 text-xs rounded hover:bg-gray-50 flex items-center space-x-2 ${
                                    ticket.assignee?._id === member._id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                  }`}
                                >
                                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {(member.name || member.email).charAt(0).toUpperCase()}
                                  </div>
                                  <span className="truncate">{member.name || member.email}</span>
                                  {member.role && (
                                    <span className="text-gray-400">({member.role})</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Kanban;