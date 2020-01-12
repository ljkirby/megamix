"use strict"

const port = process.env.PORT || 3000;
const { delimiter } = require('path');
const paths = process.env.PATH.split(delimiter);
paths.push("/c/Users/Zachary/Downloads/sox-14.4.2-win32_v2/sox-14.4.2/sox");
process.env.PATH = paths.join(delimiter);

//Your app is a noodle

var express = require('express')
var sox = require('sox-audio')
var fs = require('fs')
var noodle = express()

//Creating a sox command
var command = sox();
command.input('dev_sound/testy1.wav');
command.input('dev_sound/testy2.wav');	
command.output('dev_sound/output.wav');
command.combine('mix');

command.on('prepare', function(args) {
  console.log('Preparing sox command with args ' + args.join(' '));
});
 
command.on('start', function(commandLine) {
  console.log('Spawned sox with command ' + commandLine);
});
 
command.on('progress', function(progress) {
  console.log('Processing progress: ', progress);
});
 
command.on('error', function(err, stdout, stderr) {
  console.log('Cannot process audio: ' + err.message);
  console.log('Sox Command Stdout: ', stdout);
  console.log('Sox Command Stderr: ', stderr)
});
 
command.on('end', function() {
  console.log('Sox command succeeded!');
});

//Run your command when ready
command.run();	

noodle.get('/', (req, res) => res.send('TEST ME AHHHH'));

noodle.listen(port, () => console.log(`Your noodle is live ${port}`))


