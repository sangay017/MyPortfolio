import { useEffect, useState } from 'react';
import { getApiBase } from './lib/apiBase';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/sections/hero';
import About from './components/sections/about';
import Projects from './components/sections/projects';
import Achievements from './components/sections/achievements';
import Contact from './components/sections/contact';
import Footer from './components/layout/footer';
import { ToastViewport } from './components/ui/toaster';
import Chatbot from './components/Chatbot/Chatbot';
import LoginForm from './components/auth/LoginForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './components/dashboard/Dashboard';

// Wrapper component to handle scroll behavior
const ScrollHandler = ({ children }) => {
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const targetId = e.target.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return children;
};

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isHomePage = location.pathname === '/';
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
  const base = getApiBase();
  const response = await fetch(`${(base || '').replace(/\/$/, '')}/api/v1/projects`);
        if (response.ok) {
          const data = await response.json();
          setProjects(Array.isArray(data) ? data : []);
        } else {
          const errorText = await response.text();
          console.error('App.jsx - Error response:', errorText);
        }
      } catch (error) {
        console.error('App.jsx - Error loading projects:', error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white overflow-x-hidden">
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          

          
          {/* Public Main App */}
          <Route path="/"
            element={
              <>
                <Hero />
                <About />
                <Projects projects={projects} />
                <Achievements />
                <Contact />
              </>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
      {/* Global Chatbot bubble (hidden on auth pages) */}
      {!isAuthPage && (
        <Chatbot
          apiBase={getApiBase()}
          theme="auto"
          welcome="Hi, I'm Sangay. Ask me about my projects, skills, or how to reach me!"
          faqs={[
            { label: 'See my projects', value: 'Show me your projects' },
            { label: 'Skills overview', value: 'What skills and tech do you use?' },
            { label: 'Contact me', value: 'How can I contact you?' }
          ]}
        />
      )}
      <ToastViewport />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
<ScrollHandler>
        <AppContent />
      </ScrollHandler>
    </AuthProvider>
  );
}

export default App;
