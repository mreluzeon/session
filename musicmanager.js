const p = require("audio-play");
const l = require("audio-loader");

function play(path, cb) {
	l(path).then(audio => {
		cb(p(audio));
	});
}

function pause(playback, cb) {
	playback.pause();
	cb(playback);
}

function change(path, playback, cb) {
	playback.pause();
	play(path, cb);
}

module.exports = {
	play, pause, change
};