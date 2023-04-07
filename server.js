const express = require('express');
const bodyParser = require('body-parser');
const User = require('./user');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to DB"))
.catch((error) => console.log(error.message));

const app = express();
app.use(bodyParser.json());

// Create a new user
app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } 
  catch(error) {
    res.status(400).send(error);
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } 
  catch(error) {
    res.status(500).send();
  }
});

// Update a user
app.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'subscriptionPlan', 'paymentMethod', 'paymentDate', 'expirationDate'];
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

  if(!isValidUpdate) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if(!user) {
      return res.status(404).send();
    }
    res.send(user);
  } 
  catch(error) {
    res.status(400).send(error);
  }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if(!user) {
      return res.status(404).send();
    }
    res.send(user);
  } 
  catch(error) {
    res.status(500).send();
  }
});

module.exports = app;
