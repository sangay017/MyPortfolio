import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ExternalLink, Github } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getProjects, createProject } from '../../services/projectService';
import AddProjectModal from '../projects/AddProjectModal';
import { toast } from 'react-hot-toast';

const ProjectCard = ({ project, index }) => {
  const getImageUrl = () => {
    if (project.imageUrl) {
      return project.imageUrl.startsWith('http') 
        ? project.imageUrl 
        : `${(import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL || import.meta.env.VITE_API_URL || window.location.origin).replace(/\/$/, '')}${project.imageUrl}`;
    }
    if (project.image && project.image.data) {
      return `data:${project.image.contentType};base64,${project.image.data.toString('base64')}`;
    }
    return `https://source.unsplash.com/random/400x300/?engineering,${index}`;
  };
  
  const [imageUrl, setImageUrl] = useState(getImageUrl());
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col bg-zinc-800 border-zinc-700 hover:border-emerald-400/50 transition-colors duration-300 group rounded-xl overflow-hidden">
        <div className="h-48 bg-zinc-700 overflow-hidden relative">
          {!imageError ? (
            <img 
              src={imageUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
              onLoad={() => setImageError(false)}
              onError={() => {
                // Try ID-based URL first, then fallback to Unsplash placeholder
                const baseUrl = (import.meta.env.VITE_BACKEND_URL || import.meta.env.BACKEND_URL || import.meta.env.VITE_API_URL || window.location.origin).replace(/\/$/, '');
                const idBasedUrl = project._id ? `${baseUrl}/api/v1/projects/${project._id}/image` : null;
                if (idBasedUrl && imageUrl !== idBasedUrl && !imageUrl.includes('/image')) {
                  setImageUrl(idBasedUrl);
                  return;
                }
                const fallback = `https://source.unsplash.com/random/400x300/?engineering,${index}`;
                if (imageUrl !== fallback) {
                  setImageUrl(fallback);
                  setImageError(false);
                } else {
                  setImageError(true);
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-800">
              <span className="text-zinc-500 text-sm">No preview available</span>
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle className="text-neutral-200 group-hover:text-emerald-400 transition-colors duration-300">
            {project.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p
            className="text-neutral-400 text-sm mb-4 line-clamp-3"
            title={project.description}
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: '3.6em',
              maxHeight: '4.5em',
            }}
          >
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {project.technologies?.map((tech, i) => (
              <span 
                key={i}
                className="px-2 py-1 bg-zinc-700/50 text-neutral-300 text-xs rounded-md border border-zinc-600"
              >
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 hover:text-white"
            onClick={() => project.githubUrl && window.open(project.githubUrl, '_blank')}
          >
            <Github className="h-4 w-4 mr-2" />
            Code
          </Button>
          {project.liveDemoUrl && (
            <Button 
              variant="default" 
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => window.open(project.liveDemoUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Live Demo
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const Projects = ({ projects: initialProjects = [] }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState(initialProjects);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Debug logging
  console.log('Projects component - initialProjects:', initialProjects);
  console.log('Projects component - current projects state:', projects);
  console.log('Projects component - user:', user);

  // Use initialProjects from App.jsx
  useEffect(() => {
    console.log('Projects component: initialProjects received:', initialProjects);
    if (initialProjects && initialProjects.length > 0) {
      console.log('Projects component: Setting projects from props');
      setProjects(initialProjects);
      setLoading(false);
    } else {
      console.log('Projects component: No projects received from props');
      setLoading(false);
    }
  }, [initialProjects]);

  const handleAddProject = async (projectData) => {
    try {
      const loadingToast = toast.loading('Adding project...');
      const response = await createProject(projectData);
      // Refresh projects after adding a new one
      const updatedProjects = await getProjects();
      setProjects(Array.isArray(updatedProjects) ? updatedProjects : []);
      setIsModalOpen(false);
      toast.success('Project added successfully!', { id: loadingToast });
      return response;
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error(error.message || 'Failed to add project');
    }
  };

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-zinc-900 min-h-[60vh] flex items-center">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-neutral-400">Loading projects...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">My Projects</h2>
          <div className="w-20 h-1 bg-emerald-500 mx-auto"></div>
          
          {/* New Subtext visible to both logged-in and non-logged-in users */}
          <p className="mt-4 text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed">
  A collection of projects that reflect my learning journey, creativity, and problem-solving approach. 
  From experimental builds to polished applications, each project highlights different skills, ideas, 
  and technologies that I’ve explored along the way.
</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="max-w-2xl mx-auto bg-gradient-to-br from-zinc-800/60 to-zinc-900/80 p-10 rounded-2xl border border-zinc-700/50 shadow-2xl backdrop-blur-sm">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/30 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-3">No Projects Available</h3>
              <p className="text-zinc-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                There are no projects to showcase at the moment. Check back later for exciting developments and innovative solutions!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project._id || index} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
      
      <AddProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddProject}
      />
    </section>
  );
};

export default Projects;
