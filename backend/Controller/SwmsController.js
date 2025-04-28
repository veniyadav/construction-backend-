const asyncHandler = require("express-async-handler");
const Swms=require("../Model/SwmsModel")

const SwmsCreate = asyncHandler(async (req, res) => {
  const {
    title,
    project,
    workArea,
    description,
    hazardsandControls,
    ppeRequirements,
    requiredPermits
  } = req.body;

  if (
    !title ||
    !project ||
    !workArea ||
    !description ||
    !Array.isArray(hazardsandControls) || hazardsandControls.length === 0 ||
    !ppeRequirements ||
    !requiredPermits
  ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newSwms = await Swms.create({
    title,
    project,
    workArea,
    description,
    hazardsandControls,
    ppeRequirements,
    requiredPermits
  });

  res.status(201).json(newSwms);
});


  
  
  //GET SINGLE AllSwms
  //METHOD:GET
  const AllSwms = async (req, res) => {
    try {
      const allSwms = await Swms.find().populate('project', 'name');
      if (!allSwms) {
        return res.status(404).json({ message: 'Categories Not Found' });
      }
      res.json(allSwms);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
    
  
  
      //GET SINGLE DeleteSwms
  //METHOD:DELETE
  const deleteSwms = async (req, res) => {
      let deleteSwmsID = req.params.id
      if (deleteSwms) {
        const deleteSwms = await Swms.findByIdAndDelete(deleteSwmsID, req.body);
        res.status(200).json("Delete TimeSheet Successfully")
      } else {
        res.status(400).json({ message: "Not Delete TimeSheet" })
      }
    }
    
  
    //GET SINGLE SwmsUpdate
  //METHOD:PUT
  const UpdateSwms = async (req, res) => {
    try {
      const allowedFields = [
        'title',
        'project',
        'workArea',
        'descripation',
        'hazarsDescription',
        'riskLevel',
        'controlMeasures',
        'ppeRequirements',
        'requiredPermits',
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
  
      const updatedSwms = await Swms.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true } // return the updated document
      );
  
      if (!updatedSwms) {
        return res.status(404).json({ message: 'SWMS not found' });
      }
  
      res.status(200).json(updatedSwms);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  
  
  //METHOD:Single
  //TYPE:PUBLIC
  const SingleSwms=async(req,res)=>{
      try {
          const SingleSwms= await Swms.findById(req.params.id);
          res.status(200).json(SingleSwms)
      } catch (error) {
          res.status(404).json({msg:"Can t Find Swms"} )
      }
  }
  


  module.exports = {SwmsCreate,AllSwms,deleteSwms,UpdateSwms,SingleSwms};