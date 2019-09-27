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


//generates output 
function genOutput(div) {
    div.innerHTML = 'genOutput() not implemented yet.';
}

function clearOutput(div) {
    div.innerHTML = '';
}

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