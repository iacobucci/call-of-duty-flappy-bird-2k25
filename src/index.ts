import p5 from "p5";
export const DEBUG = false;

import { Bird } from "./bird";
import { Background } from "./background";
import { Title } from "./title";
import { Pipe } from "./pipe";
import { ud, Touch } from "./types";

let bird: Bird;
let background: Background;
let title: Title;

let score: number = 0;
let highscore: number = 0;

let pipes: Pipe[] = [];

const images = {
	bird: ud<p5.Image>(),
	title: ud<p5.Image>(),
	background: ud<p5.Image>(),
	minigun: ud<p5.Image>(),
	wasted: ud<p5.Image>(),
	pipe: ud<p5.Image>(),
};

const sketch = (p: p5) => {
	p.preload = () => {
		images.bird = p.loadImage("res/bird.webp");
		images.title = p.loadImage("res/title.webp");
		images.background = p.loadImage("res/background.webp");
		images.wasted = p.loadImage("res/wasted.webp");
		images.pipe = p.loadImage("res/pipe.webp");
	};

	p.setup = () => {
		const canvas = p.createCanvas(400, 800);
		canvas.parent("canvas-container");
		// if (canvas.elt.requestFullscreen)
		// 	canvas.elt.requestFullscreen();

		bird = new Bird(p);
		bird.setImg(images.bird);
		bird.setWastedImg(images.wasted);

		background = new Background(p);
		background.setImg(images.background);

		title = new Title(p);
		title.setImg(images.title);
	};

	p.draw = () => {
		p.background(0);
		background.display();
		background.tick();
		bird.update();

		if (bird.enabled) {
			if (p.frameCount % 120 == 0) {
				let pipe = new Pipe(p);
				pipe.setImg(images.pipe);
				pipes.push(pipe);
			}

			for (let pipe of pipes) {
				pipe.display();
				pipe.update();

				if (pipe.stage == 0) {
					if (pipe.bb().left < bird.bb().right) {
						if (
							bird.bb().bottom > pipe.bb().bottom ||
							bird.bb().top < pipe.bb().top
						) {
							bird.die();
							score = 0;
						}
					}
					if (pipe.bb().right <= bird.bb().left) {
						pipe.advanceStage();
						score++;
						if (highscore <= score) highscore = score;
					}
				}
			}
		}

		bird.display();
		title.display();
	};

	p.keyPressed = () => {
		onTap();

		if (p.key == "j") {
			onRightTap();
		}

		if (p.key == "k") {
			onLeftTap();
		}
	};

	p.keyReleased = () => {};

	let activeTouchIds: Set<number> = new Set();

	p.touchStarted = () => {
		for (const t of p.touches) {
			const touch = t as Touch;
			if (!activeTouchIds.has(touch.identifier)) {
				activeTouchIds.add(touch.identifier);

				onTap();

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

	const onTap = () => {
		if (title) title.hide();

		if (bird) {
			if (!bird.enabled) bird.enable();
		}
	};

	const onLeftTap = () => {
		if (bird) {
			bird.shoot();
		}
	};

	const onRightTap = () => {
		if (bird) {
			if (bird.dead) {
				bird.restart();
				pipes = [];
			} else bird.raise();
		}
	};
};

new p5(sketch);

export default sketch;
