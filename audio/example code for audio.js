$(function() {
    var correctSound = new buzz.sound("sounds/correct", {formats: ["mp3", "wav"]});
    var wrongSound = new buzz.sound("sounds/wrong", {formats: ["mp3", "wav"]});
    var correct = 0;
    var currentDragObj;
    var startXPos = xPos = 520;
    var startYPos = yPos = 70;
	var notificationDelay;
	
    //startup
    $("#dialog-modal").dialog({
        width: '50%',
        height: 300,
        modal: true
    });

    //Setup display
    $('.draggable').sort(function() {
        return Math.random() * 10 > 5 ? 1 : -1;
    }).each(function(index, element) {
        var sum = 0;
        $(this).children().each(function() {
            sum += $(this).width() + 10;
        });
        if ((xPos + sum) > 785) {
            xPos = startXPos;
            yPos += startYPos + 12;
        }
        $(this).attr('tabindex', index);
        $(this).data('orgTop', yPos);
        $(this).data('orgLeft', xPos);
        $(this).data('aria-grabbed', 'true');
        $(this).animate({left: xPos, top: yPos}, 2000);

        xPos += sum;
    });

    //Drag Fucntionality
    $('.draggable').draggable({
        revert: 'invalid',
        start: function(aEvent, aUi) {
            console.log('start drag ' + $(aUi.helper).attr('id'));
            $(aUi.helper).animate({boxShadow: '15 15 5px rgba(3,3,3,0.3)'}, 'fast');
            $(aUi.helper).zIndex(getMaxZIndex() + 1);
        },
        stop: function(aEvent, aUi) {
            $(aUi.helper).animate({boxShadow: '0 0 5px rgba(3,3,3,0.3)'}, 'fast');
        }
    });

    // Drop Functionality
    $('.droppable').droppable({
        over: function(aEvent, aUi) {
            $(this).addClass('targetHover');
            $(this).children().addClass('targetHover');
        },
        out: function(aEvent, aUi) {
            $(this).removeClass('targetHover');
            $(this).children().removeClass('targetHover');
        },
        drop: function(aEvent, aUi) {
            $(this).removeClass('targetHover');
            $(this).children().removeClass('targetHover');
            dropItem($(this), $(aUi.helper));
        }});

    //help function
    $('.help').click(function() {
        $("#dialog-modal").dialog('open');
    });

    // Keyboard Functions
    $(document).keydown(function(event) {
        if ($("#dialog-modal").dialog("isOpen"))
            return;
        if (jwerty.is('h', event)) {
            //check for "h" help Event
            $("#dialog-modal").dialog('open');
        } else if (jwerty.is('p', event)) {
            //check for "p" pickup Event
            if (currentDragObj !== undefined && currentDragObj.data('aria-grabbed', 'true')) {
                currentDragObj.data('aria-grabbed', 'false');
                $(object).animate({left: $(object).data('orgLeft'), top: $(object).data('orgTop')}, 500);
            }
            currentDragObj = $('.draggable').sort(function() {
                return Math.random() * 10 > 5 ? 1 : -1;
            }).first();
            currentDragObj.data('aria-grabbed', 'true');
            $('.droppable').first().focus();

        } else if (jwerty.is('d', event)) {
            //check for "d" drop Event
            if (currentDragObj.data('aria-grabbed') === 'true') {
                addMessage('Dropping onto ' + $(this).attr('id'));
                currentDragObj.data('aria-grabbed', 'false');
                dropItem(currentDropTarget, currentDragObj);
                currentDragObj = undefined;
            }
        } else if (jwerty.is('left', event)) {
            //move left while dragging
            if (currentDragObj.data('aria-grabbed') === 'true') {
                console.log(currentDropTarget.attr('id'));
                currentDropTarget.prevAll(".droppable").first().focus();
            }
        } else if (jwerty.is('right', event)) {
            //move right while dragging
            if (currentDragObj.data('aria-grabbed') === 'true') {
                console.log(currentDropTarget.attr('id'));
                currentDropTarget.nextAll(".droppable").first().focus();
            }
        }
    });

    $(".droppable").focusin(function(event) {
        console.log('focus ' + $(this).attr('id'));
        if (currentDragObj.data('aria-grabbed') === 'true') {
            addMessage('Hovering over ' + $(this).attr('title'));
            currentDragObj.animate({left: $(this).offset().left, top: $(this).offset().top}, 500);
            currentDropTarget = $(this);
        }
    });

    // Helper Functions 
    function dropItem(target, object) {
        var dropTarget = parseInt($(target).attr('id').substring(4));
        var dragObject = parseInt(object.attr('id').substring(4));
        if (dropTarget === dragObject) {
            addMessage('Correct!');
            correctSound.play();
            $(object).animate({left: $(target).offset().left, top: $(target).offset().top}, 500);
            $(target).droppable('disable');
            $(target).removeClass('droppable');
            $(object).draggable('disable');
            $(object).removeClass('draggable');
            $(target).addClass('correct');
            $(target).hide({effect: "fade", duration: 2000});
            correct++;
            if (correct === $('.dragObject').length) {
                addMessage('Activity Completed');
            }
        } else {
            addMessage('Incorrect - Try again');
            wrongSound.play();
            var dropTargetObj = $(target);
            $(target).addClass('wrong');
            setTimeout(function() {
                dropTargetObj.removeClass('wrong');
            }, 1000);
            $(object).animate({left: $(object).data('orgLeft'), top: $(object).data('orgTop')}, 500);
        }
        $(object).data('aria-grabbed', 'true');
        $(target).zIndex(getMaxZIndex() + 1);
        $(object).animate({boxShadow: '0 0 10px #000000'}, 'fast');
    }

    function getMaxZIndex() {
        var zIndexMax = 0;
        $('div').each(function() {
            var z = parseInt($(this).css('z-index'));
            if (z > zIndexMax)
                zIndexMax = z;
        });
        return zIndexMax;
    }

    function addMessage(messageText) {
        $('#notification-display').stop().show();
        $('#message-text').attr("role", "alert");
        $('#notification-display').css('clip', 'auto');
        alertText = document.createTextNode(messageText);
        $('#message-text').empty();
        $('#message-text').append(alertText);
        $('#message-text').css('display', 'none');
        $('#message-text').css('display', 'inline');
        if (correct < $('.dragObject').length) {
			clearTimeout(notificationDelay);
			notificationDelay = setTimeout(function() {
				  // Do something after 5 seconds
				  $('#notification-display').hide({effect: "fade", duration: 2000});
			}, 5000);
            
        }
    }
});