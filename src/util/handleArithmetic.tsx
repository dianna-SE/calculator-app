type EvalResult = {
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
                  return { value: NaN, status: "OVERFLOW", message: "Result exceeds maximum safe integer" };
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


  function handleArithmetic(x: string, y: string, operation: string): EvalResult {
    switch(operation) {
        case "+":
        case "-":
            return evaluateAddSubtract(x, y, operation);
        case "x":
        case "/":
            return evaluateMultiplyDivide(x, y, operation);
        case "^":
            return evaluateExponentiation(x, y, operation);
        case "%":
            return evaluateModulo(x, y, operation);
        case "√":
            return evaluateRadical(x, y, operation);
        default:
            return { value: 0, status: "ERROR", message: "Unknown operation" };
    }
}

export {
    handleArithmetic,
    formatResult,
    EvalResult
};