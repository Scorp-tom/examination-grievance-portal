const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const Grievance = require('../models/Grievacne');
const User = require('../models/User');

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

module.exports = router;