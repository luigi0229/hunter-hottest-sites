var dataSet = null;

d3.json("data.json", function(error,d){
  dataSet = d;
});
//this only works if we disable caching
var current = null;
setInterval(function() {
    $.getJSON("data.json", function(json) {
        current = JSON.stringify(json);  
        oldDataset = JSON.stringify(dataSet); 
        if (oldDataset  !== current) {
            location.reload();
        }
        oldDataSt = current;
    });                       
}, 10000);   

var width = window.innerWidth,
    height = 650;

var nodes = [], labels = [],
    foci = [{x: 550, y: 350}];

var nodesByName = {};

var svg = d3.select("#graph")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 1200 800")
  .classed("svg-content", true);

var tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("visibility", "hidden")
  .text("test");
  
var force = d3.layout.force()
    .nodes(nodes)
    .links([])
    .charge(
            function(circle) {
                return circle.r * -10
            })
    .gravity(0.1)
    .friction(0.8)
    .size([width, height])
    .on("tick", tick);

var node = svg.selectAll("g");

var counter = 0;

function tick(e) {
  var k = .1 * e.alpha;

  // Push nodes toward their designated focus.
  nodes.forEach(function(o, i) {
    o.y += (foci[0].y - o.y) * k;
    o.x += (foci[0].x - o.x) * k;
  });

  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

}


//setTimeout(function() { nodes = []; start() }, 3000);

// setTimeout(function() {
//   var nodeObject = {color: item.color, r: item.r, name: item.name};
//    nodes.push(nodeObject);
//   start();
// }, 1000);

function processUpdates(sites) {
  for (var i = 0; i < sites.length; i++) {
    var site = sites[i];
    if (nodesByName[site.name]) {
      console.log(site.name, site.r)
      updateNodeRadius(site.name, site.r)
    } else {
      // add new circle to graph
    }
  }
}

function updateNodeRadius(name, radius) {
  var nodeObject = nodesByName[name];
  console.log(nodeObject)
  nodeObject[0][0].children[0].r.baseVal.value = radius;
  force.start();
}

// setTimeout(function() { updateNodeRadius("Cloudfront.net", 500) }, 3000)



var timer = setInterval(function(){

  if (nodes.length > dataSet.length-1) { clearInterval(timer); return;}

  var item = dataSet[counter];
  var nodeObject = {color: item.color, r: item.r, name: item.name};
  nodes.push(nodeObject);
  force.start();

 node = node.data(nodes);

  var n = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .style('cursor', 'pointer')
      .on('mousedown', function() {
         var sel = d3.select(this);
         sel.moveToFront();
      })
      .on("mouseover", function(){return tooltip.style("visibility", "visible");})
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
      .call(force.drag);

  n.append("circle")
      .attr("r",  function(d) { return d.r; })
      .style("fill",function(d) { return d.color;})
      

  n.append("text")
      .text(function(d){
          return d.name;
      })
      .style("font-size", function(d) {
          return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 16) + "px"; 
       })
      .attr("dy", ".35em")

    nodesByName[item.name] = n;


  counter++;
}, 0);

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

function resize() {
  width = window.innerWidth;
  force.size([width, height]);
  force.start();
}

d3.select(window).on('resize', resize);