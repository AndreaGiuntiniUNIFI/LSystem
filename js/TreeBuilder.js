var rules = new Rules();
var params = new Parameters();

function drawTree(x_init, y_init, z_init) {
    rule = getRules(rules.main_rule)
    var Wrule = getTreeAxiom(rule);
    var n = Wrule.length;
    var stackA = [];
    var stackV = [];

    var theta = params.theta * Math.PI / 180;
    var scale = params.scale;
    var angle = params.angle * Math.PI / 180;

    var axis_x = new THREE.Vector3(1, 0, 0);
    var axis_y = new THREE.Vector3(0, 1, 0);
    var axis_z = new THREE.Vector3(0, 0, 1);

    var prev_startpoint = new THREE.Vector3();

    var startpoint = new THREE.Vector3(x_init, y_init, z_init),
        endpoint = new THREE.Vector3();

    var vector_delta = new THREE.Vector3(0, scale, 0);
    var object = new THREE.Object3D();
    var rotation;

    for (var j = 0; j < n; j++) {
        var a = Wrule[j];
        if (a == "+") {
            angle += theta;
            rotation = "x";
        }
        if (a == "-") {
            angle -= theta;
            rotation = "x";
        }
        if (a == "^") {
            angle += theta;
            rotation = "y";
        }
        if (a == "v") {
            angle -= theta;
            rotation = "y";
        }
        if (a == "<") {
            angle += theta;
            rotation = "z";
        }
        if (a == ">") {
            angle -= theta;
            rotation = "z";
        }
        if (a == "F") {
            if (rotation == "x")
                a = vector_delta.clone().applyAxisAngle(axis_x, angle);
            else if (rotation == "y")
                a = vector_delta.clone().applyAxisAngle(axis_y, angle);
            else if (rotation == "z")
                a = vector_delta.clone().applyAxisAngle(axis_z, angle);
            else
                a = vector_delta.clone().applyAxisAngle(axis_x, angle);
            endpoint.addVectors(startpoint, a);

            object.add(cylinderMesh(startpoint, endpoint, params.branch_radius, "branch"));

            prev_startpoint.copy(startpoint);
            startpoint.copy(endpoint);

            axis_delta = new THREE.Vector3().copy(a).normalize();

        }
        if (a == "X") {

            endpoint.copy(startpoint);
            var max_branch = 4.5;
            var min_branch = 2.5;
            var random = Math.random() * (+max_branch - +min_branch) + +min_branch; 
            endpoint.add(new THREE.Vector3(0, scale * random, 0));
            var vector_delta2 = new THREE.Vector3().subVectors(endpoint, startpoint);

            if (rotation == "x")
                vector_delta2.applyAxisAngle(axis_x, angle);
            else if (rotation == "y")
                vector_delta2.applyAxisAngle(axis_y, angle);
            else if (rotation == "z")
                vector_delta2.applyAxisAngle(axis_z, angle);
            else
                vector_delta2.applyAxisAngle(axis_x, angle);

            endpoint.addVectors(startpoint, vector_delta2);
            branch = cylinderMesh(startpoint, endpoint, params.leaf_radius, "leaf")
            object.add(branch);

            let leaf_geometry = new LeafGeometry(params.opt);
            leaf = new THREE.Mesh(leaf_geometry, new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: '#3A5311' }));
            leaf2 = new THREE.Mesh(leaf_geometry, new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: '#32612D' }));
            leaf3 = new THREE.Mesh(leaf_geometry, new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: '#607B3D' }));
            leaf4 = new THREE.Mesh(leaf_geometry, new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: '#3A5311' }));
            leaf5 = new THREE.Mesh(leaf_geometry, new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: '#3A5311' }));
            leaf6 = new THREE.Mesh(leaf_geometry, new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: '#354A21' }));
            leaf7 = new THREE.Mesh(leaf_geometry, new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: '#3A5311' }));
            leaf8 = new THREE.Mesh(leaf_geometry, new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: '#32612D' }));

            leaf.rotation.z = Math.random() * Math.PI;
            leaf2.rotation.z = Math.random() * Math.PI;

            leaf3.rotation.z = Math.random() * Math.PI;
            leaf4.rotation.z = Math.random() * Math.PI;
            leaf3.rotation.y = Math.PI / 2;
            leaf4.rotation.y = Math.PI / 2;

            leaf5.rotation.z = Math.random() * Math.PI;
            leaf6.rotation.z = Math.random() * Math.PI;
            leaf5.rotation.y = 3 * Math.PI / 2;
            leaf6.rotation.y = 3 * Math.PI / 2;

            leaf7.rotation.z = Math.random() * Math.PI;
            leaf8.rotation.z = Math.random() * Math.PI;
            leaf7.rotation.y = Math.PI;
            leaf8.rotation.y = Math.PI;

            leaf.position.set(endpoint.x, endpoint.y, endpoint.z);
            leaf2.position.set(startpoint.x, startpoint.y, startpoint.z);
            leaf3.position.set(endpoint.x, endpoint.y, endpoint.z);
            leaf4.position.set(startpoint.x, startpoint.y, startpoint.z);
            leaf5.position.set(endpoint.x, endpoint.y, endpoint.z);
            leaf6.position.set(startpoint.x, startpoint.y, startpoint.z);
            leaf7.position.set(endpoint.x, endpoint.y, endpoint.z);
            leaf8.position.set(startpoint.x, startpoint.y, startpoint.z);

            leaf.castShadow = true;
            leaf2.castShadow = true;
            leaf3.castShadow = true;
            leaf4.castShadow = true;
            leaf5.castShadow = true;
            leaf6.castShadow = true;
            leaf7.castShadow = true;
            leaf8.castShadow = true;

            object.add(leaf, leaf2, leaf3, leaf4, leaf5, leaf6, leaf7, leaf8);

        }

        if (a == "[") {
            stackV.push(new THREE.Vector3(startpoint.x, startpoint.y, startpoint.z));
            stackA[stackA.length] = angle;
        }
        if (a == "]") {
            var point = stackV.pop();
            startpoint.copy(new THREE.Vector3(point.x, point.y, point.z));
            angle = stackA.pop();
        }
        
    }

    return object;
}


function cylinderMesh(vstart, vend, radius, type) {

    const loader = new THREE.TextureLoader();

    var material = new THREE.MeshBasicMaterial({
        map: loader.load('textures/wood_cartoon.jpg'),
    });

    var HALF_PI = Math.PI * .5;
    var distance = vstart.distanceTo(vend) + 2;
    var position = vend.clone().add(vstart).divideScalar(2);
    var cylinder;

    if (type == "leaf")
        cylinder = new THREE.CylinderGeometry(parseInt(params.branch_radius), parseInt(params.leaf_radius), distance, 15, 15, false);
    else
        cylinder = new THREE.CylinderGeometry(parseInt(params.branch_radius), parseInt(params.branch_radius), distance, 15, 15, false);

    var orientation = new THREE.Matrix4();
    var offsetRotation = new THREE.Matrix4();
    orientation.lookAt(vstart, vend, new THREE.Vector3(0, 1, 0));
    offsetRotation.makeRotationX(HALF_PI);
    orientation.multiply(offsetRotation);
    cylinder.applyMatrix(orientation)

    var mesh = new THREE.Mesh(cylinder, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.castShadow = true;
    return mesh;
}

function setRule() {
    rules.axiom = "X";
    rules.main_rule = "X=F[+X][-X]FX F=FF";
    params.iterations = 3;
    params.angle = 0;
    params.theta = 25.7;
    params.scale = 20;
}