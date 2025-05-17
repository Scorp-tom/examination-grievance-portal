// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ 
      success: false,
      error: 'Authorization token required' 
    });
  }

  // Check Bearer token format
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ 
      success: false,
      error: 'Invalid token format. Use: Bearer <token>' 
    });
  }

  const token = parts[1];

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    
    let errorMessage = 'Invalid token';
    if (err.name === 'TokenExpiredError') {
      errorMessage = 'Token expired';
    }

    return res.status(401).json({ 
      success: false,
      error: errorMessage 
    });
  }
};


// // middleware/auth.js
// const jwt = require('jsonwebtoken');

// module.exports = function(req, res, next) {
//   // Get token from header
//   const authHeader = req.header('Authorization');
  
//   if (!authHeader) {
//     return res.status(401).json({ 
//       success: false,
//       error: 'No authorization token provided' 
//     });
//   }

//   // Check Bearer token format
//   const parts = authHeader.split(' ');
//   if (parts.length !== 2 || parts[0] !== 'Bearer') {
//     return res.status(401).json({ 
//       success: false,
//       error: 'Invalid token format. Use: Bearer <token>' 
//     });
//   }

//   const token = parts[1];

//   // Verify token
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.user;
//     next();
//   } catch (err) {
//     console.error('Token verification error:', err.message);
    
//     let errorMessage = 'Invalid token';
//     if (err.name === 'TokenExpiredError') {
//       errorMessage = 'Token expired';
//     }

//     return res.status(401).json({ 
//       success: false,
//       error: errorMessage 
//     });
//   }
// };

// const jwt = require('jsonwebtoken');

// module.exports = function(req, res, next) {
//   // Get token from header
//   const authHeader = req.header('Authorization');
  
//   if (!authHeader) {
//     return res.status(401).json({ 
//       success: false,
//       error: 'Authorization header missing' 
//     });
//   }

//   // Check for Bearer token format
//   const parts = authHeader.split(' ');
//   if (parts.length !== 2 || parts[0] !== 'Bearer') {
//     return res.status(401).json({ 
//       success: false,
//       error: 'Authorization header format should be: Bearer <token>' 
//     });
//   }

//   const token = parts[1];

//   // Verify token
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.user;
//     next();
//   } catch (err) {
//     console.error('Token verification error:', err.message);
    
//     let errorMessage = 'Invalid token';
//     if (err.name === 'TokenExpiredError') {
//       errorMessage = 'Token expired';
//     } else if (err.name === 'JsonWebTokenError') {
//       errorMessage = 'Malformed token';
//     }

//     return res.status(401).json({ 
//       success: false,
//       error: errorMessage 
//     });
//   }
// };
// const jwt = require('jsonwebtoken');

// module.exports = function(req, res, next) {
//   // Get token from header
//   const token = req.header('x-auth-token');

//   // Check if no token
//   if (!token) {
//     return res.status(401).json({ msg: 'No token, authorization denied' });
//   }

//   // Verify token
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.user;
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: 'Token is not valid' });
//   }
// };