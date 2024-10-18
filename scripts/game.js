/*
 * This file contains the main game logic for the shopping game.
 *
 * The game is a simple game where the player has to collect products that fall from the top of the screen into their shopping cart.
 * The player can move left and right to collect the products.
*/


/**
 * Constants
 * 
 * These are the constants that are used throughout the game.
 */
const CANVAS 			    = document.getElementById('game');
const FRAMES_PER_SECOND     = 60;
const PRODUCT_SIZE 		    = 30;
const PRODUCT_START_HEIGHT  = PRODUCT_SIZE;
const SPEED 			    = 2;

/**
 * Product class
 * 
 * This class represents a product that the player has to collect.
 * It has a draw method that draws the product on the canvas, and a move method that moves the product down the screen.
 * 
 * It should be created with a random product image instead of a red circle. 
 */
class Product {
	constructor(context) {
		this.ctx    = context;
		this.x      = Math.random() * CANVAS.width;
		this.y      = Math.random() * CANVAS.height;
		this.width  = PRODUCT_SIZE;
		this.height = PRODUCT_SIZE;
	}

	/**
	 * Draws the product on the canvas in its current position.
	 */
	draw() {
		this.ctx.fillStyle = 'red';
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
		this.ctx.fill();
		this.ctx.closePath();
	}

	/**
	 * Moves the product down the screen.
	 * 
	 * If the product goes off the bottom of the screen, it is reset to the top of the screen.
	 * The x position is also reset to a random value.
	 */
	move() {
		this.y += SPEED;

		if (this.y > CANVAS.height + PRODUCT_SIZE) {
			this.y = PRODUCT_START_HEIGHT;
			this.x = Math.random() * CANVAS.width;
		}
	}
}

/**
 * Player class
 * 
 * This class represents the player in the game.
 */
class Player {
	constructor(context) {
		this.ctx = context;
		this.x = CANVAS.width / 2;
		this.y = CANVAS.height - 50;
		this.width = 40;
		this.height = 40;
	}

	draw() {
		this.ctx.fillStyle = 'blue';
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
		this.ctx.fill();
		this.ctx.closePath();
	}

	moveLeft() {
		this.x -= 5;
	}

	moveRight() {
		this.x += 5;
	}
}


/**
 * Main class for the game
 * 
 * This class contains the main game loop and the game state.
 * It has a method called update that runs every frame and updates the game state.
 * 
 * The game state consists of the player, the products, and the products that the player has to collect.
 * 
 * The player is represented by a blue circle at the bottom of the screen.
 */
class ShoppingGame {
	constructor() {
		this.canvas    = document.getElementById('game');
		this.ctx       = this.canvas.getContext('2d');
		this.obstacles = [];
		this.timer	   = 0;
		this.player    = new Player(this.ctx);
		this.products  = Array.from({ length: 5 }, () => new Product(this.ctx)); 
	}

	/**
	 * Main game loop
	 * 
	 * This method is called every frame and updates the game state.
	 */
	update() {
		this.drawBackground();
		this.drawPlayer();
		this.drawProducts();
		this.drawScore();
		this.drawTimer();

		this.timer += 1 / FRAMES_PER_SECOND;
	}

	/**
	 * Draws the background of the canvas.
	 */
	drawBackground() {
		this.ctx.fillStyle = 'white';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	/**
	 * Draws the player on the canvas.
	 */
	drawPlayer() {
		this.player.draw();
	}

	/**
	 * Draws the products on the canvas.
	 */
	drawProducts() {
		for (const product of this.products) {
			console.log(product);
			product.draw();
			product.move();
		}
	}

	/**
	 * Draws the score
	 */
	drawScore() {
		this.ctx.fillStyle = 'black';
		this.ctx.font = '20px Arial';
		this.ctx.fillText('Score: 0', 10, 40);
	}

	/**
	 * Draws the timer
	 */
	drawTimer() {
		this.ctx.fillStyle = 'black';
		this.ctx.font = '20px Arial';
		this.ctx.fillText(`Time: ${parseInt(this.timer)}`, 10, 20);
	}
}

// Create a new instance of the game and start the game loop
const game = new ShoppingGame();
setInterval(() => game.update(), 1000/FRAMES_PER_SECOND);