"use strict";
class Calculator {
  constructor() { this.clear(); }
  clear() {
    this.display = "0";
    this.accumulator = null;
    this.operator = null;
    this.waitingForOperand = false;
    this.justEvaluated = false;
    this.error = "";
  }
  addDigit(digit) {
    if (!/^[0-9.]$/.test(digit)) return;
    if (this.error) this.clear();
    if (this.waitingForOperand || this.justEvaluated) {
      this.display = "0";
      this.waitingForOperand = false;
      this.justEvaluated = false;
    }
    if (digit === ".") {
      if (!this.display.includes(".")) this.display += ".";
    } else if (this.display.replace(".", "").replace("-", "").length < 15) {
      this.display = this.display === "0" ? digit : this.display + digit;
    }
  }
  calculate(left, right, operator) {
    if (operator === "/" && right === 0) throw new Error("Não é possível dividir por zero.");
    const operations = {
      "+": () => left + right,
      "-": () => left - right,
      "*": () => left * right,
      "/": () => left / right
    };
    const result = operations[operator]();
    if (!Number.isFinite(result)) throw new Error("Resultado fora do limite.");
    return Number(result.toPrecision(12));
  }
  processOperation(operation) {
    if (operation === "C") { this.clear(); return; }
    if (this.error) return;
    if (operation === "DEL") {
      if (this.waitingForOperand) return;
      this.display = this.display.slice(0, -1);
      if (!this.display || this.display === "-") this.display = "0";
      this.justEvaluated = false;
      return;
    }
    if (operation === "CE") {
      this.display = "0";
      this.waitingForOperand = false;
      this.justEvaluated = false;
      return;
    }
    if (!["+", "-", "*", "/", "="].includes(operation)) return;
    try {
      const current = Number(this.display);
      if (operation === "=") {
        if (!this.operator || this.accumulator === null || this.waitingForOperand) return;
        this.display = String(this.calculate(this.accumulator, current, this.operator));
        this.accumulator = null;
        this.operator = null;
        this.justEvaluated = true;
        return;
      }
      if (this.operator && !this.waitingForOperand) {
        this.display = String(this.calculate(this.accumulator, current, this.operator));
      }
      this.accumulator = Number(this.display);
      this.operator = operation;
      this.waitingForOperand = true;
      this.justEvaluated = false;
    } catch (error) {
      this.error = error.message;
      this.accumulator = null;
      this.operator = null;
    }
  }
}
if (typeof module !== "undefined" && module.exports) module.exports = { Calculator };
if (typeof document !== "undefined") {
  const calc = new Calculator();
  const previous = document.querySelector("#previous-operation");
  const current = document.querySelector("#current-operation");
  function render() {
    previous.textContent = calc.accumulator !== null ? calc.accumulator + " " + calc.operator : "";
    current.textContent = calc.error || calc.display;
  }
  function press(value) {
    if (/^[0-9.]$/.test(value)) calc.addDigit(value);
    else calc.processOperation(value);
    render();
  }
  document.querySelectorAll("#buttons-container button").forEach(button => {
    button.addEventListener("click", () => press(button.textContent.trim()));
  });
  document.addEventListener("keydown", event => {
    if (event.ctrlKey || event.metaKey || event.altKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    const aliases = { Enter: "=", Escape: "C", Backspace: "DEL", Delete: "CE", ",": "." };
    const value = aliases[event.key] || event.key;
    if (/^[0-9.+*/=-]$/.test(value) || ["C", "CE", "DEL"].includes(value)) {
      event.preventDefault();
      press(value);
    }
  });
  render();
}
