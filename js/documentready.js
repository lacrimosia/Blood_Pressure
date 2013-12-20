var jsonfile = 'js/data.json';
var data = JSON.parse(getData(jsonfile));
var answers = $.getJSON('#quizanswers');
var questionLength = $("#questionlength").text();
var transitiontime = 1000;
var fadetime = 500;
var totalquestions = 0;
var Qquest = 0;
var heartsound = new buzz.sound("audio/fast-heartbeat.mp3");
var positionType1 = data.questions[Qquest].positiontype;
var pressureType1 = data.questions[Qquest].pressuretype;
var speed = data.questions[Qquest].speed;

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
    //$('#thisis').replace(//, 'me');
	
	

    
    
    //load pictures pertaining to each question
    /*testing element*/
    //HOW TO ACCESS JOGGING PICTURE FROM JSON
    /*var questionOne = data.questions[0].positiontype1;
      console.log(questionOne);
      
      
      if(questionOne == "jogging"){
      var joggingPicture = data.questions[0].imagepath;
      
      //$.each(data, function(key, val) {
      $("#bodyPosition").append('<img src="' + joggingPicture + '" alt="jogging-picture" />');
      //});
      }*/
    //end picture
    
    /*begin button*/
    $('#begin').click(function(){
		Qquest = 0;
        // hide welcome text
	$('#instructions1').hide();
        // show questionContainer
	$('#questions-div').fadeIn('fast');
        // get related question config variables
	var pressureType = data.questions[Qquest].pressuretype;
	var positionType = data.questions[Qquest].positiontype;
	var instructions = data.questions[Qquest].instructions;
        // show the correct position and bp/radial images
	$('#'+positionType).removeClass('hide');
	$('#'+pressureType).removeClass('hide');
console.log("begin button instruction", instructions);
	/*Purple instructions div*/
	$('#purple').fadeIn('slow');
	$('#purple').text(instructions);
	$('#purple').css('color','#fff');
	$('#purple').css('padding','5px');
	return false;
    });
	
	$('#air').click(function(){
		
	    $('#air').hover(function(){
		$('#air').css('cursor','pointer');
	    });
	    $('#air').css('cursor','pointer');
            //console.log(needle);
			
	    	//needle.animate({transform: needle.attr("transform") + "R-205,"+x_rotate_point+","+y_rotate_point}, 16000, function(){
	/*window.setInterval(function () {
		needle.animate({transform: needle.attr("transform") + "R-205,"+x_rotate_point+","+y_rotate_point}, 16000, function(){
			needle.transform("t0,-812.36218").data('id', 'needle');
			
			 });
		console.log(needle.attr("transform").rotate);
		
    }, 1000);*/		
       needle.animate({transform: needle.attr("transform") + "R-205,"+x_rotate_point+","+y_rotate_point}, 16000, function(){
		needle.transform("t0,-812.36218").data('id', 'needle');
			}); 
			    
	   
	    if(needle.matrix.split().rotate <= -1){
		needle.stop;
	    }
	    
	});
	

	
	
	
	function changeBorder(Qquest) {
		//start heartbeats on click
		$('#air').click(function(){
		var positionType1 = data.questions[Qquest].positiontype;
		var pressureType1 = data.questions[Qquest].pressuretype;
		var needleMove = needle.matrix.split().rotate;
		
		//console.log("position", positionType1);
		//console.log("pressure", pressureType1);
			
				(function pulse(){
        		$('#heartbeat-jog').delay(200).fadeOut('slow').delay(50).fadeIn('slow',pulse);
    			})();

			
			console.log("needle animating", needleMove);
		if (positionType1 == 'jogging' && pressureType1 == 'bp' && needleMove == 92.27239586424439 ) {
	
		} 
		
		else if (positionType1 == 'jogging' && pressureType1 == 'radial') {
			$("#heartbeat-jog").css("border", "3px solid green");
		}
		else if (positionType1 == 'seated' && pressureType1 == 'bp') {
			$("#heartbeat-jog").css("border", "3px solid red");
		}
		else if (positionType1 == 'seated' && pressureType1 == 'radial') {
			$("#heartbeat-jog").css("border", "3px solid black");
		}
		else if (positionType1 == 'standing' && pressureType1 == 'bp') {
			$("#heartbeat-jog").css("border", "3px solid #BBBBBB");
		}
		else if (positionType1 == 'standing' && pressureType1 == 'radial') {
			$("#heartbeat-jog").css("border", "3px solid yellow");
		}
		else if (positionType1 == 'post-jogging' && pressureType1 == 'bp') {
			$("#heartbeat-jog").css("border", "3px solid #BBBBBB");
		}
		else if (positionType1 == 'post-jogging' && pressureType1 == 'radial') {
			$("#heartbeat-jog").css("border", "3px solid orange");
		}
		else if (positionType1 == 'laying-down' && pressureType1 == 'bp') {
			$("#heartbeat-jog").css("border", "3px solid white");
		}
		else if (positionType1 == 'laying-down' && pressureType1 == 'radial') {
			$("#heartbeat-jog").css("border", "3px solid brown");
		}

		}); //end the click of air
	
}





    // set our events
    $('.btnNext').click(function(){
        if ($(':input:checked:visible').length == 0) {
            $('#errormsg').text('Please select an answer.').fadeIn().fadeOut(transitiontime);
            $("#blockDiv").addClass('hide');
            return false;
        } else {
            // block additional events with clear div
            $("#blockDiv").removeClass('hide');
		}
            // hide our position and bp/radial images
	    $('#positionimages').find('div:visible').addClass('hide');
	    $('#spy').children().addClass('hide');
				Qquest = Qquest + 1;
		console.log(Qquest);
		changeBorder(Qquest);

            // get the current question
	    var iter = $('#content').find('.questionContainer:visible').index() + 1;

            $(this).parents('.questionContainer').fadeOut(fadetime, function(){
                $(this).next().fadeIn(fadetime)});
	        
                // get related question config variables
	        var pressureType = data.questions[Qquest].pressuretype;
	        var positionType = data.questions[Qquest].positiontype;
	        var instructions = data.questions[Qquest].instructions;
			console.log("instructions", instructions);
                // show the correct position and bp/radial images
	        $('#'+positionType).removeClass('hide');
	        $('#'+pressureType).removeClass('hide');
			
			/*Purple instructions div*/
	$('#purple').fadeIn('slow');
	$('#purple').text(instructions);
	$('#purple').css('color','#fff');
	$('#purple').css('padding','5px');
	    
            // remove our blocking div
            setTimeout(function() {
                $("#blockDiv").addClass('hide');
            }, transitiontime-400);
            $('#progress').width(($("#progress").width()/$("#progressKeeper").width()*100)+100/parseInt($("#questionlength").text())+'%');   
	    //smooth scroll
	    $("html, body").animate({ scrollTop: 0 }, 600);
    	   // return false;
});
   

    
    /*Jogging Pulse function*/
    /*jogging next button*/
    $('a#bottom-next1').click(function(){
	$('#jogging').hide();
	$('#instructions1').addClass('hide');
	/*$('#main').removeClass('hide').fadeIn('fast');*/
	$('#pulse-jog2').show();
	$('#bottom-next2').hover(function(){
	    $('#bottom-next2').css('cursor','pointer');
	});
    });

    /*Exit/restart button*/
    $('.btnRestart').click(function(){
        location.reload();
    });
	
	
    $('#exit').click(function(){
	location.reload();
	return false;
    });
    
    
    //default degrees before click
    
    
    
    // create needle 
    /*var rsr = Raphael('rsr', 320, 240); //size of div rsr
      var needle = rsr.path("m 156.74443,870.84631 -5.26177,88.38851 4.38851,0 z"); //size of needle
      needle.attr({id: 'needle',
      parent: 'layer1',
      fill: '#202054',
      stroke: '#000000',
      "stroke-width": '0.61', //Stroke width
      "stroke-linecap":'butt',
      "stroke-linejoin": 'miter',
      "stroke-miterlimit": '1',
      "stroke-opacity": '1',
      "transform": 'R-30',
      "stroke-dasharray": 'none'
      }); */
    
    var rsr = Raphael('rsr', 320, 240); //size of div rsr
    var needle = rsr.path("m 156.74443,870.84631 -5.26177,88.38851 4.38851,0 z"); //size of needle
    needle.attr({id: 'needle',
                 parent: 'layer1',
                 fill: '#202054',
                 stroke: '#000000',
                 "stroke-width": '0.61', //Stroke width
                 "stroke-linecap":'butt',
                 "stroke-linejoin": 'miter',
                 "stroke-miterlimit": '1',
                 "stroke-opacity": '1',
				 "transform": 'R-30',
                 "stroke-dasharray": 'none'
		}); 
    

    //needle.rotate(0); 
    //needle.transform("t0,-812.36218").data('id', 'needle'); 
    needle.transform("t0,-812.36218").data('id', 'needle');
    
    // get needle bounding box 
    var needleBox = needle.getBBox(); 

    // calculate rotation point (bottom middle)
    var x_rotate_point = needleBox.x + (needleBox.width/2); 
    var y_rotate_point = needleBox.y + (needleBox.height); 

    // rotate needle
    //needle./*attr({rotation: 0}).*/animate({transform: needle.attr("transform") + "R270,"+x_rotate_point+","+y_rotate_point}, 6000); 



    // Creates circle at rotation point 
    var circle = rsr.circle(x_rotate_point, y_rotate_point, 5); 
    circle.attr("fill", "#ffffff"); 
    circle.attr("stroke", "#202054"); //needle fill purple color
    circle.attr("stroke-width", "4"); //circle stroke width

    //end of raphael needle code

    /*click cuff and squeeze*/
    $('#regular-jog').click(function(){
	/*Remove standard position class*/
	//$('#needle-image').removeClass('needle');
        //	needle./*attr({rotation: 0}).*/animate({transform: needle.attr("transform") + "R20,"+x_rotate_point+","+y_rotate_point}, 300);
	//console.log(needle);
        needle.animate({transform: needle.attr("transform") + "R20,"+x_rotate_point+","+y_rotate_point}, 300);
        /*get angle of each click*///console.log('Needle degree',needle.matrix.split().rotate);

	/*Fade out Bulb and fade In*/
	$('#regular-jog').fadeOut('slow', function(){
	    $('#regular-jog').fadeIn('slow');
	});
	/*Change Cursor*/
	$('#regular-jog').css('cursor','pointer');

	/*stop needle at degree of 195 and higher*/
	if(needle.matrix.split().rotate >= 195){
	    needle.stop();
	} 
	// get the current question
	//var iter = $('#content').find('.questionContainer:visible').index() + 1;
	var iter = $('#content').find('.questionContainer:visible').index() + 1;
	var positionType = data.questions[iter].positiontype; 
	});
	
	//local rotation = math.floor(math.deg(math.atan2(v[3], v[4]))) % 360
	changeBorder(Qquest);
	//on each, change hearbeat speed and pulse speed and sounds 
	/*Click Air button to let out the air*/
	

	
	/*heartbeat starts at whatever degree
	  /*var joggingHeart = $(function pulse(back) {
    	  $('#heartbeat-jog').animate(
          {
          opacity: (back) ? 1 : 0.5
          }, 500, function(){pulse(!back)});
	  })(false);
	  
	  
	  var seatedHeart = $(function pulse(back) {
    	  $('#heartbeat-jog').animate(
          {
          opacity: (back) ? 1 : 0.5
          }, 1200, function(){pulse(!back)});
	  })(false);
	  end heartbeat*/
	
	/*change cursor on hover*/
	$('#regular-jog').hover(function(){
	    $('#regular-jog').css('cursor','pointer');
	});
	
        
    
    
    


    //on click of radio button alert user its value
    /*$(function(){
      $('input[type="radio"]').click(function(){
      if ($(this).is(':checked'))
      {
      alert($(this).val());
      }
      });
      });*/
    
    //On click of radio button, add user answer to the table
    /*write answer value to table*/
    /*This is how to access the answers*//*data.questions[itemsId].answers[answers].answertext;
      data.questions[0].answers[1].answertext;*/
    //Add user answer to table		
    //images = data.questions[1];		
    
    //Clear Table on click
    $('#clear2').click(function(){
	$tables.html("");
	$("html, body").animate({ scrollTop: 0 }, 600);
    	return false;
    });
    
    // $('.btnPrev').click(function(){
    //     // block additional events with clear div
    //     $("#blockDiv").removeClass('hide');

    //     $(this).parents('.questionContainer').fadeOut(fadetime, function(){
    //         $(this).prev().fadeIn(fadetime)
    //     });
    //     // remove our blocking div
    //     setTimeout(function() {
    //         $("#blockDiv").addClass('hide');
    //     }, transitiontime-400);

    //     $('#progress').width(($("#progress").width()/$("#progressKeeper").width()*100)-100/parseInt($("#questionlength").text())+'%');
    //     $('.txtStatusBar').text('Status');
    //     $('#resultKeeper').hide();
    //     $('#progressKeeper').show();
    // })
    $('.btnShowResult').click(function(){
        if ($('input[type=radio]:checked:visible').length == 0 && $('input[type=checkbox]:checked:visible').length == 0) {
            $('#errormsg').text('Please select an answer.').fadeIn().fadeOut(transitiontime);
            $("#blockDiv").addClass('hide');	    
            return false;
        }
        $(this).parents('.questionContainer').hide();
        // hide our position and bp/radial images
	$('#positionimages').find('div:visible').addClass('hide');
	$('#spy').children().addClass('hide');
        
        $('#progressKeeper,.txtStatusBar,.btnShowResult,.btnPrev,#questions-div,#purple').hide();
        checkAnswers(); 
    });
    
    $('.btnShowResult').click(function(){
	$('#main').hide();
	$('#content').hide();
	
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
}



