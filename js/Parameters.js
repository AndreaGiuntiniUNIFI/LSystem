function Parameters() {
    //Tree parameters
    this.iterations = 3;
    this.theta = 25.7;
    this.angle = 0;
    this.scale = 20;
    this.leaf_radius = 2;
    this.branch_radius = 5;

    //Leaf parameters
    this.opt = {
        length: 30,
        length_stem: 4,
        width_stem: 0.7,
        leaf_width: 0.5,
        leaf_up: 1.2,
        density: 20,
        curvature: 0.05,
        curvature_border: 0.05,
        leaf_inclination: 1
    };
}

function Rules() {
    this.axiom = 'F';
    this.main_rule = 'F=F[+X][-X]FX';
}

//Get values from html form
function setParams() {
    var axiom = document.getElementById("axiom").value;
    var rule = document.getElementById("rule").value;
    var iteration = document.getElementById("iteration").value;
    var theta = document.getElementById("theta").value;
    var scale = document.getElementById("scale").value;
    var leaf_radius = document.getElementById("leaf").value;
    var branch_radius = document.getElementById("branch").value;


    rules.axiom = axiom;
    rules.main_rule = rule;
    params.iterations = iteration;
    params.theta = theta;
    params.scale = scale;
    params.leaf_radius = leaf_radius;
    params.branch_radius = branch_radius;
}