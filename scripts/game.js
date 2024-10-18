const CANVAS 			    = document.getElementById('game');
const FRAMES_PER_SECOND     = 60;
const PRODUCT_SIZE 		    = 30;
const PRODUCT_START_HEIGHT  = PRODUCT_SIZE;
const SPEED 			    = 2;


class Product {
	constructor(context) {
		this.ctx    = context;
		this.x      = Math.random() * CANVAS.width;
		this.y      = Math.random() * CANVAS.height;
		this.width  = PRODUCT_SIZE;
		this.height = PRODUCT_SIZE;
	}

	draw() {
		this.ctx.fillStyle = 'red';
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
		this.ctx.fill();
		this.ctx.closePath();
	}

	move() {
		this.y += SPEED;

		if (this.y > CANVAS.height + PRODUCT_SIZE) {
			this.y = PRODUCT_START_HEIGHT;
			this.x = Math.random() * CANVAS.width;
		}
	}
}

class ShoppingGame {
	constructor() {
		this.canvas    = document.getElementById('game');
		this.ctx       = this.canvas.getContext('2d');
		this.obstacles = [];
		this.timer	   = 0;
		this.products  = Array.from({ length: 5 }, () => new Product(this.ctx)); // Array of Product objects
	}

	// The main game loop. This runs every "frame", and updates the game state.
	update() {
		this.drawBackground();
		this.drawPlayer();
		this.drawProducts();
		this.drawScore();
		this.drawTimer();

		this.timer += 1/FRAMES_PER_SECOND;
	}

	// Draws the background on the canvas element
	drawBackground() {
		this.ctx.fillStyle = 'white';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	drawPlayer() {
		this.ctx.fillStyle = 'blue';
		this.ctx.beginPath();
		this.ctx.arc(this.canvas.width / 2, this.canvas.height - 50, 20, 0, 2 * Math.PI);
		this.ctx.fill();
		this.ctx.closePath();
	}

	drawProducts() {
		for (const product of this.products) {
			console.log(product);
			product.draw();
			product.move();
		}
	}

	drawScore() {
		this.ctx.fillStyle = 'black';
		this.ctx.font = '20px Arial';
		this.ctx.fillText('Score: 0', 10, 40);
	}

	drawTimer() {
		this.ctx.fillStyle = 'black';
		this.ctx.font = '20px Arial';
		this.ctx.fillText(`Time: ${parseInt(this.timer)}`, 10, 20);
	}
}

const game = new ShoppingGame();
setInterval(() => game.update(), 1000/FRAMES_PER_SECOND);