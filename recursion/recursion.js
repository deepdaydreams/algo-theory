//*******************************************************************************//
//Random Variable
//*******************************************************************************//
//Adapted from: https://bl.ocks.org/mbostock/5249328
//              http://bl.ocks.org/mbostock/7833311

var treeData = [
  { 
    'name': 'F5',
    'parent': 'null',
    'children': [
    {
      "name": "F4",
      "parent": "null",
      "children": [
        {
          "name": "F3",
          "parent": "F4",
          "children": [
            {
              "name": "F2",
              "parent": "F3",
              "children": [
                {
                  "name": "F1",
                  "parent": "F2"
                },
                {
                  "name": "F0",
                  "parent": "F2"
                }
              ]
            },
            {
              "name": "F1",
              "parent": "F3"
            }
        ]
        },
        {
          "name": "F2",
          "parent": "F4",
          "children": [
            {
              "name": "F1",
              "parent": "F2"
            },
            {
              "name": "F0",
              "parent": "F2"
            }
          ]
        },
      ]
    }, {
          "name": "F3",
          "parent": "F5",
          "children": [
            {
              "name": "F2",
              "parent": "F3",
              "children": [
                {
                  "name": "F1",
                  "parent": "F2"
                },
                {
                  "name": "F0",
                  "parent": "F2"
                }
              ]
            },
            {
              "name": "F1",
              "parent": "F3"
            }
        ]
        }
    ]
 }
];


// ************** Generate the tree diagram	 *****************
var margin = {top: 20, right: 120, bottom: 20, left: 120},
	width = 960 - margin.right - margin.left,
	height = 500 - margin.top - margin.bottom;

var i = 0,
	duration = 750,
	root;

var tree = d3.layout.tree()
	.size([height, width]);

var diagonal = d3.svg.diagonal()
	.projection(function(d) { return [d.x, d.y]; });

var svg = d3.select("#svgRV").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
  .append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = treeData[0];
root.x0 = height / 2;
root.y0 = 0;

function toggleAll(d) {
    if (d.children) {
        if (d.name !== "green") {
            d._children = d.children;
            d._children.forEach(toggleAll);
            d.children = null;
        }
        else
            d.children.forEach(toggleAll);
    }
}

//root.children.forEach(toggleAll);
//toggleAll(root);

update(root, 0);

d3.select(self.frameElement).style("height", "500px");

function update(source, delayTime) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
	  links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 100; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
	  .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
	  .attr("class", "node")
	  .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
	  .on("click", click);

  nodeEnter.append("circle")
	  .attr("r", 1e-6)
      .attr("id",function(d){return "node-dfs-"+d.id})
	  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("text")
	  .attr("y", function(d) { return d.children || d._children ? -13 : 13; })
	  .attr("dy", ".35em")
	  .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
	  .text(function(d) { return d.name; })
	  .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
	  .duration(duration)
      .delay(delayTime)
	  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  nodeUpdate.select("circle")
	  .attr("r", 10)
	  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
	  .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
	  .duration(duration)
      .delay(delayTime)
	  .attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })
	  .remove();

  nodeExit.select("circle")
	  .attr("r", 1e-6);

  nodeExit.select("text")
	  .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
	  .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
	  .attr("class", "link")
	  .attr("d", function(d) {
		var o = {x: source.x0, y: source.y0};
		return diagonal({source: o, target: o});
	  });

  // Transition links to their new position.
  link.transition()
	  .duration(duration)
      .delay(delayTime)
	  .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
	  .duration(duration)
      .delay(delayTime)
	  .attr("d", function(d) {
		var o = {x: source.x, y: source.y};
		return diagonal({source: o, target: o});
	  })
	  .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
	d.x0 = d.x;
	d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (d.children) {
	d._children = d.children;
	d.children = null;
  } else {
	d.children = d._children;
	d._children = null;
  }
  update(d);
}

//TODO: update so that all children are toggled beforehand
// Do a dynamic programming style traversal through the tree as a test
function visitElementDfs(element,animX){
 // d3.select("#node-"+element.id).classed("visited",true);
  d3.select("#node-dfs-"+element.id)
    .transition().duration(animDuration).delay(animDuration*animX)
    .style("fill","red").style("stroke","red");
}

function dft(){
  var stack=[];
  var animX=0;
  stack.push(root);
  while(stack.length!==0){
    var element = stack.pop();
    visitElementDfs(element,animX);
    animX=animX+1;
    if(element.children!==undefined){
      for(var i=0; i<element.children.length; i++){
        stack.push(element.children[element.children.length-i-1]);
      }
    }
  }
}

dft();

 

//*******************************************************************************//
//Discrete and Continuous
//*******************************************************************************//
//Constants

var colors = ['#743720','#874D37','#826B42','#90A369','#ABBF83'];
var colorrange = d3.scale.linear().domain([1,3,5,7,9]).range(colors);

var marginRecur = {top: 20, right: 10, bottom: 20, left: 10};
var vizWidth = $('#graphDist').width();
var widthRecur = vizWidth - marginRecur.left - marginRecur.right,
    heightRecur = 500 - marginRecur.top - marginRecur.bottom;
var svgRecur = d3.select('#graphDist').append('svg')
  .attr('width', widthRecur + marginRecur.left + marginRecur.right)
  .attr('height', heightRecur + marginRecur.top + marginRecur.bottom)
.append('g')
  .attr('transform', 'translate(' + (widthRecur/2 - 40) + ',' + (heightRecur - 100) + ')')
  .attr('class', 'rect-1');

var squareSide = 100;
var data = [{w: squareSide, h: squareSide, tx: 0, ty: 0, r: 0}];

//add the first square
var rects = svgRecur.selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('height', function(d) {return d.w})
  .attr('width', function(d) {return d.h})
  .attr('transform', function(d) { return 'rotate(' + d.r + ') translate(' + d.tx + ',' + d.ty + ')'})
  .attr('fill', colorrange(1));

var rectIndex = 1;
var addSquares = function(){
  var data = d3.selectAll('.rect-' + rectIndex + ' rect').data();
  var rectColor = colorrange(rectIndex + 1);

  data.forEach(function(rectangle){
    var s0 = rectangle;
    var s1 = {};
    var s2 = {};

    s1.w = s0.w/(Math.sqrt(2));
    s1.h = s0.h/(Math.sqrt(2));
    s1.tx = -(s0.h/2);
    s1.ty = -(s0.h/2);
    s1.r = -45;

    s2.w = s1.w;
    s2.h = s1.h;
    s2.tx = s0.h;
    s2.ty = -s0.h;
    s2.r = 45;

    var newData = [];
    newData.push(s1, s2);

    var rectGroup = d3.selectAll('.rect-' + rectIndex).selectAll('g')
      .data(newData)
      .enter()
      .append('g')
      .attr('class', 'rect-' + (rectIndex + 1))
      .attr('transform', function(d) { return 'translate(' + d.tx + ',' + d.ty + ') rotate(' + d.r + ')';})
      .append('rect')
      .attr('fill', 'white')
      .transition()
      .duration(500)
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', function(d) {return d.w})
      .attr('width', function(d) {return d.h})
      .attr('fill', rectColor);
    })

    rectIndex ++;
  }

  $('#grow').click(function() {
    if (rectIndex <= 10) {
      addSquares();
    } else {
      $('#grow').addClass('disable');
    }
  });

//*******************************************************************************//
//Dynamic Programming
//*******************************************************************************//

var treeData = [{children:[{children:[{},{},{}]},{children:[{children:[{}]}]},{},{children:[{},{children:[{},{}]}]}]}];

//http://bl.ocks.org/d3noob/8326869
var margin = {top: 20, right: 0, bottom: 20, left: 0},
  width = document.getElementById("dfs-container").offsetWidth - margin.right - margin.left,
  height = document.getElementById("dfs-container").offsetHeight - margin.top - margin.bottom;

var i=0, animDuration=500,root;

var treeDfs = d3.layout.tree()
  .size([height, width]);


// https://github.com/wbkd/d3-extended
d3.selection.prototype.moveToFront = function() {  
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

var svgDfs = d3.select("#dfs-container").append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
/*
rootDfs= treeData[0];
updateDfs(treeData[0]);

function resetTraversalDfs(root){
  //d3.selectAll(".node").classed("visited",false);
  d3.selectAll(".nodeDfs")
    .transition().duration(animDuration)
    .style("fill","#fff")
    .style("stroke","steelblue");

}

function updateDfs(root) {



  resetTraversalDfs(root);

  // Compute the new tree layout.
  var nodes = treeDfs.nodes(root).reverse(),
    links = treeDfs.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth *100; });

  // Declare and append the nodes
  var nodeWrapper = svgDfs.append("g").attr("id","nodesDfs").selectAll("g.node")
    .data(nodes, function(d) {return d.id || (d.id = ++i); })
    .enter().append("circle")
    .attr("class", "nodeDfs")
    //Root is the highest ID
    .attr("id",function(d){return "node-dfs-"+d.id})
    .attr("cx",function(d){return d.x;})
    .attr("cy",function(d){return d.y;})
    .attr("r", 10);

  nodeWrapper.append('text').text(3).attr('fill', 'teal');

  // Declare and append the links
  //line elements are not containers; adding a text element to a line will be ignored.
  var link = svgDfs.append("g").attr("id","links").selectAll("path.link")
    .data(links, function(d) { return d.target.id; })
    .enter()
    .append('g')
    .attr('class', 'link');

  link.append('line')
    .attr("id",function(d){
      return d.source.id +"->"+ d.target.id;
    })
    .attr('x1', function(d){return d.source.x;})
    .attr('x2',function(d){return d.target.x;})
    .attr('y1',function(d){return d.source.y;})
    .attr('y2',function(d){return d.target.y;});

    //.attr('transform', 'translate(0,0)')
  link.append('text')
    .attr('class', 'linkLabel')
    .attr("x", function(d){return (d.source.x + d.target.x)/2;})
    .attr("y", function(d){return (d.source.y + d.target.y)/2;})
    .text(function(d) {return d.target.id;});

  //Styling consideration
  d3.select("#nodesDfs").moveToFront();
  //d3.select(".linkLabel").moveToFront();

}
  */

function visitElementDfs(element,animX, color){
 // d3.select("#node-"+element.id).classed("visited",true);
  d3.select("#node-dfs-"+element.id)
    .transition().duration(animDuration).delay(animDuration*animX)
    .style("fill",color).style("stroke",color);
}

visited = {}

function dftDfs(){
  var stack=[];
  var animX=0;
  stack.push(root);
  while(stack.length!==0){
    var element = stack.pop();
    if (visited.hasOwnProperty(element.name)) {
      toggleAll(element); //proof of concept
      fillAll(element, animX, 'purple')
      //visitElementDfs(element,animX, 'red');
      update(element, animX * 500);
      animX=animX+1;
      continue;
    } else {
      visited[element.name] = element.id; //add to dictionary
    }
    visitElementDfs(element,animX, 'red');
    animX=animX+1;
    if((element.children!==undefined) && (element.children !== null)){
      for(var i=0; i<element.children.length; i++){
        stack.push(element.children[element.children.length-i-1]);
      }
    }
  }
}

function fillAll(d, time, color) {
  visitElementDfs(d, time, color);
  if (d.children) {
    for (var i = 0; i < d.children.length; i++) {
      console.log(d.children[i]);
      fillAll(d.children[i], time, color);
    }
  }
}

$('#rundfs').click(function() {
  dftDfs();
});

$('#resetdfs').click(function() {
  resetTraversalDfs();
});


