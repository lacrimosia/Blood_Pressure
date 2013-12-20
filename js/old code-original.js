	
					
					
					
					
					
				if ($('input[type=radio]:checked:visible').is(':checked')) {
					 var items = $('input[type=radio]:checked:visible').attr("id");
						/*This is how to access the answers*//*data.questions[itemsId].answers[answers].answertext;
						data.questions[0].answers[1].answertext;*/
						$UserAnswers = $('#'+items).parent().text().trim();
						$('td.answers2').text($UserAnswers);
					}	
					
				if ($('input[type=radio]:checked:visible').is(':checked')) {
					 var items = $('.q:first');
						$UserQuestions = items.text().trim();
						$('td.questions1').text($UserQuestions);
					}
				var reload =  function(){
				if ($('input[type=radio]:checked:visible').is(':checked')) {
					 var items = $('.q:second');
						$UserQuestions = items.text().trim();
						$('td.questions2').text($UserQuestions);
					}	
				}