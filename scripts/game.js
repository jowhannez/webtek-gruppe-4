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

const PLAYER_SIZE          = 40;
const PLAYER_COLOR         = 'blue';
const PLAYER_SPEED         = 2;

const TEXT_COLOR           = 'black';
const TEXT_FONT            = '20px Arial';

const GAME_SCENE   = 1;
const FINISH_SCENE = 2;
let scene = GAME_SCENE;

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
        this.width     = PLAYER_SIZE;
        this.height    = PLAYER_SIZE;
		this.reverse   = false;
        this.image     = new Image();
        this.image.src = 'images/handlevogn.png'; 
    }

    draw() {
		if (this.reverse) {
			this.ctx.save();
			this.ctx.translate(this.x, this.y);
			this.ctx.scale(-1, 1);
			this.ctx.drawImage(this.image, -this.width, -this.height, this.width*3, this.height*2);
			this.ctx.restore();
		} else {
			this.ctx.drawImage(this.image, this.x - this.width, this.y - this.height, this.width*3, this.height*2);
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
        this.value = 0;
    }

	//jeg skal legge mer bilder her...  
    addScore(product) {
        if (product.imageName >= 'bilde1' && product.imageName <= 'bilde11') {
            this.value += 5;
        } else if (product.imageName >= 'bilde12' && product.imageName <= 'bilde22') {
            this.value += 10;
        }
    }

    displayScore(ctx) {
        ctx.fillStyle = TEXT_COLOR;
        ctx.font = TEXT_FONT;
        ctx.fillText('Score: ' + this.value, 10, 40);
    }
}

class Finish {
	constructor() {
		this.canvas      = CANVAS;
		this.ctx         = CANVAS.getContext('2d');
		this.harrysFate  = Math.floor((Math.random() * 10) + 1);
		this.harryX      = 450;
		this.harryY      = 340;
		this.initialized = false;
	}

	init() {
		if (!this.initialized) {
			this.bakgrunn();
		}
		this.initialized = true;
	}

	bakgrunn() {
		this.ctx.fillStyle = BACKGROUND_COLOR;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		//Fengsel
		const yTop         = 250;
		const yBottom      = 500;
		const xStart       = 250;
		const moveDistance = 20;
		for (let i = 0; i < 13; i++) {
			this.ctx.moveTo(xStart - moveDistance * i, yTop);
			this.ctx.lineTo(xStart - moveDistance * i, yBottom);
		}
		this.ctx.stroke();
		this.ctx.font="40px italic";
		this.ctx.fillStyle = "black"
		this.ctx.fillText("Kasjotten", 50, 200);
	
		//Solnedgang
		this.ctx.fillText("Solnedgangen",760, 200);
		this.ctx.fillStyle = "lightblue";
		this.ctx.fillRect(750, 250, 250, 100);
		this.ctx.fillStyle = "green";
		this.ctx.fillRect(750, 350, 250, 150);
		this.ctx.stroke();
	
		this.ctx.fillStyle = "grey";
		this.ctx.beginPath();
		this.ctx.moveTo(770, 500);
		this.ctx.lineTo(850, 350)
		this.ctx.lineTo(890, 350);
		this.ctx.lineTo(970, 500);
		this.ctx.closePath();
		this.ctx.fill();
		this.ctx.stroke();
	
		// Sola
		this.ctx.fillStyle = "red";
		this.ctx.beginPath();
		this.ctx.arc(870, 250, 40, 0, 1 * Math.PI);
		this.ctx.closePath();
		this.ctx.fill();
		this.ctx.stroke();
	
		this.ctx.font="25px italic";
		this.ctx.fillStyle = "black";
		this.ctx.fillText("Du nærmer deg grensa og må ta et valg...", 10, 30);
		this.ctx.fillText("1) Du kan velge tollen der du mister 25% av poengene....eller",10, 60 )
		this.ctx.fillText("2) Du kan krysse grensa og beholde alt.. eller havne i kasjotten",10, 80)
	}

	sisteBilde() {
		this.ctx.fillStyle = BACKGROUND_COLOR;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = "green";
		this.ctx.fillRect(0, 150, 1000, 350);
		this.ctx.fillStyle = "lightblue";
		this.ctx.fillRect(0, 0, 1000, 150);
		this.ctx.fillStyle = "grey";
		this.ctx.beginPath(50, 500);
		this.ctx.lineTo(125, 150);
		this.ctx.lineTo(175, 150);
		this.ctx.lineTo(250, 500);
		this.ctx.lineTo(50, 500);
		this.ctx.closePath();
		this.ctx.fill();
		this.ctx.fillStyle ="yellow"
		this.ctx.fillRect(500, 75, 250, 200);
		this.ctx.stroke();
		this.ctx.strokeStyle = "black"
		this.ctx.moveTo(500, 275);
		this.ctx.lineTo(500, 400);
		this.ctx.moveTo(750, 275);
		this.ctx.lineTo(750, 400);
		this.ctx.fillStyle = "black";
		this.ctx.font="40px italic";
		this.ctx.fillText("Norge", 570, 180);
		this.ctx.stroke();
		this.ctx.moveTo(500, 75);
		this.ctx.lineTo(625, 75);
		this.ctx.lineTo(500, 125);
		this.ctx.lineTo(500, 75)
		this.ctx.fill();
		this.ctx.moveTo(750, 75);
		this.ctx.lineTo(625, 75);
		this.ctx.lineTo(750, 125);
		this.ctx.lineTo(750, 75);
		this.ctx.fill();
	}

	flyttHarry(til) {
		const interval = setInterval(() => {
			if (this.harryX == til) {
				clearInterval(interval);
			} else {
				this.bakgrunn();
				this.harryX += this.harryX < til ? 1 : -1;
				this.tegnHarry();
			}
		}, 10);
	}

	tegnHarry() {
		this.ctx.fillRect(this.harryX, this.harryY, 50, 50);
		this.ctx.stroke();
	}

	bestemHarrysSkjebne() {
		if (this.harrysFate < 4) {
			//Bevegelse_kasj();
			this.flyttHarry(100);
		} else {
			//Bevegelse_sol();
			this.flyttHarry(900);
			setTimeout(() => this.sisteBilde(), 5000);
		}
	}
}

// Create a new instance of the game and start the game loop
const game   = new ShoppingGame();
const finish = new Finish();

game.init();
setInterval(() => {
	if (scene == GAME_SCENE) {
		game.update()
	} else if (scene == FINISH_SCENE) {
		finish.init();
	}
}, 1000 / FRAMES_PER_SECOND);

const buttons = document.querySelectorAll('[data-button]');
buttons.forEach(button => {
	button.addEventListener('click', () => {
		const value = button.dataset.button;
		if (value == 3) {
			finish.bestemHarrysSkjebne();
		}
	});
});