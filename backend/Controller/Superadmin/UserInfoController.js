const Superadmin = require('../../Model/Superadmin/UserInfoModel');
const cloudinary = require('../../Config/cloudinary');
const asyncHandler = require('express-async-handler');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || 'dkqcqrrbp',
  api_key: process.env.CLOUD_API_KEY || '418838712271323',
  api_secret: process.env.CLOUD_API_SECRET || 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

 const createSuperadmin = async (req, res) => {
  try { 
    if (req.body.password !== req.body.passwordConfirm) {
      return res.status(400).json({
        status: 'fail',
        message: 'Passwords do not match'
      });
    } 
    let profileImage = '';

    if (req.files && req.files.image) {
      const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: 'superadmin_profiles',
        resource_type: 'image',
      });
      profileImage = result.secure_url;
    }
 
    const newSuperadmin = await Superadmin.create({
      firstName: req.body.firstName,
      email: req.body.email,
      password: req.body.password,
      profileImage,
      role: 'Superadmin',
      isAdmin: true,
    });
    newSuperadmin.password = undefined;
    res.status(201).json({
      status: 'success',
      data: {
        superadmin: newSuperadmin
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};



    
    //GET SINGLE AllSuperadmin
    //METHOD:GET
    const AllSuperadmin = async (req, res) => {
      try {
        const allSuperadmins = await Superadmin.find();
    
        if (!allSuperadmins || allSuperadmins.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Superadmins not found",
          });
        } 
        res.json({
          success: true,
          data: allSuperadmins,
        });
      } catch (error) {
        console.error("Error fetching superadmins:", error);
        res.status(500).json({
          success: false,
          message: "Failed to fetch superadmins",
          error: error.message,
        });
      }
    };
    
    
        //GET SINGLE DeleteProjects
    //METHOD:DELETE
    const deleteSuperadmin = async (req, res) => {
        let deleteSuperadminID = req.params.id
        if (deleteSuperadmin) {
          const deleteDefect = await Superadmin.findByIdAndDelete(deleteSuperadminID, req.body);
          res.status(200).json("Delete Defect Successfully")
        } else {
          res.status(400).json({ message: "Not Delete project" })
        }
      }
      
    
      //GET SINGLE ProjectsUpdate
    //METHOD:PUT
    const UpdateSuperadmin = asyncHandler(async (req, res) => {
      try {
        const updateData = {
          firstName: req.body.firstName,
          email: req.body.email,
          password: req.body.password,
          profileImage: req.body.profileImage,
          role: 'Superadmin',
          isAdmin: true,
        };
    
        if (req.files && req.files.image) {
          const files = Array.isArray(req.files.image)
            ? req.files.image
            : [req.files.image];
    
          const imageUrls = [];
    
          for (const file of files) {
            const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
              folder: 'itp_uploads',
              resource_type: 'image',
            });
    
            if (uploadResult.secure_url) {
              imageUrls.push(uploadResult.secure_url);
            }
          }
    
          updateData.profileImage = imageUrls[0];
        }
    
        const updatedSuperadmin = await Superadmin.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true }
        );
    
        if (!updatedSuperadmin) {
          return res.status(404).json({
            success: false,
            message: 'Superadmin not found',
          });
        }
    
        res.status(200).json({
          success: true,
          message: 'Superadmin updated successfully',
          superadmin: updatedSuperadmin,
        });
      } catch (error) {
        console.error('Error updating Superadmin:', error);
        res.status(500).json({
          success: false,
          message: 'Server error',
          error: error.message,
        });
      }
    });
    
    
    
    //METHOD:Single
    //TYPE:PUBLIC
 
    const SingleSuperadmin = async (req, res) => {
        try {
            const SingleSuperadmin = await Superadmin.findById(req.params.id);
            res.status(200).json(SingleSuperadmin)
        } catch (error) {
          console.error("Error fetching Drawing Register:", error);
          res.status(500).json({
            success: false,
            message: "Failed to fetch Drawing Register",
            error: error.message,
        })
    }}

  
    

    // Superasdmin Setting Chang 
    const SuperasdminSettingChang = asyncHandler(async (req, res) => {
      try {
        const updateData = {
          firstName: req.body.firstName,
          // email: req.body.email,  // Email update disable kar diya
          password: req.body.password,
          role: 'Superadmin',
          isAdmin: true,
        };
    
        if (req.files && req.files.image) {
          const files = Array.isArray(req.files.image)
            ? req.files.image
            : [req.files.image];
    
          const imageUrls = [];
    
          for (const file of files) {
            const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
              folder: 'itp_uploads',
              resource_type: 'image',
            });
    
            if (uploadResult.secure_url) {
              imageUrls.push(uploadResult.secure_url);
            }
          }
    
          updateData.profileImage = imageUrls[0];
        }
    
        const updatedSuperadmin = await Superadmin.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true }
        );
    
        if (!updatedSuperadmin) {
          return res.status(404).json({
            success: false,
            message: 'Superadmin not found',
          });
        }
    
        res.status(200).json({
          success: true,
          message: 'Superadmin updated successfully',
          superadmin: updatedSuperadmin,
        });
      } catch (error) {
        console.error('Error updating Superadmin:', error);
        res.status(500).json({
          success: false,
          message: 'Server error',
          error: error.message,
        });
      }
    });
    

  module.exports = {createSuperadmin,AllSuperadmin,deleteSuperadmin,UpdateSuperadmin,SingleSuperadmin,SuperasdminSettingChang};
    