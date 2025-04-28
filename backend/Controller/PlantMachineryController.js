const asyncHandler = require("express-async-handler");
const PlantMachinery = require("../Model/PlantMachineryModel");


const PlantMachineryCreate = asyncHandler(async (req, res) => {
    let {
        toolID,
        name,
        manufacturer,
        category,
        purchaseDate,
        condition,
        notes,
        location
    } = req.body;

    try {
        // Create and save PlantMachinery record
        const newPlantMachinery = new PlantMachinery({
            toolID,
            name,
            manufacturer,
            category,
            purchaseDate,
            condition,
            notes,
            location,
        });

        await newPlantMachinery.save();

        res.status(201).json({
            success: true,
            message: "PlantMachinery created successfully",
            PlantMachinery: newPlantMachinery,
        });
    } catch (error) {
        console.error("Error creating PlantMachinery:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the PlantMachinery",
            error: error.message,
        });
    }
});


  
  //GET SINGLE AllProjects
  //METHOD:GET
  const AllPlantMachinery = async (req, res) => {
      const AllPlantMachinery = await PlantMachinery.find()
      if (AllPlantMachinery === null) {
        res.status(404)
        throw new Error("Categories Not Found")
      }
      res.json(AllPlantMachinery)
    }
  
   //GET SINGLE DeleteProjects
    //METHOD:DELETE
   const deletePlantMachinery = async (req, res) => {
      let deletePlantMachineryID = req.params.id
      if (deletePlantMachinery) {
        const deletePlantMachinery = await PlantMachinery.findByIdAndDelete(deletePlantMachineryID, req.body);
        res.status(200).json("Delete PlantMachinery Successfully")
      } else {
        res.status(400).json({ message: "Not Delete project" })
      }
    }
    
  
    //GET SINGLE ProjectsUpdate
  //METHOD:PUT
  const UpdatePlantMachinery = async (req, res) => {
    try {
      const allowedFields = [
        'toolID',
        'name',
        'manufacturer',
        'category',
        'purchaseDate',
        'condition',
        'notes',
        'location'
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
  
      const updatedMachinery = await PlantMachinery.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
  
      if (!updatedMachinery) {
        return res.status(404).json({ message: 'PlantMachinery not found' });
      }
  
      res.status(200).json(updatedMachinery);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  
  
  //METHOD:Single
  //TYPE:PUBLIC
  const SinglePlantMachinery=async(req,res)=>{
      try {
          const SinglePlantMachinery= await PlantMachinery.findById(req.params.id);
          res.status(200).json(SinglePlantMachinery)
      } catch (error) {
          res.status(404).json({msg:"Can t Find Diaries"} )
      }
  }
module.exports = {PlantMachineryCreate,AllPlantMachinery,deletePlantMachinery,UpdatePlantMachinery,SinglePlantMachinery};