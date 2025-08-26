const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [5000, 'Description cannot be more than 5000 characters'],
    validate: {
      validator: function (desc) {
        if (!desc) return false;
        // Count words
        return desc.trim().split(/\s+/).length >= 75;
      },
      message: 'Description must be at least 75 words.'
    }
  },
  technologies: {
    type: [String],
    required: true,
    validate: {
      validator: function(tech) {
        return tech.length > 0;
      },
      message: 'Please add at least one technology'
    }
  },
  // Store image binary in MongoDB (BSON Binary via Node Buffer)
  image: {
    data: {
      type: Buffer,
      required: false
    },
    contentType: {
      type: String,
      enum: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      required: false
    },
    filename: {
      type: String,
      required: false
    },
    size: {
      type: Number,
      required: false
    },
    url: {
      type: String,
      get: function () {
        if (this.data) {
          // Will be overridden by top-level imageUrl virtual
          return 'binary';
        }
        return null;
      }
    }
  },
  githubUrl: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  liveDemoUrl: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Add a virtual for the image URL (served via controller)
  imageUrl: {
    type: String,
    get: function() {
      if (this.image && this.image.data) {
        return `/api/v1/projects/${this._id}/image`;
      }
      return null;
    }
  }
});

// Prevent user from submitting more than one project with same title
ProjectSchema.index({ title: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Project', ProjectSchema);
