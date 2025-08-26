import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import AddProjectModal from './projects/AddProjectModal';
import { createProject } from '../services/projectService';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleAddProject = async (projectData) => {
    try {
      await createProject(projectData);
      toast.success('Project added successfully!');
      // Refresh the page to show the new project
      window.location.reload();
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error(error.message || 'Failed to add project');
    } finally {
      setIsAddProjectOpen(false);
    }
  };

  useEffect(() => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          closeMenu();
        }
      });
    });
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
  // After logout, AuthContext redirects to '/'
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-gray-900 shadow-md fixed w-full z-[9999] py-3">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <a href="#home" className="text-blue-400 hover:text-blue-300 font-semibold text-xl md:absolute md:left-4">
            My Portfolio
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex space-x-8 mx-auto">
              <a href="#home" className="text-gray-100 hover:text-blue-300 transition-colors py-1.5">
                Home
              </a>
              <a href="#about" className="text-gray-100 hover:text-blue-300 transition-colors py-1.5">
                About
              </a>
              <a href="#projects" className="text-gray-100 hover:text-blue-300 transition-colors py-1.5">
                Projects
              </a>
              <a href="#achievements" className="text-gray-100 hover:text-blue-300 transition-colors py-1.5">
                Achievements
              </a>
              <a href="#contact" className="text-gray-100 hover:text-blue-300 transition-colors py-1.5">
                Contact
              </a>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="md:absolute md:right-4">
            {user && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    closeMenu();
                    setIsAddProjectOpen(true);
                  }}
                  className="text-white hover:text-blue-300 transition-colors px-3 py-1 border border-blue-400 rounded hover:bg-blue-400/10"
                >
                  Add Project
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2">
            <div className="flex flex-col items-center space-y-2">
              <a 
                href="#home" 
                className="block px-3 py-2 text-white hover:bg-gray-800 rounded"
                onClick={closeMenu}
              >
                Home
              </a>
              <a 
                href="#about" 
                className="block px-3 py-2 text-white hover:bg-gray-800 rounded"
                onClick={closeMenu}
              >
                About
              </a>
              <a 
                href="#projects" 
                className="block px-3 py-2 text-white hover:bg-gray-800 rounded"
                onClick={closeMenu}
              >
                Projects
              </a>
              <a 
                href="#achievements" 
                className="block px-3 py-2 text-white hover:bg-gray-800 rounded"
                onClick={closeMenu}
              >
                Achievements
              </a>
              <a 
                href="#contact" 
                className="block px-3 py-2 text-white hover:bg-gray-800 rounded"
                onClick={closeMenu}
              >
                Contact
              </a>
              {user && (
                <div className="flex flex-col w-full mt-4 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => {
                      closeMenu();
                      setIsAddProjectOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 text-white hover:bg-gray-800 rounded"
                  >
                    Add Project
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center px-3 py-2 text-white hover:bg-gray-800 rounded"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        onSubmit={handleAddProject}
      />
    </nav>
  );
};

export default Navbar;
