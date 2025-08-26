import { getApiBase } from '../lib/apiBase';
const API_BASE = getApiBase();
const API_URL = `${API_BASE}/api/v1/projects`;

// Helper function to make authenticated requests
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
  };
  
  // Only set Content-Type if it's not FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Something went wrong');
  }

  return response;
};

// ========================
//   PUBLIC: GET PROJECTS
// ========================
export const getProjects = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      // Try to parse JSON, but if not, throw a clear error
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (e) {
        const text = await response.text();
        if (text && text.startsWith('<!DOCTYPE')) {
          throw new Error('Received HTML from backend. Check your API URL and backend deployment.');
        }
        throw new Error('Failed to fetch projects: ' + text);
      }
      throw new Error(errorData.message || 'Failed to fetch projects');
    }

    // Defensive: check content-type
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      if (text && text.startsWith('<!DOCTYPE')) {
        throw new Error('Received HTML from backend. Check your API URL and backend deployment.');
      }
      throw new Error('Expected JSON but got: ' + text);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// ========================
//   PRIVATE: CREATE PROJECT
// ========================
export const createProject = async (projectData) => {
  try {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      throw new Error('No authentication token found. Please log in again.');
    }

    const formData = new FormData();

    // Required fields
    formData.append('title', projectData.title);
    formData.append('description', projectData.description);

    // Handle technologies
    if (projectData.technologies) {
      let techArray = [];
      if (typeof projectData.technologies === 'string') {
        techArray = projectData.technologies
          .split(',')
          .map((tech) => tech.trim())
          .filter((tech) => tech.length > 0);
      } else if (Array.isArray(projectData.technologies)) {
        techArray = projectData.technologies.filter(
          (tech) => tech && tech.trim().length > 0
        );
      }

      if (techArray.length === 0) {
        techArray = ['Other'];
      }

      techArray.forEach((tech) => {
        formData.append('technologies', tech);
      });
    } else {
      formData.append('technologies', 'Other');
    }

    // Optional fields
    if (projectData.githubLink) formData.append('githubLink', projectData.githubLink);
    if (projectData.liveDemo) formData.append('liveDemo', projectData.liveDemo);

    // Image upload
    if (projectData.image) {
      if (projectData.image instanceof File) {
        formData.append('image', projectData.image);
      } else if (projectData.image instanceof Blob) {
        const file = new File([projectData.image], 'project-image', { 
          type: projectData.image.type || 'image/jpeg' 
        });
        formData.append('image', file);
      } else if (projectData.image.preview) {
        const response = await fetch(projectData.image.preview);
        const blob = await response.blob();
        const file = new File([blob], 'project-image', { type: blob.type });
        formData.append('image', file);
      }
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      credentials: 'include',
      body: formData,
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to create project');
    }

    return responseData;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};
