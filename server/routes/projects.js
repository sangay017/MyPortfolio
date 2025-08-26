const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectImage
} = require('../controllers/projects');

const Project = require('../models/Project');
const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getProjects)
  .post(protect, createProject);

router
  .route('/:id')
  .get(getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

// Route to get project image
router.route('/:id/image').get(getProjectImage);

module.exports = router;
