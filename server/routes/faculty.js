const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const Grievance = require('../models/Grievacne');
const User = require('../models/User');

// @route   GET api/faculty/grievances
// @desc    Get all grievances assigned to faculty
router.get('/grievances', authMiddleware, async (req, res) => {
  try {
    const grievances = await Grievance.find({ assignedTo: req.user.id })
      .sort({ createdAt: -1 })
      .populate('student', 'name email registrationNumber program');
    res.json(grievances);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/faculty/grievances/:id
// @desc    Respond to a grievance
router.put('/grievances/:id', [
  authMiddleware,
  check('response', 'Response is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ msg: 'Grievance not found' });
    }

    if (grievance.assignedTo.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    grievance.response = req.body.response;
    grievance.status = 'resolved';
    grievance.resolvedAt = Date.now();

    await grievance.save();
    res.json(grievance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;