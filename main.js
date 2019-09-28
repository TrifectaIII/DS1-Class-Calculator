//calculates stat score based on class and goal objects
function scoreClass(classObj,goalsObj) {
    var score = 0;

    //give score for stats which contribute to goals
    Object.keys(goalsObj).forEach(function (stat) {
        if (!(isNaN(goalsObj[stat])) && goalsObj[stat] > 0) {
            score += Math.min(classObj[stat],goalsObj[stat]);
        }
    });

    //subtract score for SL above 1
    score -= classObj.SL-1;

    return score;
}

//generates output 
function genOutput(div, statGoals, classes) {
    var topScore = -9999;
    var topClass = [];

    for (let className in classes) {
        var score = scoreClass(classes[className], statGoals);
        if (score > topScore) {
            topScore = score;
            topClass = [className];
        } else if (score == topScore) {
            topClass.push(className);
        }
    }


    div.innerHTML = topClass;
}

//clears output
function clearOutput(div) {
    div.innerHTML = '';
}

var statList = ['Vitality','Attunement','Endurance','Strength','Dexterity','Resistance','Intelligence','Faith'];

console.log(scoreClass(classes.Warrior,{
    Vitality:0,
    Attunement:0,
    Endurance:40,
    Strength:40,
    Dexterity:40,
    Resistance:0,
    Intelligence:0,
    Faith:NaN,
}));

// use handlebars templating to create all statInputs
var input_template = document.querySelector('.input_template');
var parser = Handlebars.compile(input_template.innerHTML);
var compiled = parser({
    columns:[['Vitality','Endurance','Attunement','Resistance'], 
             ['Strength','Dexterity','Intelligence','Faith'],],
});
var input_section = document.querySelector('.input_section');
input_section.innerHTML = compiled;

//get all statInputs
var statInputs = {};
statList.forEach(function (stat) {
    statInputs[stat] = document.querySelector('.'+stat+'_goal');
});

//init statGoals
var statGoals = {};
statList.forEach(function (stat) {
    statGoals[stat] = NaN;
});

//get cookie data
var saved = cookie.get(statList,NaN);
statList.forEach(function (stat) {
    //if cookie value was saved, place into input
    if (!(isNaN(saved[stat]))){
        statInputs[stat].value = saved[stat];
    }
});

//get output section
var output = document.querySelector('.output_section');

//function to check if input values have changed
function anyChange (statInputs, statGoals) {
    for (let stat in statGoals) {
        if (parseInt(statInputs[stat].value) != statGoals[stat]) {
            return true;
        }
    }
    return false;
}

//sets all statGoals to new input statGoals, cookies too
function setValues (statInputs, statGoals) {
    for (let stat in statGoals) {
        statGoals[stat] = parseInt(statInputs[stat].value)
        cookie.set(stat,statGoals[stat],{expires:7});
    }
}

function anyValid (statGoals) {
    for (let stat in statGoals) {
        if (!(isNaN(statGoals[stat])) && statGoals[stat] > 0) {
            return true;
        }
    }
    return false;
}

//Update Output when some statInputs are valid
setInterval(function () {
    //only check when statInputs change
    if (anyChange(statInputs,statGoals)) {
        //when change, set statGoals and cookies
        setValues(statInputs,statGoals);
        if (anyValid(statGoals)) {
            genOutput(output, statGoals, classes);
        } else {
            clearOutput(output);
        }
    }
}, 250);