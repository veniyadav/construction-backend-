const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,  // Title is required
  },
  startDate: {
    type: String,

  },

  EndDate: {
    type: String,

  },
  priorityLevel: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,  // Message is required
  },
  image: [],
  
}, { timestamps: true });  // Adds createdAt and updatedAt timestamps

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;