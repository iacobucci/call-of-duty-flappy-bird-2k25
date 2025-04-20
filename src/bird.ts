import p5 from "p5";
import { DEBUG } from "./index";
import { playDeath } from "./index";

export class Bird {
	p: p5;
	x: number = 0;
	y: number = 0;
	v: number = 0;
	a: number = 0.618;
	thrust: number = 10;

	enabled: boolean = false;

	dead: boolean = false;
	deathy: number = 0;
	deathframe: number = 0;
	deathfunc: any;

	img: p5.Image | undefined;
	imgz: number = 12;
	height: number = 0;
	width: number = 0;

	tolerance: number = 0;
	easer: number = 10;

	wastedImg: p5.Image | undefined;

	ammo: number = 0;
	shotlength: number = 4;
	shotframe: number = -this.shotlength;
	beamImg: p5.Image | undefined;
	minigunImg: p5.Image | undefined;
	shooting = false;
	aimease = 4;

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
		this.ammo = 0;
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

	setBeamImg(img: p5.Image) {
		this.beamImg = img;
	}

	setMinigunImg(img: p5.Image) {
		this.minigunImg = img;
	}

	raise() {
		this.v -= this.thrust;
	}

	shoot() {
		if (!this.dead && this.ammo > 0) {
			this.shotframe = this.p.frameCount;
			this.ammo--;
		}
	}

	update() {
		if (!this.enabled) {
			this.y =
				this.p.height / 2 +
				(1 / 2 / 2) * this.p.height * this.p.sin(this.p.frameCount / 60);
		} else {
			if (this.dead) {
				return;
			}

			this.shooting = false;
			if (this.p.frameCount <= this.shotframe + this.shotlength) {
				this.shooting = true;
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
				this.deathfunc();
				this.die();
			}
		}
	}


	display() {
		if (this.dead) {
			this.p.background(255, 0, 0);
			this.p.fill(0);

			let t = this.p.frameCount - this.deathframe;

			if (t <= 5) {
				this.p.textSize((5 - t) * (5 - t) * 6);
			}

			this.p.text("wasted", this.p.width / 2, this.p.height / 2);
		}

		if (this.img) {
			this.p.push();
			this.p.translate(this.x, this.y);

			// bird
			this.p.push();
			this.p.translate(
				-this.img.width / this.imgz / 2,
				-this.img.height / this.imgz / 2,
			);
			this.p.scale(1 / this.imgz);
			this.p.image(this.img, 0, 0);
			this.p.pop();

			// minigun
			if (this.ammo > 0) {
				this.p.push();
				if (this.minigunImg) {
					this.p.scale(0.185);

					this.p.rotate(-this.p.PI / 32);

					this.p.translate(
						-this.minigunImg.width / 2 + 120,
						-this.minigunImg.height / 2 + 120,
					);
					this.p.image(this.minigunImg, 0, 0);
				}
				this.p.pop();
			}

			// beam
			if (this.p.frameCount <= this.shotframe + this.shotlength) {
				this.p.push();
				if (this.beamImg) {
					this.p.translate(
						-this.beamImg.width / 2 + 30,
						-this.beamImg.height / 2 + 10,
					);
					this.p.rotate(-this.p.PI / 128);
					this.p.image(this.beamImg, 0, 0);
				}
				this.p.pop();
			}

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
		if (!this.dead) this.deathframe = this.p.frameCount;
		this.dead = true;
		this.deathy = this.y;
		this.v = 0;
	}

	enable() {
		this.enabled = true;
	}

	addAmmo() {
		this.ammo += 1;
	}
}
