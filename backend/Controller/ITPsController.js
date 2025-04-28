const asyncHandler = require('express-async-handler');
const ITPs = require('../Model/ITPsModel');


const Induction = require("../Model/InductionModel");
const cloudinary = require('../Config/cloudinary');

cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

const ITPcCreate = asyncHandler(async (req, res) => {
    let {
      projectName,
      InspectionType,
      Inspector,
      Date,
      additionalNotes,
      activity,
      criteria,
      status
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
            folder: "itp_uploads",
            resource_type: "image",
          });
  
          if (uploadResult.secure_url) {
            imageUrls.push(uploadResult.secure_url);
          }
        }
      }
  
      // Create and save ITP record
      const newITP = new ITPs({
        projectName,
        InspectionType,
        Inspector,
        Date,
        InspectionItems,
        additionalNotes,
        activity,
        criteria,
        status,
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
   

//GET SINGLE AllITPs
//METHOD:GET
const AllITPc = async (req, res) => {
    const AllITPc = await ITPs.find()
    if (AllITPc === null) {
        res.status(404)
        throw new Error("Categories Not Found")
    }
    res.json(AllITPc)
}


const getITPs = async (req, res) => {
  try {
    // Fetching only 10 records
    const allITPs = await ITPs.find().limit(10);

    if (!allITPs.length) {
      return res.status(404).json({
        success: false,
        message: "No ITPs found"
      });
    }

    // Respond with the data
    res.status(200).json({
      success: true,
      message: "Fetched 10 ITP records successfully",
      data: allITPs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};



//GET SINGLE DeletePITPs
//METHOD:DELETE
const deleteITPc = async (req, res) => {
    let deleteITPcID = req.params.id
    if (deleteITPc) {
        const deleteITPc = await ITPs.findByIdAndDelete(deleteITPcID, req.body);
        res.status(200).json("Delete ITPs Successfully")
    } else {
        res.status(400).json({ message: "Not Delete ITPs" })
    }
}


//GET SINGLE ITPsUpdate
//METHOD:PUT
const UpdateITPc = asyncHandler(async (req, res) => {
    try {
      const allowedFields = [
        'projectName',
        'InspectionType',
        'Inspector',
        'Date',
        'InspectionItems',
        'additionalNotes',
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
      const updatedITP = await ITPs.findByIdAndUpdate(req.params.id, updateData, {
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
const SingleITPc = async (req, res) => {
    try {
        const SingleITPc = await ITPs.findById(req.params.id);
        res.status(200).json(SingleITPc)
    } catch (error) {
        res.status(404).json({ msg: "Can t Find Projects" })
    }
}



module.exports = { ITPcCreate, AllITPc, getITPs, deleteITPc, UpdateITPc, SingleITPc };