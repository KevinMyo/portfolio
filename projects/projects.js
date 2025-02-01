import { fetchJSON, renderProjects } from '../global.js';

(async () => {
    try {
      const projects = await fetchJSON('../lib/projects.json');
  
      const projectsContainer = document.querySelector('.projects');
      const projectsTitle = document.querySelector('.projects-title');

      if (!projectsContainer) {
        console.error("The container with class '.projects' was not found.");
        return;
      }

      if (Array.isArray(projects) && projectsTitle) {
        projectsTitle.textContent = `Projects (${projects.length})`;
      }

      projectsContainer.innerHTML = '';
  
      if (Array.isArray(projects) && projects.length > 0) {
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