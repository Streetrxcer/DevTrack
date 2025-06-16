const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['todo', 'in progress', 'done'],
    default: 'todo'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,                               // Foreign Key (reference)
    ref: 'User',
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;