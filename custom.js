
var text = "",
    button = "",
    op = "",
    acc = "",
    chain = true,
    lastTotal =0,
    currentTotal = 0,
    hasDecimal = false,
    displayobj = {},
    $display;

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
  
  // For debugging, remove later
  $("#solar-panel").click(function(e){
    console.log("acc["+acc+"]", "text["+text+"]", "op["+op+"]", "currentTotal[" + currentTotal + "]", "lastTotal[" + lastTotal + "]");
  });

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

    if (buttonName == "op"){
      opButtonPress(buttonVal);
    }
    if (buttonName == "eq"){
      eqButtonPress();
    }
    if (buttonName == "convert" && buttonVal == "percent"){
      if (!text) { text = 0; }
      if (chain) {
        text = parseFloat(text) / 100;
        displayText(text);
        currentTotal = calculate(op);
      } else {
        text = parseFloat(acc) / 100;
        displayText(text);
        currentTotal = text;
        eqButtonPress();
      }
      
    }

    $("#solar-panel").click();

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
  text = "";
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

  // Only allows one decimal to be added
  if (value == ".") {
    if (hasDecimal){
      return 0;      
    }
    if (!text){
      text = "0";
    }
    hasDecimal = true;
  }


  if (text == "0" || !text){
    if (value == "0"){
      return 0;
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
  text = "";
  op = "";
  acc = "";
  display = display || "0";
  lastTotal = 0;
  currentTotal = 0;
  hasDecimal = false;
  chain = true;
  $display.removeClass("small");
  displayText(display);
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
