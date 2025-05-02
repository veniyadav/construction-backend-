const mongoose = require("mongoose");

const ITPsSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  InspectionType: {
    type: String,
    required: true,
  },
  Inspector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
  InspectionItems: [
    {
      itemDescription: {
        type: String,
        required: true,
      },
      status: {
        type: Boolean,
        required: true,
        default: false,
      },
      comments: {
        type: String,
        required: true,
      },
    }
  ],
  additionalNotes: {
    type: String,
    required: true,
  },
  activity: {
    type: String,
    required: true,
  },
  criteria: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  image: [],
}, {
  timestamps: true,
});

const ITPs = mongoose.model('ITPs', ITPsSchema);
module.exports = ITPs;
