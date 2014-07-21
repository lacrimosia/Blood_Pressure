var track_onoff = 0;
var track_unit = 0;
var track_zero = 0;
var num;
var set;
var mm;
var display;
var cr_left;
var caliperRulerStartPos;
var caliperRulerStartPosLeft;
var p;
var original;

var pxToMillimeterDivisor = 3.2;

Mousetrap.bind('return', function(e){
	myPreventDefault(e);
	
	var button = $(':focus').parent().attr('id');
	
	if (button == 'onoff' && track_onoff == 0) {
		turnOffCaliper();
		track_onoff = 1;
	}
	else if (button == 'onoff' && track_onoff == 1) {
		turnOnCaliper();
		track_onoff = 0;
	}
	
	if (button == 'unitbutton' && track_unit == 0) {
		num = toInches($('#currlength').text());
		setToInches(num);
		track_unit = 1;
	}
	else if (button == 'unitbutton' && track_unit == 1) {
		num = toMillimeters($('#currlength').text());
		setToMillimeters(num);
		track_unit = 0;
	} 
	
	
	
	if (button == 'zeroout') {
caliperRulerStartPos = $('#caliper-ruler').offset();
		cr_left = caliperRulerStartPos.left;
		p = $('#caliper-head').offset();
set = parseFloat(p.left) - parseFloat(cr_left);
			original = parseFloat(set) / parseFloat(pxToMillimeterDivisor);
			setZeroOffset($('#length').text());
		$('#length').text(setZero());
		track_zero = parseInt(track_zero) + parseInt(1);
	}

});

Mousetrap.bind('up', function(e){
	myPreventDefault(e);
	
	var draggable = $('#draggable');
	var distance = 1;
	
    position = draggable.offset();
	var y = parseInt(position.top) - parseInt(distance);
	position.top = y;
	$(draggable).offset({
		'top':y
    }); 
});

Mousetrap.bind('down', function(e){
	myPreventDefault(e);
	
	var draggable = $('#draggable');
	var distance = 1;
	
    position = draggable.offset();
	var y = parseInt(position.top) + parseInt(distance);
	position.top = y;
	$(draggable).offset({
		'top':y
    }); 	
});

Mousetrap.bind('right', function(e){
	myPreventDefault(e);
	
	var test = parseFloat($('#caliper-head').offset().left) - parseFloat($('#caliper-ruler').offset().left);
	var move = parseFloat(test) / parseFloat(pxToMillimeterDivisor);
	
if (move < 168.75) {

	var start = $(':focus').parent().attr('id');
	var distance = 1;
	
	if (start == 'cr') {
		var draggable = $('#draggable');
		console.log(draggable.offset());
	}
	else if (start == 'ch') {
		var draggable = $('#'+$(':focus').parent().attr('id'));	
	}
		position = draggable.offset();
		var x = parseInt(position.left) + parseInt(distance);
		position.left = x;
		$(draggable).offset({
			'left':x
		});

	if (start == 'ch') {
	
		caliperRulerStartPos = $('#caliper-ruler').offset();
		cr_left = caliperRulerStartPos.left;
		// we need to set the left offset based on div.zerooffset
		caliperRulerStartPosLeft = $('#zerooffset').text();
		console.log('zero offset', $('#zerooffset').text());
		p = $('#caliper-head').offset();
		console.log('p', $('#caliper-head').offset());
		// if caliperRulerStartPos.left == p.left, we are at 0
		if (track_zero == 1) {
			set = parseFloat(p.left) - parseFloat(cr_left);
			mm = parseFloat(set) / parseFloat(pxToMillimeterDivisor);
			display = parseFloat(mm) - parseFloat(caliperRulerStartPosLeft);
			setDisplay(display);
		} else if (caliperRulerStartPosLeft == '') {
			// perform our length conversions, etc.
			set = parseFloat(p.left) - parseFloat(cr_left);
			mm = parseFloat(set) / parseFloat(pxToMillimeterDivisor);
			setDisplay(mm);
		} else if (track_zero > 1) {
			set = parseFloat(p.left) - parseFloat(cr_left);
			mm = parseFloat(set) / parseFloat(pxToMillimeterDivisor);
			display = parseFloat(mm) - parseFloat(original);
			setDisplay(display);
		}
	}

}

});

Mousetrap.bind('left', function(e){
	myPreventDefault(e);
	
	var test = parseFloat($('#caliper-head').offset().left) - parseFloat($('#caliper-ruler').offset().left);
	var move = parseFloat(test) / parseFloat(pxToMillimeterDivisor);
	
if (move > 0) {

	var start = $(':focus').parent().attr('id');
	var distance = 1;
	
	if (start == 'cr') {
		var draggable = $('#draggable');
	}
	else if (start == 'ch') {
		var draggable = $('#'+$(':focus').parent().attr('id'));	
	}
	
    position = draggable.offset();
	var x = parseInt(position.left) - parseInt(distance);
	position.left = x;
	$(draggable).offset({
		'left':x
	}); 
	
	if (start == 'ch') {
	
		caliperRulerStartPos = $('#caliper-ruler').offset();
		cr_left = caliperRulerStartPos.left;
		// we need to set the left offset based on div.zerooffset
		caliperRulerStartPosLeft = $('#zerooffset').text();
		console.log('zero offset', $('#zerooffset').text());
		p = $('#caliper-head').offset();
		console.log('p', $('#caliper-head').offset());
		// if caliperRulerStartPos.left == p.left, we are at 0
		if (track_zero == 1) {
			set = parseFloat(p.left) - parseFloat(cr_left);
			mm = parseFloat(set) / parseFloat(pxToMillimeterDivisor);
			display = parseFloat(mm) - parseFloat(caliperRulerStartPosLeft);
			setDisplay(display);
		} else if (caliperRulerStartPosLeft == '') {
			// perform our length conversions, etc.
			set = parseFloat(p.left) - parseFloat(cr_left);
			mm = parseFloat(set) / parseFloat(pxToMillimeterDivisor);
			setDisplay(mm);
		} else if (track_zero > 1) {
			set = parseFloat(p.left) - parseFloat(cr_left);
			mm = parseFloat(set) / parseFloat(pxToMillimeterDivisor);
			display = parseFloat(mm) - parseFloat(original);
			setDisplay(display);
		}
	}

}
	
});

// if (draggable == '#ch') - this is the caliper head

// if (draggable == '#cr') - this is the full caliper

function myPreventDefault(e) {
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        // internet explorer
        e.returnValue = false;
    }
}
