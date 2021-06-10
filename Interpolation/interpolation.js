const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 512;
const Y_PADDING = 50;

const FRACTAL_COUNT = 8;
const FRACTAL_LEVELS = 4;
const POINTS_FACTOR = 2;
const PERSISTENCE = 0.3;

let red;


function setup(){
    red = color(180, 0, 0);
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    background(150);
    makePerlinNoiseGraph();
    // makeOnlyLevel1Noise();
}

function draw(){

}

/*
Vorgehen :
	- Lege fest wie gross die Noisemap am Ende sein soll (horizontale Ausdehnung)
	- Berechne Noisemaps für die verschiedenen Frequenzen/Gitterabstände/Anzahl Gitterpunkte und Amplituden -> 4-8 dieser Maps sind genug
    - Addiere die entsprechenden y-Werte für jeden x-Wert (nicht nur die Gitterpunkte)
    
Ich glaube ich muss als andere Werte für die Höhe nehmen? sie bei der Page fractal nosie die grau hinterlegte Grafik??
*/	


// Paints a Perlin Noise Graph across the Whole Canvas
function makePerlinNoiseGraph(){
    // all the Maps of different Levels
    let pointsMaps = [];

    /*
    - Alle 4 Noise Maps erstellen (unabhängig)
    - 4te Noise Map auf 3te aufaddieren in dem:
        - Punkt in 4ter Noise Map auswählen
        - mit Interpolate von den benachbarten Punkten aus 3ter Map das Y herausholen
        - Verschiebung mit Punkt aus 4ter Map
        - die zusammen genommene Map ist jetzt die 3te Map
    - 3te Map auf zweite
    - zweite auf 1te
    - verbliebene Map zeichnen.

    - ist es wichtig ob ich oben oder unten beginne?
    - Y zuerst mit 0 Punkt in Mitte, danach für Zeichnen auf normales Mappen
    - 
    */
    for(let level = 1; level <= FRACTAL_LEVELS; level++){
        let maxY = Math.floor((CANVAS_HEIGHT-Y_PADDING)*(PERSISTENCE/level));
        console.log("level + maxHeight " + level + " " + maxY);
        pointsMaps.push(makeANoiseMap(0, -maxY, CANVAS_WIDTH, maxY, level*FRACTAL_COUNT*POINTS_FACTOR));
    }

    // drawGraph(pointsMaps[0], color(255, 0,0));
    // drawGraph(pointsMaps[1], color(0, 255, 0));
    // drawGraph(pointsMaps[2], color(0, 0, 255));
    // drawGraph(pointsMaps[3], color(255));

    console.log(pointsMaps);    
    let addedMap = AddUpPointsMaps(pointsMaps);
    drawGraph(addedMap, color(0));
    console.log(addedMap);
    
}

function AddUpPointsMaps(pointsMaps){
    let currentMap;
    let previousMap;

    for(let i = 1; i < pointsMaps.length; i++){
        currentMap = pointsMaps[i];
        previousMap = pointsMaps[i - 1];
        addedMap = [];

        for(let inner = 0; inner < currentMap.length; inner++){
            let macroPointBefore;
            let macroPointAfter;
            let t;
            if (inner == 0){
                macroPointBefore = previousMap[0];
                macroPointAfter = previousMap[1];
                t = 0;
            } else if(inner/2 == previousMap.length){
                macroPointBefore = previousMap[previousMap.length - 2];
                macroPointAfter = previousMap[previousMap.length - 1];
                t = 1;
            } else if(inner % 2 == 0) {
                macroPointBefore = previousMap[(inner/2) - 1];
                macroPointAfter = previousMap[inner/2];
                t = 1;
            } else if(inner % 2 == 1){
                macroPointBefore = previousMap[Math.floor(inner/POINTS_FACTOR)];
                macroPointAfter = previousMap[Math.ceil(inner/POINTS_FACTOR)]
                t = 0.5;
            }
            
            let newPoint = [];
            newPoint[0] = currentMap[inner][0];
            newPoint[1] = currentMap[inner][1] + cosinusInterpolation(macroPointBefore[1], macroPointAfter[1], t);
            addedMap.push(newPoint);
        }
        pointsMaps[i] = addedMap;
    }

    return(pointsMaps[pointsMaps.length - 1]);
}

function drawGraph(pointsArray, color){
    // let macroPoints = initPointsArray(16);
    let oldMacroX;
    let oldMacroY;
    for(let macroIdx = 0; macroIdx < pointsArray.length; macroIdx++){
        let macroX = pointsArray[macroIdx][0];
        let macroY = pointsArray[macroIdx][1] + CANVAS_HEIGHT/2;
        
        if (oldMacroX != null && oldMacroY != null){
            let pixelCount = Math.sqrt(Math.pow(oldMacroX - macroX, 2) + Math.pow(oldMacroY - macroY, 2));
            for(i = 0; i <= pixelCount; i++){
                let t = i/pixelCount;
                let newX = ownLerp(oldMacroX, macroX, t);
                let newY = cosinusInterpolation(oldMacroY, macroY, t);

                set(newX, newY, color);
            }
        }

        oldMacroX = macroX;
        oldMacroY = macroY;
    }

    updatePixels();
}

// creates 8 points, evently distributed betwenn startX and endX. startY and endY are the maximum/minmum height.
// returns the points as an Array.
function makeANoiseMap(startX, startY, endX, endY, pointsCount){
    let returnArray = new Array(pointsCount);

    let smallerY = Math.min(startY, endY);
    let biggerY = Math.max(startY, endY);

    for (let i = 0; i <= pointsCount; i++){
        let x = startX + (i * Math.abs(endX - startX)/pointsCount);
        let y = random(smallerY, biggerY);

        returnArray[i] = [x, y];
    }

    return returnArray;
}

function ownLerp(val1, val2, t){
    if (t > 1 || t < 0){
        console.error("invalid")
        return -1;
    }

    return (1 - t) * val1 + t * val2;
}

function cosinusInterpolation(val1, val2, t){
    return ownLerp(val1, val2, 0.5 * (1 - Math.cos(t * Math.PI)));
}

function smoothStepInterpolation(val1, val2, t){
    return ownLerp(val1, val2, 6 * Math.pow(t, 5) - 15 * Math.pow(t, 4) + 10*Math.pow(t, 3))
}

function initPointsArray(pointCount){
    let result = [];
    for(let i = 0; i <= pointCount; i++){
        x = i*CANVAS_WIDTH/pointCount;

        y = random(0, CANVAS_HEIGHT);

        result.push([x, y]);
    }

    return result;
}

function makeOnlyLevel1Noise(){
    let macroPoints = initPointsArray(16);
    let oldMacroX;
    let oldMacroY;
    for(let macroIdx = 0; macroIdx < macroPoints.length; macroIdx++){
        let macroX = macroPoints[macroIdx][0];
        let macroY = macroPoints[macroIdx][1];
        
        if (oldMacroX != null && oldMacroY != null){
            let pixelCount = Math.sqrt(Math.pow(oldMacroX - macroX, 2) + Math.pow(oldMacroY - macroY, 2));
            for(i = 0; i <= pixelCount; i++){
                let t = i/pixelCount;
                let newX = ownLerp(oldMacroX, macroX, t);
                let newY = cosinusInterpolation(oldMacroY, macroY, t);

                set(newX, newY, red);
            }
        }

        oldMacroX = macroX;
        oldMacroY = macroY;
    }

    updatePixels();

}