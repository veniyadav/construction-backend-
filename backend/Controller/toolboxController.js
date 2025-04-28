
const ToolboxTalk = require("../Model/toolboxModel");
const User  = require('../Model/userModel');
const asyncHandler = require("express-async-handler");

const cloudinary = require('../Config/cloudinary');


cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});



const createToolboxTalk = async (req, res) => {
  try {
    const { title, date, time, presenter, participants, description, status } = req.body;

    let imageUrl = "";

    // Handle Cloudinary image upload
    if (req.files && req.files.image) {
      const imageFile = req.files.image;

      const uploadResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
        folder: "toolbox-talks",
        resource_type: "image",
      });

      if (uploadResult && uploadResult.secure_url) {
        imageUrl = uploadResult.secure_url;
      }
    }

    // Parse participant names
    let fullNames = [];

    if (Array.isArray(participants)) {
      fullNames = participants;
    } else if (typeof participants === "string") {
      fullNames = participants.split(",").map(name => name.trim());
    }

    const nameFilters = fullNames.map(fullName => {
      const [firstName, ...lastNameParts] = fullName.trim().split(" ");
      return { firstName, lastName: lastNameParts.join(" ") };
    });

    const matchedUsers = await User.find({ $or: nameFilters });

    if (matchedUsers.length !== fullNames.length) {
      return res.status(400).json({
        success: false,
        message: "One or more participants not found",
      });
    }

    const participantIds = matchedUsers.map(user => user._id);

    // Find presenter by name
    const [presenterFirst, ...presenterLastParts] = presenter.trim().split(" ");
    const presenterUser = await User.findOne({
      firstName: presenterFirst,
      lastName: presenterLastParts.join(" "),
    });

    if (!presenterUser) {
      return res.status(400).json({
        success: false,
        message: "Presenter not found",
      });
    }

    const talk = new ToolboxTalk({
      title,
      date,
      time,
      presenter: presenterUser._id,
      participants: participantIds,
      description,
      status,
      image: imageUrl,
    });

    const savedTalk = await talk.save();

    res.status(201).json({
      success: true,
      message: "Toolbox Talk created successfully",
      data: savedTalk,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create Toolbox Talk",
      error: error.message,
    });
  }
};


const getAllToolboxTalks = async (req, res) => {
  try {
    const talks = await ToolboxTalk.find()
      .populate("participants", "firstName lastName")
      .populate("presenter", "firstName lastName");

    res.status(200).json({ success: true, data: talks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch Toolbox Talks", error: error.message });
  }
};



const getToolboxTalkById = async (req, res) => {
  try {
    const talk = await ToolboxTalk.findById(req.params.id)
      .populate("participants", "firstName lastName")
      .populate("presenter", "firstName lastName");

    if (!talk) {
      return res.status(404).json({ success: false, message: "Toolbox Talk not found" });
    }

    res.status(200).json({ success: true, data: talk });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch Toolbox Talk", error: error.message });
  }
};




const updateToolboxTalk = async (req, res) => {
  try {
    const { title, date, time, presenter, participants, description, status } = req.body;

    let imageUrl = "";

    // Cloudinary image upload
    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      const uploadResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
        folder: "toolbox-talks",
        resource_type: "image",
      });

      if (uploadResult?.secure_url) {
        imageUrl = uploadResult.secure_url;
      }
    }

    // Parse participants (supports JSON array OR comma-separated string)
    let fullNames = [];

    if (Array.isArray(participants)) {
      fullNames = participants;
    } else {
      try {
        fullNames = JSON.parse(participants);
      } catch {
        fullNames = participants.split(",").map(name => name.trim());
      }
    }

    // Create name filters for querying users
    const nameFilters = fullNames.map(fullName => {
      const [firstName, ...lastNameParts] = fullName.trim().split(" ");
      return { firstName, lastName: lastNameParts.join(" ") };
    });

    const matchedUsers = await User.find({ $or: nameFilters });
    const participantIds = matchedUsers.map(user => user._id);

    // Find presenter by full name
    const [presenterFirst, ...presenterLastParts] = presenter.trim().split(" ");
    const presenterUser = await User.findOne({
      firstName: presenterFirst,
      lastName: presenterLastParts.join(" "),
    });

    if (!presenterUser) {
      return res.status(400).json({ success: false, message: "Presenter not found" });
    }

    // Update ToolboxTalk
    const updatedTalk = await ToolboxTalk.findByIdAndUpdate(
      req.params.id,
      {
        title,
        date,
        time,
        presenter: presenterUser._id,
        participants: participantIds,
        description,
        status,
        ...(imageUrl && { image: imageUrl }),
      },
      { new: true }
    );

    if (!updatedTalk) {
      return res.status(404).json({ success: false, message: "Toolbox Talk not found" });
    }

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: updatedTalk,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update Toolbox Talk",
      error: error.message,
    });
  }
};



const deleteToolboxTalk = async (req, res) => {
  try {
    const deletedTalk = await ToolboxTalk.findByIdAndDelete(req.params.id);

    if (!deletedTalk) {
      return res.status(404).json({ success: false, message: "Toolbox Talk not found" });
    }

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete Toolbox Talk", error: error.message });
  }
};












  module.exports = { createToolboxTalk, getAllToolboxTalks, getToolboxTalkById, updateToolboxTalk, deleteToolboxTalk };