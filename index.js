'use strict';

const readline = require('readline');
const play = require('audio-play');
const load = require('audio-loader');

const utils = require('./utils.js');
const unpure = require('./unpure.js');
const gameMaps = require('./map.json');

// state

let time = 0; // in minutes = seconds

let keyWasPressed = false;

let player = {
    x: 10,
    y: 5,
    cheatsheets: [],
    map: 'debug',
    hp: 1,
    money: 1,
    studentReputation: 2,
    teacherReputation: 3,
    knowledge: 4
};

// actions :: [{button: string, action: string}] 
let actions = [];

function exec(command) {
    let parsedCommand = command.split(/ /);
    if (parsedCommand[0] == 'load') {
	process.stdout.write('\x1bc\x1b[?25l');
	player.map = parsedCommand[1];
	player.x = gameMaps[parsedCommand[1]].init.x;
	player.y = gameMaps[parsedCommand[1]].init.y;
    }
}

// key reader

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
    let currentMap = gameMaps[player.map];
    if (!keyWasPressed) {
	switch (key.sequence) {
	case 'q':
	    // Show the cursor
	    process.stdout.write('\x1b[?25h');
	    process.exit();
	    break;
	case 'w':
	    player.y--;
	    if (currentMap.map[player.y][player.x] == "#") {
		player.y++;
	    }
	    break;
	case 's':
	    player.y++;
	    if (currentMap.map[player.y][player.x] == "#") {
		player.y--;
	    }
	    break;
	case 'a':
	    player.x--;
	    if (currentMap.map[player.y][player.x] == "#") {
		player.x++;
	    }
	    break;
	case 'd':
	    player.x++;
	    if (currentMap.map[player.y][player.x] == "#") {
		player.x--;
	    }
	    break;
	}
	// Now, the player can't press a key
	keyWasPressed = true;
    }

    currentMap.triggers.forEach(({x, y, command}) => {
    	if (x == player.x && y == player.y) {
	    exec(command);
    	}
    })    
});

// gameloop

process.stdout.write('\x1bc\x1b[?25l');

// A PART OF STATE
var interval = setInterval(() => {
    time += 0.25;

    // "Clear" the screen
    process.stdout.write('\x1b[0;0H');
    // process.stdout.write(`\x1b[0;0H\b${utils.player}`);
    // Print the map
    
    unpure.printGameMap(gameMaps[player.map]);

    // Print Game Information
    process.stdout.write('\n');
    // (x;y) of player
    process.stdout.write(`\x1b[Kx: ${player.x}; y: ${player.y}\n`);
    // Time
    process.stdout.write(`time: ${utils.showTime(time)} `);
    // HP
    process.stdout.write(`hp: ${utils.showHP(player.hp)}\n`);
    // Money 
    process.stdout.write(`money: ${utils.showMoney(player.money)}`);
    // Reputation
    process.stdout.write(`\nstudent reputation: ${utils.showRep(player.studentReputation)} `);
    process.stdout.write(`teacher reputation: ${utils.showRep(player.teacherReputation)}\n`);
    // Knowledge
    process.stdout.write(`knowledge: ${utils.showKnowledge(player.knowledge)}`);
    
    // Print the player
    process.stdout.write(`\x1b[${player.y+1};${player.x+2}H\b${utils.player}`);

    // Reset keypress
    keyWasPressed = false;
    
}, 250)
