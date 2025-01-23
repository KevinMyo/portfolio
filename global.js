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