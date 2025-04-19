import p5 from "p5";
import { DEBUG } from "./index";

export class Kitten {
	p: p5;

	x: number;
	y: number;
	basey: number;
	width: number = 80;
	height: number = 80;

	speed: number = 3;
	amplitude: number = 0;

	stage: number = 0;

	img: p5.Image | undefined;
	explosionImg: p5.Image | undefined;

	clearance: number = 200;
	explosiont: number = 0;
	explosionlength: number = 4;

	easer: number = 12;

	dead = false;

	constructor(p: p5) {
		this.p = p;
		this.basey = this.p.random(this.clearance, this.p.height - this.clearance);
		this.y = this.basey;
		this.x = this.p.width + this.width;

		this.speed = this.p.random(2, 4);
		this.amplitude = this.p.random(0, 100);
	}

	setImg(img: p5.Image) {
		this.img = img;
	}

	setExplosionImg(img: p5.Image) {
		this.explosionImg = img;
	}

	update() {
		this.x -= this.speed;
		this.y = this.basey + this.amplitude * this.p.sin(this.p.frameCount / 30);
	}

	display() {
		if (this.x < -this.width) return;

		this.p.push();
		this.p.translate(this.x, this.y);

		if (this.img) {
			this.p.push();
			this.p.scale(this.width / this.img.width, this.height / this.img.height);
			if (!this.dead)
				this.p.image(this.img, -this.img.width / 2, -this.img.height / 2);
			this.p.pop();
		}

		if (this.explosionImg) {
			if (this.p.frameCount <= this.explosiont + this.explosionlength) {

				let step = this.p.frameCount - this.explosiont;

				this.p.push();
				this.p.scale(
					((step * step * 0.3) * this.width) / this.explosionImg.width,
					((step * step * 0.3) * this.height) / this.explosionImg.height,
				);
				this.p.image(
					this.explosionImg,
					-this.explosionImg.width / 2,
					-this.explosionImg.height / 2,
				);
				this.p.pop();
			}
		}

		this.p.pop();

		if (DEBUG) {
			this.p.line(0, this.bb().top, this.p.width, this.bb().top);
			this.p.line(0, this.bb().bottom, this.p.width, this.bb().bottom);
			this.p.line(this.bb().left, 0, this.bb().left, this.p.height);
			this.p.line(this.bb().right, 0, this.bb().right, this.p.height);
		}
	}

	die() {
		this.explosiont = this.p.frameCount;
		this.dead = true;
	}

	advanceStage() {
		this.stage++;
	}

	bb() {
		return {
			top: this.y - this.height / 2,
			bottom: this.y + this.height / 2,
			left: this.x - this.width / 2,
			right: this.x + this.width / 2,
		};
	}
}
