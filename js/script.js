/* Author: Lewis Nixon

*/

// Initialise Canvas with safer global variables
var game2d_init_canvas = document.getElementById('main-canvas'),
	game2d_init_context = game2d_init_canvas.getContext( '2d' );

// Namespacing pattern courtesy of Addy Osmani
// http://addyosmani.com/blog/essential-js-namespacing/

// Test to see if the namespace is taken.
// Initialise the namespace literal.
var game2d = game2d || {};

// Rendering the cast.
// The game2d object, the canvas and the context
// are passed as arguments for use throughout the function 
(function(game, cvs, ctx) {
 	
		game.renderGun = function() {
			var			
				// The Gun
				gunX = cvs.width/2,
				gunY = cvs.height - 10,
				gunWidth = 40,
				gunHeight = 20,
				gunColour = "#68F090";
				
				ctx.fillStyle = gunColour;
				ctx.beginPath();
				ctx.moveTo(gunX - gunWidth/2, gunY);
				ctx.lineTo(gunX, gunY-gunHeight);
				ctx.lineTo(gunX + gunWidth/2, gunY);
				ctx.lineTo(gunX - gunWidth/2, gunY);
				ctx.fill();
				ctx.closePath();
	
			};
			
		game.animate = function() {
				ctx.clearRect( 0, 0, cvs.width, cvs.height );
				game2d.renderGun();
			};
			
		game.startGame = function() {
			
		}
})(game2d, game2d_init_canvas, game2d_init_context);

// Setting off the functions / gameloop
(function gameLoop() {
	setInterval(game2d.animate,20);
})();




