const asyncHandler = require("express-async-handler");
const Diaries = require("../Model/DiariesModel");


const DiariesCreate=asyncHandler(async(req, res) => {
  
    const { date, projectName, supervisorName, weather, workPerformed, issuesDelays } = req.body;

    if (!date || !projectName || !supervisorName || !weather || !workPerformed || !issuesDelays) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const newDiaries = await Diaries.create({
        date,
        projectName,
        supervisorName,
        weather,
        workPerformed,
        issuesDelays,
    });

    res.status(201).json( newDiaries );

    res.send('Diaries Router');
  })

  

  
  //GET SINGLE AllProjects
  //METHOD:GET
  const AllDiaries = async (req, res) => {
      const AllDiaries = await Diaries.find()
      if (AllDiaries === null) {
        res.status(404)
        throw new Error("Categories Not Found")
      }
      res.json(AllDiaries)
    }
    
  
  
      //GET SINGLE DeleteProjects
  //METHOD:DELETE
  const deleteDiaries = async (req, res) => {
      let deleteDiariesID = req.params.id
      if (deleteDiaries) {
        const deleteDiaries = await Diaries.findByIdAndDelete(deleteDiariesID, req.body);
        res.status(200).json("Delete Diaries Successfully")
      } else {
        res.status(400).json({ message: "Not Delete project" })
      }
    }
    
  
    //GET SINGLE ProjectsUpdate
  //METHOD:PUT
  const UpdateDiaries = async (req, res) => {
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
      const updatedDiary = await Diaries.findByIdAndUpdate(
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
  const SingleDiaries=async(req,res)=>{
      try {
          const SingleDiaries= await Diaries.findById(req.params.id);
          res.status(200).json(SingleDiaries)
      } catch (error) {
          res.status(404).json({msg:"Can t Find Diaries"} )
      }
  }
  


  module.exports = {DiariesCreate,AllDiaries,deleteDiaries,UpdateDiaries,SingleDiaries};