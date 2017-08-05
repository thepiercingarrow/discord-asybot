const fs = require('fs');
const { exec } = require('child_process');

var Discord = require('discord.io');

var config = require('../config.json');

var bot = new Discord.Client({
    token: config.token,
    autorun: true
});

bot.on('ready', function() {
    console.log('ID: ' + bot.id);
});

bot.on('message', function(user, uid, cid, m, e) {
    if (m.substring(0,4) == 'asy/') {
	var path = Math.random().toString().substring(2);
	fs.writeFile(path + '.asy', m.substring(4), err => {
	    if (err) { console.log(err); return; }
	    renderAsy(path, cid);
	});
    }
    else if (m.substring(0,7) == 'asyurl/') {
	var path = Math.random().toString().substring(2);
	exec('curl -o \'' + path + '.asy\' ' + m.substring(7), (err, stdout, stderr) => {
	    if (err) { console.log(err); return; }
	    renderAsy(path, cid);
	});
    }
});

function renderAsy(path, cid) {
    exec('asy ' + path + '.asy -f png', (err, stdout, stderr) => {
	if (err) { console.log(err); return; }
	bot.uploadFile({
	    to: cid,
	    file: path + '.png'
	});
	fs.unlink(path + '.asy', (err) => {
	    if (err) { console.log(err); }
	});
	fs.unlink(path + '.png', (err) => {
	    if (err) { console.log(err); }
	});
    });
}

bot.on('disconnect', function(emsg, ecode) {
    console.log('reconnecting...');
    bot.connect();
});
