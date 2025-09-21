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
    <div className="form-bg">
      <form className="styled-form" onSubmit={handleSubmit} autoComplete="off">
        <h2>Student Registration</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input name="firstName" id="firstName" placeholder="First Name" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="surname">Surname</label>
            <input name="surname" id="surname" placeholder="Surname" onChange={handleChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="middleNames">Middle Names</label>
            <input name="middleNames" id="middleNames" placeholder="Middle Names" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input name="dateOfBirth" id="dateOfBirth" type="date" onChange={handleChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="yearOfAdmission">Year of Admission</label>
            <select name="yearOfAdmission" id="yearOfAdmission" onChange={handleChange} required>
              <option value="">Year of Admission</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="programme">Programme</label>
            <select name="programme" id="programme" onChange={handleChange} required>
              <option value="">Programme</option>
              {programmes.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="previousSchool">Previous School</label>
            <input name="previousSchool" id="previousSchool" placeholder="Previous School" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="beceAggregate">BECE Aggregate</label>
            <select name="beceAggregate" id="beceAggregate" onChange={handleChange} required>
              <option value="">BECE Aggregate</option>
              {aggregates.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="motherName">Mother's Name</label>
            <input name="motherName" id="motherName" placeholder="Mother's Name" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="motherContact">Mother's Contact</label>
            <input name="motherContact" id="motherContact" placeholder="Mother's Contact" onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fatherName">Father's Name</label>
            <input name="fatherName" id="fatherName" placeholder="Father's Name" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="fatherContact">Father's Contact</label>
            <input name="fatherContact" id="fatherContact" placeholder="Father's Contact" onChange={handleChange} />
          </div>
        </div>
        <button className="form-btn" type="submit">Submit</button>
        {error && <div className="form-error">{error}</div>}
      </form>
    </div>
  );
}
