const Projects = require('../Model/projectsModel');
const User = require("../Model/userModel");
const asyncHandler = require("express-async-handler");

const ProjectsCreate = asyncHandler(async (req, res) => {

    const { name, assignedTo, startDate, endDate, status, priority,Progress, description } = req.body;

    if (!name || !assignedTo || !startDate || !endDate || !status || !priority || !Progress || !description) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const newProject = await Projects.create({
        name,
        assignedTo,
        startDate,
        endDate,
        status,
        priority,
        Progress,
        description
    });

    res.status(201).json( newProject );
});


//GET SINGLE AllProjects
//METHOD:GET
const Allprojects = async (req, res) => {
  try {
    const allProjects = await Projects.find(); 
    if (!allProjects || allProjects.length === 0) {
      return res.status(404).json({ message: "No projects found" });
    }
    const modifiedProjects = allProjects.map(project => {
      return {
        ...project.toObject(),
        assignedTo: project.assignedTo.toString(), 
      };
    });
    res.json(modifiedProjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


    //GET SINGLE DeleteProjects
    //METHOD:DELETE
const deleteprojects = async (req, res) => {
    let deleteprojectsID = req.params.id
    if (deleteprojects) {
      const deleteprojects = await Projects.findByIdAndDelete(deleteprojectsID, req.body);
      res.status(200).json("Delete Projects Successfully")
    } else {
      res.status(400).json({ message: "Not Delete project" })
    }
  }
  

  //GET SINGLE ProjectsUpdate
//METHOD:PUT
const projectsUpdate = async (req, res) => {
    try {
      const allowedFields = [
        'name',
        'assignedTo',
        'startDate',
        'endDate',
        'status',
        'priority',
        'Progress',
        'description'
      ];
      const updateData = {};
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });
  
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'At least one field must be provided for update' });
      }
      const updatedProject = await Projects.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
      if (!updatedProject) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.status(200).json(updatedProject);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  };
  



//METHOD:Single
//TYPE:PUBLIC
// const projectsSingle=async(req,res)=>{
//     try {
//         const projectsSingle= await Projects.findById(req.params.id);
//         res.status(200).json(projectsSingle)
//     } catch (error) {
//         res.status(404).json({msg:"Can t Find Projects"} )
//     }
// }


// METHOD: GET
// ROUTE: /api/projects/assigned/:id
// DESC: Get 10 projects assigned to a specific user
const projectsSingle = async (req, res) => {
  try {
    const assignedUserId = req.params.id;

    const projects = await Projects.find({ assignedTo: assignedUserId })
      .limit(10)
      .sort({ createdAt: -1 }); // latest first (optional)

    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "No projects found for this user" });
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// METHOD: GET
// ROUTE: /api/projects/by-user/:id
const getProjectsByUser = async (req, res) => {
  try {
    const assignedUserId = req.params.id;

    const projects = await Projects.find({ assignedTo: assignedUserId })
      .sort({ createdAt: -1 }) // latest first
      .limit(10);

    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "No projects found for this user" });
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports = { ProjectsCreate,Allprojects,deleteprojects,projectsUpdate,projectsSingle,getProjectsByUser };