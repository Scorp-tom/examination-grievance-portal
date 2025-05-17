const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// @route   POST api/auth/register
// @desc    Register user (student, faculty, or admin)
// @access  Public
router.post(
  "/register",
  [
    // Basic validation
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 6+ characters").isLength({ min: 6 }),
    check("role", "Role is required").isIn(["student", "faculty", "admin"]),

    // Conditional validation for students
    check("registrationNumber")
      .if(check("role").equals("student"))
      .not()
      .isEmpty(),
    check("fathersName").if(check("role").equals("student")).not().isEmpty(),
    check("mothersName").if(check("role").equals("student")).not().isEmpty(),
    check("program").if(check("role").equals("student")).not().isEmpty(),

    // Conditional validation for faculty/admin
    check("department")
      .if(check("role").isIn(["faculty", "admin"]))
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    // 1. Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const {
      name,
      email,
      password,
      role,
      registrationNumber,
      fathersName,
      mothersName,
      program,
      department,
    } = req.body;

    try {
      // 2. Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          success: false,
          error: "User already exists",
        });
      }

      // 3. Hash password (for ALL user types)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 4. Create user object based on role
      const userFields = {
        name,
        email,
        password: hashedPassword,
        role,
      };

      // Add student-specific fields
      if (role === "student") {
        userFields.registrationNumber = registrationNumber;
        userFields.fathersName = fathersName;
        userFields.mothersName = mothersName;
        userFields.program = program;
      }
      // Add faculty/admin fields
      else {
        userFields.department = department;
      }

      // 5. Save user to database
      user = new User(userFields);
      await user.save();

      // 6. Generate JWT token
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5h" },
        (err, token) => {
          if (err) {
            console.error("JWT Error:", err);
            return res.status(500).json({
              success: false,
              error: "Could not generate token",
            });
          }
          res.json({
            success: true,
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
          });
        }
      );

      console.log("Registering user:", {
        email: req.body.email,
        role: req.body.role,
        passwordHash: hashedPassword, // Log the hashed password
      });
    } catch (err) {
      console.error("Registration Error:", err.message);
      res.status(500).json({
        success: false,
        error: "Server error during registration",
      });
    }
  }
);

// @route   POST api/auth/register
// @desc    Register user
// router.post('/register', [
//   check('name', 'Name is required').not().isEmpty(),
//   check('email', 'Please include a valid email').isEmail(),
//   check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
//   check('role', 'Role is required').not().isEmpty()
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({
//       success: false,
//       errors: errors.array()
//     });
//   }

//   const { name, email, password, role, registrationNumber, fathersName, mothersName, program, department } = req.body;

//   try {
//     let user = await User.findOne({ email });

//     if (user) {
//       return res.status(400).json({
//         success: false,
//         error: 'User already exists'
//       });
//     }

//     // Hash password before saving
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       registrationNumber,
//       fathersName,
//       mothersName,
//       program,
//       department
//     });

//     await user.save();
//     console.log("New user created:", user.email);

//     const payload = {
//       user: {
//         id: user.id,
//         role: user.role
//       }
//     };

//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: '5h' },
//       (err, token) => {
//         if (err) {
//           console.error('JWT signing error:', err);
//           return res.status(500).json({
//             success: false,
//             error: 'Could not generate token'
//           });
//         }
//         res.json({
//           success: true,
//           token
//         });
//       }
//     );
//   } catch (err) {
//     console.error('Registration error:', err.message);
//     res.status(500).json({
//       success: false,
//       error: 'Server error: ' + err.message
//     });
//   }
// });

// @route   POST api/auth/login
// @desc    Login user
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    // Add this debug log:
    console.log("Login attempt:", req.body.email);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      // Debug: Log stored vs. input password (remove in production!)
      console.log(
        `Stored hash: ${user.password}\nInput pass: ${req.body.password}`
      );

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      // Debug: Check role
      console.log("User role:", user.role);

      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5h" },
        (err, token) => {
          if (err) throw err;
          res.json({
            success: true,
            token,
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        success: false,
        error: "Server error",
      });
    }
  }
);

// @route   GET api/auth/user
// @desc    Get current user data
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { check, validationResult } = require('express-validator');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const authMiddleware = require('../middleware/auth');

// // @route   POST api/auth/register
// // @desc    Register user
// router.post('/register', [
//   check('name', 'Name is required').not().isEmpty(),
//   check('email', 'Please include a valid email').isEmail(),
//   check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
//   check('role', 'Role is required').not().isEmpty()
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({
//       success: false,
//       errors: errors.array()
//     });
//   }

//   const { name, email, password, role, registrationNumber, fathersName, mothersName, program, department } = req.body;

//   try {
//     let user = await User.findOne({ email });

//     if (user) {
//       return res.status(400).json({
//         success: false,
//         error: 'User already exists'
//       });
//     }

//     user = new User({
//       name,
//       email,
//       password,
//       role,
//       registrationNumber,
//       fathersName,
//       mothersName,
//       program,
//       department
//     });

//     await user.save();
//     console.log("New User Created");

//     const payload = {
//       user: {
//         id: user.id,
//         role: user.role
//       }
//     };

//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: '5h' },
//       (err, token) => {
//         if (err) throw err;
//         res.json({
//           success: true,
//           token
//         });
//       }
//     );
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({
//       success: false,
//       error: 'Server error'
//     });
//   }
// });

// @route   GET api/auth/user
// @desc    Get current user data
// router.get('/user', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id)
//       .select('-password')
//       .lean()
//       .exec();

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found'
//       });
//     }

//     res.json({
//       success: true,
//       user
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({
//       success: false,
//       error: 'Server error'
//     });
//   }
// });

// // @route   POST api/auth/register
// // @desc    Register user
// router.post('/register', [
//   check('name', 'Name is required').not().isEmpty(),
//   check('email', 'Please include a valid email').isEmail(),
//   check('password', 'Password must be 6+ characters').isLength({ min: 6 }),
//   check('role', 'Role is required').isIn(['student', 'faculty', 'admin'])
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({
//       success: false,
//       errors: errors.array()
//     });
//   }

//   const { name, email, password, role } = req.body;

//   try {
//     // Check if user exists
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({
//         success: false,
//         error: 'User already exists'
//       });
//     }

//     // Create user
//     user = new User({
//       name,
//       email,
//       password,
//       role
//     });

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     // Save user
//     await user.save();

//     // Create JWT payload
//     const payload = {
//       user: {
//         id: user.id,
//         role: user.role
//       }
//     };

//     // Sign token
//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: '5h' },
//       (err, token) => {
//         if (err) throw err;
//         res.json({
//           success: true,
//           token
//         });
//       }
//     );
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({
//       success: false,
//       error: 'Server error'
//     });
//   }
// });

// @route   POST api/auth/login
// @desc    Login user
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      // Create JWT payload
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      // Sign token
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5h" },
        (err, token) => {
          if (err) throw err;
          res.json({
            success: true,
            token,
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        success: false,
        error: "Server error",
      });
    }
  }
);

// @route   GET api/auth/user
// @desc    Get current user data
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

module.exports = router;
