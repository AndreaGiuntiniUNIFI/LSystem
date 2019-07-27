//Get rules from parsed string
function getTreeAxiom(string) {

  var result = rules.axiom;

  for (var i = 0; i < params.iterations; i++) {
    var localResult = "";
    for (var j = 0; j < result.length; j++) {
      var char = result.charAt(j);
      var rule = string[char];
      if (rule !== undefined) 
        localResult += randomChoice(rule);
      else 
        localResult += char;
    }
    result = localResult;
  }
  return result;
}

//Parse input string
function getRules(rules) {
  var result = {};
  rules.split(" ").forEach(function (a) {
    var line = a.split("=");
    if (!result[line[0]]) {
      result[line[0]] = [];
    }
    result[line[0]].push(line[1])
  });

  return result;
}

//Stocastic implementation
function randomChoice(rules) {
  var probability = rules.length;
  var choice = probability > 1 ?
    parseInt((((Math.random() * probability) + 1) * 1000) / 1000) - 1 : 0;

  return rules[choice];
}