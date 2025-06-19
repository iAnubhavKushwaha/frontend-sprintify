// src/components/Dashboard/ProjectSummaryCard.jsx
const ProjectSummaryCard = ({ project, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>
          <p className="text-slate-600 text-sm line-clamp-2">
            {project.description || 'No description available'}
          </p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-lg ml-4">
          {project.title?.charAt(0) || 'P'}
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-slate-500">
            🎫 {project.ticketCount || 0} tickets
          </span>
          <span className="text-slate-500">
            👥 {project.teamMembers?.length || 0} members
          </span>
        </div>
        <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
          View Project →
        </div>
      </div>
    </div>
  );
};

export default ProjectSummaryCard;