import p5 from "p5";
export const DEBUG = true;

import { Bird } from "./bird";
import { Background } from "./background";
import { Title } from "./title";
import { ud, Touch } from "./types";

let bird: Bird;
let background: Background;
let title: Title;

const images = {
	bird: ud<p5.Image>(),
	title: ud<p5.Image>(),
	background: ud<p5.Image>(),
	minigun: ud<p5.Image>(),
};

const sketch = (p: p5) => {
	p.preload = () => {
		images.bird = p.loadImage("res/bird.webp");
		images.title = p.loadImage("res/title.webp");
		images.background = p.loadImage("res/background.webp");
	};

	p.setup = () => {
		const canvas = p.createCanvas(400, 800);
		canvas.parent("canvas-container");
		// if (canvas.elt.requestFullscreen)
		// 	canvas.elt.requestFullscreen();

		bird = new Bird(p);
		bird.setImg(images.bird);

		background = new Background(p);
		background.setImg(images.background);

		title = new Title(p);
		title.setImg(images.title);
	};

	p.draw = () => {
		p.background(0);
		background.display();
		background.tick();
		bird.display();
		title.display();
	};

	p.keyPressed = () => {
		if (p.key == "t") {
			title.hide();
			bird.enable();
		}
	};

	p.keyReleased = () => {};

	let leftPressed = false;
	let rightPressed = true;

	p.touchStarted = () => {
		for (let t of p.touches) {
			if ((t as Touch).x < p.width / 2) {
				leftPressed = true;
			} else {
				rightPressed = true;
			}
		}
		return false; // Previene lo scrolling su mobile
	};
	p.touchEnded = () => {
		// Quando un tocco finisce, controlliamo quanti ne restano
		// Se non ci sono più tocchi in una metà, disattiviamo il flag
		let stillLeft = false;
		let stillRight = false;

		for (let t of p.touches) {
			if ((t as Touch).x < p.width / 2) stillLeft = true;
			else stillRight = true;
		}

		leftPressed = stillLeft;
		rightPressed = stillRight;

		return false;
	};
};

new p5(sketch);

export default sketch;
