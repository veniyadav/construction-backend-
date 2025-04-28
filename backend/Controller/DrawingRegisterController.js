const asyncHandler = require('express-async-handler');
const DrawingRegister = require('../Model/DrawingRegisterModel');


const Induction = require("../Model/InductionModel");
const cloudinary = require('../Config/cloudinary');

cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

const DrawingRegisterCreate = asyncHandler(async (req, res) => {
    let {
        documentTitle,
        documentType,
        folder,
        assignedTo,
        comments
    } = req.body;


    try {
      let imageUrls = [];
  
      // Handle image uploads
      if (req.files && req.files.image) {
        const files = Array.isArray(req.files.image)
          ? req.files.image
          : [req.files.image];
  
        for (const file of files) {
          const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "itp_uploads",
            resource_type: "image",
          });
  
          if (uploadResult.secure_url) {
            imageUrls.push(uploadResult.secure_url);
          }
        }
      }
  
      // Create and save ITP record
      const newITP = new DrawingRegister({
        documentTitle,
        documentType,
        folder,
        assignedTo,
        comments,
        image: imageUrls,
      });
  
      await newITP.save();
  
      res.status(201).json({
        success: true,
        message: "ITP created successfully",
        itp: newITP,
      });
    } catch (error) {
      console.error("Error creating ITP:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while creating the ITP",
        error: error.message,
      });
    }
  });




  
    
    //GET SINGLE AllProjects
    //METHOD:GET
    const AllDrawingRegister = async (req, res) => {
        const AllDrawingRegister = await DrawingRegister.find()
        if (AllDrawingRegister === null) {
          res.status(404)
          throw new Error("Categories Not Found")
        }
        res.json(AllDrawingRegister)
      }
      
    
    
        //GET SINGLE DeleteProjects
    //METHOD:DELETE
    const deleteDrawingRegister = async (req, res) => {
        let deleteDrawingRegisterID = req.params.id
        if (deleteDrawingRegister) {
          const deleteDefect = await DrawingRegister.findByIdAndDelete(deleteDrawingRegisterID, req.body);
          res.status(200).json("Delete Defect Successfully")
        } else {
          res.status(400).json({ message: "Not Delete project" })
        }
      }
      
    
      //GET SINGLE ProjectsUpdate
    //METHOD:PUT
  const UpdateDrawingRegister = asyncHandler(async (req, res) => {
      try {
        const allowedFields = [
          'documentTitle',
          'documentType',
          'folder',
          'assignedTo',
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
        const updatedITP = await DrawingRegister.findByIdAndUpdate(req.params.id, updateData, {
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
    const SingleDrawingRegister=async(req,res)=>{
        try {
            const SingleDefect= await DrawingRegister.findById(req.params.id);
            res.status(200).json(SingleDefect)
        } catch (error) {
            res.status(404).json({msg:"Can t Find Diaries"} )
        }
    }
  
  
  


  module.exports = {DrawingRegisterCreate,AllDrawingRegister,deleteDrawingRegister,UpdateDrawingRegister,SingleDrawingRegister}