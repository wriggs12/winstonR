var canvas  = document.getElementById("canvas");
var context = canvas.getContext("2d");

var fill = false;

var angleX = 2 * Math.PI / 360;
var angleY = 2 * Math.PI / 720;
var angleZ = 2 * Math.PI / 1480;

var rotX = true;
var rotY = true;
var rotZ = false;

var cube = createCube(0, 0, 4, 1.5);   

function createCube(x, y, z, size) {
    var start = {"x": x, "y": y, "z": z, "size": size};

    var bl = {x: x-size/2, y:y-size/2, z:z-size/2}
    var br = {x: x+size/2, y:y-size/2, z:z-size/2}
    var tl = {x:x-size/2, y:y+size/2, z:z-size/2}
    var tr = {x:x+size/2, y:y+size/2, z:z-size/2}

    var blz = {x:x-size/2, y:y-size/2, z:z+size/2}
    var brz = {x:x+size/2, y:y-size/2, z:z+size/2}
    var tlz = {x:x-size/2, y:y+size/2, z:z+size/2}
    var trz = {x:x+size/2, y:y+size/2, z:z+size/2}

    return {
        "bl": bl, 
        "br": br, 
        "tl": tl, 
        "tr": tr, 
        "blz": blz,
        "brz": brz,
        "tlz": tlz, 
        "trz": trz,
        "start": start
    };
}

function worldToScreen(p, offset) {
    let factor = canvas.width;
    let screen = {
        x: p.x / p.z * factor + (canvas.width/2), 
        y: p.y / p.z * factor + (canvas.height / 2)
    };

    return screen
}

function rotateCubeZ(cube) {
    let bl = rotateZ(cube.bl, cube.start);
    let br = rotateZ(cube.br, cube.start);
    let tl = rotateZ(cube.tl, cube.start);
    let tr = rotateZ(cube.tr, cube.start);
    let blz = rotateZ(cube.blz, cube.start);
    let brz = rotateZ(cube.brz, cube.start);
    let tlz = rotateZ(cube.tlz, cube.start);
    let trz = rotateZ(cube.trz, cube.start);
    return {
        "bl": bl, 
        "br": br, 
        "tl": tl, 
        "tr": tr, 
        "blz": blz,
        "brz": brz,
        "tlz": tlz, 
        "trz": trz,
        "start": cube.start
    }; 
}

function rotateCubeX(cube) {
    let bl = rotateX(cube.bl, cube.start);
    let br = rotateX(cube.br, cube.start);
    let tl = rotateX(cube.tl, cube.start);
    let tr = rotateX(cube.tr, cube.start);
    let blz = rotateX(cube.blz, cube.start);
    let brz = rotateX(cube.brz, cube.start);
    let tlz = rotateX(cube.tlz, cube.start);
    let trz = rotateX(cube.trz, cube.start);
    return {
        "bl": bl, 
        "br": br, 
        "tl": tl, 
        "tr": tr, 
        "blz": blz,
        "brz": brz,
        "tlz": tlz, 
        "trz": trz,
        "start": cube.start
    }; 
}

function rotateCubeY(cube) {
    let bl = rotateY(cube.bl, cube.start);
    let br = rotateY(cube.br, cube.start);
    let tl = rotateY(cube.tl, cube.start);
    let tr = rotateY(cube.tr, cube.start);
    let blz = rotateY(cube.blz, cube.start);
    let brz = rotateY(cube.brz, cube.start);
    let tlz = rotateY(cube.tlz, cube.start);
    let trz = rotateY(cube.trz, cube.start);

    return {
        "bl": bl, 
        "br": br, 
        "tl": tl, 
        "tr": tr, 
        "blz": blz,
        "brz": brz,
        "tlz": tlz, 
        "trz": trz,
        "start": cube.start
    }; 
}

function translateY(cube, value) {

    var bl  = cube.bl; 
    var br  = cube.br; 
    var tl  = cube.tl; 
    var tr  = cube.tr; 
    var blz = cube.blz;
    var brz = cube.brz;
    var tlz = cube.tlz;
    var trz = cube.trz;
    var start = cube.start;

    bl.y  = cube.bl.y+value;
    br.y  = cube.br.y+value;
    tl.y  = cube.tl.y+value;
    tr.y  = cube.tr.y+value;
    blz.y = cube.blz.y+value;
    brz.y = cube.brz.y+value;
    tlz.y = cube.tlz.y+value;
    trz.y = cube.trz.y+value;
    start.y = cube.start.y-value;

    return {
        "bl":  bl, 
        "br":  br, 
        "tl":  tl, 
        "tr":  tr, 
        "blz": blz,
        "brz": brz,
        "tlz": tlz, 
        "trz": trz,
        "start": cube.start
    };
}

function rotateZ(p, start) {
    let x = p.x - start.x;
    let y = p.y - start.y;
    return {x: x*Math.cos(angleZ) - y*Math.sin(angleZ) + start.x, y:y*Math.cos(angleZ) + x*Math.sin(angleZ) + start.y, z: p.z}
}

function rotateX(p, start) {
    let z = p.z - start.z;
    let y = p.y - start.y;

    let yy = y*Math.cos(angleX) - z*Math.sin(angleX) + start.y
    let zz = (y*Math.sin(angleX) + z*Math.cos(angleX)) + start.z
    return {x: p.x, y: yy, z: zz}
}

function rotateY(p, start) {
    let z = p.z - start.z;
    let x = p.x - start.x;

    let xx = x*Math.cos(angleY) + z*Math.sin(angleY) + start.x
    let zz = (-x*Math.sin(angleY) + z*Math.cos(angleY)) + start.z
    return {x: xx, y: p.y, z: zz}
}

function drawLine(p0, p1) {
    context.beginPath();
    context.moveTo(p0.x, p0.y);
    context.lineTo(p1.x, p1.y);
    context.lineWidth = "2"
    context.strokeStyle = "#222";
    context.stroke();
}

function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);
   
    // Cube
    if (rotZ === true) {
        cube = rotateCubeZ(cube);
    }

    if (rotY === true) {
        cube = rotateCubeY(cube);
    }

    if (rotX === true) {
        cube = rotateCubeX(cube);
    }

    drawCube(cube, 0);
    requestAnimationFrame(update);
} 

function drawCube(cube, offset) {
    let blr = worldToScreen(cube.bl, offset)
    let brr = worldToScreen(cube.br, offset)
    let tlr = worldToScreen(cube.tl, offset)
    let trr = worldToScreen(cube.tr, offset)
    let blrz = worldToScreen(cube.blz, offset)
    let brrz = worldToScreen(cube.brz, offset)
    let tlrz = worldToScreen(cube.tlz, offset)
    let trrz = worldToScreen(cube.trz, offset)

    let front = {p1: blr, p2: brr, p3: trr, p4: tlr, color: "#bb2222",};
    let back = {p1: blrz, p2: brrz, p3: trrz, p4: tlrz, color: "#22bb22",};
    let left = {p1: blr, p2: tlr, p3: tlrz, p4: blrz, color: "#2222bb"};  
    let right = {p1: brr, p2: trr, p3: trrz, p4: brrz, color: "#22bbbb"};
    let top = {p1: tlr, p2: trr, p3: trrz, p4: tlrz, color: "#bb22bb"};
    let bottom = {p1: blr, p2: brr, p3: brrz, p4: blrz, color: "#bbbb22"};

    var faces = [front, back, left, right, top, bottom];
    faces.forEach(drawFace);
}

function drawFace(face) {
    let p1 = face.p1;
    let p2 = face.p2;
    let p3 = face.p3;
    let p4 = face.p4;

    let ctx = context;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.strokeStyle = "white";
    ctx.stroke();
}

requestAnimationFrame(update)
