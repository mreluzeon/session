var exec = require('child_process').exec;

const utils = require('./utils.js');

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function printGameMap(map){
//    console.log(map.map);
    map.map.forEach(row => {
	row.split('').forEach(i => {
	    switch (i) {
	    case '#':
		process.stdout.write(utils.wall);
		break;
	    case '.':
		process.stdout.write(utils.empty);
		break;
	    default:
		process.stdout.write(i);
	    }});
	process.stdout.write('\n');
    });
}

function printCheatsheets(cheatsheets){
    for (let i in cheatsheets) {
	process.stdin.write(`\n${i}: ${cheatsheets[i]}`);
    }
}

function getQuestion(questions){
    let rndindex = Math.floor(Math.random() * questions.length);
    return questions[rndindex];
}

module.exports = {
    printGameMap, printCheatsheets, shuffle, getQuestion
};
