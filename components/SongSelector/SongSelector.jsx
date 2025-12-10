import './SongSelector.css';

const SongSelector = ({ songs, selectedSong, onSongSelect }) => {
  return (
    <div className="song-selector-container">
      {songs.map(song => (
        <div 
          key={song.song_id} 
          className={`song-card ${selectedSong.song_id === song.song_id ? 'active' : ''}`}
          onClick={() => onSongSelect(song.song_id)}
        >
          <div className="music-icon">🎵</div> {/* Placeholder за икона */}
          <h3 className="song-title">{song.title}</h3>
          <p className="song-artist">{song.artist}</p>
        </div>
      ))}
    </div>
  );
};

export default SongSelector;