// routes/grievances.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Grievance = require('../models/Grievacne');

// @route   GET api/grievances/student
// @desc    Get all grievances for current student
router.get('/student', authMiddleware, async (req, res) => {
  try {
    const grievances = await Grievance.find({ student: req.user.id })
      .sort({ createdAt: -1 })
      .populate('assignedTo', 'name email department');
      
    res.json(grievances);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

// @route   POST api/grievances
// @desc    Create a grievance
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, subjects, department } = req.body;
    
    const newGrievance = new Grievance({
      student: req.user.id,
      title,
      description,
      subjects,
      department
    });

    const grievance = await newGrievance.save();
    res.json(grievance);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middleware/auth');
// const { check, validationResult } = require('express-validator');
// const Grievance = require('../models/Grievacne');
// const User = require('../models/User');

// // @route   POST api/grievances
// // @desc    Create a grievance
// router.post('/', [
//   authMiddleware,
//   [
//     check('title', 'Title is required').not().isEmpty(),
//     check('description', 'Description is required').not().isEmpty(),
//     check('department', 'Department is required').not().isEmpty(),
//     check('subjects', 'At least one subject is required').isArray({ min: 1 })
//   ]
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   try {
//     const student = await User.findById(req.user.id);

//     const { title, description, subjects, department } = req.body;

//     const newGrievance = new Grievance({
//       student: req.user.id,
//       title,
//       description,
//       subjects,
//       department,
//       status: 'open'
//     });

//     const grievance = await newGrievance.save();
//     res.json(grievance);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // @route   GET api/grievances/student
// // @desc    Get all grievances for a student
// router.get('/student', authMiddleware, async (req, res) => {
//   try {
//     const grievances = await Grievance.find({ student: req.user.id })
//       .sort({ createdAt: -1 })
//       .populate('assignedTo', 'name email');
//     res.json(grievances);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;