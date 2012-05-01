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
			gunMotion; 
		
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
						gunDeltaY = -gunSpeedX;
						break;
					case 'DOWN':
						gunDeltaY = gunSpeedY;
						break;
					default:
						gunDeltaX = 0;
						gunDeltaY = 0;
			}
			
			gunX = gunX + gunDeltaX;
			gunY = gunY + gunDeltaY;
			
		};
			
		game.animate = function() {
				ctx.clearRect( 0, 0, cvs.width, cvs.height );
				game2d.renderGun();
				game2d.moveGun();
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
				}
			});         

			$(document).keyup(function(evt) {
				if ( evt.keyCode == 37 || evt.keyCode == 38 || evt.keyCode == 39 || evt.keyCode == 40 ) {
					gunMotion = 'NONE';
				}
				
			});
			var gameLoop = setInterval(game2d.animate,20);
		};
			
		game.endGame = function() {
			clearInterval(gameLoop);
			ctx.fillText("Game Erver", cvs.width/2, cvs.height/2);
		};
			
})(game2d, game2d_init_canvas, game2d_init_context);

// Setting off the functions / gameloop
		game2d.startGame();




