

const svg = d3.select("svg")

const width = svg.attr("width")-200
const height = svg.attr("height")-200

const margin = {top: 40, bottom: 20, left: 10, right: 40}

svg.append("text")
  .attr("x", width/2)
  .attr("y", margin.top)
  .attr("text-anchor", "middle")
  .text("Monthly Global Land-Surface Temperature")
  .style("font-size", "30px")

svg.append("text")
    .attr("x", width/2)
    .attr("y", margin.top)
    .attr("text-anchor", "middle")
    .text("1753 - 2015: base temperature 8.66℃")
    .style("font-size", "25px")
    .attr("transform", "translate(0,50)")



const scaleY = d3.scaleBand()
    .domain(['January', 'February','March', 'April','May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])
    .range([3*margin.top, height-margin.bottom])

const yAxis = d3.axisLeft(scaleY)

const svgG = d3.select('svg').append('g')

//console.log(svgG);

svgG.call(yAxis)
    .attr('transform', 'translate(100,0)')


svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width- 600)
    .attr("y", height+ 25)
    .attr("font-size", "15px")
    .text("Years");
    

const scaleX = d3.scaleLinear()
    .domain([1750, 2020])
    .range([margin.left, width-margin.right])

const xAxis = d3.axisBottom(scaleX)
    .tickValues(["", 1760, 1770, 1780, 1790, 1800, 1810, 1820, 1830, 1840, 1850, 1860, 1870, 1880, 1890, 1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010])
    .ticks(28)
    .tickFormat(d3.format(""))
    

const svgGX = d3.select('svg').append('g')

svgGX.call(xAxis)
    .attr('transform', 'translate(77.5,980)')

const box = 20;

async function getTemp() {
    const response = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json");
    const temperatures = await response.json();
    //console.log(temperatures.monthlyVariance);
    console.log(temperatures.baseTemperature);

    const data = temperatures.monthlyVariance

    //console.log(data)

    function numToMonthConverter(num) {
        if (num == 1) {
            return 'January'
        }
        else if (num == 2) {
            return 'February'
        }
        else if (num == 3) {
            return 'March'
        }
        else if (num == 4) {
            return 'April'
        }
        else if (num == 5) {
            return "May"
        }
        else if (num == 6) {
            return 'June'
        }
        else if (num == 7) {
            return 'July'
        }
        else if (num == 8) {
            return 'August'
        }
        else if (num == 9) {
            return 'September'
        }
        else if (num == 10) {
            return 'October'
        }
        else if (num == 11) {
            return 'November'
        }
        else {
            return 'December'
        }
    }

    const newData = data.map((d) => {
        return numToMonthConverter(d.month)
    })

    //console.log(newData);

    var myColor = d3.scaleLinear()
    .domain([2.8-3.9,5.0,6.1,7.2,8.3,9.5,10.6,11.7,12.8])
    .range(["rgb(227,242,247)","rgb(255,255,198)","rgb(249,225,154)", "rgb(241,177,110)", "rgb(227, 117, 79)" , "#C64032"])
    
    var tooltip = d3.select("#tooltipDiv")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "10px")
        .style("padding", "10px")
        .style("position", "absolute")
        .style("font-size", "25px")
        .style("color", "white")

    var mouseover = function(d) {
        tooltip.style("opacity", 1)
        }
    var mousemove = function(d) {
        
        console.log(d.target["__data__"]['year']);
        console.log(numToMonthConverter(d.target["__data__"]['month']));
        console.log(d['target'])
        //console.log(d['target']['x']);
        //console.log(d['target']['y'])

        //console.log(d['target']['x'].animVal.value)
        //console.log(d['target']['y'].animVal.value)

        d3.select(this)
            .attr("stroke-width", "2px")
            .attr("stroke", "black")

        
        tooltip
            .html((
                d.target["__data__"]['year'] + " - " + numToMonthConverter(d.target["__data__"]['month']) + "<br />" + 
                "<center>" + (d3.format(".1f")(8.66 + d.target["__data__"]["variance"]) + "℃") + "</center>" +
                "<center>" + d3.format(".1f")(d.target["__data__"]["variance"]) + "℃") + "</center>"
                )
            .style("left", (d['target']['x'].animVal.value + 50)+"px")
            .style("top", (d['target']['y'].animVal.value - 80) + "px")
        }
    var mouseleave = function(d) {

       d3.select(this)
            .attr("stroke-width", "0px")
            .attr("stroke", d['target']['style']['fill'])
        

        tooltip.style("opacity", 0)
        
        }

    const squares = svg.selectAll('rect')
    .data(() => {
        return data
    })
    .enter()
    .append("rect")
    .attr("x", function(d) { 
        //console.log("This is a test")
        //console.log(scaleX(d.year))
        return scaleX(d.year) 
    })
    .attr('y', function(d) { 
        //console.log(scaleY(numToMonthConverter(d.month)))
        return scaleY(numToMonthConverter(d.month))
    })
    .attr("width", '6px')
    .attr("height", scaleY.bandwidth())
    .style('fill', (d) => {
        if (8.66 + d.variance < 3.9) {
            return "rgb(80,116,175)"
        }
        else if ((8.66 + d.variance >= 3.9) && (8.66 + d.variance < 5.0)) {
            return "rgb(128,171,205)"
        } 
        else if ((8.66 + d.variance >= 5.0) && (8.66 + d.variance < 6.1)) {
            return "rgb(180, 216, 231)"
        }
        else if ((8.66 + d.variance >= 6.1) && (8.66 + d.variance < 7.2)) {
            return "rgb(227,242,247)"
        }
        else if ((8.66 + d.variance >= 7.2) && (8.66 + d.variance < 8.3)) {
            return "rgb(255,255,198)"
        }
        else if ((8.66 + d.variance >= 8.3) && (8.66 + d.variance < 9.5)) {
            return "rgb(249,225,154)"
        }
        else if ((8.66 + d.variance >= 9.5) && (8.66 + d.variance < 10.6)) {
            return "rgb(241,177,110)"
        }
        else if ((8.66 + d.variance >= 10.6) && (8.66 + d.variance < 11.7)) {
            return "rgb(227, 117, 79)"
        }
        else if ((8.66 + d.variance >= 11.7) && (8.66 + d.variance < 12.8)) {
            return "#C64032"
        }
    })
    .attr('transform', 'translate(75, 0)')
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    
    
    var linear = d3.scaleLinear()
	.domain([1.7,13.9])
	.range(["0","440"]);

    var xAxis = d3.axisBottom(linear)
        .tickValues(["", 2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8, ""])
        .tickFormat(d3.format(".1f"))
        

    svg.append("g")
            .attr("transform", "translate(0,1080)")
            .call(xAxis)

    svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 18)
            .attr("dy", "0.75em")
            .attr("dx", "-475px")
            .attr("transform", "rotate(-90)")
            .attr("font-size", "15px")
            .text("Months");

    

	

    var shapeGroup = svg.append("g")
        .attr("transform", "translate(40, 1040)")
    
    shapeGroup.append('rect')
            .attr('height', "40px")
            .attr("width", "40px")
            .attr("fill", "rgb(80,116,175)")
            
    
    shapeGroup.append("rect")
            .attr('height', 40)
            .attr("width", 40)
            .attr("fill", "rgb(128,171,205)")
            .attr("x", 40)
            

    shapeGroup.append('rect')
            .attr('height', 40)
            .attr("width", 40)
            .attr("fill", "rgb(180, 216, 231)")
            .attr("x", 80)
            

    shapeGroup.append('rect')
            .attr('height', 40)
            .attr("width", 40)
            .attr("fill", "rgb(227,242,247)")
            .attr("x", 120)
            

    shapeGroup.append('rect')
            .attr('height', 40)
            .attr("width", 40)
            .attr("fill", "rgb(255,255,198)")
            .attr("x", 160)
            

    shapeGroup.append('rect')
            .attr('height', 40)
            .attr("width", 40)
            .attr("fill", "rgb(249,225,154)")
            .attr("x", 200)
            

    shapeGroup.append('rect')
            .attr('height', 40)
            .attr("width", 40)
            .attr("fill", "rgb(241,177,110)")
            .attr("x", 240)
            

    shapeGroup.append('rect')
            .attr('height', 40)
            .attr("width", 40)
            .attr("fill", "rgb(227, 117, 79)")
            .attr("x", 280)
        

    shapeGroup.append('rect')
            .attr('height', 40)
            .attr("width", 40)
            .attr("fill", "#C64032")
            .attr("x", 320)
            
            


    
    
  }

getTemp();


