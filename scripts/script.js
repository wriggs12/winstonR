const canvas  = document.getElementById("canvas");
const context = canvas.getContext("2d");

const angleX = 2 * Math.PI / 360;
const angleY = 2 * Math.PI / 720;
const angleZ = 2 * Math.PI / 1480;

const rotX = true;
const rotY = false;
const rotZ = true;

let cube = createCube(0, 0, 4, 1.5);   

function createCube(x, y, z, size) {
    const start = {"x": x, "y": y, "z": z, "size": size};

    const bl = {x: x-size/2, y:y-size/2, z:z-size/2}
    const br = {x: x+size/2, y:y-size/2, z:z-size/2}
    const tl = {x:x-size/2, y:y+size/2, z:z-size/2}
    const tr = {x:x+size/2, y:y+size/2, z:z-size/2}

    const blz = {x:x-size/2, y:y-size/2, z:z+size/2}
    const brz = {x:x+size/2, y:y-size/2, z:z+size/2}
    const tlz = {x:x-size/2, y:y+size/2, z:z+size/2}
    const trz = {x:x+size/2, y:y+size/2, z:z+size/2}

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

function worldToScreen(p) {
    const factor = canvas.width;
    const screen = {
        x: p.x / p.z * factor + (canvas.width/2), 
        y: p.y / p.z * factor + (canvas.height / 2)
    };

    return screen
}

function rotate(cube, rotFunc) {
    const bl = rotFunc(cube.bl, cube.start);
    const br = rotFunc(cube.br, cube.start);
    const tl = rotFunc(cube.tl, cube.start);
    const tr = rotFunc(cube.tr, cube.start);
    const blz = rotFunc(cube.blz, cube.start);
    const brz = rotFunc(cube.brz, cube.start);
    const tlz = rotFunc(cube.tlz, cube.start);
    const trz = rotFunc(cube.trz, cube.start);

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

function rotateZ(p, start) {
    const x = p.x - start.x;
    const y = p.y - start.y;

    return {x: x*Math.cos(angleZ) - y*Math.sin(angleZ) + start.x, y:y*Math.cos(angleZ) + x*Math.sin(angleZ) + start.y, z: p.z}
}

function rotateX(p, start) {
    const z = p.z - start.z;
    const y = p.y - start.y;

    const yy = y*Math.cos(angleX) - z*Math.sin(angleX) + start.y
    const zz = (y*Math.sin(angleX) + z*Math.cos(angleX)) + start.z

    return {x: p.x, y: yy, z: zz}
}

function rotateY(p, start) {
    const z = p.z - start.z;
    const x = p.x - start.x;

    const xx = x*Math.cos(angleY) + z*Math.sin(angleY) + start.x
    const zz = (-x*Math.sin(angleY) + z*Math.cos(angleY)) + start.z

    return {x: xx, y: p.y, z: zz}
}

function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (rotZ)
        cube = rotate(cube, rotateZ);
    if (rotY)
        cube = rotate(cube, rotateY);
    if (rotX)
        cube = rotate(cube, rotateX);

    drawCube(cube);
    requestAnimationFrame(update);
} 

function drawCube(cube) {
    const blr = worldToScreen(cube.bl)
    const brr = worldToScreen(cube.br)
    const tlr = worldToScreen(cube.tl)
    const trr = worldToScreen(cube.tr)
    const blrz = worldToScreen(cube.blz)
    const brrz = worldToScreen(cube.brz)
    const tlrz = worldToScreen(cube.tlz)
    const trrz = worldToScreen(cube.trz)

    const front = {p1: blr, p2: brr, p3: trr, p4: tlr};
    const back = {p1: blrz, p2: brrz, p3: trrz, p4: tlrz};
    const left = {p1: blr, p2: tlr, p3: tlrz, p4: blrz};  
    const right = {p1: brr, p2: trr, p3: trrz, p4: brrz};
    const top = {p1: tlr, p2: trr, p3: trrz, p4: tlrz};
    const bottom = {p1: blr, p2: brr, p3: brrz, p4: blrz};

    const faces = [front, back, left, right, top, bottom];
    faces.forEach(drawFace);
}

function drawFace(face) {
    const p1 = face.p1;
    const p2 = face.p2;
    const p3 = face.p3;
    const p4 = face.p4;

    context.beginPath();
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x, p2.y);
    context.lineTo(p3.x, p3.y);
    context.lineTo(p4.x, p4.y);
    context.closePath();
    context.strokeStyle = "white";
    context.stroke();
}

requestAnimationFrame(update)
