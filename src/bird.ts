import p5 from "p5";
import { DEBUG } from "./index";

export class Bird {
	p: p5;
	x: number = 0;
	y: number = 0;
	v: number = 0;
	a: number = 0.618;

	deathy: number = 0;
	thrust: number = 10;
	enabled: boolean = false;
	dead: boolean = false;
	img: p5.Image | undefined;
	imgz: number = 12;
	height: number = 0;
	width: number = 0;
	tolerance: number = 0;
	easer: number = 20;

	wastedImg: p5.Image | undefined;

	constructor(p: p5) {
		this.p = p;
		this.restart();
	}

	restart() {
		this.x = this.p.width / 6;
		this.y = this.p.height / 2;
		this.v = 0;
		this.dead = false;
		this.enabled = false;
	}

	setImg(img: p5.Image) {
		this.img = img;
		this.height = this.img.height / this.imgz;
		this.width = this.img.width / this.imgz;
		this.tolerance = this.height;
	}

	setWastedImg(img: p5.Image) {
		this.wastedImg = img;
	}

	raise() {
		this.v -= this.thrust;
	}

	shoot() {}

	update() {
		if (!this.enabled) {
			this.y =
				this.p.height / 2 +
				(1 / 2 / 2) * this.p.height * this.p.sin(this.p.frameCount / 60);
		} else {
			if (this.dead) {
				return;
			}

			let outOfBounds = false;

			if (this.bb().top + this.easer <= 0 + this.tolerance) {
				outOfBounds = true;
			}
			if (this.bb().bottom - this.easer >= this.p.height - this.tolerance) {
				outOfBounds = true;
			}

			if (!outOfBounds) {
				if (this.y < this.p.height - this.tolerance && this.y > this.tolerance)
					this.v += this.a;

				this.y += this.v;
			} else {
				this.die();
			}
		}
	}

	display() {
		if (this.dead) {
			this.p.background(255, 0, 0);
			this.p.fill(0);
			this.p.textAlign(this.p.CENTER, this.p.CENTER);
			if (this.wastedImg)
				this.p.image(
					this.wastedImg,
					0,
					this.p.height / 2 - this.wastedImg.height / 2,
				);
		}

		if (this.img) {
			this.p.push();
			this.p.translate(this.x, this.y);
			this.p.push();
			this.p.translate(
				-this.img.width / this.imgz / 2,
				-this.img.height / this.imgz / 2,
			);
			this.p.scale(1 / this.imgz);

			// bird draw
			this.p.image(this.img, 0, 0);

			this.p.pop();
			this.p.pop();

			if (DEBUG) {
				this.p.stroke(0);

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
			top: this.y + this.height / 2 - this.easer,
			bottom: this.y - this.height / 2 + this.easer,
			left: this.x - this.width / 2,
			right: this.x + this.width / 2,
		};
	}

	die() {
		this.dead = true;
		this.deathy = this.y;
		this.v = 0;
	}

	enable() {
		this.enabled = true;
	}
}
