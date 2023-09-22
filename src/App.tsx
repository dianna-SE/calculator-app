import React, { useState, KeyboardEvent } from 'react';
import "./App.css";


function App() {
  const [x, setX] = useState<string | null>(null);
  const [y, setY] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [appendedString, setAppendedString] = useState<string>("");




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
    
    
    function evaluateAddSubtract(x: string, y: string, operation: string): EvalResult {
      let result: number;
    
      switch (operation) {
        case "+":
          result = parseFloat(x) + parseFloat(y);
          result = parseFloat(result.toFixed(4));  
          break;

        case "-":
          result = parseFloat(x) - parseFloat(y);
          result = parseFloat(result.toFixed(4));  
          break;

        default:
          return { value: 0, status: "OK" };  // default case, can be adjusted as needed
      }
    
      return { value: result, status: "OK" };
    }
    
    
    
    function evaluateMultiplyDivide(x: string, y: string, operation: string): EvalResult {
      let result: number;
      
    
      switch (operation) {
        case "x":
          result = parseFloat(x) * parseFloat(y);
          result = parseFloat(result.toFixed(4));  
          break;

        case "/":
          if(parseFloat(y) === 0) {  // Handle division by zero
            return { value: 0, status: "OVERFLOW" };
          }
          result = parseFloat(x) / parseFloat(y);
          result = parseFloat(result.toFixed(4));  
          break;

        default:
          return { value: 0, status: "OK" };  // default case, can be adjusted as needed
      }
        
      return { value: result, status: "OK" };
    }
    


    function evaluateExponentiation(x: string, y: string, operation: string): EvalResult {
      let result: number;
  
      switch (operation) {
          case "^":
              result = parseFloat(x) ** parseFloat(y);
              result = parseFloat(result.toFixed(4));  
              
              if (result > Number.MAX_SAFE_INTEGER) {
                  return { value: 0, status: "OVERFLOW" };
              }
              break;
  
          default:
              return { value: 0, status: "OK" };  // default case, can be adjusted as needed
      }
  
      return { value: result, status: "OK" };
  }


  function evaluateModulo(x: string, y: string, operation: string): EvalResult {
    let result: number;

    switch (operation) {
        case "%":
            result = parseFloat(x) % parseFloat(y);
            result = parseFloat(result.toFixed(4));  
            break;

        default:
            return { value: 0, status: "OK" };  
    }

    return { value: result, status: "OK" };
}



function evaluateRadical(x: string, y: string, operation: string): EvalResult {
  let result: number;

  switch (operation) {
    case "√":  
    let multiplier = parseFloat(x) || 1;  
    let radicand = parseFloat(y);

    if (radicand < 0) {
        return { 
            value: NaN, 
            status: "ERROR",
            message: "Cannot compute square root of negative number" 
        };
    }

    result = multiplier * Math.sqrt(radicand);
    result = parseFloat(result.toFixed(4));  
    console.log("radical result", result)
    break;


      default:
          return { value: 0, status: "ERROR", message: "Unknown operation" }; 
  }

  return { value: result, status: "OK" };
}



function formatResult(value: string): string {
  if (value.length > 18) {
    const numberValue = parseFloat(value);
    return numberValue.toExponential(10); // 10 decimals for precision
  }
  return value;
}




// Function to compute the result of an expression
const computeResult = (x: string, y: string, operation: string): string => {
  switch (operation) {
    case "+":
      return evaluateAddSubtract(x, y, operation).value.toString();
    case "-":
      return evaluateAddSubtract(x, y, operation).value.toString();
    case "x":
      return evaluateMultiplyDivide(x, y, operation).value.toString();
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


const canAppendNumber = (value: string) => {
  if (value.length >= 19) {
    console.log("Max input length reached!");
    return false;
  }
  return true;
};



const processInput = (inputValue: string) => {

  console.log("x", x)
  console.log("y", y)
  console.log("operation", operation)
  console.log("INPUT: ", inputValue)
  console.log("appendedString", appendedString)


  // this prevents calculators being done 
  if (currentInput.length >= 20) {
      console.log("max numbers on display!");
      return;
  }

  // Before updating the appendedString, handle the '.' input properly
    if (inputValue === ".") {
      console.log("has a decimal")
      if (currentInput.includes(".")) {
            console.log("Already has a decimal")
            return; // If the current input already has a '.', ignore further '.' inputs
      } 
      if (currentInput === "" || /[+\-x/^%√]$/.test(currentInput)) {
          console.log("starting with 0.")
          setCurrentInput("0."); // Start with 0. if starting with '.' or after an operator
          return;
      }
  }

  setAppendedString(prevAppendedString => {
      if (prevAppendedString === "Overflow") return "Overflow";
      if (inputValue === "AC") return "";
      if (inputValue === "+/-") inputValue = "neg";

      // Handling decimals:
      if (inputValue === "." && (prevAppendedString === "" || /[+\-x/^%√]$/.test(prevAppendedString))) {
        console.log("has a decimal AND stuff")  
        return prevAppendedString + "0.";
      }

      const lastCharIsOperation = /[+\-x/^%√]$/.test(prevAppendedString);
      if (lastCharIsOperation && ["+", "-", "x", "/", "^", "%", "√"].includes(inputValue)) {
        console.log("last value is operation")  
        return prevAppendedString.slice(0, -1) + inputValue;
      }
      const newAppendedString = prevAppendedString + inputValue;
      const doubleOperation = newAppendedString.replace(/([+\-*/%^])\1+/g, '$1');
      
      return doubleOperation.length <= 20 ? doubleOperation.replace(/=/g, '') : "Overflow";
  });

  // check if multiple decimals
  if (inputValue === "." && (currentInput === "" || currentInput.endsWith("."))) {
    console.log("prevents adding multiple decimals")  
    return; // Prevent adding multiple dots in the current number.
  }

  if (inputValue === "AC") {
      setCurrentInput("");
      setX(null);
      setY(null);
      setOperation(null);
      return;
  }

  const lastCharIsOperation = /[+\-x/^%√]$/.test(appendedString);
  if (lastCharIsOperation && ["+", "-", "x", "/", "^", "%", "√"].includes(inputValue)) {
    console.log("TESTS FOR DOUBLE OPERATION")  
    return;
  }

  if (["+", "-", "x", "/", "^", "%", "√"].includes(inputValue)) {
      if (operation && x && currentInput) {
        console.log("HAS OPERATION AND x AND CURRENTINPUT - CALCULATE")
        const result = computeResult(x, currentInput, operation);
        setCurrentInput(result);
        setX(result);
        setY(null);
        setOperation(inputValue);
      } else {
        console.log("DOES NOT HAVE OPERATION AND X AND CURRENTINPUT -- DO NOT CALCULATE")
        // Otherwise, set x and the operation
        setX(currentInput);
        setOperation(inputValue);
        setCurrentInput(inputValue); // for some reason this makes calculations work
      }
      return;
  }

  if (inputValue === "+/-") {
      if (currentInput === "0" || currentInput === "Error") return;
      setCurrentInput((parseFloat(currentInput) * -1).toString());
      console.log("PLUSMINUS")
      setX(currentInput);
      return;
  }

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
          if (result.status === "OVERFLOW") {
            console.log("OVERFLOW")
              setCurrentInput("Overflow");
              setX(null);
              setY(null);
              setOperation(null);
          } else {
            console.log("NOTOVERFLOW")
              setCurrentInput(formattedResult);
              setX(formattedResult);
              setY(null);
              setOperation(null);
          }
      }
      return;
  }

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



const handleKeyDown = (event: KeyboardEvent) => {
  event.preventDefault();
  console.log('Pressed:', event.key);
  const keyToValueMap: { [key: string]: string } = {
      '+': '+',
      '-': '-',
      '*': 'x',
      '/': '/',
      'x': 'x',
      '%': '%',
      '^': '^',
      '.': '.',
      'r': 'r',
      'Enter': '=',
      'Escape': 'AC',
      'Backspace': 'DEL'
  };

  const value = keyToValueMap[event.key];

  if (value || /^[0-9]$/.test(event.key)) {
    // If the key is in the map or is a number, proceed:
    event.preventDefault();
    processInput(value || event.key);
  } else {
    // If the key is not in the map and not a number, ignore it:
    console.log("Ignored input:", event.key);
    return;
  }
};






const handleButtonClick = (value: string) => {
  processInput(value);
};




return (
  
  <div className="main">
    <h1>Calculator</h1>
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
          {appendedString === "" 
              ? <p className="placeholder-text"></p>
              : <p>{appendedString}</p>}
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

  </div>
);

}

export default App;