const asyncHandler = require('express-async-handler');
const ITPs = require('../Model/ITPsModel');
const User = require("../Model/userModel");

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

  // Parse InspectionItems if it's a JSON string
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
    // Validate inspector ID
    const inspectorExists = await User.findById(Inspector);
    if (!inspectorExists) {
      return res.status(404).json({
        success: false,
        message: "Inspector not found",
      });
    }

    let imageUrls = [];

    // Handle image uploads via Cloudinary
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

    // Create and save the ITP record
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
  try {
    // Fetch ITPs and populate Inspector with firstName, lastName, and _id
    const allITPs = await ITPs.find()
      .populate('Inspector', '_id firstName lastName');

    if (allITPs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "ITPs not found",
      });
    }

    // Format each ITP with inspectorName and inspectorId
    const formattedITPs = allITPs.map(itp => {
      const itpObj = itp.toObject();

      if (itpObj.Inspector) {
        itpObj.inspectorId = itpObj.Inspector._id;
        itpObj.inspectorName = `${itpObj.Inspector.firstName} ${itpObj.Inspector.lastName}`;
      } else {
        itpObj.inspectorId = null;
        itpObj.inspectorName = 'Unknown Inspector';
      }

      return itpObj;
    });

    res.status(200).json({
      success: true,
      data: formattedITPs,
    });
  } catch (error) {
    console.error("Error fetching ITPs:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching ITPs",
      error: error.message,
    });
  }
};





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
  const { id } = req.params;

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

  // Parse InspectionItems
  try {
    if (req.body.InspectionItems) {
      if (typeof req.body.InspectionItems === "string") {
        InspectionItems = JSON.parse(req.body.InspectionItems);
      } else {
        InspectionItems = req.body.InspectionItems;
      }

      if (!Array.isArray(InspectionItems)) {
        throw new Error("InspectionItems must be an array");
      }
    }
  } catch (err) {
    console.error("Failed to parse InspectionItems:", err.message);
    return res.status(400).json({
      success: false,
      message: "Invalid format for InspectionItems (must be a JSON array)",
    });
  }

  try {
    // Validate ITP existence
    const existingITP = await ITPs.findById(id);
    if (!existingITP) {
      return res.status(404).json({ success: false, message: "ITP not found" });
    }

    // Validate Inspector existence
    if (Inspector) {
      const inspectorExists = await User.findById(Inspector);
      if (!inspectorExists) {
        return res.status(404).json({
          success: false,
          message: "Inspector not found",
        });
      }
    }

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

    // Update ITP fields
    existingITP.projectName = projectName || existingITP.projectName;
    existingITP.InspectionType = InspectionType || existingITP.InspectionType;
    existingITP.Inspector = Inspector || existingITP.Inspector;
    existingITP.Date = Date || existingITP.Date;
    existingITP.additionalNotes = additionalNotes || existingITP.additionalNotes;
    existingITP.activity = activity || existingITP.activity;
    existingITP.criteria = criteria || existingITP.criteria;
    existingITP.status = status || existingITP.status;
    existingITP.image = imageUrls.length > 0 ? imageUrls : existingITP.image;
    existingITP.InspectionItems = InspectionItems.length > 0 ? InspectionItems : existingITP.InspectionItems;

    // Save updated ITP
    await existingITP.save();

    res.status(200).json({
      success: true,
      message: "ITP updated successfully",
      itp: existingITP,
    });
  } catch (error) {
    console.error("Error updating ITP:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while updating ITP",
      error: error.message,
    });
  }
});



//METHOD:Single
//TYPE:PUBLIC

const SingleITPc = async (req, res) => {
  try {
      // Fetch the single ITP and populate the Inspector field with firstName and lastName
      const SingleITPc = await ITPs.findById(req.params.id)
          .populate('Inspector', 'firstName lastName');  // Populate the Inspector with firstName and lastName

      // If no ITP is found, return a 404 error
      if (!SingleITPc) {
          return res.status(404).json({ msg: "ITP not found" });
      }

      // Add the inspector's name directly in the response (optional)
      SingleITPc.inspectorName = `${SingleITPc.Inspector.firstName} ${SingleITPc.Inspector.lastName}`;

      res.status(200).json(SingleITPc);
  } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error fetching ITP:", error);
      res.status(500).json({
          success: false,
          message: "An error occurred while fetching the ITP",
          error: error.message,
      });
  }
};




module.exports = { ITPcCreate, AllITPc, getITPs, deleteITPc, UpdateITPc, SingleITPc };
