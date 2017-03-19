
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
      "sign": function(val){ return val -= (val * 2); },
      "del": function(val) {
        val = String(val).slice(0, val.length - 1);
        if (!val) { val = "0"; };
        return val;
      }
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



  $(".calc-btn").click(function(e) { 
    var $button = $(e.target);
    buttonPress($button.attr("name"), $button.attr("value"), $button); 
  });

  // Default the current variables and display screen text
  buttonPress("clear");

  $(this).keyup(function(e) { keyPress(e.which); });

});

var numpadKeys = {
  "8": "del", "46": "del",
  "13": "eq", "187": "eq",
  "53": "percent",
  "106": "mult",
  "107": "add",
  "109": "sub", "189": "sub",
  "110": ".", "190": ".",
  "111": "div", "191": "div"
}

function keyPress(key){
  var offset = 48,
      numpadOffset = 96,
      keyStr;

  if (key - offset >= 0 && key - offset <= 9) {
    keyStr = String(key - offset);
  } else if (key - numpadOffset >= 0 && key - numpadOffset <= 9){
    keyStr = String(key - numpadOffset);
  } else {
    if (numpadKeys.hasOwnProperty(key)){
      keyStr = String(numpadKeys[key]);
    }
  }

  if (keyStr == "del"){
    buttonPress("convert", "del");
  } else {
    $("[value='" + keyStr + "']").click();
  }
  
  console.log("Keyboard Key Pressed: " + key + "(" + typeof key + ")");
}


function buttonPress(buttonName, buttonVal, $target){

  if ($target){ $target.blur(); }
  console.log("[" + buttonName + "] button clicked: " + buttonVal);

  if (buttonName == "clear"){ clearButtonPress(); }
  else if (buttonName == "del"){ backspaceButtonPress(); }
  else if (buttonName == "digit"){ digitButtonPress(buttonVal); }
  else if (buttonName == "op"){ opButtonPress(buttonVal); }
  else if (buttonName == "convert"){ convertValue(text, conversions[buttonVal]); }
  else if (buttonName == "eq"){ eqButtonPress(); }

  debugoutput();
}


// function backspaceButtonPress(){
//   text = text.slice(0, text.length - 1);
//   if (!text) { text = "0"; };
//   currentTotal = calculate(op);
//   displayText(text);
// }

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
}


function calculate(op) {
  var t = parseFloat(text),
      total = t;
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


// Attribution goes to Dagg Nabbit @ http://stackoverflow.com/a/3885844
function isFloat(n){
  return n === +n && n !== (n|0);
}


function convertFloat(val, prec){
  prec = prec || 7;
  if (isFloat(val)){
    return parseFloat(val.toPrecision(prec));
  }
  return val;
}


function displayText(t) {

  // Error out if current total is gte 10^100
  if (acc >= Math.pow(10, 100) || (acc <= Math.pow(10,-100) && acc > 0) ){
    clearButtonPress("ERROR");
    return 0;
  }

  // Remove some precision to keep the answer short
  currentTotal = convertFloat(currentTotal);
  t = String(convertFloat(t));
  acc = convertFloat(acc);

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

  if (chain) {
    text = func(val);
    displayText(text);
    currentTotal = calculate(op);
  } else {
    currentTotal = parseFloat(func(acc));
    text = String(currentTotal);
    eqButtonPress();
  }
}

// For debugging, remove later
function debugoutput (){
  console.log("acc["+acc+"]", "text["+text+"]", "op["+op+"]", 
    "currentTotal[" + currentTotal + "]", 
    "text type: [" + typeof text + "]", "hasDecimal[" + hasDecimal + "]",
    "chain[" + chain + "]");
}