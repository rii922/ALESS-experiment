// http://www.psy.ritsumei.ac.jp/~akitaoka/RGBtoXYZ_etal01.html

// function hexString2rgb(hex) {
// 	return [
// 		parseInt(hex.substring(1, 3), 16),
// 		parseInt(hex.substring(3, 5), 16),
// 		parseInt(hex.substring(5, 7), 16)
// 	];
// }
// function rgb2linear(rgb) {
// 	var linear = [];
// 	for (var i = 0; i < 3; i++) {
// 		var x = rgb[i]/255;
// 		if (x <= 0.04045) {
// 			x /= 12.92;
// 		} else {
// 			x = Math.pow((x+0.055)/1.055, 2.4);
// 		}
// 		linear.push(x);
// 	}
// 	return linear;
// }
// function linear2xyz(linear) {
// 	return [
// 		linear[0]*0.412391+linear[1]*0.357584+linear[2]*0.180481,
// 		linear[0]*0.212639+linear[1]*0.715169+linear[2]*0.072192,
// 		linear[0]*0.019331+linear[1]*0.119195+linear[2]*0.950532
// 	];
// }
// function f(t) {
// 	if (t > 216/24389) {
// 		return Math.pow(t, 1/3);
// 	} else {
// 		return t*841/108+4/29;
// 	}
// }
// function xyz2lab(xyz) {
// 	const xn = 0.412391+0.357584+0.180481;
// 	const yn = 0.212639+0.715169+0.072192;
// 	const zn = 0.019331+0.119195+0.950532;
// 	return [
// 		f(xyz[1]/yn)*116-16,
// 		(f(xyz[0]/xn)-f(xyz[1]/yn))*500,
// 		(f(xyz[1]/yn)-f(xyz[2]/zn))*200
// 	];
// }
// function rgb2lab(rgb) {
// 	return xyz2lab(linear2xyz(rgb2linear(rgb)));
// }
// function hexString2lab(hex) {
// 	return rgb2lab(hexString2rgb(hex));
// }
function lch2lab(lch) {
	return [lch[0], lch[1]*Math.cos(lch[2]/180*Math.PI), lch[1]*Math.sin(lch[2]/180*Math.PI)]
}
function rgb2bgColor(rgb) {
	return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}
function colorDiff4lab(lab1, lab2) {
	var diffSquare = 0;
	for (var i = 0; i < 3; i++) {
		diffSquare += (lab1[i]-lab2[i])*(lab1[i]-lab2[i]);
	}
	return Math.sqrt(diffSquare);
}
function colorDiff4lch(lch1, lch2) {
	return colorDiff4lab(lch2lab(lch1), lch2lab(lch2));
}