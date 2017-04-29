var dataSet;

d3.json("../data.json", function(data) {
  dataSet = data;
  drawGraph(dataSet, "user");
});

var width = window.innerWidth
  , height = 650;

// display descriptions
var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

d3.select("#btnUser").on("click", function() {
  return redraw(dataSet, "user");
})
d3.select("#btnTraffic").on("click", function() {
  return redraw(dataSet, "traffic");
})
d3.select("#btnPacket").on("click", function() {
  return redraw(dataSet, "packet");
})

var svg = d3.select("#graph")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "-50 0 1200 1000")
  .classed("svg-content", true);

var foci = [{
  x: 550,
  y: 450
}];

function drawGraph(newData, check) {

  var redrawNodes = [];

  var force = d3.layout.force()
    .nodes(redrawNodes)
    .links([])
    .charge(function(circle) {
      return circle.r * -10;
    })
    .gravity(0.1)
    .friction(0.8)
    .size([width, height])
    .on("tick", tick);

  function tick(e) {
    var k = .1 * e.alpha;

    // Push nodes toward their designated focus.
    redrawNodes.forEach(function(o, i) {
      o.y += (foci[0].y - o.y) * k;
      o.x += (foci[0].x - o.x) * k;
    });

    node.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

  }

  var node = svg.selectAll("g");
  var counter = 0;
  var timer = setInterval(function() {

    if (redrawNodes.length > dataSet.length - 1) {
      clearInterval(timer);
      return;
    }
    var item = newData[counter];

    var nodeObject;

    if (check === "user") {
      nodeObject = {
        color: item.color,
        r: item.ru,
        ip: item.ServerIP , 
        name: item.name ,
        size: item.size ,
        packet: item.packets ,
        user: item.users ,
        fseen: item.firstSeen ,
        lseen: item.lastSeen
      };
    } else if (check === "traffic") {
      nodeObject = {
        color: item.color,
        r: item.rt, 
        ip: item.ServerIP,
        name: item.name,
        size: item.size,
        packet: item.packets,
        user: item.users , 
        fseen: item.firstSeen ,
        lseen: item.lastSeen
      };
    } else {
      nodeObject = {
        color: item.color,
        r: item.rp,
        ip: item.ServerIP,
        name: item.name,
        size: item.size,
        packet: item.packets,
        user: item.users,
        fseen: item.firstSeen,
        lseen: item.lastSeen
      };
    }

    redrawNodes.push(nodeObject);
    force.start();
    node = node.data(redrawNodes);

    var n = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
      .style('cursor', 'pointer')
      .on("mouseover", function() {
        var coords = d3.select(this)[0][0];
        var app = tooltip.style("visibility", "visible");
        var coordinates = [0, 0];
        coordinates = d3.mouse(this);
        var x = coordinates[0];
        var y = coordinates[1];
        var sel = d3.select(this);
        sel.moveToFront();

        return app.html("Site Name: " + coords.__data__.name + "<br/>" +
          "ServerIP: " + coords.__data__.ip + "<br/>" +
          "First Seen: " + coords.__data__.fseen + "<br/>" +
          "Last Seen: " + coords.__data__.lseen + "<br/>" +
          "Traffic: " + coords.__data__.size + "<br/>" +
          "Radius: " + coords.__data__.r + "<br/>" +
          "Packets: " + coords.__data__.packet + "<br/>" +
          "User: " + coords.__data__.user);
      })
      .on("mouseout", function() {
        return tooltip.style("visibility", "hidden");
      })
      .call(force.drag);

    n.append("circle")
      .attr("r", function(d) {
        return d.r;
      })
      .style("fill", function(d) {
        return d.color;
      })

    n.append("text")
      .text(function(d) {
        return d.name;
      })
      .style("font-size", function(d) {
        return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 16) + "px";
      })
      .attr("dy", ".35em")
    node.exit().remove();
    counter++;
  }, 0);

  d3.select(window).on('resize', function() {
    width = window.innerWidth;
    force.size([width, height]);
    force.start();
  });

} //drawGraph

function redraw(data, check) {
  drawGraph(data, check);
} //redraw

d3.selection.prototype.moveToFront = function() {
  return this.each(function() {
    this.parentNode.appendChild(this);
  });
};