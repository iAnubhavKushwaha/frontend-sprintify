// src/components/Tickets/CreateTicketDialog.jsx
import { useState } from "react";
import { FiX, FiUser, FiFlag, FiFileText, FiUsers } from "react-icons/fi";

const CreateTicketDialog = ({
  isOpen,
  onClose,
  onSubmit,
  teamMembers,
  projectTitle,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "Medium",
    status: "To Do",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Please enter a ticket title");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await onSubmit(formData);
      if (result && result.success) {
        // Reset form and close dialog on success
        setFormData({
          title: "",
          description: "",
          assignee: "",
          priority: "Medium",
          status: "To Do",
        });
        setError("");
        onClose(); // Close the dialog
      } else {
        // Show error if submission failed
        setError(result?.error || "Failed to create ticket");
      }
    } catch (err) {
      console.error("🎫 Error in handleSubmit:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      title: "",
      description: "",
      assignee: "",
      priority: "Medium",
      status: "To Do",
    });
    setError("");
    onClose();
  };

  const priorityOptions = [
    { value: "Low", color: "text-green-600", icon: "🟢" },
    { value: "Medium", color: "text-yellow-600", icon: "🟡" },
    { value: "High", color: "text-red-600", icon: "🔴" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Create New Ticket</h2>
              <p className="text-blue-100 mt-1">Project: {projectTitle}</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
              type="button"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
              <FiFileText className="mr-2" size={16} />
              Ticket Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter ticket title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Describe the task or issue in detail"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Assignee */}
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <FiUser className="mr-2" size={16} />
                Assign To
              </label>
              <select
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Unassigned</option>
                {teamMembers?.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name || member.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <FiFlag className="mr-2" size={16} />
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.value}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Initial Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="To Do">📋 To Do</option>
                <option value="In Progress">⚡ In Progress</option>
                <option value="In Review">👀 In Review</option>
                <option value="Done">✅ Done</option>
              </select>
            </div>
          </div>

          {/* Team Members Preview */}
          {teamMembers && teamMembers.length > 0 && (
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <FiUsers className="mr-2 text-slate-600" size={16} />
                <span className="text-sm font-medium text-slate-700">
                  Available Team Members
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {teamMembers.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-slate-200"
                  >
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {(member.name || member.email).charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-slate-700">
                      {member.name || member.email}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                "Create Ticket"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketDialog;
