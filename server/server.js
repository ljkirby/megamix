"use strict"    

const port = process.env.PORT || 3000;
const mainTrack = process.env.MT_DIR || "dev_sound/main.wav";
const currentTrack = process.env.CT_DIR || "dev_sound/current.wav";
const mixTrack = process.env.MIX_DIR || "dev_sound/mix.wav";
const downloadTrack = process.env.DL_DIR || "dev_sound/download.wav";
const tempTrack = process.env.TT_DIR || "dev_sound/temp.wav";
const archiveDirectory = process.env.ARC_DIR || "archive/";

//Your app is a noodle

var express = require('express')
var sox = require('sox-audio')
var fs = require('fs')
var multer = require('multer');
var upload = multer();
var { Duplex } = require('stream');
var noodle = express();
noodle.use(express.json());

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
 
command.on('end', function() { console.log('Sox command succeeded!');
});

//Run your command when ready
command.run();	

//Main site response (website here)
noodle.get('/', (req, res) => res.sendfile('index.html'));


//Get recoding to play
noodle.get('/play',
    function(req, res){
        console.log("Sending out play request");
        res.type("audio/wav");
        //Add function for download Track//
        let mainTrackStream = fs.createReadStream(mainTrack);
        mainTrackStream.pipe(res);
    });

noodle.post('/test', (req, res) => {
  console.log(req);
  console.log(req.body);
  console.log(req.data);
});

//Posting a sequence recording
//noodle.post('/seqrec', upload.single('soundBlob'),
noodle.post('/seqrec', 
    async (req, res) => {
        try {
            //Copy main to temp
            console.log("========TRIGGERED======");
          console.log(req);

            fs.writeFileSync(currentTrack, Buffer.from(new Uint8Array(req.data)));
            await fs.createReadStream(mainTrack).pipe(fs.createWriteStream(tempTrack));
            let concatCommand = sox();
            concatCommand.input(tempTrack);
            concatCommand.input(shortTrack); //runs but breaks without proper recording
            concatCommand.concat();
            concatCommand.output(mainTrack);
            concatCommand.on('prepare', function(args) {
              console.log('Preparing sox command with args ' + args.join(' '));
            });
             
            concatCommand.on('start', function(commandLine) {
              console.log('Spawned sox with command ' + commandLine);
            });
             
            concatCommand.on('progress', function(progress) {
              console.log('Processing progress: ', progress);
            });
             
            concatCommand.on('error', function(err, stdout, stderr) {
              console.log('Cannot process audio: ' + err.message);
              console.log('Sox Command Stdout: ', stdout);
              console.log('Sox Command Stderr: ', stderr)
            });
             
            concatCommand.on('end', function() { console.log('Sox command succeeded!');
            });
            concatCommand.run();
            await fs.createReadStream(currentTrack).pipe(fs.createWriteStream(shortTrack));
            res.send("Your recording has been submitted!");
            console.log("Sequence Recording Recieved!");
        } catch (err) {
            console.log(err);
        }
    });

//Posting a mix recording
noodle.post('/mixrec', 
    async (req, res) => {
        try {
            //Copy main to temp
            fs.writeFileSync(currentTrack, Buffer.from(new Uint8Array(req.file.buffer)));
            await fs.createReadStream(shortTrack).pipe(fs.createWriteStream(tempTrack));
            let mixCommand = sox();
            mixCommand.input(tempTrack);
            mixCommand.input(currentTrack);
            mixCommand.combine('mix');
            mixCommand.output(shortTrack);
            mixCommand.on('prepare', function(args) {
              console.log('Preparing sox command with args ' + args.join(' '));
            });
             
            mixCommand.on('start', function(commandLine) {
              console.log('Spawned sox with command ' + commandLine);
            });
             
            mixCommand.on('progress', function(progress) {
              console.log('Processing progress: ', progress);
            });
             
            mixCommand.on('error', function(err, stdout, stderr) {
              console.log('Cannot process audio: ' + err.message);
              console.log('Sox Command Stdout: ', stdout);
              console.log('Sox Command Stderr: ', stderr)
            });
             
            mixCommand.on('end', function() { console.log('Sox command succeeded!');
            });
            mixCommand.run();
            res.send("Your recording has been submitted!");
            console.log("Sequence Recording Recieved!");
        } catch (err) {
            console.log(err);
        }
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
        
