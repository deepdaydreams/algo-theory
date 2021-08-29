//Handles functionality of Sorting Algorithms
//Credit to Mike Bostock for much of the code
//https://bost.ocks.org/mike/algorithms/

function whenBoundsVisible(computeBounds, callback) {
    var id = ".visible-" + ++count,
        self = d3.select(window),
        bounds;

    if (document.readyState === "loading")
        self.on("load" + id, loaded);
    else
        loaded();

    function loaded() {
        self
        .on("resize" + id, resized)
        .on("scroll" + id, scrolled)
        .each(resized);
    }

    function resized() {
        bounds = computeBounds();
        if (bounds[1] < bounds[0])
            bounds.reverse();
        scrolled();
    }

    function scrolled() {
        if (bounds[0] <= pageYOffset && pageYOffset <= bounds[1]) {
            callback(null);
            self.on(id, null);
        }
    }
}

whenFullyVisible = function(element, callback) {
    return whenBoundsVisible(function() {
        var rect = element.getBoundingClientRect();
        return [
        rect.bottom + pageYOffset - innerHeight,
        rect.top + pageYOffset
        ];
    }, callback);
};

var count = 0, overshoot = 300;
//*******************************************************************************//
//quicksort stuff
//*******************************************************************************//
var n_qs = 120, array_qs = d3.shuffle(d3.range(n_qs));

var margin_qs = {top: 60, right: 60, bottom: 60, left: 60},
    width_qs = 960 - margin_qs.left - margin_qs.right,
    height_qs = 180 - margin_qs.top - margin_qs.bottom;

var x_qs = d3.scale.ordinal()
    .domain(d3.range(n_qs))
    .rangePoints([0, width_qs]);

var a_qs = d3.scale.linear()
    .domain([0, n_qs - 1])
    .range([-45, 45]);


var p_qs = d3.select("#quicksort")
    .on("click", click_qs);

var svg_qs = p_qs.append("svg")
    .attr("width", width_qs + margin_qs.left + margin_qs.right)
    .attr("height", height_qs + margin_qs.top + margin_qs.bottom)
  .append("g")
    .attr("transform", "translate(" + margin_qs.left + "," + margin_qs.top + ")");

var gLine_qs = svg_qs.append("g")
    .attr("class", "line");

gLine_qs.selectAll("line")
    .data(array_qs)
  .enter().append("line")
    .attr("class", "line--inactive")
    .attr("transform", transform_qs)
    .attr("y2", -height_qs);

p_qs.append("button")
    .text("▶ Play");

whenFullyVisible(p_qs.node(), click_qs);

function click_qs() {
  var actions = quicksort(array_qs.slice()).reverse();

  var line = gLine_qs.selectAll("line")
      .attr("transform", transform_qs)
      .attr("class", "line--inactive")
      .interrupt();

  var transition = svg_qs.transition()
      .duration(150)
      .each("start", function start() {
        var action = actions.pop();
        switch (action.type) {
          case "swap": {
            var i = action[0],
                j = action[1],
                li = line[0][i],
                lj = line[0][j];
            line[0][i] = lj;
            line[0][j] = li;
            transition.each(function() { line.transition().attr("transform", transform_qs); });
            break;
          }
          case "partition": {
            line.attr("class", function(d, i) {
              return i === action.pivot ? "line--active"
                  : action.left <= i && i < action.right ? "line--inactive"
                  : "line--temp";
            });
            break;
          }
        }
        if (actions.length) transition = transition.transition().each("start", start);
        else transition.each("end", function() { line.attr("class", "line--inactive"); });
      });
}

function transform_qs(d, i) {
  return "translate(" + x_qs(i) + "," + height_qs + ")rotate(" + a_qs(d) + ")";
}

function quicksort(array) {
  var actions = [];

  function partition(left, right, pivot) {
    var v = array[pivot];
    swap(pivot, --right);
    for (var i = left; i < right; ++i) if (array[i] < v) swap(i, left++);
    swap(left, right);
    return left;
  }

  function swap(i, j) {
    if (i === j) return;
    var t = array[i];
    array[i] = array[j];
    array[j] = t;
    actions.push({type: "swap", "0": i, "1": j});
  }

  function recurse(left, right) {
    if (left < right - 1) {
      var pivot = (left + right) >> 1;
      actions.push({type: "partition", "left": left, "pivot": pivot, "right": right});
      pivot = partition(left, right, pivot);
      recurse(left, pivot);
      recurse(pivot + 1, right);
    }
  }

  recurse(0, array.length);
  return actions;
}

//*******************************************************************************//
//merge sort
//*******************************************************************************//
var n_ms = 120, array_ms = d3.shuffle(d3.range(n_ms));

var margin_ms = {
        top: 60,
        right: 60,
        bottom: 60,
        left: 60
    },
    width_ms = 960 - margin_ms.left - margin_ms.right,
    height_ms = 180 - margin_ms.top - margin_ms.bottom;

var x_ms = d3.scale.ordinal()
.domain(d3.range(n_ms))
.rangePoints([0, width_ms]);

var a_ms = d3.scale.linear()
.domain([0, n_ms - 1])
.range([-45, 45]);

var p_ms = d3.select("#mergesort")
.on("click", click_ms);

var svg_ms = p_ms.append("svg")
.attr("width", width_ms + margin_ms.left + margin_ms.right)
.attr("height", height_ms * 2 + margin_ms.top + margin_ms.bottom)
.append("g")
.attr("transform", "translate(" + margin_ms.left + "," + (margin_ms.top + height_ms) + ")");

var gLine_ms = svg_ms.append("g")
.attr("class", "line");

gLine_ms.selectAll("line")
.data(array_ms.map(function(v, i) {
    return {
        value: v,
        index: i,
        array: 0
    };
}))
.enter().append("line")
.attr("class", "line--inactive")
.attr("transform", transform_ms)
.attr("y2", -height_ms);

p_ms.append("button")
.text("▶ Play");

whenFullyVisible(p_ms.node(), click_ms);

function click_ms() {
    var line = gLine_ms.selectAll("line")
    .each(function(d, i) {
        d.array = 0;
        d.index = i;
    })
    .attr("class", "line--inactive")
    .attr("transform", transform_ms)
    .interrupt();

    var line0 = line[0],
        line1 = new Array(n_ms);

    var actions = mergesort(array_ms.slice()).reverse();

    (function nextTransition() {
        var action = actions.pop();
        switch (action.type) {
        case "copy":
            {
                var i = action[0],
                    j = action[1],
                    e = line1[j] = line0[i],
                    d = e.__data__;
                d.index = j;
                d.array = (d.array + 1) & 1;
                d3.select(e).transition()
                .duration(75)
                .attr("transform", transform_ms)
                .each("end", actions.length ? nextTransition : null);
                break;
            }
        case "swap":
            {
                var t = line0;
                line0 = line1;
                line1 = t;
                if (actions.length)
                    nextTransition();
                break;
            }
        }
    })();
}

function transform_ms(d) {
    return "translate(" + x_ms(d.index) + "," + ((1 - d.array * 1.5) * height_ms) + ")rotate(" + a_ms(d.value) + ")";
}

function mergesort(array) {
    var actions = [],
        n = array.length,
        array0 = array,
        array1 = new Array(n_ms);

    for (var m = 1; m < n_ms; m <<= 1) {
        for (var i = 0; i < n_ms; i += (m << 1)) {
            merge(i, Math.min(i + m, n_ms), Math.min(i + (m << 1), n_ms));
        }
        actions.push({
            type: "swap"
        });
        array = array0,
        array0 = array1,
        array1 = array;
    }

    function merge(left, right, end) {
        for (var i0 = left, i1 = right, j = left; j < end; ++j) {
            if (i0 < right && (i1 >= end || array0[i0] <= array0[i1])) {
                array1[j] = array0[i0];
                actions.push({
                    type: "copy",
                    "0": i0++,
                    "1": j
                });
            } else {
                array1[j] = array0[i1];
                actions.push({
                    type: "copy",
                    "0": i1++,
                    "1": j
                });
            }
        }
    }

    return actions;
}

//*******************************************************************************//
//Insertion sort 
//*******************************************************************************//

var n_is = 120, array_is = d3.shuffle(d3.range(n_is));

var margin_is = {top: 60, right: 60, bottom: 60, left: 60},
    width_is = 960 - margin_is.left - margin_is.right,
    height_is = 180 - margin_is.top - margin_is.bottom;

var x_is = d3.scale.ordinal()
    .domain(d3.range(n_is))
    .rangePoints([0, width_is]);

var a_is = d3.scale.linear()
    .domain([0, n_is - 1])
    .range([-45, 45]);

var p_is = d3.select("#insertionsort")
    .on("click", click_is);

var svg_is = p_is.append("svg")
    .attr("width", width_is + margin_is.left + margin_is.right)
    .attr("height", height_is + margin_is.top + margin_is.bottom)
  .append("g")
    .attr("transform", "translate(" + margin_is.left + "," + margin_is.top + ")");

var gLine_is = svg_is.append("g")
    .attr("class", "line");

gLine_is.selectAll("line")
    .data(array_is)
  .enter().append("line")
    .attr("class", "line--temp")
    .attr("transform", transform_is)
    .attr("y2", -height_is);

p_is.append("button")
    .text("▶ Play");

whenFullyVisible(p_is.node(), click_is);

function click_is() {
  var actions = insertion_sort(array_is.slice()).reverse();

  var line = gLine_is.selectAll("line")
      .attr("transform", transform_is)
      .attr("class", "line--inactive")
      .interrupt();

  var transition = svg_is.transition()
      .duration(150)
      .each("start", function start() {
        var action = actions.pop();
        switch (action.type) {
          case "swap": {
            var i = action[0],
                j = action[1],
                li = line[0][i],
                lj = line[0][j];
            line[0][i] = lj;
            line[0][j] = li;
            transition.each(function() { line.transition().attr("transform", transform_is); });
            break;
          }
          case "partition": {
            line.attr("class", function(d, i) {
              return i === action.pivot ? "line--active"
                  : action.left <= i && i < action.right ? "line--inactive"
                  : "line--temp";
            });
            break;
          }
        }
        if (actions.length) transition = transition.transition().each("start", start);
        else transition.each("end", function() { line.attr("class", "line--inactive"); });
      });
}

function transform_is(d, i) {
  return "translate(" + x_is(i) + "," + height_is + ")rotate(" + a_is(d) + ")";
}

//TODO: replace this with an insertion sort visualization
function insertion_sort(array) {
  var actions = [];

  for (var i = 1; i < array.length; i++) {
    var x = array[i];
    var j = i - 1;
    while (j >= 0 && array[j] > x) {
      swap(j, j + 1);
      j = j - 1;
      actions.push({type: "partition", "pivot":j + 1, "left": 0, "right": i + 1});
    }
    array[j + 1] = x;
  }

  function swap(i, j) {
    if (i === j) return;
    var t = array[i];
    array[i] = array[j];
    array[j] = t;
    actions.push({type: "swap", "0": i, "1": j});
  }

  return actions;
}
