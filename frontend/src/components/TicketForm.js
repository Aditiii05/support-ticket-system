import React, { useState } from 'react';
import axios from 'axios';

function TicketForm({ onSubmit, onSubmitStats }) {
  const [form, setForm] = useState({ title: '', description: '', category: '', priority: '' });
  const [loading, setLoading] = useState(false);

  const handleDescriptionChange = async (e) => {
    setForm({ ...form, description: e.target.value });
    if (e.target.value) {
      setLoading(true);
      try {
        const res = await axios.post('/api/tickets/classify/', { description: e.target.value });
        setForm({ ...form, description: e.target.value, category: res.data.suggested_category, priority: res.data.suggested_priority });
      } catch (err) {
        // Fallback handled in backend
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/tickets/', form);
    setForm({ title: '', description: '', category: '', priority: '' });
    onSubmit();
    onSubmitStats();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" required />
      <textarea value={form.description} onChange={handleDescriptionChange} placeholder="Description" required />
      {loading && <p>Loading suggestions...</p>}
      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
        <option value="">Category</option>
        <option value="billing">Billing</option>
        <option value="technical">Technical</option>
        <option value="account">Account</option>
        <option value="general">General</option>
      </select>
      <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
        <option value="">Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  );
}

export default TicketForm;