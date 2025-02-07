import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

(async () => {
    try {
        console.log("Fetching latest projects...");
        const projects = await fetchJSON('./lib/projects.json');

        if (!Array.isArray(projects) || projects.length === 0) {
            console.warn("No projects found.");
            return;
        }

        const latestProjects = projects.slice(0, 3);
        console.log("Latest Projects:", latestProjects);

        const projectsContainer = document.querySelector('.projects');

        if (!projectsContainer) {
            console.error("The container with class '.projects' was not found.");
            return;
        }

        projectsContainer.innerHTML = ''; 
        // latestProjects.forEach(project => renderProjects(project, projectsContainer, 'h2'));
        renderProjects(latestProjects, projectsContainer, 'h2');

    } catch (error) {
        console.error("Error fetching or rendering projects:", error);
    }
})();

(async () => {
    try {
        console.log("Fetching GitHub profile data...");

        const githubData = await fetchGitHubData('kevinmyo');

        if (!githubData) {
            console.warn("GitHub data not found.");
            return;
        }

        console.log("GitHub Profile Data:", githubData);

        const profileStats = document.querySelector('#profile-stats');

        if (profileStats) {
            profileStats.innerHTML = `
                <h2>My GitHub Stats</h2>
                <dl class="stats-grid">
                    <dt>FOLLOWERS</dt> <dd>${githubData.followers}</dd>
                    <dt>FOLLOWING</dt> <dd>${githubData.following}</dd>
                    <dt>PUBLIC REPOS</dt> <dd>${githubData.public_repos}</dd>
                    <dt>PUBLIC GISTS</dt> <dd>${githubData.public_gists}</dd>
                </dl>
            `;
        } else {
            console.error("Profile stats container not found.");
        }
    } catch (error) {
        console.error("Error displaying GitHub data:", error);
    }
})();