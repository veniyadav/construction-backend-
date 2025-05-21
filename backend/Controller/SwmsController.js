const asyncHandler = require("express-async-handler");
const Swms=require("../Model/SwmsModel")

const SwmsCreate = asyncHandler(async (req, res) => {
  const {
    swmsName,
    siteAddress,
    companyName,
    responsiblePersonName,
    dateCreated,
    companyInformation,
    workActivities,  // Added workActivities field
    hazardIdentification,  // Added hazardIdentification field
  } = req.body;

  // Ensure all fields are present
  if (
    !swmsName ||
    !siteAddress ||
    !companyName ||
    !responsiblePersonName ||
    !dateCreated ||
    !companyInformation ||
    !companyInformation.companyName ||
    !companyInformation.address ||
    !companyInformation.contactNumber ||
    !companyInformation.principalContractor.name ||
    !companyInformation.principalContractor.contactPerson ||
    !companyInformation.principalContractor.contactNumber ||
    !workActivities || // Validate workActivities
    !hazardIdentification // Validate hazardIdentification
  ) {
    return res.status(400).json({
      status: false,
      message: "All fields are required",
    });
  }

  // Create new SWMS
  const newSwms = await Swms.create({
    swmsName,
    siteAddress,
    companyName,
    responsiblePersonName,
    dateCreated,
    companyInformation,
     workActivities,  // Include workActivities
    hazardIdentification,  // Include hazardIdentification
  });

  res.status(201).json({
    status: true,
    message: "Created SWMS successfully",
    data: newSwms,
  });
});

// GET ALL SWMS
const AllSwms = async (req, res) => {
  try {
    const allSwms = await Swms.find();

    if (!allSwms || allSwms.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No SWMS found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Fetched SWMS successfully",
      data: allSwms,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// DELETE SWMS
const deleteSwms = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSwms = await Swms.findByIdAndDelete(id);

    if (!deletedSwms) {
      return res.status(404).json({
        status: false,
        message: "SWMS not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "SWMS deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error deleting SWMS",
      error: error.message,
    });
  }
};

// UPDATE SWMS
const UpdateSwms = async (req, res) => {
  const { id } = req.params;
  const {
    swmsName,
    siteAddress,
    companyName,
    responsiblePersonName,
    dateCreated,
    companyInformation,
    workActivities,  // Added workActivities field
    hazardIdentification,  // Added hazardIdentification field
  } = req.body;

  try {
    const allowedFields = [
      "swmsName",
      "siteAddress",
      "companyName",
      "responsiblePersonName",
      "dateCreated",
      "companyInformation",
      "workActivities",
      "hazardIdentification",

      
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: false,
        message: "At least one field must be provided for update",
      });
    }

    const updatedSwms = await Swms.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedSwms) {
      return res.status(404).json({
        status: false,
        message: "SWMS not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "SWMS updated successfully",
      data: updatedSwms,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// GET SINGLE SWMS
const SingleSwms = async (req, res) => {
  try {
    const singleSwms = await Swms.findById(req.params.id);

    if (!singleSwms) {
      return res.status(404).json({
        status: false,
        message: "SWMS not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Fetched SWMS successfully",
      data: singleSwms,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching SWMS",
      error: error.message,
    });
  }
};
  


  module.exports = {SwmsCreate,AllSwms,deleteSwms,UpdateSwms,SingleSwms};
