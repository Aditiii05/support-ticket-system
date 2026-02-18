/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

*/

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [form, setForm] = useState({ title: '', description: '', category: '', priority: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, []);

  const fetchTickets = () => axios.get('http://localhost:8000/api/tickets/').then(res => setTickets(res.data));
  const fetchStats = () => axios.get('http://localhost:8000/api/tickets/stats/').then(res => setStats(res.data));

  const handleClassify = async () => {
    if (!form.description) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/tickets/classify/', { description: form.description });
      setForm({ ...form, category: res.data.suggested_category, priority: res.data.suggested_priority });
    } catch (e) {
      console.log('LLM failed, using defaults');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:8000/api/tickets/', form);
    setForm({ title: '', description: '', category: '', priority: '' });
    fetchTickets();
    fetchStats();
  };

  const updateStatus = async (id, status) => {
    await axios.patch(`http://localhost:8000/api/tickets/${id}/`, { status });
    fetchTickets();
  };

  return (
    <div className="App">
      <h1>Support Ticket System</h1>
      <form onSubmit={handleSubmit}>
        <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Title" required />
        <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} onBlur={handleClassify} placeholder="Description" required />
        {loading && <p>Loading suggestions...</p>}
        <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
          <option value="">Category</option>
          <option value="billing">Billing</option>
          <option value="technical">Technical</option>
          <option value="account">Account</option>
          <option value="general">General</option>
        </select>
        <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
          <option value="">Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <button type="submit">Submit</button>
      </form>
      <h2>Stats</h2>
      <p>Total: {stats.total_tickets}, Open: {stats.open_tickets}, Avg/Day: {stats.avg_tickets_per_day}</p>
      <h2>Tickets</h2>
      {tickets.map(ticket => (
        <div key={ticket.id}>
          <h3>{ticket.title}</h3>
          <p>{ticket.description.slice(0, 100)}...</p>
          <p>Category: {ticket.category}, Priority: {ticket.priority}, Status: {ticket.status}</p>
          <select onChange={e => updateStatus(ticket.id, e.target.value)}>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default App;