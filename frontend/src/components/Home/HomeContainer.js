import React from 'react';
import HomeView from './HomeView.js';
import wavFile from '../../assets/output.wav';
import Recorder from 'recorder-js';

const recordModes = {
  APPEND: 'append', 
  MODIFY: 'modify', 
};


const audioContext = new (window.AudioContext || window.webkitAudioContext)();

export default class HomeContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      song: new Audio(wavFile), 
      playing: false, 
      recording: false, 
      recordedAudio: '',
      recorder: new Recorder(audioContext),
      recordMode: recordModes.APPEND, 
      err: false,
    }
  };

  async componentDidMount() {
    try {
      let permission = await navigator.mediaDevices.getUserMedia({audio:true});
      this.state.recorder.init(permission);
      await this.getSong();
    } catch(err) {
      console.log(err);
    }
  }

  getSong = async () => {
    try {
      let song; //= await GET /song
      /*
       * song = new Audio(song);
      this.setState({
        ...this.state, 
        song,
      });
      */
    } catch(err) {
      this.setState({
        ...this.state, 
        err: true,
      });
      console.log(err);
    }
  }

  playSong = () => {
    const { err, song } = this.state;
    if(err || song === '') {
      console.log("ERROR PLAYING SONG");
      return;
    } 
    else {
      this.setState({ playing: true });
      console.log(this.state.song);
      this.state.song.play();
    }
  }

  stopSong = async () => {
    this.setState({ playing: false });
    this.state.song.pause();
  }

  startRecording = async () => {
    try {
      await this.state.recorder.start();
      this.setState({ recording: true });
      console.log("RECORDING");
    } catch(err) {
      console.log(err);
    }
  }

  stopRecording = async () => {
    try {
      const { recorder } = this.state;
      let {blob, buffer} = await recorder.stop();
      this.setState({ 
        recording: false, 
        recordedAudioBuffer: buffer,
        recordedAudioBlob: blob,
      });
      console.log(this.state.recordedAudioBuffer);
      console.log("STOP RECORDING");
      Recorder.download(blob, 'recording');
      /*
      this.state.recordedAudio.play();
      let recordedFile = new Audio(blob);
      recordedFile.play();
      */
    } catch(err) {
      console.log(err);
    }
  }

  saveRecording = (data) => {

    this.setState({recordedAudio: new Audio(data)});
    this.state.recordedAudio.play();
  }

  render() {
    const { playing, recording } = this.state;

    return (
      <HomeView 
        playing={playing}
        playSong={this.playSong}
        stopSong={this.stopSong}
        recording={recording}
        startRecording={this.startRecording}
        stopRecording={this.stopRecording}
        saveRecording={this.saveRecording}
      />
    );
  }
}
