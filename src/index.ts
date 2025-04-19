import p5 from "p5";
export const DEBUG = false;

import { Bird } from "./bird";
import { Background } from "./background";
import { Title } from "./title";
import { Pipe } from "./pipe";
import { Kitten } from "./kitten";
import { ud, Touch } from "./types";

let bird: Bird;
let background: Background;
let title: Title;

let score: number = 0;
let highscore: number = 0;

let pipes: Pipe[] = [];
let kittens: Kitten[] = [];

const images = {
	bird: ud<p5.Image>(),
	title: ud<p5.Image>(),
	background: ud<p5.Image>(),
	minigun: ud<p5.Image>(),
	wasted: ud<p5.Image>(),
	pipe: ud<p5.Image>(),
	beam: ud<p5.Image>(),
	kitten1: ud<p5.Image>(),
	kitten2: ud<p5.Image>(),
	kitten3: ud<p5.Image>(),
	kitten4: ud<p5.Image>(),
	kitten5: ud<p5.Image>(),
};

let font: p5.Font | undefined;

const sketch = (p: p5) => {
	p.preload = () => {
		images.bird = p.loadImage("res/bird.webp");
		images.title = p.loadImage("res/title.webp");
		images.background = p.loadImage("res/background.webp");
		images.wasted = p.loadImage("res/wasted.webp");
		images.pipe = p.loadImage("res/pipe.webp");
		images.beam = p.loadImage("res/beam.webp");
		images.minigun = p.loadImage("res/minigun.webp");
		images.kitten1 = p.loadImage("res/kitten1.webp");
		images.kitten2 = p.loadImage("res/kitten2.webp");
		images.kitten3 = p.loadImage("res/kitten3.webp");
		images.kitten4 = p.loadImage("res/kitten4.webp");
		images.kitten5 = p.loadImage("res/kitten5.webp");
		font = p.loadFont("res/minecraft.ttf");
	};

	p.setup = () => {
		const canvas = p.createCanvas(400, 800);
		canvas.parent("canvas-container");
		// if (canvas.elt.requestFullscreen)
		// 	canvas.elt.requestFullscreen();

		bird = new Bird(p);
		bird.setImg(images.bird);
		bird.setWastedImg(images.wasted);
		bird.setBeamImg(images.beam);
		bird.setMinigunImg(images.minigun);

		background = new Background(p);
		background.setImg(images.background);

		title = new Title(p);
		title.setImg(images.title);

		if (font) p.textFont(font);
		p.textSize(20);
		p.textAlign(p.CENTER, p.CENTER);

		let hs = localStorage.getItem("highscore");
		if (hs) {
			highscore = Number.parseInt(hs);
		}
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
						}
					}
					if (pipe.bb().right <= bird.bb().left) {
						pipe.advanceStage();

						if (!bird.dead) {
							score++;
							bird.addAmmo();
							if (highscore <= score) {
								highscore = score;
								localStorage.setItem("highscore", "" + highscore);
							}
						}
					}
				}
			}

			if (p.frameCount % 240 == 0) {
				let kitten = new Kitten(p);
				let r = p.random(0, 6);

				kitten.setImg(images.kitten5);
				if (r < 4) kitten.setImg(images.kitten4);
				if (r < 3) kitten.setImg(images.kitten3);
				if (r < 2) kitten.setImg(images.kitten2);
				if (r < 1) kitten.setImg(images.kitten1);

				kittens.push(kitten);
			}

			for (let kitten of kittens) {
				kitten.update();
				kitten.display();
			}
		}

		p.fill(255);

		title.display();

		p.text("AMMO = " + bird.ammo, p.width / 2, p.height - p.height / 12);

		bird.display();

		p.text(
			"SCORE = " + score + " - " + "HIGH = " + highscore,
			p.width / 2,
			p.height / 12,
		);
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
				if (p.frameCount >= bird.deathframe + 5) {
					bird.restart();
					pipes = [];
					kittens = [];
					score = 0;
					title.shown = true;
				}
			} else bird.raise();
		}
	};
};

new p5(sketch);

export default sketch;
