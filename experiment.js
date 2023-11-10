var colorWheel;
var participantNo;
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
		colorWheel.lch[2]+randomRange(120, 240)
	];
}
function init() {
	$("#start, #matching_instruction, #start_matching, #memorizing_instruction, #start_memorizing, #countdown, #question_no, #color_shown, #color_wheel, #color_answered, #next, #end, #result").hide();
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
	var trMatching =
	`<tr>
		<td class="question-no"></td>
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
		$("#matching_result tbody").append(trMatching);
	}
	var trMemorizing =
	`<tr>
		<td class="question-no"></td>
		<td class="duration"></td>
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
	for (var i = 0; i < TOTAL_MEMORIZING_TRIALS; i++) {
		$("#memorizing_result tbody").append(trMemorizing);
	}
	var trCompact =
	`<tr>
		<td class="question-no"></td>
		<td class="duration"></td>
		<td class="color-shown"></td>
		<td class="color-answered"></td>
		<td class="difference"></td>
	</tr>`;
	for (var i = 0; i < TOTAL_TRIALS; i++) {
		$("#compact_result tbody").append(trCompact);
		$("#participant_no").append(`<option value="${i}">${i}</option>`);
	}
	$("#participant_no").change(function() {
		if ($(this).val() === "") {
			$("#start").off().fadeOut(DURATION);
		} else {
			$("#start").off().fadeIn(DURATION).on("click", function() {
				$(this).off();
				participantNo = Number($(this).val());
				var questionColorsLchRotated = QUESTION_COLORS_LCH.slice(participantNo, TOTAL_TRIALS).concat(QUESTION_COLORS_LCH.slice(0, participantNo));
				matchingQuestions = shuffle(questionColorsLchRotated.slice(0, TOTAL_MATCHING_TRIALS));
				memorizingQuestions = [];
				for (var i = 0; i < TOTAL_MEMORIZING_TRIALS; i++) {
					memorizingQuestions.push({
						lch: questionColorsLchRotated[TOTAL_MATCHING_TRIALS+i],
						duration: MEMORIZING_DURATIONS[i]
					});
				}
				shuffle(memorizingQuestions);
				$("#participant_no_result").text(`被験者番号: ${participantNo}`);
				$("#title").fadeOut(DURATION, prepareMatching);
				$("#participant_no_form, #start").fadeOut(DURATION);
			});
		}
	});
	$("#title, #participant_no_form").show();
}
function prepareMatching() {
	questionNo = 0;
	$("#color_shown").css({
		top: "30%",
		left: "20%"
	});
	$("#start_matching").on("click", function() {
		$(this).off().fadeOut(DURATION, showMatching);
		$("#matching_instruction").fadeOut(DURATION);
	}).fadeIn(DURATION);
	$("#matching_instruction").fadeIn(DURATION);
}
function showMatching() {
	$("#question_no").text(`第${questionNo+1}問(全${TOTAL_MATCHING_TRIALS}問)`);
	colorWheel.lch = matchingQuestions[questionNo];
	$("#color_shown").css("backgroundColor", rgb2bgColor(colorWheel.rgb));
	var $tr = $("#matching_result tbody tr").eq(questionNo);
	$tr.find(".question-no").text(`第${questionNo+1}問`);
	$tr.find(".color-shown .color-square").css("backgroundColor", rgb2bgColor(colorWheel.rgb));
	var li =
	`<li>L: ${matchingQuestions[questionNo][0].toFixed(DIGITS)}</li>
	<li>C: ${matchingQuestions[questionNo][1].toFixed(DIGITS)}</li>
	<li>h: ${matchingQuestions[questionNo][2].toFixed(DIGITS)}</li>`;
	$tr.find(".color-shown .lch").append(li);
	var $trCompact = $("#compact_result tbody tr").eq(questionNo);
	$trCompact.find(".question-no").text(`Match ${questionNo+1}`);
	$trCompact.find(".duration").text("--");
	$trCompact.find(".color-shown").text(matchingQuestions[questionNo][2].toFixed(DIGITS));
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
		var difference = colorDiff4lch(matchingQuestions[questionNo], colorWheel.lch).toFixed(DIGITS);
		$tr.find(".difference").text(difference);
		$trCompact.find(".color-answered").text(colorWheel.lch[2].toFixed(DIGITS));
		$trCompact.find(".difference").text(difference);
		$("#question_no, #color_shown, #color_answered, #color_wheel").fadeOut(DURATION);
	});
	$("#question_no, #color_shown, #color_answered, #color_wheel, #next").fadeIn(DURATION);
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
	$("#question_no").text(`第${questionNo+1}問(全${TOTAL_MEMORIZING_TRIALS}問)`).stop(false, true).show();
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
	colorWheel.lch = memorizingQuestions[questionNo].lch;
	var $tr = $("#memorizing_result tbody tr").eq(questionNo);
	$tr.find(".question-no").text(`第${questionNo+1}問`);
	$tr.find(".duration").text(`${memorizingQuestions[questionNo].duration}ms`);
	$tr.find(".color-shown .color-square").css("backgroundColor", rgb2bgColor(colorWheel.rgb));
	var li =
	`<li>L: ${memorizingQuestions[questionNo].lch[0].toFixed(DIGITS)}</li>
	<li>C: ${memorizingQuestions[questionNo].lch[1].toFixed(DIGITS)}</li>
	<li>h: ${memorizingQuestions[questionNo].lch[2].toFixed(DIGITS)}</li>`;
	$tr.find(".color-shown .lch").append(li);
	var $trCompact = $("#compact_result tbody tr").eq(TOTAL_MATCHING_TRIALS+questionNo);
	$trCompact.find(".question-no").text(`Memorize ${questionNo+1}`);
	$trCompact.find(".duration").text(memorizingQuestions[questionNo].duration);
	$trCompact.find(".color-shown").text(memorizingQuestions[questionNo].lch[2].toFixed(DIGITS));
	$colorShown.css("backgroundColor", rgb2bgColor(colorWheel.rgb)).show();
	new Promise(function(resolve) {
		setTimeout(function() {
			$colorShown.hide();
			resolve();
		}, memorizingQuestions[questionNo].duration);
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
		var difference = colorDiff4lch(memorizingQuestions[questionNo].lch, colorWheel.lch).toFixed(DIGITS);
		$tr.find(".difference").text(difference);
		var $trCompact = $("#compact_result tbody tr").eq(TOTAL_MATCHING_TRIALS+questionNo);
		$trCompact.find(".color-answered").text(colorWheel.lch[2].toFixed(DIGITS));
		$trCompact.find(".difference").text(difference);
	};
	if (questionNo+1 >= TOTAL_MEMORIZING_TRIALS) {
		$("#end").on("click", function() {
			$(this).off().fadeOut(DURATION, function() {
				$("#result").fadeIn(DURATION);
			});
			updateResult();
			$("#question_no, #color_answered, #color_wheel").fadeOut(DURATION);
		}).show();
	} else {
		$("#next").on("click", function() {
			$(this).off().fadeOut(DURATION, countdown);
			updateResult();
			questionNo++;
			$("#question_no, #color_answered, #color_wheel").fadeOut(DURATION);
		}).show();
	}
	$("#color_answered, #color_wheel").show();
}
$(function() {
	document.addEventListener("touchmove", function(e) {
		if (e.touches.length > 1) {
			e.preventDefault();
		}
	}, {passive: false});
	document.addEventListener("dblclick", function(e) {
		e.preventDefault();
	}, {passive: false});
	document.onselectstart = function() {
		return false;
	}
	init();
});
