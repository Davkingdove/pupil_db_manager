import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const currentYear = new Date().getFullYear();
const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];
const programmes = ['Science', 'General Arts', 'Visual Arts', 'Business', 'Home Economics'];
const aggregates = Array.from({ length: 35 }, (_, i) => (i + 6).toString().padStart(2, '0'));

export default function RegistrationForm() {
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/register', form);
      if (res.data.success) {
        navigate(`/upload/${res.data.student.id}`);
      } else {
        setError(res.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Student Registration</h2>
      <input name="firstName" placeholder="First Name" onChange={handleChange} required />
      <input name="surname" placeholder="Surname" onChange={handleChange} required />
      <input name="middleNames" placeholder="Middle Names" onChange={handleChange} />
      <input name="dateOfBirth" type="date" onChange={handleChange} required />
      <select name="yearOfAdmission" onChange={handleChange} required>
        <option value="">Year of Admission</option>
        {years.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
      <select name="programme" onChange={handleChange} required>
        <option value="">Programme</option>
        {programmes.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <input name="previousSchool" placeholder="Previous School" onChange={handleChange} />
      <select name="beceAggregate" onChange={handleChange} required>
        <option value="">BECE Aggregate</option>
        {aggregates.map(a => <option key={a} value={a}>{a}</option>)}
      </select>
      <input name="motherName" placeholder="Mother's Name" onChange={handleChange} />
      <input name="motherContact" placeholder="Mother's Contact" onChange={handleChange} />
      <input name="fatherName" placeholder="Father's Name" onChange={handleChange} />
      <input name="fatherContact" placeholder="Father's Contact" onChange={handleChange} />
      <button type="submit">Submit</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
}
