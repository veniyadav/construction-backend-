const mongoose =require("mongoose")
const Project = require("../Model/projectsModel"); 

const SwmsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Projects', required: true },
    workArea: { type: String, required: true },
    description: { type: String, required: true },
  
    hazardsandControls: [
      {
        hazardDescription: {
          type: String,
          required: true,
        },
        riskLevel: {
          type: String,
          required: true,
        },
        controlMeasures: {
          type: String,
          required: true,
        },
      },
    ],
  
    ppeRequirements: {
      HardHat: { type: Boolean, required: true },
      SafetyBoots: { type: Boolean, required: true },
      HighVisVest: { type: Boolean, required: true },
      SafetyGlasses: { type: Boolean, required: true },
    },
  
    requiredPermits: {
      WorkingatHeights: { type: Boolean, required: true },
      HotWork: { type: Boolean, required: true },
      ConfinedSpace: { type: Boolean, required: true },
      Excavation: { type: Boolean, required: true },
    },
  }, {
    timestamps: true,
  });
  

module.exports = mongoose.model('SWMS',SwmsSchema)

