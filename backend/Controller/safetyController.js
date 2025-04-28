const SafetyEquipmentAssignment = require("../Model/safetyModel");
const asyncHandler = require("express-async-handler");

const cloudinary = require('../Config/cloudinary');


cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
  });



  const createSafetyEquipmentAssignment = async (req, res) => {
    const {
      assignmentId,
      assignmentDate,
      assignedBy,
      assignedTo,
      submissionDeadline,
      expectedReturnDate,
      equipmentChecklist,
      additionalDetails,
      specialInstructions,
      equipmentConditionRemarks,
      confirmation,
      employeeSignature,
      supervisorSignature
    } = req.body;
  
    try {
      const newAssignment = new SafetyEquipmentAssignment({
        assignmentId,
        assignmentDate,
        assignedBy,
        assignedTo,
        submissionDeadline,
        expectedReturnDate,
        equipmentChecklist,
        additionalDetails,
        specialInstructions,
        equipmentConditionRemarks,
        confirmation,
        employeeSignature,
        supervisorSignature
      });
  
      const savedAssignment = await newAssignment.save();
  
      res.status(201).json({
        success: true,
        message: 'Safety Equipment Assignment created successfully',
        data: savedAssignment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating safety equipment assignment',
        error: error.message
      });
    }
  };


  const getAllSafetyEquipmentAssignments = async (req, res) => {
    try {
      const assignments = await SafetyEquipmentAssignment.find();
      res.status(200).json({
        success: true,
        data: assignments
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching safety equipment assignments',
        error: error.message
      });
    }
  };
  

  const getSecurityAuditReportById = async (req, res) => {
    const { id } = req.params; // Extract the ID from the request params
  
    try {
      // Fetch the security audit report by its ID
      const report = await SecurityAuditReport.findById(id);
  
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Audit report not found',
        });
      }
  
      // Return the report data
      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching audit report',
        error: error.message,
      });
    }
  };



  const updateSecurityAuditReport = async (req, res) => {
    const { id } = req.params; // Extract the ID from the request params
    const {
      auditDate,
      auditedBy,
      safetyManager,
      location,
      equipmentAssessment,
      safetyManagerSignature,
      generalNotes,
      criticalObservations,
      followUpActions,
      status,
    } = req.body;
  
    try {
      // Find the existing report by its ID
      const report = await SecurityAuditReport.findById(id);
  
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Audit report not found',
        });
      }

      // Parse equipmentAssessment if it's a string
      let parsedEquipmentAssessment = [];
      if (equipmentAssessment) {
        try {
          parsedEquipmentAssessment = JSON.parse(equipmentAssessment); // Convert stringified JSON back to an array of objects
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: 'Invalid equipment assessment format',
          });
        }
      }

      // Update the fields
      report.auditDate = auditDate || report.auditDate;
      report.auditedBy = auditedBy || report.auditedBy;
      report.safetyManager = safetyManager || report.safetyManager;
      report.location = location || report.location;
      report.equipmentAssessment = parsedEquipmentAssessment || report.equipmentAssessment; // Now it's an array of objects
      report.safetyManagerSignature = safetyManagerSignature || report.safetyManagerSignature;
      report.generalNotes = generalNotes || report.generalNotes;
      report.criticalObservations = criticalObservations || report.criticalObservations;
      report.followUpActions = followUpActions || report.followUpActions;
      report.status = status || report.status;
  
      // Handle file upload (if any)
      if (req.files && req.files.image) {
        const file = req.files.image;
        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'audit_reports',
          resource_type: 'image', // Auto detects file type
        });
        report.image = [uploadResult.secure_url]; // Update image URL
      }
  
      // Save the updated report
      const updatedReport = await report.save();
  
      res.status(200).json({
        success: true,
        message: 'Audit report updated successfully',
        data: updatedReport,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating audit report',
        error: error.message,
      });
    }
};




const deleteSecurityAuditReport = async (req, res) => {
  const { id } = req.params; // Extract the ID from the request params

  try {
    // Find the report by its ID
    const report = await SecurityAuditReport.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Audit report not found',
      });
    }

    // Delete the report
    await SecurityAuditReport.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: 'Audit report deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting audit report',
      error: error.message,
    });
  }
};


const getSafetyEquipmentAssignmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const assignment = await SafetyEquipmentAssignment.findById(id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching safety equipment assignment',
      error: error.message
    });
  }
};



const updateSafetyEquipmentAssignment = async (req, res) => {
  const { id } = req.params;
  const {
    assignmentDate,
    assignedBy,
    assignedTo,
    submissionDeadline,
    expectedReturnDate,
    equipmentChecklist,
    additionalDetails,
    specialInstructions,
    equipmentConditionRemarks,
    confirmation,
    employeeSignature,
    supervisorSignature
  } = req.body;

  try {
    const assignment = await SafetyEquipmentAssignment.findById(id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    assignment.assignmentDate = assignmentDate || assignment.assignmentDate;
    assignment.assignedBy = assignedBy || assignment.assignedBy;
    assignment.assignedTo = assignedTo || assignment.assignedTo;
    assignment.submissionDeadline = submissionDeadline || assignment.submissionDeadline;
    assignment.expectedReturnDate = expectedReturnDate || assignment.expectedReturnDate;
    assignment.equipmentChecklist = equipmentChecklist || assignment.equipmentChecklist;
    assignment.additionalDetails = additionalDetails || assignment.additionalDetails;
    assignment.specialInstructions = specialInstructions || assignment.specialInstructions;
    assignment.equipmentConditionRemarks = equipmentConditionRemarks || assignment.equipmentConditionRemarks;
    assignment.confirmation = confirmation || assignment.confirmation;
    assignment.employeeSignature = employeeSignature || assignment.employeeSignature;
    assignment.supervisorSignature = supervisorSignature || assignment.supervisorSignature;

    const updatedAssignment = await assignment.save();

    res.status(200).json({
      success: true,
      message: 'Safety Equipment Assignment updated successfully',
      data: updatedAssignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating safety equipment assignment',
      error: error.message
    });
  }
};



const deleteSafetyEquipmentAssignment = async (req, res) => {
  const { id } = req.params;

  try {
    const assignment = await SafetyEquipmentAssignment.findById(id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    await SafetyEquipmentAssignment.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: 'Safety Equipment Assignment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting safety equipment assignment',
      error: error.message
    });
  }
};



  
  
  
  



module.exports = {createSafetyEquipmentAssignment, getAllSafetyEquipmentAssignments, getSafetyEquipmentAssignmentById, updateSafetyEquipmentAssignment, deleteSecurityAuditReport, deleteSafetyEquipmentAssignment};





