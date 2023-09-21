import React, { useState, useEffect, KeyboardEvent } from 'react';
import "./App.css";


function App() {
  const [currentInput, setCurrentInput] = useState("0");
  const [isExpanded, setIsExpanded] = useState(false);


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


  // Handles calculations through key presses
  const handleKeyDown = (event: KeyboardEvent) => {
    const keyToValueMap: { [key: string]: string } = {
      '*': 'x',
      'Enter': '=',
      'Escape': 'AC',
      'Backspace': 'DEL'
      // ... any other key conversions ...
    };

    const value = keyToValueMap[event.key] || event.key;

    // Check if value is present in buttonConfig or expandedDisplay, or is a valid character for the calculator
    const isValuePresent = buttonConfig.flat().some(btn => btn.value === value) || expandedDisplay.flat().some(btn => btn.value === value);
    if (isValuePresent || /[0-9+\-*/().^]/.test(value)) {
      handleButtonClick(value);
    }
};
  

  // Handles calculations through clicks
  const handleButtonClick = (value: string) => {
    const maxLength = 12; // Adjust the maximum length as needed

    // Check if currentInput exceeds the maximum length
    if (currentInput.length >= maxLength) {
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
      setCurrentInput("0");
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
      <input type="text" value={currentInput} id="calculator-input" readOnly/>

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

      {/* displays additional set of buttons when calculator is expanded */}
      {isExpanded && 
        <div className="expanded-section">
{expandedDisplay.map((row, rowIndex) => (
    <div key={`expandedRow-${rowIndex}`}>
        {row.map((button, btnIndex) => (
            <button key={`expandedBtn-${btnIndex}`} className="calculator-button" onClick={() => handleButtonClick(button.value)}>
                {button.display}
            </button>
        ))}
    </div>
))}
        </div>
      }

      <div>
        <button className="calculator-button" onClick={() => handleButtonClick("=")}>=</button>
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
