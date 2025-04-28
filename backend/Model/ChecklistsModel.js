const mongoose =require("mongoose")

const ChecklistsSchema = new mongoose.Schema({
    checklistName: { type: String, required: true },
    project: { type: String, required: true },
    AssignTo: { type: String, required: true },
    date: { type: Date, required: true },
  
    checklistItems: [
      {
        checklistItem: {
          type: String,
          required: true,
        },
      }
    ],
    additionalNotes: { type: String, required: true },
    status: { type: String, required: true },
  }, {
    timestamps: true,
  });
  

  
module.exports = mongoose.model('Checklists',ChecklistsSchema)