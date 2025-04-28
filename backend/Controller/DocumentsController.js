const asyncHandler = require("express-async-handler");
const Documents = require("../Model/DocumentsModel");
const cloudinary = require('../Config/cloudinary');

cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
  });



  const DocumentsCreate = asyncHandler(async (req, res) => {
    const {
      folder,
      documentName,
      documentType,
      assignTo,
      dueDate,
      submissionDate,
      status,
      comments
    } = req.body;
  
    // Validate required fields
    if (!folder || !documentName || !documentType || !assignTo || !dueDate || !submissionDate || !status || !comments) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    // Handle image upload
    let imageUrl = '';
    if (req.files && req.files.image) {
      try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
          folder: 'uploads',  // Folder in Cloudinary where images are stored
          resource_type: 'image'
        });
  
        // Get the image URL from the Cloudinary response
        imageUrl = result.secure_url; // Secure URL to the uploaded image
      } catch (error) {
        return res.status(500).json({ message: 'Error uploading image to Cloudinary', error: error.message });
      }
    }
  
    // Create new document in database
    const newDocument = await Documents.create({
      folder,
      documentName,
      documentType,
      assignTo,
      dueDate,
      submissionDate,
      status,
      comments,
      image: imageUrl,  // Store the image URL in the database
    });
  
    res.status(201).json({
      success: true,
      message: 'Document created successfully',
      data: newDocument,
    });
  });
  

  

  
  //GET SINGLE AllProjects
  //METHOD:GET
  const AllDocuments = async (req, res) => {
      const AllDocuments = await Documents.find()
      if (AllDocuments === null) {
        res.status(404)
        throw new Error("Categories Not Found")
      }
      res.json(AllDocuments)
    }
    
  
  
      //GET SINGLE DeleteProjects
  //METHOD:DELETE
  const deleteDocuments = async (req, res) => {
      let deleteDocumentsID = req.params.id
      if (deleteDocuments) {
        const deleteDocuments = await Documents.findByIdAndDelete(deleteDocumentsID, req.body);
        res.status(200).json("Delete Checklists Successfully")
      } else {
        res.status(400).json({ message: "Not Delete project" })
      }
    }
    
  
    //GET SINGLE ProjectsUpdate
  //METHOD:PUT
  const UpdateDocuments = asyncHandler(async (req, res) => {
    const {
      folder,
      documentName,
      documentType,
      assignTo,
      dueDate,
      submissionDate,
      status,
      comments
    } = req.body;
  
    // Validate required fields
    if (
      !folder ||
      !documentName ||
      !documentType ||
      !assignTo ||
      !dueDate ||
      !submissionDate ||
      !status ||
      !comments
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    let imageUrl = '';
  
    // Handle image upload if a new image is provided
    if (req.files && req.files.image) {
      try {
        // Upload the new image to Cloudinary
        const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
          folder: 'uploads',  // Folder in Cloudinary where images are stored
          resource_type: 'image',
        });
  
        // Get the image URL from the Cloudinary response
        imageUrl = result.secure_url; // Secure URL to the uploaded image
      } catch (error) {
        return res.status(500).json({ message: 'Error uploading image to Cloudinary', error: error.message });
      }
    }
  
    // Prepare the update data, including the image URL if a new image is provided
    const updateData = {
      folder,
      documentName,
      documentType,
      assignTo,
      dueDate,
      submissionDate,
      status,
      comments,
    };
  
    // If a new image was uploaded, add it to the update data
    if (imageUrl) {
      updateData.image = imageUrl;
    }
  
    try {
      // Find the document by ID and update it with the new data
      const updatedDocument = await Documents.findByIdAndUpdate(
        req.params.id,  // Document ID from the URL parameter
        updateData,     // The updated data to be applied
        { new: true }   // Return the updated document
      );
  
      if (!updatedDocument) {
        return res.status(404).json({ message: 'Document not found' });
      }
  
      res.status(200).json({
        success: true,
        message: 'Document updated successfully',
        data: updatedDocument,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
  
  
  
  //METHOD:Single
  //TYPE:PUBLIC
  const SingleDocuments=async(req,res)=>{
      try {
          const SingleDocuments= await Documents.findById(req.params.id);
          res.status(200).json(SingleDocuments)
      } catch (error) {
          res.status(404).json({msg:"Can t Find Diaries"} )
      }
  }
module.exports = {DocumentsCreate,AllDocuments,deleteDocuments,UpdateDocuments,SingleDocuments};