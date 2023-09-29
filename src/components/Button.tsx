import React from 'react';

interface ButtonProps {
    display: string;
    value: string;
    onClick: (value: string) => void;
    className?: string; 
}

const Button: React.FC<ButtonProps> = ({ display, value, onClick, className }) => {
    return (
        <button className={className} onClick={() => onClick(value)}>
            {display}
        </button>
    );
};

export default Button;
