const originalArray = [25, 10, 45, 5, 30, 15];
let numbers = [...originalArray];

const currentArrayEl = document.getElementById("currentArray");
const operationOutput = document.getElementById("operationOutput");
const methodOutput = document.getElementById("methodOutput");
const loopOutput = document.getElementById("loopOutput");
const valueInput = document.getElementById("valueInput");

function renderArray(element, arr) {
  element.innerHTML = "";

  if (arr.length === 0) {
    element.innerHTML = "<span>Array is empty</span>";
    return;
  }

  arr.forEach(value => {
    const item = document.createElement("span");
    item.className = "array-item";
    item.textContent = value;
    element.appendChild(item);
  });
}

function getValue() {
  const value = valueInput.value.trim();

  if (value === "") {
    return 50;
  }

  const number = Number(value);
  return Number.isNaN(number) ? value : number;
}

function updateCurrentArray() {
  renderArray(currentArrayEl, numbers);
}

// Task A: push()
function pushElement() {
  const value = getValue();
  numbers.push(value);
  operationOutput.textContent =
    `push(${value}) → element added to the end.\nNew Array: [${numbers.join(", ")}]`;
  updateCurrentArray();
}

// Task A: pop()
function popElement() {
  const removed = numbers.pop();
  operationOutput.textContent =
    `pop() → removed: ${removed ?? "undefined"}\nNew Array: [${numbers.join(", ")}]`;
  updateCurrentArray();
}

// Task A: shift()
function shiftElement() {
  const removed = numbers.shift();
  operationOutput.textContent =
    `shift() → removed: ${removed ?? "undefined"}\nNew Array: [${numbers.join(", ")}]`;
  updateCurrentArray();
}

// Task A: unshift()
function unshiftElement() {
  const value = getValue();
  numbers.unshift(value);
  operationOutput.textContent =
    `unshift(${value}) → element added to the beginning.\nNew Array: [${numbers.join(", ")}]`;
  updateCurrentArray();
}

// Task A: splice()
function spliceElement() {
  if (numbers.length === 0) {
    operationOutput.textContent = "splice() → array is empty.";
    return;
  }

  const index = Math.min(2, numbers.length - 1);
  const removed = numbers.splice(index, 1, getValue());

  operationOutput.textContent =
    `splice(${index}, 1, value) → replaced the element at index ${index}.\n` +
    `Removed: ${removed.join(", ")}\nNew Array: [${numbers.join(", ")}]`;

  updateCurrentArray();
}

// Task A: slice()
function sliceArray() {
  const start = 1;
  const end = Math.min(4, numbers.length);
  const result = numbers.slice(start, end);

  operationOutput.textContent =
    `slice(${start}, ${end}) → creates a copy from index ${start} to ${end - 1}.\n` +
    `Result: [${result.join(", ")}]\nOriginal Array remains: [${numbers.join(", ")}]`;
}

// Task B: map()
function mapArray() {
  const result = numbers.map(number => {
    return typeof number === "number" ? number * 2 : number;
  });

  methodOutput.textContent =
    `map() → doubles every numeric value.\nResult: [${result.join(", ")}]`;
}

// Task B: filter()
function filterArray() {
  const result = numbers.filter(number => {
    return typeof number === "number" && number > 20;
  });

  methodOutput.textContent =
    `filter() → keeps numeric values greater than 20.\nResult: [${result.join(", ")}]`;
}

// Task B: reduce()
function reduceArray() {
  const result = numbers.reduce((sum, number) => {
    return typeof number === "number" ? sum + number : sum;
  }, 0);

  methodOutput.textContent =
    `reduce() → adds all numeric values.\nSum: ${result}`;
}

// Task B: forEach()
function forEachArray() {
  let output = "";

  numbers.forEach((value, index) => {
    output += `Index ${index}: ${value}\n`;
  });

  methodOutput.textContent =
    `forEach() → visits every array element.\n${output || "Array is empty."}`;
}

// Case study: maximum and minimum
function findMaxMin() {
  if (originalArray.length === 0) {
    return;
  }

  const maximum = Math.max(...originalArray);
  const minimum = Math.min(...originalArray);

  document.getElementById("maxValue").textContent = maximum;
  document.getElementById("minValue").textContent = minimum;
}

// for loop
function runForLoop() {
  let output = "";

  for (let i = 0; i < numbers.length; i++) {
    output += numbers[i] + (i < numbers.length - 1 ? " → " : "");
  }

  loopOutput.textContent = `for loop:\n${output || "Array is empty."}`;
}

// while loop
function runWhileLoop() {
  let i = 0;
  let output = [];

  while (i < numbers.length) {
    output.push(numbers[i]);
    i++;
  }

  loopOutput.textContent =
    `while loop:\n${output.length ? output.join(" → ") : "Array is empty."}`;
}

// do...while loop
function runDoWhileLoop() {
  let i = 0;
  let output = [];

  if (numbers.length > 0) {
    do {
      output.push(numbers[i]);
      i++;
    } while (i < numbers.length);
  }

  loopOutput.textContent =
    `do...while loop:\n${output.length ? output.join(" → ") : "Array is empty."}`;
}

// Manipulation buttons
document.querySelectorAll("[data-action]").forEach(button => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;

    const actions = {
      push: pushElement,
      pop: popElement,
      shift: shiftElement,
      unshift: unshiftElement,
      splice: spliceElement,
      slice: sliceArray
    };

    actions[action]();
  });
});

// Array method buttons
document.querySelectorAll("[data-method]").forEach(button => {
  button.addEventListener("click", () => {
    const methods = {
      map: mapArray,
      filter: filterArray,
      reduce: reduceArray,
      forEach: forEachArray
    };

    methods[button.dataset.method]();
  });
});

// Loop buttons
document.querySelectorAll("[data-loop]").forEach(button => {
  button.addEventListener("click", () => {
    const loops = {
      for: runForLoop,
      while: runWhileLoop,
      doWhile: runDoWhileLoop
    };

    loops[button.dataset.loop]();
  });
});

document.getElementById("caseStudyBtn").addEventListener("click", findMaxMin);

document.getElementById("resetBtn").addEventListener("click", () => {
  numbers = [...originalArray];
  updateCurrentArray();
  operationOutput.textContent = "Array reset to [25, 10, 45, 5, 30, 15].";
  methodOutput.textContent = "Select an array method to see the result.";
  loopOutput.textContent = "Select a loop to see its output.";
});

valueInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    pushElement();
  }
});

// Initial display
renderArray(document.getElementById("caseArray"), originalArray);
updateCurrentArray();
