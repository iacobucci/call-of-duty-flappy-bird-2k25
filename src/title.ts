import p5 from "p5";

export class Title {
	p: p5;
	img: p5.Image | undefined;
	shown: boolean = true;
	hidet: number = 0;

	constructor(p: p5) {
		this.p = p;
	}

	setImg(img: p5.Image) {
		this.img = img;
	}

	hide() {
		this.shown = false;
		this.hidet = this.p.frameCount;
	}

	display() {
		if (this.img) {
			if (this.shown) {
				this.p.image(this.img, 0, 0);
			} else {
				let anim = this.p.frameCount - this.hidet;

				if (anim < this.img.height / 2)
					this.p.image(this.img, 0, -(anim * anim * 0.5));
			}
		}
	}
}
