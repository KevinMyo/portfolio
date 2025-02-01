console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// const navLinks = $$("nav a");
// const currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
//   );
// currentLink?.classList.add('current');

const pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'CV/', title: 'CV' },
    { url: 'contact/', title: 'Contact' },
    { url: 'https://github.com/kevinmyo', title: 'GitHub Profile' },
  ];

const ARE_WE_HOME = document.documentElement.classList.contains('home');
const nav = document.createElement('nav');
document.body.prepend(nav);

for (const page of pages) {
    let url = page.url;
    const title = page.title;
    if (!ARE_WE_HOME && !url.startsWith('http')) {
        url = '../' + url;
      }
      const a = document.createElement('a');
      a.href = url;
      a.textContent = title;
      a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname
      );
      if (a.host !== location.host) {
        a.target = '_blank';
      }
      nav.append(a);
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
      <label class="color-scheme">
        Theme:
        <select>
          <option value="light dark">Automatic</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
    `
  );
const select = document.querySelector('.color-scheme select');
const root = document.documentElement;
function setColorScheme(colorScheme) {
    root.style.setProperty('color-scheme', colorScheme);
    select.value = colorScheme;
  }
  if ('colorScheme' in localStorage) {
    setColorScheme(localStorage.colorScheme);
  }
  select.addEventListener('input', (event) => {
    const colorScheme = event.target.value;
    setColorScheme(colorScheme);
    localStorage.colorScheme = colorScheme; // Save to localStorage
  });

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

    // containerElement.innerHTML = '';

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

    containerElement.appendChild(article);
}
