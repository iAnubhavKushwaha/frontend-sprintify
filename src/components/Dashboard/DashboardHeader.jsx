//src/components/Dashboard/DashboardHeader.jsx

const DashboardHeader = ({ user }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Welcome, <span className="text-blue-600">{user?.name || 'User'}</span>
      </h2>
      <p className="text-sm text-gray-500">Here's a quick overview of your bug tracking activity.</p>
    </div>
  );
};

export default DashboardHeader;
