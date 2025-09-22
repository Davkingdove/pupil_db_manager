import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';

function StudentCard({ student, onClick }) {
  return (
    <div className="student-card" onClick={() => onClick(student)}>
      <h3>{student.firstName.toUpperCase()} {student.surname.toUpperCase()}</h3>
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
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const debounceRef = useRef();
  const chartRef = useRef();




  // Fetch students on any filter or page change
  useEffect(() => {
    fetchStudents();
  }, [filters, page]);


  async function fetchStudents() {
    const res = await axios.get('/api/students', { params: { ...filters, page } });
    setStudents(res.data.students);
    setTotalPages(res.data.totalPages);
  }


  // Fetch summary/chart only when year filter changes
  useEffect(() => {
    async function fetchSummary() {
      const params = {};
      if (filters.year) params.year = filters.year;
      const res = await axios.get('/api/summary', { params });
      setSummary(res.data);
    }
    fetchSummary();
  }, [filters.year]);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!search.trim()) {
        setSearchResults([]);
        return;
      }
      const res = await axios.get('/api/students', { params: { name: search } });
      setSearchResults(res.data.students);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);



  useEffect(() => {
    if (!summary || Object.keys(summary).length === 0) return;
    const ctx = document.getElementById('summaryChart');
    if (!ctx) return;
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(summary),
        datasets: [{
          label: 'Students by Programme',
          data: Object.values(summary),
          backgroundColor: [
            '#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Students by Programme' }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                return Number.isInteger(value) ? value : '';
              }
            }
          }
        }
      }
    });
    // Cleanup chart on unmount
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [summary]);

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      <div className="summary-chart-section" style={{ maxWidth: '350px', margin: '0 auto 2rem auto', padding: '1.2rem' }}>
        <h3 style={{ fontSize: '1.1rem' }}>Summary: Students by Programme</h3>
        <canvas id="summaryChart" width="300" height="140" style={{ display: 'block', margin: '0 auto' }}></canvas>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="filters">
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
        {(search.trim() ? searchResults : students).map(s => (
          <StudentCard key={s.id} student={s} onClick={setSelected} />
        ))}
      </div>
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
      {selected && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{selected.firstName.toUpperCase()} {selected.surname.toUpperCase()}</h3>
            <p>Programme: {selected.programme}</p>
            <p>Year of Admission: {selected.yearOfAdmission}</p>
            <p>Previous School: {selected.previousSchool}</p>
            <p>BECE Aggregate: {selected.beceAggregate}</p>
            <p>Mother: {selected.motherName} ({selected.motherContact})</p>
            <p>Father: {selected.fatherName} ({selected.fatherContact})</p>
            <button onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )}
