import React from 'react';

interface CalculatorInputProps {
    currentInput: string;
    setCurrentInput: React.Dispatch<React.SetStateAction<string>>;
    handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const CalculatorInput: React.FC<CalculatorInputProps> = ({ currentInput, setCurrentInput, handleKeyDown }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        if (newValue === "AC") {
            setCurrentInput(""); // Clear
          } 
          
          else if (currentInput === "Error") {
            setCurrentInput(newValue); // Set error
          } 
          
          else if (currentInput === "0" && /[0-9.]/.test(newValue)) {
            setCurrentInput(newValue);
          } 
          
          else if (newValue === "") {
            setCurrentInput("0"); // Restore "0" if the input is empty
          } 
          
          else if (newValue.startsWith("0.") || newValue.startsWith("-0.")) {
            setCurrentInput(newValue); // Enter decimal without removing leading 0
          } 
          
          else if (newValue.startsWith("0") || newValue.startsWith("-0")) {
            setCurrentInput(newValue.slice(1)); //remove leading zero
          } 
          
          else {
            setCurrentInput(newValue); // set user input
          }
    };

    const handleFocus = () => {
        if (currentInput === "0" || currentInput === "Error") {
            setCurrentInput("");
        }
    };

    const handleBlur = () => {
        if (currentInput === "") {
            setCurrentInput("0");
        }
    };

return (
    <input 
        type="text" 
        value={currentInput || '0'}
        id="calculator-input" 
        placeholder="0"
        onKeyDown={handleKeyDown} 
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
    />
);
};

export default CalculatorInput;
