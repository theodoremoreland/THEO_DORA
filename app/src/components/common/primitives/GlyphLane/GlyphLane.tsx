// React
import { ReactElement } from 'react';

// Styles
import './GlyphLane.css';

const glyphs: string[] = ['#', '/', '-', '*', '='];

const randomAssortment: string[] = [];

for (let i = 0; i < 49; i++) {
    const randomGlyph: string =
        glyphs[Math.round(Math.random() * (glyphs.length - 1))];

    randomAssortment.push(randomGlyph);
}

const GlyphLane = (): ReactElement => {
    return (
        <div className="GlyphLane">
            {randomAssortment.map((glyph, index) => (
                <span key={`${glyph}-${index}`} className="glyph">
                    {glyph}
                </span>
            ))}
        </div>
    );
};

export default GlyphLane;
