"use strict"

const port = process.env.PORT || 3000;
const mainTrack = process.env.MT_DIR || "dev_sound/main.wav";
const currentTrack = process.env.CT_DIR || "dev_sound/current.wav";
const tempTrack = process.env.TT_DIR || "dev_sound/temp.wav";
const archiveDirectory = process.env.ARC_DIR || "archive/";

//Your app is a noodle

var express = require('express')
var sox = require('sox-audio')
var fs = require('fs')
var noodle = express()

//Creating a sox command
var command = sox();
command.input(mainTrack);
command.input(currentTrack);	
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
 
command.on('end', function() { console.log('Sox command succeeded!');
});

//Run your command when ready
command.run();	

//Main site response (website here)
noodle.get('/', (req, res) => res.send('TEST ME AHHHH'));


//Get recoding to play
noodle.get('/play',
    function(req, res){
        console.log("Sending out play request");
        res.send("Here's your music!");
    });

//Posting a sequence recording
noodle.post('/seqrec',
    (req, res) => {

        //var concatCommand = sox();
        //concatCommand(mainTrack);
        //concatCommand.concat();
        //concatCommand.(currentTrack);
        //saveFile(req,res,currentTrack);
        console.log("Sequence Recording Recieved!");

    });

//Posting a mix recording
noodle.post('/mixrec', 
    function(req, res){
        console.log("Mixed Recording Recieved!");
    });

//Server Goes Live
noodle.listen(port, () => console.log(`Your noodle is live ${port}`));

function saveFile(req, res, filePath){
    var blob = '';
    
    req.on('data', function(data){
        blob += data;
    });

    req.on('end', function(){
        //Append old song file
        
        //Save new song file
        fs.writeFile(filePath, blob, (err) =>{
          if(err) throw err;
          console.log('New Recording Saved!');
        });
    });
};
        
