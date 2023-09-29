import React from 'react';

interface DisplayProps {
    displayHistory: string;
}

const Display: React.FC<DisplayProps> = ({ displayHistory }) => {
    return (
        <div className="display-body">
            <button className="display-screen">
                {displayHistory === "" 
                    ? <p className="placeholder-text"></p>
                    : <p>{displayHistory}</p>}
            </button>
        </div>
    );
};

export default Display;
