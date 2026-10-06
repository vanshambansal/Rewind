/**
 * calculator.js — Classic 4-operation Windows-era calculator.
 */

import { Icons } from '../icons.js';
import { WindowManager } from '../windowManager.js';

export const CalculatorApp = {

    open() {
        const id = 'calculator';

        const win = WindowManager.createWindow({
            id,
            title: 'Calculator',
            icon: Icons.calculator,
            width: 270,
            height: 330,
            allowMaximize: false,
            content: `
                <div class="calc-container" id="${id}-container" style="padding:8px;background:#c0c0c0;display:flex;flex-direction:column;height:100%;user-select:none;box-sizing:border-box;">
                    <div class="app-menubar" style="margin:-8px -8px 6px -8px;">
                        <span class="app-menu-item menu-edit-btn">Edit</span>
                        <span class="app-menu-item menu-view-btn">View</span>
                        <span class="app-menu-item menu-help-btn">Help</span>
                    </div>

                    <!-- Display -->
                    <div style="background:#fff;border-top:2px solid #808080;border-left:2px solid #808080;border-right:2px solid #fff;border-bottom:2px solid #fff;padding:4px 8px;margin-bottom:8px;text-align:right;">
                        <span class="calc-display" style="font-family:'Courier New', monospace;font-size:18px;font-weight:bold;color:#000;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">0</span>
                    </div>

                    <!-- Top Control Row (Backspace, CE, C) -->
                    <div style="display:flex;gap:4px;margin-bottom:6px;justify-content:space-between;">
                        <div class="calc-mem-indicator" style="width:24px;height:24px;border:1px solid #808080;background:#c0c0c0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:bold;color:#800000;"></div>
                        <div style="display:flex;gap:4px;">
                            <button class="calc-btn btn-backspace" style="width:68px;color:#800000;">Backspace</button>
                            <button class="calc-btn btn-ce" style="width:40px;color:#800000;">CE</button>
                            <button class="calc-btn btn-c" style="width:40px;color:#800000;">C</button>
                        </div>
                    </div>

                    <!-- Keypad Grid -->
                    <div class="calc-grid" style="display:grid;grid-template-columns:repeat(5, 1fr);gap:4px;flex:1;">
                        <button class="calc-btn btn-mem" data-mem="MC" style="color:#800000;">MC</button>
                        <button class="calc-btn btn-num" data-val="7" style="color:#000080;font-weight:bold;">7</button>
                        <button class="calc-btn btn-num" data-val="8" style="color:#000080;font-weight:bold;">8</button>
                        <button class="calc-btn btn-num" data-val="9" style="color:#000080;font-weight:bold;">9</button>
                        <button class="calc-btn btn-op" data-op="/" style="color:#800000;">/</button>

                        <button class="calc-btn btn-mem" data-mem="MR" style="color:#800000;">MR</button>
                        <button class="calc-btn btn-num" data-val="4" style="color:#000080;font-weight:bold;">4</button>
                        <button class="calc-btn btn-num" data-val="5" style="color:#000080;font-weight:bold;">5</button>
                        <button class="calc-btn btn-num" data-val="6" style="color:#000080;font-weight:bold;">6</button>
                        <button class="calc-btn btn-op" data-op="*" style="color:#800000;">*</button>

                        <button class="calc-btn btn-mem" data-mem="MS" style="color:#800000;">MS</button>
                        <button class="calc-btn btn-num" data-val="1" style="color:#000080;font-weight:bold;">1</button>
                        <button class="calc-btn btn-num" data-val="2" style="color:#000080;font-weight:bold;">2</button>
                        <button class="calc-btn btn-num" data-val="3" style="color:#000080;font-weight:bold;">3</button>
                        <button class="calc-btn btn-op" data-op="-" style="color:#800000;">-</button>

                        <button class="calc-btn btn-mem" data-mem="M+" style="color:#800000;">M+</button>
                        <button class="calc-btn btn-num" data-val="0" style="color:#000080;font-weight:bold;">0</button>
                        <button class="calc-btn btn-plusminus" style="color:#000080;">+/-</button>
                        <button class="calc-btn btn-dot" style="color:#000080;font-weight:bold;">.</button>
                        <button class="calc-btn btn-op" data-op="+" style="color:#800000;">+</button>

                        <button class="calc-btn btn-sqrt" style="color:#000080;">sqrt</button>
                        <button class="calc-btn btn-percent" style="color:#000080;">%</button>
                        <button class="calc-btn btn-recip" style="color:#000080;">1/x</button>
                        <button class="calc-btn btn-eq" style="color:#800000;font-weight:bold;grid-column:span 2;">=</button>
                    </div>
                </div>
            `
        });

        this.initCalculatorLogic(win, id);
        return win;
    },

    initCalculatorLogic(win, id) {
        const container = win.querySelector(`#${id}-container`);
        if (!container) return;

        const display = container.querySelector('.calc-display');
        const memIndicator = container.querySelector('.calc-mem-indicator');

        let currentValue = '0';
        let previousValue = null;
        let pendingOp = null;
        let waitingForOperand = false;
        let memory = 0;

        // Apply 3D button styling to all buttons
        container.querySelectorAll('.calc-btn').forEach(btn => {
            btn.style.background = '#c0c0c0';
            btn.style.borderTop = '1px solid #fff';
            btn.style.borderLeft = '1px solid #fff';
            btn.style.borderRight = '1px solid #808080';
            btn.style.borderBottom = '1px solid #808080';
            btn.style.fontSize = '11px';
            btn.style.fontFamily = 'inherit';
            btn.style.cursor = 'pointer';
            btn.style.height = '24px';
            btn.style.padding = '0';

            btn.addEventListener('mousedown', () => {
                btn.style.borderTop = '1px solid #808080';
                btn.style.borderLeft = '1px solid #808080';
                btn.style.borderRight = '1px solid #fff';
                btn.style.borderBottom = '1px solid #fff';
            });

            btn.addEventListener('mouseup', () => {
                btn.style.borderTop = '1px solid #fff';
                btn.style.borderLeft = '1px solid #fff';
                btn.style.borderRight = '1px solid #808080';
                btn.style.borderBottom = '1px solid #808080';
            });
        });

        const updateDisplay = () => {
            display.textContent = currentValue;
        };

        const updateMemory = () => {
            memIndicator.textContent = memory !== 0 ? 'M' : '';
        };

        const inputDigit = (digit) => {
            if (waitingForOperand) {
                currentValue = String(digit);
                waitingForOperand = false;
            } else {
                currentValue = currentValue === '0' ? String(digit) : currentValue + digit;
            }
            updateDisplay();
        };

        const inputDot = () => {
            if (waitingForOperand) {
                currentValue = '0.';
                waitingForOperand = false;
            } else if (!currentValue.includes('.')) {
                currentValue += '.';
            }
            updateDisplay();
        };

        const performOperation = (nextOp) => {
            const inputValue = parseFloat(currentValue);

            if (previousValue === null) {
                previousValue = inputValue;
            } else if (pendingOp) {
                const result = calculate(previousValue, inputValue, pendingOp);
                currentValue = String(result);
                previousValue = result;
                updateDisplay();
            }

            waitingForOperand = true;
            pendingOp = nextOp;
        };

        const calculate = (first, second, op) => {
            let res = 0;
            switch (op) {
                case '+': res = first + second; break;
                case '-': res = first - second; break;
                case '*': res = first * second; break;
                case '/': res = second === 0 ? 'Cannot divide by zero' : first / second; break;
                default: return second;
            }
            if (typeof res === 'number') {
                // Round to avoid float precision artifacts
                return Math.round(res * 1e10) / 1e10;
            }
            return res;
        };

        // Number clicks
        container.querySelectorAll('.btn-num').forEach(btn => {
            btn.addEventListener('click', () => inputDigit(btn.dataset.val));
        });

        // Dot click
        container.querySelector('.btn-dot').addEventListener('click', inputDot);

        // Operator clicks
        container.querySelectorAll('.btn-op').forEach(btn => {
            btn.addEventListener('click', () => performOperation(btn.dataset.op));
        });

        // Equals
        container.querySelector('.btn-eq').addEventListener('click', () => {
            if (pendingOp !== null && previousValue !== null) {
                const inputValue = parseFloat(currentValue);
                currentValue = String(calculate(previousValue, inputValue, pendingOp));
                previousValue = null;
                pendingOp = null;
                waitingForOperand = true;
                updateDisplay();
            }
        });

        // Clear C
        container.querySelector('.btn-c').addEventListener('click', () => {
            currentValue = '0';
            previousValue = null;
            pendingOp = null;
            waitingForOperand = false;
            updateDisplay();
        });

        // Clear Entry CE
        container.querySelector('.btn-ce').addEventListener('click', () => {
            currentValue = '0';
            updateDisplay();
        });

        // Backspace
        container.querySelector('.btn-backspace').addEventListener('click', () => {
            if (currentValue.length > 1 && currentValue !== '0') {
                currentValue = currentValue.slice(0, -1);
            } else {
                currentValue = '0';
            }
            updateDisplay();
        });

        // Plus/Minus
        container.querySelector('.btn-plusminus').addEventListener('click', () => {
            currentValue = String(-parseFloat(currentValue));
            updateDisplay();
        });

        // Sqrt
        container.querySelector('.btn-sqrt').addEventListener('click', () => {
            const val = parseFloat(currentValue);
            currentValue = val < 0 ? 'Invalid Input' : String(Math.sqrt(val));
            waitingForOperand = true;
            updateDisplay();
        });

        // 1/x reciprocal
        container.querySelector('.btn-recip').addEventListener('click', () => {
            const val = parseFloat(currentValue);
            currentValue = val === 0 ? 'Cannot divide by zero' : String(1 / val);
            waitingForOperand = true;
            updateDisplay();
        });

        // Percentage
        container.querySelector('.btn-percent').addEventListener('click', () => {
            const val = parseFloat(currentValue);
            currentValue = String(previousValue ? (previousValue * val / 100) : 0);
            updateDisplay();
        });

        // Memory buttons
        container.querySelectorAll('.btn-mem').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.mem;
                const val = parseFloat(currentValue);
                if (action === 'MC') memory = 0;
                else if (action === 'MR') { currentValue = String(memory); waitingForOperand = true; }
                else if (action === 'MS') { memory = val; waitingForOperand = true; }
                else if (action === 'M+') { memory += val; waitingForOperand = true; }
                updateMemory();
                updateDisplay();
            });
        });

        // Keyboard listener inside calculator window
        win.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') {
                inputDigit(e.key);
            } else if (e.key === '.') {
                inputDot();
            } else if (['+', '-', '*', '/'].includes(e.key)) {
                performOperation(e.key);
            } else if (e.key === 'Enter' || e.key === '=') {
                container.querySelector('.btn-eq').click();
            } else if (e.key === 'Backspace') {
                container.querySelector('.btn-backspace').click();
            } else if (e.key === 'Escape') {
                container.querySelector('.btn-c').click();
            }
        });
    }
};

window.CalculatorApp = CalculatorApp;
