
var data;

d3.json("data.json", function(error,d){
  data = d;
});

var width = window.innerWidth,
    height = 650;

var nodes = [], labels = [],
    foci = [{x: 650, y: 450}];

var nodesByName = {};

var svg = d3.select("body").append("svg")
    .attr("width", "100%")
    .attr("height", height)


var force = d3.layout.force()
    .nodes(nodes)
    .links([])
    .charge(-500)
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


var newData = [{  
   "color":"green",
   "name":"Slickdeals.net",
   "r":100
},
{  
   "color":"red",
   "name":"Cloudfront.net",
   "r":40
},
{  
   "color":"blue",
   "name":"Teamviewer.com",
   "r":40
},
{  
   "color":"#2dbfff",
   "name":"Yahoo.com",
   "r":30
},
{  
   "color":"#7db1b2",
   "name":"msn.com",
   "r":40
},
{  
   "color":"purple",
   "name":"cuny.edu",
   "r":45
},
{  
   "color":"cyan",
   "name":"apple.com",
   "r":20
},
{  
   "color":"#f2f205",
   "name":"facebook.com",
   "r":20
},
{  
   "color":"orange",
   "name":"github.com",
   "r":20
},
{  
   "color":"green",
   "name":"spotify.com",
   "r":20
},
{  
   "color":"#800080",
   "name":"purple.com",
   "r":10
},
{  
   "color":"red",
   "name":"verizon.net",
   "r":10
},
{  
   "color":"red",
   "name":"Netflix",
   "r":10
},
{  
   "color":"yellow",
   "name":"globalcapacity.com",
   "r":10
},
{  
   "color":"yellow",
   "name":"globalcapacity.com",
   "r":50
},
{  
   "color":"yellow",
   "name":"globalcapacity.com",
   "r":50
},
{  
   "color":"yellow",
   "name":"globalcapacity.com",
   "r":50
},
{  
   "color":"yellow",
   "name":"globalcapacity.com",
   "r":50
}]


setTimeout(function() { processUpdates(data) }, 3000);


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

  if (nodes.length > data.length-1) { clearInterval(timer); return;}

  var item = data[counter];
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