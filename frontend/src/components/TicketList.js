import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TicketList({ tickets, onUpdate }) {
  const [filters, setFilters] = useState({ category: '', priority: '', status: '', search: '' });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredTickets = tickets.filter(ticket =>
    (!filters.category || ticket.category === filters.category) &&
    (!filters.priority || ticket.priority === filters.priority) &&
    (!filters.status || ticket.status === filters.status) &&
    (!filters.search || ticket.title.toLowerCase().includes(filters.search.toLowerCase()) || ticket.description.toLowerCase().includes(filters.search.toLowerCase()))
  );

  const updateStatus = async (id, status) => {
    await axios.patch(`/api/tickets/${id}/`, { status });
    onUpdate();
  };

  return (
    <div>
      <input name="search" placeholder="Search title/description" onChange={handleFilterChange} />
      <select name="category" onChange={handleFilterChange}>
        <option value="">All Categories</option>
        <option value="billing">Billing</option>
        <option value="technical">Technical</option>
        <option value="account">Account</option>
        <option value="general">General</option>
      </select>
      {/* Add similar selects for priority and status */}
      {filteredTickets.map(ticket => (
        <div key={ticket.id}>
          <h3>{ticket.title}</h3>
          <p>{ticket.description.substring(0, 100)}...</p>
          <p>Category: {ticket.category}, Priority: {ticket.priority}, Status: {ticket.status}</p>
          <button onClick={() => updateStatus(ticket.id, 'in_progress')}>Mark In Progress</button>
          {/* Add more status buttons */}
        </div>
      ))}
    </div>
  );
}

export default TicketList;