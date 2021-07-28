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

var treeData = [
  {
    "name": 135,
    "parent": "null",
	"id": 1,
    "children": [
      {
        "name": 246,
        "parent": 1,
		"id": 2, 
        "children": [
          {
            "name": 468,
            "parent": 2, 
        	"id": 4, 
          },
          {
            "name": 579,
            "parent": 2, 
        	"id": 5, 
          }
        ]
      },
      {
        "name": 357,
        "parent": 1,
        "id": 3, 
      }
    ]
  }
];
//for a heap, we can represent the nodes two different ways: using an array
//and also in the more visually appealing max heap tree
//Note that with the array approach, we can find the first available space
//And then backtrack from there

//var treeData=[{'name': 1, 'parent': 'null'}];
var treeData = [];
var treeArray = [{}]; //keep one empty element in treeArray

// ************** Generate the tree diagram	 *****************
var margin = {top: 20, right: 120, bottom: 20, left: 120},
	width = 960 - margin.right - margin.left,
	height = 500 - margin.top - margin.bottom;

var i = 0,
	duration = 750,
	root = null;

var tree = d3.layout.tree()
	.size([height, width]);

var diagonal = d3.svg.diagonal()
	.projection(function(d) { return [d.x, d.y]; });

var svg = d3.select("#estSvg").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
  .append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

if (treeData.length > 0) {
}

d3.select(self.frameElement).style("height", "500px");

function update(source) {
  if (root === null) {
  }

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
	  links = tree.links(nodes);

  var maxDepth = 0;
  //Find max depth
  nodes.forEach(function(d) { maxDepth = maxDepth > d.depth?maxDepth:d.depth});

  // Normalize for fixed-depth. 
  nodes.forEach(function(d) { d.y = d.depth * 400/(maxDepth + 1); });

  // Update the nodes…
  var node = svg.selectAll("g.node")
	  .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
	  .attr("class", "node")
	  .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
	  .attr("id", function(d) {return 'node' + d.id})
	  .on("click", click)
	  .on("contextmenu", function(d) {swapNodes(d.parent, d);});
  console.log(nodeEnter);

  nodeEnter.append("circle")
	  .attr("r", 1e-6)
	  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("text")
	  .attr("dy", ".35em")
	  .attr("text-anchor", "middle")
	  .text(function(d) { return d.name; })
	  .style("fill-opacity", 1e-6);
	  //.attr("y", function(d) { return d.children || d._children ? -13 : 13; })
	  //.attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  nodeUpdate.select("circle")
	  .attr("r", 15)
	  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
	  .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
	  .duration(duration)
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
	  .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
	  .duration(duration)
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
  /*
  if (d.children) {
	d._children = d.children;
	d.children = null;
  } else {
	d.children = d._children;
	d._children = null;
  }
  */
  d.children = [{'name': d.id * 15, 'id': 2 * d.id}]
  update(d);
}

// Swap parent and child
function swapNodes(node1, node2){
  //console.log(node1, node2);
  var g1 = svg.select("#node" + node1.id);
  var g2 = svg.select("#node" + node2.id);
  //The most important part is to make the text label swap happen. 
  var g1Start = g1.select('text').text();
  var g2Start = g2.select('text').text();
  //https://stackoverflow.com/questions/44495524/d3-transition-not-working-with-events
  //There is an issue here which I don't think I really understand, 
  //Namely the difference between transition and selection listeners.(on vs each)
  g1.select('text').transition()
	.duration(500)
	.attr("transform", "translate(" + (node2.x - node1.x) + ', ' + (node2.y - node1.y) + ')')
	.each('end', function(d) {
		g1.select('text').attr('transform','translate(0, 0)').text(g2Start);
	});
  //g1.select('text').on('click', () => {console.log('hello!')});
  g2.select('text').transition()
	.duration(500)
	.attr("transform", "translate(" + (node1.x - node2.x) + ', ' + (node1.y - node2.y) + ')')
	.each('end', function(d) {
		g2.select('text').attr('transform','translate(0, 0)').text(g1Start);
	});
	
  g1.select('circle').transition()
    .duration(500)
    .attr("transform", "translate(" + (node2.x - node1.x) + ', ' + (node2.y - node1.y) + ')')
	.each('end', function(d) {
		g1.select('circle').attr('transform', 'translate(0,0)');
	});
  g2.select('circle').transition()
    .duration(500)
    .attr("transform", "translate(" + (node1.x - node2.x) + ', ' + (node1.y - node2.y) + ')')
	.each('end', function(d) {
		g2.select('circle').attr('transform', 'translate(0,0)');
	});
  //TODO: make sure the links and nodes reflect this change!!! (update parents and children)
  var temp = node1.name;
  node1.name = node2.name;
  node2.name = temp;
}

var totalNodes = 1;
$('#dropHundred').click(function() { //inserts a node
	//basic idea behind inserting a node:
	//find the node immediately below you based on total # of nodes
	//then adjust until you satisfy the max heap property
	//
	var newNode = {'name': totalNodes, 'parent': Math.trunc(totalNodes/2), 'id': totalNodes};
	if (totalNodes === 1) {
		treeData = [{'name':1, 'parent':'null', 'id': 1}];
		root = treeData[0];
		root.x0 = height / 2;
		root.y0 = 0;
		treeArray = [{}, {'name':1, 'parent':'null', 'id': 1}];
	} else {
		var curNode = treeData[0];
		var cur = 1;
		var curIndex = 1;
		while (cur <= totalNodes) {
			cur *= 2;
		}
		cur = Math.trunc(cur/4); //ignore second leading digit
		//console.log(cur, curNode, totalNodes, cur & totalNodes);
		while (cur > 1) {
			if (!curNode.hasOwnProperty('children')) {
				break; //we can't continue further
			}
			if ((cur & totalNodes) > 0) {
				curNode = curNode.children[1];
				curIndex = curIndex * 2 + 1;
			} else {
				curNode = curNode.children[0];
				curIndex = curIndex * 2;
			}
			cur = Math.trunc(cur/2);
			//console.log(cur, curNode, totalNodes, cur & totalNodes);
		}
		if (curNode.hasOwnProperty('children')) {
			curNode.children.push(newNode);
			curIndex = curIndex * 2 + 1;
		} else {
			curNode.children = [newNode];
			curIndex = curIndex * 2;
		}
		if (curIndex >= treeArray.length) {
			treeArray.push(newNode);
		} else {
			treeArray[curIndex] = newNode; //hopefully this should work??
		}
		//console.log(curIndex, treeArray);
	}
	update(root);
	//obey max heap property
	/*
	if (totalNodes > 1) {
		curNode = newNode;
		console.log(curNode, newNode);
		console.log(treeArray);
		while ((curNode.parent !== 'null') && (curNode.parent.name < curNode.name)) {
			
			console.log('while loop reached');
			swapNodes(curNode.parent, curNode);
			curNode = curNode.parent;
		}
	}
	*/
	totalNodes += 1;
});

 
/*
var textSpacing = 40;
var arrtext = svg.append("g").attr("class", 'arrtext')

arrtext
  .append('text').text('')
  .attr('transform', 'translate(10,20)');

var arrtextg = arrtext.selectAll('.eletext').data(arr).enter().append('g')
      .attr('id', function(d,i){
          return ("artextg" + i);
        })
      .attr('transform', function(d,i){
            var xtran = i * textSpacing + 20;
            var ytran = 20;
            return "translate(" + xtran + ', ' + ytran + ')';
        })
      .attr('x', function(d, i){
              var xtran = i * textSpacing + 20;
              return xtran
            })

arrtextg.append('rect', ':first-child')
      .attr('width', function(d, i){
//          console.log('this = ', this, 'd = ', d)
          return 20
        })
      .attr('height', 20)
      .attr('transform', 'translate(0, -15)')
      .attr('fill', 'none')
      .attr('opacity', .4)
//        .transition(duration * 100)
  //      .attr('fill', 'white')

arrtextg.append('text')
      .text(function(d, i){
      //    console.log(d, i, arr.length);
          return (i === arr.length-1) ? d : (d + ' ');
        })
      .attr('class', 'eletext')
      .attr('id', function(d, i){
            return 'arrText' + i;
      })
      .attr('stroke', 'grey')
      .attr('fill', 'black')


arrtext.append('text').text('')
      .attr('transform', 'translate(' + ( (arr.length +1) * textSpacing ) + ',20)');

arrtextg.attr('textbox', function(d){
//  console.log('this arrtext = ', d3.select(this).select('text').node().getBBox().width)
  var textW = d3.select(this).select('text').node().getBBox().width
  d3.select(this).select('rect').attr('width', textW) 
  return d3.select(this).select('text').node().getBBox().width;
})


var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// declares a tree layout and assigns the size
var treemap = d3.tree()
    .size([width, height]);

var newsource = {name: arr[0], children: getChildren(0, arr) }

console.log(newsource);

var root = d3.hierarchy(newsource, function(d) { return d.children; });

root.x0 = 5;
root.y0 = 0;

// Make the root and all it's children null and move into _children attribute
collapse(root)
update(root);
runprom(root);

function runprom(dat) {
  promun(dat)
    .then(function(d){
      var nodescendants = true;
	  //  console.log('finished the promise', d.descendants())
      for( i of root.descendants() ) {
		  //  console.log(i)
        if( i._children ) {
          nodescendants = false;
			    runprom(i)
			    break;
		    }
 	    }
      if(nodescendants === true) {
  //      console.log('done buidling heap, now to max heap')
        buildMaxHeap();
      }
    });
}


function promun(ino){
	var innodes = ino.descendants();
	return new Promise(function(res, rej){
	  //console.log('inpromise', ino)
      unfold(ino);
  	d3.timeout(function(){
  		res(ino)
  	}, 2000);

	})
}

function unfold(data){
	//console.log('unfolding, ', data)
//	update(data)
	if( data._children ){
	  if( data._children.length > 0 ) {
		  if(data.children === null ) { data.children = [] }
		  data.children.push(data._children.shift())
		  if( data._children.length === 0 ) {
			  data._children = null;
		  }
    }

	setTimeout(function(d){
      update(data)
		//console.log('should try to unfold data')
	    unfold(data)
    } , 400)
  }
}


function getChildren(i, array) {
	var childs = [];
	var nextIndex = i * 2 + 1;
	if( typeof( array[ i * 2 + 1 ] ) ==="number" ) {
		childs[0] = { name: array[i * 2 + 1], children: [] };
		if( typeof(array[ i * 2 + 2 ]) ==="number"  ) {
			childs[1] = { name: array[ i * 2 + 2]  };
		}
	}

	if( typeof(arr[nextIndex *2  + 1]) === "number" ) {
		childs[0].children = getChildren( nextIndex, array)
		childs[0]._children = null;

		if( typeof(arr[nextIndex*2 + 2]) === "number" ){
			childs[1].children = getChildren(nextIndex + 1, array);
			childs[1]._children = null;
		}
	}

	return childs
}

var nodes;
function update(data) {
  //console.log(data)
//  var mapData = data.map()

  var treeData = treemap(root);
  nodes = treeData.descendants();

  var links = treeData.descendants().slice(1);
 // console.log(nodes);
//  console.log("nodes = ", nodes, ", links = ", links);

  var node = g.selectAll('g.node')
    .data(nodes, function(d, i) {
	  	return d.id = i;
  	})

//	console.log('node = ', node)

  var nodeEnter = node.enter().append('g')
    .attr('class', 'node')
	  .attr('transform', function(d) {
//		  console.log('appending a new node', d);
      d3.select('#artextg' + d.id)
        .call(function(d){
        //  console.log('this is', this, d)
          d.select('rect')
          .attr('fill', 'red')
          .transition()
          .duration(duration*2)
          .attr('fill', 'white')
        })

		  return 'translate( ' + data.x0 + ', ' + data.y0 + ' )';
	  })
	  .attr('id', function(d, i) {
		  return 'nodey' + i;
	  })
    .attr('index', function(d,i){
      return i;
    })


  nodeEnter.append('circle')
	  .attr('class', 'node')
  	.attr('r', 1e-6)
  	.style('fill', function(d){
	  	return "red" //d._children ? "lightsteelblue" : "#fff";
	  })

  // Labels for the nodes
	nodeEnter.append('text')
          .attr("dy", ".35em")
          .attr("y", function(d, i){
              return -15
          })
          .attr("x", function(d, i) {
              var xmove = i%2;
              return xmove ? -16 : 3 //d.children || d._children ? 1 : 1;
          })
          .attr("text-anchor", function(d,i) {
            var xmove = i%2;
            return xmove ? "end" : "start"; //d.children || d._children ? "end" : "start";
          })
          .attr("class", "valtext")
          .text(function(d) {
            return d.data.name;
          });

  // UPDATE
  var nodeUpdate = nodeEnter.merge(node)
    .transition()
    .duration(duration)
    // .text(function(d) { return d.data.name; })
	   .attr('transform', function(d){
       return "translate(" + d.x + "," + d.y + ")"
	   })
     .on('end', function(d){

         nodeUpdate.select('circle.node')
         .transition()
         .duration(addColorDuration)
         .style("fill", function(d) {
                     return "steelblue"//d._children ? "lightsteelblue" : "#fff";
                 })
     })

  // Update the node attributes and style
  nodeUpdate.select('circle.node')
        .attr('r', 10)
        .attr('cursor', 'pointer')
        .style('stroke', 'black')
        .style('stroke-width', '2px')
        .transition()
        .duration(addColorDuration)
        .style("fill", function(d) {
                    return "steelblue"//d._children ? "lightsteelblue" : "#fff";
                })


  // Remove any exiting nodes
  var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) {
                   return "translate(" + data.x + "," + data.y + ")";
               })
          .remove();

           // On exit reduce the node circles size to 0
  nodeExit.select('circle')
          .attr('r', 1e-6);

           // On exit reduce the opacity of text labels
  nodeExit.select('text')
          .style('fill-opacity', 1e-6);

	// Links section VVVVV

 // Update the links...
  var link = g.selectAll('path.link')
     .data(links, function(d) { return d.id; });

 // Enter any new links at the parent's previous position.
  var linkEnter = link.enter().insert('path', "g")
 //   .on('click', click)
     .attr("class", "link")
     .attr('d', function(d){
       var o = {y: data.y0, x: data.x0}
       return diagonal(o, o)
     })
	   .style('fill', 'none')
     .style('stroke', 'black');

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
       var o = {x: data.x, y: data.y}
       return diagonal(o, o)
     })
     .remove();

 // Store the old positions for transition.
  nodes.forEach(function(d, i){
//   console.log(d)
    d.x0 = d.x;
    d.y0 = d.y;
  });

}

// Make the node and all it's children null and move into _children attribute
function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
}

// Creates a curved (diagonal) path from parent to the child nodes
// switched around all the x's and y's from orig so it's verticle
function diagonal(s, d) {
  //console.log('in diag and s = ', s);
  //console.log('d = ', d)

  path = `M ${s.x} ${s.y}
          C ${(s.x + d.x) / 2} ${s.y},
            ${(s.x + d.x) / 2} ${d.y},
            ${d.x} ${d.y}`

  return path;

}


function colorAllCircsGreen() {
  d3.selectAll('circle')
    .transition()
    .duration(colorduration)
    .style('fill', 'green')
}

var noders;


function buildMaxHeap(){

  noders = d3.selectAll('g.node');
  console.log('time to makeheapify', noders)
  var numnodes = noders._groups[0].length;

  var holders = {restartIndex: Math.floor((numnodes)/2)-1, bigChild:null}
  console.log('holders to start = ', holders)
  max_heapify( Math.floor((numnodes)/2)-1, holders)

}


function bigChildIndex(ind) {
//  console.log(ind);

  var chillies = [];
  if( nodes[ind] ){
    chillies = nodes[ind].children;
    if(chillies[1]){
      return ( parseInt(chillies[0].data.name) > parseInt(chillies[1].data.name)  ) ? 0 : 1;
    }
    else{
      return 0;
    }
  }
  else{
    return -1;
  }
//  console.log(chillies)
}

function max_heapify (ind, holders ){
//    console.log('max heap from isnt going ', nodes[ind])
    if(holders === null){
      holders = {}
    }
    noders = d3.selectAll('g.node')
    var childindexes = []
    holders.bigChild = bigChildIndex( ind )
    holders.starter = ind;

    if(nodes[ind].children) {
      childindexes = nodes[ind].children.map(function(d,i){
        return d.id;
      })
    }

//  console.log('childindexes are', childindexes)
    var anode = d3.select('#nodey' + ind)

    changeRectColor(ind, 'red');

    anode.select('circle')
      .transition()
      .duration(duration + textTransDuration)
      .style('fill', 'red')
      .on('end', function(d) {
    //      console.log('holders', holders)
          compareChils(childindexes, holders)
      })



    var comptext = 'compare the childrens';
    anode
	   .append('text')
       .text(comptext)
       .attr("text-anchor", function(d) {
             return 'middle'; })
       .attr("dy", '20px')
       .attr('class', 'process')
}

function compareChils( childsArr, holders){
    colorForComp(childsArr[0], holders);
    if(childsArr[1]){
      colorForComp(childsArr[1], holders);
    }
}

function colorForComp( inex, holders ) {

  changeRectColor( inex, 'orange')

  d3.select('#nodey' + inex)
      .select('circle')
      .transition()
      .duration( duration + textRemoveDuration )
      .style('fill', function(d){
        return 'orange'
      })
      .on('end', function(d){
//        console.log('done and have ', d)
  //      console.log(holders)
  //     console.log(nodes[holders.restartIndex].children[holders.bigChild])
       if(nodes[holders.starter].children[holders.bigChild] === d){
//         console.log('its the big child need to check swaping')

         changeRectColor( inex, 'yellow')

         d3.select(this).transition()
         .duration(duration+200)
         .style('fill','yellow')
         .on('end', function(){
           checkParentSwap(d, holders);
         })
       }
       else{
        console.log('this should make it green')

         d3.select(this)
           .transition()
           .duration(colorduration)
           .style('fill','green')
           changeRectColor( inex, 'green')
       }
      })
}

function checkParentSwap(d, holders) {
// check if the given thing is bigger than the parent node
// and if not decrement holders.restartIndex and call the max heap thing with that
//console.log("d = " , d)
  var childer = d;
  var cnode = d3.select('#nodey' + (d.id));
  var pnode = d3.select('#nodey' + (d.parent.id));

  console.log('parent node id = ', pnode.attr('id'))

  d3.select('.process')//.text('Compare with largest child')


  if(d.data.name > d.parent.data.name){
    d3.select('.process') //.text('Compare with largest child')
      .transition()
      .duration(compareDuration)
      .delay(swapDelay)
      .text("swap with big child")
      .on('end', function(d){
    //    console.log('swap with parent ', childer, holders);
    //  changeRectColor(pnode.attr('id').slice(pnode.attr('id').length-1), 'green');
          swapWithParent(childer, holders)
      })
      .on('interrupt', function(d){
          //    console.log('swap with parent ', childer, holders);
                swapWithParent(childer, holders)
            })
      .remove();

  }
  else{
    console.log('making stuff greenie')
    cnode.select('circle')
        .transition()
        .duration(colorduration)
        .style("fill", 'green')
        .on('end', function(){
          console.log('maybe i should do stuff here')
        })
        changeRectColor(cnode.attr('index'), 'green');
        changeRectColor(pnode.attr('index'), 'green');

    d3.select('.process').text('This node is good move on')
      .call(function(){
        console.log('trying to just make the rects green', pnode)
        setTimeout(function(){

          console.log('why dont the rects turn green', cnode.attr('id').slice(cnode.attr('id').length-1))
      //    changeRectColor(pnode.attr('id').slice(pnode.attr('id').length-1), 'green');
        //  changeRectColor(cnode.attr('id').slice(cnode.attr('id').length-1), 'green');

        }, 700)

        }
      )
      .transition()
      .duration(3000)
      .delay(2000)
      .remove();

  if(holders.restartIndex > 0){
  //    console.log('need to color stuff here', pnode)
    changeRectColor(pnode.attr('id'), 'green');


    pnode.select('circle')
      .transition()
      .duration(3000)
      .style("fill", 'green')


  //    console.log('we get to recur!!!')
      holders.restartIndex = holders.restartIndex - 1;
      max_heapify(holders.restartIndex, holders)
  }
  else{
    //  colorAllCircsGreen();
    changeRectColor(pnode.attr('id'), 'green');
      console.log('its all over')
      changeRectColor(pnode.attr('id'), 'green');
      popLargest();
    }
  }
}


function swapWithParent(bigchild, holders){

  var newLowval = bigchild.parent.data.name;
  bigchild.parent.data.name = bigchild.data.name;
  bigchild.data.name = newLowval;

console.log(bigchild.id, 'and we got', bigchild.parent.id)
  swapArrayGs(bigchild.parent.id, bigchild.id)


  var parnode = d3.select('#nodey' + (bigchild.parent.id) )
  parnode
    .select('circle')
    .transition()
    .duration(duration+2000)
    .style('fill','green')
    .on('end', function(){

        parnode.select('.process')
          .transition()
          .delay(1000)
          .remove();

        changeRectColor( bigchild.parent.id, 'green')
  })

  var partext = parnode.select('.valtext');
//  console.log(partext)
  partext
  .transition()
  .duration(textTransDuration)
  .attr('transform', function(d){
//    console.log('need to translate, ', d)
    return "translate(" + ( d.children[holders.bigChild].x -d.x) + ', ' + (d.children[holders.bigChild].y - d.y )+ ')'
  })
  .on('end', function(d){
    changeRectColor( bigchild.parent.id, 'green')

    d3.select(this).attr('transform', function(d){
    //  console.log('trying to put it back', this, d)
      return 'translate(0,0)'
    })
    .text('')
  })


  var chinode = d3.select('#nodey' + (bigchild.id ));

  var chitext = chinode.select('.valtext');
  chitext.transition()
  .duration(textTransDuration)
  .attr('transform', function(d){
    //console.log('its this.x  =', d3.select(this).attr('x'))
    return "translate(" + (d.parent.x - d.x- d3.select(this).attr('x'))  + ', ' + (d.parent.y - d.y )+ ')'
  })
  .on('end', function(d){
    d3.select(this).attr('transform', function(d){
      //      console.log('trying to put it back', this, d)
      return 'translate(0,0)'
    })
    .text('')
  })

  chinode.select('circle').transition()
    .duration(duration)
    .style('fill','red')
    .on('end', function(d){
//      console.log('need to do stuff with ', d)

      chinode.append('text')
        .attr('class', 'process')
        .text(function(d){
          console.log(d)
          console.log('and the holders', holders)
          if(d.children){
            console.log('need to keep ballancing')
            if(d.children.length >0){
              console.log('trying to maxheap with ', holders, d)
              changeRectColor(bigchild.index, 'red');
              max_heapify(parseInt(d.id), holders)
            }
            else{
              console.log('in the wierd stpot moving on with the', holders)
              console.log('make all circs white fill still')
              chinode.select('circle').transition()
              .duration(100)
              .style('fill','green')

              changeRectColor(bigchild.attr('index'), 'green');

              holders.restartIndex = holders.restartIndex - 1;
              max_heapify(holders.restartIndex, holders)
            }
          }
          else{
        //    console.log('move on with the', holders)
      //      console.log('rect not turning green, chinodeid = ', chinode.attr('id'))
            chinode.select('circle').transition()
              .duration(10)
              .style('fill','green')

              changeRectColor(bigchild.id, 'green');

        if(holders.restartIndex > 0){
            holders.restartIndex = holders.restartIndex - 1;
            max_heapify(holders.restartIndex, holders)
          }
          else{
            console.log('endgame spot, done with it all')
            changeRectColor(chinode.attr('id'), 'green');

            popLargest();
        //    colorAllCircsGreen();
          }
          }

          return "Check for children";

        })
        .attr("text-anchor", function(d) {
            return 'middle'; })
        .attr("dy", '-20px')
        .transition()
        .duration(textRemoveDuration)
        .delay(1000)
        .style('fill', 'green')
        .remove();
      })
  parnode.select('.process').remove();
  upDateNodeVals()

}

function upDateNodeVals() {

    d3.selectAll('g.node')
     .transition()
     .delay(swapDelay)
      .select('text')
      .text(function(d){
//console.log('need to change all the texts', d)
        return d.data.name
      })

}

// a function to add a colored rectange to go behind the text in the array.

function changeRectColor(index, color) {

  d3.select('#artextg'+index).select('rect')
    .transition().duration(duration)
    .attr('fill', color)
	//.attr('width', 20)
	//.attr('height', 20)

//  console.log('need to remove or change color of recs at right time still')
}

// Will swap the elements in the array at the top of the page.
// Just give the indexes of the elements you wish to swap.
function swapArrayGs(ind1, ind2) {

  var g1 = d3.select('#artextg' + ind1)
  var gx1 = g1.attr('x')
  var g2 = d3.select('#artextg' + ind2)
  var gx2 = g2.attr('x')
  var g1Start = g1.select('text').text();
  var g2Start = g2.select('text').text()

//  console.log('startiing val ', g1Start)
  var xdis = gx2 - gx1

  g1.select('text').transition()
    .duration(duration)
    .attr("transform", "translate(" + xdis + ', 0)')
    .on('end', function(d,i){
  //    console.log('d = ', d, 'this = ???', this)
      g1.select('text').attr('transform','translate(0, 0)').text(g2Start);
    })

    g2.select('text').transition()
      .duration(duration)
      .attr("transform", "translate(" + (-xdis) + ', 0)')
      .on('end', function(d,i){
    //    console.log('d = ', d, 'this = ???', this)
        g2.select('text').attr('transform','translate(0, 0)').text(g1Start);
        updateRectSizes();
      })
}


function updateRectSizes(){
  arrtextg.attr('textbox', function(d){
  //  console.log('this arrtext = ', d3.select(this).select('text').node().getBBox().width)
    var textW = d3.select(this).select('text').node().getBBox().width
    d3.select(this).select('rect').attr('width', textW )
    return d3.select(this).select('text').node().getBBox().width;
  })
}


// Should take the top element in the heap and swap it with the last one,
// then the heap should get reballanced
function popLargest(){
 console.log('done heaping now need to start sorting, should show swapping first and last elements of the array')

  //console.log('need to update nodes = ', nodes)
  // swap first with last node
  var topper = d3.select('#nodey' + nodes[0].id)

  var highval = nodes[0].data.name

  var lower = d3.select('#nodey' + nodes[nodes.length-1].id)
  var lowval = nodes[nodes.length-1].data.name

//  console.log('lowval is', lowval)
  var toptransX = nodes[0].x - nodes[nodes.length-1].x
  var toptransY = nodes[nodes.length-1].y -nodes[0].y

//  console.log(toptransX, 'and y= ', toptransY)
  topper.select('.valtext')
    .transition()
    .attr('transform', "translate(" + toptransX + ", " + toptransY +')')
    .on('end', function(){
      //nodes[0].data.name = lowval;
      //nodes[nodes.length-1].data.name = highval;
  //    console.log('and this is', this)
      d3.select(this).attr('transform', 'translate(0,0)')

    //  upDateNodeVals()
    })

    nodes[0].data.name = lowval;
    nodes[nodes.length-1].data.name = highval;

    swapArrayGs(0, nodes.length-1)

    MakeRectDone(nodes.length-1, 'blue')

    lower.select('circle')
      .transition()
      .delay(1000)
      .duration(colorduration)
      .style('fill', 'blue')
      .on('end', function(d){
        var lastpar = nodes[nodes.length-1].parent;
        lastpar._children = nodes[nodes.length-1];
    //    console.log(lastpar, "last parent is")
        var removableindex = lastpar.children.indexOf(nodes[nodes.length-1]);
        lastpar.children = lastpar.children.filter(function(d){
          return d !== nodes[nodes.length-1]
        })
        if(lastpar.children.length === 0){
          lastpar.children = null;
        }
        update(lastpar)
  //      console.log('nodes after all that,', nodes)
        setTimeout(function(){
          if(nodes.length === 1){
            console.log('All done just need to make this rectangle blue and maybe make the root go to the array.')
            MakeRectDone(0, 'blue')
          }
          else{
            max_heapify(0, {})
          }

        }, 2000)

      })

//    console.log('want to make this blue')

    lower.select('.valtext')
      .transition()
      .attr('transform', "translate(" + -toptransX + ", " + -toptransY +')')
      .on('end', function(){
        //nodes[0].data.name = lowval;
      //  console.log('and this is', this)
        d3.select(this).attr('transform', 'translate(0,0)')

        upDateNodeVals()
      })

}


function MakeRectDone(i){
  d3.select('#artextg'+i).select('rect')
    .transition().duration(duration)
    .attr('fill', 'none')
    .attr('stroke', "steelblue")

}

function makeRandArray(length){
  var arrRand = [];
  for(i = 0; i < length; i++){
    arrRand.push(Math.floor(Math.random()*100))
  }
  return arrRand
}
*/
