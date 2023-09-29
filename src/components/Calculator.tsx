
import React, { useState, KeyboardEvent } from 'react';

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
    
  
    interface EvalResult {
      value: number;
      status: "OK" | "OVERFLOW" | "ERROR";
      message?: string;
  }

    // Rounding results
    function roundResult(value: number): number {
      return parseFloat(value.toFixed(4));
  }
      
      
    // Handle addition and subtraction operations
      function evaluateAddSubtract(x: string, y: string, operation: string): EvalResult {
        let result: number;
      
        switch (operation) {
          case "+":
            result = roundResult(parseFloat(x) + parseFloat(y));
            break;
  
          case "-":
            result = roundResult(parseFloat(x) - parseFloat(y)); 
            break;
  
            default:
              return { value: 0, status: "ERROR", message: "Unknown operation" };
        }
      
        return { value: result, status: "OK" };
      }
      
      
      
      // Handle multiplication and division operations
      function evaluateMultiplyDivide(x: string, y: string, operation: string): EvalResult {
        let result: number;
        
      
        switch (operation) {
          case "x":
            result = roundResult(parseFloat(x) * parseFloat(y));
            break;
  
          case "/":
            if(parseFloat(y) === 0) {  // Handle division by zero
              return { value: NaN, status: "ERROR" };
            }
            result = roundResult(parseFloat(x) / parseFloat(y));
            break;
  
            default:
              return { value: 0, status: "ERROR", message: "Unknown operation" };
        }
          
        return { value: result, status: "OK" };
      }
      
  
  
      // Handle exponentiation operations
      function evaluateExponentiation(x: string, y: string, operation: string): EvalResult {
        let result: number;
    
        switch (operation) {
            case "^":
                result = roundResult(parseFloat(x) ** parseFloat(y)); 
                
                if (result > Number.MAX_SAFE_INTEGER) {
                  console.log("Precision issues due to large number")
                  return { value: NaN, status: "ERROR", message: "Result exceeds maximum safe integer" };
                }
                break;
    
                default:
                  return { value: 0, status: "ERROR", message: "Unknown operation" };
        }
    
        return { value: result, status: "OK" };
    }
  
  
    // Handle modulo operations
    function evaluateModulo(x: string, y: string, operation: string): EvalResult {
      let result: number;
  
      switch (operation) {
          case "%":
              result = roundResult(parseFloat(x) % parseFloat(y)); 
              break;
  
              default:
                return { value: 0, status: "ERROR", message: "Unknown operation" };
      }
  
      return { value: result, status: "OK" };
  }
  
  
  // Handle radical operations
  function evaluateRadical(x: string, y: string, operation: string): EvalResult {
    let result: number;
  
    switch (operation) {
      case "√":  
      let multiplier = parseFloat(x) || 1;  
      let radicand = parseFloat(y);
  
      if (radicand < 0) {
        return { value: NaN, status: "ERROR", message: "Cannot compute negative number" };
      }
  
      result = roundResult(multiplier * Math.sqrt(radicand));
      break;
  
  
        default:
            return { value: 0, status: "ERROR", message: "Unknown operation" }; 
    }
  
    return { value: result, status: "OK" };
  }
  
  
  
  function formatResult(value: string): string {
    if (value.length > 18) {
      const numberValue = parseFloat(value);
      return numberValue.toExponential(4); // rounds to 4 places
    }
    return value;
  }
  
  // Using regex to check if the value is a number
  function isNumber(value: string): boolean {
    return /^\d+$/.test(value);
  }
  
  
  // Function to compute the result of an expression
  const computeResult = (x: string, y: string, operation: string): string => {
    switch (operation) {
      case "+":
      case "-":
        return evaluateAddSubtract(x, y, operation).value.toString();
      case "x":
      case "/":
        return evaluateMultiplyDivide(x, y, operation).value.toString();
      case "^":
        return evaluateExponentiation(x, y, operation).value.toString();
      case "%":
        return evaluateModulo(x, y, operation).value.toString();
      case "√":
        return evaluateRadical(x, y, operation).value.toString();
      default:
        return "";
    }
  };
  
  
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
            let result;
            switch (operation) {
                case "+":
                case "-": result = evaluateAddSubtract(x, y, operation); break;
                case "x":
                case "/": result = evaluateMultiplyDivide(x, y, operation); break;
                case "^": result = evaluateExponentiation(x, y, operation); break;
                case "%": result = evaluateModulo(x, y, operation); break;
                case "√": result = evaluateRadical(x, y, operation); break;
                default: return;
            }
  
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
  
  
  
  // Handles calculations using keyboard 
  const handleKeyDown = (event: KeyboardEvent) => {
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
  
  // Handles calculations using mouse 
  const handleButtonClick = (value: string) => {
    processInput(value);
  };

    return (

    <section className="calculator-body">
      <input 
          type="text" 
          value={currentInput || '0'}
          id="calculator-input" 
          placeholder="0"
          onKeyDown={handleKeyDown} 

          onChange={(e) => {
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
          }}

        onFocus={() => {
          if (currentInput === "0" || currentInput === "Error") {
            setCurrentInput("");
          }
          }}


        onBlur={() => {
          if (currentInput === "") {
              setCurrentInput("0");
            }
          }}

      />


      <div className="display-body">
        <button className="display-screen">
          {displayHistory === "" 
              ? <p className="placeholder-text"></p>
              : <p>{displayHistory}</p>}
        </button>
      </div>


      <div className="calculator-section">
        {buttonConfig.map((row, rowIndex) => (
        <div key={`buttonRow-${rowIndex}`}>
          {row.map((button, btnIndex) => (
              <button key={`btn-${btnIndex}`} className="calculator-button" onClick={() => handleButtonClick(button.value)}>
                {button.display}
              </button>
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
