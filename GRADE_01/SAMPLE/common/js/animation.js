
var aniId, aniIdArray = new Array();
function animate(opts) {
	var start = new Date;

    var id = setInterval(function() {
		var timePassed = new Date - start,
		    progress = timePassed / opts.duration;

		if (progress > 1)
			progress = 1;

		var delta = opts.delta(progress);
		opts.step(delta);

		if (progress === 1) {
			clearInterval(id);
		}
	}, opts.delay);

	aniId = id;
}

function spriteAnimation(spriteArray, spriteObj) {

	var index = 0;
	animate({
		delay : 100,
		duration : 400,
		delta : makeEaseOut(linear),
		step : function(delta) {
			// log('@ sprite!');
			if (index >= spriteArray.length - 1) index = spriteArray.length - 1;
			else index++;
			index++;
		}
	});

}

function makeEaseInOut(delta) {
	return function(progress) {
		if (progress < .5)
			return delta(2 * progress) / 2;
		else
			return (2 - delta(2 * (1 - progress))) / 2;
	}
}

function makeEaseOut(delta) {
	return function(progress) {
		return 1 - delta(1 - progress);
	}
}

function elastic (progress) {
	return Math.pow(2,10 * (progress - 1)) * Math.cos(20 * Math.PI * 1.5 / 3 * progress);
}

function linear (progress) {
	return progress;
}

function quad (progress) {
	return Math.pow(progress, 2);
}

function quint (progress) {
	return Math.pow(progress, 5);
}

function circ (progress) {
	return 1- Math.sin(Math.acos(progress));
}

function back (progress) {
	return Math.pow(progress,2)*((1.5+ 1)*progress- 1.5);
}

function bounce (progress) {
	for (var a = 0, b = 1; 1; a += b, b /= 2) {
		if (progress >= (7 - 4 * a) / 11) {
			return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
		}
	}
}

function runAnimation (animateElement, stepAni, animateOption) {

	animate({
		delay : animateOption.delay,
		duration : animateOption.duration,
		delta :animateOption.delta,
		step : function(delta) {
			stepAni(animateElement, delta);
		}
	});

}