var jsonfile = 'js/data.json';
var data = JSON.parse(getData(jsonfile));
var answers = $.getJSON('#quizanswers');
var questionLength = $("#questionlength").text();
var transitiontime = 1500;
var fadetime = 100;
var diastolicBump = 200;
var totalquestions = 0;
var qQuest = 0;

// init our sound object
// var heartSound = new buzz.sound(["audio/heart.mp3","audio/heart.wav"]);
// var airSound = new buzz.sound(["audio/air.mp3","audio/air.wav"]);
// var release = new buzz.sound(["audio/released.mp3","audio/released.wav"]);
var heartSound = new buzz.sound("audio/heart", {
    formats: ["mp3", "ogg", "wav" ],
    preload: true
});
var airSound = new buzz.sound(["audio/air.mp3","audio/air.wav"]);
var release = new buzz.sound(["audio/released.mp3","audio/released.wav"]);


//var duration = data.questions[qQuest].duration;
var muteOff = $("#mu").attr("src", "images/mute-off.png");	
var muteOn =  $("#mu").attr("src", "images/mute.png");
// add this number to angle for each pump of the bulb
var pumpAngle = 40;
// is bp hear pumping?
var beatingHeart = false;

// maxPressure 
var maxPressure = parseInt(data.bpmaxpressure)+20;
var bpStartingPointY = "-812.36218";
var bpStartingPoint = "t0,"+bpStartingPointY;
var bpDeflateRate = 30000;

// get our blood pressure instructions
var bpInstructionText = data.bpinstructiontext;
var bpInstructionsAirReleaseText = data.bpinstructionsairreleasetext;
var bpInstructionsDuringNeedleDrop = 'Take reading...';


$(document).ready(function(){
	
    var mytemplate = $('#question-template');
    var myanswertemplate = $('#answer-template');
    //console.log(data);
    // set our page title and document title
    document.title = data.quiztitle;
    $('.quiztitle').html(data.quiztitle);

    // set our question length so we can get it later
    var totalquestions = data.questions.length;
    $('#questionlength').html(totalquestions);
    
    // shuffle our questions
    data.questions.sort(function() {return 0.5 - Math.random()});

    var answerjson = '';
    $.each(data.questions, function(i,question){
	var newdiv = mytemplate.html();
	// set our question number and add our answer to answerjson
	var qnum = i+1;
	newdiv = newdiv.replace(/QUESTIONNUM/g, qnum);
	newdiv = newdiv.replace(/TOTALQUESTIONS/g, totalquestions);
	thisanswer = '"q'+qnum+'":"'+question['answerkey']+'"';
	if (qnum == 1) {
	    answerjson = thisanswer;
	} else if (qnum == i+1) {
	    answerjson = answerjson+','+thisanswer;
	} else {
	    answerjson = answerjson+','+thisanswer+',';
	}
	
	// we show our first question div and handle			
	// appropriate navigation divs
	if ( i == 0 ) {
	    newdiv = newdiv.replace("questionContainer radius hide", "questionContainer radius");
	    newdiv = newdiv.replace("next hide", "next");
	} else if ( i == totalquestions - 1 ) {
	    // newdiv = newdiv.replace("prev hide", "prev");
	    newdiv = newdiv.replace("lastslide hide", "lastslide");
	} else {
	    //newdiv = newdiv.replace("prev hide", "prev");
	    newdiv = newdiv.replace("next hide", "next");
	}
	$.each(question, function(key, value) {
	    if ( key != 'answers' ) {
		newdiv = newdiv.replace(key.toUpperCase(), value); 
	    } else {
		var fullanswer = '';
		$.each(value, function(ak, av) {
		    var newanswerdiv = myanswertemplate.html();
		    newanswerdiv = newanswerdiv.replace(/QUESTIONNUM/g, qnum);
		    newanswerdiv = newanswerdiv.replace(/QUESTIONTYPE/g, question['questiontype']);
		    newanswerdiv = newanswerdiv.replace(/ANSWERLETTER/g, av['answerletter']);
		    newanswerdiv = newanswerdiv.replace(/ANSWERTEXT/g, av['answertext']);
		    fullanswer = fullanswer + newanswerdiv;
		});
		newdiv = newdiv.replace(/ANSWERCONTENT/g,fullanswer);
	    }
	});
	$('#content').append(newdiv);
    });

    // Create raphael instance
    var rsr = Raphael('rsr', 320, 240); //size of div rsr
    // Create our needle
    var needle = createNeedle(rsr);
    // get needle bounding box 
    var needleBox = needle.getBBox(); 

    // calculate rotation point (bottom middle) animates around the pivot point
    var x_rotate_point = needleBox.x + (needleBox.width/2);
    var y_rotate_point = needleBox.y + (needleBox.height); 

    // Create our circle
    var circle = createCircle(rsr,x_rotate_point,y_rotate_point);
    // Events

    /*Intro page: click the begin button*/
    $('#begin').click(function(){
	// hide welcome text
	$('#instructions').hide();
	// show questionContainer
	$('#questions-div').fadeIn('fast');
	// get related question config variables
	var pressureType = data.questions[qQuest].pressuretype;
	var positionType = data.questions[qQuest].positiontype;
	var instructions = data.questions[qQuest].instructions;
	// show the correct position and bp/radial images
	$('#'+positionType).removeClass('hide');
	$('#'+pressureType).removeClass('hide');
	//console.log("begin button instruction", instructions);
	/*Purple instructions div*/
        showQuestionInstructions();
	return false;
    });

    // set our events

    
    /*Jogging Pulse function*/
    /*jogging next button*/
    $('a#bottom-next1').click(function(){
	$('#jogging').hide();
	$('#instructions').addClass('hide');
	/*$('#main').removeClass('hide').fadeIn('fast');*/
	$('#pulse-jog2').show();
	$('#bottom-next2').hover(function(){
	    $('#bottom-next2').css('cursor','pointer');
	});
    });

    
    // Radial: click the start button
    $('#sw_start').click(function(){ 
        var currentState = $(this).attr('value');
        var divname = 'radial-heartbeat-dot';

        if (currentState == 'Start') {
		
        var ms = convertBpmToMs(data.questions[qQuest].bpm);
         console.log("REGULAR BPM value",ms);
            // if beat is defined, we already have a timer running
            if (beatingHeart != true) {
                beat = heartbeatStart(ms, divname, needle, circle);
            }$.APP.startTimer('sw');
            $(this).attr('value', 'Stop');
			
	    $.APP.startTimer('sw');
            $(this).attr('value', 'Stop');
        } else {
            if (typeof beat !== 'undefined') {
                heartbeatStop(beat, circle, divname);
                delete beat;
            }
            $.APP.pauseTimer();
            $(this).attr('value', 'Start');
        }

    });
    // Radial: click pause or stop
    $('#sw_reset').click(function(){        
        var divname = 'radial-heartbeat-dot';

        if (typeof beat !== 'undefined') {
            heartbeatStop(beat, circle, divname);
            delete beat;
        }
        $.APP.resetTimer();
    });
    //end pulse animation

    $('.btnNext').click(function(){
        // don't allow user to click next if needle is dropping on bp
        if (needle.matrix.split().rotate != 0){
            $('#errormsg').text('Please wait for needle.').fadeIn().fadeOut(transitiontime);
            return false;
        }
	//reset stopwatch timer
	$.APP.resetTimer();
        if (typeof beat !== 'undefined') {
            var divname = 'radial-heartbeat-dot';
            heartbeatStop(beat, circle, divname);
            delete beat;
        }

	if ($(':input:checked:visible').length == 0) {
	    $('#errormsg').text('Please select an answer.').fadeIn().fadeOut(transitiontime);
	    $("#blockDiv").addClass('hide');
	    return false;
	} else {
	    // block additional events with clear div
	    $("#blockDiv").removeClass('hide');
	}
	// hide our position and bp/radial images
        $('#'+data.questions[qQuest].positiontype).addClass('hide');
	$('#spy').children().addClass('hide');
        // increment our question
	qQuest = qQuest + 1;
	changeBorder(qQuest, needle, circle, x_rotate_point, y_rotate_point);	
	
	// get the current question from content div
	var iter = $('#content').find('.questionContainer:visible').index() + 1;

	$(this).parents('.questionContainer').fadeOut(fadetime, function(){
	    $(this).next().fadeIn(fadetime)});
	
	// get related question config variables
	var pressureType = data.questions[qQuest].pressuretype;
	var positionType = data.questions[qQuest].positiontype;
	//var instructions = data.questions[qQuest].instructions;
	//console.log("instructions", instructions);
	// show the correct position and bp/radial images
	$('#'+positionType).removeClass('hide');
	$('#'+pressureType).removeClass('hide');
	
	//reset needle to 0 deg every click
	needle.transform(bpStartingPoint).data('id', 'needle');
	
	/*Purple instructions div*/
        showQuestionInstructions();
	
	// remove our blocking div
	setTimeout(function() {
	    $("#blockDiv").addClass('hide');
	}, transitiontime-400);
	$('#progress').width(($("#progress").width()/$("#progressKeeper").width()*100)+100/parseInt($("#questionlength").text())+'%');   
	//smooth scroll
	$("html, body").animate({ scrollTop: 0 }, 600);
	return false;
    });



    /*click cuff and squeeze*/
    $('#bulb').click(function(){
        // start pumping the needle
        needle.animate({transform: needle.attr("transform") + "R" + pumpAngle + ","+x_rotate_point+","+y_rotate_point}, 600);

	/*Fade out Bulb and fade In*/
	$('#bulb').fadeOut('slow', function(){
	    airSound.setVolume(38);
	    airSound.play();
	    $('#bulb').fadeIn('slow');
	});
	/*Change Cursor*/1
	$('#bulb').css('cursor','pointer');

	/*stop needle at degree of 195 and higher*/
	//console.log("needle", needle.matrix.split().rotate);
	if(needle.matrix.split().rotate >= maxPressure){
	    needle.stop();
	    airSound.stop();
	    $('#purple-instructions').html(bpInstructionsAirReleaseText);
            setTimeout(function() { $('#purple-instructions').fadeOut('slow').fadeIn('slow'); } , 1000);
	}
	// get the current question
	//var iter = $('#content').find('.questionContainer:visible').index() + 1;
	var iter = $('#content').find('.questionContainer:visible').index() + 1;
        // iter-1 if iter == totalquestions
        if (iter == totalquestions) {
	    var positionType = data.questions[iter-1].positiontype;             
        } else {
            var positionType = data.questions[iter].positiontype; 
        }

    });

    changeBorder(qQuest, needle, circle, x_rotate_point, y_rotate_point);
    
    /*change cursor on hover*/
    $('#bulb').hover(function(){
	$('#bulb').css('cursor','pointer');
    });
    
    
    //Clear Table on click
    $('#clear2').click(function(){
	$tables.html("");
	$("html, body").animate({ scrollTop: 0 }, 600);
	return false;
    });

    $('.btnShowResult').click(function(){
	if ($('input[type=radio]:checked:visible').length == 0 && $('input[type=checkbox]:checked:visible').length == 0) {
	    $('#errormsg').text('Please select an answer.').fadeIn().fadeOut(transitiontime);
	    $("#blockDiv").addClass('hide');	    
	    return false;
	}
        if (needle.matrix.split().rotate != 0){
            $('#errormsg').text('Please wait for needle.').fadeIn().fadeOut(transitiontime);
            return false;
        }

	//reset stopwatch timer
	$.APP.resetTimer();
        if (typeof beat !== 'undefined') {
            var divname = 'radial-heartbeat-dot';
            heartbeatStop(beat, circle, divname);
            delete beat;
        } 
	$(this).parents('.questionContainer').hide();
	// hide our position and bp/radial images
	$('#positionimages').find('div:visible').addClass('hide');
	$('#spy').children().addClass('hide');
	
	$('#progressKeeper,.txtStatusBar,.btnShowResult,.btnPrev,#questions-div,#purple-instructions').hide();
	checkAnswers(); 
    });
    
    // mute all page sound
    $('#mute').click(function(){
	// mute sound
        muteSound();
        // toggle image
        var origsrc = $('#mu').attr('src');
        var src = '';
        if (origsrc == 'images/mute.png') src = 'images/mute-off.png';
        if (origsrc == 'images/mute-off.png') src = 'images/mute.png';
        $('#mu').attr('src', src);
	return false;
    });
    
    /*Exit/restart button*/
    $('.btnRestart').click(function(){
	location.reload();
    });
    $('#exit').click(function(){
	location.reload();
	return false;
    });

    // adding trim() for IE8
    if(typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function() {
	    return this.replace(/^\s+|\s+$/g, ''); 
	}
    }

    // we need to trigger 'elementCreated'
    // so that we can add our js events to the new element
    $('#quizanswers').text('{'+answerjson+'}');

}); 


// animage the needle drop
function animateNeedleDrop(needle, circle, x_rotate_point, y_rotate_point) {
    $('#bulb-overlay').css('z-index', '10');
    $('#air-overlay').css('z-index', '10');
    //	$('#air').css('cursor','pointer');
    // animate the needle dropping
    var positionType = data.questions[qQuest].positiontype;
    var divname = 'heartbeat-'+positionType;
    var initLocation = needle.matrix.split().rotate;
    var systolic = data.questions[qQuest].systolic;
    var diastolic = data.questions[qQuest].diastolic;
    var ms = convertBpmToMs(data.questions[qQuest].bpm);

    var needleAnimation = needle.animate({
        transform: needle.attr("transform") + "R-"+initLocation+","+x_rotate_point+","+y_rotate_point
    }, bpDeflateRate, function() {
	needle.transform(bpStartingPoint).data('id', 'needle');
        clearInterval(needleLoc);
        clearInterval(needleLoc2);
        $('#bulb-overlay').css('z-index', '0');
        $('#air-overlay').css('z-index', '0');

        $('#purple-instructions').text(bpInstructionText);
    }); 	
    $('#purple-instructions').html(bpInstructionsDuringNeedleDrop);
   
    // check position of needle

    // watch needle and start heart animation and sound
    // needs to be longer than 100, else it starts multiple
    //   timers   
    var needleLoc = setInterval(function(){ 
        systolicStart(needle, circle, systolic, ms, divname, needleLoc);
    }, 500);

    // setup interval to stop heartbeat animation and sound
    var needleLoc2 = setInterval(function(){ 
        diastolicStop(needle, circle, diastolic, ms, divname, needleLoc2);
    }, 100);
    //console.log(needle.matrix.split().rotate);
    if(needle.matrix.split().rotate <= -1){
	needle.stop;
    }  
    release.setVolume(5);
    release.play(); 
    // end needle animation
}

function changeBorder(qQuest, needle, circle, x_rotate_point, y_rotate_point) {
    //start heartbeats on click
    $('#air').click(function(){
        // don't drop if the needle is on the starting position
        if (needle.matrix.split().dy == bpStartingPointY) {
            return false;
        }
        // change arrow to hand onHover()
	$('#air').hover(function(){
	    $('#air').css('cursor','pointer');
	});

        // active needle transform dropping as air leaves cuff
        animateNeedleDrop(needle, circle, x_rotate_point, y_rotate_point);
    }); //end the click of air
}

function checkAnswers() {
    var answerKey =  $.parseJSON($("#quizanswers").text());
    var mycorrecttemplate = $('#correct-template');
    var myincorrecttemplate = $('#incorrect-template');
    var myfeedbacktemplate = $('#feedback-template');
    // now we turn our array into an object of answers 
    // grouped by question number
    var arr = $(':input:checked');
    var obj = {};
    for (var i = 0, ii = arr.length; i < ii; i++) {
	var ansArr = arr[i].getAttribute('id').split('-');
	if(typeof eval("obj."+ansArr[0]) == "undefined") {
	    eval("obj."+ansArr[0]+"= new Array();");                        
	}
	eval("obj."+ansArr[0]+".push('"+ansArr[1]+"');");
    }
    var userAnswers = obj;
    var finalResultSet = '';
    var questionList = '';
    var trueCount = 0;
    var i = 0;
    for (var fullanswer in userAnswers) {
	var currResult = '';
	var myTrue = 0;
	var myImpliedTrue = 0;
	var falseCount = 0;
	var currCorrectAnswer = answerKey[fullanswer];
	var numOptions = $('.questionContainer:eq('+i+')').find('input').length;
	var questionType = $('.questionContainer:eq('+i+')').find('input:eq(0)').attr('type');
	var currQuestion = $('.questionContainer:eq('+i+')').find(".question").children(":last").html();
	var currUserAnswer = $('.questionContainer:eq('+i+')').find(':input:checked').attr('id').split('-')[1];

	var str = "abcdefghijklmnopqrstuvwxyz";
	for(var x=0; x<numOptions; x++)
	{
	    var currUserAnswerText = $('.questionContainer:eq('+i+')').find('input[id^="'+fullanswer+'-'+str.charAt(x)+'"]').parent().text().trim();
	    // check our answers
	    if ($.inArray(str.charAt(x), userAnswers[fullanswer]) == -1 && $.inArray(str.charAt(x),currCorrectAnswer) == -1) {
		// letter not in user answer list && letter not in correct answer list
		myImpliedTrue++;
	    } else if ($.inArray(str.charAt(x), userAnswers[fullanswer]) == -1 && $.inArray(str.charAt(x),currCorrectAnswer) >= 0) {
		// letter not in user answer list && letter in correct answer list
		//currResult =  currResult+'<br />'+myincorrecttemplate.html().replace('ANSWERTEXT',currUserAnswerText)
		falseCount++;
	    } else if ($.inArray(str.charAt(x), userAnswers[fullanswer]) >= 0  && $.inArray(str.charAt(x),currCorrectAnswer) >= 0) {
		// letter in user answer list && letter in correct answer list
		currResult = currResult+'<br />'+mycorrecttemplate.html().replace('ANSWERTEXT',currUserAnswerText);
		myTrue++;
	    } else {
		// letter in user answer list && letter not in correct answer list
		// ($.inArray(str.charAt(x), userAnswers[fullanswer]) >= 0 && $.inArray(str.charAt(x),currCorrectAnswer) == -1) {
		currResult = currResult+'<br />'+myincorrecttemplate.html().replace('ANSWERTEXT',currUserAnswerText);
		falseCount++;
	    }
	}
	if( questionType == 'checkbox') {
	    trueCount = trueCount + ((myImpliedTrue+myTrue)/numOptions);            
	} else if ( questionType == 'radio' ) {
	    if (myTrue > 0) {
		trueCount++;    
	    } 
	} 

	if(falseCount>0){
	    var currCorrectAnswerArr = currCorrectAnswer.split(',');
	    for (var a=0; a<currCorrectAnswerArr.length;a++) {
		var currCorrectAnswerText = $('.questionContainer:eq('+i+')').find('input[id^="'+fullanswer+'-'+currCorrectAnswerArr[a]+'"]').parent().text().trim();
		currResult = currResult+'<br />'+myfeedbacktemplate.html().replace('ANSWERTEXT',currCorrectAnswerText);
	    }
	}
	currResult = currQuestion+currResult;
	questionList = questionList+'<br /><div> ' + (i + 1) + '. ' + currResult + '</div>'
	i = i+1;
    }
    // get our secret code
    var myscore = Math.round(trueCount * (100/$("#questionlength").text()));
    var code = getScoreCode(data, myscore);
    var secretcode = data.secretcode;
    var responsetext = data.responsetext.replace("CODE", code);
    var responsetext = responsetext.replace("SECRETCODE", secretcode);
    $('#responsetext').html(responsetext);

    $('#totalScore').text('Score: ' + myscore + ' / 100');
    $('#restart').removeClass('hide');
    $('#resultKeeper').html(questionList).show();
}

function createCircle(rsr,x_rotate_point,y_rotate_point) {
    // Creates circle at rotation point 
    var circle = rsr.circle(x_rotate_point, y_rotate_point, 5); 
    circle.attr("fill", "#ffffff"); 
    circle.attr("stroke", "#202054"); //needle fill purple color
    circle.attr("stroke-width", "4"); //circle stroke width

    return circle;
}
function createNeedle(rsr) {
    var needle = rsr.path("m 159.74443,870.84631 -5.26177,88.38851 4.38851,0 z"); //size of needle x, needle to circle, height
    needle.attr({id: 'needle',
		 parent: 'layer1',
		 fill: '#202054',
		 stroke: '#000000',
		 /* "stroke-width": '0.61',*/
		 "stroke-width": '0.41', //Stroke width
		 "stroke-linecap":'butt',
		 "stroke-linejoin": 'miter',
		 "stroke-miterlimit": '1',
		 "stroke-opacity": '1',
		 "transform": 'R-30',
		 "stroke-dasharray": 'none'
		}); 
    // starting position (on question load)
    //   -812.36218 is the y for setting the circle of the needle 
    //              (point that needle spins on)
    needle.transform(bpStartingPoint).data('id', 'needle');

    // get needle bounding box 
    var needleBox = needle.getBBox(); 

    // calculate rotation point (bottom middle) animates around the pivot point
    var x_rotate_point = needleBox.x + (needleBox.width/2);
    var y_rotate_point = needleBox.y + (needleBox.height); 

    return needle;
}


function convertBpmToMs(bpm) {
    var convertedbpm = 60000/bpm;

    return convertedbpm;
}
function convertMsToBpm(ms) {
    var convertedms = ms/1000;

    return convertedms;
}

function diastolicStop(needle, circle, diastolic, ms, divname, needleLoc2) {
    var bp = getBloodPressure(needle);
    
    // stop sound when bp < diastolic
    if (bp < diastolic) {
        //console.log('diast');
        if (beatingHeart == true) {
            clearInterval(needleLoc2);

            // stop our heartbeat
            heartbeatStop(beat, circle);
            clearInterval(beat);
            delete beat;
            
            // pause the needle for a second
            // needle.pause();
            // setTimeout(function(){needle.resume()},diastolicBump);
            
            // return our circle to default
            circle.attr({fill: '#fff', stroke: '#202054'});
            $(circle.node).fadeIn(fadetime);

            // heart isn't beating anymore
            beatingHeart = false;
        }
    }
}

function getDegreesOfNeedle(rotation) {
    // cool equation per Chris Duke
    var bp = ((rotation * 280)+2220)/321;
    return bp;
}

function getScoreCode(data, myscore) {
    var code = '';

    lengthquizcode = data.quizcode.length;
    // we need to loop through codes and find the code
    // we match if score > than code.points
    $.each(data.quizcode, function(i, quizcode){
	if(parseInt(myscore) >= parseInt(quizcode.points)){
	    code = quizcode.code;
	    return false;
	} 
    });

    // if code == '', then the score is below the lowest quiz code
    if (code == ''){
	// grab the code from last position for scores <= 0
	code = data.quizcode[lengthquizcode-1].code;
    } 
    return code;
}
function getData(jsonfile){
    return $.ajax({
	url:jsonfile,
	async: false,
	dataType: 'json'
    }).responseText;
}5.

function getBloodPressure(needle) {
    var rotation = needle.matrix.split().rotate;
    // get the current degrees of needle
    var bp = getDegreesOfNeedle(rotation);
    return bp;
}

//plays heartbeat sound
function heartbeatStart(ms, divname, needle, circle){
   // console.log(ms);
    console.log(heartSound.getDuration());
    var beat = setInterval(function() {
        heartSound.play();
		heartSound.setSpeed(1);
		heartSound.set("volume", 1);
		if(data.questions[qQuest].positiontype == "jogging"){
			heartSound.setSpeed(2);
			heartSound.set("volume", 1);
			console.log("new heartbeat");
		}else if(data.questions[qQuest].positiontype == "post-jogging"){
			heartSound.setSpeed(1.5);
			heartSound.set("volume", 1);
			console.log("new heartbeat2");
		}
        $("#"+divname).fadeIn(fadetime).fadeOut(fadetime);

        // turn our circle into a red beating dot of death
        circle.attr({fill: '#900', stroke: '#900'});
        $(circle.node).fadeIn(fadetime).fadeOut(fadetime);
        beatingHeart = true;
    }, ms);
	
    return beat;
}

function heartbeatStop(beat, circle, divname) {
    //console.log(beat);
    if (beat == undefined) { 
        heartSound.stop(); 
    } else {
        clearInterval(beat);  
    }
    // return red dot to default
    $("#"+divname).fadeIn(fadetime)
    // return our circle to default
    circle.attr({fill: '#fff', stroke: '#202054'});
    $(circle.node).fadeIn(fadetime);

    beatingHeart = false;
}

//Mute all sounds
function muteSound(){
    heartSound.toggleMute();
    airSound.toggleMute();
    release.toggleMute();
}

function showQuestionInstructions() {
    $('#purple-instructions').removeClass('hide').fadeIn('fast');
    setTimeout(function() { 
        $('#purple-instructions').fadeOut('fast').fadeIn('fast'); 
    } , 1000);
    $('#purple-instructions').text(bpInstructionText);
    $('#purple-instructions').css('padding','5px');
}
function systolicStart(needle, circle, systolic, ms, divname, needleLoc) {
    var bp = getBloodPressure(needle);

    // start sound when bp < systolic 
    if (bp < systolic){
        //console.log('syst');
        if (beatingHeart == false) {
            beat = heartbeatStart(ms,divname,needle, circle);
            beatingHeart = true;
            clearInterval(needleLoc);
        }
    }
}

