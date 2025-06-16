const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authenticateToken = require('../middleware/auth');
const {
  createTask,
  getTask,
  updateTask,
  deleteTask
} = require('../controllers/taskControllers')

// GET all tasks
router.get('/', authenticateToken, getTask);

// POST a new task
router.post('/', authenticateToken, createTask);

// POST request to update a task
router.post('/:id', authenticateToken, updateTask);

// DELETE a task
router.delete('/:id', authenticateToken, deleteTask);

module.exports = router;