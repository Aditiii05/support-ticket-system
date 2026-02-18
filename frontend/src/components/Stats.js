import React from 'react';

function Stats({ stats }) {
  return (
    <div>
      <h2>Stats</h2>
      <p>Total Tickets: {stats.total_tickets}</p>
      <p>Open Tickets: {stats.open_tickets}</p>
      <p>Avg Tickets per Day: {stats.avg_tickets_per_day}</p>
      <h3>Priority Breakdown</h3>
      <ul>
        {Object.entries(stats.priority_breakdown || {}).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>
      <h3>Category Breakdown</h3>
      <ul>
        {Object.entries(stats.category_breakdown || {}).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>
    </div>
  );
}

export default Stats;