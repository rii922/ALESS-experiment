var colorWheel;
var questionNo;
var questions;
function shuffle(array) {
	for (var i = array.length-1; i >= 0; i--) {
		var j = Math.floor(Math.random()*(i+1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
function randomRange(a, b) {
	return Math.random()*(b-a)+a;
}
function preventTouchmove(e) {
	e.preventDefault();
}
function init() {
	$("#countdown, #color_shown, #color_wheel, #color_answered, #next, #end, #result").hide();
	colorWheel = new LchColorWheel({
		appendTo: document.getElementById("color_wheel"),
		wheelDiameter: WHEEL_DIAMETER,
		wheelThickness: WHEEL_THICKNESS,
		handleDiameter: HANDLE_DIAMETER,
		drawsRgbValidityBoundary: false,
		onChange: function(color) {
			$("#color_answered").css("backgroundColor", rgb2bgColor(color.rgb));
		}
	});
	questionNo = 0;
	questions = shuffle(QUESTIONS);
	var tr =
	`<tr>
		<td class="id"></td>
		<td class="color-shown">
			<div class="color-square"></div>
			<ul class="lch"></ul>
		</td>
		<td class="color-answered">
			<div class="color-square"></div>
			<ul class="lch"></ul>
		</td>
		<td class="difference"></td>
	</tr>`;
	for (var i = 0; i < questions.length; i++) {
		$("#result table tbody").append(tr);
	}
	$("#start").on("click", function() {
		$(this).off();
		start();
	});
	$("#title, #start").show();
}
function start() {
	$("#start").fadeOut(DURATION);
	$("#title").fadeOut(DURATION, countdown);
}
async function countdown() {
	$countdown = $("#countdown");
	var interval;
	$countdown.show();
	for (var cnt = 3; cnt >= 1; cnt--) {
		$countdown.text(cnt);
		await new Promise(function(resolve) {
			setTimeout(resolve, 1000);
		});
	}
	$countdown.hide().empty();
	showColor();
}
function showColor() {
	$colorShown = $("#color_shown");
	colorWheel.lch = questions[questionNo].colorLch;
	var $tr = $("#result tbody tr").eq(questionNo);
	$tr.find(".id").text(questions[questionNo].id);
	$tr.find(".color-shown .color-square").css("backgroundColor", rgb2bgColor(colorWheel.rgb));
	var li =
	`<li>L: ${questions[questionNo].colorLch[0].toFixed(DIGITS)}</li>
	<li>C: ${questions[questionNo].colorLch[1].toFixed(DIGITS)}</li>
	<li>h: ${questions[questionNo].colorLch[2].toFixed(DIGITS)}</li>`;
	$tr.find(".color-shown .lch").append(li);
	$colorShown.css("backgroundColor", rgb2bgColor(colorWheel.rgb)).show();
	new Promise(function(resolve) {
		setTimeout(function() {
			$colorShown.hide();
			resolve();
		}, questions[questionNo].duration);
	}).then(function() {
		setTimeout(showColorWheel, questions[questionNo].interval);
	});
}
function showColorWheel() {
	$("#color_wheel").css("transform", "translate(-50%, -50%) rotate("+randomRange(0, 360)+"deg)");
	colorWheel.lch = [
		colorWheel.lch[0],
		colorWheel.lch[1],
		(questions[questionNo].colorLch[2]+randomRange(120, 240)+360)%360
	];
	var updateResult = function() {
		var $tr = $("#result tbody tr").eq(questionNo);
		$tr.find(".color-answered .color-square").css("backgroundColor", rgb2bgColor(colorWheel.rgb));
		var li =
		`<li>L: ${colorWheel.lch[0].toFixed(DIGITS)}</li>
		<li>C: ${colorWheel.lch[1].toFixed(DIGITS)}</li>
		<li>h: ${colorWheel.lch[2].toFixed(DIGITS)}</li>`;
		$tr.find(".color-answered .lch").append(li);
		$tr.find(".difference").text(colorDiff4lch(questions[questionNo].colorLch, colorWheel.lch).toFixed(DIGITS));
		console.log("abo");
	};
	if (questionNo+1 >= questions.length) {
		$("#end").on("click", function() {
			$(this).off().fadeOut(DURATION, function() {
				$("#result").fadeIn(DURATION);
			});
			updateResult();
			// document.removeEventListener("touchmove", preventTouchmove, { passive: false });
			$("#color_answered, #color_wheel").fadeOut(DURATION);
		}).show();
	} else {
		$("#next").on("click", function() {
			$(this).off().fadeOut(DURATION, countdown);
			updateResult();
			questionNo++;
			$("#color_answered, #color_wheel").fadeOut(DURATION);
		}).show();
	}
	$("#color_answered, #color_wheel").show();
}
$(function() {
	// document.addEventListener("touchmove", preventTouchmove, { passive: false });
	init();
});