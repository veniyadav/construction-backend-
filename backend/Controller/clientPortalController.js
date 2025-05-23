const asyncHandler = require("express-async-handler");
const Projects = require("../Model/projectsModel");
const Tasks = require("../Model/TasksManagementModel");
const Documents = require("../Model/DocumentsModel");
const RFI = require("../Model/rfiModel");

const getClientPortalData = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Projects.findById(projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const activeSites = await Projects.countDocuments({ status: "Active" });
    const inProgressSites = await Projects.countDocuments({ status: "In Progress" });

    const complianceStatus = {
      safety: 98,   // Static or calculated value
      quality: 95   // Static or calculated value
    };

    const pendingApprovalsCount = await Tasks.countDocuments({
      projectId,
      type: "approval",
      status: "pending"
    });

    const rfisCount = await RFI.countDocuments({ projectId });

    const documents = await Documents.find({ projectId }).select("fileName fileUrl");

    const tasks = await Tasks.find({ projectId }).select("taskName dueDate status");

    res.status(200).json({
      success: true,
      message: "Client portal data fetched successfully",
      data: {
        projectName: project.projectName,
        activeSites,
        inProgressSites,
        complianceStatus,
        pendingApprovalsCount,
        rfisCount,
        documents,
        tasks
      }
    });
  } catch (error) {
    console.error("Client portal error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch client portal data",
      error: error.message
    });
  }
});


  module.exports = {getClientPortalData};
