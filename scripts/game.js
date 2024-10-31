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
const CANVAS               = document.getElementById('game');
const FRAMES_PER_SECOND    = 60;
const BACKGROUND_COLOR     = 'white';

const PRODUCT_AMOUNT       = 5;
const PRODUCT_SIZE         = 60;
const PRODUCT_START_HEIGHT = PRODUCT_SIZE;
const PRODUCT_COLOR        = 'red';
const PRODUCT_SPEED        = 1;

const PLAYER_SIZE          = 40;
const PLAYER_COLOR         = 'blue';
const PLAYER_SPEED         = 10;

const TEXT_COLOR           = 'black';
const TEXT_FONT            = '20px Arial';

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
		this.ctx = context;
		this.x = Math.random() * CANVAS.width;
		this.y = Math.random() * CANVAS.height;
		this.width = PRODUCT_SIZE;
		this.height = PRODUCT_SIZE;

        this.image = new Image();  
		let randomNumber = Math.floor(Math.random() * 12) + 1;  
		this.image.src = 'images/FoodFraSverige/bilde' + randomNumber + '.png';
	}

	/**
	 * Draws the product on the canvas in its current position.
	 */
	draw() {
 
        if (this.image.complete) {  
            this.ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        } else {
  
            this.ctx.fillStyle = PRODUCT_COLOR;
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.closePath();
        }
	}

	/**
	 * Moves the product down the screen.
	 * 
	 * If the product goes off the bottom of the screen, it is reset to the top of the screen.
	 * The x position is also reset to a random value.
	 */
	move() {
		this.y += PRODUCT_SPEED;

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
		this.ctx    = context;
		this.x      = CANVAS.width / 2;
		this.y      = CANVAS.height - 50;
		this.width  = PLAYER_SIZE;
		this.height = PLAYER_SIZE;
	}

	draw() {
		this.ctx.fillStyle = PLAYER_COLOR;
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
		this.ctx.fill();
		this.ctx.closePath();
	}

	moveLeft() {
		this.x -= PLAYER_SPEED;
	}

	moveRight() {
		this.x += PLAYER_SPEED;
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
		this.canvas    = CANVAS;
		this.ctx       = CANVAS.getContext('2d');
		this.obstacles = [];
		this.timer     = 0;
		this.player    = new Player(this.ctx);
		this.products  = Array.from({ length: PRODUCT_AMOUNT }, () => new Product(this.ctx));
	}

	/**
	 * Initializes the game
	 * 
	 * This method is called once when the game is started.
	 * It sets up the game state and event listeners.
	 */
	init () {
		this.listenForInput();
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
	}

	/**
	 * Draws the background of the canvas.
	 */
	drawBackground() {
		this.ctx.fillStyle = BACKGROUND_COLOR;
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
			product.draw();
			product.move();
		}
	}

	/**
	 * Draws the score
	 */
	drawScore() {
		this.ctx.fillStyle = TEXT_COLOR;
		this.ctx.font      = TEXT_FONT;
		this.ctx.fillText('Score: 0', 10, 40);
	}

	/**
	 * Draws the timer
	 */
	drawTimer() {
		this.ctx.fillStyle = TEXT_COLOR;
		this.ctx.font      = TEXT_FONT;
		this.ctx.fillText(`Time: ${parseInt(this.timer)}`, 10, 20);
	}

	/**
	 * Listens for player input
	 */
	listenForInput() {
		document.addEventListener('keydown', (event) => {
			switch (event.key) {
				case 'ArrowLeft':
					this.player.moveLeft();
					break;
				case 'ArrowRight':
					this.player.moveRight();
					break;
			}
		});
	}
}

// Create a new instance of the game and start the game loop
const game = new ShoppingGame();
game.init();
setInterval(() => game.update(), 1000 / FRAMES_PER_SECOND);