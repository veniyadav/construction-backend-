const asyncHandler = require('express-async-handler');
const Defect = require('../Model/DefectListsModel');


const Induction = require("../Model/InductionModel");
const cloudinary = require('../Config/cloudinary');

cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

const DefectCreate = asyncHandler(async (req, res) => {
    let {
        title,
        project,
        location,
        category,
        assigned,
        priority,
        description,
        status,
        comments,
        date,
    } = req.body;
    
  
    let InspectionItems = [];
  
    // Parse InspectionItems if it comes as a JSON string
    try {
      if (req.body.InspectionItems) {
        if (typeof req.body.InspectionItems === "string") {
          InspectionItems = JSON.parse(req.body.InspectionItems);
        } else {
          InspectionItems = req.body.InspectionItems;
        }
      }
    } catch (err) {
      console.error("Failed to parse InspectionItems:", err);
      return res.status(400).json({
        success: false,
        message: "Invalid format for InspectionItems",
      });
    }
  
    try {
      let imageUrls = [];
  
      // Handle image uploads
      if (req.files && req.files.image) {
        const files = Array.isArray(req.files.image)
          ? req.files.image
          : [req.files.image];
  
        for (const file of files) {
          const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "Defect_uploads",
            resource_type: "image",
          });
  
          if (uploadResult.secure_url) {
            imageUrls.push(uploadResult.secure_url);
          }
        }
      }
  
      // Create and save Defect record
      const newDefect = new Defect({
        title,
        project,
        location,
        category,
        assigned,
        priority,
        description,
        status,
        comments,
        date,
        image: imageUrls,
    });
    
      await newDefect.save();
      res.status(201).json({
        success: true,
        message: "Defect created successfully",
        Defect: newDefect,
      });
    } catch (error) {
      console.error("Error creating Defect:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while creating the Defect",
        error: error.message,
      });
    }
  });


  
  //GET SINGLE AllProjects
  //METHOD:GET
  const AllDefect = async (req, res) => {
      const AllDefect = await Defect.find()
      if (AllDefect === null) {
        res.status(404)
        throw new Error("Categories Not Found")
      }
      res.json(AllDefect)
    }
    
  
  
      //GET SINGLE DeleteProjects
  //METHOD:DELETE
  const deleteDefect = async (req, res) => {
      let deleteDefectID = req.params.id
      if (deleteDefect) {
        const deleteDefect = await Defect.findByIdAndDelete(deleteDefectID, req.body);
        res.status(200).json("Delete Defect Successfully")
      } else {
        res.status(400).json({ message: "Not Delete project" })
      }
    }
    
  
    //GET SINGLE ProjectsUpdate
  //METHOD:PUT
const UpdateDefect = asyncHandler(async (req, res) => {
    try {
      const allowedFields = [
        'title',
        'project',
        'location',
        'category',
        'assigned',
        'priority',
        'description',
        'status',
        'comments',
      ];
  
      const updateData = {}; 
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          if (field === 'InspectionItems') {
            try {
              updateData[field] = typeof req.body[field] === 'string'
                ? JSON.parse(req.body[field])
                : req.body[field];
            } catch (err) {
              return res.status(400).json({
                message: 'Invalid JSON format in InspectionItems',
              });
            }
          } else {
            updateData[field] = req.body[field];
          }
        }
      });
  
      // Handle image update
      let imageUrls = [];
      if (req.files && req.files.image) {
        const files = Array.isArray(req.files.image)
          ? req.files.image
          : [req.files.image];
  
        for (const file of files) {
          const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'itp_uploads',
            resource_type: 'image',
          });
  
          if (uploadResult.secure_url) {
            imageUrls.push(uploadResult.secure_url);
          }
        } 
        updateData.image = imageUrls;
      }
  
      // Require at least one field to update
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          message: 'At least one field must be provided for update',
        });
      }
  
      // Find and update
      const updatedITP = await Defect.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      });
      if (!updatedITP) {
        return res.status(404).json({ message: 'ITP record not found' });
      } 
      res.status(200).json({
        success: true,
        message: 'ITP updated successfully',
        itp: updatedITP,
      });
    } catch (error) {
      console.error('Error updating ITP:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
  
  //METHOD:Single
  //TYPE:PUBLIC
  const SingleDefect=async(req,res)=>{
      try {
          const SingleDefect= await Defect.findById(req.params.id);
          res.status(200).json(SingleDefect)
      } catch (error) {
          res.status(404).json({msg:"Can t Find Diaries"} )
      }
  }



  module.exports = {DefectCreate,AllDefect,deleteDefect,UpdateDefect,SingleDefect};