var userData = null;
var trafficData = null;
var packetData = null;

// update files
setInterval(function() {
    d3.json("user.json", function(data) {
      d3.json("traffic.json", function(traffic) {
        d3.json("packets.json",function(packet){
          userData = data;
          trafficData = traffic;
          packetData = packet;
        });
    });
  });                     
}, 1000);   

//disable caching
// var current = null;
// setInterval(function() {
//     d3.json("data.json", function(json) {
//         current = JSON.stringify(json);  
//         olduserData = JSON.stringify(userData); 
//         if (olduserData  !== current) {
//             redraw(json)
//         }
//         oldDataSt = current;
//     });                       
// }, 10000);   

var width = window.innerWidth,
    height = 650;

var color = d3.scale.category20();

var nodes = [], labels = [],
    foci = [{x: 550, y: 350}];

var nodesByName = {};

var svg = d3.select("#graph")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 1200 800")
  .classed("svg-content", true);
// display descriptions
var tooltip = d3.select("body")
  .append("div")
  .attr("class","tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

  // Button for traffic graph
  d3.select("#graph").append("button").text("User")
  .attr("float", "left").attr("class","btnUser")
  .on("click",function(){
      return redraw(userData);
    })
  // User graph
  d3.select("#graph").append("button").text("Traffic")
  .attr("float", "left").attr("class","btnTraffic")
  .on("click",function(){ 
      return redraw(trafficData);
    })
    // Packets graph
  d3.select("#graph").append("button").text("Packets")
    .attr("float", "left").attr("class","btnPacket")
    .on("click",function(){
        return redraw(packetData);
      })
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



function tick(e) {
  var k = .1 * e.alpha;

  // Push nodes toward their designated focus.
  nodes.forEach(function(o, i) {
    o.y += (foci[0].y - o.y) * k;
    o.x += (foci[0].x - o.x) * k;
  });

  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

}
var node = svg.selectAll("g");

var counter = 0;

var timer = setInterval(function(){

  // if (nodes.length > userData.length-1) { clearInterval(timer); return;}

  var item = userData[counter];
  var nodeObject = {color: item.color, r: item.r,
                    name: item.name, size: item.size,
                    packet: item.packets, user: item.users,
                    fseen: item.firstSeen, lseen: item.lastSeen
                    };
  nodes.push(nodeObject);
  force.start();

 node = node.data(nodes);

  var n = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .style('cursor', 'pointer')
      // .on('mousedown', function() {
      //    var sel = d3.select(this);
      //    sel.moveToFront();
      // })
      .on("mouseover", function(){
          var coords = d3.select(this)[0][0];
          var app = tooltip.style("visibility", "visible");
          var coordinates = [0, 0];
          coordinates = d3.mouse(this);
          var x = coordinates[0];
          var y = coordinates[1];
          var sel = d3.select(this);
          sel.moveToFront();

          return app.html("Site Name: " + coords.__data__.name + "<br/>" 
            + "First Seen: " + coords.__data__.fseen + "<br/>" 
            + "Last Seen: " + coords.__data__.lseen + "<br/>"         
            + "Traffic: " + coords.__data__.size + "<br/>" 
            + "Packets: " + coords.__data__.packet + "<br/>"
            + "User: " + coords.__data__.user);
        })
      .on("mouseout", function(){
        return tooltip.style("visibility", "hidden");
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


function redraw(newData){

   svg.remove();
   svg = d3.select("#graph")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1200 800")
    .classed("svg-content", true);

  var redrawNodes = [];

  var force = d3.layout.force()
      .nodes(redrawNodes)
      .links([])
      .charge(
              function(circle) {
                  return circle.r * -10
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

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  }

  var node = svg.selectAll("g");
  var counter = 0;

  var timer = setInterval(function(){

    var item = newData[counter];
    var nodeObject = {color: item.color, r: item.r,
                      name: item.name, size: item.size,
                      packet: item.packets, user: item.users,
                      fseen: item.firstSeen, lseen: item.lastSeen
                      };
    redrawNodes.push(nodeObject);
    force.start();

   node = node.data(redrawNodes);

    var n = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .style('cursor', 'pointer')
        // .on('mousedown', function() {
        //    var sel = d3.select(this);
        //    sel.moveToFront();
        // })
        .on("mouseover", function(){
            var coords = d3.select(this)[0][0];
            var app = tooltip.style("visibility", "visible");
            var coordinates = [0, 0];
            coordinates = d3.mouse(this);
            var x = coordinates[0];
            var y = coordinates[1];
            var sel = d3.select(this);
            sel.moveToFront();

            return app.html("Site Name: " + coords.__data__.name + "<br/>" 
              + "First Seen: " + coords.__data__.fseen + "<br/>" 
              + "Last Seen: " + coords.__data__.lseen + "<br/>"         
              + "Traffic: " + coords.__data__.size + "<br/>" 
              + "Packets: " + coords.__data__.packet + "<br/>"
              + "User: " + coords.__data__.user);
          })
        .on("mouseout", function(){
          return tooltip.style("visibility", "hidden");
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
  nodeObject[0][0].children[0].r.baseVal.value = radius;
  force.start();
}

// setTimeout(function() { updateNodeRadius("Cloudfront.net", 500) }, 3000)


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

 // Popup Window
 $(document).ready(function(){
        var scrollTop = '';
        var newHeight = '100';

        $(window).bind('scroll', function() {
           scrollTop = $( window ).scrollTop();
           newHeight = scrollTop + 100;
        });
        
        $('.about').click(function(e) {
         e.stopPropagation();
         if(jQuery(window).width() < 767) {
           $(this).after( $( ".popup" ) );
           $('.popup').show().addClass('popup-mobile').css('top', 0).focus();
           $('html, body').animate({
                scrollTop: $('.popup').offset().top
            }, 500);   
         } else {
           $('.popup').removeClass('popup-mobile').css('top', newHeight).toggle().focus();
         };
        });
        
        $('html').click(function() {
         $('.popup').hide();
        });

        $('.popup-btn-close').click(function(e){
          $('.popup').hide();
        });

        $('.popup').click(function(e){
          e.stopPropagation();
        });
});