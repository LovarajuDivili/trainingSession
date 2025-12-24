const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  id: { type: String },                
  name: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true },  
  joinDate: { type: Date, default: Date.now },
  skills: [String],
  projectName: { type: String, default: '' },
  userId: { type: String, required: true }
});

employeeSchema.index({ id: 1, userId: 1 }, { unique: true });
employeeSchema.index({ email: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Employee', employeeSchema);
