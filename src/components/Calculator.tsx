
import React, { useState } from 'react';
import Button from './Button'
import Display from './Display';
import CalculatorInput from './CalculatorInput';
import handleKeyDown from '../util/handleKeyDown';
import { handleArithmetic, formatResult } from '../util/handleArithmetic';


const Calculator: React.FC = () => {
    const [x, setX] = useState<string | null>(null);
    const [y, setY] = useState<string | null>(null);
    const [operation, setOperation] = useState<string | null>(null);
    const [currentInput, setCurrentInput] = useState<string>("");
    const [displayHistory, setDisplayHistory] = useState<string>("");
    const [solutionDisplayed, setSolutionDisplayed] = useState(false);
  
  
    // Displays button configuration
    const buttonConfig = [
      [
        { display: "AC", value: "AC" },
        { display: "√", value: "√" },
        { display: "%", value: "%" },
        { display: "+/-", value: "+/-" }
      ],
      [
        { display: "7", value: "7" },
        { display: "8", value: "8" },
        { display: "9", value: "9" },
        { display: "+", value: "+" }
      ],
      [
        { display: "4", value: "4" },
        { display: "5", value: "5" },
        { display: "6", value: "6" },
        { display: "x", value: "x" }
      ],
      [
        { display: "1", value: "1" },
        { display: "2", value: "2" },
        { display: "3", value: "3" },
        { display: "/", value: "/" }
      ],
      [
        { display: "0", value: "0" },
        { display: ".", value: "." },
        { display: "^", value: "^" },
        { display: "-", value: "-" }
      ]
    ];
  


  // Using regex to check if the value is a number
  function isNumber(value: string): boolean {
    return /^\d+$/.test(value);
  }
  
  
  // Function to compute the result of an expression
  const computeResult = (x: string, y: string, operation: string): string => {
    switch (operation) {
      case "+":
      case "-":
      case "x":
      case "/":
      case "^":
      case "%":
      case "√":
        return handleArithmetic(x, y, operation).value.toString();
      default:
        return "";
    }
  };
  
  
  // Processes any input handled using mouse or keyboard clicks
  const processInput = (inputValue: string) => {
    console.log("x: ", x)
    console.log("y: ", y)
    console.log("operation: ", operation)
    console.log("Input: ", inputValue)


    // Resets the display if flag and number is triggered (restart calculation)
    const resetCalculator = () => {
      console.log("Resetting display. Display flag set to false.")
      setSolutionDisplayed(false);
      setCurrentInput(inputValue)
      setX(inputValue);
      setDisplayHistory(inputValue);
      return;
          
    };
  
    // 1. Clears the input
    if (inputValue === "AC") {
      setCurrentInput("");
      setX(null);
      setY(null);
      setOperation(null);
      setDisplayHistory(""); // added this to reset in edge case overflow
      setSolutionDisplayed(false);
      return;
  }
  
    // 2. Checks if max length, proceed with operations only
    const isOperation = (inputValue: string) => ["+", "-", "x", "/", "^", "%", "√"].includes(inputValue);
  
    if (currentInput.length >= 19 && !isOperation(inputValue)) {
        console.log("max numbers on display! updating x");
        setX(currentInput)
        return;
    }
  
  
  
    // 3. Handles decimal inputs
    if (inputValue === ".") {
          // If the solution is displayed and user tries to enter a decimal, reset.
      if (solutionDisplayed) {
        resetCalculator();
        return;
    }
      if (currentInput.includes(".")) {
        console.log("Already has a decimal");
        return;
      }
      if (currentInput === "" || /[+\-x/^%√]$/.test(currentInput)) {
        setCurrentInput("0.");
        return;
      }
    }
    
  
    // 4. Displays the arithmetic history
    setDisplayHistory(prevAppendedString => {
        if (prevAppendedString === "Overflow") return "Overflow";
        if (inputValue === "AC") return "";
        if (inputValue === "+/-") inputValue = "neg";
  
        // Handling decimals:
        if (inputValue === "." && (prevAppendedString === "" || /[+\-x/^%√]$/.test(prevAppendedString))) {
          return prevAppendedString + "0.";
        }
  
        // Handles multiple operations in a succession
        const lastCharIsOperation = /[+\-x/^%√]$/.test(prevAppendedString);
        if (lastCharIsOperation && ["+", "-", "x", "/", "^", "%", "√"].includes(inputValue)) {
          return prevAppendedString.slice(0, -1) + inputValue;
        }
        const newAppendedString = prevAppendedString + inputValue;
        const doubleOperation = newAppendedString.replace(/([+\-*/%^])\1+/g, '$1');
        
        return doubleOperation.length <= 20 ? doubleOperation.replace(/=/g, '') : "Overflow";
    });
  
  
    if (isOperation(inputValue)) {
      // Check if the last character in currentInput is also an operation
      if (/[+\-x/^%√]$/.test(currentInput)) {
        console.log("A new operation is entered. Updating operation.");
        setCurrentInput(inputValue)
        setOperation(inputValue)
        return;
      }
    }
  
  
    // 5. Handles conditions when operations are triggered
      if (isOperation(inputValue)) {
  
        if (inputValue === "√" && x === null) {
          setX("1");
          setCurrentInput("");
          setOperation("√");
          return;
        }
  
        if (operation && x && currentInput) {
          // Reached valid input, proceed with calculation
          const result = computeResult(x, currentInput, operation);
          setCurrentInput(result);
          setX(result);
          setY(null);
          setOperation(inputValue);
        } else {
          // Otherwise, continue updating variables
          setX(currentInput);
          setOperation(inputValue);
          setCurrentInput(inputValue); 
        }
  
        return;
    }
  
  
  
    // Handles signed input (+/-) -- buttownDown
    if (inputValue === "+/-") {
      if (currentInput === "" || ["+", "-", "x", "/", "^", "%", "√"].includes(currentInput)) return;
  
      let updatedValue;
  
      // Toggle signs
      const toggleSign = (value: string) => {
          if (value === "" || value === "+" || value === "-") {
              return "";
          } else {
            console.log("negating value")
  
              return (parseFloat(value) * -1).toString();
          }
      };
  
      // y is being used
      if (operation !== null && y !== null) {
          updatedValue = toggleSign(y);
          setY(updatedValue);
      } 
      // only x is being used
      else {
          updatedValue = toggleSign(currentInput);
          setX(updatedValue);
      }
  
      setCurrentInput(updatedValue);
      return;
  }
  
  
    // Handle keyDown first neg input and everything is null
    if (inputValue === "neg") {
      if (!x && !y) {
          // Append sign if no x exists
          setX("-");
          setDisplayHistory("-");
      } else if (x && !y && !operation) {
          // Toggle negative sign for x
          const newX = x === "-" ? "" : "-";
          setX(newX);
          setDisplayHistory(newX);
      } else if (x && operation) {
        // Toggle negative sign for y, handling case when y is null
        const newY = y?.charAt(0) === "-" ? y?.substr(1) : "-" + (y || "");
        setY(newY);
    
        // Append newY to the existing DisplayHistory
        setDisplayHistory(prevAppendedString => prevAppendedString + (newY || "-"));
    }
      return;
  }
  
    // Calculates the expression once the "Enter" or "=" is triggered
    if (inputValue === "=") {
      if (x && y && operation) {
        const result = handleArithmetic(x, y, operation);

          const formattedResult = formatResult(result.value.toString());

          if (result.status === "OVERFLOW" || result.status === "ERROR") {
            if (result.status === "ERROR") {
              setCurrentInput("Error");

            } else {
              setCurrentInput("Overflow");

            }
            setX(null);
            setY(null);
            setOperation(null);

          } else {
              setCurrentInput(formattedResult);
              setX(formattedResult);
              setY(null);
              setOperation(null);
          }
      }
      setSolutionDisplayed(true);
      return;
  }
  

    // Trigger reset since solution exists
    if (solutionDisplayed && isNumber(inputValue) && (!x || !operation)) {
      console.log("Solution exists, trigger reset.");
      resetCalculator();
      return; 
  }
  
  
    // Appends values to x or y based on conditions
    if (operation === null) {
      if (x === null) {
        setX(inputValue);
        setCurrentInput(inputValue);
      } else {
        setX(x + inputValue); // Append to x if it's not null
        setCurrentInput(x + inputValue);
      }
    } else {
      if (y === null) {
        setY(inputValue);
        setCurrentInput(inputValue);
      } else {
        setY(y + inputValue); // Append to y if it's not null
        setCurrentInput(y + inputValue);
      }
    }
  
  };

  
  // Handles calculations using mouse/button click
  const handleButtonClick = (value: string) => {
    processInput(value);
  };


    return (

    <section className="calculator-body">

      <CalculatorInput 
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
        handleKeyDown={(event) => handleKeyDown({
          currentInput,
          operation,
          y,
          setCurrentInput,
          setX,
          setY,
          processInput,
        })(event)}
      />

      <Display displayHistory={displayHistory} />

      <div className="calculator-section">
        {buttonConfig.map((row, rowIndex) => (
        <div key={`buttonRow-${rowIndex}`}>
          {row.map((button, btnIndex) => (
                <Button 
                    key={`btn-${btnIndex}`} 
                    className="calculator-button no-select"
                    display={button.display} 
                    value={button.value} 
                    onClick={handleButtonClick} 
                />
            ))}
          </div>
        ))}
      </div>


      <div>
        <button className="calculator-button enter-btn" onClick={() => handleButtonClick("=")}>=</button>
      </div>

    </section> 
    );
};

export default Calculator;
