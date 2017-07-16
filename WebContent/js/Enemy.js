Function.prototype.inheritsFrom = function( parentClassOrObject ){ 
	if ( parentClassOrObject.constructor == Function ) 
	{ 
		//Normal Inheritance 
		this.prototype = new parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject.prototype;
	} 
	else 
	{ 
		//Pure Virtual Inheritance 
		this.prototype = parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject;
	} 
	return this;
};

Enemy = function (options) {
	console.log("base enemy init");
	this.game = options.game;
	this.spawn_trigger = options.spawn_trigger;
	this.ctx = options.ctx;
	this.player = this.ctx.player;
	
	this.group = this.game.add.group();
	
	this.body = this.game.add.sprite(0, 0, "tetris_t");
	this.body.anchor.set(0.5, 0);
	this.group.add(this.body);
	this.group.setAll("renderable", false);
	
	this.spawn_enabled = true;
};

Enemy.prototype.show = function() {
	console.log("base enemy show");
	this.group.setAll("renderable", true);
	this.spawn_enabled = false;
};

Enemy.prototype.update = function() {
	if (this.spawn_enabled) this.ctx.physics.arcade.overlap(this.player, this.spawn_trigger, this.show, null, this);
};


Tetris_T_Enemy = function(options) {
	return Enemy.call(this, options);
};

Tetris_T_Enemy.prototype = Object.create(Enemy.prototype);
Tetris_T_Enemy.prototype.constructor = Enemy;
Tetris_T_Enemy.prototype.parent = Enemy.prototype;

Tetris_T_Enemy.prototype.show = function() {
	Enemy.prototype.show.call(this);
	
	// block slide in from top
	this.group.position.set(this.player.x, -100);
	this.game.add.tween(this.group).to( {y: 100} , 1200, Phaser.Easing.Cubic.None, true);
	
	
};
