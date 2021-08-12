//Handles functionality of Regression

$( window ).load(function() {
  //draw_anova();
  drawComb();
  drawDie();
});

//Handles Window Resize
$(window).on("resize", function () {
  //draw_anova();
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

var bubbleTimes = [[0, 0.0008344650268554688], [1, 0.0009775161743164062], [2, 0.0014543533325195312], [3, 0.0018358230590820312], [4, 0.0026702880859375], [5, 0.00324249267578125], [6, 0.004029273986816406], [7, 0.0054836273193359375], [8, 0.006461143493652344], [9, 0.007843971252441406], [10, 0.009083747863769531], [11, 0.010037422180175781], [12, 0.011730194091796875], [13, 0.013518333435058594], [14, 0.015163421630859375], [15, 0.017261505126953125], [16, 0.018978118896484375], [17, 0.021028518676757812], [18, 0.023031234741210938], [19, 0.0255584716796875], [20, 0.02753734588623047], [21, 0.030994415283203125], [22, 0.03440380096435547], [23, 0.036334991455078125], [24, 0.03857612609863281], [25, 0.041174888610839844], [26, 0.04374980926513672], [27, 0.04715919494628906], [28, 0.04982948303222656], [29, 0.05469322204589844], [30, 0.058388710021972656], [31, 0.06096363067626953], [32, 0.06530284881591797], [33, 0.0680685043334961], [34, 0.06842613220214844], [35, 0.07257461547851562], [36, 0.07579326629638672], [37, 0.07948875427246094], [38, 0.08471012115478516], [39, 0.08821487426757812], [40, 0.09493827819824219], [41, 0.12063980102539062], [42, 0.10421276092529297], [43, 0.10437965393066406], [44, 0.10809898376464844], [45, 0.11565685272216797], [46, 0.11985301971435547], [47, 0.12407302856445312], [48, 0.1291036605834961], [49, 0.13480186462402344], [50, 0.1408100128173828], [51, 0.15270709991455078], [52, 0.17566680908203125], [53, 0.15881061553955078], [54, 0.162506103515625], [55, 0.16660690307617188], [56, 0.17418861389160156], [57, 0.18143653869628906], [58, 0.1848459243774414], [59, 0.21347999572753906], [60, 0.2016305923461914], [61, 0.20513534545898438], [62, 0.21119117736816406], [63, 0.22821426391601562], [64, 0.23059844970703125], [65, 0.2725362777709961], [66, 0.24023056030273438], [67, 0.24254322052001953], [68, 0.2532482147216797], [69, 0.2602577209472656], [70, 0.2798318862915039], [71, 0.2917289733886719], [72, 0.27937889099121094], [73, 0.3025054931640625], [74, 0.29380321502685547], [75, 0.3371715545654297], [76, 0.32122135162353516], [77, 0.3211021423339844], [78, 0.3339052200317383], [79, 0.34637451171875], [80, 0.35278797149658203], [81, 0.35750865936279297], [82, 0.36950111389160156], [83, 0.3757476806640625], [84, 0.3843069076538086], [85, 0.3918647766113281], [86, 0.40314197540283203], [87, 0.4119873046875], [88, 0.4216432571411133], [89, 0.4273653030395508], [90, 0.43790340423583984], [91, 0.44708251953125], [92, 0.4622936248779297], [93, 0.4674673080444336], [94, 0.47702789306640625], [95, 0.4850625991821289], [96, 0.4972219467163086], [97, 0.5062341690063477], [98, 0.49669742584228516], [99, 0.5061864852905273], [100, 0.5138635635375977], [101, 0.5363225936889648], [102, 0.5404949188232422], [103, 0.5494356155395508], [104, 0.5562782287597656], [105, 0.601959228515625], [106, 0.5841970443725586], [107, 0.597834587097168], [108, 0.6188392639160156], [109, 0.7028579711914062], [110, 0.6662368774414062], [111, 0.6601572036743164], [112, 0.6556034088134766], [113, 0.6556987762451172], [114, 0.6824970245361328], [115, 0.686335563659668], [116, 0.6994009017944336], [117, 0.7070064544677734], [118, 0.7339954376220703], [119, 0.7305145263671875], [120, 0.7477521896362305], [121, 0.7601499557495117], [122, 0.7705211639404297], [123, 0.7787704467773438], [124, 0.8008480072021484], [125, 0.7998228073120117], [126, 0.8167266845703125], [127, 0.8098602294921875], [128, 0.8415460586547852], [129, 0.8424043655395508], [130, 0.9163379669189453], [131, 0.867009162902832], [132, 0.8862733840942383], [133, 0.8993864059448242], [134, 1.006150245666504], [135, 0.9236335754394531], [136, 0.9590864181518555], [137, 0.9686708450317383], [138, 0.9893417358398438], [139, 1.001739501953125], [140, 1.0023117065429688], [141, 1.017451286315918], [142, 1.0617494583129883], [143, 1.0545730590820312], [144, 1.074051856994629], [145, 1.0846138000488281], [146, 1.0754108428955078], [147, 1.093459129333496], [148, 1.1512517929077148], [149, 1.1208057403564453], [150, 1.1563539505004883], [151, 1.1416435241699219], [152, 1.1693477630615234], [153, 1.1783838272094727], [154, 1.2738466262817383], [155, 1.2237071990966797], [156, 1.2510299682617188], [157, 1.2551307678222656], [158, 1.2629270553588867], [159, 1.3010740280151367], [160, 1.3988494873046875], [161, 1.3309240341186523], [162, 1.3695478439331055], [163, 1.3531208038330078], [164, 1.369929313659668], [165, 1.4035224914550781], [166, 1.404404640197754], [167, 1.4209985733032227], [168, 1.4631271362304688], [169, 1.4880180358886719], [170, 1.4945268630981445], [171, 1.5131235122680664], [172, 1.511526107788086], [173, 1.4919281005859375], [174, 1.5254974365234375], [175, 1.5706300735473633], [176, 1.5707015991210938], [177, 1.657724380493164], [178, 1.5836477279663086], [179, 1.6030311584472656], [180, 1.634979248046875], [181, 1.6619205474853516], [182, 1.6566991806030273], [183, 1.6600370407104492], [184, 1.6836166381835938], [185, 1.7036914825439453], [186, 1.729130744934082], [187, 1.7910480499267578], [188, 1.7648935317993164], [189, 1.7885923385620117], [190, 1.857447624206543], [191, 1.9069671630859375], [192, 1.9318103790283203], [193, 2.0026445388793945], [194, 2.0076990127563477], [195, 1.9801616668701172], [196, 2.077484130859375], [197, 2.205514907836914], [198, 2.543497085571289]];

var insertTimes = [[0, 0.0003814697265625], [1, 0.0005483627319335938], [2, 0.00095367431640625], [3, 0.0010728836059570312], [4, 0.0013113021850585938], [5, 0.0016927719116210938], [6, 0.0023126602172851562], [7, 0.00247955322265625], [8, 0.0034332275390625], [9, 0.003814697265625], [10, 0.003981590270996094], [11, 0.005340576171875], [12, 0.0060558319091796875], [13, 0.0067234039306640625], [14, 0.0074863433837890625], [15, 0.007987022399902344], [16, 0.009846687316894531], [17, 0.009417533874511719], [18, 0.010371208190917969], [19, 0.011491775512695312], [20, 0.013613700866699219], [21, 0.015211105346679688], [22, 0.01544952392578125], [23, 0.01728534698486328], [24, 0.019121170043945312], [25, 0.02129077911376953], [26, 0.021719932556152344], [27, 0.023508071899414062], [28, 0.02357959747314453], [29, 0.025987625122070312], [30, 0.028085708618164062], [31, 0.025844573974609375], [32, 0.0324249267578125], [33, 0.03333091735839844], [34, 0.035834312438964844], [35, 0.03743171691894531], [36, 0.03724098205566406], [37, 0.03972053527832031], [38, 0.04093647003173828], [39, 0.044798851013183594], [40, 0.04673004150390625], [41, 0.048542022705078125], [42, 0.05021095275878906], [43, 0.05373954772949219], [44, 0.05600452423095703], [45, 0.05645751953125], [46, 0.05767345428466797], [47, 0.06222724914550781], [48, 0.06511211395263672], [49, 0.07038116455078125], [50, 0.07376670837402344], [51, 0.06978511810302734], [52, 0.07395744323730469], [53, 0.07958412170410156], [54, 0.08130073547363281], [55, 0.08432865142822266], [56, 0.09305477142333984], [57, 0.0894784927368164], [58, 0.08912086486816406], [59, 0.09703636169433594], [60, 0.1024484634399414], [61, 0.1026153564453125], [62, 0.09920597076416016], [63, 0.10256767272949219], [64, 0.10986328125], [65, 0.10876655578613281], [66, 0.11391639709472656], [67, 0.121307373046875], [68, 0.12595653533935547], [69, 0.12793540954589844], [70, 0.1299142837524414], [71, 0.13701915740966797], [72, 0.13263225555419922], [73, 0.14429092407226562], [74, 0.14312267303466797], [75, 0.1430511474609375], [76, 0.15079975128173828], [77, 0.1514434814453125], [78, 0.16367435455322266], [79, 0.16162395477294922], [80, 0.16608238220214844], [81, 0.1695871353149414], [82, 0.16994476318359375], [83, 0.18329620361328125], [84, 0.18439292907714844], [85, 0.18830299377441406], [86, 0.18985271453857422], [87, 0.1933574676513672], [88, 0.19359588623046875], [89, 0.19266605377197266], [90, 0.21097660064697266], [91, 0.21109580993652344], [92, 0.23052692413330078], [93, 0.21729469299316406], [94, 0.26092529296875], [95, 0.2317667007446289], [96, 0.2512931823730469], [97, 0.24716854095458984], [98, 0.24259090423583984], [99, 0.24936199188232422], [100, 0.25594234466552734], [101, 0.261688232421875], [102, 0.2634286880493164], [103, 0.2653360366821289], [104, 0.26988983154296875], [105, 0.2820730209350586], [106, 0.27463436126708984], [107, 0.2894163131713867], [108, 0.2838611602783203], [109, 0.30417442321777344], [110, 0.30722618103027344], [111, 0.31082630157470703], [112, 0.3132820129394531], [113, 0.31185150146484375], [114, 0.3282785415649414], [115, 0.33249855041503906], [116, 0.35660266876220703], [117, 0.34384727478027344], [118, 0.35316944122314453], [119, 0.3694295883178711], [120, 0.3699779510498047], [121, 0.3596067428588867], [122, 0.3771543502807617], [123, 0.3830909729003906], [124, 0.39343833923339844], [125, 0.4057884216308594], [126, 0.4088878631591797], [127, 0.42793750762939453], [128, 0.41375160217285156], [129, 0.4055023193359375], [130, 0.44531822204589844], [131, 0.41637420654296875], [132, 0.48029422760009766], [133, 0.4522562026977539], [134, 0.4266500473022461], [135, 0.45402050018310547], [136, 0.46525001525878906], [137, 0.4629850387573242], [138, 0.4638195037841797], [139, 0.49347877502441406], [140, 0.4927635192871094], [141, 0.50048828125], [142, 0.49774646759033203], [143, 0.5226373672485352], [144, 0.5179166793823242], [145, 0.5090951919555664], [146, 0.5721092224121094], [147, 0.5655288696289062], [148, 0.5568265914916992], [149, 0.5559444427490234], [150, 0.554966926574707], [151, 0.5640745162963867], [152, 0.5753755569458008], [153, 0.5868673324584961], [154, 0.570368766784668], [155, 0.5928754806518555], [156, 0.5944728851318359], [157, 0.6051063537597656], [158, 0.6162881851196289], [159, 0.6447553634643555], [160, 0.6357192993164062], [161, 0.6295204162597656], [162, 0.6623983383178711], [163, 0.6532669067382812], [164, 0.6796121597290039], [165, 0.6737947463989258], [166, 0.6692171096801758], [167, 0.7034778594970703], [168, 0.7204532623291016], [169, 0.7035493850708008], [170, 0.7190704345703125], [171, 0.7224798202514648], [172, 0.7123470306396484], [173, 0.7256984710693359], [174, 0.7648944854736328], [175, 0.8026838302612305], [176, 0.746607780456543], [177, 0.770878791809082], [178, 0.7747650146484375], [179, 0.792241096496582], [180, 0.8014202117919922], [181, 0.8036613464355469], [182, 0.8385658264160156], [183, 0.7997989654541016], [184, 0.8493661880493164], [185, 0.8830070495605469], [186, 0.8424282073974609], [187, 0.8827924728393555], [188, 0.8809089660644531], [189, 0.8684396743774414], [190, 0.8981466293334961], [191, 0.9035110473632812], [192, 0.9458780288696289], [193, 0.907588005065918], [194, 0.9113788604736328], [195, 0.966644287109375], [196, 0.9495973587036133], [197, 0.9386777877807617], [198, 1.0003089904785156]];

var mergeTimes = [[0, 0.00019073486328125], [1, 0.0026702880859375], [2, 0.004291534423828125], [3, 0.006508827209472656], [4, 0.009012222290039062], [5, 0.011706352233886719], [6, 0.013852119445800781], [7, 0.016450881958007812], [8, 0.01957416534423828], [9, 0.022125244140625], [10, 0.024771690368652344], [11, 0.027871131896972656], [12, 0.03025531768798828], [13, 0.03325939178466797], [14, 0.036072731018066406], [15, 0.039315223693847656], [16, 0.06537437438964844], [17, 0.04496574401855469], [18, 0.04858970642089844], [19, 0.051403045654296875], [20, 0.054836273193359375], [21, 0.05831718444824219], [22, 0.061202049255371094], [23, 0.06427764892578125], [24, 0.06880760192871094], [25, 0.07102489471435547], [26, 0.07123947143554688], [27, 0.07433891296386719], [28, 0.0820159912109375], [29, 0.09450912475585938], [30, 0.08306503295898438], [31, 0.08575916290283203], [32, 0.0894308090209961], [33, 0.09305477142333984], [34, 0.09677410125732422], [35, 0.10056495666503906], [36, 0.10421276092529297], [37, 0.10690689086914062], [38, 0.11746883392333984], [39, 0.11010169982910156], [40, 0.1131296157836914], [41, 0.11620521545410156], [42, 0.12350082397460938], [43, 0.11780261993408203], [44, 0.1271963119506836], [45, 0.16047954559326172], [46, 0.148773193359375], [47, 0.14531612396240234], [48, 0.17049312591552734], [49, 0.1456737518310547], [50, 0.1491546630859375], [51, 0.1493215560913086], [52, 0.14514923095703125], [53, 0.15437602996826172], [54, 0.15692710876464844], [55, 0.14889240264892578], [56, 0.15969276428222656], [57, 0.16672611236572266], [58, 0.18603801727294922], [59, 0.17871856689453125], [60, 0.17273426055908203], [61, 0.1778125762939453], [62, 0.17337799072265625], [63, 0.2073526382446289], [64, 0.17957687377929688], [65, 0.18527507781982422], [66, 0.18928050994873047], [67, 0.18341541290283203], [68, 0.18765926361083984], [69, 0.19185543060302734], [70, 0.20511150360107422], [71, 0.2050161361694336], [72, 0.20341873168945312], [73, 0.20341873168945312], [74, 0.206756591796875], [75, 0.21257400512695312], [76, 0.19872188568115234], [77, 0.18918514251708984], [78, 0.196075439453125], [79, 0.1894235610961914], [80, 0.1917123794555664], [81, 0.19435882568359375], [82, 0.1967906951904297], [83, 0.199127197265625], [84, 0.21152496337890625], [85, 0.21333694458007812], [86, 0.2112865447998047], [87, 0.21104812622070312], [88, 0.2132892608642578], [89, 0.21653175354003906], [90, 0.22945404052734375], [91, 0.22113323211669922], [92, 0.22356510162353516], [93, 0.22647380828857422], [94, 0.22900104522705078], [95, 0.23601055145263672], [96, 0.2410888671875], [97, 0.23715496063232422], [98, 0.23965835571289062], [99, 0.2429962158203125], [100, 0.24580955505371094], [101, 0.2609729766845703], [102, 0.2514839172363281], [103, 0.25429725646972656], [104, 0.25641918182373047], [105, 0.2646446228027344], [106, 0.2688407897949219], [107, 0.2648591995239258], [108, 0.26781558990478516], [109, 0.2707242965698242], [110, 0.2735137939453125], [111, 0.2758502960205078], [112, 0.2782583236694336], [113, 0.28083324432373047], [114, 0.2845287322998047], [115, 0.28655529022216797], [116, 0.2895355224609375], [117, 0.2928018569946289], [118, 0.29578208923339844], [119, 0.2990245819091797], [120, 0.30105113983154297], [121, 0.3040790557861328], [122, 0.3071784973144531], [123, 0.30972957611083984], [124, 0.3129005432128906], [125, 0.3125190734863281], [126, 0.30341148376464844], [127, 0.31185150146484375], [128, 0.308990478515625], [129, 0.3120899200439453], [130, 0.3152132034301758], [131, 0.31821727752685547], [132, 0.3211021423339844], [133, 0.32355785369873047], [134, 0.32727718353271484], [135, 0.34258365631103516], [136, 0.33321380615234375], [137, 0.3384590148925781], [138, 0.33860206604003906], [139, 0.3415346145629883], [140, 0.3493309020996094], [141, 0.34766197204589844], [142, 0.3494739532470703], [143, 0.3560066223144531], [144, 0.35605430603027344], [145, 0.35898685455322266], [146, 0.37391185760498047], [147, 0.36399364471435547], [148, 0.36323070526123047], [149, 0.36580562591552734], [150, 0.3676176071166992], [151, 0.36683082580566406], [152, 0.3697633743286133], [153, 0.38483142852783203], [154, 0.37970542907714844], [155, 0.3774881362915039], [156, 0.3863096237182617], [157, 0.3888845443725586], [158, 0.3849983215332031], [159, 0.3920316696166992], [160, 0.45180320739746094], [161, 0.4436969757080078], [162, 0.42519569396972656], [163, 0.4275798797607422], [164, 0.4714012145996094], [165, 0.46210289001464844], [166, 0.48797130584716797], [167, 0.43222904205322266], [168, 0.4265308380126953], [169, 0.4240274429321289], [170, 0.4273414611816406], [171, 0.44295787811279297], [172, 0.4328727722167969], [173, 0.43506622314453125], [174, 0.4495382308959961], [175, 0.44095516204833984], [176, 0.4437685012817383], [177, 0.4517555236816406], [178, 0.46787261962890625], [179, 0.4534006118774414], [180, 0.45592784881591797], [181, 0.4587888717651367], [182, 0.4712104797363281], [183, 0.4754066467285156], [184, 0.4822969436645508], [185, 0.48630237579345703], [186, 0.47261714935302734], [187, 0.48370361328125], [188, 0.48584938049316406], [189, 0.4880666732788086], [190, 0.4830598831176758], [191, 0.5002737045288086], [192, 0.48966407775878906], [193, 0.49169063568115234], [194, 0.49440860748291016], [195, 0.5024433135986328], [196, 0.5118846893310547], [197, 0.5033969879150391], [198, 0.5103349685668945]];

var quickTimes = [[0, 0.00057220458984375], [1, 0.00152587890625], [2, 0.0021457672119140625], [3, 0.0026941299438476562], [4, 0.00324249267578125], [5, 0.004553794860839844], [6, 0.005054473876953125], [7, 0.006103515625], [8, 0.0069141387939453125], [9, 0.007700920104980469], [10, 0.009226799011230469], [11, 0.009369850158691406], [12, 0.010156631469726562], [13, 0.011682510375976562], [14, 0.011801719665527344], [15, 0.014662742614746094], [16, 0.014448165893554688], [17, 0.015020370483398438], [18, 0.015473365783691406], [19, 0.016999244689941406], [20, 0.01735687255859375], [21, 0.019884109497070312], [22, 0.01914501190185547], [23, 0.019407272338867188], [24, 0.020360946655273438], [25, 0.021338462829589844], [26, 0.021409988403320312], [27, 0.021791458129882812], [28, 0.022530555725097656], [29, 0.02396106719970703], [30, 0.02448558807373047], [31, 0.02639293670654297], [32, 0.02639293670654297], [33, 0.02791881561279297], [34, 0.028395652770996094], [35, 0.02720355987548828], [36, 0.029325485229492188], [37, 0.030279159545898438], [38, 0.030279159545898438], [39, 0.03304481506347656], [40, 0.03261566162109375], [41, 0.03368854522705078], [42, 0.04146099090576172], [43, 0.03204345703125], [44, 0.035881996154785156], [45, 0.037169456481933594], [46, 0.036072731018066406], [47, 0.03581047058105469], [48, 0.04189014434814453], [49, 0.03707408905029297], [50, 0.03921985626220703], [51, 0.043010711669921875], [52, 0.03876686096191406], [53, 0.04074573516845703], [54, 0.04134178161621094], [55, 0.04134178161621094], [56, 0.04019737243652344], [57, 0.04115104675292969], [58, 0.043082237243652344], [59, 0.04305839538574219], [60, 0.04279613494873047], [61, 0.040531158447265625], [62, 0.04181861877441406], [63, 0.04322528839111328], [64, 0.045990943908691406], [65, 0.04935264587402344], [66, 0.04973411560058594], [67, 0.045037269592285156], [68, 0.04870891571044922], [69, 0.04665851593017578], [70, 0.053882598876953125], [71, 0.046563148498535156], [72, 0.04849433898925781], [73, 0.046539306640625], [74, 0.05278587341308594], [75, 0.052046775817871094], [76, 0.04982948303222656], [77, 0.05249977111816406], [78, 0.06306171417236328], [79, 0.051665306091308594], [80, 0.05850791931152344], [81, 0.062274932861328125], [82, 0.05459785461425781], [83, 0.05745887756347656], [84, 0.05676746368408203], [85, 0.05867481231689453], [86, 0.06070137023925781], [87, 0.057768821716308594], [88, 0.06022453308105469], [89, 0.061011314392089844], [90, 0.06551742553710938], [91, 0.06551742553710938], [92, 0.061583518981933594], [93, 0.061440467834472656], [94, 0.0682830810546875], [95, 0.06976127624511719], [96, 0.06737709045410156], [97, 0.067901611328125], [98, 0.07464885711669922], [99, 0.07009506225585938], [100, 0.08018016815185547], [101, 0.07259845733642578], [102, 0.07770061492919922], [103, 0.08182525634765625], [104, 0.0791311264038086], [105, 0.07464885711669922], [106, 0.07290840148925781], [107, 0.07343292236328125], [108, 0.07216930389404297], [109, 0.07207393646240234], [110, 0.08788108825683594], [111, 0.1415729522705078], [112, 0.0835418701171875], [113, 0.08807182312011719], [114, 0.10280609130859375], [115, 0.07250308990478516], [116, 0.07529258728027344], [117, 0.07445812225341797], [118, 0.07660388946533203], [119, 0.06978511810302734], [120, 0.07772445678710938], [121, 0.07436275482177734], [122, 0.07700920104980469], [123, 0.07190704345703125], [124, 0.0728607177734375], [125, 0.07636547088623047], [126, 0.07884502410888672], [127, 0.08356571197509766], [128, 0.08361339569091797], [129, 0.07731914520263672], [130, 0.07021427154541016], [131, 0.07312297821044922], [132, 0.07214546203613281], [133, 0.0732421875], [134, 0.06878376007080078], [135, 0.06985664367675781], [136, 0.07131099700927734], [137, 0.07205009460449219], [138, 0.07476806640625], [139, 0.0741720199584961], [140, 0.07653236389160156], [141, 0.07753372192382812], [142, 0.07424354553222656], [143, 0.07216930389404297], [144, 0.07390975952148438], [145, 0.07410049438476562], [146, 0.07178783416748047], [147, 0.07889270782470703], [148, 0.080108642578125], [149, 0.07998943328857422], [150, 0.08153915405273438], [151, 0.07641315460205078], [152, 0.08373260498046875], [153, 0.07698535919189453], [154, 0.079345703125], [155, 0.07679462432861328], [156, 0.0768423080444336], [157, 0.0865936279296875], [158, 0.08592605590820312], [159, 0.08330345153808594], [160, 0.08411407470703125], [161, 0.08075237274169922], [162, 0.08463859558105469], [163, 0.08099079132080078], [164, 0.08852481842041016], [165, 0.09088516235351562], [166, 0.08890628814697266], [167, 0.08521080017089844], [168, 0.08487701416015625], [169, 0.08461475372314453], [170, 0.09016990661621094], [171, 0.08730888366699219], [172, 0.08885860443115234], [173, 0.0894784927368164], [174, 0.08697509765625], [175, 0.08814334869384766], [176, 0.08759498596191406], [177, 0.09191036224365234], [178, 0.09059906005859375], [179, 0.09162425994873047], [180, 0.08895397186279297], [181, 0.08988380432128906], [182, 0.09469985961914062], [183, 0.09033679962158203], [184, 0.09036064147949219], [185, 0.09129047393798828], [186, 0.10180473327636719], [187, 0.09424686431884766], [188, 0.09622573852539062], [189, 0.09605884552001953], [190, 0.09431838989257812], [191, 0.09341239929199219], [192, 0.09465217590332031], [193, 0.09751319885253906], [194, 0.09834766387939453], [195, 0.10228157043457031], [196, 0.1024484634399414], [197, 0.09996891021728516], [198, 0.10097026824951172]];
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
var xaxisTextDie = expectedPlot.append("text").attr("text-anchor", "middle").text("Array Size");
var yaxisDie =expectedPlot.append("g").attr("class", "y axis");
var yaxisTextDie = expectedPlot.append("text").attr("text-anchor", "middle").text("Average Runtime over 10 Trials (in seconds)");
var pathBubble = expectedPlot.append("path").attr("id", "bubble");
var pathInsert = expectedPlot.append("path").attr("id", "insert");
var pathMerge = expectedPlot.append("path").attr("id", "merge");
var pathQuick = expectedPlot.append("path").attr("id", "quick");
    
//X scale 
var xScaleExpected = d3.scale.linear().domain([1, maxXExpected]);

//Y Scale
var yScaleExpected = d3.scale.linear().domain([0, 2]);

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
	pathBubble
	  .datum(bubbleTimes)
	  .attr("d", line);
	pathInsert
	  .datum(insertTimes)
	  .attr("d", line);
	pathMerge
	  .datum(mergeTimes)
	  .attr("d", line);
	pathQuick
	  .datum(quickTimes)
	  .attr("d", line);
}

var tipDieFocus = d3.tip().attr('id', 'tipDieFocus').attr('class', 'd3-tip').offset([0, 10]).direction('e');

var focus = expectedPlot.append("g").style("display", "none");

focus.append("rect").attr("y", 0).style('fill','white').style('opacity','0.75');

focus.append("line").attr('id','focusLine').style("stroke-dasharray", ("2, 2"));

focus.append("circle").attr("r", 5).attr('id','bubbleCircle');
focus.append("circle").attr("r", 5).attr('id','insertCircle');
focus.append("circle").attr("r", 5).attr('id','mergeCircle');
focus.append("circle").attr("r", 5).attr('id','quickCircle');


expectedPlot.on("mouseover", mousemove).on("mouseout", mousemove).on("mousemove", mousemove);

function mousemove() {
	var x = round(xScaleExpected.invert(d3.mouse(this)[0]),0);
	var y = yScaleExpected.invert(d3.mouse(this)[1]);
	if (x>0 && x< 199 && y>=0 && y<=6) { //modified bounds for functions
	//if (x>0 && x<expectedData.length+1 && y>=0 && y<=6) {
        focus.style("display", null)
        //var y = expectedData[x-1][1]; //modify this function
        focus.select('#bubbleCircle').attr("cx", xScaleExpected(x)).attr('cy',yScaleExpected(bubbleTimes[x][1]));
        focus.select('#insertCircle').attr("cx", xScaleExpected(x)).attr('cy',yScaleExpected(insertTimes[x][1]));
        focus.select('#mergeCircle').attr("cx", xScaleExpected(x)).attr('cy',yScaleExpected(mergeTimes[x][1]));
        focus.select('#quickCircle').attr("cx", xScaleExpected(x)).attr('cy',yScaleExpected(quickTimes[x][1]));
        //focus.select('#averageCircle').attr("cx", xScaleExpected(x)).attr('cy',yScaleExpected(0.1));
        focus.select('rect').attr("x", xScaleExpected(x)).attr("height",yScaleExpected(0)-0).attr("width", xScaleExpected(maxXExpected - x));
        focus.select('line').attr("x1", xScaleExpected(x)).attr("y1", yScaleExpected(6)).attr("x2", xScaleExpected(x)).attr("y2", yScaleExpected(0));
        xaxisDie.call(xAxisExpected.tickValues([x]));
        tipDieFocus.html(function(d) { 
            return 'Bubblesort time: <span id="bubbleFocus">'+round(bubbleTimes[x][1],3)+'</span><br>'+
                    'Insertion sort time: <span id="insertFocus">' + round(insertTimes[x][1],3) + '</span><br>' + 
                   'Merge sort time: <span id="mergeFocus">' + round(mergeTimes[x][1],3) + '</span><br>' + 
                   'Quicksort time: <span id="quickFocus">'+round(quickTimes[x][1],3)+'</span>';});
                   
        tipDieFocus.show(document.getElementById("mergeCircle"));
    } else {
		focus.style("display", "none");
		tipDieFocus.hide();
		xaxisDie.call(xAxisExpected.tickValues(null));
	}
}

//Update SVG based on width of container
function drawDie(){
    /*
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
    */

	//Constants Expectation Die
    var w = d3.select('#plotDie').node().clientWidth;
    var h = 550;
    var padExp = 50;

    //Update SVG
	expectedPlot.attr("width", w).attr("height", h).style("cursor",	"crosshair").call(tipDieFocus);

	//Update Scales
	xScaleExpected.range([padExp, (w - padExp)]);
	yScaleExpected.range([(h - padExp), padExp]);

	//Update Axis
	xaxisDie.attr("transform", "translate(0," + (h - padExp) + ")").call(xAxisExpected);
	yaxisDie.attr("transform", "translate(" + padExp + ",0)").call(yAxisExpected);

	//Update Labels
	xaxisTextDie.attr("transform", "translate("+ (w/2) +","+(h - 10)+")")
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
    branches = 4;

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
    if (combinations) newWidth = 1; //constant width for O(n) visualization
    //if (combinations) newWidth = Math.log(newHeight);
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

function updateNumber2() {
  branches =  $("#number2").slider('getValue');
  update(dur);
}

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

  var tickArray2 = [1,2,3,4];
  //slider for other value
  $("#number2").css('width',width).css('margin-left',margin.left);
  $("#number2").slider('destroy');
  $("#number2").slider({
      value: number, 
      max: size,
      ticks: tickArray2,
      ticks_labels: tickArray2
  }).on('change', updateNumber2);

  //Update Nodes
  drawTree(0);
  update(0);
}



//*******************************************************************************//
//Expected Runtimes (Hash Table) 
//*******************************************************************************//

var LinkedList = function (){
  this.head = null;
  this.tail = null;
};
LinkedList.prototype.addToTail = function(value){
  var node = this.makeNode(value);
  if (!this.head){ this.head = node; }
  if (this.tail){ this.tail.next = node; }
  this.tail = node;
}
LinkedList.prototype.removeHead = function(){
  if (this.head){
    var currentHeadValue = this.head.value;
    if (this.head.next){
      this.head = this.head.next;
    } else {
      this.head = null;
      this.tail = null;
    }
    return currentHeadValue
  } else {
    console.log('No head to remove.');
  }
}

LinkedList.prototype.removeElement = function() {
  var toRemove = 500;
  var currentNode = this.head;
  if (currentNode && currentNode.value > toRemove) {
    return this.removeHead();
  }
  while (currentNode && currentNode.next){
    if (currentNode.next.value > toRemove) {
      //remove the node
      var tempNode = currentNode.next;
      currentNode.next = currentNode.next.next; 
      if (this.tail === tempNode) { //If deleting tail, reupdate
        this.tail = currentNode;
      }
      return tempNode;
    }
    currentNode = currentNode.next;
  }
}

LinkedList.prototype.contains = function(value){
  var currentNode = this.head;
  while (currentNode && currentNode.value){
    if (currentNode.value === value) return true;
    currentNode = currentNode.next;
  }
  return false;
}

LinkedList.prototype.makeNode = function(value){
  var node = {};
  node.value = value;
  node.next = null;
  return node;
};
var MAXRADIUS = 30;
var WIDTH = 960;
var HEIGHT = 500 - 97;
var TEXT_PADDING = 8;
var FONT_SIZE = 14;
var MARGIN = 24;
var N_BUCKETS = 8;
var COLORS = ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"];

var linkedLists = [];
var linkedData = [];
for (var j = 0; j < N_BUCKETS; j++) {
  linkedLists.push(new LinkedList());
  initializeLinkedList(linkedLists[j]);
  linkedData.push(flattenLinkedList(linkedLists[j]));
}

var svg = d3.select('#svg_anova').append('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT)
  .append('g')
    .attr('transform', 'translate(' + MARGIN + ',' + MARGIN + ')' )
    //.style('background-color', '#665A88')

var BOX_SIZE = 2 * (WIDTH - 2*MARGIN) / (linkedData[0].length + 1);
var BOX_PORTION_OFFSET = MAXRADIUS*2;
var MAX_BOX_PORTION = HEIGHT - BOX_PORTION_OFFSET;

for (var j = 0; j < N_BUCKETS; j++) {
  svg.selectAll('.nodes-circ-' + j).data(linkedData[j], function(d){return d;}).enter()
    .append('circle')
      .attr('class', 'nodes-circ-' + j)
      .attr('r', function(d){return d/25;})
      .attr('cx', function(d, i){return i * (BOX_SIZE)/2 + BOX_SIZE/2;})
      .attr('cy', MAXRADIUS * (j + 1))
      .attr('fill', 'none')
      .attr('stroke', COLORS[j])
      .attr('opacity', 0.85)
      .attr('id', function(d, i){return 'node-' + d;})
}

function updateViz(){
  var nodesCirc = [];
  var maxLen = 0;
  for (var j = 0; j < N_BUCKETS; j++) {
    linkedData[j] = flattenLinkedList(linkedLists[j]);
    nodesCirc.push(svg.selectAll('.nodes-circ-' + j).data(linkedData[j], function(d) {return d;}));
    maxLen = maxLen > linkedData[j].length ? maxLen : linkedData[j].length;
  }

  BOX_SIZE = 2 * (WIDTH - 2*MARGIN) / (maxLen + 1);
  for (var j = 0; j < N_BUCKETS; j++) {
    // update
    nodesCirc[j].transition().duration(1000)
      .attr('cx', function(d, i){return i * (BOX_SIZE)/2 + BOX_SIZE/2;})
      .attr('id', function(d, i){return 'node-' + d;})
    //enter
    nodesCirc[j].enter()
      .append('circle')
        .attr('class', 'nodes-circ-' + j)
        .attr('r', function(d){return 1e-6;})
        .attr('cx', function(d, i){return i * (BOX_SIZE)/2 + BOX_SIZE/2;})
        .attr('cy', MAXRADIUS * (j + 1))
        .attr('fill', 'none')
        .attr('stroke', COLORS[j])
        .attr('opacity', 0.85)
        .attr('id', function(d, i){return 'node-' + d;})
        .transition()
        .duration(500)
        .attr('r', function(d){return d/25;});
    //exit
    nodesCirc[j].exit()
      .transition().duration(1000)
        .attr('opacity', 0)
      .remove()
  }
}

//because this is a hash table, I will assume that every value is unique
//Which is valid because of chaining (but we will need to do find every time)
var endPoint = 500;
function walkListViz(node, choice) { 
  //basically walk through the linked list and make each node flash when visited
  if ((node === null) || node.value > endPoint) { //execute callback
    var value = linkedLists[choice].removeElement();
    updateViz();
    return; //no nodes left
  }
  //var cursor = linkedList.head;
  var nodeCirc = svg.select('#node-' + node.value);
  //console.log(node.value);
  nodeCirc
    .attr('fill', 'white')
    .transition()
    .duration(500)
    .attr('fill', 'green')
    .transition()
    .duration(500)
    .attr('fill', 'white')
    .each('end', function(d) {
      walkListViz(node.next, choice);
    });
}

function flattenLinkedList(linkedList){
  var data = [];
  var cursor = linkedList.head;
  while (cursor && cursor.value){
    data.push(cursor.value);
    cursor = cursor.next;
  }
  return data;
}

function initializeLinkedList(linkedList){
  var initializeAmount = d3.range(0,11);
  initializeAmount.forEach(function(){
    //linkedList.addToTail(Math.round(Math.random()*MAXRADIUS*25));
  })
}

function randomLinkedListAction(linkedList){
  var action = Math.round(Math.random()*2);
  if (action === 0){
    manualAddToTail();
  } else if (action === 1){
    manualRemoveHead();
  }
}

function manualAddToTail(){
  var value = Math.round(Math.random()*(MAXRADIUS - 1)*25) + 25;
  //var choice = Math.floor(Math.random() * N_BUCKETS);
  linkedLists[value % N_BUCKETS].addToTail(value);
  updateViz();
}

function manualRemoveHead(){
  var value = linkedList.removeHead();
  updateViz();
}

function manualRemoveElement() {
  var choice = Math.floor(Math.random() * N_BUCKETS);
  //remove first element within range
  walkListViz(linkedLists[choice].head, choice);
}

