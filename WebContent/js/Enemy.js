Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)];
};

Enemy = function (options) {
	this.spawn_trigger = options.spawn_trigger;
	this.ctx = options.ctx;
	
	this.game = this.ctx.game;
	this.player = this.ctx.player;
	
	this.group = this.game.add.group();
	
	if (!this.base_sprite) console.log("PLEASE SET BASE SPRITE");
	
	this.body = this.game.add.sprite(0, 0, this.base_sprite);
	this.body.klass = this;
	this.body.anchor.set(0.5, 1);
	
	this.group.add(this.body);
	this.group.setAll("renderable", false);
	
	this.game.physics.enable(this.group);
	this.group.setAll("body.allowGravity", false);
	
	this.spawn_enabled = !!this.spawn_trigger; // set to true if we have a spawn_trigger set
	this.can_shoot = this.can_shoot || true;
	this.can_move = this.can_move || true;
	this.alive = false;
	
	this.max_health = this.max_health || 100;
	this.health = this.max_health;
	
	this.move_timer_default = this.move_timer_default || 2000;
	this.move_timer = this.move_timer_default;
	
	this.shoot_timer_default = this.shoot_timer_default || 800;
	this.shoot_timer = 0;
	
	this.turrets = [];
	this.tweens = [];
};

Enemy.prototype.show = function() {
	if (this.alive) { return; }
	
	this.ctx.enemy_layer.addChild(this.group);
	this.group.setAll("renderable", true);
	this.spawn_enabled = false;
	
	var healthbar = new Phaser.Sprite(this.game, 0, -10 - this.body.height, "healthbar", 0);
	healthbar.scale.x = 20;
	healthbar.anchor.x = 0.5;
	this.healthbar = this.group.addChild(healthbar);
	
	this.alive = true;
};

Enemy.prototype.tick = function() {
	if (!this.alive) { return; }
	
	// update timers
	var tickDelta = (this.lastTick) ? this.game.time.now - this.lastTick : 0;
	this.move_timer -= tickDelta;
	this.shoot_timer -= tickDelta;
	
	if (this.move_timer <= 0) {
		if (this.can_move) this.doMove();
		this.move_timer = this.move_timer_default;
	}
	
	if (this.shoot_timer <= 0) {
		if (this.can_shoot) this.doShoot();
		this.shoot_timer = this.shoot_timer_default;
	}
	
	this.updateEnemyHealthbar();

	this.lastTick = this.game.time.now;
};

Enemy.prototype.doMove = function() {};
Enemy.prototype.doShoot = function() {};

Enemy.prototype.takeDamage = function(damage) {
	this.health -= damage;
	if (this.health < 0) this.health = 0;
};

Enemy.prototype.onHit = function(bullet, enemy) {
	this.takeDamage(this.player.weapon.damage);
	if (this.player.weapon.hit_effect_callback) { this.player.weapon.hit_effect_callback.call(this.player.weapon, bullet, enemy); }
	bullet.kill();
};

Enemy.prototype.updateEnemyHealthbar = function() {
	var health_pct = this.health / this.max_health;
	this.healthbar.scale.x = 20 * health_pct;
	this.healthbar.frame = Math.floor(10 - (health_pct * 10));
};

Enemy.prototype.update = function() {
	if (this.weapon) {
		this.ctx.physics.arcade.overlap(this.player, this.weapon.bullets, this.playerHit, null, this);
		this.ctx.physics.arcade.overlap(this.ctx.walls, this.weapon.bullets, this.wallHit, null, this);
		this.ctx.physics.arcade.overlap(this.ctx.ground, this.weapon.bullets, this.wallHit, null, this);
	}
	
	if (!this.alive) { return; }
	
	if (this.spawn_enabled) this.ctx.physics.arcade.overlap(this.player, this.spawn_trigger, this.show, null, this);
	
	this.ctx.physics.arcade.overlap(this.player, this.group, this.spriteHit, null, this);
	
	if (this.player.weapon) {
		this.ctx.physics.arcade.overlap(this.player.weapon.bullets, this.group, this.onHit, null, this);
	}
	
	if (this.health <= 0) {
		this.die.call(this, this.player.weapon.weapon_key);
	}
	
	this.tick.call(this);
};

Enemy.prototype.die = function(weapon_key) {
	if (!this.alive) return; // already dead
	
	this.can_shoot = false;
	this.can_move = false;
	this.updateEnemyHealthbar();
	this.alive = false;
	
	this.tweens.forEach(function(tween) {
		tween.stop();
		this.game.tweens.remove(tween);
	}, this);
	
	//cleanup turrets
	if (this.turrets) {
		this.turrets.forEach(function(turret) {
			this.game.physics.enable(turret);
			turret.body.allowGravity = true;
			turret.body.angularVelocity = (Math.random() * 600) - 300;
		}, this);
		
	    this.ctx.time.events.add(2000, function() {
	    	this.turrets.forEach(function(turret) {
	    		turret.destroy();
	    	}, this);
		}, this);
	}
	
	if (weapon_key == 'machinegun') {
		console.log(this.group.position.x + 50, this.group.position.y + 800);
		this.game.add.tween(this.group.position).to({
			x: this.group.position.x + 50,
			y: this.group.position.y + 2000}, 2600, Phaser.Easing.Elastic.None, true);
	    
	    this.ctx.time.events.add(3000, function() {
	    	this.body.destroy();
	    	this.destroyAfterBullets();
		}, this);
	} else if (weapon_key == 'laser') {
		var tmpSprite =  new Phaser.Sprite(this.game, 0, 0, this.base_sprite, 0);
		tmpSprite.scale.set(Math.abs(this.body.scale.x), this.body.scale.y);
		var enemy_sprite_zone = this.ctx.ps_manager.createImageZone(tmpSprite);
		this.enemydie_emitter = this.ctx.ps_manager.createEmitter(Phaser.ParticleStorm.PIXEL, this.ctx.world.bounds.width, this.ctx.world.bounds.height);
		this.enemydie_emitter.addToWorld(this.ctx.emitter_group);
		
	    this.enemydie_emitter.emit('spritedie',
	    		this.body.world.x - (Math.abs(this.body.width) * this.body.anchor.x) - this.ctx.camera.position.x,
	    		this.body.world.y - (this.body.height * this.body.anchor.y) 		- this.ctx.camera.position.y,
	    		{ zone: enemy_sprite_zone, full: true, setColor: true });
	    this.body.destroy();
	    
	    this.ctx.time.events.add(2000, function() {
	    	this.ctx.ps_manager.removeEmitter(this.enemydie_emitter);
	    	this.enemydie_emitter.destroy();
	    	
	    	this.destroyAfterBullets();
	
		}, this);
	} else if (weapon_key == 'tesla') {
		var tmpSprite =  new Phaser.Sprite(this.game, 0, 0, this.base_sprite, 0);
		tmpSprite.scale.set(Math.abs(this.body.scale.x), this.body.scale.y);
		var enemy_sprite_zone = this.ctx.ps_manager.createImageZone(tmpSprite);
		this.enemydie_emitter = this.ctx.ps_manager.createEmitter(Phaser.ParticleStorm.PIXEL, this.ctx.world.bounds.width, this.ctx.world.bounds.height);
		this.enemydie_emitter.renderer.pixelSize = 2;
		this.enemydie_emitter.force.y = 0.5;
		this.enemydie_emitter.addToWorld(this.ctx.emitter_group);
		
		this.enemydie_emitter2 = this.ctx.ps_manager.createEmitter(Phaser.ParticleStorm.PIXEL, this.ctx.world.bounds.width, this.ctx.world.bounds.height);
		this.enemydie_emitter2.renderer.pixelSize = 5;
		this.enemydie_emitter2.force.y = 0.5;
		this.enemydie_emitter2.addToWorld(this.ctx.emitter_group);
		
	    this.enemydie_emitter.emit('spritedie_tesla',
	    		this.body.world.x - (Math.abs(this.body.width) * this.body.anchor.x) - this.ctx.camera.position.x,
	    		this.body.world.y - (this.body.height * this.body.anchor.y) 		- this.ctx.camera.position.y,
	    		{ zone: enemy_sprite_zone, random: true, total: 200 });
	    this.enemydie_emitter2.emit('spritedie_tesla',
	    		this.body.world.x - (Math.abs(this.body.width) * this.body.anchor.x) - this.ctx.camera.position.x,
	    		this.body.world.y - (this.body.height * this.body.anchor.y) 		- this.ctx.camera.position.y,
	    		{ zone: enemy_sprite_zone, random: true, total: 40 });
	    this.body.destroy();
	    
	    this.ctx.time.events.add(3300, function() {
	    	this.ctx.ps_manager.removeEmitter(this.enemydie_emitter);
	    	this.enemydie_emitter.destroy();
	    	
	    	this.destroyAfterBullets();
	
		}, this);
	} else {
		//catchall enemy death
		this.game.add.tween(this.group.position).to({
			x: this.group.position.x + 50,
			y: this.group.position.y + 2000}, 2600, Phaser.Easing.Elastic.None, true);
	    
	    this.ctx.time.events.add(3000, function() {
	    	this.body.destroy();
	    	this.destroyAfterBullets();
		}, this);
	}
};

Enemy.prototype.destroyAfterBullets = function() {
	if (this.weapon.bullets.countLiving() == 0) {
		this.destroy();
	} else {
		this.ctx.time.events.add(1000, function() {
	    	this.destroyAfterBullets();
		}, this);
	}
};

Enemy.prototype.spriteHit = function() {
	if (!this.lastTouchDamageTime || (this.game.time.now - this.lastTouchDamageTime) > 2000) {
		this.lastTouchDamageTime = this.game.time.now;
		this.game.camera.shake(0.005, 300);
		this.player.damage(10);
	}
};

Enemy.prototype.destroy = function() {
	this.group.destroy();
	this.healthbar.destroy();
};


walker_types = [
	{sprite: "digdug", scale: {x: 2, y: 2}},
	{sprite: "mario_mole", scale: {x: 1, y: 1}},
	{sprite: "joust_bird", scale: {x: 3, y: 3}},
	{sprite: "robolady", scale: {x: 2, y: 2}},
	{sprite: "marge", scale: {x: 1.5, y: 1.5}},
];

WalkerEnemy = function(options) {
	this.meta_info = walker_types.randomElement();
	this.base_sprite = this.meta_info.sprite;
	this.spawn_position = options.spawn_position;
	console.log("walker init");
	
	
	return Enemy.call(this, options);	
};

WalkerEnemy.prototype = Object.create(Enemy.prototype);
WalkerEnemy.prototype.constructor = Enemy;
WalkerEnemy.prototype.parent = Enemy.prototype;


WalkerEnemy.prototype.show = function() {
	if (this.alive) { return; }
	console.log("walker show");
	this.initCycle();
	this.createWeapons();
	this.body.scale.set(this.meta_info.scale.x, this.meta_info.scale.y);
	this.body.animations.add("walk", null, 6);
	Enemy.prototype.show.call(this);
	
	// block spawn in place
	this.group.position.set(this.spawn_position.x, this.spawn_position.y);
};

WalkerEnemy.prototype.update = function() {
	this.handleCycle();
	Enemy.prototype.update.call(this);
	
};

//WalkerEnemy.prototype.die = function() {
//	if (!this.alive) return; // we're already in the middle of dying, no need to die twice
//
//	Enemy.prototype.die.call(this);
//};

WalkerEnemy.prototype.playerHit = function(player, bullet) {
	this.player.damage(5);
	bullet.kill();
};

WalkerEnemy.prototype.wallHit = function(wall, bullet) {
	bullet.kill();
};


WalkerEnemy.prototype.createWeapons = function() {
	this.weapon = this.ctx.add.weapon(80, "items");
	this.weapon.setBulletFrames(8, 10, true);
	this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
	this.weapon.bulletSpeed = 100;
	this.weapon.bulletGravity.y = -800;
	this.weapon.fireRate = 0;
	this.weapon.multiFire = true;
	this.weapon.damage = 5;
};

WalkerEnemy.prototype.doMove = function() {};

WalkerEnemy.prototype.walkLeft = function() {
	this.body.scale.x = -this.meta_info.scale.x;
	this.body.animations.play("walk");
	this.group.x -= 1;
};

WalkerEnemy.prototype.walkRight = function() {
	this.body.scale.x = this.meta_info.scale.x;
	this.body.animations.play("walk");
	this.group.x += 1;
};

WalkerEnemy.prototype.stand = function() {
	this.body.animations.stop();
};

WalkerEnemy.prototype.doShoot = function() {
//	this.weapon.fire(turret_barrel_1, this.player.world.x, this.player.world.y);
};

WalkerEnemy.prototype.initCycle = function() {
	this.cycle_funcs = [
    	{time: 4000, func: this.walkLeft, },
    	{time: 1000, func: this.stand, },
    	{time: 4000, func: this.walkRight, },
    	{time: 1000, func: this.stand, },
   	];
	this.cycle_funcs_len = this.cycle_funcs.length;
	this.cycle_phase = -1;
	this.cycle_timer = 500;
	this.cycle_func = null;
};

WalkerEnemy.prototype.handleCycle = function() {
	var tickDelta = (this.lastTick) ? this.game.time.now - this.lastTick : 0;

	this.cycle_timer -= tickDelta;
	if (this.cycle_timer <= 0) {
		this.cycle_phase = (this.cycle_phase + 1) % this.cycle_funcs_len;
		this.cycle_func = this.cycle_funcs[this.cycle_phase].func;
		this.cycle_timer = this.cycle_funcs[this.cycle_phase].time;
//		console.log("cycle change triggered", this.cycle_func, this.cycle_phase, this.cycle_timer);
	}
	
	if (this.cycle_func) this.cycle_func.call(this);
};

WalkerEnemy2 = function(options) {
	return WalkerEnemy.call(this, options);
};

WalkerEnemy2.prototype = Object.create(WalkerEnemy.prototype);
WalkerEnemy2.prototype.constructor = WalkerEnemy;
WalkerEnemy2.prototype.parent = WalkerEnemy.prototype;

WalkerEnemy2.prototype.initCycle = function() {
	this.cycle_funcs = [
    	{time: 500, func: this.walkLeft, },
    	{time: 1000, func: this.stand, },
    	{time: 500, func: this.walkRight, },
    	{time: 1000, func: this.stand, },
   	];
	this.cycle_funcs_len = this.cycle_funcs.length;
	this.cycle_phase = -1;
	this.cycle_timer = 500;
	this.cycle_func = null;
};

ShootingEnemy = function(options) {
	this.base_sprite = this.base_sprite || "tetris_t";
	return Enemy.call(this, options);
	
};

ShootingEnemy.prototype = Object.create(Enemy.prototype);
ShootingEnemy.prototype.constructor = Enemy;
ShootingEnemy.prototype.parent = Enemy.prototype;

ShootingEnemy.prototype.show = function() {
	if (this.alive) { return; }
	this.createTurrets();
	this.createWeapons();
	Enemy.prototype.show.call(this);
	
	// block slide in from top
//	this.group.position.set(this.player.x, -100);
//	this.tweens.push(this.game.add.tween(this.group.position).to( {y: 100} , 1200, Phaser.Easing.Cubic.None, true));
};

ShootingEnemy.prototype.update = function() {
	Enemy.prototype.update.call(this);
};

//ShootingEnemy.prototype.die = function() {
//	if (!this.alive) return; // we're already in the middle of dying, no need to die twice
//
//	Enemy.prototype.die.call(this, this.player.weapon.weapon_key);
//	
//
//    
//};

ShootingEnemy.prototype.playerHit = function(player, bullet) {
	this.player.damage(this.weapon.damage);
	this.game.camera.shake(0.005, 100);
	bullet.kill();
};

ShootingEnemy.prototype.wallHit = function(wall, bullet) {
	bullet.kill();
};


ShootingEnemy.prototype.createWeapons = function() {
	this.weapon = this.ctx.add.weapon(80, "items");
	this.weapon.setBulletFrames(8, 10, true);
	this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
	this.weapon.bulletSpeed = 100;
	this.weapon.bulletGravity.y = -800;
	this.weapon.fireRate = 0;
	this.weapon.multiFire = true;
	this.weapon.damage = 5;
};

ShootingEnemy.prototype.createTurrets = function() {
	var turretData = [
	  {x: -27, y: 0, ax: 0.5, ay: 0.25, sprite: "turret01"},
	  {x: 27, y: -22, ax: 0.5, ay: 0.25, sprite: "turret01"},
	];
	turretData.forEach(function(turret_data){
		var turret = this.game.add.sprite(0, 0, turret_data.sprite);
		turret.anchor.set(turret_data.ax, turret_data.ay);
		turret.position.set(turret_data.x, turret_data.y);
		this.group.add(turret);
		this.turrets.push(turret);
	}, this);
};

ShootingEnemy.prototype.doMove = function() {
	this.tweens.push(this.game.add.tween(this.group.position).to( {x: this.player.world.x} , 2000, Phaser.Easing.Linear.None, true));
};

ShootingEnemy.prototype.doShoot = function() {
	this.turrets.forEach(function(turret) {
		var t1_rot = -1.5708 + Phaser.Math.angleBetween(turret.world.x, turret.world.y, this.player.world.x, this.player.world.y);
		this.game.add.tween(turret).to({rotation: t1_rot}, 200, Phaser.Easing.Linear.None, true);
		
		this.ctx.time.events.add(200, function() {
			var turret_barrel_1 = {
				x: turret.world.x + (turret.height * 1.2) * -1 * Math.sin(turret.rotation),
				y: turret.world.y + (turret.height * 1.2) * Math.cos(turret.rotation),
			};
			
			this.weapon.fire(turret_barrel_1, this.player.world.x, this.player.world.y);
		}, this);
	}, this);
};


Tetris_T_Enemy = function(options) {
	this.base_sprite = "tetris_t";
	return ShootingEnemy.call(this, options);
	
};

Tetris_T_Enemy.prototype = Object.create(ShootingEnemy.prototype);
Tetris_T_Enemy.prototype.constructor = ShootingEnemy;
Tetris_T_Enemy.prototype.parent = ShootingEnemy.prototype;

Tetris_T_Enemy.prototype.show = function() {
	if (this.alive) { return; }
	this.parent.show.call(this);
	
	// block slide in from top
	this.group.position.set(this.player.x, this.game.camera.y - 100);
	this.tweens.push(this.game.add.tween(this.group.position).to( {y: this.game.camera.y + (Math.random() * 20) + 130} , 1200, Phaser.Easing.Cubic.None, true));
};

Tetris_T_Enemy.prototype.createWeapons = function() {
	this.weapon = this.ctx.add.weapon(80, "items");
	this.weapon.setBulletFrames(8, 10, true);
	this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
	this.weapon.bulletSpeed = 100;
	this.weapon.bulletGravity.y = -800;
	this.weapon.fireRate = 0;
	this.weapon.multiFire = true;
	this.weapon.damage = 5;
};

Tetris_T_Enemy.prototype.createTurrets = function() {
	var turretData = [
	  {x: -27, y: -32, ax: 0.5, ay: 0.25, sprite: "turret01"},
	  {x: 27, y: -32, ax: 0.5, ay: 0.25, sprite: "turret01"},
	];
	turretData.forEach(function(turret_data){
		var turret = this.game.add.sprite(0, 0, turret_data.sprite);
		turret.anchor.set(turret_data.ax, turret_data.ay);
		turret.position.set(turret_data.x, turret_data.y);
		this.group.add(turret);
		this.turrets.push(turret);
	}, this);
};

Tetris_T_Enemy.prototype.doMove = function() {
	this.tweens.push(this.game.add.tween(this.group.position).to( {x: this.player.world.x} , 2000, Phaser.Easing.Linear.None, true));
};

Tetris_T_Enemy.prototype.doShoot = function() {
	this.turrets.forEach(function(turret) {
		var t1_rot = -1.5708 + Phaser.Math.angleBetween(turret.world.x, turret.world.y, this.player.world.x, this.player.world.y);
		this.game.add.tween(turret).to({rotation: t1_rot}, 200, Phaser.Easing.Linear.None, true);
		
		this.ctx.time.events.add(200, function() {
			var turret_barrel_1 = {
				x: turret.world.x + (turret.height * 1.2) * -1 * Math.sin(turret.rotation),
				y: turret.world.y + (turret.height * 1.2) * Math.cos(turret.rotation),
			};
			
			this.weapon.fire(turret_barrel_1, this.player.world.x, this.player.world.y);
		}, this);
	}, this);
};


BomberEnemy = function(options) {
	this.base_sprite = "bulletbill_lg";
	this.shoot_timer_default = 1000;
	this.move_timer_default = 2000;
	this.max_health = 500;
	
	this.height_offset = 200;
	
	return Enemy.call(this, options);
};

BomberEnemy.prototype = Object.create(Enemy.prototype);
BomberEnemy.prototype.constructor = Enemy;
BomberEnemy.prototype.parent = Enemy.prototype;

BomberEnemy.prototype.show = function() {
	if (this.alive) { return; }
	this.createWeapons();
	
	this.bomberMoveSpeed = Math.floor(Math.random() * 3) + 2;
	
	Enemy.prototype.show.call(this);
	
	// spawn left of player off camera
	this.group.position.set(this.player.x - 800, this.player.y - this.height_offset);
};

BomberEnemy.prototype.update = function() {
	Enemy.prototype.update.call(this);
	
	// travel right slowly
	this.group.position.x += this.bomberMoveSpeed;
};

BomberEnemy.prototype.doMove = function() {
	this.tweens.push(this.game.add.tween(this.group.position).to({y: this.player.y - this.height_offset}, 1600, Phaser.Easing.Linear.None, true));
};


BomberEnemy.prototype.doShoot = function() {
	this.weapon.fire({x: this.group.x, y: this.group.y + this.group.height - 20}, this.group.x, this.group.y + this.group.height);
};

BomberEnemy.prototype.createWeapons = function() {
	this.weapon = this.ctx.add.weapon(20, "bulletbill_sm");
	this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
	this.weapon.bulletSpeed = 200;
	this.weapon.bulletGravity.y = -800;
	this.weapon.bulletRotateToVelocity = true;
	this.weapon.fireRate = 0;
	this.weapon.multiFire = true;
	this.weapon.damage = 10;
};

BomberEnemy.prototype.onBulletHit = function(bullet) {
	var explosion = this.game.add.sprite(bullet.x, bullet.y, 'explosion_sm');
	explosion.anchor.set(0.5, 0.5);
	explosion.animations.add('blowup', null, 60);
	explosion.animations.play('blowup', 60, false, true);
	bullet.kill();
	this.game.camera.shake(0.005, 100);
};

BomberEnemy.prototype.playerHit = function(player, bullet) {
	this.player.damage(this.weapon.damage);
	this.onBulletHit(bullet);
};

BomberEnemy.prototype.wallHit = function(wall, bullet) {
	this.onBulletHit(bullet);
};

//BomberEnemy.prototype.die = function() {
//	if (!this.alive) return; // we're already in the middle of dying, no need to die twice
//
//	Enemy.prototype.die.call(this);
//	
//	// drop below camera
//	this.game.add.tween(this.group.position).to({y: this.player.y + this.height_offset*2}, 2600, Phaser.Easing.Elastic.None, true);
//
//    
//    this.ctx.time.events.add(4000, function() {
//    	this.destroy();
//	}, this);
//    
//};


Gradius_Miniboss_Enemy = function(options) {
	this.base_sprite = "gradius_boss";
	this.max_health = 1500;
	this.shoot_timer_default = 1200;
	return ShootingEnemy.call(this, options);
	
};

Gradius_Miniboss_Enemy.prototype = Object.create(ShootingEnemy.prototype);
Gradius_Miniboss_Enemy.prototype.constructor = ShootingEnemy;
Gradius_Miniboss_Enemy.prototype.parent = ShootingEnemy.prototype;

Gradius_Miniboss_Enemy.prototype.show = function() {
	if (this.alive) { return; }
	this.parent.show.call(this);
	
	this.healthbar.position.y += 20;

	this.body.anchor.set(0.5, 0.5);
	this.body.rotation = Math.PI/2;
	this.body.scale.set(1.7);
	
	// block slide in from top
	this.group.position.set(this.player.x, this.game.camera.y - 100);
	this.tweens.push(this.game.add.tween(this.group.position).to( {y: this.game.camera.y + 200} , 1200, Phaser.Easing.Cubic.None, true));
};

Gradius_Miniboss_Enemy.prototype.createWeapons = function() {
	this.weapon = this.ctx.add.weapon(80, "items");
	this.weapon.setBulletFrames(8, 10, true);
	this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
	this.weapon.bulletSpeed = 200;
	this.weapon.bulletGravity.y = -800;
	this.weapon.fireRate = 0;
	this.weapon.multiFire = true;
	this.weapon.damage = 10;
};

Gradius_Miniboss_Enemy.prototype.createTurrets = function() {
	var turretData = [
	  {x: -92, y: 32, ax: 0.5, ay: 0.25, sprite: "turret02"},
	  {x: 92, y: 32, ax: 0.5, ay: 0.25, sprite: "turret02"},
	  {x: -113, y: -22, ax: 0.5, ay: 0.25, sprite: "turret02"},
	  {x: 113, y: -22, ax: 0.5, ay: 0.25, sprite: "turret02"},
	];
	turretData.forEach(function(turret_data){
		var turret = this.game.add.sprite(0, 0, turret_data.sprite);
		turret.anchor.set(turret_data.ax, turret_data.ay);
		turret.position.set(turret_data.x, turret_data.y);
		this.group.add(turret);
		this.turrets.push(turret);
	}, this);
};

Gradius_Miniboss_Enemy.prototype.doMove = function() {
	this.tweens.push(this.game.add.tween(this.group.position).to( {x: this.player.world.x} , 2000, Phaser.Easing.Linear.None, true));
};

Gradius_Miniboss_Enemy.prototype.doShoot = function() {
	this.turrets.forEach(function(turret) {
		var t1_rot = -1.5708 + Phaser.Math.angleBetween(turret.world.x, turret.world.y, this.player.world.x, this.player.world.y);
		this.game.add.tween(turret).to({rotation: t1_rot}, 200, Phaser.Easing.Linear.None, true);
		
		this.ctx.time.events.add(200, function() {
			var turret_barrel_1 = {
				x: turret.world.x + 5 + (turret.height * 0.9) * -1 * Math.sin(turret.rotation),
				y: turret.world.y + (turret.height * 0.9) * Math.cos(turret.rotation),
			};
			
			var turret_barrel_2 = {
				x: turret.world.x - 5 + (turret.height * 0.9) * -1 * Math.sin(turret.rotation),
				y: turret.world.y + (turret.height * 0.9) * Math.cos(turret.rotation),
			};
			
			this.weapon.fire(turret_barrel_1, this.player.world.x + 5, this.player.world.y);
			this.weapon.fire(turret_barrel_2, this.player.world.x - 5, this.player.world.y);
		}, this);
	}, this);
};
