import p5 from "p5";
import { DEBUG } from "./index";

export class Pipe {
	p: p5;

	x: number;
	y: number;
	width: number = 80;
	height: number = 225;
	speed: number = 2.5;

	stage: number = 0;

	img: p5.Image | undefined;

	clearance: number = 200;

	constructor(p: p5) {
		this.p = p;
		this.y = this.p.random(this.clearance, this.p.height - this.clearance);
		this.x = this.p.width + this.width;
	}

	setImg(img: p5.Image) {
		this.img = img;
	}

	display() {
		// dont draw pipes if out of the way
		if (this.x < -this.width) return;

		this.p.push();
		this.p.translate(-this.width / 2, -this.height / 2);

		if (DEBUG) {
			this.p.noStroke();
			if (this.stage == 0) this.p.fill(255, 0, 255);
			if (this.stage == 1) this.p.fill(255, 255, 0);
			this.p.rect(this.x, this.y, this.width, this.height);
		}

		if (this.img) {
			this.p.push();
			this.p.image(this.img, this.x - 10, this.y + this.height);
			this.p.scale(1, -1);
			this.p.image(
				this.img,
				this.x - 10,
				-(this.y + this.height) + this.height,
			);

			this.p.pop();
		}

		this.p.pop();

		if (DEBUG) {
			this.p.stroke(0);
			this.p.line(0, this.bb().top, this.p.width, this.bb().top);
			this.p.line(0, this.bb().bottom, this.p.width, this.bb().bottom);
			this.p.line(this.bb().left, 0, this.bb().left, this.p.height);
			this.p.line(this.bb().right, 0, this.bb().right, this.p.height);
		}
	}

	update() {
		this.x -= this.speed;
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
