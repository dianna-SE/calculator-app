import React, { useState } from 'react';
import "./App.css";
import { IoIosArrowDown } from "react-icons/io";


function App() {
  const [currentInput, setCurrentInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);


  const buttonConfig = [
    [
      { display: "AC", value: "AC" },
      { display: "(", value: "(" },
      { display: ")", value: ")" },
      { display: "+/-", value: "+/-" }
    ],
    [
      { display: "1", value: "1" },
      { display: "2", value: "2" },
      { display: "3", value: "3" },
      { display: "/", value: "/" }
    ],
    [
      { display: "4", value: "4" },
      { display: "5", value: "5" },
      { display: "6", value: "6" },
      { display: "x", value: "x" }
    ],
    [
      { display: "7", value: "7" },
      { display: "8", value: "8" },
      { display: "9", value: "9" },
      { display: "+", value: "+" }
    ],
    [
      { display: ".", value: "." },
      { display: "^", value: "^" },
      { display: "0", value: "0" },
      { display: "-", value: "-" }
    ]
  ];

  // displays additional buttons when expanding calculator
  const expandedDisplay = [
    [
      { display: "sin", value: "sin(" },
      { display: "cos", value: "cos(" },
      { display: "tan", value: "tan(" },
      { display: "log", value: "log(" }
    ],
    [
      { display: "asin", value: "asin(" },
      { display: "acos", value: "acos(" },
      { display: "atan", value: "atan(" },
      { display: "ln", value: "ln(" }
    ],
    [
      { display: "π", value: "π" },
      { display: "e", value: "e" },
      { display: "%", value: "%" },
      { display: "!", value: "!" }
    ],
    [
      { display: "√", value: "√(" },
      { display: "x²", value: "^2" },
      { display: "1/x", value: "1/(" },
      { display: "|x|", value: "abs(" }
    ]
  ];
  

  // Handles calculations through clicks
  const handleButtonClick = (value: string) => {
    if (value === "AC") {
      setCurrentInput("");
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
      setCurrentInput("Insert Answer");
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
    else {
      setCurrentInput(prev => prev + value);
    }
  };

  

return (
  <div className="main">
    <h1>Calculator App</h1>
    <section className="calculator-body">
      <input type="text" value={currentInput} id="calculator-input" readOnly />

      <div className="calculator-section">
        {buttonConfig.map(row => (
          <div>
            {row.map(button => (
              <button className="calculator-button" onClick={() => handleButtonClick(button.value)}>
                {button.display}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Expanded Buttons */}
      {isExpanded && 
        <div className="expanded-section">
          {expandedDisplay.map(row => (
            <div>
              {row.map(button => (
                <button className="calculator-button" onClick={() => handleButtonClick(button.value)}>
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
