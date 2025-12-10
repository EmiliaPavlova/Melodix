import { useState, useRef, useEffect, useCallback } from 'react';
import './PlayerControls.css';

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const paddedSecs = secs < 10 ? `0${secs}` : secs;
    return `${minutes}:${paddedSecs}`;
};

const PlayerControls = ({
  isPlaying,
  onTogglePlay,
  onSeek,
  onRefresh,
  currentProgress,
  currentTime,
  duration
}) => {
  const [isSeeking, setIsSeeking] = useState(false);
  const progressBarRef = useRef(null);

  const formattedCurrentTime = formatTime(currentTime);
  const formattedDuration = formatTime(duration);

  const handleSeek = useCallback((e) => {
    if (duration === 0 || !progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;

    const newProgress = Math.max(0, Math.min(1, offsetX / rect.width));
    const newTime = duration * newProgress;

    onSeek(newTime);
  }, [duration, onSeek]);

  const handleMouseDown = (e) => {
    if (duration > 0) {
      setIsSeeking(true);
      handleSeek(e); 
    }
  };

  useEffect(() => {
    const handleDragging = (e) => {
        if (isSeeking) {
            handleSeek(e);
        }
    };

    const handleMouseUp = () => {
        if (isSeeking) {
            setIsSeeking(false);
        }
    };

    if (isSeeking) {
        window.addEventListener('mousemove', handleDragging);
        window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
        window.removeEventListener('mousemove', handleDragging);
        window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSeeking, duration, onSeek, handleSeek]);

  return (
      <div className="player-controls">
          <button
            onClick={onTogglePlay}
            className="play-pause-button"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>

          <div className="progress-area-wrapper"> 
            <span className="time-display current-time">{formattedCurrentTime}</span>
              <div className="progress-bar-container"
                ref={progressBarRef}
                onMouseDown={handleMouseDown}>
                <div
                  className="progress-bar" 
                  style={{ width: `${currentProgress}%` }}
                />
              </div>
              <span className="time-display duration-time">{formattedDuration}</span>
            </div>

          <button className="control-button" onClick={onRefresh}>🔄</button>
      </div>
  );
};

export default PlayerControls;