import p5 from "p5";
import { DEBUG } from "./index";

export class Kitten {
	p: p5;

	x: number;
	y: number;
	width: number = 80;
	height: number = 80;

	speed: number = 3;
	amplitude: number = 0;

	stage: number = 0;

	img: p5.Image | undefined;

	clearance: number = 200;

	constructor(p: p5) {
		this.p = p;
		this.y = this.p.random(this.clearance, this.p.height - this.clearance);
		this.x = this.p.width + this.width;

		this.speed = this.p.random(2,4);
		this.amplitude = this.p.random(0, 300);

	}

	setImg(img: p5.Image) {
		this.img = img;
	}

	update() {
		this.x -= this.speed;

		this.x = this.p.width/2;
		this.y = this.p.height/2;
	}

	display() {
		if (this.x < -this.width) return;

		this.p.push();
		this.p.translate(this.x, this.y);

		if (this.img) {
			this.p.push();
			this.p.translate(-this.img.width / 2, -this.img.height / 2);
			this.p.scale(this.width / this.img.width, this.height / this.img.height);
			this.p.image(this.img, 0, 0);
			this.p.pop();
		}
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
