export async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);
        console.log(response); // Inspect the response object

        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

export function renderProjects(project, containerElement, headingLevel = 'h2') {

    if (!containerElement || !(containerElement instanceof HTMLElement)) {
        console.error('Invalid container element provided.');
        return;
    }

    if (!project || typeof project !== 'object') {
        console.error('Invalid project data provided.');
        return;
    }

    containerElement.innerHTML = '';

    const article = document.createElement('article');

    // Validate the heading level.
    const validHeadingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    if (!validHeadingLevels.includes(headingLevel)) {
        console.warn(`Invalid heading level "${headingLevel}" provided. Defaulting to h2.`);
        headingLevel = 'h2';
    }

    article.innerHTML = `
        <${headingLevel}>${project.title}</${headingLevel}>
        <img src="${project.image}" alt="${project.title}">
        <p>${project.description}</p>
    `;

    // Append the article to the container element.
    containerElement.appendChild(article);
}