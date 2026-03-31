import './StatCard.css';

interface StatCardProps {
  icon: string;
  title: string;
  value: string | number;
  change?: {
    text: string;
    isPositive: boolean;
  };
  type?: 'primary' | 'success' | 'warning' | 'danger';
}

const StatCard = ({ icon, title, value, change, type = 'primary' }: StatCardProps) => {
  return (
    <div className={`stat-card stat-${type}`}>
      <div className="stat-icon">
        <i className={icon}></i>
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p className="stat-number">{value}</p>
        {change && (
          <span className={`stat-change ${change.isPositive ? 'positive' : 'negative'}`}>
            <i className={`fas fa-arrow-${change.isPositive ? 'up' : 'down'}`}></i>
            {change.text}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
