import React, { KeyboardEvent } from 'react';

type HandleKeyDownProps = {
  currentInput: string;
  operation: string | null;
  y: string | null;
  setCurrentInput: React.Dispatch<React.SetStateAction<string>>;
  setX: React.Dispatch<React.SetStateAction<string | null>>;
  setY: React.Dispatch<React.SetStateAction<string | null>>;
  processInput: (inputValue: string) => void;
};

const handleKeyDown = (args: HandleKeyDownProps): (event: KeyboardEvent) => void => {
  const {
    currentInput,
    operation,
    y,
    setCurrentInput,
    setX,
    setY,
    processInput,
  } = args;

  return (event: KeyboardEvent) => {
      event.preventDefault(); // prevents characters not in key to be handled
  
      const keyToValueMap: { [key: string]: string } = {
          '+': '+',
          '-': '-',
          '*': 'x',
          '/': '/',
          'x': 'x',
          '%': '%',
          '^': '^',
          '.': '.',
          'r': '√',
          'Enter': '=',
          '=': '=',
          'Escape': 'AC',
          'Backspace': 'DEL'
      };
    
      let value = keyToValueMap[event.key];
  
      if (event.key === "+" && event.shiftKey) {
          setCurrentInput('+');
      }
      
    
    // Handle delete feature for keyboard
    if (value === 'DEL') {
      if (currentInput.length > 0) {
        setCurrentInput(prevInput => prevInput.slice(0, -1));
        
        if (!operation) {
          // If no operation is pressed, update x
          setX(prevX => (prevX ? prevX.slice(0, -1) : null));
        } else if (operation && y !== null) {
          // If operation has been pressed, update y
          setY(prevY => (prevY ? prevY.slice(0, -1) : null));
        }
        
        return;
      }
    
      if (currentInput.length === 0) {
        console.log("Unable to delete empty input.")
        return;
      }
    }
    
    
    
      // Special handling for signs (+/-):
      if (event.key === '+' && (currentInput === "" || currentInput === "-")) {
          // value = 'AC';
          return
      }
    
      if (event.key === '-' && (currentInput === "" || /[+\-x/^%√]$/.test(currentInput))) {
        value = 'neg';
      }
    
      // Checks for a valid character before passing into calculation function
      if (value || /^[0-9]$/.test(event.key)) {
        event.preventDefault();
        processInput(value || event.key);
      } else {
        console.log("Ignored input:", event.key);
        return;
      }
    };
};

export default handleKeyDown;

  