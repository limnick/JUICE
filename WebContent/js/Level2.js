/**
 * Level2 state.
 */
function Level2() {
	Phaser.State.call(this);
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State.prototype);
Level2.prototype = proto;
Level2.prototype.constructor = Level2;

Level2.prototype.init = function() {
	this.load.pack("level", "assets/pack.json");
	this.scale.pageAlignVertically = true;
	this.scale.pageAlignHorizontally = true;
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	this.world.setBounds(0, 0, 3000, 1000);
	
	this.PLAYER_SPEED = 200;
	this.JUMP_SPEED = 600;
	// needed for smooth scrolling
	this.game.renderer.renderSession.roundPixels = true;
	
	this.ps_manager = this.game.plugins.add(Phaser.ParticleStorm);
	this.ps_manager.addData('blood', {
        lifespan: 5000,
        red: { min: 128, max: 255 },
        green: { min: 0, max: 10 },
        blue: { min: 0, max: 25 },
        vx: { min: -0.7, max: 0.7 },
        vy: { min: -1, max: -1.2 },
        alpha: { initial: 0, value: 1, control: [ { x: 0, y: 1 }, { x: 0.3, y: 0 } ] },
    });
	
	this.first_block_gag_triggered = false;
	this.first_block_gag_finished = true;
	this.player_has_control = true;
	this.health_bars_visible = false;
};

Level2.prototype.preload = function() {
	this.load.pack("level", "assets/pack.json");
	this.scale.pageAlignHorizontally = true;
};

Level2.prototype.create = function() {
	this.physics.arcade.gravity.y = 800;

	var scene = new Scene2(this.game);
	this.game.stage.smoothed = false;

	// weapon

	this.weapon = this.add.weapon(30, "items");
	this.weapon.setBulletFrames(8, 10, true);
	this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
	this.weapon.bulletSpeed = 400;
	this.weapon.bulletGravity.y = -800;
	this.weapon.fireRate = 100;
	this.weapon.trackSprite(scene.fPlayer, 0, 8, true);

	// player

	this.player = scene.fPlayer;
	this.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
	this.player.maxHealth = 100;
	this.player.health = this.player.maxHealth;

	// world

	this.ground = scene.fFloor;
	this.triggers = scene.fTriggers;
//	this.lava = scene.fLava;

	// enemies

//	this.enemies = scene.fEnemies;
//	this.enemies.forEach(function(sprite) {
//		sprite.play("walk");
//	});

	// init physics
	
	var immovables = [ this.ground, this.triggers ];

	for (var i = 0; i < immovables.length; i++) {
		var g = immovables[i];
		g.setAll("body.immovable", true);
		g.setAll("body.allowGravity", false);
	}
	
	this.ground.setAll("renderable", false);

	// cursors

	this.cursors = this.input.keyboard.createCursorKeys();
	this.fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
	
	// particle emitters
	this.bloodParticleGravity = 0.2;
	this.emitter_blood_big = this.ps_manager.createEmitter(Phaser.ParticleStorm.PIXEL);
	this.emitter_blood_big.renderer.pixelSize = 5;
	this.emitter_blood_big.force.y = this.bloodParticleGravity;
	this.emitter_blood_big.addToWorld();
	
	this.emitter_blood_sm = this.ps_manager.createEmitter(Phaser.ParticleStorm.PIXEL);
	this.emitter_blood_sm.renderer.pixelSize = 2;
	this.emitter_blood_sm.force.y = this.bloodParticleGravity;
	this.emitter_blood_sm.addToWorld();
	
	// first block gag
	this.first_block_trigger = scene.fFirst_block_trigger;
};

Level2.prototype.update = function() {

	if (!this.player.alive) {
		return;
	}

	// update player velocity

	this.physics.arcade.collide(this.player, this.ground);
	this.physics.arcade.collide(this.player, this.first_block_trigger, this.first_block_hit, null, this);

	var vel = 0;
	
	if (this.player_has_control) {
		if (this.cursors.left.isDown) {
			vel = -this.PLAYER_SPEED;
			this.player.scale.x = -1;
		} else if (this.cursors.right.isDown) {
			vel = this.PLAYER_SPEED;
			this.player.scale.x = 1;
		}
	}

	this.player.body.velocity.x = vel;

	// update player animation

	var standing = this.player.body.touching.down;

	if (!this.first_block_gag_finished) {
		// first block gag takes over full control
		if (standing && this.first_block_gag_triggered) {
			this.emitter_blood_sm.emit('blood', this.player.body.x + (this.player.body.width / 2), this.player.body.y, { total: 3, repeat: 2, frequency: 1 });
			this.first_block_gag_triggered = false;
			this.time.events.add(800, function() {
				this.player_has_control = true;
				this.first_block_gag_finished = true;
			}, this);
		}
	} else {
		// player control here
		if (standing) {
			if (this.player_has_control && this.cursors.up.isDown) {
				this.player.body.velocity.y = -this.JUMP_SPEED;
			}
	
			if (vel == 0) {
				this.player.play("stay");
			} else {
				this.player.play("walk");
			}
	
		} else {
			this.player.play("jump");
		}
	}

	// update weapon

	var scaleX = this.player.scale.x;
	this.weapon.bulletSpeed = scaleX * 400;
	this.weapon.bulletAngleOffset = scaleX < 0 ? 180 : 0;
//	this.weapon.fireAngle = Phaser.Math.radToDeg(Phaser.Math.angleBetween(this.game.input.mousePointer.x, this.game.input.mousePointer.y, this.player.x, this.player.y));
//	this.weapon.fireAngle = 90;
//	console.log(Phaser.Math.radToDeg(Phaser.Math.angleBetween(this.game.input.mousePointer.x, this.game.input.mousePointer.y, this.player.x, this.player.y)));

	if (this.player_has_control && (this.fireButton.isDown || this.game.input.activePointer.leftButton.isDown)) {
		this.weapon.fireAtPointer();
	}

	// update enemies

//	this.enemies.forEach(this.moveEnemy);

//	this.physics.arcade.collide(this.player, this.lava, this.die, null, this);
	if (this.health_bars_visible) {
		this.life.updateCrop();
	}
};

/**
 * 
 * @param {Phaser.Sprite} sprite The enemy to move.
 */
Level2.prototype.moveEnemy = function(sprite) {

	// use the data set in the scene to move the enemies

	var data = sprite.data;

	if (sprite.x < data.left) {
		sprite.body.velocity.x = 50;
	} else if (sprite.x > data.right) {
		sprite.body.velocity.x = -50;
	}

	if (sprite.body.velocity.x < 0) {
		sprite.scale.x = -1;
	} else if (sprite.body.velocity.x > 0) {
		sprite.scale.x = 1;
	}

};


Level2.prototype.showHealthBars = function() {
	if (this.health_bars_visible) { return; }

	this.health_bars_visible = true;
	
	var bmd = this.game.add.bitmapData(300, 40);
	bmd.ctx.beginPath();
	bmd.ctx.rect(0, 0, 300, 80);
	bmd.ctx.fillStyle = '#00685e';
	bmd.ctx.fill();
	
	//var bglife = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, bmd);
	var bglife = this.game.add.sprite(400, 560, bmd);
	bglife.fixedToCamera = true;
    bglife.anchor.set(0.5);
    
    bmd = this.game.add.bitmapData(290, 30);
    bmd.ctx.beginPath();
	bmd.ctx.rect(0, 0, 300, 80);
	bmd.ctx.fillStyle = '#00f910';
	bmd.ctx.fill();
	
	this.widthLife = new Phaser.Rectangle(0, 0, bmd.width, bmd.height);
	this.totalLife = this.player.maxHealth;
	this.life = this.game.add.sprite(400 - bglife.width/2 + 5, 560, bmd);
	this.life.fixedToCamera = true;
	this.life.anchor.y = 0.5;
	this.life.cropEnabled = true;
	this.life.crop(this.widthLife);
	this.game.time.events.loop(500, this.cropHealthBar, this);  
};

Level2.prototype.cropHealthBar = function() {
	if (this.widthLife.width <= 0) {
//		this.widthLife.width = this.totalLife;
	} else {
		//this.game.add.tween(this.widthLife).to( { width: (this.widthLife.width - (this.totalLife / 10)) }, 200, Phaser.Easing.Linear.None, true);
	}
	var targetWidth = 280 * (this.player.health / this.player.maxHealth);
	this.game.add.tween(this.widthLife).to( { width: targetWidth }, 200, Phaser.Easing.Linear.None, true);
};

Level2.prototype.die = function() {
	// game over
	this.player.play("die");
	this.player.kill();
	this.player.visible = true;
	this.camera.fade();
	this.time.events.add(500, function() {
		this.game.state.start("level");
	}, this);
};

Level2.prototype.first_block_hit = function(player, block) {
	if (block.body.touching.left || block.body.touching.right || block.body.touching.up) { return; }
	
	if (!this.first_block_gag_triggered) {
		
		this.emitter_blood_big.emit('blood', this.player.body.x + (this.player.body.width / 2), this.player.body.y, { total: 3, repeat: 3, frequency: 1 });
		this.emitter_blood_sm.emit('blood', this.player.body.x + (this.player.body.width / 2), this.player.body.y, { total: 7, repeat: 5, frequency: 1 });
		this.player.play("die");
		this.first_block_gag_triggered = true;
		this.first_block_gag_finished = false;
		this.player_has_control = false;

		this.showHealthBars();
		this.time.events.add(100, function() {
			this.player.damage(5);
		}, this);
	}
};
