import React, { useState, useEffect, KeyboardEvent } from 'react';
import "./App.css";


function App() {
  const [currentInput, setCurrentInput] = useState("0");
  const [isExpanded, setIsExpanded] = useState(false);
  const [resultShown, setResultShown] = useState(false);


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
      { display: "x", value: "*" }
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

    // Calculates math once "=" is entered
    // Calculates math once "=" is entered
const evaluateExpression = (expression: string): string => {
  // Return early if the expression is "Error"
  if (expression === "Error") return "Error";
  
  try {
    // Replace any 'x' with '*' for multiplication
    const sanitizedExpression = expression.replace(/x/g, "*");
    
    // Replace '^' with '**' for exponentiation
    const exponentExpression = sanitizedExpression.replace(/\^/g, "**");
    
    let result = eval(exponentExpression);

    // Convert the result to a string
    let resultStr = result.toString();

    console.log("Raw Result:", resultStr); // Debugging line

    if (resultStr.includes('.') && resultStr.split('.')[1].length > 15) { // added this check if the decimal portion exceeds 15 characters
      resultStr = parseFloat(resultStr).toExponential();
    } else if (resultStr.length > 18) {
      resultStr = parseFloat(resultStr).toExponential();
    }

    console.log("Processed Result:", resultStr); // Debugging line

    return resultStr;
  } catch (e) {
    console.error(e); // For a better view of the error
    return "Error"; // Return error if the expression is invalid
  }
};

    


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

  // Handles calculations through clicks
  const handleButtonClick = (value: string) => {
    const maxLength = 12; // Adjust the maximum length as needed

    // Check if currentInput is "Error"
    if (currentInput === "Error") {
      setCurrentInput(value);
      return;
  }

    // Check if currentInput exceeds the maximum length
    if (currentInput.length >= maxLength) {
      return;
    }

    // If result is currently shown and a number is pressed, replace the current input
    if (resultShown && /[0-9]/.test(value)) {
        setCurrentInput(value);
        setResultShown(false);  // Reset resultShown to false
      return;
    }



    if (value === "AC") {
      setCurrentInput("0");
    } 

    // checks if input is valid and is not zero, appends a sign in front of input
    else if (value ==="+/-") {
      if (!isNaN(parseFloat(currentInput)) && parseFloat(currentInput) !== 0) {
        setCurrentInput(prev => 
          (parseFloat(prev) * -1).toString()
        );
      }
    }

    else if (value === "=") {
      if (!isValidExponent(currentInput)) {
        setCurrentInput("Exponent Too Large");
        return;
      }
    
      const result = evaluateExpression(currentInput);
      setCurrentInput(result);
      setResultShown(true);
    }
  

    else if (value === "<") {
      setIsExpanded(!isExpanded);
   }

    // checks if last value is a valid char for exponentiation
    else if (value === "^") {
      const lastChar = currentInput.slice(-1);
      if (!currentInput.includes("^") && (/[0-9]/.test(lastChar) || lastChar === "(")) {
          setCurrentInput(prev => prev + value);
      }
    }

    // checks whether a valid char is entered after an exponent operation
    else if (currentInput.slice(-1) === "^" && (!/[0-9(]/.test(value))) {
      return;
    }

    // appends a decimal char to the input if the button pressed is valid character
    else if (value === ".") {
      if (!currentInput.includes(".")) {
          setCurrentInput(prev => prev + value);
      }
    }

    // Handle numbers
    else if (/[0-9]/.test(value)) {
    // Check if currentInput is "0" and replace it with the new number
    if (currentInput === "0") {
      setCurrentInput(value);
    } else {
      setCurrentInput(prev => prev + value);
    }

    




    }
    else {
      setCurrentInput(prev => prev + value);
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


    </section>

  </div>
);

}

export default App;
