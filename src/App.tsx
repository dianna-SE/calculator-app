import React, { useState } from 'react';
import "./App.css";
import { IoIosArrowDown } from "react-icons/io";
import { FaMinus, FaPlus, FaXmark, FaDivide, FaEquals, FaPlusMinus } from "react-icons/fa6";
import { MdClear } from "react-icons/md";


function App() {
  const [currentInput, setCurrentInput] = useState("");


  // Handles calculations through clicks
  const handleButtonClick = (value: string) => {
    if (value === "AC") {
      setCurrentInput("0");
    } else {
      setCurrentInput(prev => prev + value);
    }
  };

  

  return (
    <div className="main">
      <h1>Calculator App</h1>
      <section className="calculator-body">
        <input type="text" value={currentInput} id="calculator-input" readOnly />
{/* 
        <div>
          <button className="calculator-button" onClick={() => handleButtonClick("AC")}><MdClear/></button>
          <button className="calculator-button" onClick={() => handleButtonClick("+")}>(</button>
          <button className="calculator-button" onClick={() => handleButtonClick("+")}>)</button>
          <button className="calculator-button" onClick={() => handleButtonClick("^")}>+/-</button>
        </div> */}

        <div>
          <button className="calculator-button clear" onClick={() => handleButtonClick("AC")}>AC</button>
          <button className="calculator-button" onClick={() => handleButtonClick("=")}>(</button>
          <button className="calculator-button" onClick={() => handleButtonClick("=")}>)</button>
          <button className="calculator-button" onClick={() => handleButtonClick("=")}><FaPlusMinus/></button>
        </div>

        <div>
          {[
            { display: "1", value: "1" },
            { display: "2", value: "2" },
            { display: "3", value: "3" },
            { display: <FaDivide />, value: "/" }
            ].map(button => (
            <button className="calculator-button" onClick={() => handleButtonClick(button.value)}>
              {button.display}
            </button>
          ))}
        </div>


        <div>
          {[
            { display: "4", value: "4" },
            { display: "5", value: "5" },
            { display: "6", value: "6" },
            { display: <FaXmark />, value: "x" }
            ].map(button => (
            <button className="calculator-button" onClick={() => handleButtonClick(button.value)}>
              {button.display}
            </button>
          ))}
        </div>


        <div>
          {[
            { display: "7", value: "7" },
            { display: "8", value: "8" },
            { display: "9", value: "9" },
            { display: <FaPlus />, value: "+" }
            ].map(button => (
            <button className="calculator-button" onClick={() => handleButtonClick(button.value)}>
              {button.display}
            </button>
          ))}
        </div>


        <div>
          {[
            { display: ".", value: "." },
            { display: "^", value: "^" },
            { display: "0", value: "0" },
            { display: <FaMinus />, value: "-" }
            ].map(button => (
            <button className="calculator-button" onClick={() => handleButtonClick(button.value)}>
              {button.display}
            </button>
          ))}
        </div>

        <div>
          <button className="calculator-button" onClick={() => handleButtonClick("=")}>=</button>
        </div>

        <div>
          <button className="calculator-button wide-arrow-btn" onClick={() => handleButtonClick("<")}><IoIosArrowDown  /></button>
        </div>

      </section>

    </div>
  );
}

export default App;
