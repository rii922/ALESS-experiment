var colorWheel;
var questionNo;
var matchingQuestions;
var memorizingQuestions;
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
function disturbColorWheel() {
	$("#color_wheel").css("transform", "translate(-50%, -50%) rotate("+randomRange(0, 360)+"deg)");
	colorWheel.lch = [
		colorWheel.lch[0],
		colorWheel.lch[1],
		(colorWheel.lch[2]+randomRange(120, 240)+360)%360
	];
}
function init() {
	$("#matching_instruction, #start_matching, #memorizing_instruction, #start_memorizing, #countdown, #color_shown, #color_wheel, #color_answered, #next, #end, #result").hide();
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
	matchingQuestions = QUESTION_COLORS_LCH.slice(0, TOTAL_MATCHING_TRIALS);
	memorizingQuestions = QUESTION_COLORS_LCH.slice(-TOTAL_MEMORIZING_TRIALS);
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
	for (var i = 0; i < TOTAL_MATCHING_TRIALS; i++) {
		$("#matching_result tbody").append(tr);
	}
	for (var i = 0; i < TOTAL_MEMORIZING_TRIALS; i++) {
		$("#memorizing_result tbody").append(tr);
	}
	$("#title, #touch_instruction").show();
	$("#wrapper").on("click", function() {
		$(this).off();
		$("#title").fadeOut(DURATION, prepareMatching);
		$("#touch_instruction").fadeOut(DURATION);
	});
}
function prepareMatching() {
	questionNo = 0;
	$("#color_shown").css({
		top: "20%",
		left: "20%"
	});
	$("#start_matching").on("click", function() {
		$(this).off().fadeOut(DURATION, showMatching);
		$("#matching_instruction").fadeOut(DURATION);
	}).fadeIn(DURATION);
	$("#matching_instruction").fadeIn(DURATION);
}
function showMatching() {
	colorWheel.lch = matchingQuestions[questionNo];
	$("#color_shown").css("backgroundColor", rgb2bgColor(colorWheel.rgb));
	var $tr = $("#matching_result tbody tr").eq(questionNo);
	$tr.find(".id").text(questionNo);
	$tr.find(".color-shown .color-square").css("backgroundColor", rgb2bgColor(colorWheel.rgb));
	var li =
	`<li>L: ${matchingQuestions[questionNo][0].toFixed(DIGITS)}</li>
	<li>C: ${matchingQuestions[questionNo][1].toFixed(DIGITS)}</li>
	<li>h: ${matchingQuestions[questionNo][2].toFixed(DIGITS)}</li>`;
	$tr.find(".color-shown .lch").append(li);
	disturbColorWheel();
	$("#next").on("click", function() {
		$(this).off().fadeOut(DURATION, function() {
			if (questionNo+1 >= TOTAL_MATCHING_TRIALS) {
				prepareMemorizing();
			} else {
				questionNo++;
				showMatching();
			}
		});
		$tr.find(".color-answered .color-square").css("backgroundColor", rgb2bgColor(colorWheel.rgb));
		var li =
		`<li>L: ${colorWheel.lch[0].toFixed(DIGITS)}</li>
		<li>C: ${colorWheel.lch[1].toFixed(DIGITS)}</li>
		<li>h: ${colorWheel.lch[2].toFixed(DIGITS)}</li>`;
		$tr.find(".color-answered .lch").append(li);
		$tr.find(".difference").text(colorDiff4lch(matchingQuestions[questionNo], colorWheel.lch).toFixed(DIGITS));
		$("#color_shown, #color_answered, #color_wheel").fadeOut(DURATION);
	});
	$("#color_shown, #color_answered, #color_wheel, #next").fadeIn(DURATION);
}
function prepareMemorizing() {
	questionNo = 0;
	$("#color_shown").css({
		top: "50%",
		left: "50%"
	});
	$("#start_memorizing").on("click", function() {
		$(this).off().fadeOut(DURATION, countdown);
		$("#memorizing_instruction").fadeOut(DURATION);
	}).fadeIn(DURATION);
	$("#memorizing_instruction").fadeIn(DURATION);
}
async function countdown() {
	$countdown = $("#countdown");
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
	colorWheel.lch = memorizingQuestions[questionNo];
	var $tr = $("#memorizing_result tbody tr").eq(questionNo);
	$tr.find(".id").text(questionNo);
	$tr.find(".color-shown .color-square").css("backgroundColor", rgb2bgColor(colorWheel.rgb));
	var li =
	`<li>L: ${memorizingQuestions[questionNo][0].toFixed(DIGITS)}</li>
	<li>C: ${memorizingQuestions[questionNo][1].toFixed(DIGITS)}</li>
	<li>h: ${memorizingQuestions[questionNo][2].toFixed(DIGITS)}</li>`;
	$tr.find(".color-shown .lch").append(li);
	$colorShown.css("backgroundColor", rgb2bgColor(colorWheel.rgb)).show();
	new Promise(function(resolve) {
		setTimeout(function() {
			$colorShown.hide();
			resolve();
		}, MEMORIZING_DURATIONS[questionNo]);
	}).then(function() {
		setTimeout(showColorWheel, INTERVAL);
	});
}
function showColorWheel() {
	disturbColorWheel();
	var updateResult = function() {
		var $tr = $("#memorizing_result tbody tr").eq(questionNo);
		$tr.find(".color-answered .color-square").css("backgroundColor", rgb2bgColor(colorWheel.rgb));
		var li =
		`<li>L: ${colorWheel.lch[0].toFixed(DIGITS)}</li>
		<li>C: ${colorWheel.lch[1].toFixed(DIGITS)}</li>
		<li>h: ${colorWheel.lch[2].toFixed(DIGITS)}</li>`;
		$tr.find(".color-answered .lch").append(li);
		$tr.find(".difference").text(colorDiff4lch(memorizingQuestions[questionNo], colorWheel.lch).toFixed(DIGITS));
	};
	if (questionNo+1 >= TOTAL_MEMORIZING_TRIALS) {
		$("#end").on("click", function() {
			$(this).off().fadeOut(DURATION, function() {
				$("#result").fadeIn(DURATION);
			});
			updateResult();
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
$(init);