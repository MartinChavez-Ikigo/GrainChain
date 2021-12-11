var express = require('express');
var router = express.Router();
const path = require('path');
const dirPath = path.join(__dirname, '../public/archivos/matriz.txt');
const fs = require('fs');

/**
 * La logica de este problema es ir validando posicion por posicion cuantas posiciones puede
 * cobrir en -x , x , -y , y los focos al ser encendidos, estos resultado se van tomando y se
 * guardan los que mas puntos junten estos puntos determinan en que posición se coloca cada
 * foco (mas puntos es = mas zona de luz cubierta)
 */
/*var matrizInit=[
  [0,0,0,1,0,1,1,1],
  [0,1,0,0,0,0,0,0],
  [0,1,0,0,0,1,1,1],
  [0,1,1,1,1,0,0,0],
  [0,1,0,0,1,0,0,0],
  [0,1,0,0,1,0,1,0],
  [0,1,0,1,1,0,1,0],
  [0,0,0,0,1,0,0,0],
  [0,1,1,0,1,1,0,1],
  [0,0,0,0,1,0,0,0],
  [1,0,0,1,0,0,1,1],
  [0,0,1,0,0,0,0,0],
];*/

/*var matrizInit=[
  [0,0,0,0],
  [0,1,0,0],
  [1,0,0,1],
  [0,0,0,0],
 
];*/

var lampsPositions=[]

/*var matrizInit=[
  [1,"*",8,3],
  [5,1,3,9],
  [1,4,2,1],
  [8,1,4,2],
 
];*/

/*var matrizInit=[
  [ -1, -1, -1, -1 ],
  [ -1, '*', -1, 3 ],
  [ '*', 3, -1, '*' ],
  [ 4, 5, -1, 4 ]
]*/

router.get('/test',async function(req, res, next) {
  lampsPositions=[]
  let matrizResult=await initmatriz()
  let validation=await checkDatamatrizValid(matrizResult)
  console.log(validation.errorPositions.length);
  if (validation.errorPositions.length>0) {
    res.render('error', { error:validation.errorPositions });
  }else{
    await pointsmatriz(validation.newmatriz)
  res.render('index', { bardas:validation.wallsPositionDetect,lamparas:lampsPositions });
  }
});

async function initmatriz(){
  let archivo = fs.readFileSync(dirPath, 'utf-8');
  let test=archivo.split('\r\n');
  let matriz=[]
  for (let index = 0; index < test.length; index++) {
    let array=[]
    let testComp=test[index].split(' ')
    for (let col = 0; col < testComp.length; col++) {
      array.push(Number(testComp[col]))
    }
    
    matriz.push(array);
  }
  return matriz
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function readmatrizPositive(matriz,positionX,positionY){
  
  let oldPositionX=positionX
  let oldPositionY=positionY
  let xPoints=0
  let yPoints=0
  //console.log("   Analisis X");
  for (let positionX =oldPositionX ; positionX < matriz.length; positionX++) {
    if (matriz[positionX][oldPositionY]=="*") {//Detecta la pared y evita seguir
      break;
    }
      xPoints++
  }
  //console.log("   Analisis Y");  
  for (let positionY = oldPositionY; positionY < matriz[oldPositionX].length; positionY++) {
    if (matriz[positionX][positionY]=="*" ) {//Detecta la pared y evita seguir
      break;
    }
    if(oldPositionY!=positionY && matriz[positionX][positionY]!="-") {
      yPoints++
    }
    
  }
  return (xPoints+yPoints)
}

async function readmatrizNegative(matriz,X,Y){
  
  let xPoints=0
  let yPoints=0
  //console.log("   Analisis -X");
  for (let positionX = X; positionX >= 0; positionX--) {
    if (matriz[positionX][Y]=="*" ) {//Detecta la pared y evita seguir
      break;
    }
      xPoints++
  }
 //console.log("   Analisis -Y"); 
  for (let positionY = Y; positionY >= 0; positionY--) {
    if (matriz[X][positionY]=="*" ) {//Detecta la pared y evita seguir
      break;
    }
    if(positionY!=Y) {
      yPoints++
    }
  }
  return (xPoints+yPoints)
}

async function insertLampPositive(matriz,positionX,positionY){
  
  let oldPositionX=positionX
  let oldPositionY=positionY
  let xPoints=0
  let yPoints=0
  //console.log("   Analisis X");
  for (let positionX =oldPositionX ; positionX < matriz.length; positionX++) {
    if (matriz[positionX][oldPositionY]=="*") {//Detecta la pared y evita seguir
      break;
    }
    matriz[positionX][oldPositionY]=-1
    
  }
  //console.log("   Analisis Y");  
  for (let positionY = oldPositionY+1; positionY < matriz[oldPositionX].length; positionY++) {
    if (matriz[oldPositionX][positionY]=="*") {//Detecta la pared y evita seguir
      break;
    }
    matriz[oldPositionX][positionY]=-1
  }
  
  return matriz
}

async function insertLampNegative(matriz,X,Y){
  
  let xPoints=0
  let yPoints=0
  //console.log("   Analisis -X");
  for (let positionX = X-1; positionX >= 0; positionX--) {
    if (matriz[positionX][Y]=="*") {//Detecta la pared y evita seguir
      break;
    }
    matriz[positionX][Y]=-1
  }

  //console.log("   Analisis -Y"); 
  for (let positionY = Y-1; positionY >= 0; positionY--) {
    if (matriz[X][positionY]=="*") {//Detecta la pared y evita seguir
      break;
    }
    matriz[X][positionY]=-1
  }
  return matriz
}

async function checkLampPoints(matrizInit,positionX,positionY){
  let evaluation={}
  let positivePoints=await readmatrizPositive(matrizInit,positionX,positionY)-1
  let negativePoints=await readmatrizNegative(matrizInit,positionX,positionY)
}

async function pointsmatriz(matriz){
  let check=await checkmatriz(matriz)
  let matrizCopy=matriz
  let lamps=0
  for (let x = 0; x < matrizCopy.length; x++) {
    for (let y = 0; y < matrizCopy[x].length; y++) {
      if (matrizCopy[x][y]=="*") {//Detecta una pared
        //console.log("Pared");
      }else{
        let positivePoints=await readmatrizPositive(matrizCopy,x,y)-1
        let negativePoints=await readmatrizNegative(matrizCopy,x,y)
        matrizCopy[x][y]=(positivePoints+negativePoints)
      }

    }
  }

while (check!=true) {
  matrizCopy=await applyLampsmatriz(matrizCopy)
  lamps++
  check=await checkmatriz(matrizCopy)
}
}

async function applyLampsmatriz(matrizCopy){
  let positions=await nextLamp(matrizCopy)
  let x=positions[0]
  let y=positions[1]
  lampsPositions.push([x,y]);
  matrizCopy=await insertLampPositive(matrizCopy,x,y)
  matrizCopy=await insertLampNegative(matrizCopy,x,y)
  return matrizCopy
}

async function checkmatriz(matriz){
  let flag=true//Matriz completamente iluminada
  for (let x = 0; x < matriz.length; x++) {
    for (let y = 0; y < matriz[x].length; y++) {
      if (matriz[x][y]>=0) {
        flag=false
      }
    }
  }
  return flag
}

async function nextLamp(matriz){
  let matrizPositionInit=await startPositionmatriz(matriz);
  let numeroMayor=matriz[matrizPositionInit.x][matrizPositionInit.y]
  let mayorPosicion=[matrizPositionInit.x,matrizPositionInit.y]
  for (let x = 0; x < matriz.length; x++) {
    for (let y = 0; y < matriz[x].length; y++) {
      if (matriz[x][y] > numeroMayor) {//console.log("Es mayor");
        numeroMayor = matriz[x][y];
        mayorPosicion = [x,y]
      }
    }
  }
  //console.log("EL numero mayor es: "+numeroMayor+"    En su posicion: "+mayorPosicion);
  return mayorPosicion
}

async function startPositionmatriz(matriz){
  let responseFor={x:0,y:0}
  for (let x = 0; x < matriz.length; x++) {
    for (let y = 0; y < matriz[x].length; y++) {
      if (matriz[x][y]!='*') {
        responseFor.x=x
        responseFor.y=y
        break;
      }
    }
  }
  return responseFor
}

async function preparematriz(matriz){
  for (let x = 0; x < matriz.length; x++) {
    for (let y = 0; y < matriz[x].length; y++) {
      if (matriz[x][y]==1) {
        matriz[x][y]="*"
      }
    }
  }
  return 
}

async function checkDatamatrizValid(matriz){
  let positionsError=[]
  let arrayWallPositions=[]
  for (let x = 0; x < matriz.length; x++) {
    for (let y = 0; y < matriz[x].length; y++) {
      if (matriz[x][y]!=0 && matriz[x][y]!=1) {
          positionsError.push(""+x+","+y)
      }
      if (matriz[x][y]==1) {//Detecta una pared
          arrayWallPositions.push([x,y])
          matriz[x][y]="*"
      }
    }
  }
  return {errorPositions:positionsError,wallsPositionDetect:arrayWallPositions,newmatriz:matriz}
}





module.exports = router;
