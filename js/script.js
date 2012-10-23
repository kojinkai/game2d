/* Author: Lewis Nixon

*/

// Pastie here of older reference code for the times when you
// were moronic enough not to push to git, you idiot
// http://pastie.org/private/gkmlu2y1x503gwpxirfuaw

// Test to see if the namespace is taken.
// Initialise the namespace literal.
var game2d = game2d || {};
var keymapper;

// Initialise Canvas
game2d.canvas = document.getElementById('main-canvas');
if ( game2d.canvas.getContext ) {
	game2d.context = game2d.canvas.getContext( '2d' );
}

// Rendering the cast.
// The game2d object, the canvas and the context
// are passed as arguments for use throughout the function
(function(game, cvs, ctx) {

		// Begin Variable declaration
		// Functions declared below should
		// inherit these variables
		var
			gameLoop,
			// The Gun
			gunX = cvs.width/2,
			gunY = cvs.height - 10,
			gunWidth = 40,
			gunHeight = 20,
			gunColour = "#68F090",
			gunDeltaX = 0,
			gunDeltaY = 0,
			gunSpeedX = 10,
			gunSpeedY = 6,
			gunMotion,
			bulletArr = [],
			astArr		= [],
			astCount  = 0,
			//Asteroid Frequency
			difficulty	= 50,

			// The bullet
			bullWidth = 6,
			bullX,
			bullSpeed = 10;

		game.fps = 50;

		// Random x co-ords
		// Returns a random integer between min and max
		function getRandomInt( min, max ) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		// Bullets
		function Bullet( x, y ) {
			this.xpos = x;
			this.ypos = y;
		}

		Bullet.prototype.advance = function() {
			this.ypos -= bullSpeed;
			ctx.fillStyle = "#000";
			ctx.beginPath();
			ctx.arc(this.xpos, this.ypos, 5, 0, Math.PI*2, true);
			ctx.closePath();
			ctx.fill();
		};

		Bullet.prototype.explode = function() {
			this.advance = function() {
				var t = this;
				if ( t.counter <= 3 ) {
					var y = t.ypos;
					t.size+=1;
					ctx.fillStyle = "#000";
					ctx.beginPath();
					ctx.arc(t.xpos, y, t.size, 0, Math.PI*2, true);
					ctx.closePath();
					ctx.fill();
					t.counter++; 
				}
				else {
					var num = bulletArr.indexOf(t);
					bulletArr.splice(num, num);					
				}
			};
		};

		//Asteroids
		function Asteroid( x, y, speed, size ) {
			this.xpos = x;
			this.ypos = y;
			this.speed = speed;
			this.size = size;
			this.counter = 0;
		}

		Asteroid.prototype.advance = function() {
			this.ypos += this.speed;
			ctx.fillStyle = "#FF0000";
			ctx.beginPath();
			ctx.arc(this.xpos, this.ypos, this.size, 0, Math.PI*2, true);
			ctx.closePath();
			ctx.fill();
		};

		Asteroid.prototype.explode = function() {
			this.advance = function() {
				var t = this;
				if ( t.counter <= 5 ) {
					var y = t.ypos;
					t.size+=3;
					ctx.fillStyle = "#FF0000";
					ctx.beginPath();
					ctx.arc(t.xpos, y, t.size, 0, Math.PI*2, true);
					ctx.closePath();
					ctx.fill();
					t.counter++;
				}
				else {
					var num = astArr.indexOf(t);
					astArr.splice(num, num);
				}
			};
		};

		var newObj = function( x, y, obj, arr, speed, size ) {
			var activeItem = new obj( x, y, speed, size );
			arr.push(activeItem);
		};

		function collider( x, y, a, b, s ) {
			if ( x >= a-s && x <= a+s && y >= b-s && y <= b+s ) {
				return true;
			}
			else {
				return false;
			}
		}


		game.moveBullets = function() {
			var x, y, a, b, i, j;

			for ( i = 0; i < bulletArr.length; i++ ) {
				x = bulletArr[i].xpos;
				y = bulletArr[i].ypos;
				for ( j = 0; j < astArr.length; j++ ) {
					a = astArr[j].xpos;
					b = astArr[j].ypos;
					s = astArr[j].size;
					if ( collider( x, y, a, b, s ) ) {
						bulletArr[i].explode();
						astArr[j].explode();
					}					
				}
				if ( y <= 0 ) {

					// if the asteroid goes off screen
					bulletArr.splice(i,i);
				}
				else if (bulletArr[i]) {
					bulletArr[i].advance();
				}
			}
		};

		game.moveAsteroids = function() {
			var i = 0;
			for ( i; i < astArr.length; i++ ) {
				if ( astArr[i].ypos >= cvs.height ) {
					astArr.splice(i,i);
				}
				else {
					astArr[i].advance();
				}
			}
		};

		game.updateAstField = function() {
			if ( astCount < difficulty ) {
				astCount++;
				return false;
			}
			else {
				astCount = 0;
				// xpos, ypos, object prototype, object's array, asteroid's speed, asteroid's size
				newObj( getRandomInt( 10, cvs.width-10 ), -20, Asteroid, astArr, getRandomInt( 5, 10 ), getRandomInt( 7, 30 ));
			}
		};

		game.debug = {
				b: bulletArr,
				a: astArr
			};

		game.renderGun = function() {
			ctx.fillStyle = gunColour;
			ctx.beginPath();
			ctx.moveTo(gunX - gunWidth/2, gunY);
			ctx.lineTo(gunX, gunY-gunHeight);
			ctx.lineTo(gunX + gunWidth/2, gunY);
			ctx.lineTo(gunX - gunWidth/2, gunY);
			ctx.fill();
			ctx.closePath();
		};

		game.moveGun = function() {
			gunDeltaX = 0;
			gunDeltaY = 0;

			if (keymapper.isActive(keymapper.LEFT)) {
				gunDeltaX = -gunSpeedX;
			}
			if (keymapper.isActive(keymapper.RIGHT)) {
				gunDeltaX = gunSpeedX;
			}
			if (keymapper.isActive(keymapper.UP)) {
				gunDeltaY = -gunSpeedY;
			}
			if (keymapper.isActive(keymapper.DOWN)) {
				gunDeltaY = gunSpeedY;
			}
			if (keymapper.isActive(keymapper.SHOOT)) {
				newObj(gunX, gunY, Bullet, bulletArr);
			}

			// If gun reaches the side of the screen, then don't let it move any further
			if ( ( gunX - gunWidth/2 ) + gunDeltaX < 0 || ( gunX - gunWidth/2 ) + gunDeltaX + gunWidth > cvs.width ) {
				gunDeltaX = 0;
			}

			if ( ( gunY + gunDeltaY ) - gunHeight < 0 || gunY + gunDeltaY > cvs.height ) {
				gunDeltaY = 0;
			}

			gunX += gunDeltaX;
			gunY += gunDeltaY;
			bullX = gunX - ( bullWidth / 2);
		};

		game.startGame = function() {
			keymapper = createKeyMapper();

			// For convenience sake.
			// TODO: change to "constants".
			keymapper.LEFT = 'LEFT';
			keymapper.RIGHT = 'RIGHT';
			keymapper.DOWN = 'DOWN';
			keymapper.UP = 'UP';
			keymapper.SHOOT = 'Do I feel lucky? Well, do ya, punk?';

			// Map keycodes to actions.
			keymapper.mapAction([65, 37], keymapper.LEFT);
			keymapper.mapAction([68, 39], keymapper.RIGHT);
			keymapper.mapAction([87, 38], keymapper.UP);
			keymapper.mapAction([83, 40], keymapper.DOWN);
			keymapper.mapAction(32, keymapper.SHOOT);

			// Track keydown events.
			$(document).keydown(function(evt) {
				keymapper.keyDownListener(evt.keyCode);
			});

			$(document).keyup(function(evt) {
				keymapper.keyUpListener(evt.keyCode);
			});

			$('#stop-game').on('click', function(e) {
				e.preventDefault();
				game.endGame();
			});

			gameLoop = setInterval( game2d.animate, 1000/game2d.fps );
		};

		game.endGame = function() {
			clearInterval(gameLoop);
		};

		game.animate = function() {
				ctx.clearRect( 0, 0, cvs.width, cvs.height );
				game2d.renderGun();
				game2d.moveGun();
				game2d.moveBullets();
				game2d.moveAsteroids();
				game2d.updateAstField();
		};
})(game2d, game2d.canvas, game2d.context);

// Setting off the functions / gameloop
game2d.startGame();




