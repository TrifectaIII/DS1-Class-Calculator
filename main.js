//calculates stat score based on class and goal objects
function calcClass(classObj,goalsObj) {
    var score = 0;
    var final_level = classObj.SL;

    //give score for stats which contribute to goals
    Object.keys(goalsObj).forEach(function (stat) {
        if (!(isNaN(goalsObj[stat])) && goalsObj[stat] > 0) {
            if (classObj[stat] < goalsObj[stat]) {
                score += classObj[stat];
                final_level += goalsObj[stat] - classObj[stat];
            } else {
                score += goalsObj[stat];
            }
        }
    });

    //subtract score for SL above 1
    score -= classObj.SL-1;

    return {score:score, final_level:final_level};
}

//generates output 
function genOutput(div, parser, statGoals, classes) {
    var topScore = 0;
    var topClass = [];
    var minLevel;

    for (let className in classes) {
        //compare each class with goals
        var compare = calcClass(classes[className], statGoals);


        if (compare.score > topScore) {
            topScore = compare.score;
            topClass = [className];
            minLevel = compare.final_level;
        } else if (compare.score == topScore) {
            topClass.push(className);
        }
    }

    var classInfo = {};

    topClass.forEach(function (className) {
        classInfo[className] = classes[className].link;
    });

    div.innerHTML = parser({
        SL:minLevel,
        classinfo:classInfo,
        many:(topClass.length > 1)
    });

    //remove classs links from tab order
    // document.querySelectorAll('.class_link').forEach(function (link) {
    //     link.tabIndex = -1;
    // });
}

//clears output
function clearOutput(div) {
    div.innerHTML = '';
}

var statList = ['Vitality','Attunement','Endurance','Strength','Dexterity','Resistance','Intelligence','Faith'];

// use handlebars templating to create all statInputs
var input_parser = Handlebars.compile(document.querySelector('.input_template').innerHTML);
document.querySelector('.input_section').innerHTML = input_parser({
    columns:[['Vitality','Endurance'],
            ['Strength','Dexterity'],
            ['Intelligence','Faith'],
            ['Attunement','Resistance']],
});

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
var output_parser = Handlebars.compile(document.querySelector('.output_template').innerHTML);
var output = document.querySelector('.output_section');

//function to check if input values have changed
function anyChange (statInputs, statGoals) {
    for (let stat in statGoals) {
        let inputVal = parseInt(statInputs[stat].value);
        let savedVal = statGoals[stat];
        if (inputVal != savedVal && (!isNaN(inputVal) || !isNaN(savedVal))) {
            return true;
        }
    }
    return false;
}

//sets all statGoals to new input statGoals, cookies too
//also force over 99 back to 99, 0 to 0
function setValues (statInputs, statGoals) {
    for (let stat in statGoals) {
        if (parseInt(statInputs[stat].value) > 99) {
            statInputs[stat].value = 99;
        }
        if (parseInt(statInputs[stat].value) < 0) {
            statInputs[stat].value = 0;
        }
        statGoals[stat] = parseInt(statInputs[stat].value);
        cookie.set(stat,statGoals[stat],{expires:7});
    }
}

//checks if at least 1 of the inputs has a valid value
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
            genOutput(output, output_parser, statGoals, classes);
        } else {
            clearOutput(output);
        }
    }
}, 250);

// reset button
var reset_button = document.querySelector('.reset_button');

//button setup
reset_button.addEventListener('click', function () {
    for (let stat in statInputs) {
        statInputs[stat].value = '';
    }
});

//remove button from tab order
reset_button.tabIndex = -1;

//remove links from tab order
document.querySelectorAll('a').forEach(function (link) {
    link.tabIndex = -1;
});