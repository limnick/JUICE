window.onload = function() {
	// Create your Phaser game and inject it into an auto-created canvas.
	// We did it in a window.onload event, but you can do it anywhere (requireJS
	// load, anonymous function, jQuery dom ready, - whatever floats your boat)
	var game = new Phaser.Game(800, 600, Phaser.CANVAS, document.getElementById("game"));

	game.state.add("level", Level2);
	game.state.start("level");
};
