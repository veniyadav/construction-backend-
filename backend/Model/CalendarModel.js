const mongoose =require("mongoose")
const Project = require("../Model/projectsModel"); 
const Swms=require("../Model/SwmsModel")

const CalendarSchema = new mongoose.Schema({
    taskTitle: { 
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId, // ObjectId for project
      ref: 'Projects',
      required: true,
      validate: {
        validator: (v) => mongoose.Types.ObjectId.isValid(v), // Validate the ObjectId format
        message: 'Invalid Project ID',
      },
    },
    taskType: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    assignTeamMembers: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image: [],
    reminders:[
        {
            email:{
                type: String,
                required: true,
            },
            PushNotification:{
                type: String,
                required: true,
            }
        }
    ],
    color:{
        type: String,
        required: true,
    },
  }, {
    timestamps: true,
  });
  
  module.exports = mongoose.model('Calendar',CalendarSchema);