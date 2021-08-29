//Handles functionality of Compound Probability
$(window).load(function () {
  //drawCP();
  //drawComb();
  //drawSet();
});

//Handles Window Resize
$(window).on("resize", function () {
  //drawCP();
  //drawComb();
  //drawSet();
});

//*******************************************************************************//
//Breadth First Search
//Citation: https://bl.ocks.org/mph006/7e7d7f629de75ada9af5
//*******************************************************************************//
var treeData = [{children:[{children:[{},{},{}]},{children:[{children:[{}]}]},{},{children:[{},{children:[{},{}]}]}]}];

//http://bl.ocks.org/d3noob/8326869
var margin = {top: 20, right: 0, bottom: 20, left: 0},
  width = document.getElementById("bfs-container").offsetWidth - margin.right - margin.left,
  height = document.getElementById("bfs-container").offsetHeight - margin.top - margin.bottom;

var i=0, animDuration=500,root;

var treeBfs = d3.layout.tree()
  .size([height, width]);


// https://github.com/wbkd/d3-extended
d3.selection.prototype.moveToFront = function() {  
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

var svgBfs = d3.select("#bfs-container").append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
rootBfs= treeData[0];
updateBfs(treeData[0]);

function resetTraversalBfs(root){
  //d3.selectAll(".node").classed("visited",false);
  d3.selectAll(".nodeBfs")
    .transition().duration(animDuration)
    .style("fill","#fff")
    .style("stroke","steelblue");

}

function updateBfs(root) {

  resetTraversalBfs(root);

  // Compute the new tree layout.
  var nodes = treeBfs.nodes(root).reverse(),
    links = treeBfs.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth *100; });

  // Declare and append the nodes
  var nodeWrapper = svgBfs.append("g").attr("id","nodesBfs").selectAll("g.node")
    .data(nodes, function(d) {return d.id || (d.id = ++i); })
    .enter().append("circle")
    .attr("class", "nodeBfs")
    //Root is the highest ID
    .attr("id",function(d){return "node-bfs-"+d.id})
    .attr("cx",function(d){return d.x;})
    .attr("cy",function(d){return d.y;})
    .attr("r", 10);

  // Declare and append the links
  var linkWrapper = svgBfs.append("g").attr("id","links").selectAll("path.link")
    .data(links, function(d) { return d.target.id; })
    .enter()
    .append("line", "g")
    .attr("class", "link")
    .attr("id",function(d){
      return d.source.id +"->"+ d.target.id;
    })
    .attr('x1', function(d){return d.source.x;})
    .attr('x2',function(d){return d.target.x;})
    .attr('y1',function(d){return d.source.y;})
    .attr('y2',function(d){return d.target.y;});

  //Styling consideration
  d3.select("#nodesBfs").moveToFront();

}
function visitElementBfs(element,animX){
 // d3.select("#node-"+element.id).classed("visited",true);
  d3.select("#node-bfs-"+element.id)
    .transition().duration(animDuration).delay(animDuration*animX)
    .style("fill","red").style("stroke","red");
}

function bft(){
  var queue=[];
  var animX=0;
  queue.push(rootBfs);
  while(queue.length!==0){
    var element = queue.shift();
    visitElementBfs(element,animX);
    animX= animX+1;
    if(element.children!==undefined){
      for(var i=0; i<element.children.length; i++){
        queue.push(element.children[i]);
      }
    }
  }
}

$('#runbfs').click(function() {
  bft();
});

$('#resetbfs').click(function() {
  resetTraversalBfs();
});


//*******************************************************************************//
//Depth First Search
//*******************************************************************************//
//
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
  /*
  link.append('text')
    .attr('class', 'linkLabel')
    .attr("x", function(d){return (d.source.x + d.target.x)/2;})
    .attr("y", function(d){return (d.source.y + d.target.y)/2;})
    .text(function(d) {return d.target.id;});
  */

  //Styling consideration
  d3.select("#nodesDfs").moveToFront();
  //d3.select(".linkLabel").moveToFront();

}
function visitElementDfs(element,animX){
 // d3.select("#node-"+element.id).classed("visited",true);
  d3.select("#node-dfs-"+element.id)
    .transition().duration(animDuration).delay(animDuration*animX)
    .style("fill","red").style("stroke","red");
}

function dft(){
  var stack=[];
  var animX=0;
  stack.push(rootDfs);
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

$('#rundfs').click(function() {
  dft();
});

$('#resetdfs').click(function() {
  resetTraversalDfs();
});


//*******************************************************************************//
//Dijkstra's Algorithm
//*******************************************************************************//
var treeData = [{children:[{children:[{},{},{}]},{children:[{children:[{}]}]},{},{children:[{},{children:[{},{}]}]}]}];

//http://bl.ocks.org/d3noob/8326869
var margin = {top: 20, right: 0, bottom: 20, left: 0},
  width = document.getElementById("dijkstra-container").offsetWidth - margin.right - margin.left,
  height = document.getElementById("dijkstra-container").offsetHeight - margin.top - margin.bottom;

var i=0, animDuration=500,root;

var treeDijkstra = d3.layout.tree()
  .size([height, width]);


// https://github.com/wbkd/d3-extended
d3.selection.prototype.moveToFront = function() {  
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

var svgDijkstra = d3.select("#dijkstra-container").append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
rootDijkstra= treeData[0];
updateDijkstra(treeData[0]);

function resetTraversalDijkstra(root){
  //d3.selectAll(".node").classed("visited",false);
  d3.selectAll(".nodeDijkstra")
    .transition().duration(animDuration)
    .style("fill","#fff")
    .style("stroke","steelblue");

}

function updateDijkstra(root) {



  resetTraversalDijkstra(root);

  // Compute the new tree layout.
  var nodes = treeDijkstra.nodes(root).reverse(),
    links = treeDijkstra.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth *100; });

  // Declare and append the nodes
  var nodeWrapper = svgDijkstra.append("g").attr("id","nodesDijkstra").selectAll("g.node")
    .data(nodes, function(d) {return d.id || (d.id = ++i); })
    .enter().append("circle")
    .attr("class", "nodeDijkstra")
    //Root is the highest ID
    .attr("id",function(d){return "node-dijkstra-"+d.id})
    .attr("cx",function(d){return d.x;})
    .attr("cy",function(d){return d.y;})
    .attr("r", 10);

  nodeWrapper.append('text').text(3).attr('fill', 'teal');

  // Declare and append the links
  //line elements are not containers; adding a text element to a line will be ignored.
  var link = svgDijkstra.append("g").attr("id","links").selectAll("path.link")
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
  d3.select("#nodesDijkstra").moveToFront();
  //d3.select(".linkLabel").moveToFront();

}
function visitElementDijkstra(element,animX, color){
 // d3.select("#node-"+element.id).classed("visited",true);
  d3.select("#node-dijkstra-"+element.id)
    .transition().duration(animDuration).delay(animDuration*animX)
    .style("fill",color).style("stroke",color);
}

function dijkstra(){
  var pq = new PriorityQueue((a,b) => a[0] < b[0]);
  var animX=0;
  var visited = {};
  pq.push([0, rootDijkstra]);
  while(!pq.isEmpty()){
    //console.log(visited);
    let [priority, element] = pq.pop();
    visitElementDijkstra(element,animX, 'red');
    if (visited.hasOwnProperty(element.id)) {
      continue; //already seen element
    }
    visited[element.id] = priority;
    if(element.children!==undefined){
      for(var i=0; i<element.children.length; i++){
        var curChild = element.children[element.children.length-i-1];
        pq.push([priority + curChild.id, curChild]);
        visitElementDijkstra(curChild,animX,'pink');
      }
    }
    animX=animX+2;
  }
}

var dijkstraRun = false;
$('#rundijkstra').click(function() {
  if (dijkstraRun) return;
  dijkstraRun = true;
  dijkstra();
});

$('#resetdijkstra').click(function() {
  dijkstraRun = false;
  resetTraversalDijkstra();
});

//Extra code which implements a priority queue
//https://stackoverflow.com/questions/42919469/efficient-way-to-implement-priority-queue-in-javascript
const parent = i => ((i + 1) >>> 1) - 1;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;

class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
    this._top = 0;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  peek() {
    return this._heap[this._top];
  }
  push(...values) {
    values.forEach(value => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > this._top) {
      this._swap(this._top, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  replace(value) {
    const replacedValue = this.peek();
    this._heap[this._top] = value;
    this._siftDown();
    return replacedValue;
  }
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > this._top && this._greater(node, parent(node))) {
      this._swap(node, parent(node));
      node = parent(node);
    }
  }
  _siftDown() {
    let node = this._top;
    while (
      (left(node) < this.size() && this._greater(left(node), node)) ||
      (right(node) < this.size() && this._greater(right(node), node))
    ) {
      let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}
