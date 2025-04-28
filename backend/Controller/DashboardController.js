const asyncHandler = require('express-async-handler');
const Incidents = require('../Model/IncidentModel');
const Tasks = require('../Model/TasksManagementModel');  // Added Tasks model
const Projects = require('../Model/projectsModel');
const Documents = require('../Model/DocumentsModel');

const getDashboardData = asyncHandler(async (req, res) => {
  try {
    // Active Incidents (incidents that are 'In Progress' or 'Needs Immediate Action')
    const activeIncidentsCount = await Incidents.countDocuments({ 
      status: { $in: ['In Progress', 'Needs Immediate Action'] }
    });

    // High priority incidents
    const highPriorityIncidentsCount = await Incidents.countDocuments({ priority: 'high' });

    // Safety Incidents needing immediate action
    const safetyIncidentsCount = await Incidents.countDocuments({ status: 'Needs Immediate Action' });

    // Open Tasks count
    const openTasksCount = await Tasks.countDocuments({ status: 'open' });

    // High priority tasks
    const highPriorityTasksCount = await Tasks.countDocuments({ priority: 'high' });

    // Fetch specific project info (example)
    const projectInfo = await Projects.findOne({ _id: req.params.projectId });

    // Fetch recent incidents, project deadlines, and document approvals
    const recentAlerts = {
      safetyIncidents: await Incidents.find({}).sort({ createdAt: -1 }).limit(3),  // Latest incidents
      projectDeadline: await Projects.find({}).where('endDate').lt(new Date()).limit(3),  // Projects with passed deadlines
      documentApprovals: await Documents.find({ status: 'Approved' }).sort({ updatedAt: -1 }).limit(3)  // Recently approved documents
    };

    // Safety performance & defect status (example of safety performance and defect status)
    const safetyPerformance = {
      defectStatus: '1 defect needs immediate action'
    };

    res.status(200).json({
      success: true,
      data: {
        activeIncidentsCount,
        highPriorityIncidentsCount,
        safetyIncidentsCount,
        openTasksCount,  // Added open tasks count
        highPriorityTasksCount,  // Added high priority tasks count
        projectInfo,
        recentAlerts,
        safetyPerformance,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
});

module.exports = { getDashboardData };
