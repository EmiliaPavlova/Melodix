import './Fretboard.css';

const Fretboard = ({ positions }) => {
    const frets = [0, 1, 2, 3, 4];
    const strings = [6, 5, 4, 3, 2, 1];

    const renderCell = (stringIndex, fretIndex) => {
        const pos = positions[stringIndex - 1];
        const isFretted = pos === fretIndex;
        const isOpen = fretIndex === 0 && pos === 0;
        const isMuted = fretIndex === 0 && pos === -1;

        if (fretIndex === 0) {
            return (
                <div key={`${stringIndex}-0`} className="fretboard-cell nut-cell">
                    {isMuted && <span className="string-marker muted">X</span>}
                    {isOpen && <span className="string-marker open">O</span>}
                </div>
            );
        }

        return (
            <div key={`${stringIndex}-${fretIndex}`} className="fretboard-cell fret-cell">
                {isFretted && <div className="finger-position"></div>}
            </div>
        );
    };

    return (
        <div className="fretboard-diagram-container">
            {strings.map(stringNum => renderCell(stringNum, 0))}
            {frets.slice(1).flatMap(fretNum => (
                strings.map(stringNum => renderCell(stringNum, fretNum))
            ))}
        </div>
    );
};

export default Fretboard;