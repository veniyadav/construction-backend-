const asyncHandler = require("express-async-handler");
const PlantMachinery = require("../Model/PlantMachineryModel");
const Category = require("../Model/categoryModel");


const PlantMachineryCreate = asyncHandler(async (req, res) => {
  const {
      toolID,
      name,
      manufacturer,
      category,
      purchaseDate,
      condition,
      notes,
      location
  } = req.body;

  // Validate required fields
  if (
      !toolID ||
      !name ||
      !manufacturer ||
      !category ||
      !purchaseDate ||
      !condition ||
      !notes ||
      !location
  ) {
      return res.status(400).json({ message: "All fields are required" });
  }

  // Validate category existence
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
  }

  try {
      const newPlantMachinery = new PlantMachinery({
          toolID,
          name,
          manufacturer,
          category, // This is a valid category ID
          purchaseDate,
          condition,
          notes,
          location,
      });

      await newPlantMachinery.save();

      res.status(201).json({
          success: true,
          message: "PlantMachinery created successfully",
          plantMachinery: newPlantMachinery,
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
    try {
      const allPlantMachinery = await PlantMachinery.find().populate('category', 'category'); // only return category name
  
      if (!allPlantMachinery || allPlantMachinery.length === 0) {
        return res.status(404).json({ message: "No Plant Machinery found" });
      }
  
      res.json(allPlantMachinery);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  
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
  const {
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
    // Build update object with allowed fields
    const updateData = {};
    if (toolID !== undefined) updateData.toolID = toolID;
    if (name !== undefined) updateData.name = name;
    if (manufacturer !== undefined) updateData.manufacturer = manufacturer;
    if (category !== undefined) updateData.category = category;
    if (purchaseDate !== undefined) updateData.purchaseDate = purchaseDate;
    if (condition !== undefined) updateData.condition = condition;
    if (notes !== undefined) updateData.notes = notes;
    if (location !== undefined) updateData.location = location;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'At least one field must be provided for update' });
    }

    // Validate category if it's being updated
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ message: 'Category not found' });
      }
    }

    const updatedMachinery = await PlantMachinery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedMachinery) {
      return res.status(404).json({ message: 'PlantMachinery not found' });
    }

    res.status(200).json({
      success: true,
      message: "PlantMachinery updated successfully",
      plantMachinery: updatedMachinery
    });
  } catch (error) {
    console.error("Error updating PlantMachinery:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

  
  //METHOD:Single
  //TYPE:PUBLIC
  const SinglePlantMachinery = async (req, res) => {
    try {
      const singlePlantMachinery = await PlantMachinery.findById(req.params.id).populate('category', 'category');
  
      if (!singlePlantMachinery) {
        return res.status(404).json({ message: "Plant Machinery not found" });
      }
  
      res.status(200).json(singlePlantMachinery);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  


module.exports = {PlantMachineryCreate,AllPlantMachinery,deletePlantMachinery,UpdatePlantMachinery,SinglePlantMachinery};
