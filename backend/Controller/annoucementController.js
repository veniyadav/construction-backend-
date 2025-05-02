const Announcement = require("../Model/announcementModel");
const asyncHandler = require("express-async-handler");

const cloudinary = require('../Config/cloudinary');
const mongoose = require('mongoose');


cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
  });



  const createAnnouncement = async (req, res) => {
    const { title, startDate, EndDate, priorityLevel, message, groups, individuals } = req.body;
  
    // Parse the comma-separated groups string into an array of ObjectIds
    const groupIds = groups ? groups.split(',').map(id => new mongoose.Types.ObjectId(id.trim())) : [];
  
    // Parse the comma-separated individuals string into an array of ObjectIds
    const individualIds = individuals ? individuals.split(',').map(id => new mongoose.Types.ObjectId(id.trim())) : [];
  
    let fileUrl = ''; // Variable to store the image URL
  
    try {
      // Check if an image file is uploaded
      if (req.files && req.files.image) {
        const imageFile = req.files.image; // Get the uploaded image file
  
        // Upload the image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
          folder: 'uploads',  // Store in Cloudinary's "uploads" folder
          resource_type: 'image', // Specify that the resource is an image
        });
  
        // Check if the upload was successful and get the secure URL
        if (uploadResult && uploadResult.secure_url) {
          fileUrl = uploadResult.secure_url; // Get the secure URL for the uploaded image
        } else {
          console.error('Cloudinary upload failed: No URL returned.');
        }
      } else {
        console.log('No image file uploaded.');
      }
  
      // Create the new announcement with user IDs in the individuals and groups arrays
      const newAnnouncement = new Announcement({
        title,
        startDate,
        EndDate,
        priorityLevel,
        message,
        image: fileUrl,  // Save the image URL if an image was uploaded
        groups: groupIds || [],  // Save group data (converted ObjectIds)
        individuals: individualIds || [], // Save individual user IDs (converted ObjectIds)
      });
  
      // Save the announcement to the database
      const savedAnnouncement = await newAnnouncement.save();
  
      // Populate the individuals array with user details (firstName and lastName)
      await savedAnnouncement.populate({
        path: 'individuals',
        model: 'User', // Assuming you have a User model
        select: 'firstName lastName', // Populate firstName and lastName fields
      });
  
      // Populate the groups array with user details (firstName and lastName)
      await savedAnnouncement.populate({
        path: 'groups',
        model: 'User', // Assuming you have a User model
        select: 'firstName lastName', // Populate firstName and lastName fields
      });
  
      // Convert individuals' object array into an array of names (firstName + lastName)
      const transformedAnnouncement = {
        ...savedAnnouncement.toObject(),
        individuals: savedAnnouncement.individuals.map(user => `${user.firstName} ${user.lastName}`),  // Combine first and last names
        groups: savedAnnouncement.groups.map(user =>` ${user.firstName} ${user.lastName}`),  // Combine first and last names
      };
  
      // Respond with a success message and the saved announcement with names
      res.status(201).json({
        success: true,
        message: 'Announcement created successfully',
        data: transformedAnnouncement,
      });
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error creating announcement',
        error: error.message,
      });
    }
  };
  


  const getAllAnnouncements = async (req, res) => {
    try {
      // Fetch all announcements
      const announcements = await Announcement.find()
      .populate('groups', 'firstName lastName') // Populate groups with firstName and lastName
      .populate('individuals', 'firstName lastName'); // Populate individuals with firstName and lastName
  
      res.status(200).json({
        success: true,
        data: announcements,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching announcements',
        error: error.message,
      });
    }
  };
  

  const getAnnouncementById = async (req, res) => {
    const { id } = req.params;  // Get the ID from the request parameters
  
    try {
      // Find the announcement by its ID
      const announcement = await Announcement.findById(id);
  
      if (!announcement) {
        return res.status(404).json({
          success: false,
          message: 'Announcement not found',
        });
      }
  
      res.status(200).json({
        success: true,
        data: announcement,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching announcement',
        error: error.message,
      });
    }
  };
  


  const updateAnnouncement = async (req, res) => {
    const { id } = req.params;  // Get the ID from the request parameters
    const { title, startDate, EndDate, priorityLevel, message, groups, individuals } = req.body;
  
    let fileUrl = ''; // Variable to store the image URL
  
    try {
      // Parse the comma-separated groups string into an array of ObjectIds
      const groupIds = groups ? groups.split(',').map(id => new mongoose.Types.ObjectId(id.trim())) : [];
      const individualIds = individuals ? individuals.split(',').map(id => new mongoose.Types.ObjectId(id.trim())) : [];
  
      // Check if an image file is uploaded and upload to Cloudinary if present
      if (req.files && req.files.image) {
        const imageFile = req.files.image;  // Get the uploaded image file
  
        // Upload the image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
          folder: 'uploads',  // Store in Cloudinary's "uploads" folder
          resource_type: 'image', // Specify that the resource is an image
        });
  
        // Check if the upload was successful and get the secure URL
        if (uploadResult && uploadResult.secure_url) {
          fileUrl = uploadResult.secure_url; // Get the secure URL for the uploaded image
        } else {
          console.error('Cloudinary upload failed: No URL returned.');
        }
      }
  
      // Find and update the announcement
      const updatedAnnouncement = await Announcement.findByIdAndUpdate(
        id,
        {
          title,
          startDate,
          EndDate,
          priorityLevel,
          message,
          image: fileUrl || undefined, // If an image is uploaded, save the URL, else leave it unchanged
          groups: groupIds, // Update groups with ObjectIds
          individuals: individualIds, // Update individuals with ObjectIds
        },
        { new: true }  // Return the updated document
      );
  
      if (!updatedAnnouncement) {
        return res.status(404).json({
          success: false,
          message: 'Announcement not found',
        });
      }
  
      // Populate the individuals array with user details (firstName and lastName)
      await updatedAnnouncement.populate({
        path: 'individuals',
        model: 'User', // Assuming you have a User model
        select: 'firstName lastName', // Populate firstName and lastName fields
      });
  
      // Populate the groups array with user details (firstName and lastName)
      await updatedAnnouncement.populate({
        path: 'groups',
        model: 'User', // Assuming you have a User model
        select: 'firstName lastName', // Populate firstName and lastName fields
      });
  
      // Convert individuals' object array into an array of names (firstName + lastName)
      const transformedAnnouncement = {
        ...updatedAnnouncement.toObject(),
        individuals: updatedAnnouncement.individuals.map(user => `${user.firstName} ${user.lastName}`),  // Combine first and last names
        groups: updatedAnnouncement.groups.map(user =>`${user.firstName} ${user.lastName}`),  // Combine first and last names
      };
  
      res.status(200).json({
        success: true,
        message: 'Announcement updated successfully',
        data: transformedAnnouncement,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating announcement',
        error: error.message,
      });
    }
  };


  const deleteAnnouncement = async (req, res) => {
    const { id } = req.params;  // Get the ID from the request parameters
  
    try {
      // Find and delete the announcement by its ID
      const deletedAnnouncement = await Announcement.findByIdAndDelete(id);
  
      if (!deletedAnnouncement) {
        return res.status(404).json({
          success: false,
          message: 'Announcement not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Announcement deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting announcement',
        error: error.message,
      });
    }
  };
  
  



module.exports = {createAnnouncement, getAllAnnouncements, getAnnouncementById, updateAnnouncement, deleteAnnouncement};


// ye h announcementcontroller h