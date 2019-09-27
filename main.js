//formats number with commas
function formatNum(num) {
    before = num.toString();
    after = '';
    counter = 0;
    for (let i = before.length - 1; i >= 0; i--) {
        if (counter == 3) {
            counter = 0;
            after = ',' + after;
        }
        counter += 1;
        after = before[i] + after;
    }
    return after;
}

//calculates stat score based on class and goal objects
function scoreClass(classObj,goalsObj, statList) {
    var score = 0;

    //give score for stats which contribute to goals
    statList.forEach(function (stat) {
        if (!(isNaN(goalsObj[stat]))) {
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

function clearOutput(div) {
    div.innerHTML = '';
}

var statList = ['Vitality','Attunement','Endurance','Strength','Dexterity','Resistance','Intelligence','Faith'];

console.log(scoreClass(classes.Warrior,{
    Vitality:0,
    Attunement:0,
    Endurance:40,
    Strength:40,
    Dexterity:0,
    Resistance:0,
    Intelligence:0,
    Faith:NaN,
}, statList));

// use handlebars templating to create all inputs
var input_template = document.querySelector('.input_template');
var parse = Handlebars.compile(input_template.innerHTML);
var compiled = parse({stats_pair:{
    a:{first:'Vitality',second:'Attunement'},
    b:{first:'Endurance',second:'Strength'},
    c:{first:'Dexterity',second:'Resistance'},
    d:{first:'Intelligence',second:'Faith'},
}});
var input_destination = document.querySelector('.input_destination');
input_destination.innerHTML = compiled;


//OLD
var vitality_goal = document.querySelector('.vitality_goal');
var attunement_goal = document.querySelector('.attunement_goal');
var output = document.querySelector('.output');

var vitalityval = NaN;
var attunementval = NaN;

//get cookie data
var saved = cookie.get(['vitality','attunement'],'none');
if (!isNaN(parseInt(saved.vitality))) {
    vitality_goal.value = saved.vitality;
}
if (!isNaN(parseInt(saved.attunement))) {
    attunement_goal.value = saved.attunement;
}


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