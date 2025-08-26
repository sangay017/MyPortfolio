import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/button';

const AddProjectModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    githubLink: '',
    liveDemo: '',
    image: null,
    imagePreview: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image' && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: files[0],
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.description || !formData.technologies) {
      toast.error('Please fill in all required fields');
      return;
    }
    // Validate description is at least 75 words
    const wordCount = formData.description.trim().split(/\s+/).length;
    if (wordCount < 75) {
      toast.error('Description must be at least 75 words.');
      return;
    }
    
    // Validate image if present
    if (formData.image) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validImageTypes.includes(formData.image.type)) {
        toast.error('Please upload a valid image (JPEG, PNG, or WebP)');
        return;
      }
      
      // Check file size (2MB max)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (formData.image.size > maxSize) {
        toast.error('Image size should be less than 2MB');
        return;
      }
    }
    
    try {
      // Create a new form data object for submission
      const submissionData = { 
        title: formData.title,
        description: formData.description,
        technologies: formData.technologies,
        githubLink: formData.githubLink,
        liveDemo: formData.liveDemo,
        image: formData.image // This will be handled by the service
      };
      
      await onSubmit(submissionData);
      
      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        technologies: '',
        githubLink: '',
        liveDemo: '',
        image: null,
        imagePreview: null
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Failed to add project');
    }
  };

  // Add/remove class to body when modal is open/closed
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    // Cleanup function
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <>
        {/* Blurred background */}
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30" onClick={onClose}></div>
        <div className="bg-gray-800 rounded-lg w-full max-w-2xl relative z-50">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Add New Project</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Project Title *
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description *
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Technologies (comma separated) *
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB, etc."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Live Demo URL
                </label>
                <input
                  type="url"
                  name="liveDemo"
                  value={formData.liveDemo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Project Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md">
                {formData.imagePreview ? (
                  <div className="relative w-full">
                    <img 
                      src={formData.imagePreview} 
                      alt="Preview" 
                      className="mx-auto max-h-48 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          image: null,
                          imagePreview: null
                        }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-400">
                      <label className="relative cursor-pointer bg-zinc-800 rounded-md font-medium text-emerald-400 hover:text-emerald-300">
                        <span>Upload a file</span>
                        <input 
                          id="file-upload" 
                          name="image" 
                          type="file" 
                          className="sr-only" 
                          onChange={handleChange}
                          accept="image/*"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, WEBP up to 2MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button 
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Add Project
              </Button>
            </div>
          </form>
        </div>
        </div>
      </>
    </div>
  );
};

export default AddProjectModal;
