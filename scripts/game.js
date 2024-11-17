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
const FRAMES_PER_SECOND    = 120;
const BACKGROUND_COLOR     = 'white';

const PRODUCT_AMOUNT       = 5;
const PRODUCT_SIZE         = 60;
const PRODUCT_START_HEIGHT = PRODUCT_SIZE;
const PRODUCT_COLOR        = 'red';
const PRODUCT_SPEED        = 0.5;

const PLAYER_HEIGHT        = 40;
const PLAYER_COLOR         = 'blue';
const PLAYER_SPEED         = 2;

const TEXT_COLOR           = 'black';
const TEXT_FONT            = '20px Arial';

const START_SCENE  = 0;
const GAME_SCENE   = 1;
const FINISH_SCENE = 2;
let scene = START_SCENE;

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
		this.scored = false;

        this.image = new Image();  
        this.imageNumber = Math.floor(Math.random() * 22) + 1; 
        this.image.src = 'images/FoodFraSverige/bilde' + this.imageNumber + '.png';
        this.imageName = 'bilde' + this.imageNumber; 
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
        if (this.y > CANVAS.height + this.height) {
            this.y = PRODUCT_START_HEIGHT;
            this.x = Math.random() * CANVAS.width;
            this.scored = false; 
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
        this.ctx       = context;
        this.x         = CANVAS.width / 2;
        this.y         = CANVAS.height - 50;
        this.width     = PLAYER_HEIGHT * 2;
        this.height    = PLAYER_HEIGHT;
		this.reverse   = false;
        this.image     = new Image();
        this.image.src = 'images/handlevogn.png'; 
    }

    draw() {
		if (this.reverse) {
			this.ctx.save();
			this.ctx.translate(this.x, this.y);
			this.ctx.scale(-1, 1);
			this.ctx.drawImage(this.image, -(this.width/1.3), -this.height, this.width*1.5, this.height*2);
			this.ctx.restore();
		} else {
			this.ctx.drawImage(this.image, this.x - (this.width/1.3), this.y - this.height, this.width*1.5, this.height*2);
		}
    }

    moveLeft() {
        this.x -= PLAYER_SPEED;
        if (this.x < this.width / 2) this.x = this.width / 2; 
    }

    moveRight() {
        this.x += PLAYER_SPEED;
        if (this.x > CANVAS.width - this.width / 2) this.x = CANVAS.width - this.width / 2; 
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
		this.canvas       = CANVAS;
		this.ctx          = CANVAS.getContext('2d');
		this.obstacles    = [];
		this.timer        = 60;
		this.player       = new Player(this.ctx);
		this.products     = Array.from({ length: PRODUCT_AMOUNT }, () => new Product(this.ctx));
		this.scoreManager = new Score();
		this.keyState     = {}
	}

	/**
	 * Initializes the game
	 * 
	 * This method is called once when the game is started.
	 * It sets up the game state and event listeners.
	 */
	init() {
		this.listenForInput();
		this.timer        = 3;
		this.scoreManager = new Score();
	}

	/**
	 * Main game loop
	 * 
	 * This method is called every frame and updates the game state.
	 */
	update() {
		this.drawBackground();

		if (this.keyState['ArrowLeft']) {
			this.player.reverse = true;
			this.player.moveLeft();
		}
		if (this.keyState['ArrowRight']) {
			this.player.reverse = false;
			this.player.moveRight();
		}
        this.player.draw();

        this.products.forEach(product => {
            product.draw();
            product.move();
            if (this.checkCollision(this.player, product) && !product.scored) {
                this.scoreManager.addScore(product); 
				product.scored = true;
				product.x = -100;
            }
        });

        this.scoreManager.displayScore(this.ctx); 
		this.drawTimer();
        this.timer -= 1 / FRAMES_PER_SECOND; 

        if (this.timer <= 0) {
            this.timer = 0; 
			scene = FINISH_SCENE;
			const finishContainer = document.querySelector('[data-finish-content]');
			const scoreContainers = document.querySelector('[data-score]');
			scoreContainers.innerHTML = `${this.scoreManager.value},- kr`;
			setTimeout(() => {
				finishContainer.style.opacity = 1;
				finishContainer.style.pointerEvents = 'all';
			}, 500);
        }
	}

	checkCollision(player, product) {
        return Math.hypot(player.x - product.x, player.y - product.y) < (player.width / 2 + product.width / 2);
    }

	/**
	 * Draws the background of the canvas.
	 */
	drawBackground() {
		const img = new Image();
		img.src = 'images/bakgrunn.webp';
		
		const aspectRatio = img.width / img.height;
		let newWidth = this.canvas.width;
		let newHeight = newWidth / aspectRatio;

		const canvasAspectRatio = newHeight / this.canvas.height;
		newWidth /= canvasAspectRatio;
		newHeight /= canvasAspectRatio;

		console.log('drawing background image');

		this.ctx.drawImage(img, 0, 0, newWidth, newHeight);
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
	 * Draws the timer
	 */
	drawTimer() {
		this.ctx.fillStyle = TEXT_COLOR;
		this.ctx.font      = TEXT_FONT;
		if (this.timer <= 10) {
			this.ctx.fillStyle = 'red';
		}

		this.ctx.fillText(`Time: ${parseInt(this.timer)}`, 16, 32);
	}

	/**
	 * Listens for player input
	 */
	listenForInput() {
		// when a key is pressed, set the key state to true
		window.addEventListener('keydown', (event) => {
			this.keyState[event.key] = true;
		});
		
		// when a key is released, set the key state to false
		window.addEventListener('keyup', (event) => {
			this.keyState[event.key] = false;
		});
	}
}

class Score {
    constructor() {
        this.value = 500;
    }

	//jeg skal legge mer bilder her...  
    addScore(product) {
        if (product.imageNumber <= 11) {
            this.value += 20;
        } else if (product.imageNumber <= 22) {
            this.value += 10;
        } else {
			this.value += 5;
		}
    }

    displayScore(ctx) {
		// draw a background for the score
		ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
		ctx.fillRect(0, 0, 110, 80);

		// draw a border around the score to the right and bottom
		ctx.strokeStyle = 'black';
		ctx.strokeRect(0, 0, 110, 80);
		

        ctx.fillStyle = TEXT_COLOR;
        ctx.font = TEXT_FONT;
        ctx.fillText('Score: ' + this.value, 10, 64);
    }
}

class Start {
	constructor() {
		this.canvas      = CANVAS;
		this.ctx         = CANVAS.getContext('2d');
		this.initialized = false;
	}

	init() {
		const img = new Image();
		img.src = 'images/start.webp';

		const aspectRatio = img.width / img.height;
		let newWidth = this.canvas.width;
		let newHeight = newWidth / aspectRatio;

		const canvasAspectRatio = newHeight / this.canvas.height;
		newWidth /= canvasAspectRatio;
		newHeight /= canvasAspectRatio;

		console.log('drawing start image');
		this.ctx.drawImage(img, -500, 0, newWidth, newHeight);
	}
}

class Finish {
	constructor() {
		this.canvas = CANVAS;
		this.ctx    = CANVAS.getContext('2d');
	}
	init() {
		// draw background with color #6d7f8f
		this.ctx.fillStyle = '#333333';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

// Create a new instance of the game and start the game loop
const start  = new Start();
const game   = new ShoppingGame();
const finish = new Finish();

setInterval(() => {
	if (scene == START_SCENE) {
		start.init();
	} else if (scene == GAME_SCENE) {
		game.update()
	} else if (scene == FINISH_SCENE) {
		finish.init();
	} 
}, 1000 / FRAMES_PER_SECOND);

const finishContainer = document.querySelector('[data-finish-content]');
const payContainer    = document.querySelector('[data-paid-content]');
const sneakContainer  = document.querySelector('[data-caught-content]');
const buttons = document.querySelectorAll('[data-button]');
buttons.forEach(button => {
	button.addEventListener('click', () => {
		const value = button.dataset.button;
		if (value == 'start') {
			CANVAS.getContext('2d').clearRect(0, 0, CANVAS.width, CANVAS.height);
			game.init();
			scene = GAME_SCENE;
			button.style.display = 'none';
		} else if (value == 'pay') {
			finishContainer.style.opacity = 0;
			finishContainer.style.pointerEvents = 'none';
			setTimeout(() => {
				payContainer.style.opacity = 1;
				payContainer.style.pointerEvents = 'all';
				// remove 50% of the score
				const toll = game.scoreManager.value / 2;
				game.scoreManager.value = Math.floor(game.scoreManager.value) - toll;
				const scoreContainers = document.querySelectorAll('[data-score]');
				scoreContainers.forEach(container => {
					container.innerHTML = `${game.scoreManager.value},- kr`;
				});
				const tollContainer = document.querySelector('[data-toll]');
				tollContainer.innerHTML = `${toll},- kr`;
			}, 1000);
		} else if (value == 'sneak') {
			finishContainer.style.opacity = 0;
			finishContainer.style.pointerEvents = 'none';
			setTimeout(() => {
				// choose randomly if the player gets caught or not
				const caught = Math.random() < 0.5;
				if (caught) {
					sneakContainer.style.opacity = 1;
					sneakContainer.style.pointerEvents = 'all';
					const toll = 0;
					const scoreContainers = document.querySelectorAll('[data-score]');
					scoreContainers.forEach(container => {
						container.innerHTML = `${game.scoreManager.value},- kr`;
					});
					const tollContainer = document.querySelector('[data-toll]');
					tollContainer.innerHTML = `${toll},- kr`;
				} else {
					payContainer.style.opacity = 1;
					payContainer.style.pointerEvents = 'all';
				}
			}, 1000);
		} else if (value == 'restart') {
			finishContainer.style.opacity = 0;
			finishContainer.style.pointerEvents = 'none';
			payContainer.style.opacity = 0;
			payContainer.style.pointerEvents = 'none';
			sneakContainer.style.opacity = 0;
			sneakContainer.style.pointerEvents = 'none';
			setTimeout(() => {
				game.init();
				scene = GAME_SCENE;
			}, 1000);
		}
	});
});

function startGame() {
    game.init(); 
    document.getElementById('gameIntroMusic').play(); 
}


