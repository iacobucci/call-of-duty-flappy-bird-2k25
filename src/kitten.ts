import p5 from "p5";
import { DEBUG } from "./index";

export class Kitten {
	p: p5;

	x: number;
	y: number;
	width: number = 80;
	height: number = 80;

	speed: number = 0;
	amplitude: number = 0;

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

	update() {
		this.x -= this.speed;
	}

	display() {
		// dont draw pipes if out of the way
		if (this.x < -this.width) return;

		this.p.push();
		this.p.translate(-this.width / 2, -this.height / 2);

		if (this.img) this.p.image(this.img, 0, 0);

		this.p.pop();

		if (DEBUG) {
			this.p.line(0, this.bb().top, this.p.width, this.bb().top);
			this.p.line(0, this.bb().bottom, this.p.width, this.bb().bottom);
			this.p.line(this.bb().left, 0, this.bb().left, this.p.height);
			this.p.line(this.bb().right, 0, this.bb().right, this.p.height);
		}
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
