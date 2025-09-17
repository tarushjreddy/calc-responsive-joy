import { useState, useCallback } from 'react';
import { CalcButton } from './CalcButton';
import { Card } from '@/components/ui/card';

type OperatorType = '+' | '-' | '×' | '÷' | null;

export const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<OperatorType>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [error, setError] = useState(false);

  const inputNumber = useCallback((num: string) => {
    if (error) {
      setDisplay(num);
      setError(false);
      setWaitingForOperand(false);
      return;
    }

    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  }, [display, waitingForOperand, error]);

  const inputDecimal = useCallback(() => {
    if (error) {
      setDisplay('0.');
      setError(false);
      setWaitingForOperand(false);
      return;
    }

    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand, error]);

  const clear = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setError(false);
  }, []);

  const allClear = useCallback(() => {
    clear();
  }, [clear]);

  const backspace = useCallback(() => {
    if (error) {
      clear();
      return;
    }

    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }, [display, error, clear]);

  const percentage = useCallback(() => {
    if (error) return;
    
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  }, [display, error]);

  const inputOperator = useCallback((nextOperator: OperatorType) => {
    if (error) {
      setError(false);
      setDisplay('0');
    }

    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator && !waitingForOperand) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operator);

      if (newValue === null) {
        setError(true);
        setDisplay('Error');
        setPreviousValue(null);
        setOperator(null);
        setWaitingForOperand(false);
        return;
      }

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  }, [display, previousValue, operator, waitingForOperand, error]);

  const calculate = (firstValue: number, secondValue: number, operator: OperatorType): number | null => {
    switch (operator) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        if (secondValue === 0) return null; // Division by zero
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = useCallback(() => {
    if (error) return;

    const inputValue = parseFloat(display);

    if (previousValue !== null && operator) {
      const newValue = calculate(previousValue, inputValue, operator);
      
      if (newValue === null) {
        setError(true);
        setDisplay('Error');
        setPreviousValue(null);
        setOperator(null);
        return;
      }

      setDisplay(String(newValue));
      setPreviousValue(newValue);
      setOperator(null);
      setWaitingForOperand(true);
    }
  }, [display, previousValue, operator, error]);

  // Format display value for better UX
  const formatDisplay = (value: string) => {
    if (value === 'Error') return value;
    
    // Handle very long numbers
    if (value.length > 12) {
      const num = parseFloat(value);
      if (Math.abs(num) > 999999999999) {
        return num.toExponential(5);
      }
      return parseFloat(value).toFixed(8);
    }
    
    return value;
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card className="bg-gradient-card border-border/50 shadow-2xl backdrop-blur-lg">
        <div className="p-6 space-y-6">
          {/* Display */}
          <div className="bg-calc-display rounded-2xl p-6 shadow-display border border-border/30">
            <div className={`text-right text-4xl sm:text-5xl font-mono font-light tracking-wide ${
              error ? 'text-destructive' : 'text-foreground'
            } break-all`}>
              {formatDisplay(display)}
            </div>
          </div>

          {/* Button Grid */}
          <div className="grid grid-cols-4 gap-3">
            {/* Row 1 */}
            <CalcButton variant="special" onClick={allClear}>
              AC
            </CalcButton>
            <CalcButton variant="special" onClick={backspace}>
              ⌫
            </CalcButton>
            <CalcButton variant="special" onClick={percentage}>
              %
            </CalcButton>
            <CalcButton variant="operator" onClick={() => inputOperator('÷')}>
              ÷
            </CalcButton>

            {/* Row 2 */}
            <CalcButton variant="number" onClick={() => inputNumber('7')}>
              7
            </CalcButton>
            <CalcButton variant="number" onClick={() => inputNumber('8')}>
              8
            </CalcButton>
            <CalcButton variant="number" onClick={() => inputNumber('9')}>
              9
            </CalcButton>
            <CalcButton variant="operator" onClick={() => inputOperator('×')}>
              ×
            </CalcButton>

            {/* Row 3 */}
            <CalcButton variant="number" onClick={() => inputNumber('4')}>
              4
            </CalcButton>
            <CalcButton variant="number" onClick={() => inputNumber('5')}>
              5
            </CalcButton>
            <CalcButton variant="number" onClick={() => inputNumber('6')}>
              6
            </CalcButton>
            <CalcButton variant="operator" onClick={() => inputOperator('-')}>
              -
            </CalcButton>

            {/* Row 4 */}
            <CalcButton variant="number" onClick={() => inputNumber('1')}>
              1
            </CalcButton>
            <CalcButton variant="number" onClick={() => inputNumber('2')}>
              2
            </CalcButton>
            <CalcButton variant="number" onClick={() => inputNumber('3')}>
              3
            </CalcButton>
            <CalcButton variant="operator" onClick={() => inputOperator('+')}>
              +
            </CalcButton>

            {/* Row 5 */}
            <CalcButton variant="number" onClick={() => inputNumber('0')} className="col-span-2">
              0
            </CalcButton>
            <CalcButton variant="number" onClick={inputDecimal}>
              .
            </CalcButton>
            <CalcButton variant="equals" onClick={performCalculation}>
              =
            </CalcButton>
          </div>
        </div>
      </Card>
    </div>
  );
};