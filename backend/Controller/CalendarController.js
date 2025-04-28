const asyncHandler = require('express-async-handler');
const Calendar = require('../Model/CalendarModel');
const cloudinary = require('../Config/cloudinary');
const mongoose = require('mongoose');

cloudinary.config({
  cloud_name: 'dkqcqrrbp',
  api_key: '418838712271323',
  api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

const CalendarCreate = asyncHandler(async (req, res) => {
  let {
    taskTitle,
    description,
    project,
    taskType,
    startDate,
    endDate,
    assignTeamMembers,
    color
  } = req.body;
  
  project = project?.trim();
  assignTeamMembers = assignTeamMembers?.trim();
  startDate = new Date(startDate?.trim());
  endDate = new Date(endDate?.trim());
  

  let reminders = [];
  try {
    if (req.body.reminders) {
      if (typeof req.body.reminders === "string") {
        reminders = JSON.parse(req.body.reminders);
      } else {
        reminders = req.body.reminders;
      }
    }
  } catch (err) {
    console.error("Failed to parse reminders:", err);
    return res.status(400).json({
      success: false,
      message: "Invalid format for reminders",
    });
  }

  try {
    let imageUrls = []; 
    if (req.files && req.files.image) {
      const files = Array.isArray(req.files.image)
        ? req.files.image
        : [req.files.image];

      for (const file of files) {
        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "calendar_uploads",
          resource_type: "image",
        });

        if (uploadResult.secure_url) {
          imageUrls.push(uploadResult.secure_url);
        }
      }
    }
    const newCalendar = new Calendar({
      taskTitle,
      description,
      project,
      taskType,
      startDate,
      endDate,
      assignTeamMembers,
      reminders,
      color,
      image: imageUrls,
    });

    await newCalendar.save();

    res.status(201).json({
      success: true,
      message: "Calendar entry created successfully",
      calendar: newCalendar,
    });
  } catch (error) {
    console.error("Error creating calendar entry:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the calendar entry",
      error: error.message,
    });
  }
});




  const AllCalendar = async (req, res) => {
      const AllCalendar = await Calendar.find()
      if (AllCalendar === null) {
        res.status(404)
        throw new Error("Categories Not Found")
      }
      res.json(AllCalendar)
    }
    

  //GET SINGLE AllSwms
  //METHOD:GET
  // const AllCalendar = async (req, res) => {
  //   try {
  //     const calendars = await Calendar.find()
  //       .populate('project', '_id name') // Project: ID + name
  //       .populate('assignTeamMembers', '_id name'); // User: ID + name
  
  //     if (!calendars || calendars.length === 0) {
  //       return res.status(404).json({ message: "No calendar entries found" });
  //     }
  
  //     res.status(200).json(calendars);
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // };
  
  
  
      //GET SINGLE DeleteSwms
  //METHOD:DELETE
  const deleteCalendar = async (req, res) => {
      let deleteCalendarID = req.params.id
      if (deleteCalendar) {
        const deleteCalendar = await Calendar.findByIdAndDelete(deleteCalendarID,req.body);
        res.status(200).json("Delete TimeSheet Successfully")
      } else {
        res.status(400).json({ message: "Not Delete TimeSheet" })
      }
    }
    
  
    //GET SINGLE SwmsUpdate
  //METHOD:PUT
  const UpdateCalendar = asyncHandler(async (req, res) => {
    try {
      const allowedFields = [
        'taskTitle',
        'description',
        'project',
        'taskType',
        'startDate',
        'endDate',
        'assignTeamMembers',
        'color',
        'reminders',
        'image',
      ];
  
      const updateData = {};
  
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          if ((field === 'project' || field === 'assignTeamMembers') && req.body[field].trim()) {
            updateData[field] = new mongoose.Types.ObjectId(req.body[field].trim());
          } else if (field === 'reminders') {
            try {
              updateData[field] = Array.isArray(req.body.reminders)
                ? req.body.reminders
                : JSON.parse(req.body.reminders);
            } catch (err) {
              return res.status(400).json({
                success: false,
                message: 'Invalid format for reminders. Must be a JSON array or stringified JSON.',
              });
            }
          } else if (field === 'startDate' || field === 'endDate') {
            updateData[field] = new Date(req.body[field]?.trim());
          } else {
            updateData[field] = req.body[field];
          }
        }
      });
  
      if (Object.keys(updateData).length === 0 && !(req.files && req.files.image)) {
        return res.status(400).json({
          success: false,
          message: 'At least one field or image must be provided for update',
        });
      }
  
      const calendarEntry = await Calendar.findById(req.params.id);
      if (!calendarEntry) {
        return res.status(404).json({
          success: false,
          message: 'Calendar entry not found',
        });
      }

      Object.assign(calendarEntry, updateData);
      
      if (req.files && req.files.image) {
        const files = Array.isArray(req.files.image)
          ? req.files.image
          : [req.files.image];
        const imageUrls = calendarEntry.image || [];
  
        for (const file of files) {
          const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'calendar_uploads',
            resource_type: 'image',
          });
  
          if (uploadResult.secure_url) {
            imageUrls.push(uploadResult.secure_url);
          }
        }
  
        calendarEntry.image = imageUrls;
      }
      await calendarEntry.save();
      res.status(200).json({
        success: true,
        message: 'Calendar entry updated successfully',
        calendar: calendarEntry,
      });
    } catch (error) {
      console.error('Error updating calendar:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while updating the calendar entry',
        error: error.message,
      });
    }
  });
  


  //METHOD:Single
  //TYPE:PUBLIC
  const SingleCalendar=async(req,res)=>{
      try {
          const SingleCalendar= await Calendar.findById(req.params.id);
          res.status(200).json(SingleCalendar)
      } catch (error) {
          res.status(404).json({msg:"Can t Find Swms"} )
      }
  }
  
module.exports = { CalendarCreate,AllCalendar,deleteCalendar,UpdateCalendar,SingleCalendar} ;
