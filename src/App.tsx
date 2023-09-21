import React, { useState, useEffect, KeyboardEvent } from 'react';
import "./App.css";


function App() {
  const [x, setX] = useState<string | null>(null);
  const [y, setY] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [currentInput, setCurrentInput] = useState<string>("0");



  const isValidExponent = (expression: string): boolean => {
    const matches = expression.match(/(\d+)\*\*(\d+)/);
    if (matches) {
      const [, base, exponent] = matches;
      if (parseInt(base, 10) > 1000 && parseInt(exponent, 10) > 1000) {  // Adjust these numbers as needed
        return false;
      }
    }
    return true;
  };
  



  const buttonConfig = [
    [
      { display: "AC", value: "AC" },
      { display: "(", value: "(" },
      { display: ")", value: ")" },
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
    

    type EvalResult = {
      value: number;
      status: "OK" | "OVERFLOW";
    };
    
    
    function evaluateAddSubtract(x: string, y: string, operation: string): EvalResult {
      let result: number;
    
      switch (operation) {
        case "+":
          result = parseFloat(x) + parseFloat(y);
          break;

        case "-":
          result = parseFloat(x) - parseFloat(y);
          break;

        default:
          return { value: 0, status: "OK" };  // default case, can be adjusted as needed
      }
    
      // We can add additional logic here to check for overflow, if required.
    
      return { value: result, status: "OK" };
    }
    
    
    
    function evaluateMultiplyDivide(x: string, y: string, operation: string): EvalResult {
      let result: number;
    
      switch (operation) {
        case "x":
          result = parseFloat(x) * parseFloat(y);
          break;
        case "/":
          if(parseFloat(y) === 0) {  // Handle division by zero
            return { value: 0, status: "OVERFLOW" };
          }
          result = parseFloat(x) / parseFloat(y);
          break;
        default:
          return { value: 0, status: "OK" };  // default case, can be adjusted as needed
      }
    
      // We can add additional logic here to check for overflow, if required.
    
      return { value: result, status: "OK" };
    }
    
    
    function evaluateExponent(x: string, y: string): EvalResult {
      const base = parseFloat(x);
      const exponent = parseFloat(y);
    
      // You can adjust these bounds if necessary.
      if (exponent > 100 || exponent < -100) {
        return { value: 0, status: "OVERFLOW" };
      }
    
      const result = Math.pow(base, exponent);
    
      // Optional: You can also check if the result is too large or too small here.
      if (!isFinite(result)) {
        return { value: 0, status: "OVERFLOW" };
      }
    
      return { value: result, status: "OK" };
    }
    
    
  
    


  // Handles calculations through key presses
  const handleKeyDown = (event: KeyboardEvent) => {
    const keyToValueMap: { [key: string]: string } = {
      '*': 'x',
      'Enter': '=',
      'Escape': 'AC',
      'Backspace': 'DEL'
    };

    const value = keyToValueMap[event.key];

    // If the key is part of the mapping, prevent its default action
    if (value) {
      event.preventDefault();

      if (value === "DEL") {
        setCurrentInput(prev => (prev.length > 1 ? prev.slice(0, -1) : "0"));
      } else {
        handleButtonClick(value);
      }
    }
};




const handleButtonClick = (value: string) => {
  if (["+", "-", "x", "/"].includes(value)) {
    if (x !== null) {
      setOperation(value);
    }
    return;
  }

  if (value === "=") {
    if (x !== null && y !== null && operation !== null) {
      let result;
      switch (operation) {
        case "+":
        case "-":
          result = evaluateAddSubtract(x, y, operation);
          break;
        case "x":
        case "/":
          result = evaluateMultiplyDivide(x, y, operation);
          break;
        case "^":
          result = evaluateExponent(x, y);
          break;
        default:
          return;
      }
  
      if (result.status === "OVERFLOW") {
        setCurrentInput("Overflow");
        // Handle the overflow case further if needed
      } else {
        setCurrentInput(result.value.toString());
        setX(result.value.toString());
        setY(null);
        setOperation(null);
      }
    }
    return;
  }

  if (operation === null) {
    setX(value);
    setCurrentInput(value);
  } else {
    setY(value);
    setCurrentInput(value);
  }
};



  

return (
  <div className="main">
    <h1>Calculator</h1>
    <section className="calculator-body">


    <input 
      type="text" 
      value={currentInput} 
      id="calculator-input" 
      onKeyDown={handleKeyDown} 


onChange={(e) => {
  const newValue = e.target.value;

  // Clear "Error" if it's the current input
  if (currentInput === "Error") {
    setCurrentInput(newValue);
    return;
  }

  if (newValue === "0" || newValue.startsWith("0.") || newValue.startsWith("-0.")) {
    setCurrentInput(newValue); // keep as is if it's "0" or starts with "0." or "-0."
  } else if (newValue.startsWith("0") || newValue.startsWith("-0")) {
    setCurrentInput(newValue.slice(1)); // remove the leading 0 if it starts with "0" or "-0"
  } else {
    setCurrentInput(newValue); 
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
        <button className="calculator-button wide-arrow-btn" onClick={() => handleButtonClick("=")}>=</button>
      </div>

      <div>
        <button className=" calculator-button pressed-display" >what is clicked</button>
      </div>


    </section>


  </div>
);

}

export default App;
