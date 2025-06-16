const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    // Pull the title, description and status from the request body.
    const { title, description, status } = req.body;
    
    // Create a new instance of Task using the information from the request body.
    const newTask = new Task({
      title,
      description,
      status,
      user: req.user.id                                                   // Pulls the user id from the details attached to the request body by the middleware
    });

    // Pushes the changes to the DB.
    const savedTask = await newTask.save();

    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: 'Bad request', error: err.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    // Retrieves all the tasks of the user
    const tasks = await Task.find({ user: req.user.id });

    // Returns a JSON object with a list of the user's tasks
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    // Finds the task based on the id and the user id provided.
    const task = await Task.findOne({
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { title, description, status } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();

    // Send the updated task in the response body
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Delete the task from the DB.
    await task.deleteOne();

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};