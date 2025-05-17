const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    default: 'student'
  },
  department: {
    type: String,
    required: function() { return this.role !== 'student'; }
  },
  registrationNumber: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  fathersName: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  mothersName: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  program: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// UserSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

UserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);