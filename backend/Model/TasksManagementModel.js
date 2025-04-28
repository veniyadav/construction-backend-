const mongoose =require("mongoose")

const TasksManagementSchema = new mongoose.Schema({
    taskTitle: { type: String, required: true },
    description: { type: String, required: true },
    assignTo: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', // <-- Reference to User model
      required: true 
    },
    dueDate: { type: Date, required: true },
    priority: { type: String, required: true },
    category:{ type: String, required: true },
    status:{ type: String, required: true },
  }, {
    timestamps: true,
  });
  

  
module.exports = mongoose.model('TasksManagement',TasksManagementSchema)