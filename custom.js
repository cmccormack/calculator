
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

  $(".calc-btn").click(function(e) { buttonPress($(e.target)); });
    // var $button = $(e.target),
    //     buttonName = $button.attr("name"),
    //     buttonVal = $button.attr("value");

    // $button.blur();
    // console.log("[" + buttonName + "] button clicked: " + buttonVal);

    // if (buttonName == "clear"){ clearButtonPress(); }
    // else if (buttonName == "digit"){ digitButtonPress(buttonVal); }
    // else if (buttonName == "op"){ opButtonPress(buttonVal); }
    // else if (buttonName == "convert"){ convertValue(text, conversions[buttonVal]); }
    // else if (buttonName == "eq"){ eqButtonPress(); }

    // debugoutput();

  // });
});

function buttonPress($target){
  var $button = $target,
      buttonName = $button.attr("name"),
      buttonVal = $button.attr("value");

  $button.blur();
  console.log("[" + buttonName + "] button clicked: " + buttonVal);

  if (buttonName == "clear"){ clearButtonPress(); }
  else if (buttonName == "digit"){ digitButtonPress(buttonVal); }
  else if (buttonName == "op"){ opButtonPress(buttonVal); }
  else if (buttonName == "convert"){ convertValue(text, conversions[buttonVal]); }
  else if (buttonName == "eq"){ eqButtonPress(); }

  debugoutput();
}


function eqButtonPress(){
  acc = currentTotal;
  chain = false;
  currentTotal = calculate(op);
  text = String(parseFloat(text));
  displayText(acc);
}


function opButtonPress(value) {
  
  if (!chain) { currentTotal = acc; }
  acc = currentTotal;
  text = "0";
  hasDecimal = false;
  chain = true;
  op = value;
  displayText(currentTotal);
}


function digitButtonPress(value) {

  // Apply color effect and return early if no more room in display
  if (text.length >= 15) {
    console.log("Display text gte 15: " + $display.text());
    $("#display").css("background-color", "#D55");
    $("#display").animate({
      backgroundColor: "#EEE"
    });
    return 0;
  }
  
  // Start new chain of calculations if equals was pressed with no new op
  if (!chain){
    clearButtonPress();
  }

  // Add decimal if no decimal exists and set flag
  if (value == "."){
    if (hasDecimal){
      value = "";
    } else {
      hasDecimal = true;
    }
  } 
  
  // Allows text to be replaced by value if text is default "0" and no decimal
  if (text === "0"){
    if (!hasDecimal){
      text = "";
    } 
  } 

  // Append value to text, then calculate the potential total and display text
  text += value;
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
    case "div":
      return acc / t;
    case "add":
      return acc + t;
    case "sub":
      return acc - t;
    case "power":
      return Math.pow(acc, t);
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
  if (acc >= Math.pow(10, 100) || (acc <= Math.pow(10,-100) && acc > 0) ){
    clearButtonPress("ERROR");
    return 0;
  }

  if (isFloat(currentTotal)){
    currentTotal = parseFloat(currentTotal.toPrecision(1 + 7));
  }
  if (isFloat(t)){
    t = String(parseFloat(t.toPrecision(1 + 7)));
  }
  if (isFloat(acc)){
    acc = parseFloat(acc.toPrecision(1 + 7));
  }

  // Change font size and line height to fit more characters
  if (String(t).length > 9) {
    console.log("Display text longer than 9");
    $display.addClass('small');
  } else {
    $display.removeClass('small');
  }

  if (String(t).indexOf('e') !== -1){
    t = Number(t).toPrecision(1 + 7);
  }
  $display.text(t);
  
}


function convertValue(val, func){

  if (chain) {
    text = func(val);
    displayText(text);
    currentTotal = calculate(op);
  } else {
    currentTotal = func(acc);
    text = currentTotal;
    eqButtonPress();
  }
}

// For debugging, remove later
function debugoutput (){
  console.log("acc["+acc+"]", "text["+text+"]", "op["+op+"]", 
    "currentTotal[" + currentTotal + "]", 
    "text type: [" + typeof text + "]", "hasDecimal[" + hasDecimal + "]");
}