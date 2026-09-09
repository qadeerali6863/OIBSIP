const form = document.querySelector("#temperature-form");
const input = document.querySelector("#temperature");
const unit = document.querySelector("#input-unit");
const symbol = document.querySelector("#unit-symbol");
const error = document.querySelector("#error-message");

const result = {
  celsius: document.querySelector("#celsius-result"),
  fahrenheit: document.querySelector("#fahrenheit-result"),
  kelvin: document.querySelector("#kelvin-result")
};

const units = {
  celsius: "°C",
  fahrenheit: "°F",
  kelvin: "K"
};

const absoluteZero = {
  celsius: -273.15,
  fahrenheit: -459.67,
  kelvin: 0
};

function format(value) {
  const cleanedValue = Math.abs(value) < 1e-10 ? 0 : value;

  return Number(cleanedValue.toFixed(2)).toLocaleString("en-US", {
    maximumFractionDigits: 2
  });
}

function showError(message) {
  error.textContent = message;
  input.setAttribute("aria-invalid", "true");
}

function clearError() {
  error.textContent = "";
  input.removeAttribute("aria-invalid");
}

function convertTemperature(value, fromUnit) {
  let celsius;

  if (fromUnit === "celsius") {
    celsius = value;
  } else if (fromUnit === "fahrenheit") {
    celsius = (value - 32) * 5 / 9;
  } else {
    celsius = value - 273.15;
  }

  return {
    celsius: celsius,
    fahrenheit: (celsius * 9 / 5) + 32,
    kelvin: celsius + 273.15
  };
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const rawValue = input.value.trim().replace(",", ".");

  if (!rawValue) {
    showError("Please enter a temperature value.");
    return;
  }

  const validNumber = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;

  if (!validNumber.test(rawValue)) {
    showError("Please enter a valid numeric value.");
    return;
  }

  const temperatureValue = Number(rawValue);
  const selectedUnit = unit.value;

  if (temperatureValue < absoluteZero[selectedUnit]) {
    showError(
      `Temperature cannot be below absolute zero (${absoluteZero[selectedUnit]} ${units[selectedUnit]}).`
    );
    return;
  }

  clearError();

  const convertedValues = convertTemperature(
    temperatureValue,
    selectedUnit
  );

  result.celsius.textContent = format(convertedValues.celsius);
  result.fahrenheit.textContent = format(convertedValues.fahrenheit);
  result.kelvin.textContent = format(convertedValues.kelvin);
});

unit.addEventListener("change", function () {
  symbol.textContent = units[unit.value];
  clearError();
});

input.addEventListener("input", clearError);

document.querySelector("#clear-button").addEventListener("click", function () {
  form.reset();

  symbol.textContent = "°C";
  clearError();

  result.celsius.textContent = "—";
  result.fahrenheit.textContent = "—";
  result.kelvin.textContent = "—";

  input.focus();
});