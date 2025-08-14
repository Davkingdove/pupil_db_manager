import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

function StudentCard({ student, onClick }) {
  return (
    <div className="student-card" onClick={() => onClick(student)}>
      <h3>{student.firstName} {student.surname}</h3>
      <p>{student.programme}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ year: '', programme: '' });
  const [summary, setSummary] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchStudents();
    fetchSummary();
  }, [filters, page]);

  async function fetchStudents() {
    const res = await axios.get('/api/students', { params: { ...filters, page } });
    setStudents(res.data.students);
    setTotalPages(res.data.totalPages);
  }

  async function fetchSummary() {
    const res = await axios.get('/api/summary');
    setSummary(res.data);
    setTimeout(() => renderChart(res.data), 100);
  }

  function renderChart(data) {
    const ctx = document.getElementById('summaryChart');
    if (!ctx) return;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(data),
        datasets: [{
          label: 'Students by Programme',
          data: Object.values(data),
        }]
      }
    });
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div>
        <select onChange={e => setFilters(f => ({ ...f, year: e.target.value }))}>
          <option value="">All Years</option>
          {[...Array(4)].map((_, i) => {
            const y = new Date().getFullYear() - i;
            return <option key={y} value={y}>{y}</option>;
          })}
        </select>
        <select onChange={e => setFilters(f => ({ ...f, programme: e.target.value }))}>
          <option value="">All Programmes</option>
          {['Science', 'General Arts', 'Visual Arts', 'Business', 'Home Economics'].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div className="student-list">
        {students.map(s => <StudentCard key={s.id} student={s} onClick={setSelected} />)}
      </div>
      <div>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
      <canvas id="summaryChart" width="400" height="200"></canvas>
      {selected && (
        <div className="modal">
          <h3>{selected.firstName} {selected.surname}</h3>
          <p>Programme: {selected.programme}</p>
          <p>Year of Admission: {selected.yearOfAdmission}</p>
          <p>Previous School: {selected.previousSchool}</p>
          <p>BECE Aggregate: {selected.beceAggregate}</p>
          <p>Mother: {selected.motherName} ({selected.motherContact})</p>
          <p>Father: {selected.fatherName} ({selected.fatherContact})</p>
          <button onClick={() => setSelected(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
