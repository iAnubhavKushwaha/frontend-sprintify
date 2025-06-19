import { FiCalendar } from 'react-icons/fi';

const TicketList = ({ tickets, onUpdateTicket, teamMembers }) => {
  const handleStatusChange = async (ticketId, newStatus) => {
    await onUpdateTicket(ticketId, { status: newStatus });
  };

  const handleAssigneeChange = async (ticketId, newAssignee) => {
    await onUpdateTicket(ticketId, { assignee: newAssignee || null });
  };

  const getPriorityEmoji = (priority) => {
    switch(priority) {
      case 'High': return '🔴';
      case 'Medium': return '🟡';
      case 'Low': return '🟢';
      default: return '⚪';
    }
  };

  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🎫</span>
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">No tickets found</h3>
        <p className="text-gray-500">Try adjusting your filters or create a new ticket</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-700">Title</th>
              <th className="text-left p-4 font-semibold text-gray-700">Priority</th>
              <th className="text-left p-4 font-semibold text-gray-700">Status</th>
              <th className="text-left p-4 font-semibold text-gray-700">Assignee</th>
              <th className="text-left p-4 font-semibold text-gray-700">Created</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={ticket._id} className={`border-b hover:bg-gray-50 transition-colors ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
              }`}>
                <td className="p-4">
                  <div>
                    <div className="font-medium text-gray-800 mb-1">{ticket.title}</div>
                    {ticket.description && (
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {ticket.description}
                      </div>
                    )}
                  </div>
                </td>
                
                <td className="p-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    ticket.priority === 'High' ? 'bg-red-100 text-red-800' :
                    ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    <span className="mr-1">{getPriorityEmoji(ticket.priority)}</span>
                    {ticket.priority}
                  </span>
                </td>
                
                <td className="p-4">
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="To Do">📋 To Do</option>
                    <option value="In Progress">⚡ In Progress</option>
                    <option value="In Review">👀 In Review</option>
                    <option value="Done">✅ Done</option>
                  </select>
                </td>
                
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <select
                      value={ticket.assignee?._id || ''}
                      onChange={(e) => handleAssigneeChange(ticket._id, e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-0 flex-1"
                    >
                      <option value="">👤 Unassigned</option>
                      {teamMembers.map((member) => (
                        <option key={member._id} value={member._id}>
                          👤 {member.name || member.email}
                        </option>
                      ))}
                    </select>
                    
                    {ticket.assignee && (
                      <div className="flex items-center space-x-2 min-w-0">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {ticket.assignee.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                
                <td className="p-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiCalendar className="mr-2" size={14} />
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketList;