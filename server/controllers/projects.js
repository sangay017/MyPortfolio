const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
// No filesystem usage; we store image binary in MongoDB

// @desc    Get all projects
// @route   GET /api/v1/projects
// @access  Public
const getProjects = asyncHandler(async (req, res, next) => {
  try {
    // Get all projects and populate user info
    const projects = await Project.find().populate({
      path: 'user',
      select: 'name email'
    });

  // Transform the data to include image URLs and remove binary data
    const results = projects.map(project => {
      const projectObj = project.toObject ? project.toObject() : project;
      
      // Add image URL if image exists
  if (projectObj.image && projectObj.image.data) {
        projectObj.imageUrl = `/api/v1/projects/${projectObj._id}/image`;
      }
      
      // Remove the binary data from the response to reduce payload size
      if (projectObj.image) {
        delete projectObj.image.data;
      }
      
      return projectObj;
    });
    
    console.log(`getProjects: Found ${results.length} projects`);
    res.status(200).json(results);
  } catch (error) {
    console.error('getProjects error:', error);
    next(error);
  }
});

// @desc    Get single project
// @route   GET /api/v1/projects/:id
// @access  Public
const getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id).populate({
    path: 'user',
    select: 'name email'
  });

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  // Transform the project data to include image URL if it exists and remove binary
  const projectObj = project.toObject();
  if (projectObj.image && projectObj.image.data) {
    projectObj.imageUrl = `/api/v1/projects/${projectObj._id}/image`;
    delete projectObj.image.data;
  }

  res.status(200).json({
    success: true,
    data: projectObj
  });
});

// @desc    Create new project
// @route   POST /api/v1/projects
// @access  Private
const createProject = asyncHandler(async (req, res, next) => {
  try {
    console.log('=== NEW PROJECT CREATION REQUEST ===');
  console.log('Request files:', req.files);
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    console.log('Authenticated user:', req.user);
    
    // Log form data for debugging
    const formData = {};
    for (let [key, value] of Object.entries(req.body)) {
      formData[key] = value;
    }
    console.log('Parsed form data:', formData);
    
  // Create project data object
    const projectData = {
      ...req.body,
      user: req.user.id,
    };
    
    console.log('Initial project data:', projectData);

    // Handle file upload
  if (req.files && req.files.image) {
      const file = req.files.image;
      
      // Make sure the image is a photo
      if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload a valid image file`, 400));
      }

      // Check file size (2MB max)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        return next(
          new ErrorResponse('Please upload an image less than 2MB', 400)
        );
      }

      // Store image directly from in-memory buffer
      if (!file.data || !file.data.length) {
        return next(new ErrorResponse('Uploaded image is empty', 400));
      }

      projectData.image = {
        data: file.data,
        contentType: file.mimetype,
        filename: file.name || 'project-image',
        size: file.size
      };
    }

    // Map potential alias fields from client to model
    if (projectData.githubLink && !projectData.githubUrl) {
      projectData.githubUrl = projectData.githubLink;
    }
    if (projectData.liveDemo && !projectData.liveDemoUrl) {
      projectData.liveDemoUrl = projectData.liveDemo;
    }

    // Handle technologies - support both array and string formats
    if (req.body.technologies) {
      if (Array.isArray(req.body.technologies)) {
        // If it's already an array, use it directly after filtering out empty strings
        projectData.technologies = req.body.technologies.filter(tech => tech && tech.trim().length > 0);
      } else if (typeof req.body.technologies === 'string') {
        // If it's a string, split by comma and clean up
        projectData.technologies = req.body.technologies
          .split(',')
          .map(tech => tech.trim())
          .filter(tech => tech.length > 0);
      } else {
        projectData.technologies = [];
      }
    }

    console.log('Creating project with data:', {
      ...projectData,
      image: projectData.image ? `[Image: ${projectData.image.filename}, ${projectData.image.size} bytes]` : 'No image'
    });
    
    // Validate required fields
    if (!projectData.title || !projectData.description || !projectData.technologies || projectData.technologies.length === 0) {
      console.error('Missing required fields:', projectData);
      return next(new ErrorResponse('Missing required fields', 400));
    }

    // Enforce minimum 75-word description at API layer for clearer error
    const descWords = projectData.description.trim().split(/\s+/).filter(Boolean);
    if (descWords.length < 75) {
      return next(new ErrorResponse('Description must be at least 75 words.', 400));
    }

    try {
  const project = await Project.create(projectData);
      console.log('Project created successfully:', project._id);
      
      // Ensure we don't send the image binary data in the response
      const projectResponse = project.toObject();
  if (projectResponse.image) {
        projectResponse.imageUrl = `/api/v1/projects/${project._id}/image`;
        delete projectResponse.image.data; // Remove binary data from response
      }
      
      res.status(201).json({
        success: true,
        data: projectResponse
      });
    } catch (dbError) {
      console.error('Database error creating project:', {
        error: dbError.message,
        name: dbError.name,
        code: dbError.code,
        keyPattern: dbError.keyPattern,
        keyValue: dbError.keyValue
      });
      
      // Handle duplicate key errors
      if (dbError.code === 11000) {
        return next(new ErrorResponse('A project with this title already exists', 400));
      }
      
      // Handle validation errors
      if (dbError.name === 'ValidationError') {
        const messages = Object.values(dbError.errors).map(val => val.message);
        return next(new ErrorResponse(messages, 400));
      }
      
      throw dbError; // Let the error handler middleware handle it
    }
  } catch (err) {
    console.error('Unexpected error in createProject:', {
      error: err.message,
      stack: err.stack,
      ...(err.errors && { validationErrors: Object.values(err.errors).map(e => e.message) })
    });
    next(new ErrorResponse(`Error creating project: ${err.message}`, 500));
  }
});

// @desc    Update project
// @route   PUT /api/v1/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is project owner or admin
  if (project.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this project`,
        401
      )
    );
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: project });
});

// @desc    Get project image
// @route   GET /api/v1/projects/:id/image
// @access  Public
const getProjectImage = asyncHandler(async (req, res, next) => {
  try {
    // Fetch with Mongoose document (no lean) so image.data is a Buffer
    const project = await Project.findById(req.params.id).select('image.data image.contentType');

    if (!project || !project.image || !project.image.data) {
      return next(new ErrorResponse('No image found', 404));
    }

    let imgBuf;
    const data = project.image.data;
    // Handle different possible shapes
    if (Buffer.isBuffer(data)) {
      imgBuf = data;
    } else if (data && Array.isArray(data.data)) {
      // Sometimes returned as { type: 'Buffer', data: [...] }
      imgBuf = Buffer.from(data.data);
    } else if (typeof data === 'string') {
      // If somehow stored as base64 string
      imgBuf = Buffer.from(data, 'base64');
    } else {
      console.error('Unexpected image data format');
      return next(new ErrorResponse('Invalid image data', 500));
    }

    res.setHeader('Content-Type', project.image.contentType || 'image/jpeg');
    res.setHeader('Content-Length', imgBuf.length);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Last-Modified', new Date().toUTCString());

    return res.end(imgBuf);
  } catch (error) {
    console.error('Error serving image:', error);
    return next(new ErrorResponse('Error serving image', 500));
  }
});

// @desc    Delete project
// @route   DELETE /api/v1/projects/:id
// @access  Private
const deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`No project with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is project owner or admin
  if (project.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this project`,
        401
      )
    );
  }

  await project.remove();

  res.status(200).json({ success: true, data: {} });
});

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectImage
};
