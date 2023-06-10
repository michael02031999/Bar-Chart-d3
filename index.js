import { 
    select, 
    scaleLinear, 
    max, 
    scaleBand, 
    axisLeft, 
    axisBottom,
    range,
    timeParse,
    format
} from 'https://unpkg.com/d3@7.8.4/src/index.js?module'

const svg = select("svg");

const width = +svg.attr("width");
const height = +svg.attr("height");

svg.append('text')
    .attr("x", width/1.5)
    .attr('y', '75')
    .style('font-size', '48px')
    .text("USD GDP")
    .attr("text-anchor", 'middle')

const response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
.then(response => response.json())
.then(response => parseData(response))

function parseData (response) {

    const padding = 50;

    const data = response.data;

    const newDates = data.map(d => {
        return new Date(d[0])
    })

    const xScale = d3.scaleTime()
        .domain([d3.min(newDates), d3.max(newDates)])
        .range([0, width])

    const yScale = scaleLinear()
        .domain([0, d3.max(data, d => {
            return d[1]
        })])
        .range([height - padding, 0])

    const g = svg.append('g')
        .attr('transform', `translate(50, 0)`)
        .attr('fill', 'blue')
        

    g.append('g').call(axisLeft(yScale))
        .attr('transform', `translate(${width/8}, 0)`)
    g.append('g').call(axisBottom(xScale))
        .attr('transform', `translate(${width/8}, 915)`)

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width + 150)
        .attr("y", height + 20)
        .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf")
        .attr('font-size', "25px")

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 250)
        .attr("transform", "rotate(-90)")
        .text("Gross Domestic Product")
        .attr("font-size", "25px")


    g.selectAll('rect').data(data)
    .enter().append('rect')
        .attr('width', (width - (2 * padding))/newDates.length)
        .attr('height', d => {
            return height - yScale(d[1]) - padding;
        })
        .attr('x', d => {
            let newDate = new Date(d[0])
            return xScale(newDate)
        })
        .attr('y', d => {
            return yScale(d[1])
        })
        .attr('fill', 'orange')
        .on('mouseover', (d) => {
            d3.select(d.target)
                .attr('fill', 'red')                 
        })
        .on('mouseout', (d) => {
            d3.select(d.target)
                .attr('fill', 'orange')
        })
        .attr('data-date', d => {
            return d[0]
        })
        .attr('data-gdp', d => {
            return d[1]
        })
        .attr('transform', `translate(${width/8}, ${0})`)

    svg.append("g").attr("id", "tooltip").style("opacity", 0) // hidden
        .append("rect")
        .attr("height",75)
        .attr("width", 175)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("x", 100)
        .attr("y", 750)
        .attr('fill', 'white')  

    //d3.select('#tooltip').raise();

    let gElement = svg.append("g").attr("id", "tooltip2")

    gElement.append('rect')
        .attr("id", "container")
        .style('fill', 'lightblue')
        .attr("width", '200px')
        .attr('height', '100px')
        .style('opacity', 0)
        .attr("rx", 10)
        .attr('ry', 10)

    gElement.append('text')
        .attr('id', 'time')

    gElement.append('text')
        .attr('id', "gdp")


    svg.selectAll('rect')
        .on('mouseenter', showTooltip)
        .on('mouseleave', hideTooltip)

    let tagline = ""


    function showTooltip(d, i) {

        console.log(d);

        const split_up_dates = i[0].split('-')
        

        

        const tooltip = d3.select("#tooltip2")
            .style('opacity', 1)
            .style("stroke", "red")
            .attr('transform', `translate(${d.x-200}, 600)`)
        

        if (split_up_dates[1] == '01') {
            tagline = split_up_dates[0] + " Q1"
            console.log(tagline);
        }
        else if (split_up_dates[1] == '04') {
            tagline = split_up_dates[0] + " Q2"
        }
        else if (split_up_dates[1] == '07') {
            tagline = split_up_dates[0] + " Q3"
        }
        else if (split_up_dates[1] == '10') {
            tagline = split_up_dates[0] + " Q4"
        }

        tooltip.select("text:first-of-type").text(tagline)
            .attr('transform', 'translate(10,30)')
            .attr('font-size', "25px")
            .style("border", "2.5px solid black")
            .attr('x', 45)
            .attr("y", 10)

        

        d3.select('#container')
            .style('opacity', 1)

        let GDP = parseFloat(i[1])

        function formatter(x) {
            let formattedString = ""
            formattedString = d3.format('$,')(x);
            return formattedString + " Billion"
        }
        
        console.log(formatter(GDP))

        tooltip.select("text:last-child").text(formatter(GDP))
            .attr("transform", "translate(10,50)")
            .attr('font-size', "25px")
            .attr('y', 30)
            .style("border", "2.5px solid black")
            .attr('x', 5)
            

    }
        
    function hideTooltip(d,i) {
        d3.select("#tooltip2").style("opacity", 0)
    }

}

    


