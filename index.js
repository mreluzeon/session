'use strict';

const readline = require('readline');

const utils = require('./utils.js');
const unpure = require('./unpure.js');
const mapImport = require('./map.json');

// state

let player = {
    x: 2,
    y: 2,
    cheatsheets: 0
}

let gameMap = mapImport;

// gameloop

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const print = process.stdout.write;

//console.log(gameMap);

process.stdout.write('\x1bc\x1b[?25l');
unpure.printGameMap(gameMap);

process.stdin.on('keypress', (str, key) => {
    switch (key.sequence) {
    case 'q':
	process.stdout.write('\x1b[?25h');
	process.exit();
	break;
    case 'w':
	player.y--;
	break;
    case 's':
	player.y++;
	break;
    case 'a':
	player.x--;
	break;
    case 'd':
	player.x++;
	break;
    }

    process.stdout.write('\x1bc');
    unpure.printGameMap(gameMap);
    process.stdout.write('\x1b[' + player.y + ';' + player.x + 'H\b' + utils.player);

});
