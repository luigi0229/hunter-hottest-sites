var dataSet;

d3.json("data.json", function(data) {
  dataSet = data;
});

setInterval(function() {
    d3.json("data.json", function(data) {
    dataSet = data;
    location.reload();
  });                     
}, 10000);   
  
var width = window.innerWidth,
    height = 650;

var color = d3.scale.category20();

var nodes = [], labels = [],
    foci = [{x: 550, y: 450}];

var nodesByName = {};

var svg = d3.select("#graph")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "-50 0 1200 1000")
  .classed("svg-content", true) 
  .classed("svg-content-responsive", true);

// display descriptions
var tooltip = d3.select("body")
  .append("div")
  .attr("class","tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

  // Button for user graph
  d3.select(".buttons").append("button").text("User")
  .attr("id","btnUser")
  .on("click",function(){
      return redraw(dataSet,"user");
    })
  // traffic
  d3.select(".buttons").append("button").text("Traffic")
  .attr("id","btnTraffic")
  .on("click",function(){
      d3.select
      return redraw(dataSet,"traffic");
    })
    // Packets 
  d3.select(".buttons").append("button").text("Packets")
    .attr("id","btnPacket")
    .on("click",function(){
        return redraw(dataSet,"packet");
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
  
  nodes.forEach(function(o, i) {
    o.y += (foci[0].y - o.y) * k;
    o.x += (foci[0].x - o.x) * k;
  });

  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

}
var node = svg.selectAll("g");

var counter = 0;

var timer = setInterval(function(){

  "use strict"

  if (nodes.length > dataSet.length-1) { clearInterval(timer); return;}

  var item = dataSet[counter];
  var nodeObject = {color: item.color, r: item.ru, ip: item.ServerIP,
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
            + "ServerIP: " + coords.__data__.ip + "<br/>"        
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
    node.exit().remove();
  counter++;
}, 0);

function redraw(newData,check){

   svg.remove();

   svg = d3.select("#graph")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "-50 0 1200 1000")
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

  if (redrawNodes.length > dataSet.length-1) { clearInterval(timer); return;}

    var item = newData[counter];

    var nodeObject;

    if(check == "user"){
      nodeObject = {color: item.color, r: item.ru,ip: item.ServerIP,
                    name: item.name, size: item.size,
                    packet: item.packets, user: item.users,
                    fseen: item.firstSeen, lseen: item.lastSeen
                    };
    }
    else if(check == "traffic"){
      nodeObject = {color: item.color, r: item.rt,ip: item.ServerIP,
                    name: item.name, size: item.size,
                    packet: item.packets, user: item.users,
                    fseen: item.firstSeen, lseen: item.lastSeen
                    };
    }
    else if(check == "packet"){
      nodeObject = {color: item.color, r: item.rp,ip: item.ServerIP,
                    name: item.name, size: item.size,
                    packet: item.packets, user: item.users,
                    fseen: item.firstSeen, lseen: item.lastSeen
                    };
    }
    else{
      console.log("Error, no check condition");
    }

    redrawNodes.push(nodeObject);
    force.start();

   node = node.data(redrawNodes);

    var n = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .style('cursor', 'pointer')
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
              + "ServerIP: " + coords.__data__.ip + "<br/>"        
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


// FAQ page
var debounce = function(func, wait, immediate) {

  "use strict";

  var timeout;
  return function() {
    var context = this;
    var args = arguments;
    var later = function() {
      timeout = null;
      if ( !immediate ) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait || 200);
    if ( callNow ) {
      func.apply(context, args);
    }
  };
};

var Pab = (function (window, document, debounce) {
  "use strict";

  var dataAttr = "data-pab";
  var attrName = dataAttr.replace("data-", "") + "_";
  var btnClass = dataAttr.replace("data-", "") + "-btn";
  var dataExpandAttr = dataAttr + "-expand";
  var internalId = 0;


  function $ (selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }


  function _isExpanded (obj) { 
    return obj && (obj.getAttribute("aria-expanded") === "true" || obj.getAttribute("aria-hidden") === "false");
  }


  var _getHiddenObjectHeight = function (obj) {
    var clone = obj.cloneNode(true);
    var height = 0;
    clone.id = obj.id + "_clone";
    clone.setAttribute("style",
                       "display:block;" +
                       "width:" + obj.offsetWidth + "px;" +
                       "position:absolute;" +
                       "top:0;" +
                       "left:-999rem;" +
                       "max-height:none;" +
                       "height:auto;" +
                       "visibility:visible;"
                      );

    obj.parentNode.insertBefore(clone, obj.nextSibling);

    height = clone.clientHeight;
    obj.parentElement.removeChild(clone);
    return height;
  };


  var _setToggleSvgTitle = function(toggle) {
    var title = toggle.getElementsByTagName("title");
    if (title && title[0]) {
      title[0].innerHTML = _isExpanded(toggle) ? "Hide" : "Show";
    }
  };


  var _openCloseToggleTarget = function (toggle, target, isExpanded) {
    toggle.setAttribute("aria-expanded", !isExpanded);
    _setToggleMaxHeight(target);
    window.requestAnimationFrame(function(){
      target.setAttribute("aria-hidden", isExpanded);
    });
    _setToggleSvgTitle(toggle);
  };

  var _setToggleMaxHeight = function (target) {
    if (_isExpanded(target)) {
    } else {
      target.style.maxHeight = _getHiddenObjectHeight(target) + "px";
    }
  };

  var _toggleClicked = function (event) {

    var toggle = event.target;
    var target;
    var isExpanded;

    if (toggle) {

      // To prevent children bubbling up to parent causing more than one click event
      event.stopPropagation();

      target = document.getElementById(toggle.getAttribute("aria-controls"));
      if (target) {
        isExpanded = _isExpanded(toggle);
        _openCloseToggleTarget(toggle, target, isExpanded);
      }
    }
  };


  var _addToggleListeners = function (toggle) {
    toggle.addEventListener("click", _toggleClicked, false);

  };

  var _setUpToggle = function (toggle) {
    var btn = document.createElement("button");
    
    btn.className = btnClass;
    btn.innerHTML = toggle.innerHTML;
    btn.setAttribute("aria-expanded", false);
    btn.setAttribute("id", attrName + internalId++);
    btn.setAttribute("aria-controls", toggle.getAttribute(dataAttr));

    toggle.innerHTML = "";
    toggle.appendChild(btn);
    
    return btn;
  };

  var _setUpToggleParent = function (toggle) {
    var parent = toggle.parentElement;
    if (parent && !parent.className.match(attrName + "container")) {
      parent.className += " " + attrName + "container";
    }
  };


  var _addToggleSVG = function (toggle) {
    var clone = toggle.cloneNode(true);
    if (!clone.innerHTML.match("svg")) {

      clone.innerHTML += "<svg role=presentational class=" + dataAttr.replace("data-", "") + "-svg-plus><title>Show</title><use class=\"use-plus\" xlink:href=\"#icon-vert\" /><use xlink:href=\"#icon-hori\"/></svg>";
        toggle.parentElement.replaceChild(clone, toggle);
    }
    return clone;
  };


  var _setUpTargetAria = function (toggle, target) {
    target.setAttribute("aria-hidden", !_isExpanded(toggle));
    target.setAttribute("aria-labelledby", toggle.id);
  };


  var _resetAllTargetsMaxHeight = function () {
    var toggles = document.querySelectorAll("[" + dataAttr + "]");
    var i = toggles.length;
    var target;
    while (i--) {
      target = document.getElementById(toggles[i].getAttribute(dataAttr));
      if (target) {
        target.style.maxHeight = _getHiddenObjectHeight(target) + "px";
      }
    }
  };


  var isMustardCut = function () {
    return (document.querySelectorAll && document.addEventListener);
  };


  var _openIfRequired = function (toggle, target) {
    
    var fragmentId = window.location.hash.replace("#", "");
    
    if (toggle.parentElement.hasAttribute(dataExpandAttr)) {
      setTimeout(function () {
        _openCloseToggleTarget(toggle, target, _isExpanded(toggle));
      }, 500);
    }
    

    // Check url fragment and if target ID matches, open it
    if (target.id === fragmentId) {
      setTimeout(function () {
        _openCloseToggleTarget(toggle, target, false);
        toggle.focus();
      }, 1000);
    }

  };


  var addSingleToggleTarget = function (toggleParent) {

    var targetId = toggleParent.getAttribute(dataAttr);
    var target = document.getElementById(targetId);
    var toggle;

    if (target && isMustardCut) {
      toggle = _setUpToggle(toggleParent);
      _setUpToggleParent(toggleParent);
      toggle = _addToggleSVG(toggle);
      _setUpTargetAria(toggle, target);
      _addToggleListeners(toggle);
      _openIfRequired(toggle, target);
    }
  };


  var addToggles = function () {

    var togglesMap = $("[" + dataAttr + "]").reduce(function (temp, toggleParent) {
      addSingleToggleTarget(toggleParent);
      return true;
    }, {});

    return true;
  };


  if (isMustardCut) {
    window.addEventListener("load", addToggles, false);

    window.addEventListener("resize", debounce(_resetAllTargetsMaxHeight, 500), false);
  }


  return {
    add: addSingleToggleTarget
  };


}(window, document, debounce));