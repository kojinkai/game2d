/* Author: Lewis Nixon

*/

// Initialise Canvas with safer global variables
var game2d_init_canvas = document.getElementById('main-canvas');
if ( game2d_init_canvas.getContext ) {
	var game2d_init_context = game2d_init_canvas.getContext( '2d' );
}

// Namespacing pattern courtesy of Addy Osmani
// http://addyosmani.com/blog/essential-js-namespacing/

// Test to see if the namespace is taken.
// Initialise the namespace literal.
var game2d = game2d || {};

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
			
			// The bullet
			bullWidth = 6,
			bullHeight = 12,
			bullX = gunX - ( bullWidth / 2),
			bullY = gunY - bullHeight,
			// bullDeltaX = 0,
			// bullDeltaY = 0,
			bullSpeed = 10,
			bullFired = false,
			bulletsLive = []; 

		game.fps = 50;
		
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
			// bullY = gunY - bullHeight;
			
		};
		game.renderBullet = function( y ) {
			ctx.fillStyle = "#000";
			ctx.beginPath();
			ctx.arc(gunX, y, 5, 0, Math.PI*2, true);
			ctx.closePath();
			ctx.fill();
		};
		
		game.newBullet = function() {
			if ( bulletsLive.length > 0 ) {
				var i = 0;
				for ( i; i < bulletsLive.length; i++ ) {
					if ( bulletsLive[i].bullY < 0 ) {
						bulletsLive.shift();
						console.log(bulletsLive.length);
					}
					else {
					console.log(bulletsLive[i].bullY);
					game2d.renderBullet( bulletsLive[i].bullY );
					bulletsLive[i].bullY += -bullSpeed;
					}
				}
			}
		};
			
		game.startGame = function() {
			// Start Tracking Keystokes
			$(document).keydown(function(evt) {
				console.log(evt.keyCode);
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
						case 32:
							(function() {
								bulletsLive.push({bullY: gunY});
								console.log(bulletsLive);
							})();
							break;
				}
			});         

			$(document).keyup(function(evt) {
				if ( evt.keyCode == 37 || evt.keyCode == 38 || evt.keyCode == 39 || evt.keyCode == 40 ) {
					gunMotion = 'NONE';
				}
				
			});
			/*var gameLoop =*/ setInterval( game2d.animate, 1000/game2d.fps );
			// game2d.animate();
		};
			
		game.endGame = function() {
			clearInterval(gameLoop);
			ctx.fillText("Game Erver", cvs.width/2, cvs.height/2);
		};
		
		game.animate = function() {
				ctx.clearRect( 0, 0, cvs.width, cvs.height );
				game2d.renderGun();
				game2d.moveGun();
				game2d.newBullet();
				game2d.renderBullet();
		};
})(game2d, game2d_init_canvas, game2d_init_context);

// Setting off the functions / gameloop
		game2d.startGame();




