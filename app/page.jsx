'use client'; 

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import songsData from '@/lib/songs.json'; 
import ChordDisplay from '@/components/ChordDisplay/ChordDisplay';
import SongSelector from '@/components/SongSelector/SongSelector';
import PlayerControls from '@/components/PlayerControls/PlayerControls';
import './page.css';

const LOGO_PATH = '/melodix-logo.png';
const LOGO_ALT_TEXT = 'Melodix logo';

function ChordPlayerPage() {
    const [selectedSong, setSelectedSong] = useState(songsData[0]);
    const [currentChord, setCurrentChord] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentProgress, setCurrentProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load(); 
        }
    }, [selectedSong]);

    const handleSongSelect = (songId) => {
        const newSong = songsData.find(s => s.song_id === songId);
        setSelectedSong(newSong);
        setCurrentChord(null); 
        setIsPlaying(false);

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current && audioRef.current.duration) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleTimeUpdate = () => {
        if (!audioRef.current || !selectedSong) return;

        const currentTime = audioRef.current.currentTime;
        const duration = audioRef.current.duration;

        setCurrentTime(currentTime);

        let progress = 0;
        if (duration > 0) {
            progress = (currentTime / duration) * 100;
        }
        setCurrentProgress(progress);

        const activeChord = selectedSong.chords_data.find((chord, index) => {
            const startTime = chord.start_time_sec;
            const nextChord = selectedSong.chords_data[index + 1];
            const endTime = nextChord ? nextChord.start_time_sec : Infinity;

            return currentTime >= startTime && currentTime < endTime;
        });

        if (activeChord) {
            if (!currentChord || activeChord.start_time_sec !== currentChord.start_time_sec) {
                setCurrentChord(activeChord);
            }
        }
    };

    const togglePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleRefresh = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);

            setCurrentChord(null); 
        }
    };

    const handleSeek = (newTime) => {
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    return (
        <div className="main-content-wrapper">
            <header className="app-header">
                <div className="app-logo-container">
                    <Image
                        src={LOGO_PATH}
                        alt={LOGO_ALT_TEXT}
                        width={60}
                        height={60}
                    />
                    <h1 className="app-title">MELODIX</h1>
                </div>
                <p className="app-subtitle">Your musical buddy</p>
            </header>

            <SongSelector 
                songs={songsData} 
                selectedSong={selectedSong} 
                onSongSelect={handleSongSelect} 
            />

            <main className="chord-main-area">
                <ChordDisplay 
                    chordName={currentChord ? currentChord.chord : null}
                    currentText={currentChord ? currentChord.text : 'Choose a song to play'}
                />
            </main>

            <div style={{display: 'none'}}>
                <audio 
                    ref={audioRef}
                    src={selectedSong.audio_path} 
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                />
            </div>

            <PlayerControls 
                isPlaying={isPlaying}
                onTogglePlay={togglePlayPause}
                onSeek={handleSeek}
                onRefresh={handleRefresh}
                currentProgress={currentProgress}
                currentTime={currentTime}
                duration={duration}
            />
            
            <p className="current-song-info">
                *Current song: {selectedSong.title} by {selectedSong.artist}*
            </p>
        </div>
    );
}

export default ChordPlayerPage;