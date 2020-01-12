import React from 'react';
import HomeStyle from './HomeStyle.css';
import {ReactMic} from '@cleandersonlobo/react-mic';
import {IconButton} from '@material-ui/core';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import MicNoneIcon from '@material-ui/icons/MicNone';
import MicIcon from '@material-ui/icons/Mic';

/*
 * Receives as props: 
 *  - playSong
 *  - recordSong
 */

const styles = {
  icon: {
    width: 200, 
    height: 200
  },
};

class HomeView extends React.Component {
  render() {
    const { 
      playing, 
      recording, 
      startRecording,
      stopRecording,
      saveRecording
    } = this.props;

    return (
      <div id="homeContainer">
        <div className="item">
          { !playing &&
          <IconButton
            iconStyle={styles.icon}
            onClick={this.props.playSong}
            className="iconButton"
          >
            <PlayCircleOutlineIcon 
              className="button" 
              id="playButton"
            />
          </IconButton>
          }
          { playing &&
          <IconButton
            iconStyle={styles.icon}
            onClick={this.props.stopSong}
            className="iconButton"
          >
            <PauseCircleOutlineIcon
              className="button" 
              id="pauseButton"
            />
          </IconButton>
          }
        </div>
        <div className="item">
          <IconButton 
            className="iconButton" 
            onClick={this.props.startRecording}
          >
              <MicNoneIcon 
                className="button"
                id="micOffButton"
              />
            </IconButton>
        </div>
        <div className="break"></div>
        <div className="item">
          <IconButton 
            className="iconButton" 
            onClick={this.props.stopRecording}
          >
              <MicNoneIcon 
                className="button"
                id="micOffButton"
              />
            </IconButton>
        </div>
      </div>
    );
  }
}


export default HomeView;


/*
 *
        <div className="break"></div>
        <div id="reactMic" className="item">
          <ReactMic 
            record={recording}
            onStop={stopRecording}
            onData={saveRecording}
            mimeType='audio/mp3'
          />
        </div>
 *
 * */
