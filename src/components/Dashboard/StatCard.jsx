// src/components/Dashboard/StatCard.jsx
const StatCard = ({ title, value, className = "text-blue-600" }) => {
  return (
    <div className="text-center">
      <div className={`text-3xl font-bold ${className} mb-2`}>
        {value}
      </div>
      <div className="text-slate-600 font-medium text-sm uppercase tracking-wide">
        {title}
      </div>
    </div>
  );
};

export default StatCard;