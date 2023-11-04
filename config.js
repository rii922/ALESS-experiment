const DURATION = 500;
const WHEEL_DIAMETER = 300;
const WHEEL_THICKNESS = 50;
const HANDLE_DIAMETER = 50;
const DEFAULT_L = 70;
const DEFAULT_C = 50;
const DEFAULT_H = 0;
const DEFAULT_LCH = [DEFAULT_L, DEFAULT_C, DEFAULT_H];
const DIGITS = 4;

const QUESTIONS = [
	{ id: 1, duration: 100, colorLch: [DEFAULT_L, DEFAULT_C, 0], interval: 1000 },
	{ id: 2, duration: 200, colorLch: [DEFAULT_L, DEFAULT_C, 60], interval: 1000 },
	{ id: 3, duration: 300, colorLch: [DEFAULT_L, DEFAULT_C, 120], interval: 1000 },
	{ id: 4, duration: 400, colorLch: [DEFAULT_L, DEFAULT_C, 180], interval: 1000 },
	{ id: 5, duration: 500, colorLch: [DEFAULT_L, DEFAULT_C, 240], interval: 1000 }
];