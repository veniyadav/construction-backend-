
const Incident = require("../Model/IncidentModel");
const SWMS=require("../Model/SwmsModel");
const ITPs = require('../Model/ITPsModel');


const asyncHandler = require("express-async-handler");

const cloudinary = require('../Config/cloudinary');


cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
  });


  const createIncident = async (req, res) => {
    const { 
      incidentType, 
      dateTime, 
      location, 
      description, 
      severityLevel, 
      witnesses, 
      immediateActions 
    } = req.body;
  
    let imageUrl = '';  // Variable to store the URL of the uploaded image
  
    try {
      // Check if an image file is uploaded (single image)
      if (req.files && req.files.image) {
        const file = req.files.image;  // Retrieve the uploaded image file
  
        // Upload the image to Cloudinary with the 'uploads' folder and 'image' resource type
        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'uploads',  // Specify folder in Cloudinary
          resource_type: 'image', // Set resource type to 'image'
        });
  
        imageUrl = uploadResult.secure_url;  // Get the secure URL of the uploaded image
      }
  
      // Create a new Incident document in the database
      const newIncident = new Incident({
        incidentType,
        dateTime: new Date(dateTime),  // Ensure the date is in the correct format
        location,
        description,
        severityLevel,
        witnesses,
        immediateActions,
        image: imageUrl,  // Store the uploaded image URL
      });
  
      // Save the new incident document to the database
      await newIncident.save();
  
      // Respond with the created incident data
      res.status(201).json({
        success: true,
        message: 'Incident report created successfully',
        incident: newIncident,
      });
    } catch (error) {
      console.error('Error creating incident:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while creating the incident report',
        error: error.message,
      });
    }
  };

  const getAllIncidents = async (req, res) => {
    try {
      const incidents = await Incident.find().sort({ dateTime: -1 });  // Sort by date (newest first)
      res.status(200).json({
        success: true,
        incidents,
      });
    } catch (error) {
      console.error('Error fetching incidents:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching incidents',
        error: error.message,
      });
    }
  };
   


  const getIncidentById = async (req, res) => {
    const { id } = req.params;  // Get the incident ID from the URL
  
    try {
      const incident = await Incident.findById(id);
  
      if (!incident) {
        return res.status(404).json({
          success: false,
          message: 'Incident not found',
        });
      }
  
      res.status(200).json({
        success: true,
        incident,
      });
    } catch (error) {
      console.error('Error fetching incident by ID:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching the incident',
        error: error.message,
      });
    }
  };



  const updateIncident = async (req, res) => {
    const { id } = req.params;
    const { incidentType, dateTime, location, description, severityLevel, witnesses, immediateActions } = req.body;
  
    try {
      // Retrieve the existing incident
      const existingIncident = await Incident.findById(id);
      if (!existingIncident) {
        return res.status(404).json({ success: false, message: 'Incident not found' });
      }
  
      // Delete the existing image from Cloudinary if it exists
      if (existingIncident.image && existingIncident.image.public_id) {
        await cloudinary.uploader.destroy(existingIncident.image.public_id);
      }
  
      // Upload the new image to Cloudinary if provided
      let imageUrl = '';
      if (req.files && req.files.image) {
        const file = req.files.image;
        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'uploads',
          resource_type: 'image',
        });
        imageUrl = uploadResult.secure_url;
      }
  
      // Update the incident in the database
      const updatedIncident = await Incident.findByIdAndUpdate(
        id,
        {
          incidentType,
          dateTime: new Date(dateTime),
          location,
          description,
          severityLevel,
          witnesses,
          immediateActions,
          image: imageUrl ? [imageUrl] : existingIncident.image,
        },
        { new: true }
      );
  
      res.status(200).json({
        success: true,
        message: 'Incident updated successfully',
        incident: updatedIncident,
      });
    } catch (error) {
      console.error('Error updating incident:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while updating the incident',
        error: error.message,
      });
    }
  };



  const deleteIncident = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Retrieve the existing incident
      const existingIncident = await Incident.findById(id);
      if (!existingIncident) {
        return res.status(404).json({ success: false, message: 'Incident not found' });
      }
  
      // Delete the image from Cloudinary if it exists
      if (existingIncident.image && existingIncident.image.public_id) {
        await cloudinary.uploader.destroy(existingIncident.image.public_id);
      }
  
      // Delete the incident from the database
      await Incident.findByIdAndDelete(id);
  
      res.status(200).json({
        success: true,
        message: 'Incident deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting incident:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while deleting the incident',
        error: error.message,
      });
    }
  };
  


 



  
  
  
  
  
  



module.exports = {createIncident, getAllIncidents, getIncidentById, updateIncident, deleteIncident};
