//require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, Student } = require('./models/models');

const app = express();
app.use(cors());
const path = require('path');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.get('/', (req, res) => {
    res.render('registerPage')
}) 

app.post('/students', async(req,res)=>{
    try {
    const student = await Student.create(req.body);
    res.status(201).json(" Saved Successfully ");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.json({ success: true, student });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
// Admin endpoints (list, filter, sort, pagination, summary)
app.get('/api/students', async (req, res) => {
  // ...pagination, sorting, filtering logic...
    try {
      // Pagination
      const page = parseInt(req.query.page) || 1;
      const pageSize = 10;
      const offset = (page - 1) * pageSize;

      // Filtering
      const { Op } = require('sequelize');
      const where = {};
      if (req.query.year && req.query.year !== '') {
        where.yearOfAdmission = req.query.year;
      }
      if (req.query.programme && req.query.programme !== '') {
        where.programme = req.query.programme;
      }
      if (req.query.name && req.query.name.trim()) {
        const search = `%${req.query.name.trim()}%`;
        where[Op.or] = [
          { firstName: { [Op.like]: search } },
          { surname: { [Op.like]: search } }
        ];
      }

      // Sorting
      let order = [['createdAt', 'DESC']];
      if (req.query.sortBy && req.query.sortOrder) {
        order = [[req.query.sortBy, req.query.sortOrder.toUpperCase()]];
      }

      // Query students
      const { count, rows } = await Student.findAndCountAll({
        where,
        order,
        offset,
        limit: pageSize
      });

      res.json({
        students: rows,
        total: count,
        totalPages: Math.ceil(count / pageSize),
        page
      });
    } catch (err) {
      console.error('Error in /api/students:', err);
      res.status(500).json({ error: err.message });
    }
});
app.get('/api/summary', async (req, res) => {
  try {
    // Get count of students by programme, optionally filtered by year
    const { Student } = require('./models/models');
    // Use programme names that match your frontend and database
    const programmes = ['General Science', 'General Arts', 'Visual Arts', 'Business', 'Home Economics'];
    const summary = {};
    const where = {};
    if (req.query.year) {
      where.yearOfAdmission = req.query.year;
    }
    for (const prog of programmes) {
      summary[prog] = await Student.count({ where: { ...where, programme: prog } });
    }
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await sequelize.sync();
  console.log(`Server running on port ${PORT}`);
});
