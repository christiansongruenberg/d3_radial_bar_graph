
//var data = [{pos: 0, value: 50},{pos: 1, value: 20},{pos: 2, value: 30},{pos: 3, value: 40},{pos: 4, value: 50}]
var data = [];
var r = 50;

for(var i = 0; i < 12; i++){
    data[i] = {};
    data[i].pos = i;
    data[i].value = 0.1;
}

console.log(data);

var box = d3.select('.box');
var pm = d3.select('.pm');

for(var i = 1; i <= 12; i++){
    
    
    var xoffset = i == 12 ? 3 : 1.5;
    
    var angle = i*30/180*Math.PI;
    var y = -Math.cos(angle)*(r+5)+2;
    var x = Math.sin(angle)*(r+5)-xoffset;
    
    box
    .append('text')
    .text(i)
    .attr('x', x)
    .attr('y', y)
    .attr('font-size', 5);
    
    pm
    .append('text')
    .text(i)
    .attr('x', x)
    .attr('y', y)
    .attr('font-size', 5);
}

for(var i = 0; i < 12; i++){
    box
        .append('line')
        .classed('outline', true)
        .attr('x1', '0').attr('y1', '0')
        .attr('x2', '0').attr('y2', '52')
        .attr('transform', 'rotate(' + i*30 + ')');
    pm
        .append('line')
        .classed('outline', true)
        .attr('x1', '0').attr('y1', '0')
        .attr('x2', '0').attr('y2', '52')
        .attr('transform', 'rotate(' + i*30 + ')');
}

var dataScale = d3.scale.linear()
.domain([0, 3500])
.range([0,50]);

var arc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(function(d){ return dataScale(d.value)})
    .startAngle(function(d){return d.pos*30* (Math.PI/180)}) //converting from degs to radians
    .endAngle(function(d){return (d.pos+1)*30*(Math.PI/180)}) //just radians

var arcs = box.selectAll('.arc').data(data).enter().append('g').attr('class', 'arc');
var paths = arcs.append("path").attr('d', arc);

var pmarcs = pm.selectAll('.arc').data(data).enter().append('g').attr('class', 'arc');
var pmpaths = pmarcs.append("path").attr('d', arc);



$(document).ready(function(){
    $('.update').click(function(){
        for(var i = 0; i < 12; i++){
            data[i] = {};
            data[i].pos = i;
            data[i].value = Math.random()*50;
        }
        
        $.ajax({
            type: 'GET',
            url: 'http://159.203.6.68',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'jsonp',
            success: function(result) {
                data = result.slice(0,12);
                pmdata = result.slice(12,24);
                
                var dataScale = d3.scale.linear()
                .domain([0, 900])
                .range([0,50]);
                
                var pmdataScale = d3.scale.linear()
                .domain([0, 3205])
                .range([0,50]);

                var arc = d3.svg.arc()
                    .innerRadius(0)
                    .outerRadius(function(d){ return dataScale(d.value)})
                    .startAngle(function(d){return d.pos*30* (Math.PI/180)}) 
                    .endAngle(function(d){return (d.pos+1)*30*(Math.PI/180)}) 
                
                var pmarc = d3.svg.arc()
                    .innerRadius(0)
                    .outerRadius(function(d){ return pmdataScale(d.value)})
                    .startAngle(function(d){return d.pos*30* (Math.PI/180)})
                    .endAngle(function(d){return (d.pos+1)*30*(Math.PI/180)}) 
                
                paths.data(data).transition().attr('d', arc).duration(1000).delay(function(d){return 0}).ease('elastic');
                pmpaths.data(pmdata).transition().attr('d', pmarc).duration(1000).delay(function(d){return 0}).ease('elastic');
            },
            error: function(result){
                console.log(result);
            }
});
    });
    
    
});


//.style('opacity', function(d){ return d.value/50})
