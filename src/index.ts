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

	let activeTouchIds: Set<number> = new Set();

	p.touchStarted = () => {
		for (const t of p.touches) {
			const touch = t as Touch;
			if (!activeTouchIds.has(touch.identifier)) {
				activeTouchIds.add(touch.identifier);

				if (touch.x < p.width / 2) {
					onLeftTap();
				} else {
					onRightTap();
				}
			}
		}
		return false;
	};
	p.touchEnded = () => {
		const stillActive = new Set<number>();
		for (const t of p.touches) {
			const touch = t as Touch;
			stillActive.add(touch.identifier);
		}

		for (const id of Array.from(activeTouchIds)) {
			if (!stillActive.has(id)) {
				activeTouchIds.delete(id);
			}
		}
		return false;
	};

	const onLeftTap = () => {
	};

	const onRightTap = () => {
	};
};

new p5(sketch);

export default sketch;
