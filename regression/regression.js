//Handles functionality of Regression

$( window ).load(function() {
  draw_anova();
  drawComb();
  drawDie();
});

//Handles Window Resize
$(window).on("resize", function () {
  draw_anova();
  drawComb();
  drawDie();
});

// extracts column from JSON
function extractColumn(arr, column) {
  function reduction(previousValue, currentValue) {
    previousValue.push(currentValue[column]);
    return previousValue;
  }
  return arr.reduce(reduction, []);
}

//Handles CSS animation for coin and die
//Adapted from http://jsfiddle.net/byrichardpowell/38MGS/1/
$.fn.animatecss = function(anim, time, cb) {
    if (time) this.css('-webkit-transition', time / 1000 + 's');
    this.addClass(anim);
    if ($.isFunction(cb)) {
        setTimeout(function() {
            $(this).each(cb);
        }, (time) ? time : 250);
    }
    return this;
};


//*******************************************************************************//
//Linear Regression
//*******************************************************************************//

var bubbleTimes = [[0, 0.0008106231689453125], [1, 0.00782012939453125], [2, 0.0020265579223632812], [3, 0.0021696090698242188], [4, 0.004649162292480469], [5, 0.0035524368286132812], [6, 0.0045299530029296875], [7, 0.015568733215332031], [8, 0.015115737915039062], [9, 0.02079010009765625], [10, 0.033092498779296875], [11, 0.023245811462402344], [12, 0.04439353942871094], [13, 0.024962425231933594], [14, 0.02448558807373047], [15, 0.020623207092285156], [16, 0.018405914306640625], [17, 0.026535987854003906], [18, 0.03132820129394531], [19, 0.03330707550048828], [20, 0.03478527069091797], [21, 0.035381317138671875], [22, 0.04100799560546875], [23, 0.04019737243652344], [24, 0.03685951232910156], [25, 0.04761219024658203], [26, 0.048923492431640625], [27, 0.050139427185058594], [28, 0.05183219909667969], [29, 0.0530242919921875], [30, 0.05919933319091797], [31, 0.07710456848144531], [32, 0.07369518280029297], [33, 0.07131099700927734], [34, 0.08318424224853516], [35, 0.08471012115478516], [36, 0.10037422180175781], [37, 0.09083747863769531], [38, 0.0985860824584961], [39, 0.1089334487915039], [40, 0.10569095611572266], [41, 0.10826587677001953], [42, 0.11255741119384766], [43, 0.1073598861694336], [44, 0.13594627380371094], [45, 0.12884140014648438], [46, 0.15933513641357422], [47, 0.1415729522705078], [48, 0.13625621795654297], [49, 0.13840198516845703], [50, 0.14667510986328125], [51, 0.15115737915039062], [52, 0.1607656478881836], [53, 0.17392635345458984], [54, 0.17571449279785156], [55, 0.20546913146972656], [56, 0.21390914916992188], [57, 0.18939971923828125], [58, 0.20129680633544922], [59, 0.1964092254638672], [60, 0.2254009246826172], [61, 0.23088455200195312], [62, 0.2199411392211914], [63, 0.2290487289428711], [64, 0.22978782653808594], [65, 0.24154186248779297], [66, 0.2496480941772461], [67, 0.2844095230102539], [68, 0.2690553665161133], [69, 0.2785921096801758], [70, 0.29532909393310547], [71, 0.2942085266113281], [72, 0.3153800964355469], [73, 0.30002593994140625], [74, 0.3134489059448242], [75, 0.3132820129394531], [76, 0.3504753112792969], [77, 0.3495216369628906], [78, 0.3490447998046875]];

var insertTimes = [[0, 0.0005483627319335938], [1, 0.0005960464477539062], [2, 0.0008106231689453125], [3, 0.0011682510375976562], [4, 0.0015735626220703125], [5, 0.0024080276489257812], [6, 0.0029325485229492188], [7, 0.0025987625122070312], [8, 0.0034093856811523438], [9, 0.0046253204345703125], [10, 0.005030632019042969], [11, 0.005984306335449219], [12, 0.008630752563476562], [13, 0.007653236389160156], [14, 0.0074863433837890625], [15, 0.008821487426757812], [16, 0.01049041748046875], [17, 0.010585784912109375], [18, 0.011515617370605469], [19, 0.013637542724609375], [20, 0.014567375183105469], [21, 0.01575946807861328], [22, 0.017309188842773438], [23, 0.016498565673828125], [24, 0.01850128173828125], [25, 0.02186298370361328], [26, 0.022125244140625], [27, 0.025010108947753906], [28, 0.02548694610595703], [29, 0.027179718017578125], [30, 0.02892017364501953], [31, 0.030374526977539062], [32, 0.032448768615722656], [33, 0.03440380096435547], [34, 0.037360191345214844], [35, 0.03762245178222656], [36, 0.04134178161621094], [37, 0.03809928894042969], [38, 0.04584789276123047], [39, 0.046825408935546875], [40, 0.048041343688964844], [41, 0.05118846893310547], [42, 0.056481361389160156], [43, 0.0576019287109375], [44, 0.057888031005859375], [45, 0.0627279281616211], [46, 0.06268024444580078], [47, 0.06794929504394531], [48, 0.07488727569580078], [49, 0.07169246673583984], [50, 0.08144378662109375], [51, 0.07624626159667969], [52, 0.08780956268310547], [53, 0.0818490982055664], [54, 0.08459091186523438], [55, 0.0898599624633789], [56, 0.10004043579101562], [57, 0.10111331939697266], [58, 0.10099411010742188], [59, 0.10232925415039062], [60, 0.1177072525024414], [61, 0.10483264923095703], [62, 0.12390613555908203], [63, 0.1138925552368164], [64, 0.11837482452392578], [65, 0.1304149627685547], [66, 0.11970996856689453], [67, 0.12447834014892578], [68, 0.12524127960205078], [69, 0.13911724090576172], [70, 0.14171600341796875], [71, 0.1436471939086914], [72, 0.14982223510742188], [73, 0.1540660858154297], [74, 0.15332698822021484], [75, 0.15823841094970703], [76, 0.1674175262451172], [77, 0.16748905181884766], [78, 0.17178058624267578]];

var mergeTimes = [[0, 0.000286102294921875], [1, 0.0021219253540039062], [2, 0.0033140182495117188], [3, 0.004601478576660156], [4, 0.006508827209472656], [5, 0.008296966552734375], [6, 0.01010894775390625], [7, 0.011610984802246094], [8, 0.013780593872070312], [9, 0.015854835510253906], [10, 0.018215179443359375], [11, 0.020456314086914062], [12, 0.02956390380859375], [13, 0.025081634521484375], [14, 0.025773048400878906], [15, 0.02765655517578125], [16, 0.030279159545898438], [17, 0.03247261047363281], [18, 0.034928321838378906], [19, 0.0959634780883789], [20, 0.06039142608642578], [21, 0.045418739318847656], [22, 0.043082237243652344], [23, 0.048661231994628906], [24, 0.048661231994628906], [25, 0.050830841064453125], [26, 0.05321502685546875], [27, 0.06666183471679688], [28, 0.05671977996826172], [29, 0.06301403045654297], [30, 0.10385513305664062], [31, 0.07777214050292969], [32, 0.08966922760009766], [33, 0.06909370422363281], [34, 0.0772237777709961], [35, 0.10192394256591797], [36, 0.08974075317382812], [37, 0.1047372817993164], [38, 0.0978231430053711], [39, 0.10161399841308594], [40, 0.08575916290283203], [41, 0.11970996856689453], [42, 0.10232925415039062], [43, 0.11627674102783203], [44, 0.13191699981689453], [45, 0.1257181167602539], [46, 0.12710094451904297], [47, 0.1177072525024414], [48, 0.13720989227294922], [49, 0.11584758758544922], [50, 0.12969970703125], [51, 0.14829635620117188], [52, 0.16088485717773438], [53, 0.19767284393310547], [54, 0.13837814331054688], [55, 0.15790462493896484], [56, 0.14426708221435547], [57, 0.1537322998046875], [58, 0.16515254974365234], [59, 0.16341209411621094], [60, 0.16851425170898438], [61, 0.18355846405029297], [62, 0.1672983169555664], [63, 0.16062259674072266], [64, 0.16176700592041016], [65, 0.17936229705810547], [66, 0.1806020736694336], [67, 0.18436908721923828], [68, 0.20551681518554688], [69, 0.18999576568603516], [70, 0.18553733825683594], [71, 0.16922950744628906], [72, 0.18656253814697266], [73, 0.1761913299560547], [74, 0.19288063049316406], [75, 0.18622875213623047], [76, 0.18367767333984375], [77, 0.18627643585205078], [78, 0.18851757049560547]];

var quickTimes = [[0, 0.0005006790161132812], [1, 0.001049041748046875], [2, 0.0012874603271484375], [3, 0.0023126602172851562], [4, 0.00286102294921875], [5, 0.0032901763916015625], [6, 0.003933906555175781], [7, 0.004100799560546875], [8, 0.005626678466796875], [9, 0.005340576171875], [10, 0.0068187713623046875], [11, 0.007224082946777344], [12, 0.0076770782470703125], [13, 0.008487701416015625], [14, 0.010633468627929688], [15, 0.010347366333007812], [16, 0.009799003601074219], [17, 0.011014938354492188], [18, 0.011730194091796875], [19, 0.01239776611328125], [20, 0.012850761413574219], [21, 0.01316070556640625], [22, 0.014758110046386719], [23, 0.014281272888183594], [24, 0.017452239990234375], [25, 0.016689300537109375], [26, 0.015211105346679688], [27, 0.016689300537109375], [28, 0.01590251922607422], [29, 0.017976760864257812], [30, 0.018358230590820312], [31, 0.03371238708496094], [32, 0.019884109497070312], [33, 0.021314620971679688], [34, 0.02009868621826172], [35, 0.02014636993408203], [36, 0.021505355834960938], [37, 0.02429485321044922], [38, 0.02300739288330078], [39, 0.023508071899414062], [40, 0.02281665802001953], [41, 0.024199485778808594], [42, 0.02701282501220703], [43, 0.02624988555908203], [44, 0.025224685668945312], [45, 0.026535987854003906], [46, 0.027799606323242188], [47, 0.028705596923828125], [48, 0.02720355987548828], [49, 0.030803680419921875], [50, 0.03631114959716797], [51, 0.033545494079589844], [52, 0.031137466430664062], [53, 0.04391670227050781], [54, 0.03871917724609375], [55, 0.036716461181640625], [56, 0.03867149353027344], [57, 0.037217140197753906], [58, 0.03190040588378906], [59, 0.03609657287597656], [60, 0.033354759216308594], [61, 0.040149688720703125], [62, 0.034117698669433594], [63, 0.036454200744628906], [64, 0.03783702850341797], [65, 0.03533363342285156], [66, 0.039124488830566406], [67, 0.05822181701660156], [68, 0.039887428283691406], [69, 0.03821849822998047], [70, 0.04420280456542969], [71, 0.03952980041503906], [72, 0.039649009704589844], [73, 0.04246234893798828], [74, 0.04417896270751953], [75, 0.04284381866455078], [76, 0.04582405090332031], [77, 0.05431175231933594], [78, 0.1348257064819336]];
//END HARDCODED DATA

//Constants
var probDie = [{p:1/6},{p:1/6},{p:1/6},{p:1/6},{p:1/6},{p:1/6}];
var countDie = [0,0,0,0,0,1];
var expectedData = [average(countDie)];

//Create SVG and SVG elements
var svgDie = d3.select("#barDie").append("svg");

//Create Container
var containerDie = svgDie.append("g").attr('class','Theoretical');

//yScale
var yScaleDie = d3.scale.linear().domain([0,1]);

//xScale
var xScaleDie = d3.scale.ordinal().domain([1,2,3,4,5,6]);

//xAxis
var xAxisDie = d3.svg.axis().scale(xScaleDie).orient("bottom").ticks(0);
var axisDie = svgDie.append("g").attr("class", "x axis");

//Drag function for coin bar chart
var dragDie = d3.behavior.drag()
         .origin(function(d,i) { return {x: 0, y: yScaleDie(d.p)};})  
         .on('drag', function(d,i) {
         						var y = Math.min(1,Math.max(0,yScaleDie.invert(d3.event.y)));
     							var oldV = probDie[i].p;
     							var change = y-oldV;
     							probDie.map(function(x,index){
											if(index==i) x.p=y;
											else {
												if(oldV==1) x.p= -change/5;
												else x.p= x.p-change*x.p/(1-oldV);
											}});
     							updateDie();
     							tipDie.show(d,this);
     							countDie = [0,0,0,0,0,0];
     							expectedData = [];
     							maxXExpected = 200;
     							expectation(expectedData,expectationCalc(probDie));
     						})

//Create Rects
var expectedRects = containerDie.selectAll("rect").data(probDie).enter().append("rect");

//Create Labels
var dieFaces = svgDie.select("g.axis").selectAll("g.tick").data(probDie).enter().append("image");

//Tool Tip
var tipDie = d3.tip().attr('id', 'tipDie').attr('class', 'd3-tip').offset([-10, 0]);

//Update Coin Bar Chart
function updateDie() {

  	tipDie.html(function(d,i) { return round(d.p,2);});


	expectedRects
			.attr("x",function(d,i) {return xScaleDie(i+1);})
			.attr("y",function(d,i) {return yScaleDie(d.p);})
			.attr("height",function(d,i) {return yScaleDie(1-d.p);})
			.attr("width",xScaleDie.rangeBand())
			.attr("id",function(d,i) {return i;})
			.on('mousedown', function(d){tipDie.show(d,this)})
			.on('mouseover', function(d){tipDie.show(d,this)})
			.on('mouseout', tipDie.hide)
			.call(dragDie);

	$('#barDie').parent().on('mouseup', tipDie.hide);

	svgDie.select(".axis").selectAll(".tick").remove();
	dieFaces
	      .attr("xlink:href", function(d,i) { return "../img/dice_"+(i+1)+".png"; })
	      .attr("x", function(d,i) {return xScaleDie(i+1)-1/4*xScaleDie.rangeBand();})
	      .attr("y", 0)
	      .attr("width", 3/2*xScaleDie.rangeBand())
	      .attr("height", 3/2*xScaleDie.rangeBand());
}

//Handles Die Roll
function roll(die){
	var num = Math.random();
	var cumProb = cumsum(probDie);
	if (num<cumProb[0]) {
		die.css("background-image", "url(../img/dice_1.png");
		countDie[0] = countDie[0] + 1;
	} else if (num<cumProb[1]) {
		die.css("background-image", "url(../img/dice_2.png");
		countDie[1] = countDie[1] + 1;
	} else if (num<cumProb[2]) {
		die.css("background-image", "url(../img/dice_3.png");
		countDie[2] = countDie[2] + 1;
	} else if (num<cumProb[3]) {
		die.css("background-image", "url(../img/dice_4.png");
		countDie[3] = countDie[3] + 1;
	} else if (num<cumProb[4]) {
		die.css("background-image", "url(../img/dice_5.png");
		countDie[4] = countDie[4] + 1;
	} else {
		die.css("background-image", "url(../img/dice_6.png");
		countDie[5] = countDie[5] + 1;
	}
	updateDie();
	expectedData.push(average(countDie));
	expectation(expectedData,expectationCalc(probDie));
}

$('#rollOne').click(function() {
	var die = $("#die");
    die.animatecss('blur-out', 500, function() {
    	die.css("font-size", "30px");
    	roll(die);
        die.removeClass('blur-out');
    });
});

$('#rollHundred').click(function() {
	var die = $("#die");
	var count = 0;
	var interval = setInterval(function() {
		die.animatecss('blur-out', 15, function() {
	    	die.css("font-size", "30px");
	    	roll(die);
	        die.removeClass('blur-out');
	    });
	    if (++count === 100){
        clearInterval(interval);
       	}   
	}, 15);
});

//Cumulative Sum function for array
function cumsum(array){
	var resultArray = [];
	array.reduce(function(a,b,i) { return resultArray[i] = a+b.p; },0);
	return resultArray;
}
//Returns total samples and average at that point
function average(data) {
	var total = data.reduce(function(a, b){return a+b;},0);
	var sum = data.reduce(function(a, b, i){return a+b*(i+1);},0);
	return [total,sum/total]; 
}
//Returns expectation of die based on probability
function expectationCalc(data) {
	return data.reduce(function(a, b, i){return a+b.p*(i+1);},0);
}
//Returns probability from count data
function countToProb(data) {
	var total = Math.max(1,data.reduce(function(a, b){return a+b;},0));
	return data.map(function(x){return x/total;});
}

//Expectation SVG and elements
var maxXExpected = 200;
var expectedPlot = d3.select("#plotDie").append("svg");
var xaxisDie = expectedPlot.append("g").attr("class", "x axis");
var xaxisTextDie = expectedPlot.append("text").attr("text-anchor", "middle").text("Number of Rolls");
var yaxisDie =expectedPlot.append("g").attr("class", "y axis");
var yaxisTextDie = expectedPlot.append("text").attr("text-anchor", "middle").text("Value");
var pathExpected = expectedPlot.append("path").attr("id", "expected");
var pathActual = expectedPlot.append("path").attr("id", "actual");
var pathTest = expectedPlot.append("path").attr("id", "test");
    
//X scale 
var xScaleExpected = d3.scale.linear().domain([1, maxXExpected]);

//Y Scale
var yScaleExpected = d3.scale.linear().domain([0, 0.5]);

//Define X axis
var xAxisExpected = d3.svg.axis().scale(xScaleExpected).orient("bottom").ticks(3);
//Define Y axis
var yAxisExpected = d3.svg.axis().scale(yScaleExpected).orient("left").ticks(6);


//Update error plot
function expectation(data, prob){
	var line = d3.svg.line()
	  .x(function(d) { return xScaleExpected(d[0])})
	  .y(function(d) { return yScaleExpected(d[1])})
	  .interpolate("linear");
	if(data.length>maxXExpected*0.9){
		maxXExpected = maxXExpected*1.5;
	}
	xScaleExpected.domain([1,maxXExpected]);
	expectedPlot.select(".x.axis")
			.transition()
			.call(xAxisExpected.ticks(3));
	pathExpected
	  .datum(bubbleTimes)
	  .attr("d", line);
	pathActual
	  .datum(insertTimes)
	  .attr("d", line);
	pathTest
	  .datum(mergeTimes)
	  .attr("d", line);
}

var tipDieFocus = d3.tip().attr('id', 'tipDieFocus').attr('class', 'd3-tip').offset([0, 10]).direction('e');

var focus = expectedPlot.append("g").style("display", "none");

focus.append("rect").attr("y", 0).style('fill','white').style('opacity','0.75');

focus.append("line").attr('id','focusLine').style("stroke-dasharray", ("2, 2"));

focus.append("circle").attr("r", 5).attr('id','expectedCircle');

focus.append("circle").attr("r", 5).attr('id','averageCircle');
focus.append("circle").attr("r", 5).attr('id','testCircle');


expectedPlot.on("mouseover", mousemove).on("mouseout", mousemove).on("mousemove", mousemove);

function mousemove() {
	var x = round(xScaleExpected.invert(d3.mouse(this)[0]),0);
	var y = yScaleExpected.invert(d3.mouse(this)[1]);
	if (x>0 && x< 80 && y>=0 && y<=6) { //modified bounds for functions
	//if (x>0 && x<expectedData.length+1 && y>=0 && y<=6) {
		focus.style("display", null)
	    var y = expectedData[x-1][1];
	    focus.select('#expectedCircle').attr("cx", xScaleExpected(x)).attr('cy',yScaleExpected(bubbleTimes[x][1]));
	    focus.select('#averageCircle').attr("cx", xScaleExpected(x)).attr('cy',yScaleExpected(insertTimes[x][1]));
	    focus.select('#testCircle').attr("cx", xScaleExpected(x)).attr('cy',yScaleExpected(mergeTimes[x][1]));
	    //focus.select('#averageCircle').attr("cx", xScaleExpected(x)).attr('cy',yScaleExpected(0.1));
	    focus.select('rect').attr("x", xScaleExpected(x)).attr("height",yScaleExpected(0)-0).attr("width", xScaleExpected(maxXExpected - x));
	    focus.select('line').attr("x1", xScaleExpected(x)).attr("y1", yScaleExpected(6)).attr("x2", xScaleExpected(x)).attr("y2", yScaleExpected(0));
	    xaxisDie.call(xAxisExpected.tickValues([x]));
		tipDieFocus.html(function(d) { 
			return 'Average: <span id="avgFocus">'+round(bubbleTimes[x][1],3)+'</span><br>'+
				   'Test: <span id="testFocus">' + round(insertTimes[x][1],3) + '</span><br>' + 
				   'Expect: <span id="expFocus">'+round(mergeTimes[x][1],3)+'</span>';});
				   
	    tipDieFocus.show(document.getElementById("expectedCircle"));
	} else {
		focus.style("display", "none");
		tipDieFocus.hide();
		xaxisDie.call(xAxisExpected.tickValues(null));
	}
}

//Update SVG based on width of container
function drawDie(){
	//Constants Bar Die
    var width = d3.select('#barDie').node().clientWidth;
    var height = 150;
    var padDie = 20;

    //Update SVG
    svgDie.attr("width", width).attr("height", height).call(tipDie);

    //Update Scales
	yScaleDie.range([height-2*padDie, 0]);
	xScaleDie.rangeRoundBands([0, width - 2*padDie], .5);

	//Update Container and Axis
	axisDie.attr("transform", "translate(" + padDie + "," + (height-2*padDie+1) + ")").call(xAxisDie);
	containerDie.attr("transform", "translate(" + padDie + ","+0+")");

	//Update Rects
	updateDie();

	//Constants Expectation Die
    var w = d3.select('#plotDie').node().clientWidth;
    var h = 550;
    var padExp = 35;

    //Update SVG
	expectedPlot.attr("width", w).attr("height", h).style("cursor",	"crosshair").call(tipDieFocus);

	//Update Scales
	xScaleExpected.range([padExp, (w - padExp)]);
	yScaleExpected.range([(h - padExp), padExp]);

	//Update Axis
	xaxisDie.attr("transform", "translate(0," + (h - padExp) + ")").call(xAxisExpected);
	yaxisDie.attr("transform", "translate(" + padExp + ",0)").call(yAxisExpected);

	//Update Labels
	xaxisTextDie.attr("transform", "translate("+ (w/2) +","+(h)+")")
	yaxisTextDie.attr("transform", "translate("+ (padExp/4) +","+(h/2)+")rotate(-90)")

	//Update Paths
	expectation(expectedData,expectationCalc(probDie));
}

//*******************************************************************************//
//Combinatorics
//*******************************************************************************//
//Adapted from: https://bl.ocks.org/mbostock/4339083
//Starting values
var i = 0,
    dur = 750,
    combinations = false,
    size = 4,
    number =4,
    distNodes = 1,
    root = [],
    branches = 1;

//Create SVG
var svgComb = d3.select("#svgComb").append("svg");

//Create Container
var containerComb = svgComb.append("g");

//Create Tree Layout
var tree = d3.layout.tree();

//Diagonal function
var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });


//Initiates a tree of certain depth
function drawTree(level) {
  var source = {name:"", children:[]};
  var colors = ['A','B','C','D'];
  distNodes = tree.size()[1]/Math.max(1,size);

  //Creates JSON object of all possible permutations without replacement of first 
  //'num' number of elemenets from 'color'.  This is a recursive implementation.
  //TODO: change from permutations to all possible combinations
  function permutationCalc(obj,num,color) {
    for (var i = 0; i < num; i++) {
      obj.children.push({name:obj.name+color[i], children:[]})
    }
    obj.children.map(function(x,i){
      var remainingColor = color.slice()
      remainingColor.splice(i, 1);
      permutationCalc(x,num-1,remainingColor)});
    return obj;
  }

  function possibilityCalc(obj, num, color, depth) {
    if (depth === 0) return obj; //no more to calculate
    for (var i = 0; i < num; i++) {
      obj.children.push({name:obj.name+color[i], children:[]})
      //obj.children.push({name:depth, children:[]})
    }
    obj.children.map(function(x,i){
      //var remainingColor = color.slice()
      //remainingColor.splice(i, 1);
      possibilityCalc(x,num,color, depth - 1)});
    return obj;
  }

  //root = permutationCalc(Object.assign({}, source),size,colors);
  root = possibilityCalc(Object.assign({}, source),size,colors, size);
  root.x0 = tree.size()[0] / 2;
  root.y0 = 0;

  //Hides all children below depth
  function collapse(d, depth) {
    if (d.children && depth>=number) {
      d._children = d.children;
      d._children.forEach(function(x){collapse(x,depth+1)});
      d.children = null;
    } else {
      d.children.forEach(function(x){collapse(x,depth+1)});
    }
    d._top = true;
  }
  collapse(root,level);
  update(0);
}


//ReDraws Tree Layout
function update(duration) {

  // Compute the new tree layout nodes.
  var nodes = tree.nodes(root).reverse();

  //Update nodes.x and nodes.x0 for combinations
  function removeRepeats(nodeArray, myHashFunction) {
    var hashmap = new Map();
    nodeArray.map(function(x){
      var key = myHashFunction(x.name);
      if(hashmap.has(key)) {
        var value = hashmap.get(key);
        value.push(x);
        hashmap.set(key,value);
      } else {
        hashmap.set(key,[x]);
      }
    });
    //console.log(hashmap);
    hashmap.forEach(function (value,key) {
      var len = value.length;
      var avgX = value.reduce(function(a,b){return a+b.x},0)/len;
      var avgX0 = value.reduce(function(a,b){return a+b.x0},0)/len;
      value.map(function(x,i){
        if(i!=len-1) x._top = false
        x.x = avgX; 
        x.x0 = avgX0;
        //Hard coded for overlap when size is four
        //if(key==hashAnagram('AD')) x.x-=10;
        //if(key==hashAnagram('BC')) x.x+=10;
      });
    });
  };
  if(branches === 3) removeRepeats(nodes, hashAnagram);
  else if(branches === 2) removeRepeats(nodes, hashAnagram2);
  else if(branches === 1) removeRepeats(nodes, hashLength);
  else             nodes.map(function(x){ x._top = true;});

  //Compute new tree layout Links.
  var links = tree.links(nodes);

  // Normalize for fixed-depth.
  // Location of circle y coordinate!!
  nodes.forEach(function(d) { 
    if (number === 4) {
      d.y = 1.5*distNodes - (4 ** (4 - d.depth)/3) * distNodes/100; 
    } else if (number === 3) {
      d.y = 1.8*distNodes - (3 ** (4 - d.depth)/2) * distNodes/40; 
    } else if (number === 2) {
      d.y = 1.95*distNodes - (2 ** (4 - d.depth) - 1) * distNodes/15; 
    } else {
      d.y = d.depth * distNodes;
    }
  });

  // Update the nodes…
  var node = containerComb.selectAll("g.node")
      .data(nodes, function(d) { return d.name });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d,i) { 
        if(typeof(d.parent)!='undefined')  return "translate(" + d.parent.y0 + "," + d.parent.x0 + ")";
        else      return  "translate(" + d.y0 + "," + d.x0 + ")";
      });


  nodeEnter.each(function(d,i) {
    for (var j = d.name.length; j >= 0; j--) { //adds huge rectangle back in
    //for (var j = 0; j >= 0; j--) {
      var length = 1e-6; //stand in for radius
      var cx = 0; //stand in for circle center
      //var cx = j * 9; //stand in for circle center
      /*
      d3.select(this).append("circle")
          .attr("r", 1e-6)
          .attr("cx",j*9) //location of circle center!!!
          .attr('class',d.name[j]);
      */
      d3.select(this).append("rect")
          .attr("x", cx)
          .attr("y", 0)
          .attr("width",length) //location of circle center!!!
          .attr("height",length) //location of circle center!!!
          .attr('class',d.name[j]);
    };
    //console.log(d3.select(this));
  });

  nodeEnter.append("text")
      .attr("x", -10)
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .text(function(d) { return d.name })
      .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  //print the sizes
  nodeUpdate.selectAll("rect").each(function(d,i){
    //console.log(d,i);
    //console.log(d3.select(this)
    //d3.select(this).attr("r", 4.5 * (2 ** (3 - d.name.length)));
    var newHeight = 10;
    if (number === 4) { //this is how to reanimate based on clicks
      newHeight = 4 * (4 ** (3 - d.name.length))/3;
    } else if (number === 3) { //this is how to reanimate based on clicks
      newHeight = 6 * (3 ** (3 - d.name.length))/2;
    } else if (number === 2) {
      newHeight = 10 * (2 ** (3 - d.name.length))/1;
    } 
    var newWidth = newHeight;
    if (combinations) newWidth = Math.log(newHeight);
    d3.select(this)
      .transition()
      .duration(dur)
      .attr("y", -newHeight/2)
      .attr("width", newWidth)
      .attr("height", newHeight);
  });

  //Text is always invisible??
  //nodeUpdate.select("text")
      //.style("fill-opacity", function(d) { return d._top ? 1 : 1e-6; });

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d,i) { 
        if(typeof(d.parent)!='undefined')  return "translate(" + d.parent.y + "," + d.parent.x + ")";
        else      return  "translate(" + d.y + "," + d.x + ")";
      })
      .remove();

  //nodeExit.select("circle")
      //.attr("r", 1e-6);
  nodeExit.select("rect")
      .attr("y", 0)
      .attr("width", 1e-6)
      .attr("height", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = containerComb.selectAll("path.link")
      .data(links, function(d) { return d.target.name; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .style("visibility", "hidden")
      .attr("d", function(d) {
        var o = {x: d.source.x0, y: d.source.y0};
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
        var o = {x: d.source.x, y: d.source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

//Display nodes to the level of depth
function displayChildren(){
  containerComb.selectAll("g.node").each(function(d,i){
    if (d.depth + 1 == number && !d.children) {
        d.children = d._children;
        d._children = null;
    } else if(d.depth == number) {
      d._children = d.children;
      d.children = null;
    }
  })
}

//Combinatoric Functions
//Calculates number of permutations of r items out of n elements
function nPr(n,r) {
  var result = 1;
  for (var i = 0; i < r; i++) {
    result = result*(n-i);
  };
  return result;
}

//Calculates number of combinations of r items out of n elements
function nCr(n,r) {
  var result = 1;
  for (var i = 0; i < r; i++) {
    result = result*(n-i)/(i+1);
  };
  return result;
}

//Hash Code unique for each anagram
function hashAnagram(s){
  //return s.split("").sort().reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
  return s.replace(/B/g, 'C'); //should do the trick I think
  //TODO: create 4 branch choices, since that will mitigate the problem I have
  //return s.length;
}

function hashAnagram2(s) {
  return s.replace(/A/g, 'B').replace(/D/g, 'C');
}

function hashLength(s) { return s.length; } //one liner for all being same branch

//Handles permutation/combination radio buttons
$("input[name='radioComb']").on("change", function () {
    combinations = (this.value==='true');
    $('.explanationComb').toggle();
    update(dur); //
});

//Handles Input on size
//Note: will change this so that this swaps between 1 and 3 things like combo.
$('#sizeComb').change(function () {
    var newSize = parseInt($(this).find("option:selected").text());
    /*
    var tickArray = Array.apply(null, {length: newSize+1}).map(Number.call, Number)
    $("#number").slider('destroy');
    $("#number").slider({
      value: 0,
      max: newSize,
      ticks: tickArray,
      ticks_labels: tickArray
    }).on('change', updateNumber);
    */
    branches = newSize;
    //number = 0;
    //drawTree(0);
    update(dur);
});

//Update Number Input
function updateNumber() {
  oldNumber = number;
  number =  $("#number").slider('getValue');
  update(dur);
  //if(Math.abs(number-oldNumber)>1) {
    //drawTree(0);
    //update(0);
  //} else {
    //displayChildren();
  //}
};

//Draw SVG and update based on width
function drawComb(){
  //Width, Height, Margin
  var margin = {top: 40, right: 40, bottom: 40, left: 40},
      width = d3.select("#svgComb").node().clientWidth - margin.right - margin.left,
      height = 500 - margin.top - margin.bottom;

  //Update SVG
  svgComb.attr("width", width + margin.right + margin.left).attr("height", height + margin.top + margin.bottom);

  //Update Container
  containerComb.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Update Tree Size
  tree.size([height, width]);

  //Update Slider Width
  $("#number").css('width',width).css('margin-left',margin.left);
  //var tickArray = Array.apply(null, {length: (size+1)}).map(Number.call, Number)
  var tickArray = [2,3,4];  //keep this fixed
  //console.log(tickArray);
  $("#number").slider('destroy');
  $("#number").slider({
      value: number,
      max: size,
      ticks: tickArray,
      ticks_labels: tickArray
    }).on('change', updateNumber);

  //Update Nodes
  drawTree(0);
  update(0);
}



//*******************************************************************************//
//ANOVA
//*******************************************************************************//

// Constants
var data_anova = [],
    sf_anova = 0.05,
    color_anova = ['#FF9B3C', '#00D0A2', '#64BCFF', '#FF4A3C', '#FFFF00', 
                   '#7272FF', '#55D733', '#1263D2', '#FF0080', '#A1FF00',
                   '#FF1300', '#03899C', '#FFC500', '#2419B2', '#4169E1'];

// Create SVG element
var svg_anova = d3.select("#svg_anova").append("svg").attr("display", "inline-block");

// Create scale functions
var x_scale_anova = d3.scale.ordinal().domain([]),
    y_scale_anova = d3.scale.linear().domain([]);

// Define axis
var x_axis_anova = d3.svg.axis().scale(x_scale_anova).orient("bottom"),
    y_axis_anova = d3.svg.axis().scale(y_scale_anova).orient("left");

// Create axis
var x_axis_group_anova = svg_anova.append("g").attr("class", "x axis"),
    y_axis_group_anova = svg_anova.append("g").attr("class", "y axis");

// Add axis titles
var x_axis_title_anova = svg_anova.append("text").attr("text-anchor", "middle"),                
    y_axis_title_anova = svg_anova.append("text").attr("text-anchor", "middle");

// Create tool tip
var tip_anova = d3.tip().attr('class', 'd3-tip').offset([-10, 0]);

// Drag function
var drag_anova = d3.behavior.drag() 
    .origin(function(d) { 
        return {x: d3.select(this).attr("cx"), y: d3.select(this).attr("cy")}; }) 
    .on('drag', function(d) {
        var r = parseFloat(d3.select(this).attr("r")),
            y = Math.max(y_scale_anova.range()[1] + r, 
                Math.min(y_scale_anova.range()[0] - r, d3.event.y));
        d.v = y_scale_anova.invert(y);
        tip_anova.show(d,this);
        calc_statistic_anova(); })

// Add data points to plot
function add_data_anova(data) {
  // extract data
  data_anova = data.reduce(function(a, b) {
    for (var key in b) {
      a.push({'t':key, 'v': +b[key]});
    }
    return a;
  }, []);
  // update groups
  var keys = d3.keys(data[0])
  // update x axis
  x_scale_anova.domain(keys)
  x_axis_anova.ticks(keys.length);
  x_axis_group_anova.call(x_axis_anova);
  // update y axis
  var min = d3.min(data, function(d) { return d3.min(d3.values(d), function(d) {return +d; });} );
  var max = d3.max(data, function(d) { return d3.max(d3.values(d), function(d) {return +d; });} );
  var offset = (max - min)*sf_anova;
  y_scale_anova.domain([min - offset, max + offset]);
  y_axis_anova.ticks(5);
  y_axis_group_anova.call(y_axis_anova);
  // update titles
  x_axis_title_anova.text();
  y_axis_title_anova.text();
  // update tool tip
  tip_anova.html(function(d,i) {
    return '<strong>Treatment: </strong>' + d.t + '<br>' +
           '<strong>Value: </strong>' + round(d.v,2); });
  // compute color map
  var color = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    color[key] = color_anova[i];
  }
  // add mean line
  svg_anova.selectAll("line.mean").remove();
  svg_anova.selectAll("line.mean")
    .data(keys)
    .enter()
    .append("line")
    .attr("stroke-width", 2)
    .attr("stroke", function(d) { return color[d]; })
    .attr("class", "mean");
  // add new cirlces
  svg_anova.selectAll("circle").remove();
  svg_anova.selectAll("circle")
    .data(data_anova)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("fill", function(d) { return color[d.t]; })
    .style("cursor","pointer")
    .call(drag_anova)
    .on('mousedown', function(d){tip_anova.show(d,this)})
    .on('mouseover', function(d){tip_anova.show(d,this)})
    .on('mouseout', tip_anova.hide);

  $('#svg_anova').parent().on('mouseup', tip_anova.hide);
  // calculate statistics
  calc_statistic_anova();
}


// Compute statistics
function calc_statistic_anova() {
  // check there is data
  if (!data_anova.length) {
    return;
  };
  // update circle positions
  svg_anova.selectAll("circle")
          .attr("cx", function(d) { return x_scale_anova(d.t) + x_scale_anova.rangeBand()/2; })
          .attr("cy", function(d) { return y_scale_anova(d.v); });
  // degrees of freedom
  var df_t = -1,
      df_e = 0,
      treatments = {}
      data = [];
  for (var i = 0; i < data_anova.length; i++) {
    if (treatments[data_anova[i].t]) {
      df_e += 1;
      treatments[data_anova[i].t].push(data_anova[i].v);
    } else {
      df_t += 1;
      treatments[data_anova[i].t] = [data_anova[i].v];
    }
    data.push(data_anova[i].v);
  };
  // square error
  var ss = square_error(data),
      ss_e = 0;
  for (var i in treatments) {
    ss_e += square_error(treatments[i]);
  };
  var ss_t = ss - ss_e;
  var ms_t = ss_t/df_t;
  var ms_e = ss_e/df_e;
  var f = ms_t/ms_e;
  var p = jStat.ftest(f, df_t, df_e);

  // update table
  $('#treatment_sse_anova').html(round(ss_t, 2));
  $('#treatment_df_anova').html(df_t);
  $('#treatment_ms_anova').html(round(ms_t, 2));
  $('#treatment_f_anova').html(round(f, 2));
  $('#treatment_p_anova').html(round(p, 2));
  $('#error_sse_anova').html(round(ss_e, 2));
  $('#error_df_anova').html(df_e);
  $('#error_ms_anova').html(round(ms_e, 2));
  $('#total_sse_anova').html(round(ss, 2));
  $('#total_df_anova').html(df_t + df_e);

  // update mean lines
  svg_anova.selectAll("line.mean")
          .attr("x1", function(d) { return x_scale_anova(d); })
          .attr("x2", function(d) { return x_scale_anova(d) + x_scale_anova.rangeBand(); })
          .attr("y1", function(d) { return y_scale_anova(average(treatments[d])); })
          .attr("y2", function(d) { return y_scale_anova(average(treatments[d])); });

}

function average(data) {
  sum = data.reduce(function(a, b){ return a + b; }, 0);
  return sum/data.length;
}

function square_error(data) {
  mean = average(data);
  error = data.reduce(function(a, b){ return a + Math.pow((b - mean),2); }, 0);
  return error;
}


// handle links
$("#distribution a").on('click', function(){
  curr_dist = $(this).html();
  $('#dist_name').val(curr_dist);
  var dataset = 'data/anova/'+ $(this).attr('value');
  d3.csv(dataset, function(data){
    add_data_anova(data);
  });
});


// Handles anova table highlighting and clicking
var explanation_anova = ["#square_error_anova","#degree_freedom_anova","#mean_error_anova",
                         "#f_statistic_anova","#p_value_anova"];
$("#table_anova").delegate('td','click mouseover mouseleave', function(e) {
  var currColumn = $(this).index() ? $("#table_anova colgroup").eq($(this).index()) : 0;
  if (currColumn) {
    if(e.type == 'mouseover' && !currColumn.hasClass("click") ) {
      currColumn.addClass("hover");
    } else if (e.type == 'click') {
      $(".explanation_anova").css("display","none");
      if(currColumn.hasClass("click")) {
        $("#default_anova").css("display","block");
        currColumn.removeClass("click");
      } else { 
        $("colgroup").removeClass("click");
        currColumn.removeClass("hover");
        currColumn.addClass("click");
        $(explanation_anova[$(this).index()-1]).fadeToggle();
      }
    } else {
      currColumn.removeClass("hover");
    }
  };
});

//Draws SVG and resizes based upon window size
function draw_anova() {
  var parent = d3.select('#svg_anova'),
      w = parent.node().clientWidth,
      h = 400,
      p = 40;

  //Update Scale Range
  x_scale_anova.rangeRoundBands([p, (w - p)], 0.6);
  y_scale_anova.range([(h - p), p]);

  //Update svg size
  svg_anova.attr("width", w).attr("height", h).call(tip_anova);

  //Update Axis
  x_axis_group_anova.attr("transform", "translate(0," + (h - p) + ")").call(x_axis_anova);
  y_axis_group_anova.attr("transform", "translate(" + p + ",0)").call(y_axis_anova);

  //Update Axis Labels
  x_axis_title_anova.attr("transform", "translate("+ (w/2) +","+(h-p/4)+")");
  y_axis_title_anova.attr("transform", "translate("+ (p/4) +","+(h/2)+")rotate(-90)");

  //Update regression table
  $('#table_anova').css('width',w-2*p);

  // update statistics
  calc_statistic_anova();
}

