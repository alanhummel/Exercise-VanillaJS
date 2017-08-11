var baseCurrency = "", inputCurrency = "",
    outputCurrency = "", inputValue = null, outputValue = null,
    inputSelect = null, outputSelect = null;
var currencyJSONData = null;

function preloadCurrentCurrency() {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        // Verify the server status
        if (request.readyState != 4 || request.status != 200) {
            fixerDown();
            return;
        } else {
            setupPrices(request.responseText);
            fixerUp();
        }
    };
    request.open("GET", fixerAddress, true);
    request.send();
}

function initialize() {
    inputValue = document.getElementById("inputValue");
    outputValue = document.getElementById("outputValue");
    // Preload the first values
    inputSelect = document.getElementById("inputCurrency");
    outputSelect = document.getElementById("outputCurrency");
    inputCurrency = inputSelect.options[inputSelect.selectedIndex].value;
    outputCurrency = outputSelect.options[outputSelect.selectedIndex].value;

    preloadCurrentCurrency();
}

// While the fixer.io json data was not loaded, the interface is off.
function fixerDown() {
    inputValue.disabled = true;
    inputSelect.disabled = true;
    outputSelect.disabled = true;
}

// The fixer.io json data was loaded, turning the interface back on.
function fixerUp() {
    inputValue.disabled = false;
    inputSelect.disabled = false;
    outputSelect.disabled = false;
}

function setupPrices(currencyData) {
    if(currencyData) {
        try {
            currencyJSONData = JSON.parse(currencyData);
            baseCurrency = currencyJSONData.base;
        } catch(e) {
            console.log(e);
        }
    }
}

// Change the current monetary exchange input
function onChangeInputCurrency(value) {
    if (baseCurrency == "") {
        console.log("Unable to communicate with currency systems. Please try again later.");
        return;
    }
    inputCurrency = value;

    calculateCurrency();
}

// Change the current monetary exchange output
function onChangeOutputCurrency(value) {
    if (baseCurrency == "") {
        console.log("Unable to communicate with currency systems. Please try again later.");
        return;
    }
    outputCurrency = value;

    calculateCurrency();
}

// The core function for calculating the exchange values and outputting it on the component
function calculateCurrency() {
    //outputValue.value = inputValue.value;
    var rates = currencyJSONData.rates;
    var inputCurrencyRate,outputCurrencyRate;
    // Defines the base value as 1.00 for the base currency
    rates[baseCurrency] = 1.00;

    inputCurrencyRate = rates[inputCurrency];
    outputCurrencyRate = rates[outputCurrency];

    // Calculate the appropriate value and set to 2 decimal places
    outputValue.value = (inputValue.value*outputCurrencyRate/(inputCurrencyRate))
        .toFixed(2);
}

initialize();
