import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

(async () => {
        try {
          const projects = await fetchJSON('../lib/projects.json');
          const projectsTitle = document.querySelector('.projects-title');
          const projectsContainer = document.querySelector('.projects');
    
          if (!projectsContainer) {
            console.error("The container with class '.projects' was not found.");
            return;
          }
          if (!projects || projects.length === 0) {
            console.error("No projects found!");
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
    


//
(async () => {
    const projects = await fetchJSON('../lib/projects.json');
    const projectsContainer = document.querySelector('.projects');
    const searchInput = document.querySelector('.searchBar');
    let selectedYear = null;

    function renderPieChart(projects) {
        const rolledData = d3.rollups(
            projects,
            (v) => v.length,
            (d) => d.year
        );

        const data = rolledData.map(([year, count]) => ({ value: count, label: year }));
        const colors = d3.scaleOrdinal(d3.schemeTableau10);
        const sliceGenerator = d3.pie().value(d => d.value);
        const arcGenerator = d3.arc().innerRadius(0).outerRadius(80);
        const arcData = sliceGenerator(data);

        d3.select("#projects-pie").html('');
        const svg = d3.select("#projects-pie")
            .append("svg")
            .attr("width", 300)
            .attr("height", 300)
            .append("g")
            .attr("transform", "translate(150,150)");

        const slices = svg.selectAll("path")
            .data(arcData)
            .enter()
            .append("path")
            .attr("d", arcGenerator)
            .attr("fill", (d, i) => colors(i))
            .attr("class", "pie-slice")
            .style("cursor", "pointer")

            .on("mouseover", function (event, d) {
                if (!selectedYear) {
                    let tempYear = d.data.label;
                    highlightProjects(tempYear);
                }
            })
        
            .on("mouseout", function () {
                if (!selectedYear) { 
                    highlightProjects(null);
                }
            })

            .on("click", function (event, d) {
                selectedYear = selectedYear === d.data.label ? null : d.data.label;
                // updateFilters();
                d3.selectAll(".pie-slice").classed("selected", (s) => s.data.label === selectedYear);
                filterProjects();
            })
            .transition()
            .duration(800)
            .attrTween("d", function(d) {
                let interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
                return function(t) { return arcGenerator(interpolate(t)); };
            });
        

        svg.selectAll("text")
            .data(arcData)
            .enter()
            .append("text")
            .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
            .attr("dy", "0.35em")
            .style("text-anchor", "middle")
            .style("font-size", "10px")
            .style("fill", "white")
            .text(d => d.data.label);

        const legend = d3.select(".legend").html('');
        data.forEach((d, i) => {
            legend.append("li")
                .attr("style", `--color: ${colors(i)}`)
                .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
                .on("click", () => {
                    selectedYear = selectedYear === d.label ? null : d.label;
                    // updateFilters();
                    filterProjects();
                });
        });
    }

function filterProjects() {
    let query = searchInput.value.toLowerCase();
    let filtered = projects.filter(p => 
        Object.values(p).join(" ").toLowerCase().includes(query) &&
        (!selectedYear || p.year.toString() === selectedYear)
    );

    if (filtered.length === 0) { // FIXED: Prevents blank page by keeping at least one project visible
        console.warn("No projects match the filter criteria.");
        filtered = projects;
    }

    renderProjects(filtered, projectsContainer);
    renderPieChart(filtered);
}

searchInput.addEventListener('input', filterProjects);

renderProjects(projects, projectsContainer);
renderPieChart(projects);
})();

function highlightProjects(tempYear) {
    let filteredProjects = projects.filter(p => !tempYear || p.year.toString() === tempYear);
    renderProjects(filteredProjects, projectsContainer);
}