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
	this.world.setBounds(0, -200, 1000, 800);
	
	this.bgm_metadata = [
        {x: -100, width: 10, name: "mario_clean"},
	    {x: 1400, width: 300, name: "mario_1"},
	    {x: 2600, width: 300, name: "mario_2"},
	    {x: 3900, width: 600, name: "snatcher", restart: true},
	    {x: 9250, width: 2500, name: "meo_rescueme", restart: true},
	    
    ];
	this.bgm_transition_width = 300;
	this.bgm_volume = 0.1;
	
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
	
	this.ps_manager.addData('spritedie', {
        lifespan: { min: 200, max: 1000 },
        green: 255,
        vx: { min: -1, max: 1 },
        vy: { min: -1, max: 4 }
    });
	
	this.ps_manager.addData('spritedie_tesla', {
        lifespan: { min: 1000, max: 3000 },
        red: { min: 128, max: 255 },
        green: { min: 0, max: 10 },
        blue: { min: 0, max: 25 },
        vx: { min: -1, max: 1 },
        vy: { min: -1, max: 4 }
    });
	
	this.ps_manager.addData('splash', {
        lifespan: { min: 100, max: 300 },
        green: { min: 200, max: 255 },
        red: { min: 150, max: 200 },
        blue: { min: 150, max: 200 },
        vx: { min: -1.5, max: 1.5 },
        vy: { min: .1, max: .8 }
    });
	
	this.ps_manager.addData('shimmer', {
        lifespan: { min: 200, max: 300 },
        red: { min: 230, max: 255 },
        green: { min: 210, max: 230 },
        blue: { min: 0, max: 20 },
        vx: { min: -3, max: 3 },
        vy: { min: -1, max: -3 },
        alpha: { initial: 0, value: 2, control: [ { x: 0, y: 1 }, { x: 3, y: 0 } ] },
    });
	
	this.spawnList = [
        {x: 1200, spawned: false, klass: BomberEnemy, args: {}, enemy: null},
        {x: 2000, spawned: false, klass: BomberEnemy, args: {}, enemy: null},
        {x: 1200, spawned: false, klass: WalkerEnemy2, args: {spawn_position: {x: 2255, y: 434}} , enemy: null},
//        {x: 18800, spawned: false, klass: Gradius_Miniboss_Enemy, args: {}, enemy: null},
    ];
	
	
	this.funcTriggers = [
        {x: 700, func: this.showHealthBars},
        {x: 18800, func: this.miniboss_trigger},
	];
	
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
	
	// player

	this.player = scene.fPlayer;
	this.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
	this.player.maxHealth = 100;
	this.player.health = this.player.maxHealth;

	// weapon
	
	this.weapons = {
		machinegun: new Weapon_Machinegun({ctx: this}),
		laser: new Weapon_Laser({ctx: this}),
		rocket: new Weapon_Rocket({ctx: this}),
		tesla: new Weapon_Tesla({ctx: this}),
	};
	this.player.weapons_available = [];

	// weapon pickup
	
	this.machinegun_pickup_trigger = scene.fGun_machinegun;
	this.lasergun_pickup_trigger = scene.fGun_laser;
	this.rocket_pickup_trigger = scene.fGun_rocket;
	this.tesla_pickup_trigger = scene.fGun_tesla;
	
	this.weapon_triggers = [this.machinegun_pickup_trigger, this.lasergun_pickup_trigger, this.rocket_pickup_trigger, 
	                        this.tesla_pickup_trigger,];
	
	// world

	this.enemy_layer = scene.fEnemies;
	this.bullet_layer = scene.fBullets;
	this.ui = scene.fUI;
	this.ground = scene.fFloor;
	this.walls = scene.fWalls;
	this.blocking_objects = scene.fBlocking_objects;
	this.triggers = scene.fTriggers;
	this.triggers_invis = scene.fTriggers_invis;
	this.floor_fall_trigger = scene.fFloor_fall_trigger;
	this.water_floor = scene.fWater_floor;
	this.bg_anims = [scene.fWater_temple, scene.fWater_temple_outside, scene.fFactory, ];
	
	this.ui.fixedToCamera = true;
	
	this.bg_anims.forEach(function(bg_anim){
		bg_anim.animations.play("idle");
	}, this);

	// enemies
	
	this.t_enemy_2 = new Tetris_T_Enemy({ctx: this,});
	
	this.b_enemy_1 = new BomberEnemy({ctx: this,});
	this.b_enemy_2 = new BomberEnemy({ctx: this,});
	
	this.miniboss_1 = new Gradius_Miniboss_Enemy({ctx: this});
	
	this.enemies = [this.t_enemy_2, this.b_enemy_1, this.b_enemy_2, this.miniboss_1, ];
	
	scene.fTriggers_walker_enemy.forEach(function(enemy_trigger){
		this.spawnList.push({x: enemy_trigger.world.x - 1000, spawned: false, klass: WalkerEnemy, args: {spawn_position: {x: enemy_trigger.world.x, y: enemy_trigger.world.y}} , enemy: null});
		enemy_trigger.renderable = false;
	}, this);
	
	scene.fTriggers_shooter_enemy.forEach(function(enemy_trigger){
		this.spawnList.push({x: enemy_trigger.world.x, spawned: false, klass: Tetris_T_Enemy, args: {spawn_position: {x: enemy_trigger.world.x, y: enemy_trigger.world.y}} , enemy: null});
		enemy_trigger.renderable = false;
	}, this);

	// init physics
	
	var immovables = [ this.ground, this.walls, this.triggers, this.triggers_invis];

	for (var i = 0; i < immovables.length; i++) {
		var g = immovables[i];
		g.setAll("body.immovable", true);
		g.setAll("body.allowGravity", false);
		
	}
	
	this.blocking_objects.children.forEach(function(blocking_obj){
		this.game.physics.enable(blocking_obj);
		blocking_obj.setAll("body.immovable", true);
		blocking_obj.setAll("body.allowGravity", false);
	}, this);
	
	this.ground.setAll("renderable", false);
	this.triggers_invis.setAll("renderable", false);

	// cursors

	this.cursors = this.input.keyboard.createCursorKeys();
	this.wasd = {
		up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
		down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
		left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
		right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
	};
	
	this.buttons = {
		fire: this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR),
		cheat: this.input.keyboard.addKey(Phaser.KeyCode.Z),
		next_weapon: this.input.keyboard.addKey(Phaser.KeyCode.Q),
	};
	
	this.emitter_group = scene.fEmitterGroup;
	this.emitter_group.fixedToCamera = true;
	
	this.emitter_group_world = scene.fEmitterGroupWorld;
	
	// particle emitters
	this.bloodParticleGravity = 0.2;
	var bloodParticleGravityP = new Phaser.Point(0, 0);
	this.emitter_blood_big = this.ps_manager.createEmitter(Phaser.ParticleStorm.PIXEL, bloodParticleGravityP);
	this.emitter_blood_big.renderer.pixelSize = 5;
	this.emitter_blood_big.force.y = this.bloodParticleGravity;
	this.emitter_blood_big.addToWorld(this.emitter_group);
	
	this.emitter_blood_sm = this.ps_manager.createEmitter(Phaser.ParticleStorm.PIXEL, bloodParticleGravityP);
	this.emitter_blood_sm.renderer.pixelSize = 2;
	this.emitter_blood_sm.force.y = this.bloodParticleGravity;
	this.emitter_blood_sm.addToWorld(this.emitter_group);
	
	this.emitter_splash = this.ps_manager.createEmitter(Phaser.ParticleStorm.PIXEL);
	this.emitter_splash.renderer.pixelSize = 2;
	this.emitter_splash.force.y = 0.0;
	this.emitter_splash.addToWorld(this.emitter_group);
	
	this.emitter_shimmer = this.ps_manager.createEmitter(Phaser.ParticleStorm.PIXEL);
	this.emitter_shimmer.renderer.pixelSize = 2;
	this.emitter_shimmer.force.y = 0.0;
	this.emitter_shimmer.addToWorld(this.emitter_group);
		
	// first block gag
	this.first_block_trigger = scene.fFirst_block_trigger;
	
	// audio
	this.sfx = {};

	for (var i = 0; i < this.bgm_metadata.length; i++) {
		var mdata = this.bgm_metadata[i];
		var mdata_prev = this.bgm_metadata[i-1];
		if (this.player.x < mdata.x) {
			this.sfx.bgm = this.game.sound.add(mdata_prev.name, this.bgm_volume, true);
			this.sfx.bgm.play("", 0, this.bgm_volume, false);
			break;
		}
		
		if (i == this.bgm_metadata.length - 1) {
			// if we get here without breaking out, we are at the last trigger
			this.sfx.bgm = this.game.sound.add(mdata.name, this.bgm_volume, true);
			this.sfx.bgm.play("", 0, this.bgm_volume, false);
		}
	}
};

Level2.prototype.triggerSplash = function() {
	if (Math.abs(this.player.body.velocity.x) > 0) {
		this.emitter_splash.emit('splash', (this.player.body.x + (this.player.body.width / 2)) - this.camera.position.x, this.player.body.y + this.player.height - 2, { total: 1, repeat: 3, frequency: 1 });
	}
};

Level2.prototype.update = function() {

	if (!this.player.alive) {
		return;
	}
	
	// world bounds track player location
	this.world.setBounds(Math.max(0, this.player.x - 400), -200, 1000, 800);

	// update player velocity
	this.physics.arcade.overlap(this.player, this.water_floor, this.triggerSplash, null, this);
	this.physics.arcade.collide(this.player, this.ground);
	this.physics.arcade.collide(this.player, this.walls);
	this.physics.arcade.collide(this.player, this.blocking_objects.children);
	this.physics.arcade.collide(this.player, this.first_block_trigger, this.first_block_hit, null, this);
	
	this.physics.arcade.overlap(this.player, this.floor_fall_trigger, this.floor_fall, null, this);

	//call emit for each weapon trigger with its x/y location
	var shimmer_settings = { total: 4, repeat: 0, frequency: 0 };
	
	if(this.machinegun_pickup_trigger.alive) {
		this.physics.arcade.overlap(this.player, this.machinegun_pickup_trigger, this.machinegun_trigger_hit, null, this);
		this.emitter_shimmer.emit('shimmer', this.machinegun_pickup_trigger.x - this.camera.position.x, this.machinegun_pickup_trigger.y  - this.camera.position.y, shimmer_settings);
	}
	if(this.lasergun_pickup_trigger.alive) {
		this.physics.arcade.overlap(this.player, this.lasergun_pickup_trigger, this.lasergun_trigger_hit, null, this);
		this.emitter_shimmer.emit('shimmer', this.lasergun_pickup_trigger.x - this.camera.position.x, this.lasergun_pickup_trigger.y  - this.camera.position.y, shimmer_settings);
	}
	if(this.rocket_pickup_trigger.alive) {
		this.physics.arcade.overlap(this.player, this.rocket_pickup_trigger, this.rocket_trigger_hit, null, this);
		this.emitter_shimmer.emit('shimmer', this.rocket_pickup_trigger.x - this.camera.position.x, this.rocket_pickup_trigger.y  - this.camera.position.y, shimmer_settings);
	}
	if(this.tesla_pickup_trigger.alive) {
		this.physics.arcade.overlap(this.player, this.tesla_pickup_trigger, this.tesla_trigger_hit, null, this);
		this.emitter_shimmer.emit('shimmer', this.tesla_pickup_trigger.x - this.camera.position.x, this.tesla_pickup_trigger.y  - this.camera.position.y, shimmer_settings);
	}

	var vel = 0;
	
	if (this.player_has_control) {
		if (this.cursors.left.isDown || this.wasd.left.isDown) {
			vel = -this.PLAYER_SPEED;
			this.player.scale.x = -1;
		} else if (this.cursors.right.isDown || this.wasd.right.isDown) {
			vel = this.PLAYER_SPEED;
			this.player.scale.x = 1;
		}
	}

	this.player.body.velocity.x = vel;

	// update player animation

	var standing = this.player.body.touching.down;

	if (this.buttons.cheat.isDown) {
		this.weapons.machinegun.pickup();
		this.weapons.laser.pickup();
		this.weapons.rocket.pickup();
		this.weapons.tesla.pickup();
//		this.emitter_blood_sm.emit('blood', (this.player.body.x + (this.player.body.width / 2)) - this.camera.position.x, this.player.body.y, { total: 7, repeat: 5, frequency: 1 });
	}
	
	if (this.buttons.next_weapon.isDown && !this.next_weapon_lock) {
		this.nextWeapon();
	} else if (this.buttons.next_weapon.isUp && this.next_weapon_lock) {
		this.next_weapon_lock = false;
	}
	
	if (!this.first_block_gag_finished) {
		// first block gag takes over full control
		if (standing && this.first_block_gag_triggered) {
			this.emitter_blood_sm.emit('blood', (this.player.body.x + (this.player.body.width / 2)) - this.camera.position.x, this.player.body.y, { total: 3, repeat: 2, frequency: 1 });
			this.first_block_gag_triggered = false;
			this.time.events.add(800, function() {
				this.player_has_control = true;
				this.first_block_gag_finished = true;
			}, this);
		}
	} else {
		// player control here
		if (standing) {
			if (this.player_has_control && (this.cursors.up.isDown || this.wasd.up.isDown)) {
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
	
	// update background audio
	for (var i = 0; i < this.bgm_metadata.length; i++) {
		var mdata = this.bgm_metadata[i];
		var tbox = {
				left: mdata.x,
				center: mdata.x + (mdata.width/2),
				right: mdata.x + mdata.width,
		};
		if (this.player.x >= mdata.x && this.player.x < tbox.right) {
			//player inside of transition box
			if (!this.bgm_transition_index) {
				// figure out which side we're on so we know what's playing
				if (this.player.x < tbox.center) {
					// player entered on left, get mdata for right
					this.bgm_mdata_new = mdata;
					this.bgm_transition_direction = 'right';
				} else {
					// player entered on right, get mdata for left
					this.bgm_mdata_new = this.bgm_metadata[i-1];
					this.bgm_transition_direction = 'left';
				}
				
				var position = 0;
				if (!this.bgm_mdata_new.restart) {
					position = this.sfx.bgm.position + this.sfx.bgm.currentTime / 1000;
				}
				
				console.log("starting new audio",  position);
				
				
				this.sfx.bgm_fading = this.game.sound.add(this.bgm_mdata_new.name, 0, true);
				
				this.sfx.bgm_fading.restart("", position, 0, false);
				this.bgm_transition_index = i;
			}
			
			var fadePct = 0.0;
			//transitioning audio
			if (this.bgm_transition_direction == 'right') {
				fadePct = (this.player.x - tbox.left) / mdata.width;
			} else if (this.bgm_transition_direction == 'left') {
				fadePct = (tbox.right - this.player.x) / mdata.width;
			}
			this.sfx.bgm_fading.volume = fadePct * this.bgm_volume;
			this.sfx.bgm.volume = (1 - fadePct) * this.bgm_volume;
//			console.log("fading up audio: ", this.bgm_mdata_new.name, " [", fadePct, "] index: ", this.bgm_transition_index, this.bgm_transition_direction);
		} else {
			if (this.bgm_transition_index == i) {
				console.log('audio transition ended', i);
				//player outside of current box, end current transition
				if ((this.bgm_transition_direction == 'right' && this.player.x < tbox.left) ||
						(this.bgm_transition_direction == 'left' && this.player.x > tbox.right)) {
					this.sfx.bgm_fading.stop();
					this.sfx.bgm_fading.destroy();
				} else {
					this.sfx.bgm.stop();
					this.sfx.bgm.destroy();
					
					this.sfx.bgm = this.sfx.bgm_fading;
					this.sfx.bgm.volume = this.bgm_volume;
				}
				this.bgm_transition_direction = null;
				this.bgm_mdata_new = null;
				this.bgm_transition_index = null;
			}
		}
	}
	
	if (!this.sfx.bgm.isPlaying) { this.sfx.bgm.play('', 0, this.bgm_volume); }
	
//	this.sfx.bgm = this.game.sound.add('mario_clean', 1, true);
//	this.sfx.bgm.play("", 0, 1, true);

	// update weapon
	
	var blockers = [this.walls, this.ground].concat(this.blocking_objects.children);
	if (this.player.weapon) this.player.weapon.update(blockers);

	// update enemies

	for (var i = 0; i < this.enemies.length; i++) {
		var e = this.enemies[i];
		e.update();
	}
		
	for (var i = 0; i < this.spawnList.length; i++) {
		spawnMetadata = this.spawnList[i];
		if (spawnMetadata.spawned) {
			spawnMetadata.enemy.update();
		} else if (this.player.x >= spawnMetadata.x && this.player.x < spawnMetadata.x + 1000 && !spawnMetadata.spawned) {
			console.log("spawning enemy");
			spawnMetadata.args.ctx = this;
			spawnMetadata.enemy = new spawnMetadata.klass(spawnMetadata.args);
			spawnMetadata.spawned = true;
			spawnMetadata.enemy.show();
		}
		this.spawnList[i] = spawnMetadata;
	}
	
	for (var i = 0; i < this.funcTriggers.length; i++) {
		funcTrigger = this.funcTriggers[i];
		if (funcTrigger.triggered) { continue; }
		
		if (this.player.x >= funcTrigger.x) {
			funcTrigger.triggered = true;
			funcTrigger.func.call(this);
		}
		this.funcTriggers[i] = funcTrigger;
	}

	if (this.health_bars_visible) {
		this.life.updateCrop();
	}
	
};

Level2.prototype.render = function() {
//	if (this.enemydie_emitter) this.enemydie_emitter.debug(432, 522);
//	this.emitter_splash.debug(432, 522);
//	if (this.player.weapon && this.player.weapon.splash_ball) {
//		this.game.debug.body(this.player.weapon.splash_ball);
//		this.game.debug.bodyInfo(this.player.weapon.splash_ball, 32, 32);
//	}
//	
	if (this.game.debugbody) {
		this.game.debug.body(this.game.debugbody);
	}
};

Level2.prototype.nextWeapon = function() {
	if (!this.player.weapon || this.player.weapons_available.length == 0) { return; }
	
	this.player.weapon.unequip();
	var cur_index = this.player.weapons_available.indexOf(this.player.weapon.weapon_key);
	var next_weapon_key = this.player.weapons_available[(cur_index + 1) % this.player.weapons_available.length];
	this.weapons[next_weapon_key].equip();
	this.next_weapon_lock = true;
};

Level2.prototype.showHealthBars = function() {
	if (this.health_bars_visible) { return; }

	this.health_bars_visible = true;
	
	var bmd = this.game.add.bitmapData(300, 40);
	bmd.ctx.beginPath();
	bmd.ctx.rect(0, 0, 300, 80);
	bmd.ctx.fillStyle = '#00685e';
	bmd.ctx.fill();
	
	var bglife = this.game.add.sprite(400, 30, bmd);
    bglife.anchor.set(0.5);
    this.ui.add(bglife);
    
    bmd = this.game.add.bitmapData(290, 30);
    bmd.ctx.beginPath();
	bmd.ctx.rect(0, 0, 300, 80);
	bmd.ctx.fillStyle = '#00f910';
	bmd.ctx.fill();
	
	this.widthLife = new Phaser.Rectangle(0, 0, bmd.width, bmd.height);
	this.totalLife = this.player.maxHealth;
	this.life = this.game.add.sprite(400 - bglife.width/2 + 5, 30, bmd);
	this.life.anchor.y = 0.5;
	this.life.cropEnabled = true;
	this.life.crop(this.widthLife);
	this.ui.add(this.life);
	this.game.time.events.loop(200, this.cropHealthBar, this);  
};

Level2.prototype.cropHealthBar = function() {
	var targetWidth = 300 * (this.player.health / this.player.maxHealth);
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
		
		this.emitter_blood_big.emit('blood', (this.player.body.x + (this.player.body.width / 2)) - this.camera.position.x, this.player.body.y, { total: 3, repeat: 3, frequency: 1 });
		this.emitter_blood_sm.emit('blood', (this.player.body.x + (this.player.body.width / 2)) - this.camera.position.x, this.player.body.y, { total: 7, repeat: 5, frequency: 1 });
		this.player.play("die");
		this.first_block_gag_triggered = true;
		this.first_block_gag_finished = false;
		this.player_has_control = false;

		this.showHealthBars();
		this.time.events.add(100, function() {
			this.player.damage(15);
		}, this);
	}
};

Level2.prototype.floor_fall = function(player, trigger) {
	this.player.y = 10;
};

Level2.prototype.machinegun_trigger_hit = function(player, trigger) {
	this.weapons.machinegun.pickup(trigger);
	
	this.time.events.add(500, function() {
		this.t_enemy_2.show();
	}, this);
};


Level2.prototype.lasergun_trigger_hit = function(player, trigger) {
	this.weapons.laser.pickup(trigger);
	this.time.events.add(200, function() {
		this.b_enemy_1.show();
	}, this);
	this.time.events.add(800, function() {
		this.b_enemy_2.show();
	}, this);
};

Level2.prototype.rocket_trigger_hit = function(player, trigger) {
	this.weapons.rocket.pickup(trigger);
};

Level2.prototype.tesla_trigger_hit = function(player, trigger) {
	this.weapons.tesla.pickup(trigger);
};

Level2.prototype.miniboss_trigger = function() {	
	this.game.physics.arcade.isPaused = true;
	
	var text_raw = 'George: You\'ll never get past me.\n         I am UNDEFEATABLE.        \n          I cannot be defeated.   No sir.';
	this.setup_dialogbox(text_raw);
	
	this.ui.dialogCallback = function() {
		this.game.physics.arcade.isPaused = false;
		this.miniboss_1.show();
	};
	
	this.update_dialogbox(this.ui.dialogCallback);
	

};

Level2.prototype.setup_dialogbox = function(text) {
	
//	var desat_effect = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'desat_tiles');
//	desat_effect.animations.add('low', [0,1,2]);
//	desat_effect.animations.add('med', [3,4,5]);
//	desat_effect.animations.add('high', [6,7,8]);
//	desat_effect.animations.add('max', [9,10,11]);
//	desat_effect.blendMode = Phaser.blendModes.SATURATION;
//	this.ui.addChild(desat_effect);
//	desat_effect.animations.play('low', 5, true);
	
	this.ui.dialog_box = this.game.add.sprite(230, this.camera.height * (3 / 5), 'ui_dialog_box');
	this.ui.addChild(this.ui.dialog_box);
	
	this.ui.portrait_box = this.game.add.sprite(50, this.camera.height * (3 / 5), 'ui_portrait_box');
	this.ui.addChild(this.ui.portrait_box);
	
	this.ui_portrait = this.game.add.sprite(58, this.camera.height * (3 / 5) + 8, 'george_portrait');
	//this.ui_portrait.scale.set(1.2, 1.55); // peppy scale
	this.ui_portrait.scale.set(0.96, 1.15);
	this.ui_portrait.animations.add('idle', null);
	this.ui_portrait.animations.play('idle', 8, true);
	this.ui.addChild(this.ui_portrait);

	this.ui.main_text_raw = text;
	this.ui.dialog_text = this.game.add.text(250, this.camera.height * (3 / 5) + 10, '', { font: "25px \"Comic Sans MS\"", fill: "#fff" });
	this.ui_dialog_position = 0;
	this.ui.addChild(this.ui.dialog_text);
};

Level2.prototype.update_dialogbox = function(callback_func) {
	this.time.events.add(100, function() {
		this.ui_dialog_position += 1;
		this.ui.dialog_text.text = this.ui.main_text_raw.slice(0, this.ui_dialog_position);
		if (this.ui_dialog_position < this.ui.main_text_raw.length) {
			this.update_dialogbox(callback_func);
		} else {
			//dialogue complete
			this.time.events.add(2000, function() {
				this.ui.dialog_box.destroy();
				this.ui.portrait_box.destroy();
				this.ui_portrait.destroy();
				this.ui.dialog_text.destroy();
				if (callback_func) {
					callback_func.call(this);
				}
			}, this);
		}
	}, this);
};

