import React, { useState } from 'react';

export default function BookForm({ onBookAdded }) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    borrower_name: '',
    checkout_date: todayStr
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim() || !formData.borrower_name.trim() || !formData.checkout_date) {
      setErrorMsg('Please fill in Title, Borrower Name, and Checkout Date.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Reset form
        setFormData({
          title: '',
          description: '',
          borrower_name: '',
          checkout_date: todayStr
        });
        onBookAdded(data.data);
      } else {
        setErrorMsg(data.message || 'Failed to add book.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setErrorMsg('Network error. Is the backend server running on port 5000?');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Borrow a Book</h2>
      {errorMsg && <div style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem' }}>{errorMsg}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Book Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            placeholder="e.g. Clean Code"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="borrower_name">Borrower Name *</label>
          <input
            type="text"
            id="borrower_name"
            name="borrower_name"
            className="form-control"
            placeholder="e.g. John Doe"
            value={formData.borrower_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="checkout_date">Checkout Date *</label>
          <input
            type="date"
            id="checkout_date"
            name="checkout_date"
            className="form-control"
            value={formData.checkout_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            placeholder="Brief book notes or edition..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
          {submitting ? 'Saving Book...' : 'Add Borrowed Book'}
        </button>
      </form>
    </div>
  );
}
