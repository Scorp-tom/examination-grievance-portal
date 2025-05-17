const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const Grievance = require('../models/Grievacne');
const User = require('../models/User');
const excelJS = require('exceljs');
// @route   GET api/admin/grievances
// @desc    Get all grievances (admin view)
router.get('/grievances', authMiddleware, async (req, res) => {
  try {
    const { department, status, month, year } = req.query;
    
    let query = {};
    
    if (department) query.department = department;
    if (status) query.status = status;
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      query.createdAt = { $gte: startDate, $lt: endDate };
    }
    
    const grievances = await Grievance.find(query)
      .sort({ createdAt: -1 })
      .populate('student', 'name email registrationNumber program department')
      .populate('assignedTo', 'name email department');
    
    res.json(grievances);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/admin/grievances/:id/assign
// @desc    Assign grievance to faculty
router.put('/grievances/:id/assign', [
  authMiddleware,
  check('facultyId', 'Faculty ID is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const grievance = await Grievance.findById(req.params.id);
    const faculty = await User.findById(req.body.facultyId);

    if (!grievance) {
      return res.status(404).json({ msg: 'Grievance not found' });
    }

    if (!faculty || faculty.role !== 'faculty') {
      return res.status(400).json({ msg: 'Invalid faculty member' });
    }

    grievance.assignedTo = req.body.facultyId;
    grievance.status = 'assigned';

    await grievance.save();
    res.json(grievance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/admin/faculty
// @desc    Get all faculty members
router.get('/faculty', authMiddleware, async (req, res) => {
  try {
    const faculty = await User.find({ role: 'faculty' }).select('name email department');
    res.json(faculty);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});




// Add this new route after your existing routes
router.get('/grievances/export', authMiddleware, async (req, res) => {
  try {
    const { department, status, fromDate, toDate } = req.query;
    
    let query = {};
    if (department) query.department = department;
    if (status) query.status = status;
    
    // Add date range filtering
    if (fromDate && toDate) {
      query.createdAt = { 
        $gte: new Date(fromDate), 
        $lte: new Date(toDate) 
      };
    }
    
    const grievances = await Grievance.find(query)
      .populate('student', 'name email registrationNumber program department')
      .populate('assignedTo', 'name email department')
      .sort({ createdAt: -1 });

    // Create Excel workbook
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Grievances');
    
    // Define columns
    worksheet.columns = [
      { header: 'Student Name', key: 'studentName', width: 25 },
      { header: 'Registration No', key: 'regNo', width: 20 },
      { header: 'Department', key: 'department', width: 20 },
      { header: 'Program', key: 'program', width: 20 },
      { header: 'Grievance Title', key: 'title', width: 30 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'Subjects', key: 'subjects', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Assigned To', key: 'assignedTo', width: 25 },
      { header: 'Date Created', key: 'createdAt', width: 20 },
      { header: 'Date Resolved', key: 'resolvedAt', width: 20 }
    ];

    // Add data rows
    grievances.forEach(grievance => {
      worksheet.addRow({
        studentName: grievance.student.name,
        regNo: grievance.student.registrationNumber,
        department: grievance.department,
        program: grievance.student.program,
        title: grievance.title,
        description: grievance.description,
        subjects: grievance.subjects?.map(s => `${s.code} - ${s.name}`).join(', ') || 'N/A',
        status: grievance.status,
        assignedTo: grievance.assignedTo?.name || 'Unassigned',
        createdAt: formatDate(grievance.createdAt),
        resolvedAt: grievance.resolvedAt ? formatDate(grievance.resolvedAt) : 'N/A'
      });
    });

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=grievances.xlsx'
    );

    // Send the workbook
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Helper function to format dates
function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

module.exports = router;