'use strict';

const readline = require('readline');
const play = require('audio-play');
const load = require('audio-loader');

const utils = require('./utils.js');
const unpure = require('./unpure.js');
const gameMaps = require('./map.json');
const musicManager = require('./musicmanager.js');
const definitions = require('./definitions.json');

// state

let time = 0; // in minutes = seconds
let currentMusic;

let keyWasPressed = false;

let player = {
    x: 10,
    y: 5,
    cheatsheets: {
	logic: 4,
	math: 0,
	language: 0
    },
    map: 'debug',
    hp: 1,
    money: 1,
    studentReputation: 2,
    teacherReputation: 3,
    knowledge: 4
};

// students :: [{want: string, x: int, y: int, map: string, exp: int}]
let students = [{
    want: "logic",
    x: 3, y: 3,
    map: "debug",
    exp: 100*4
}];

let action = {
    message: "",
    command: ""
};

function musicChangeCallback(data) {
	currentMusic = data;
}

function exec(command) {
    let parsedCommand = command.split(/ /);
    if (parsedCommand[0] == 'load') {
	musicManager.change(`./music/${parsedCommand[1]}.wav`, currentMusic, musicChangeCallback)
	process.stdout.write('\x1bc\x1b[?25l');
	player.map = parsedCommand[1];
	player.x = gameMaps[parsedCommand[1]].init.x;
	player.y = gameMaps[parsedCommand[1]].init.y;
    } else if (parsedCommand[0] == 'give') {
	if (player.cheatsheets[parsedCommand[1]] > 0 && player.money < 5) {
	    player.cheatsheets[parsedCommand[1]]--;
	    player.money++;
	}
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
	case 'e':
	    if (action.message != "") {
			action.message = "";
			exec(action.command);
			action.command = "";
	    }
	    break;
	case 'r':
		if (player.map == "library" && player.knowledge < definitions.maxKnowledge) {
			time += definitions.timeInLibrary;
			++player.knowledge;
		}
		break;
	case 'i':
		if (player.map == "library" && player.knowledge >= definitions.cheatsheetCost) {
			player.knowledge -= definitions.cheatsheetCost;
			++player.cheatsheets.logic;
		}
		break;
	case 'o':
		if (player.map == "library" && player.knowledge >= definitions.cheatsheetCost) {
			player.knowledge -= definitions.cheatsheetCost;
			++player.cheatsheets.math;
		}
		break;
	case 'p':
		if (player.map == "library" && player.knowledge >= definitions.cheatsheetCost) {
			player.knowledge -= definitions.cheatsheetCost;
			++player.cheatsheets.language;
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
    });

    let isAny = false;    
    students.forEach(({x, y, want, map}) => {
	if (player.map == map && x == player.x && y == player.y) {
	    action.message = "Press [e] to give a shpora about " + want;
	    action.command = "give " + want;
	    isAny = true;
	}
    })
    if (!isAny) {
	action.message = "";
	action.command = "";
    }
});

// gameloop

musicManager.play('./music/debug.wav', musicChangeCallback);

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
    process.stdout.write(`\nteacher reputation: ${utils.showRep(player.teacherReputation)}\n`);
    // Knowledge
    process.stdout.write(`knowledge: ${utils.showKnowledge(player.knowledge)}`);

    unpure.printCheatsheets(player.cheatsheets);

    process.stdout.write("\n\x1b[K"+action.message);
    
    // Updating students
    students.forEach(i => {
	i.exp--;
	if (player.map == i.map) {
	    process.stdout.write(`\x1b[${i.y+1};${i.x+1}H${utils.student}`);
	}
    });
    students = students.filter(i => i.exp > 0);
    

    // Print the teacher (if one exists)
    if (gameMaps[player.map].hasOwnProperty("teacher")) {
    	const teacher = gameMaps[player.map].teacher;
    	process.stdout.write(`\x1b[${teacher.y+1};${teacher.x+2}H\b`);
    	process.stdout.write(`${utils.teachers[teacher.subject]}`);
    }
    
    // Print the player
    process.stdout.write(`\x1b[${player.y+1};${player.x+2}H\b${utils.player}`);
    
    // Reset keypress
    keyWasPressed = false;
    
}, 250)
