Enemy = function (options) {
	this.spawn_trigger = options.spawn_trigger;
	this.ctx = options.ctx;
	
	this.game = this.ctx.game;
	this.player = this.ctx.player;
	
	this.group = this.game.add.group();
	
	if (!this.base_sprite) console.log("PLEASE SET BASE SPRITE");
	
	this.body = this.game.add.sprite(0, 0, this.base_sprite);
	this.body.anchor.set(0.5, 0);
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
	this.move_timer = 0;
	
	this.shoot_timer_default = this.shoot_timer_default || 800;
	this.shoot_timer = 0;
	
	this.turrets = [];
};

Enemy.prototype.show = function() {
	this.group.setAll("renderable", true);
	this.spawn_enabled = false;
	
	var healthbar = new Phaser.Sprite(this.game, 0, -10, "healthbar", 0);
	healthbar.scale.x = 20;
	healthbar.anchor.x = 0.5;
	this.healthbar = this.group.addChild(healthbar);
	
//	this.ctx.time.events.add(800, function() {
//		this.game.time.events.loop(100, this.tick, this);
//	}, this);
	
	this.alive = true;
};

Enemy.prototype.tick = function() {
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
	
	if (this.alive) {
		this.updateEnemyHealthbar();
	}

	this.lastTick = this.game.time.now;
};

Enemy.prototype.doMove = function() {};
Enemy.prototype.doShoot = function() {};

Enemy.prototype.onHit = function(bullet, enemy) {
	bullet.kill();
	this.health -= this.player.weapon.damage;
	if (this.health < 0) this.health = 0;
};

Enemy.prototype.updateEnemyHealthbar = function() {
	var health_pct = this.health / this.max_health;
	this.healthbar.scale.x = 20 * health_pct;
	this.healthbar.frame = Math.floor(10 - (health_pct * 10));
};

Enemy.prototype.update = function() {
	if (this.spawn_enabled) this.ctx.physics.arcade.overlap(this.player, this.spawn_trigger, this.show, null, this);
	
	if (this.weapon) {
		this.ctx.physics.arcade.overlap(this.player, this.weapon.bullets, this.playerHit, null, this);
		this.ctx.physics.arcade.overlap(this.ctx.walls, this.weapon.bullets, this.wallHit, null, this);
		this.ctx.physics.arcade.overlap(this.ctx.ground, this.weapon.bullets, this.wallHit, null, this);
	}
	
	if (this.player.weapon) {
		this.ctx.physics.arcade.overlap(this.player.weapon.bullets, this.group, this.onHit, null, this);
	}
	
	if (this.health <= 0) {
		this.die();
	}
	
	this.tick.call(this);
};

Enemy.prototype.die = function() {
	this.can_shoot = false;
	this.can_move = false;
};

Enemy.prototype.destroy = function() {
	this.group.destroy();
	this.healthbar.destroy();
};


ShootingEnemy = function(options) {
	this.base_sprite = "tetris_t";
	return Enemy.call(this, options);
	
};

ShootingEnemy.prototype = Object.create(Enemy.prototype);
ShootingEnemy.prototype.constructor = Enemy;
ShootingEnemy.prototype.parent = Enemy.prototype;

ShootingEnemy.prototype.show = function() {
	this.createTurrets();
	this.createWeapons();
	Enemy.prototype.show.call(this);
	
	// block slide in from top
	this.group.position.set(this.player.x, -100);
	this.game.add.tween(this.group).to( {y: 100} , 1200, Phaser.Easing.Cubic.None, true);
};

ShootingEnemy.prototype.update = function() {
	Enemy.prototype.update.call(this);
};

ShootingEnemy.prototype.die = function() {
	if (!this.alive) return; // we're already in the middle of dying, no need to die twice

	Enemy.prototype.die.call(this);
	
	
	this.turrets.forEach(function(turret) {
		this.game.physics.enable(turret);
		turret.body.allowGravity = true;
		turret.body.angularVelocity = (Math.random() * 600) - 300;
	}, this);
	
	var enemy_sprite = this.ctx.ps_manager.createImageZone(this.base_sprite);
	this.enemydie_emitter = this.ctx.ps_manager.createEmitter(Phaser.ParticleStorm.PIXEL, this.ctx.world.bounds.width, this.ctx.world.bounds.height);
	this.enemydie_emitter.addToWorld();
	
    this.enemydie_emitter.emit('spritedie', this.body.world.x - (this.body.width / 2), this.body.world.y, { zone: enemy_sprite, full: true, setColor: true });
    this.body.destroy();
    this.alive = false;
    
    this.ctx.time.events.add(2000, function() {
    	this.ctx.ps_manager.removeEmitter(this.enemydie_emitter);
    	this.enemydie_emitter.destroy();

    	this.turrets.forEach(function(turret) {
    		turret.destroy();
    	}, this);
    	
    	this.destroy();

	}, this);
    
};

ShootingEnemy.prototype.playerHit = function(player, bullet) {
	this.player.damage(5);
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
	this.weaponDamage = 5;
};

ShootingEnemy.prototype.createTurrets = function() {
	var turretData = [
	  {x: -27, y: 22, ax: 0.5, ay: 0.25, sprite: "turret01"},
	  {x: 27, y: 22, ax: 0.5, ay: 0.25, sprite: "turret01"},
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
	this.game.add.tween(this.group).to( {x: this.player.world.x} , 2000, Phaser.Easing.Linear.None, true);
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
	this.parent.show.call(this);
	
	// block slide in from top
	this.group.position.set(this.player.x, -100);
	this.game.add.tween(this.group).to( {y: 100} , 1200, Phaser.Easing.Cubic.None, true);
};

Tetris_T_Enemy.prototype.update = function() {
	this.parent.update.call(this);
};

Tetris_T_Enemy.prototype.die = function() {
	if (!this.alive) return; // we're already in the middle of dying, no need to die twice

	this.parent.die.call(this);    
};

Tetris_T_Enemy.prototype.playerHit = function(player, bullet) {
	this.player.damage(this.weaponDamage);
	bullet.kill();
};

Tetris_T_Enemy.prototype.wallHit = function(wall, bullet) {
	bullet.kill();
};


Tetris_T_Enemy.prototype.createWeapons = function() {
	this.weapon = this.ctx.add.weapon(80, "items");
	this.weapon.setBulletFrames(8, 10, true);
	this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
	this.weapon.bulletSpeed = 100;
	this.weapon.bulletGravity.y = -800;
	this.weapon.fireRate = 0;
	this.weapon.multiFire = true;
};

Tetris_T_Enemy.prototype.createTurrets = function() {
	var turretData = [
	  {x: -27, y: 22, ax: 0.5, ay: 0.25, sprite: "turret01"},
	  {x: 27, y: 22, ax: 0.5, ay: 0.25, sprite: "turret01"},
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
	this.game.add.tween(this.group).to( {x: this.player.world.x} , 2000, Phaser.Easing.Linear.None, true);
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
	this.weaponDamage = 10;
	
	this.height_offset = 400;
	
	return Enemy.call(this, options);
};

BomberEnemy.prototype = Object.create(Enemy.prototype);
BomberEnemy.prototype.constructor = Enemy;
BomberEnemy.prototype.parent = Enemy.prototype;

BomberEnemy.prototype.show = function() {
	this.createWeapons();
	
	Enemy.prototype.show.call(this);
	
	// spawn left of player off camera
	this.group.position.set(this.player.x - 800, this.player.y - this.height_offset);
};

BomberEnemy.prototype.update = function() {
	Enemy.prototype.update.call(this);
	
	// travel right slowly
	this.group.position.x += 2.5;
};

BomberEnemy.prototype.doMove = function() {
	this.game.add.tween(this.group.position).to({y: this.player.y - this.height_offset}, 1600, Phaser.Easing.Linear.None, true);
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
};

BomberEnemy.prototype.onBulletHit = function(bullet) {
	var explosion = this.game.add.sprite(bullet.x, bullet.y, 'explosion_sm');
	explosion.anchor.set(0.5, 0.5);
	explosion.animations.add('blowup', null, 60);
	explosion.animations.play('blowup');
	bullet.kill();
};

BomberEnemy.prototype.playerHit = function(player, bullet) {
	this.player.damage(this.weaponDamage);
	this.onBulletHit(bullet);
};

BomberEnemy.prototype.wallHit = function(wall, bullet) {
	this.onBulletHit(bullet);
};

BomberEnemy.prototype.die = function() {
	if (!this.alive) return; // we're already in the middle of dying, no need to die twice

	Enemy.prototype.die.call(this);
	
	// drop below camera
	this.game.add.tween(this.group.position).to({y: this.player.y + this.height_offset*2}, 2600, Phaser.Easing.Elastic.None, true);
    this.alive = false;
    
    this.ctx.time.events.add(4000, function() {
    	this.destroy();
	}, this);
    
};