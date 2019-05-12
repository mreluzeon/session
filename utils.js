'use strict';
const colors = require('colors/safe');
const {maxHP, maxMoney, maxRep, maxKnowledge, cheatsheetCost, timeInLibrary} = require('./definitions.json');

const player = colors.cyan("@");
const wall = colors.gray("#");
const teachers = {
	logic: colors.blue("&"),
	math: colors.red("&"),
	language: colors.green("&")
};

const empty = ".";
const student = colors.magenta("$");

function showTime(time){
    return `${("0"+Math.floor(time/60)).substr(-2)}:`
         + `${("0"+Math.floor(time%60)).substr(-2)}`;
}

function show(maxwhat){
    return q => `[${("#".repeat(q)+"-".repeat(maxwhat-q))}]`;
}

const showHP = show(maxHP);
const showMoney = show(maxMoney);
const showRep = show(maxRep);
const showKnowledge = show(maxKnowledge);

module.exports = {
    player, teachers, wall, empty, showTime, showHP, showMoney, showRep, showKnowledge, student
};
