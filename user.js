const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  subscriptionPlan: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  paymentDate: { type: Date, required: true },
  expirationDate: { type: Date, required: true }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
