// stopwatch script by Brothercake - http://www.brothercake.com/ (format modified by Proft, 11 Sep 04)

var base = 60;
var heartsound = new buzz.sound("audio/fast-heartbeat.mp3");
var clocktimer,dateObj,dh,dm,ds,ms;
var readout='';
var h=1;
var m=1;
var tm=1;
var s=0;
var ts=0;
var ms=0;
var show=true;
var init=0;
var mPLUS=new Array(
	'm0',
	'm1',
	'm2',
	'm3',
	'm4',
	'm5',
	'm6',
	'm7',
	'm8',
	'm9'
	);
var ii=0;

function clearALL() {
	clearTimeout(clocktimer);
	h=1;m=1;tm=1;s=0;ts=0;ms=0;
	init=0;show=true;
	readout='00:00:00.00';
	document.clockform.clock.value=readout;
	var CF = document.clockform;
	for (ij=0;ij<=9;ij++) { CF[mPLUS[ij]].value = ''; }
	ii = 0;
	}

function addMEM() {
if (init>0) {
		var CF = document.clockform;
		CF[mPLUS[ii]].value = readout;
		if (ii==9) { ii = 0; } else { ii++; }
		}
	}


function startTIME() {

var cdateObj = new Date();
var t = (cdateObj.getTime() - dateObj.getTime())-(s*1000);

if (t>999) { s++; }

if (s>=(m*base)) {
	ts=0;
	m++;
	} else {
	ts=parseInt((ms/100)+s);
	if(ts>=base) { ts=ts-((m-1)*base); }
		//Stop timer at 15 seconds
		if(ts == 16){
			//startTIME().stop();
	            console.log(heartsound);
			heartsound.stop();
			ts.stop();
			jogging.stop();

			
		}

		//end stop timer snippet
	}

if (m>(h*base)) {
	tm=1;
	h++;
	} else {
	tm=parseInt((ms/100)+m);
	if(tm>=base) { tm=tm-((h-1)*base); }
	}

ms = Math.round(t/10);
if (ms>99) {ms=0;}
if (ms==0) {ms='00';}
if (ms>0&&ms<=9) { ms = '0'+ms; }

if (ts>0) { ds = ts; if (ts<10) { ds = '0'+ts; }} else { ds = '00'; }
dm=tm-1;
if (dm>0) { if (dm<10) { dm = '0'+dm; }} else { dm = '00'; }
dh=h-1;
if (dh>0) { if (dh<10) { dh = '0'+dh; }} else { dh = '00'; }

readout = dh + ':' + dm + ':' + ds + '.' + ms;
if (show==true) { document.clockform.clock.value = readout; }

clocktimer = setTimeout("startTIME()",1);
}

function findTIME() {
if (init==0) {
	//play sound
	heartsound.play();
	dateObj = new Date();
	startTIME();
	init=1;
	
	//counting the number of heartbeats
	//make it easier for the student to learn
	//for (i=0;i <= 60;i++){
    	//(function startCount(i) {
        	//var countNumber = setTimeout(function(){
            	//$("#counting").html(i);
        	//}, i * 100);
    	//})(i);
	//}
	
	
	
	/*heartbeat for the pulse scenario*/
	(function jogging(back) {
    	$('#heartbeat-jogging').animate(
        	{
           		 opacity: (back) ? 1 : 0.5
        	}, 100, function(){
						jogging(!back)
					});		
		})(false);
		/*end heartbeat*/
		
	} else {
	if(show==true) {
		//$('#heartbeat-jogging').stop();
		//function stopCount(){
		//	clearTimeout(countNumber);
		//}
		heartsound.stop();
		$('#heartbeat-jogging').stop();
		show=false;
		} else {
		show=true;
		}
	}
	
}



	
//mute button
	$('#mute').click(function(){
		heartsound.stop();
		$('#mute img').append('<img src="images/mute"/>');
	});
