const Projects = require('../Model/projectsModel');
const RFI = require('../Model/rfiModel');
const SafetyEquipmentAssignment = require('../Model/safetyModel');
const TasksManagement = require('../Model/TasksManagementModel');
const Documents = require('../Model/DocumentsModel');
const asyncHandler = require("express-async-handler");

const getClientDashboard = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Projects.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const [rfis, safetyReports, tasks, documents] = await Promise.all([
      RFI.find({ projectId, status: "Pending" }),
      SafetyEquipmentAssignment.find({ projectId, status: "Pending" }),
      TasksManagement.find({ projectId }),
      Documents.find({ projectId }),
    ]);

    const inProgressSites = project?.sites?.filter(site => site.status === "In Progress").length || 0;

    const dashboard = {
      project: {
        name: project?.title || "",
        activeSites: project?.sites?.length || 0,
        inProgressSites
      },
      complianceStatus: {
        safety: project?.safetyCompliance || "N/A",
        quality: project?.qualityCompliance || "N/A"
      },
      pendingApprovals: {
        rfis: rfis.length,
        safetyReports: safetyReports.length,
        taskApprovals: tasks.filter(task => task.status === "Pending").length
      },
      recentActivity: project?.activityLog?.slice(-3).reverse() || [],
      documents: documents.map(doc => doc.name),
      tasksAndApprovals: {
        assignedTasks: tasks.map(task => ({
          title: task.title,
          due: task.dueDate,
          status: task.status
        }))
      },
      reportsAndDocuments: {
        downloadableReports: documents.filter(d => d.type === "report").map(d => d.name),
        documentViewer: documents.filter(d => d.type === "view").map(d => d.name),
        versionControl: documents.filter(d => d.version).map(d => ({
          name: d.name,
          date: d.updatedAt.toISOString().split('T')[0]
        }))
      }
    };

    res.status(200).json({ success: true, data: dashboard });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching client dashboard",
      error: error.message
    });
  }
});

module.exports = {
  getClientDashboard
};


// get dashboard
