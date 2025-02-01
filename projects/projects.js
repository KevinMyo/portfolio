[
    {
        "title": "Lorem ipsum dolor sit.",
        "image": "https://vis-society.github.io/labs/2/images/empty.svg",
        "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, excepturi earum. Consequuntur, molestias nemo! Odio repellat animi mollitia, autem dolorum qui sapiente eveniet alias quia aliquid est similique, rem quam."
    },
    {
        "title": "Pariatur quibusdam voluptas corrupti?",
        "image": "https://vis-society.github.io/labs/2/images/empty.svg",
        "description": "Nemo, voluptatibus perferendis alias quae dicta quisquam porro laborum, aperiam exercitationem at pariatur suscipit, aliquid sint cum. Totam ratione doloremque rerum nobis facilis, asperiores eaque id, fugiat molestiae facere eos!"
    },
    {
        "title": "Nemo laudantium pariatur quibusdam.",
        "image": "https://vis-society.github.io/labs/2/images/empty.svg",
        "description": "Iste, est alias enim tenetur debitis deleniti impedit sapiente aut distinctio velit totam vitae unde placeat, veritatis, illum cumque odit aliquam quibusdam ab sit! Consequatur molestiae dolorem magnam harum quas."
    },
    {
        "title": "Omnis laborum illo qui!",
        "image": "https://vis-society.github.io/labs/2/images/empty.svg",
        "description": "A esse, beatae unde quibusdam autem accusamus similique voluptate quisquam perferendis commodi voluptatem libero natus vero perspiciatis temporibus nostrum voluptatibus cupiditate explicabo! Recusandae suscipit rerum error corrupti consequuntur reprehenderit et."
    },
    {
        "title": "Earum unde cupiditate soluta!",
        "image": "https://vis-society.github.io/labs/2/images/empty.svg",
        "description": "Explicabo aspernatur praesentium sed iure dolore vitae veniam, quos excepturi facilis soluta repellendus dolor, incidunt necessitatibus voluptate quae assumenda vero eveniet. Asperiores laudantium beatae odit, pariatur incidunt libero minus magni."
    },
    {
        "title": "Repudiandae voluptate illo suscipit?",
        "image": "https://vis-society.github.io/labs/2/images/empty.svg",
        "description": "Ipsa quis et obcaecati, architecto praesentium eveniet inventore? Deserunt hic magnam tenetur repudiandae vitae ea perferendis ab doloremque illum a. Architecto veritatis vero dolor quae et sequi asperiores beatae magni?"
    },
    {
        "title": "Libero, expedita debitis. Dolorem.",
        "image": "https://vis-society.github.io/labs/2/images/empty.svg",
        "description": "Voluptate nam debitis officiis sunt, architecto corrupti hic excepturi illum obcaecati accusantium accusamus optio mollitia? Quidem, aliquid iusto dolore consequuntur fugit perferendis, voluptates repudiandae ex nemo impedit similique in temporibus."
    },
    {
        "title": "Itaque rem repellendus facere!",
        "image": "https://vis-society.github.io/labs/2/images/empty.svg",
        "description": "Saepe reprehenderit voluptatum quo tempora voluptas doloremque dolore, sit culpa? Reprehenderit perspiciatis voluptatem illo, explicabo eos dignissimos corrupti. Facere autem accusamus totam temporibus. Ullam nesciunt vel dolores molestias debitis minus!"
    },
    {
        "title": "Sapiente praesentium ipsam hic.",
        "image": "https://vis-society.github.io/labs/2/images/empty.svg",
        "description": "Blanditiis quaerat ea ducimus, ipsa earum magnam sapiente necessitatibus impedit amet perferendis cumque. Accusantium ab, quisquam ut neque eveniet accusamus aspernatur doloremque voluptatibus ex ullam? Vero debitis dignissimos optio ratione?"
    },
    {
        "title": "Libero mollitia eveniet quaerat.",
        "image": "https://vis-society.github.io/labs/2/images/empty.svg",
        "description": "Iusto, cumque. Similique obcaecati, animi tempore et dolorum laudantium hic iste quia pariatur corporis distinctio ab, voluptatem quam velit nemo sequi tempora molestias harum quae soluta sunt quos asperiores! Magnam."
    },
    {
        "title": "Distinctio nesciunt voluptas consequuntur.",
        "image": "https://vis-society.github.io/labs/2/images/empty.svg",
        "description": "Dignissimos, numquam ipsum eveniet, ex voluptate amet dolorem ipsa necessitatibus adipisci velit, iure impedit vitae modi nostrum reiciendis aliquid molestiae! Consequuntur, reiciendis maxime! Architecto doloribus similique laudantium, suscipit distinctio corporis?"
    },
    {
        "title": "Vel similique vitae magni?",
        "image": "https://vis-society.github.io/labs/2/images/empty.svg",
        "description": "Voluptate magnam dolores ab provident tenetur possimus odio sint nemo, ipsum recusandae, temporibus pariatur illo labore veritatis ducimus quod obcaecati cum? Consequatur asperiores voluptatem inventore quos magni modi quibusdam nobis."
    }
]

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