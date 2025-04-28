const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  incidentType: { type: String, required: true },  // Type of incident (e.g., Accident, Fire, etc.)
  dateTime: { type: Date, required: true },  // Date and time of the incident
  location: { type: String, required: true },  // Incident location
  description: { type: String, required: true },  // Description of the incident
  severityLevel: { type: String, required: true },  // Severity level
  witnesses: [{ type: String }],  // List of witnesses
  immediateActions: { type: String, required: true },  // Immediate actions taken
  image: [],  // Array of file URLs (for evidence files uploaded)
}, { timestamps: true });

module.exports = mongoose.model('Incident', incidentSchema);
