const mongoose =require("mongoose")

const DashboardSchema = new mongoose.Schema({
    cards: [
        {
            ActiveProjects: {
            type: String,
            required: true,
          },
          count: {
            type: Number,
            required: true,
          },
          description: {
            type: String, 
            required: false,
          },
          color: {
            type: String,
            required: false,
     }
    }
  ],
  }, {
    timestamps: true,
  });
  

  
module.exports = mongoose.model('Dashboard',DashboardSchema)