const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:   { type: String, required: true },
  email:  { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:  { type: String, enum: ['admin', 'user'], default: 'user' },
  image: { type: String },
  resetCode: { type: String }
});

module.exports = mongoose.model('User', userSchema);
