var jsonfile = 'js/data.json';
var data = JSON.parse(getData(jsonfile));
var answers = $.getJSON('#quizanswers');
var questionLength = $("#questionlength").text();
var transitiontime = 1000;
var fadetime = 500;
var totalquestions = 0;

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
            newdiv = newdiv.replace("prev hide", "prev");
            newdiv = newdiv.replace("lastslide hide", "lastslide");
        } else {
            newdiv = newdiv.replace("prev hide", "prev");
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

    // set our events
    $('.btnNext').click(function(){
        if ($(':input:checked:visible').length == 0) {
            $('#errormsg').text('Please select an answer.').fadeIn().fadeOut(transitiontime);
            $("#blockDiv").addClass('hide');
            return false;
        } else {
            // block additional events with clear div
            $("#blockDiv").removeClass('hide');

            $(this).parents('.questionContainer').fadeOut(fadetime, function(){
                $(this).next().fadeIn(fadetime);
            });
            // remove our blocking div
            setTimeout(function() {
                $("#blockDiv").addClass('hide');
            }, transitiontime-400);
            $('#progress').width(($("#progress").width()/$("#progressKeeper").width()*100)+100/parseInt($("#questionlength").text())+'%');   
        }
    });
    $('.btnPrev').click(function(){
        // block additional events with clear div
        $("#blockDiv").removeClass('hide');

        $(this).parents('.questionContainer').fadeOut(fadetime, function(){
            $(this).prev().fadeIn(fadetime)
        });
        // remove our blocking div
        setTimeout(function() {
            $("#blockDiv").addClass('hide');
        }, transitiontime-400);

        $('#progress').width(($("#progress").width()/$("#progressKeeper").width()*100)-100/parseInt($("#questionlength").text())+'%');
        $('.txtStatusBar').text('Status');
        $('#resultKeeper').hide();
	$('#progressKeeper').show();
    })
    $('.btnShowResult').click(function(){
        if ($('input[type=radio]:checked:visible').length == 0 && $('input[type=checkbox]:checked:visible').length == 0) {
            $('#errormsg').text('Please select an answer.').fadeIn().fadeOut(transitiontime);
            $("#blockDiv").addClass('hide');
            return false;
        }
        $(this).parents('.questionContainer').hide();
        $('#progressKeeper,.txtStatusBar,.btnShowResult,.btnPrev').hide();
        checkAnswers(); 
    })
    $('.btnRestart').click(function(){
         location.reload();
    })


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
