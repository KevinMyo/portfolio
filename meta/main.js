let commits = [];

function processCommits() {
  commits = d3
    .groups(data, (d) => d.commit)
    .map(([commit, lines]) => {
      let first = lines[0]; 
      let { author, date, time, timezone, datetime } = first;

      let ret = {
        id: commit,
        url: `https://github.com/YOUR_REPO/commit/${commit}`,
        author,
        date,
        time,
        timezone,
        datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length,
      };

      Object.defineProperty(ret, "lines", {
        value: lines,
        writable: false, 
        configurable: false, 
        enumerable: false,
      });

      return ret;
    });
}

function getMostActivePeriod() {
    const workByPeriod = d3.rollups(
        data,
        (v) => v.length,
        (d) => new Date(d.datetime).toLocaleString('en', { dayPeriod: 'short' }) // Gets "in the afternoon"
    );

    let mostActive = d3.greatest(workByPeriod, (d) => d[1])?.[0] || "Unknown";

    return mostActive.replace("in the ", ""); 
}

function displayStats() {
    processCommits();
  
    const statsContainer = d3.select("#stats").append("div").attr("class", "stats-container");
  
    const statsGrid = statsContainer.append("div").attr("class", "stats-summary");
  
    const statsData = [
      { label: "Commits", value: commits.length },
      { label: "Files", value: d3.group(data, d => d.file).size },
      { label: "Total LOC", value: data.length },
      { label: "Most Active Period", value: getMostActivePeriod() },
      { label: "Longest Line", value: d3.max(data, d => d.length) },
      { label: "Max Lines", value: d3.max(data, d => d.line) }
    ];
  
    statsData.forEach(stat => {
      const statDiv = statsGrid.append("div");
      statDiv.append("dt").text(stat.label);
      statDiv.append("dd").text(stat.value);
    });
  
    statsContainer.append("div")
      .attr("class", "stats-caption")
      .html("<strong>Figure 1:</strong> Example of a summary stats section");
  }

  async function loadData() {
    data = await d3.csv('loc.csv', (row) => ({
      ...row,
      line: +row.line,
      depth: +row.depth,
      length: +row.length,
      date: new Date(row.date + 'T00:00' + row.timezone),
      datetime: new Date(row.datetime),
    }));
  
    processCommits();
    displayStats();
    createScatterplot();
  }
  
  document.addEventListener("DOMContentLoaded", async () => {
    await loadData();
  });

function createScatterplot() {
    const width = 1000;
    const height = 600;
    const margin = { top: 10, right: 10, bottom: 50, left: 60 };

    const usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left,
        width: width - margin.left - margin.right,
        height: height - margin.top - margin.bottom,
    };

    // Append SVG
    const svg = d3
        .select("#chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    xScale = d3
        .scaleTime()
        .domain(d3.extent(commits, (d) => d.datetime))
        .range([usableArea.left, usableArea.right])
        .nice();

    yScale = d3
        .scaleLinear()
        .domain([0, 24])
        .range([usableArea.bottom, usableArea.top]);

    const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);
    rScale = d3.scaleSqrt().domain([minLines, maxLines]).range([2, 30]);

    const sortedCommits = [...commits].sort((a, b) => b.totalLines - a.totalLines);

    const brush = d3.brush()
        .extent([[0, 0], [width, height]])
        .on("start brush end", brushed);

    svg.append("g").call(brush);

    svg.selectAll(".dots, .overlay ~ *").raise();

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale)
        .tickFormat((d) => String(d % 24).padStart(2, '0') + ':00');

    svg.append("g")
        .attr("transform", `translate(0, ${usableArea.bottom})`)
        .call(xAxis);

    svg.append("g")
        .attr("transform", `translate(${usableArea.left}, 0)`)
        .call(yAxis);

    const dots = svg.append("g").attr("class", "dots");
    
    svg.selectAll("g")
        .attr("stroke", (d) => {
            const hour = d % 24;
            if (hour < 6) return "#1e3a8a";
            if (hour < 18) return "#ea580c";
            return "#6b21a8";
        });
    
    dots.selectAll("circle")
        .data(sortedCommits)
        .join("circle")
        .attr("cx", (d) => xScale(d.datetime))
        .attr("cy", (d) => yScale(d.hourFrac))
        .attr("r", (d) => rScale(d.totalLines))
        .attr("fill", "steelblue")
        .style("fill-opacity", 0.7)
        .on("mouseenter", function (event, d) {
            d3.select(event.currentTarget)
                .style("fill-opacity", 1)
                .attr("stroke", "black")
                .attr("stroke-width", 2);
            updateTooltipContent(d);
            updateTooltipVisibility(true);
            updateTooltipPosition(event);
        })
        .on("mouseleave", function () {
            d3.select(event.currentTarget)
                .style("fill-opacity", 0.7)
                .attr("stroke", "none");
            updateTooltipVisibility(false);
        });
    
    function updateTooltipContent(commit) {
            const link = document.getElementById("commit-link");
            const date = document.getElementById("commit-date");
        
            if (Object.keys(commit).length === 0) return;
        
            link.href = commit.url;
            link.textContent = commit.id;
            date.textContent = commit.datetime?.toLocaleString("en", { dateStyle: "full" });
        }
        function updateTooltipVisibility(isVisible) {
            const tooltip = document.getElementById("commit-tooltip");
            tooltip.hidden = !isVisible;
        }
        function updateTooltipPosition(event) {
            const tooltip = document.getElementById("commit-tooltip");
            tooltip.style.left = `${event.clientX}px`;
            tooltip.style.top = `${event.clientY}px`;
        }

    function brushed(event) {
        brushSelection = event.selection;
        updateSelection();
    }

    function isCommitSelected(commit) {
        if (!brushSelection) return false;
        const [[x0, y0], [x1, y1]] = brushSelection;
        const x = xScale(commit.datetime);
        const y = yScale(commit.hourFrac);
        return x >= x0 && x <= x1 && y >= y0 && y <= y1;
    }

    function updateSelection() {
        d3.selectAll("circle").classed("selected", (d) => isCommitSelected(d));
        updateSelectionCount();
        updateLanguageBreakdown();
    }

    function updateSelectionCount() {
        const selectedCommits = brushSelection ? commits.filter(isCommitSelected) : [];
        document.getElementById("selection-count").textContent = `${
            selectedCommits.length || "No"
        } commits selected`;
    }

    function updateLanguageBreakdown() {
        const selectedCommits = brushSelection ? commits.filter(isCommitSelected) : [];
        const container = document.getElementById("language-breakdown");

        if (selectedCommits.length === 0) {
            container.innerHTML = "";
            return;
        }

        const lines = selectedCommits.flatMap((d) => d.lines);
        const breakdown = d3.rollup(lines, (v) => v.length, (d) => d.type);

        container.innerHTML = "";
        for (const [language, count] of breakdown) {
            const proportion = count / lines.length;
            const formatted = d3.format(".1~%")(proportion);
            container.innerHTML += `<dt>${language}</dt><dd>${count} lines (${formatted})</dd>`;
        }
    }
}