import p5 from "p5";
import { DEBUG } from "./index";

export class Bird {
	p: p5;
	x: number;
	y: number;
	v: number;
	a: number = 0.618;
	thrust: number = 10;
	enabled: boolean = false;
	dead: boolean = false;
	img: p5.Image | undefined;
	imgz: number = 12;
	height: number = 0;
	width: number = 0;
	tolerance: number = 25;

	constructor(p: p5) {
		this.p = p;
		this.x = this.p.width / 4;
		this.y = this.p.height / 4;
		this.v = 0;
	}

	setImg(img: p5.Image) {
		this.img = img;
		this.height = this.img.height / this.imgz;
		this.width = this.img.width / this.imgz;
	}

	update() {
		let outOfBounds = false;

		if (this.bb().top <= this.tolerance) {
			this.y = this.height / 2;
			outOfBounds = true;
			this.v = 0;
		}
		if (this.bb().bottom >= this.p.height - this.tolerance) {
			this.y = this.p.height - this.height / 2;
			outOfBounds = true;
			this.v = 0;
		}

		if (!outOfBounds) {
			if (this.y < this.p.height - this.tolerance && this.y > this.tolerance)
				this.v += this.a;
			this.y += this.v;
		} else {
			this.die();
		}
	}

	display() {
		if (this.img) {
			this.p.push();
			this.p.translate(this.x, this.y);
			this.p.push();
			this.p.translate(
				-this.img.width / this.imgz / 2,
				-this.img.height / this.imgz / 2,
			);
			this.p.scale(1 / this.imgz);

			this.p.image(this.img, 0, 0);

			this.p.pop();
			this.p.pop();

			if (DEBUG) {
				this.p.line(0, this.y, this.p.width, this.y);

				this.p.line(0, this.bb().top, this.p.width, this.bb().top);
				this.p.line(0, this.bb().bottom, this.p.width, this.bb().bottom);
				this.p.line(this.bb().left, 0, this.bb().left, this.p.height);
				this.p.line(this.bb().right, 0, this.bb().right, this.p.height);
			}
		} else {
			this.p.fill(255);
			this.p.circle(this.x, this.y, 30);
		}
	}

	bb() {
		return {
			top: this.y + this.height / 2,
			bottom: this.y - this.height / 2,
			left: this.x - this.width / 2,
			right: this.x + this.width / 2,
		};
	}

	die() {
		this.dead = true;
	}

	enable() {
		this.enabled = true;
	}
}
