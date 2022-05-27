const dataURL =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

const choroplethURL =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

const w = 1250;
const h = 1000;
const padding = 50;

const path = d3.geoPath();

const svg = d3
  .select('body')
  .select('div')
  .append('svg')
  .attr('width', w)
  .attr('height', h);

const req = new XMLHttpRequest();
req.open('GET', dataURL, true);
req.send();
req.onload = function () {
  const json = JSON.parse(req.responseText);
  const educationData = json;
  const tooltip = d3.select('#tooltip');

  d3.json(choroplethURL).then((data) => {
    svg
      .selectAll('path')
      .data(topojson.feature(data, data.objects.counties).features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('class', 'county')
      .attr('data-fips', (d) => d.id)
      .attr('data-education', (d) => {
        for (let i = 0; i < educationData.length; i++) {
          if (d.id === educationData[i].fips) {
            return educationData[i].bachelorsOrHigher;
          }
        }
      })
      .style('stroke', '#ffff')
      .style('stroke-width', '0.5')
      .style('fill', (d) => {
        const calcEdu = () => {
          for (let i = 0; i < educationData.length; i++) {
            if (d.id === educationData[i].fips) {
              return educationData[i].bachelorsOrHigher;
            }
          }
        };
        const educationLevel = calcEdu();
        if (educationLevel < 12) {
          return '#FAF3DD';
        } else if (educationLevel < 21) {
          return '#DDFFBC';
        } else if (educationLevel < 30) {
          return '#91C788';
        } else if (educationLevel < 39) {
          return '#29BB89';
        } else if (educationLevel < 48) {
          return '#68B0AB';
        } else if (educationLevel < 57) {
          return '#289672';
        } else if (educationLevel < 66) {
          return '#1E6F5C';
        }
      })
      .on('mouseover', function (e) {
        console.log(e);
        const targetID = e.target['__data__'].id;
        tooltip.style('opacity', '1');
        for (const data of educationData) {
          if (data.fips === targetID) {
            tooltip
              .text(() => {
                return `${data['area_name']}, ${data.state}, ${data.bachelorsOrHigher}%`;
              })
              .attr('data-education', e.target.attributes[3].value)
              .style(
                'transform',
                `translate(${e.clientX - 250}px , ${e.clientY - 1100}px)`
              );
          }
        }
      })
      .on('mouseout', function () {
        tooltip.style('opacity', '0');
      });

    // legend
    const legendTicks = [3, 12, 21, 30, 39, 48, 57, 66];

    const legendStart = d3.min(legendTicks);
    const legendEnd = d3.max(legendTicks);

    const legendScale = d3
      .scaleLinear()
      .domain([legendStart, legendEnd])
      .range([100, 500]);

    const legendAxis = d3
      .axisBottom(legendScale)
      .tickValues(legendTicks)
      .tickFormat((d) => d + '%');

    svg
      .append('g')
      .attr('id', 'legend')
      .attr('transform', 'translate(0, 680)')
      .call(legendAxis)
      .selectAll('legend-rect')
      .data(legendTicks)
      .enter()
      .append('rect')
      .attr('class', 'legend-rect')
      .attr('width', 400 / (legendTicks.length - 1))
      .attr('height', 20)
      .attr('x', (d) => {
        let width = 400 / (legendTicks.length - 1);
        let index = legendTicks.indexOf(d);
        if (index === 0) {
          return 100;
        } else {
          return 100 + width * index;
        }
      })
      .attr('y', -20)
      .style('fill', (d) => {
        if (d < 12) {
          return '#FAF3DD';
        } else if (d < 21) {
          return '#DDFFBC';
        } else if (d < 30) {
          return '#91C788';
        } else if (d < 39) {
          return '#29BB89';
        } else if (d < 48) {
          return '#68B0AB';
        } else if (d < 57) {
          return '#289672';
        } else if (d < 66) {
          return '#1E6F5C';
        }
      });
  });
};
