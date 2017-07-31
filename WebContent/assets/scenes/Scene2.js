// Generated by Phaser Editor v1.2.1

/**
 * Scene2.
 * @param {Phaser.Game} aGame The game.
 * @param {Phaser.Group} aParent The parent group. If not given the game world will be used instead.
 */
function Scene2(aGame, aParent) {
	Phaser.Group.call(this, aGame, aParent);

	/* --- pre-init-begin --- */

	// you can insert code here

	/* --- pre-init-end --- */

	var background = this.game.add.group(this);

	this.game.add.tileSprite(-176, -336, 5000, 1000, 'mario_nes_tileset', 696, background);

	var metalslug = this.game.add.sprite(3935, -713, 'metalslug', null, background);
	metalslug.scale.setTo(4.0, 4.0);

	var water_temple = this.game.add.sprite(16187, -153, 'water_temple', 0, background);
	water_temple.scale.setTo(2.0, 2.0);
	water_temple.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);

	var water_temple_outside = this.game.add.sprite(18227, -131, 'water_temple_outside', 0, background);
	water_temple_outside.scale.setTo(2.2, 2.2);
	water_temple_outside.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7], 6, true);

	var background_final_1x8 = this.game.add.sprite(22221, -96, 'background_final_1x8', 0, background);
	background_final_1x8.scale.setTo(3.0, 3.0);

	var factory = this.game.add.sprite(19973, -84, 'factory', 0, background);
	factory.scale.setTo(3.0, 3.0);
	factory.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);

	var Cloud311 = this.game.add.group(background);
	Cloud311.position.setTo(2744, 186);

	this.game.add.sprite(32, 0, 'mario_nes_tileset', 661, Cloud311);

	this.game.add.sprite(0, 0, 'mario_nes_tileset', 660, Cloud311);

	this.game.add.sprite(128, 0, 'mario_nes_tileset', 662, Cloud311);

	this.game.add.sprite(0, 32, 'mario_nes_tileset', 693, Cloud311);

	this.game.add.sprite(32, 32, 'mario_nes_tileset', 694, Cloud311);

	this.game.add.sprite(64, 0, 'mario_nes_tileset', 661, Cloud311);

	this.game.add.sprite(96, 0, 'mario_nes_tileset', 661, Cloud311);

	this.game.add.sprite(64, 32, 'mario_nes_tileset', 694, Cloud311);

	this.game.add.sprite(96, 32, 'mario_nes_tileset', 694, Cloud311);

	this.game.add.sprite(128, 32, 'mario_nes_tileset', 695, Cloud311);

	var hill = this.game.add.group(background);
	hill.position.setTo(0, 400);

	this.game.add.sprite(96, 96, 'mario_nes_tileset', 274, hill);

	this.game.add.sprite(0, 128, 'mario_nes_tileset', 272, hill);

	this.game.add.sprite(32, 96, 'mario_nes_tileset', 272, hill);

	this.game.add.sprite(64, 64, 'mario_nes_tileset', 273, hill);

	this.game.add.sprite(64, 96, 'mario_nes_tileset', 305, hill);

	this.game.add.sprite(32, 128, 'mario_nes_tileset', 305, hill);

	this.game.add.sprite(96, 128, 'mario_nes_tileset', 307, hill);

	this.game.add.sprite(64, 128, 'mario_nes_tileset', 306, hill);

	this.game.add.sprite(128, 128, 'mario_nes_tileset', 274, hill);

	var Cloud3 = this.game.add.group(background);
	Cloud3.position.setTo(512, 192);

	this.game.add.sprite(32, 0, 'mario_nes_tileset', 661, Cloud3);

	this.game.add.sprite(0, 0, 'mario_nes_tileset', 660, Cloud3);

	this.game.add.sprite(128, 0, 'mario_nes_tileset', 662, Cloud3);

	this.game.add.sprite(0, 32, 'mario_nes_tileset', 693, Cloud3);

	this.game.add.sprite(32, 32, 'mario_nes_tileset', 694, Cloud3);

	this.game.add.sprite(64, 0, 'mario_nes_tileset', 661, Cloud3);

	this.game.add.sprite(96, 0, 'mario_nes_tileset', 661, Cloud3);

	this.game.add.sprite(64, 32, 'mario_nes_tileset', 694, Cloud3);

	this.game.add.sprite(96, 32, 'mario_nes_tileset', 694, Cloud3);

	this.game.add.sprite(128, 32, 'mario_nes_tileset', 695, Cloud3);

	var Cloud31 = this.game.add.group(background);
	Cloud31.position.setTo(5057, 44);

	this.game.add.sprite(32, 0, 'mario_nes_tileset', 661, Cloud31);

	this.game.add.sprite(0, 0, 'mario_nes_tileset', 660, Cloud31);

	this.game.add.sprite(128, 0, 'mario_nes_tileset', 662, Cloud31);

	this.game.add.sprite(0, 32, 'mario_nes_tileset', 693, Cloud31);

	this.game.add.sprite(32, 32, 'mario_nes_tileset', 694, Cloud31);

	this.game.add.sprite(64, 0, 'mario_nes_tileset', 661, Cloud31);

	this.game.add.sprite(96, 0, 'mario_nes_tileset', 661, Cloud31);

	this.game.add.sprite(64, 32, 'mario_nes_tileset', 694, Cloud31);

	this.game.add.sprite(96, 32, 'mario_nes_tileset', 694, Cloud31);

	this.game.add.sprite(128, 32, 'mario_nes_tileset', 695, Cloud31);

	var Cloud1 = this.game.add.group(background);
	Cloud1.position.setTo(224, 272);

	this.game.add.sprite(32, 0, 'mario_nes_tileset', 661, Cloud1);

	this.game.add.sprite(0, 0, 'mario_nes_tileset', 660, Cloud1);

	this.game.add.sprite(64, 0, 'mario_nes_tileset', 662, Cloud1);

	this.game.add.sprite(0, 32, 'mario_nes_tileset', 693, Cloud1);

	this.game.add.sprite(32, 32, 'mario_nes_tileset', 694, Cloud1);

	this.game.add.sprite(64, 32, 'mario_nes_tileset', 695, Cloud1);

	var Cloud2 = this.game.add.group(background);
	Cloud2.position.setTo(2012, 211);

	this.game.add.sprite(32, 0, 'mario_nes_tileset', 661, Cloud2);

	this.game.add.sprite(0, 0, 'mario_nes_tileset', 660, Cloud2);

	this.game.add.sprite(96, 0, 'mario_nes_tileset', 662, Cloud2);

	this.game.add.sprite(0, 32, 'mario_nes_tileset', 693, Cloud2);

	this.game.add.sprite(32, 32, 'mario_nes_tileset', 694, Cloud2);

	this.game.add.sprite(64, 0, 'mario_nes_tileset', 661, Cloud2);

	this.game.add.sprite(64, 32, 'mario_nes_tileset', 694, Cloud2);

	this.game.add.sprite(96, 32, 'mario_nes_tileset', 695, Cloud2);

	var Cloud21 = this.game.add.group(background);
	Cloud21.position.setTo(3842, 125);

	this.game.add.sprite(32, 0, 'mario_nes_tileset', 661, Cloud21);

	this.game.add.sprite(0, 0, 'mario_nes_tileset', 660, Cloud21);

	this.game.add.sprite(96, 0, 'mario_nes_tileset', 662, Cloud21);

	this.game.add.sprite(0, 32, 'mario_nes_tileset', 693, Cloud21);

	this.game.add.sprite(32, 32, 'mario_nes_tileset', 694, Cloud21);

	this.game.add.sprite(64, 0, 'mario_nes_tileset', 661, Cloud21);

	this.game.add.sprite(64, 32, 'mario_nes_tileset', 694, Cloud21);

	this.game.add.sprite(96, 32, 'mario_nes_tileset', 695, Cloud21);

	var Cloud111 = this.game.add.group(background);
	Cloud111.position.setTo(3340, 236);

	this.game.add.sprite(32, 0, 'mario_nes_tileset', 661, Cloud111);

	this.game.add.sprite(0, 0, 'mario_nes_tileset', 660, Cloud111);

	this.game.add.sprite(64, 0, 'mario_nes_tileset', 662, Cloud111);

	this.game.add.sprite(0, 32, 'mario_nes_tileset', 693, Cloud111);

	this.game.add.sprite(32, 32, 'mario_nes_tileset', 694, Cloud111);

	this.game.add.sprite(64, 32, 'mario_nes_tileset', 695, Cloud111);

	var Cloud11 = this.game.add.group(background);
	Cloud11.position.setTo(1416, 160);

	this.game.add.sprite(32, 0, 'mario_nes_tileset', 661, Cloud11);

	this.game.add.sprite(0, 0, 'mario_nes_tileset', 660, Cloud11);

	this.game.add.sprite(64, 0, 'mario_nes_tileset', 662, Cloud11);

	this.game.add.sprite(0, 32, 'mario_nes_tileset', 693, Cloud11);

	this.game.add.sprite(32, 32, 'mario_nes_tileset', 694, Cloud11);

	this.game.add.sprite(64, 32, 'mario_nes_tileset', 695, Cloud11);

	var floor = this.game.add.physicsGroup(Phaser.Physics.ARCADE, this);

	this.game.add.tileSprite(-32, 96, 32, 464, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(5515, 386, 160, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(3936, 372, 1600, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(5664, 405, 960, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(5373, 542, 1280, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(5986, 417, 32, 320, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(6652, 542, 1000, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(9251, 542, 1600, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(10851, 542, 560, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(12214, 243, 300, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(12080, 398, 160, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(12214, 246, 32, 180, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(12565, 51, 160, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(12983, 243, 300, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(12980, 246, 32, 130, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(13520, 53, 565, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(13334, 86, 160, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(10047, 374, 260, 32, 'mario_nes_tileset', 894, floor);

	var water_floor = this.game.add.tileSprite(11453, 516, 4790, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(8378, 367, 260, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(7355, 369, 260, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(7654, 207, 740, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(8626, 210, 560, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(9354, 212, 650, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(7651, 542, 1600, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(13492, 71, 32, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(14211, 212, 380, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(14713, 49, 200, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(15279, 241, 200, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(15151, 308, 100, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(15248, 249, 32, 64, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(13704, 373, 160, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(13782, 212, 160, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(15490, 373, 100, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(11409, 527, 64, 32, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(4142, 293, 32, 16, 'mario_nes_tileset', 894, floor);

	this.game.add.tileSprite(16233, 517, 9000, 32, 'mario_nes_tileset', 894, floor);

	var walls = this.game.add.physicsGroup(Phaser.Physics.ARCADE, this);

	this.game.add.tileSprite(2425, 368, 32, 192, 'mario_nes_tileset', 1, walls);

	this.game.add.tileSprite(3680, 464, 128, 96, 'mario_nes_tileset', 1, walls);

	this.game.add.tileSprite(3808, 368, 128, 192, 'mario_nes_tileset', 1, walls);

	this.game.add.tileSprite(2224, 432, 32, 128, 'mario_nes_tileset', 1, walls);

	this.game.add.tileSprite(1736, 464, 32, 96, 'mario_nes_tileset', 1, walls);

	this.game.add.tileSprite(0, 560, 1920, 64, 'mario_nes_tileset', 0, walls);

	this.game.add.tileSprite(2020, 560, 1920, 64, 'mario_nes_tileset', 0, walls);

	this.game.add.tileSprite(18953, 389, 32, 128, 'mario_nes_tileset', 215, walls);

	this.game.add.tileSprite(18220, -155, 32, 512, 'mario_nes_tileset', 215, walls);

	this.game.add.tileSprite(19497, 453, 64, 64, 'mario_nes_tileset', 215, walls);

	this.game.add.tileSprite(18505, 485, 32, 32, 'mario_nes_tileset', 215, walls);

	this.game.add.tileSprite(18825, 389, 128, 32, 'mario_nes_tileset', 215, walls);

	this.game.add.tileSprite(19221, 296, 128, 32, 'mario_nes_tileset', 215, walls);

	this.game.add.tileSprite(946, 323, 160, 32, 'mario_nes_tileset', 1, walls);

	var elevators = this.game.add.physicsGroup(Phaser.Physics.ARCADE, this);

	var boss_elevator011 = this.game.add.tileSprite(23571, 516, 127, 500, 'rust_block', null, elevators);

	var boss_elevator012 = this.game.add.tileSprite(23990, 442, 127, 500, 'rust_block', null, elevators);

	var boss_elevator01 = this.game.add.tileSprite(22733, 516, 127, 500, 'rust_block', null, elevators);

	var blocking_objects = this.game.add.group(this);

	var pipe1 = this.game.add.group(blocking_objects);
	pipe1.position.setTo(3096, 464);

	this.game.add.sprite(32, 0, 'mario_nes_tileset', 265, pipe1);

	this.game.add.sprite(32, 32, 'mario_nes_tileset', 298, pipe1);

	this.game.add.sprite(0, 0, 'mario_nes_tileset', 264, pipe1);

	this.game.add.sprite(0, 32, 'mario_nes_tileset', 297, pipe1);

	this.game.add.sprite(0, 64, 'mario_nes_tileset', 297, pipe1);

	this.game.add.sprite(32, 64, 'mario_nes_tileset', 298, pipe1);

	var pipe = this.game.add.group(blocking_objects);
	pipe.position.setTo(1266, 464);

	this.game.add.sprite(32, 0, 'mario_nes_tileset', 265, pipe);

	this.game.add.sprite(32, 32, 'mario_nes_tileset', 298, pipe);

	this.game.add.sprite(0, 0, 'mario_nes_tileset', 264, pipe);

	this.game.add.sprite(0, 32, 'mario_nes_tileset', 297, pipe);

	this.game.add.sprite(0, 64, 'mario_nes_tileset', 297, pipe);

	this.game.add.sprite(32, 64, 'mario_nes_tileset', 298, pipe);

	var player = this.game.add.sprite(23013, 318, 'mario_nes_small', 1, this);
	player.anchor.setTo(0.5, 0.5);
	player.animations.add('walk', [0, 1, 2], 10, true);
	player.animations.add('jump', [4], 30, false);
	player.animations.add('stay', [1], 60, false);
	player.animations.add('die', [5], 60, false);
	this.game.physics.arcade.enable(player);

	var enemies = this.game.add.group(this);

	var bullets = this.game.add.group(this);

	var triggers_invis = this.game.add.physicsGroup(Phaser.Physics.ARCADE, this);

	var enemy_spawn_trigger_1 = this.game.add.tileSprite(1075, 493, 64, 64, 'mario_nes_tileset', 894, triggers_invis);

	var floor_fall_trigger = this.game.add.tileSprite(1905, 567, 128, 64, 'mario_nes_tileset', 894, triggers_invis);

	var triggers_walker_enemy = this.game.add.group(this);

	var walker_enemy_trigger1 = this.game.add.tileSprite(6600, 542, 32, 64, 'mario_nes_tileset', 651, triggers_walker_enemy);
	walker_enemy_trigger1.anchor.setTo(0.5, 1.0);

	var walker_enemy_trigger2 = this.game.add.tileSprite(5939, 405, 32, 64, 'mario_nes_tileset', 651, triggers_walker_enemy);
	walker_enemy_trigger2.anchor.setTo(0.5, 1.0);

	var walker_enemy_trigger3 = this.game.add.tileSprite(2850, 560, 32, 64, 'mario_nes_tileset', 651, triggers_walker_enemy);
	walker_enemy_trigger3.anchor.setTo(0.5, 1.0);

	var walker_enemy_trigger31 = this.game.add.tileSprite(1640, 560, 32, 64, 'mario_nes_tileset', 651, triggers_walker_enemy);
	walker_enemy_trigger31.anchor.setTo(0.5, 1.0);

	var walker_enemy_trigger11 = this.game.add.tileSprite(8130, 207, 32, 64, 'mario_nes_tileset', 651, triggers_walker_enemy);
	walker_enemy_trigger11.anchor.setTo(0.5, 1.0);

	var walker_enemy_trigger111 = this.game.add.tileSprite(8922, 542, 32, 64, 'mario_nes_tileset', 651, triggers_walker_enemy);
	walker_enemy_trigger111.anchor.setTo(0.5, 1.0);

	var walker_enemy_trigger12 = this.game.add.tileSprite(9919, 212, 32, 64, 'mario_nes_tileset', 651, triggers_walker_enemy);
	walker_enemy_trigger12.anchor.setTo(0.5, 1.0);

	var walker_enemy_trigger121 = this.game.add.tileSprite(12487, 243, 32, 64, 'mario_nes_tileset', 651, triggers_walker_enemy);
	walker_enemy_trigger121.anchor.setTo(0.5, 1.0);

	var walker_enemy_trigger1211 = this.game.add.tileSprite(14014, 53, 32, 64, 'mario_nes_tileset', 651, triggers_walker_enemy);
	walker_enemy_trigger1211.anchor.setTo(0.5, 1.0);

	var walker_enemy_trigger12111 = this.game.add.tileSprite(14465, 516, 32, 64, 'mario_nes_tileset', 651, triggers_walker_enemy);
	walker_enemy_trigger12111.anchor.setTo(0.5, 1.0);

	var walker_enemy_trigger121111 = this.game.add.tileSprite(15666, 516, 32, 64, 'mario_nes_tileset', 651, triggers_walker_enemy);
	walker_enemy_trigger121111.anchor.setTo(0.5, 1.0);

	var walker_enemy_trigger4 = this.game.add.tileSprite(4398, 372, 32, 64, 'mario_nes_tileset', 651, triggers_walker_enemy);
	walker_enemy_trigger4.anchor.setTo(0.5, 1.0);

	var walker_enemy_trigger112 = this.game.add.tileSprite(8506, 542, 32, 64, 'mario_nes_tileset', 651, triggers_walker_enemy);
	walker_enemy_trigger112.anchor.setTo(0.5, 1.0);

	var walker_enemy_trigger1121 = this.game.add.tileSprite(9768, 542, 32, 64, 'mario_nes_tileset', 651, triggers_walker_enemy);
	walker_enemy_trigger1121.anchor.setTo(0.5, 1.0);

	var walker_enemy_trigger32 = this.game.add.tileSprite(3514, 560, 32, 64, 'mario_nes_tileset', 651, triggers_walker_enemy);
	walker_enemy_trigger32.anchor.setTo(0.5, 1.0);

	var walker_enemy_trigger33 = this.game.add.tileSprite(3394, 560, 32, 64, 'mario_nes_tileset', 651, triggers_walker_enemy);
	walker_enemy_trigger33.anchor.setTo(0.5, 1.0);

	var walker_enemy_trigger = this.game.add.tileSprite(5168, 372, 32, 64, 'mario_nes_tileset', 651, triggers_walker_enemy);
	walker_enemy_trigger.anchor.setTo(0.5, 1.0);

	var walker_enemy_trigger1211111 = this.game.add.tileSprite(15453, 241, 32, 64, 'mario_nes_tileset', 651, triggers_walker_enemy);
	walker_enemy_trigger1211111.anchor.setTo(0.5, 1.0);

	var walker_enemy_trigger331 = this.game.add.tileSprite(3571, 560, 32, 64, 'mario_nes_tileset', 651, triggers_walker_enemy);
	walker_enemy_trigger331.anchor.setTo(0.5, 1.0);

	var triggers_shooter_enemy = this.game.add.group(this);

	this.game.add.tileSprite(3224, -145, 64, 64, 'mario_nes_tileset', 247, triggers_shooter_enemy);

	this.game.add.tileSprite(7245, -11, 64, 64, 'mario_nes_tileset', 247, triggers_shooter_enemy);

	this.game.add.tileSprite(2761, -202, 64, 64, 'mario_nes_tileset', 247, triggers_shooter_enemy);

	this.game.add.tileSprite(12904, -69, 64, 64, 'mario_nes_tileset', 247, triggers_shooter_enemy);

	this.game.add.tileSprite(14726, -142, 64, 64, 'mario_nes_tileset', 247, triggers_shooter_enemy);

	this.game.add.tileSprite(9410, -105, 64, 64, 'mario_nes_tileset', 247, triggers_shooter_enemy);

	var EmitterGroupWorld = this.game.add.group(this);

	var EmitterGroup = this.game.add.group(this);

	var triggers = this.game.add.physicsGroup(Phaser.Physics.ARCADE, this);

	var gun_machinegun = this.game.add.sprite(848, 560, 'gun_machinegun', null, triggers);
	gun_machinegun.scale.setTo(0.5, 0.5);
	gun_machinegun.anchor.setTo(0.5, 1.0);

	var gun_rocket = this.game.add.sprite(3128, 464, 'gun_rocket', null, triggers);
	gun_rocket.scale.setTo(0.4, 0.4);
	gun_rocket.anchor.setTo(0.5, 1.0);

	var gun_laser = this.game.add.sprite(6051, 537, 'gun_laser', 0, triggers);
	gun_laser.scale.setTo(0.7, 0.7);
	gun_laser.anchor.setTo(0.5, 1.0);

	var gun_tesla = this.game.add.sprite(13104, 243, 'gun_tesla', null, triggers);
	gun_tesla.scale.setTo(2.0, 2.0);
	gun_tesla.anchor.setTo(0.5, 1.0);

	var first_block_trigger = this.game.add.sprite(496, 384, 'mario_nes_tileset', 24, triggers);

	var foreground = this.game.add.group(this);

	var metalslug_fg = this.game.add.sprite(3935, -713, 'metalslug_fg', null, foreground);
	metalslug_fg.scale.setTo(4.0, 4.0);

	var UI = this.game.add.group(this);

	 // public fields

	this.fWater_temple = water_temple;
	this.fWater_temple_outside = water_temple_outside;
	this.fFactory = factory;
	this.fFloor = floor;
	this.fWater_floor = water_floor;
	this.fWalls = walls;
	this.fElevators = elevators;
	this.fBoss_elevator011 = boss_elevator011;
	this.fBoss_elevator012 = boss_elevator012;
	this.fBoss_elevator01 = boss_elevator01;
	this.fBlocking_objects = blocking_objects;
	this.fPlayer = player;
	this.fEnemies = enemies;
	this.fBullets = bullets;
	this.fTriggers_invis = triggers_invis;
	this.fEnemy_spawn_trigger_1 = enemy_spawn_trigger_1;
	this.fFloor_fall_trigger = floor_fall_trigger;
	this.fTriggers_walker_enemy = triggers_walker_enemy;
	this.fTriggers_shooter_enemy = triggers_shooter_enemy;
	this.fEmitterGroupWorld = EmitterGroupWorld;
	this.fEmitterGroup = EmitterGroup;
	this.fTriggers = triggers;
	this.fGun_machinegun = gun_machinegun;
	this.fGun_rocket = gun_rocket;
	this.fGun_laser = gun_laser;
	this.fGun_tesla = gun_tesla;
	this.fFirst_block_trigger = first_block_trigger;
	this.fUI = UI;

	/* --- post-init-begin --- */

	// you can insert code here

	/* --- post-init-end --- */
}

/** @type Phaser.Group */
var Scene2_proto = Object.create(Phaser.Group.prototype);
Scene2.prototype = Scene2_proto;
Scene2.prototype.constructor = Phaser.Group;

/* --- end generated code --- */

// you can insert code here

