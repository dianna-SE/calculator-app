import React, { useState, KeyboardEvent } from 'react';
import "./App.css";


function App() {
  const [x, setX] = useState<string | null>(null);
  const [y, setY] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
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
    
      // We can add additional logic here to check for overflow, if required.
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


// Declare keyString outside of the function
let keyString = "";










// Handles calculations through key presses
const handleKeyDown = (event: KeyboardEvent) => {
  console.log("Key Clicked:", event.key);
  console.log("x:", x);
  console.log("y:", y);
  console.log("operation:", operation);

  const keyToValueMap: { [key: string]: string } = {
    '+': '+',
    '-': '-',
    '*': 'x',
    '/': '/',
    'x': 'x',
    '%': '%',
    '^': '^',
    'Enter': '=',
    'Escape': 'AC',
    'Backspace': 'DEL'
  };

  const value = keyToValueMap[event.key];

  if (value || /^[0-9]$/.test(event.key)) {
    event.preventDefault();

    // Append numbers and operations to keyString
    if (/^[0-9]$/.test(event.key) || ['+', '-', '*', '/', '%', '^'].includes(event.key)) {
      keyString += event.key;
      setAppendedString(prevAppendedString => prevAppendedString + event.key); // DISPLAY SCREEN
      setCurrentInput(event.key); // INPUT SCREEN
    }

    console.log("Key String:", keyString);
  }

  if (event.key === "Enter") {
    console.log("SOLVE EXPRESSION");
  }

  if (['+', '-', '*', '/', '%', '^'].includes(event.key)) {
    setOperation(event.key);
  }
};











const handleDisplayClick = () => {
  console.log("Input field was clicked");
};




const handleButtonClick = (value: string) => {
  console.log("Button Clicked:", value);
  console.log("x:", x);
  console.log("y:", y);
  console.log("operation:", operation);

  if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."].includes(value)) {
    if (!canAppendNumber(currentInput)) return;
  }

  if (currentInput.length >= 20) {
    console.log("max numbers on display!")
  }

  // expand calculator
  if (value === "<") {
    setIsExpanded(prev => !prev);
    return; 
  }

  // let appendedString = currentInput + value;

  // string expression shown in the display
  // setAppendedString(prevAppendedString => prevAppendedString + value);


  setAppendedString(prevAppendedString => {
    const newAppendedString = prevAppendedString + value;
    console.log("Updated appendedString:", newAppendedString);
    return newAppendedString;
  });


  if (value === "AC") {
    setCurrentInput("");
    setX(null);
    setY(null);
    setOperation(null);
    setAppendedString("")
    return; 
  }


  // Handle operations
  // if (["+", "-", "x", "/", "^", "%", "√"].includes(value)) {
  //   setX(currentInput);
  //   setOperation(value);
  //   setCurrentInput("");
  //   return;
  // }



    // Handle operations
    if (["+", "-", "x", "/", "^", "%", "√"].includes(value)) {
      if (operation && x && currentInput) {
        // If operation and x are defined, it means we have a complete expression
        // Compute the result for the previous expression
        const result = computeResult(x, currentInput, operation);
        setCurrentInput(result);
        setX(result);
        setY(null);
        setOperation(value);
      } else {
        // Otherwise, set x and the operation
        setX(currentInput);
        setOperation(value);
        setCurrentInput("");
      }
      return;
    }


  // checks if input is valid and is not zero, appends a sign in front of input
  if (value === "+/-") {
    if (currentInput === "0" || currentInput === "Error") {
      return; 
    }
    const numericValue = parseFloat(currentInput); 
    const newValue = (numericValue * -1).toString(); 
    setCurrentInput(newValue); 
    setX(newValue)
    return;
  }


  if (value === "=") {
    if (x && y && operation) {
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
            result = evaluateExponentiation(x, y, operation);
            break;

        case "%":
            result = evaluateModulo(x, y, operation); 
            break;

        case "√":
            result = evaluateRadical(x, y, operation);
            break;


        default:
            return;
    }  


    const formattedResult = formatResult(result.value.toString());

    setAppendedString(formattedResult);

    if (result.status === "OVERFLOW") {
        setCurrentInput("Overflow");
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
  return;
}

if (operation === null) {
  if (x === null) {
    setX(value);
    setCurrentInput(value);
  } else {
    setX(x + value); // Append to x if it's not null
    setCurrentInput(x + value);
  }
} else {
  if (y === null) {
    setY(value);
    setCurrentInput(value);
  } else {
    setY(y + value); // Append to y if it's not null
    setCurrentInput(y + value);
  }
}

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
              setCurrentInput("0");
            } else if (currentInput === "Error") {
              setCurrentInput(newValue);
            } else if (currentInput === "0" && /[0-9.]/.test(newValue)) {
            // Replace "0" with the new input value
              setCurrentInput(newValue);
            } else if (newValue === "") {
              setCurrentInput("0"); // Restore "0" if the input is empty
            } else if (newValue.startsWith("0.") || newValue.startsWith("-0.")) {
              setCurrentInput(newValue);
            } else if (newValue.startsWith("0") || newValue.startsWith("-0")) {
              setCurrentInput(newValue.slice(1));
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


      <div >
        <button className="display-screen" onClick={handleDisplayClick}>
          {appendedString === "" 
              ? <p className="placeholder-text">TEST</p>
              : <p>{appendedString}</p>}
        </button>
      </div>


      <div className={`expanded-section ${isExpanded ? 'visible' : ''}`}>
        <button className="display-screen" onClick={handleDisplayClick}>
          {appendedString === "" 
              ? <p className="placeholder-text">History</p>
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


      <div>
        <button className="calculator-button wide-arrow-btn" onClick={() => handleButtonClick("<")}>
          <img src="/images/down-arrow.png" alt="Arrow Down" className={`down-arrow ${isExpanded ? 'flip-arrow' : ''}`}/>
        </button>
      </div>

    </section>

  </div>
);

}

export default App;
