var buttons = ['(', ')', '%', 'AC',
  '7', '8', '9', '/',
  '4', '5', '6', 'x',
  '1', '2', '3', '-',
  '0', '.', '=', '+'
];

var ops = {
  "%": "%",
  "÷": "/",
  "×": "*",
  "-": "-",
  "+": "+"
};

var text = "",
    button = "",
    op = "",
    acc = "",
    currentTotal = 0,
    hasDecimal = false,
    displayobj = {},
    $display;

$('document').ready(function() {
  console.log("Page Loaded!");

  $display = $("#display");

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

  clearButtonPress();
  
  // For debugging, remove later
  $("#solar-panel").click(function(e){
    console.log("acc["+acc+"]", "text["+text+"]", "op["+op+"]", "currentTotal[" + currentTotal + "]");
  });


  $(".calc-btn").click(function(e) {
    var $button = $(e.target),
        buttonName = $button.attr("name"),
        buttonVal = $button.attr("value");

    $button.blur();
    console.log("[" + buttonName + "] button clicked: " + buttonVal);

    if (buttonName == "clear"){ clearButtonPress(); return 0; }

    // Return early if no more room in display
    if ($display.text().length >= 15) {
      console.log("Display text gte 15: " + $display.text());
      return 0;
    }


    if (buttonName == "digit"){
      digitButtonPress(buttonVal);
    }
    if (buttonName == "op"){
      opButtonPress(buttonVal);
    }
    if (buttonName == "eq"){
      eqButtonPress();
    }
    if (buttonName == "convert" && buttonVal == "percent"){
      currentTotal = currentTotal / 100;
      displayText(currentTotal);
    }

    $("#solar-panel").click();

  });
});

function eqButtonPress(){
  acc = currentTotal;
  op = "";
  displayText(acc);
  text = "";

}

function opButtonPress(value) {
  acc = currentTotal;
  text = "";
  hasDecimal = false;
  op = value;
  displayText(currentTotal);
}

function digitButtonPress(value) {

  if (value == ".") {
    if (hasDecimal){
      return 0;      
    }
    if (!text){
      text = "0";
    }
    hasDecimal = true;
  }

  text += value;

  currentTotal = calculate();
  if (isFloat(currentTotal)){
    currentTotal = parseFloat(currentTotal.toFixed(5));
  }

  displayText(text);
}

function isFloat(num){
  return Number(num) === num && num % 1 !== 0;
}


function clearButtonPress() {
  text = "";
  op = "";
  acc = "";
  currentTotal = 0;
  $display.removeClass("small");
  hasDecimal = false;
  displayText("0");
}

function calculate() {
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
  // Change font size and line height to fit more characters
  if (String(t).length > 9) {
    console.log("Display text longer than 9");
    $display.addClass('small');
  } else if (displayobj.current == "small") {
    console.log("Display text lte 9 and current is small");
    $display.removeClass('small');
    displayobj.current = "normal";
  }
  console.log('t', t);
  $display.text(parseFloat(t));
  $display.text(t);
}
