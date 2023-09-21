import React, { useState, KeyboardEvent } from 'react';
import "./App.css";


function App() {
  const [x, setX] = useState<string | null>(null);
  const [y, setY] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [currentInput, setCurrentInput] = useState<string>("0");
  const [isExpanded, setIsExpanded] = useState(false);
  const [appendedString, setAppendedString] = useState<string>("");
  const [plusMinusClicked, setPlusMinusClicked] = useState(false);
  const [sqrtClicked, setSqrtClicked] = useState(false);
  const [percentClicked, setPercentClicked] = useState(false);


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


    // displays additional buttons when expanding calculator
    const expandedDisplay = [
      [
        { display: "1/x", value: "1/(" },
        { display: "√2", value: "sqrt(2)" },
        { display: "√3", value: "sqrt(3)" },
        { display: "log", value: "log(" },
      ],
      [
        { display: "ln", value: "ln(" },
        { display: "log10", value: "log10(" },
        { display: "rad", value: "rad" },
        { display: "e", value: "e" },
      ],
      [
        { display: "sin", value: "sin(" },
        { display: "cos", value: "cos(" },
        { display: "tan", value: "tan(" },
        { display: "π", value: "π" }
      ],
      [
        { display: "sinh", value: "sinh(" },
        { display: "cosh", value: "cosh(" },
        { display: "tanh", value: "tanh(" },
        { display: "%", value: "%" }
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
    


    function evaluateExponentiation(x: string, y: string, operation: string): EvalResult {
      let result: number;
  
      switch (operation) {
          case "^":
              // result = Math.pow(parseFloat(x), parseFloat(y));
              result = parseFloat(x) ** parseFloat(y);
              
              // Check for overflow (for the sake of this example, let's consider anything larger than a big number as overflow)
              if (result > Number.MAX_SAFE_INTEGER) {
                  return { value: 0, status: "OVERFLOW" };
              }
              break;
  
          default:
              return { value: 0, status: "OK" };  // default case, can be adjusted as needed
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

    // Check if value is present in buttonConfig or expandedDisplay, or is a valid character for the calculator
    const isValuePresent = buttonConfig.flat().some(btn => btn.value === value) || expandedDisplay.flat().some(btn => btn.value === value);
      if (isValuePresent || /[0-9+\-*/().^]/.test(value)) {
        handleButtonClick(value);
    }
};





const handleButtonClick = (value: string) => {
  console.log("Button Clicked:", value);
  console.log("x:", x);
  console.log("y:", y);
  console.log("operation:", operation);

  let appendedString = currentInput + value;
  console.log("what string", appendedString)

  // string expression shown in the display
  setAppendedString(appendedString);


  if (value === "AC") {
    setCurrentInput("0");
    setX(null);
    setY(null);
    setOperation(null);
    setAppendedString("0")

    return; 
  }

  
  if (["+", "-", "x", "/", "^"].includes(value)) {
    if (x !== null) {
      setOperation(value);
    }
    return;
  }
  

  // expand calculator
  else if (value === "<") {
    setIsExpanded(!isExpanded);
    return;
 }


  // checks if input is valid and is not zero, appends a sign in front of input
  if (value === "+/-") {
    if (currentInput === "0" || currentInput === "Error") {
      return; // Exit early if the input is not a valid number
    }
    const numericValue = parseFloat(currentInput); // Convert the currentInput to a number
    const newValue = (numericValue * -1).toString(); // Perform the negation and convert back to a string
    setCurrentInput(newValue); // Update the currentInput with the new value
    console.log("should be negative", newValue)
    setX(newValue)
    return;
  }


  if (value === "=") {
    if (x !== null && y !== null && operation !== null) {
      let result;
      switch (operation) {
        case "+":
        case "-":
          result = evaluateAddSubtract(x, y, operation);
          setAppendedString(result.value.toString()) // display result on screen
          break;

        case "x":
        case "/":
          result = evaluateMultiplyDivide(x, y, operation);
          setAppendedString(result.value.toString()) // display result on screen
          break;

        case "^":
            result = evaluateExponentiation(x, y, operation);
            setAppendedString(result.value.toString()) // display result on screen
            break;
        default:
            return;
    }  


    if (result.status === "OVERFLOW") {
        setCurrentInput("Overflow");
        setX(null); // Reset x in case of overflow
        setY(null);
        setOperation(null);
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
      value={currentInput} 
      id="calculator-input" 
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


      {/* displays additional set of buttons when calculator is expanded */}
      {isExpanded && 
        <div className="expanded-section">
            <button className="display-screen">
                <p>{appendedString}</p>
            </button>
        </div>
      }


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
        <button className="calculator-button wide-arrow-btn" onClick={() => handleButtonClick("<")}>
          <img src="/images/down-arrow.png" alt="Arrow Down" className={`down-arrow ${isExpanded ? 'flip-arrow' : ''}`}/>
        </button>
      </div>


    </section>


  </div>
);

}

export default App;
