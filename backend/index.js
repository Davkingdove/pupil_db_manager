const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { sequelize, Student } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// Multer config for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/png', 'image/jpeg'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type'));
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

// File upload endpoint
app.post('/api/upload/:studentId', upload.single('beceResult'), async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    student.beceResultFile = req.file.filename;
    await student.save();
    res.json({ success: true });
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
      if (req.query.year) {
        where.yearOfAdmission = req.query.year;
      }
      if (req.query.programme) {
        where.programme = req.query.programme;
      }
      if (req.query.name && req.query.name.trim()) {
        const search = `%${req.query.name.trim()}%`;
        where[Op.or] = [
          { firstName: { [Op.like]: search } },
          { surname: { [Op.like]: search } },
          { middleNames: { [Op.like]: search } }
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
      res.status(500).json({ error: err.message });
    }
});

app.get('/api/summary', async (req, res) => {
  // ...summary chart data logic...
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await sequelize.sync();
  console.log(`Server running on port ${PORT}`);
});
