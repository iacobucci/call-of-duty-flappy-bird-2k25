import p5 from "p5";

export class Background {
	p: p5;
	img: p5.Image | undefined;
	t: number = 0;

	constructor(p: p5) {
		this.p = p;
	}

	setImg(img: p5.Image) {
		this.img = img;
	}

	tick() {
		this.t += 2;
		if (this.t >= this.img!.width) this.t = 0;
	}

	display() {
		if (this.img) {
			this.p.image(this.img, -this.t, 0);
			this.p.image(this.img, this.img.width-this.t, 0);
		} else {
			this.p.background(0, 255, 0);
		}
	}
}
