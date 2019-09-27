//calculates stat score based on class and goal objects
function scoreClass(classObj,goalsObj, statList) {
    var score = 0;

    //give score for stats which contribute to goals
    statList.forEach(function (stat) {
        if (!(isNaN(goalsObj[stat])) && goalsObj[stat] > 0) {
            score += Math.min(classObj[stat],goalsObj[stat]);
        }
    });

    //subtract score for SL above 1
    score -= classObj.SL-1;

    return score;
}

//generates output 
function genOutput(div) {
    div.innerHTML = 'genOutput() not implemented yet.';
}

//clears output
function clearOutput(div) {
    div.innerHTML = '';
}

var statList = ['Vitality','Attunement','Endurance','Strength','Dexterity','Resistance','Intelligence','Faith'];

// console.log(scoreClass(classes.Warrior,{
//     Vitality:0,
//     Attunement:0,
//     Endurance:40,
//     Strength:40,
//     Dexterity:0,
//     Resistance:0,
//     Intelligence:0,
//     Faith:NaN,
// }, statList));

// use handlebars templating to create all inputs
var input_template = document.querySelector('.input_template');
var parser = Handlebars.compile(input_template.innerHTML);
var compiled = parser({stats_columns:{
    col1:{first:'Vitality',second:'Endurance',third:'Attunement',fourth:'Resistance'},
    col2:{first:'Strength',second:'Dexterity',third:'Intelligence',fourth:'Faith'},
}});
var input_section = document.querySelector('.input_section');
input_section.innerHTML = compiled;

//get all inputs
var inputs = {};
statList.forEach(function (stat) {
    inputs[stat] = document.querySelector('.'+stat+'_goal');
});

//init values
var values = {};
statList.forEach(function (stat) {
    values[stat] = NaN;
});

//get cookie data
var saved = cookie.get(statList,NaN);
statList.forEach(function (stat) {
    //if cookie value was saved, place into input
    if (!(isNaN(saved[stat]))){
        inputs[stat].value = saved[stat];
    }
});

//get output section
var output = document.querySelector('.output_section');

//OLD

//Update Output when some inputs are valid
setInterval(function () {
    //only check when inputs change
    if (vitalityval != parseInt(vitality_goal.value) || attunementval != parseInt(attunement_goal.value)) {
        vitalityval = parseInt(vitality_goal.value);
        attunementval = parseInt(attunement_goal.value);

        //save new values to cookie
        cookie.set('vitality',vitalityval,{expires:7});
        cookie.set('attunement',attunementval,{expires:7});

        //generate new output if some ar ints, will ignore others
        if (!isNaN(vitalityval) || !isNaN(attunementval)){
            genOutput(output);
        } else {
            clearOutput(output);
        }
    };
}, 250);