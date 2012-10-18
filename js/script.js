/* Author: Lewis Nixon

*/

// Pastie here of older reference code for the times when you
// were moronic enough not to push to git, you idiot
// http://pastie.org/private/gkmlu2y1x503gwpxirfuaw

// Test to see if the namespace is taken.
// Initialise the namespace literal.
var game2d = game2d || {};

// Initialise Canvas with safer global variables
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
			
			// The bullet
			bullWidth = 6,
			bullHeight = 12,
			bullX,
			bullY,
			bullSpeed = 10;

		game.fps = 50;

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

		var newBullet = function( x, y ) {
			var bullet = new Bullet( x, y );
			bulletArr.push(bullet);
		};

		game.moveBullets = function() {
			var i = 0;
			for ( i; i < bulletArr.length; i++ ) {
				bulletArr[i].advance();
			}
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
			switch ( gunMotion ) {
					case 'LEFT':
						gunDeltaX = -gunSpeedX;
						break;
					case 'RIGHT':
						gunDeltaX = gunSpeedX;
						break;
					case 'UP':
						gunDeltaY = -gunSpeedY;
						break;
					case 'DOWN':
						gunDeltaY = gunSpeedY;
						break;
					case 'UPLEFT':
							gunDeltaY = -gunSpeedY;
							gunDeltaX = -gunSpeedX;
						break;
					case 'UPRIGHT':
							gunDeltaY = -gunSpeedY;
							gunDeltaX = gunSpeedX;
						break;
					case 'DOWNLEFT':
							gunDeltaY = gunSpeedY;
							gunDeltaX = -gunSpeedX;
						break;
					case 'DOWNRIGHT':
							gunDeltaY = gunSpeedY;
							gunDeltaX = gunSpeedX;
						break;
					default:
						gunDeltaX = 0;
						gunDeltaY = 0;
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
			// Start Tracking Keystokes
			$(document).keydown(function(evt) {
				
				switch ( evt.keyCode ) {
						case 37:
							gunMotion = 'LEFT';
							break;
						case 39:
							gunMotion = 'RIGHT';
							break;
						case 38:
							gunMotion = 'UP';
							break;
						case 40:
							gunMotion = 'DOWN';
							break;
						case 37 && 38:
							gunMotion = 'UPLEFT';
							break;
						case 38 && 39:
							gunMotion = 'UPRIGHT';
							break;
						case 40 && 38:
							gunMotion = 'DOWNLEFT';
							break;
						case 40 && 39:
							gunMotion = 'DOWNRIGHT';
							break;
						case 32:
							newBullet(gunX, gunY);
							break;
				}
			});

			$(document).keyup(function(evt) {
				console.log(evt.keyCode);
				if ( evt.keyCode == 37 || evt.keyCode == 38 || evt.keyCode == 39 || evt.keyCode == 40 ) {
					gunMotion = 'NONE';
				}
				
			});
			setInterval( game2d.animate, 1000/game2d.fps );
		};
			
		game.endGame = function() {
			return bulletArr;
		};
		
		game.animate = function() {
				ctx.clearRect( 0, 0, cvs.width, cvs.height );
				game2d.renderGun();
				game2d.moveGun();
				game2d.moveBullets();
		};
})(game2d, game2d.canvas, game2d.context);

// Setting off the functions / gameloop
		game2d.startGame();




