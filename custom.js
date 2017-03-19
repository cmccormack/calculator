
var text = "",
    button = "",
    op = "",
    acc = "",
    chain = true,
    lastTotal =0,
    currentTotal = 0,
    hasDecimal = false,
    displayobj = {},
    $display,
    conversions = {
      "percent": function(val){ return parseFloat(val) / 100; },
      "sign": function(val){ return val -= (val * 2); }
    };

$('document').ready(function() {
  console.log("Page Loaded!");

  $display = $("#display");

  // Captures the current display font size for later use
  displayobj = {
    "normal": {
      "font-size": $display.css("font-size"),
      "line-height": $display.css("line-height")
    },
    "small": {
      "font-size": '32px',
      "line-height": '60px'
    },
    current: "normal"
  };

  // Default the current variables and display screen text
  clearButtonPress();
  



  $(".calc-btn").click(function(e) {
    var $button = $(e.target),
        buttonName = $button.attr("name"),
        buttonVal = $button.attr("value");

    $button.blur();
    console.log("[" + buttonName + "] button clicked: " + buttonVal);

    if (buttonName == "clear"){ clearButtonPress(); return 0; }
    if (buttonName == "digit"){
      // Return early if no more room in display
      if (String(text).length >= 15) {
        console.log("Display text gte 15: " + $display.text());
        return 0;
      }
      digitButtonPress(buttonVal);
    }
    if (buttonName == "op"){ opButtonPress(buttonVal); }
    if (buttonName == "eq"){ eqButtonPress(); }
    if (buttonName == "convert"){ convertValue(text, conversions[buttonVal]); }

    debugoutput();

  });
});

function eqButtonPress(){
  acc = currentTotal;
  chain = false;
  lastTotal = currentTotal;
  if (text) { currentTotal = calculate(op); }
  
  displayText(acc);

}


function opButtonPress(value) {
  if (!chain) { currentTotal = acc; }
  acc = currentTotal;
  text = "0";
  hasDecimal = false;
  chain = true;
  op = value;
  lastTotal = currentTotal;
  displayText(currentTotal);
}


function digitButtonPress(value) {

  if (!chain){
    clearButtonPress();
  }

  if (value == "."){
    if (hasDecimal){
      value = "";
    } else {
      hasDecimal = true;
    }
  } 
  
  if (text === "0"){
    if (!hasDecimal){
      text = "";
    } 
  } 

  text += value;

  // Keeps running total
  currentTotal = calculate(op);

  displayText(text);
}


function isFloat(num){
  return Number(num) === num && num % 1 !== 0;
}


function clearButtonPress(display) {
  text = "0";
  op = "";
  acc = "";
  display = display || "0";
  lastTotal = 0;
  currentTotal = 0;
  hasDecimal = false;
  chain = true;
  $display.removeClass("small");
  displayText(display);
  debugoutput();
}


function calculate(op) {
  var t = parseFloat(text);
  switch (op) {
    case "mult":
      return acc * t;
      break;
    case "div":
      return acc / t;
      break;
    case "add":
      return acc + t;
      break;
    case "sub":
      return acc - t;
      break;
    case "power":
      return Math.pow(acc, t);
      break;
    default:
      return t;
  }
}

function setDisplay(obj) {
  $display.css("font-size", obj['font-size']);
  $display.css('line-height', obj['line-height']);
}


function displayText(t) {

  // Error out if current total is gte 10^100
  if (currentTotal >= Math.pow(10, 100)) {
    clearButtonPress("ERROR");
    return 0;
  }

  if (isFloat(currentTotal)){
    currentTotal = parseFloat(currentTotal.toFixed(14));
  }

  // Change font size and line height to fit more characters
  if (String(t).length > 9) {
    console.log("Display text longer than 9");
    $display.addClass('small');
  } else {
    $display.removeClass('small');
  }

  $display.text(t);
}


function convertValue(val, func){
  console.log("val: " + text);
  text = func(val);
  console.log("val: " + text);
  displayText(text);

  if (chain) {
    currentTotal = calculate(op);
  } else {
    currentTotal = text;
    eqButtonPress();
  }
}

// For debugging, remove later
function debugoutput (){
  console.log("acc["+acc+"]", "text["+text+"]", "op["+op+"]", 
    "currentTotal[" + currentTotal + "]", "lastTotal[" + lastTotal + "]", 
    "text type: [" + typeof text + "]", "hasDecimal[" + hasDecimal + "]");
}