const asyncHandler = require("express-async-handler");
const Checklists = require("../Model/ChecklistsModel");

const ChecklistsCreate = asyncHandler(async (req, res) => {
  const {
    checklistName,
    project,
    AssignTo,
    date,


    
    checklistItems,
    status,
    additionalNotes
  } = req.body;

  if (
    !checklistName ||
    !project ||
    !AssignTo ||
    !date ||
    !checklistItems ||
    !status ||
    !additionalNotes
  ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newSwms = await Checklists.create({
    checklistName,
    project,
    AssignTo,
    date,
    checklistItems,
    status,
    additionalNotes,
  });

  res.status(201).json(newSwms);
});
  
  


  
  //GET SINGLE AllProjects
  //METHOD:GET
  const AllChecklists = async (req, res) => {
      const AllChecklists = await Checklists.find()
      if (AllChecklists === null) {
        res.status(404)
        throw new Error("Categories Not Found")
      }
      res.json(AllChecklists)
    }
    
  
  
      //GET SINGLE DeleteProjects
  //METHOD:DELETE
  const deleteChecklists = async (req, res) => {
      let deleteChecklistsID = req.params.id
      if (deleteChecklists) {
        const deleteChecklists = await Checklists.findByIdAndDelete(deleteChecklistsID, req.body);
        res.status(200).json("Delete Checklists Successfully")
      } else {
        res.status(400).json({ message: "Not Delete project" })
      }
    }
    
  
    //GET SINGLE ProjectsUpdate
  //METHOD:PUT
  const UpdateChecklists = async (req, res) => {
    try {
      const allowedFields = [
        'date',
        'projectName',
        'supervisorName',
        'weather',
        'workPerformed',
        'issuesDelays'
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
      const updatedDiary = await Checklists.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
      if (!updatedDiary) {
        return res.status(404).json({ message: 'Diary not found' });
      }
      res.status(200).json(updatedDiary);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  
  //METHOD:Single
  //TYPE:PUBLIC
  const SingleChecklists=async(req,res)=>{
      try {
          const SingleChecklists= await Checklists.findById(req.params.id);
          res.status(200).json(SingleChecklists)
      } catch (error) {
          res.status(404).json({msg:"Can t Find Diaries"} )
      }
  }
module.exports = {ChecklistsCreate,AllChecklists,deleteChecklists,UpdateChecklists,SingleChecklists};
