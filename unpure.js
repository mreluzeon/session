// print = process.stdout.write;

const utils = require('./utils.js');

function printGameMap({map}){
//    console.log(print, map);
    map.forEach(row => {
	row.split('').forEach(i => {
	    switch (i) {
	    case '#':
		process.stdout.write(utils.wall);
		break;
	    case '.':
		process.stdout.write(utils.empty);
		break;
	    default:
		process.stdout.write('shit!');
	    }});
	process.stdout.write('\n');
    });
}

module.exports = {
    printGameMap
};