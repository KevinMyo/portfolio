import { fetchJSON, renderProjects } from '../global.js';

(async () => {
    try {
      const projects = await fetchJSON('../lib/projects.json');
  
      const projectsContainer = document.querySelector('.projects');
  
      if (!projectsContainer) {
        console.error("The container with class '.projects' was not found.");
        return;
      }

      if (Array.isArray(projects) && projects.length > 0) {
        // It’s important to clear the container only once before adding all project entries.
        projectsContainer.innerHTML = '';

        projects.forEach(project => {
          renderProjects(project, projectsContainer, 'h2');
        });
      } else {

        projectsContainer.innerHTML = '<p>No projects available at the moment.</p>';
      }
    } catch (error) {

      console.error('Error fetching or rendering projects:', error);
    }
  })();