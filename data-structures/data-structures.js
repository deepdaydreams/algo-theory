//*******************************************************************************//
//Stack
//*******************************************************************************//
//Create SVG

//2 different data arrays
//Hack to make 
var array = [-1, -1, -1, -1, -1]; //start small for now

//globals
var dataIndex=1;
var xBuffer=50;
var yBuffer=100;
var lineLength=200;
var countStack = 0;
var arrStart = 0;
var arrEnd = 0;


//create main svg element
var svgDoc = d3.select("#queue")
	.append("svg")

var containerCoin = svgDoc.append('g')
	.attr("width", 400)
	.attr("height", 200);

//create basic circles
containerCoin.selectAll("circle")
	.data(array)
	.enter()
	.append("circle")
	.attr("cx",function(d,i){
		//var spacing = lineLength/(eval("dataArray"+dataIndex).length);
		var spacing = lineLength/(arrEnd - arrStart + 1); //padding is helpful
		return xBuffer+(i*spacing)
	})
	.attr("cy",yBuffer)
	.attr("r",function(d,i){ 
		if (d === -1) return 0;
		else return d;
	})
	.attr('fill', 'teal');

//button to swap over datasets
$('#enqueue').click(function() {
	//select new data
	if (arrEnd - arrStart >= array.length) {
		return; //this means the array is full
	}
	while (array[arrEnd % (array.length)] >= 0) {
		arrStart += 1;
		arrEnd += 1;
	}
	array[arrEnd % (array.length)] = 20;
	
	//rejoin data
	var circle = containerCoin.selectAll("circle")
		.data(array);

	//update all circles to new positions
	circle.transition()
		.duration(500)
		.attr("cx",function(d,i){
			var mod = (i - arrStart) % array.length;
			if (mod < 0) mod += array.length;
			return xBuffer + mod *50;
		})
		.attr("cy",yBuffer)
		.attr("r",function(d,i){
			var mod = i;
			if (mod < 0) mod += array.length;
			var temp = array[mod];
			if (temp < 0) return 0;
			else return temp;
		})
	arrEnd += 1;
});//end click function

//Flip once

$('#dequeue').click(function() {
	var circle = containerCoin.selectAll("circle")
		.data(array);

	if (arrEnd - arrStart <= 0) {
		return; //too small
	}

	//update all circles to new positions
	//NOTE TO SELF: in order for this to work properly, the references have to be
	//correct. Hence the real solution is to use an array as a queue in secret. 
	arrStart += 1;
	circle.transition()
		.duration(500)
		.attr("cx",function(d,i){
			var mod = (i - arrStart) % array.length;
			if (mod < 0) mod += array.length;
			if (mod === array.length - 1) return xBuffer; //delete first in place
			return xBuffer + mod *50;
		})
		.attr("cy",yBuffer)
		.attr("r",function(d,i){
			if (i === (arrStart - 1 + array.length) % array.length) {
				array[i] = -1;
			}
			return array[i] < 0 ? 0 : array[i];
		});
});

//*******************************************************************************//
//Stack
//*******************************************************************************//

var stack = [-1,-1,-1,-1,-1];
var stackSize = 0;

var svgStack = d3.select("#plotDie")
	.append("svg")

var containerStack = svgStack.append('g')
	.attr("width", 400)
	.attr("height", 200);

containerStack.selectAll("circle")
	.data(stack)
	.enter()
	.append("circle")
	.attr("cx",function(d,i){
		//var spacing = lineLength/(eval("dataArray"+dataIndex).length);
		var spacing = lineLength/(stack.length + 1); //padding is helpful
		return xBuffer+(i*spacing)
	})
	.attr("cy",yBuffer)
	.attr("r",function(d,i){ return 0;
	})
	.attr('fill', 'red');

$('#rollOne').click(function() {
	if (stackSize >= 5) return; //too large
	stack[stackSize] = 20; //preset size
	var circle = containerStack.selectAll("circle")
		.data(stack);

	//update all circles to new positions
	circle.transition()
		.duration(500)
		.attr("cx",function(d,i){
			var spacing = lineLength/(stackSize + 1); //padding is helpful
			return xBuffer+(i*spacing)
		})
		.attr("cy",yBuffer)
		.attr("r",function(d,i){
			if (d < 0) return 0;
			return d;
		})
		.attr('fill', 'turquoise');
	stackSize += 1;
});

$('#rollHundred').click(function() {
	if (stackSize <= 0) return; //empty stack
	stackSize -= 1;
	stack[stackSize] = -1;
	var circle = containerStack.selectAll("circle")
		.data(stack);

	//update all circles to new positions
	circle.transition()
		.duration(500)
		.attr("cx",function(d,i){
			var spacing = lineLength/(stackSize + 1); //padding is helpful
			return xBuffer+(i*spacing)
		})
		.attr("cy",yBuffer)
		.attr("r",function(d,i){
			if (d < 0) return 0;
			return d;
		})
		.attr('fill', 'turquoise');
});


//*******************************************************************************//
//Heap visualization
//*******************************************************************************//

/*
var treeData =
  {
    "name": 1,
    "children": [
      {
        "name": 2,
        "children": [
          { "name": 4},
          { "name": 5}
        ]
      },
      { "name": 3}
    ]
  };
*/

var treeData = {
	"name":1
}

// Set the dimensions and margins of the diagram
var margin = {top: 20, right: 90, bottom: 30, left: 90},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#estSvg").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate("
          + margin.left + "," + margin.top + ")");

var i = 0,
    duration = 750,
    root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);

var heap = [{}];

// Assigns parent, children, height, depth
root = d3.hierarchy(treeData, function(d) { return d.children; });
root.x0 = height / 2;
root.y0 = 0;
heap.push(root);

// Collapse after the second level
//root.children.forEach(collapse);
var treeArr = [{'name':1, 'id':1}];

update(root);

// Collapse the node and all it's children
function collapse(d) {
  if(d.children) {
    d._children = d.children
    d._children.forEach(collapse)
    d.children = null
  }
}

function update(source) {

  // Assigns the x and y position for the nodes
  var treeData = treemap(root);

  // Compute the new tree layout.
  var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

  // Normalize for fixed-depth.
  // Change y so that it reflects heap locations.
  nodes.forEach(function(d){ d.y = d.depth * 180;});

  // ****************** Nodes section ***************************

  // Update the nodes...
  var node = svg.selectAll('g.node')
      .data(nodes, function(d) {return d.id || (d.id = ++i); });

  // Enter any new modes at the parent's previous position.
  // Add id for each to make data retrieval easier
  var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", function(d) {
        return "translate(" + source.x0 + "," + source.y0 + ")";
      })
	  .attr('id', function(d){ return 'node' + d.id;})
      .on('click', insertChild)
      .on('contextmenu', removeNode);

  // Add Circle for the nodes
  nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style("fill", function(d) {
          return d._children ? "lightsteelblue" : "#fff";
      });

  // Add labels for the nodes
  nodeEnter.append('text')
      .attr("dy", ".35em")
      .attr("x", function(d) {
          return d.children || d._children ? -13 : 13;
      })
      .attr("text-anchor", function(d) {
          return d.children || d._children ? "end" : "start";
      })
      .text(function(d) { return d.data.name; });

  // UPDATE
  var nodeUpdate = nodeEnter.merge(node);

  // Transition to the proper position for the node
  nodeUpdate.transition()
    .duration(duration)
    .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
     });

  // Update the node attributes and style
  nodeUpdate.select('circle.node')
    .attr('r', 10)
    .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
    })
    .attr('cursor', 'pointer');


  // Remove any exiting nodes
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
          return "translate(" + source.x + "," + source.y + ")";
      })
      .remove();

  // On exit reduce the node circles size to 0
  nodeExit.select('circle')
    .attr('r', 1e-6);

  // On exit reduce the opacity of text labels
  nodeExit.select('text')
    .style('fill-opacity', 1e-6);

  // ****************** links section ***************************

  // Update the links...
  var link = svg.selectAll('path.link')
      .data(links, function(d) { return d.id; });

  // Enter any new links at the parent's previous position.
  var linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .attr('d', function(d){
        var o = {x: source.x0, y: source.y0}
        return diagonal(o, o)
      });

  // UPDATE
  var linkUpdate = linkEnter.merge(link);

  // Transition back to the parent element position
  linkUpdate.transition()
      .duration(duration)
      .attr('d', function(d){ return diagonal(d, d.parent) });

  // Remove any exiting links
  var linkExit = link.exit().transition()
      .duration(duration)
      .attr('d', function(d) {
        var o = {x: source.x, y: source.y}
        return diagonal(o, o)
      })
      .remove();

  // Store the old positions for transition.
  nodes.forEach(function(d){
    d.x0 = d.x;
    d.y0 = d.y;
  });

  // Creates a curved (diagonal) path from parent to the child nodes
  function diagonal(s, d) {

    path = `M ${s.x} ${s.y}
            C ${(s.x + d.x) / 2} ${s.y},
              ${(s.x + d.x) / 2} ${d.y},
              ${d.x} ${d.y}`

    return path
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

}

function swapWithParent(node, ind, callback1, callback2) {
//stop if preconditions met
if ((node.parent === undefined) || (node.parent === null)) {
	return; 
}
if (ind === 1) return; //too small, should NOT swap
//swap actual names
var temp = node.data.name;
node.data.name = node.parent.data.name;
node.parent.data.name = temp;
//animate swap
svg.selectAll('#node' + node.parent.id)
	  .transition()
	  .duration(500)
	  .attr("transform", function(d) {
		return "translate(" + node.x + "," + node.y + ")";
	  })
	  .transition()
	  .duration(0)
	  .attr("transform", function(d) {
		return "translate(" + d.x + "," + d.y + ")";
	  }).on('end', function(d) {
		//console.log(this.selectAll('text'));
		d3.select(this).select('text').text(d.data.name); // = 'foo';
		if (callback1) callback1(d, Math.floor(ind/2)); //do something with parent nodes
	  });
svg.selectAll('#node' + node.id)
	  .transition()
	  .duration(500)
	  .attr("transform", function(d) {
		return "translate(" + d.parent.x + "," + d.parent.y + ")";
	  })
	  .transition()
	  .duration(0)
	  .attr("transform", function(d) {
		return "translate(" + d.x + "," + d.y + ")";
	  }).on('end', function(d) {
		//this.get('text').text = d.name;
		//console.log(this.selectAll('text'));
		d3.select(this).select('text').text(d.data.name); 
		if (callback2) callback2(d, ind); //do something with parent nodes
	  });
		
//actual data swap
//update(d);
}
  
var nNodes = 1;
function insertChild(d) {
  var selected = d;
   //Adding a new node (as a child) to selected Node (code snippet)
	var newNode = {
		name: Math.floor(Math.random() * 500),
		children: []
	  };
  //Creates a Node from newNode object using d3.hierarchy(.)
  var newNode = d3.hierarchy(newNode);

  //later added some properties to Node like child,parent,depth
  newNode.depth = selected.depth + 1;
  newNode.height = selected.height - 1;
  newNode.parent = selected;
  //newNode.id = nNodes;
  nNodes += 1;

  //Selected is a node, to which we are adding the new node as a child
  //If no child array, create an empty array
  if(!selected.children){
    selected.children = [];
    selected.data.children = [];
  }

  //Push it to parent.children array
  selected.children.push(newNode);
  selected.data.children.push(newNode.data);


  //Update tree
  update(selected);
  return newNode;
}

function removeNode(d) {
	 //make new set of children
	 var children = [];
	 //iterate through the children 
	 d.parent.children.forEach(function(child){
	   if (child.id != d.id){
		 //add to teh child list if target id is not same 
		 //so that the node target is removed.
		 children.push(child);
	   }
	 });
	 //set the target parent with new set of children sans the one which is removed
	 if (children.length === 0) {
		children = null;
	 }
	 d.parent.children = children;
	nNodes -= 1;
	 //redraw the parent since one of its children is removed
	 update(d.parent)
}

//Code for buttons
//What would help is to have some internal notion of tree going
//Alternatively, always go to the rightmost node
$('#insertHeap').click(function() {
	//console.log(heap);
	var newNode = insertChild(heap[Math.floor((heap.length) / 2)]);
	heap.push(newNode);
	var callback1 = function(d, ind) {
		if ((d.parent) && (d.data.name > d.parent.data.name)) {
			swapWithParent(d, ind, callback1, null);
		}
	};
	callback1(newNode, heap.length - 1);
	//console.log(heap);
});

$('#extractHeap').click(function() {
	//remove last element
	if (nNodes === 1) return; //stop at single node left (TODO bug to fix)
	var lastNode = heap.pop();
	var nodeNum = lastNode.data.name;
	removeNode(lastNode);
	//Put last element as first and swap down
	heap[1].data.name = nodeNum;
	var callback2 = function(d, ind) { 
		//swap with single child if that's all that exists
		if (!d.children) {
			return;
		} else if (d.children.length === 1) {
			if (d.children[0].data.name < d.data.name) return;
			swapWithParent(d.children[0], ind * 2, null, callback2);
		} else {
		//otherwise choose maximum of two children to swap with
			if (d.children[0].data.name > d.children[1].data.name) {
				if (d.children[0].data.name < d.data.name) return;
				swapWithParent(d.children[0], ind * 2, null, callback2);
			} else {
				if (d.children[1].data.name < d.data.name) return;
				swapWithParent(d.children[1], ind * 2 + 1, null, callback2);
			}
		} 
	}
	callback2(heap[1], 1);
	//console.log(heap);
});
