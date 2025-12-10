import { CHORD_POSITIONS } from '@/lib/constants'; 
import Fretboard from '../Fretboard/Fretboard';
import './ChordDisplay.css';

const ChordDisplay = ({ chordName, currentText }) => {
    if (!chordName) {
      return (
        <div className="chord-container">
          <p className="placeholder-text">Choose a song and press Play.</p>
        </div>
      );
    }

    const positions = CHORD_POSITIONS[chordName] || [];

    return (
      <div className="chord-container"> 
        <h1 className="current-chord-name">
          {chordName}
        </h1>

        <Fretboard positions={positions} /> 

        <p className="current-lyric-text">
          {currentText}
        </p>
      </div>
    );
};

export default ChordDisplay;