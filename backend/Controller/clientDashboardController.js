const Projects = require('../Model/projectsModel');
const Incident = require('../Model/IncidentModel');
const asyncHandler = require("express-async-handler");



const getClientDashboard = async (req, res) => {
    const { projectId } = req.params;
  
    try {
      // Fetch Project Info from the Projects model
      const project = await Projects.findById(projectId);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
  
      // Fetch Pending Approvals (change model according to requirements)
      const pendingApprovals = await Incident.find({ projectId, status: 'pending' });
  
      // Fetch Recent Activities (latest 5)
      const recentActivities = await Incident.find({ projectId })
        .sort({ createdAt: -1 })
        .limit(5);
  
      // Fetch Assigned Tasks (assuming the tasks are in Project model)
      const tasks = project.tasks || []; // Assuming tasks are stored inside the project model
  
      // Fetch Documents (assuming Document model exists in your system)
      const documents = project.documents || []; // Assuming documents are part of the project
  
      // Fetch Reports (Assuming reports are stored in the Incident model)
      const reports = await Incident.find({ projectId });
  
      // Prepare Dashboard Data
      const dashboardData = {
        projectInfo: {
          projectName: project.name,
          activeSites: project.activeSites,
          inProgressSites: project.inProgressSites,
          compliance: {
            safety: project.safetyCompliance,
            quality: project.qualityCompliance
          }
        },
        pendingApprovals,
        recentActivities,
        tasks,
        documents,
        reports
      };
  
      res.status(200).json({
        success: true,
        message: 'Client dashboard data fetched successfully',
        data: dashboardData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  };
  


  module.exports = {getClientDashboard};