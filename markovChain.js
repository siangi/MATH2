// for the lines of the file as soon as it is loaded
let lines;
let drawnWordsCount = 0;
const START_COORDINATES = [50, 50];
const CANVAS_HEIGHT = screen.height - 100;
const CANVAS_WIDTH = screen.width - 100;
const STAR_SIDE_LENGTH = 31;
const TEXT_HEIGHT = 16;

/* creates an Array of all Words in the File, cleaned of all special Chars */
function loadInput(){
    let cleanedString = cleanSpecialChars(lines[0]);
    let words = cleanedString.split(" ");
    return words;
}

function cleanSpecialChars(value){
    let cleaned = value.replaceAll("\,\"\.\:\;", "");
    cleaned = cleaned.replaceAll("\/", " ");
    return cleaned;
}

/* creates a Map a Map with all the Words as Keys. Values is antoher map with all possible next words as keys
    and the amount of times it occured as values */
function createMapOfAllWords(words){
    let wordMap = new Map();

    for (let i = 0; i < words.length; i++){
        let nextWord = "";
        if (i != words.length - 1){
            nextWord = words[i + 1];;
        }
        let currentWord = words[i];
        
        if (wordMap.has(currentWord)){
            let nextWordsMap = wordMap.get(currentWord);
            if (nextWordsMap.has(nextWord) && nextWord != ""){
                nextWordsMap.set(nextWord, nextWordsMap.get(nextWord) + 1);
            } else {
                if (nextWord != ""){
                    nextWordsMap.set(nextWord, 1);
                }
            }
        } else {
            let nextWordsMap = new Map();
            if (nextWord != ""){
                nextWordsMap.set(nextWord, 1);
            }
            wordMap.set(currentWord, nextWordsMap);
        }
    }

    return wordMap;
}

function countsMapToProbability(mapWithCounts){
    let outerMapIterator = mapWithCounts.entries();

    let outerEntry = outerMapIterator.next();
    while(!outerEntry.done){
        let nextWordMap = outerEntry.value[1];
        nextCount = nextWordMap.size;
        if (nextCount > 1){
            occurenceSum = getSumOfMapValues(nextWordMap);
            nextWordIter = nextWordMap.entries();
            nextWord = nextWordIter.next();
            while(!nextWord.done){
                occurences = nextWord.value[1];
                nextWordMap.set(nextWord.value[0], occurences/occurenceSum);
                nextWord = nextWordIter.next()
            }
            mapWithCounts.set(outerEntry.value[0], nextWordMap);
        }
        outerEntry = outerMapIterator.next();
    }

    return mapWithCounts;
}
// Makes a sum of all Values of the Map. Values need to be a Number
function getSumOfMapValues(map){
    let iterator = map.values();
    let sum = 0;

    let value = iterator.next();
    while(!value.done){
        sum += value.value;
        value = iterator.next();
    }

    return sum;
}

function createChain(wordMap, firstWord, wordCount){
    if (!wordMap.has(firstWord)){
        console.error("firstWord is not in Map");
    }
    
    let chain = firstWord + " ";
    // starting with 1 because firstWord is already set.
    let nextWordInfos;
    let nextWord = firstWord;
    let wordCoordinates = START_COORDINATES;
    // wordCoordinates = drawWord(nextWord, wordCoordinates);
    for (let i = 1; i < wordCount; i++){
        if (!wordMap.has(nextWord)){
            console.error("nächstes Wort:" + nextWord + " nicht in der gesamt Map vorhanden");
            return chain;
        }
        nextWordInfos = getNextWord(wordMap.get(nextWord));
        if (nextWordInfos == null){
            return chain;
        }
        nextWord = nextWordInfos.word;
        wordCoordinates = drawWord(nextWordInfos, wordCoordinates);
        chain = chain + " " + nextWord;
    }

    return chain;
}

/* draws a Word at the set coordinates and returns the coordinates
where the next word should be drawn */
function drawWord(wordInfos, startCoordinates){
    let returnCoordinates = drawStar(wordInfos, startCoordinates[0] + textWidth(wordInfos.word)/2, startCoordinates[1] + TEXT_HEIGHT/2);
    text(wordInfos.word, startCoordinates[0], startCoordinates[1], textWidth(wordInfos.word));
    drawnWordsCount = drawnWordsCount + 2;
    return returnCoordinates;
}

function drawStar(wordInfos, middleX, middleY){
    let distanceX;
    let distanceY;
    let returnCoordinates;
    
    for(let i = 0; i < wordInfos.wordscount; i++){
        push();
        let angle = (i*((360/wordInfos.wordscount)*Math.PI/180)) + (drawnWordsCount % 6);

        if (i == wordInfos.indexInMap){
            distanceX = STAR_SIDE_LENGTH*1.5*Math.cos(angle);
            distanceY = STAR_SIDE_LENGTH*1.5*Math.sin(angle);
            returnCoordinates = [middleX + distanceX, middleY + distanceY];
            stroke(80);
        } else {
            distanceX = STAR_SIDE_LENGTH*Math.cos(angle);
            distanceY = STAR_SIDE_LENGTH*Math.sin(angle); 
            stroke(150); 
        }
    
        line(middleX, middleY, middleX + distanceX, middleY + distanceY);
        pop()
    }
    return returnCoordinates;
}

function getNextWord(nextWords){
    let date = new Date();
    let seed = random(0, 1.01);
    if (nextWords.size == 0){
        console.error("there are no possible next words!");
        return null;
    }

    if (nextWords.size == 1){
        return {
            indexInMap: 0,
            wordscount: 1,
            word: nextWords.entries().next().value[0]
        }
    }

    let iterator = nextWords.entries();
    let candidate = iterator.next();
    let candidateSum = 0;
    let index = 0;
    while (!candidate.done){
        candidateSum += candidate.value[1]

        if (seed <= candidateSum){
            return {
                indexInMap: index,
                wordscount: nextWords.size,
                word: candidate.value[0]
            }
            // index des kandidaten
            // anzahl der kandidaten
            // wort
        } 
        candidate = iterator.next();
        index++;
    }

    console.log("No possible next word has been found!");
    return "";
}

function preload(){
    loadFont("resources/Bungee-Regular.ttf");
    lines = loadStrings("Beschreibungen.txt");
}

function setTextProperties(){
    background(200);
    fill(255, 0, 0);
    textFont("Bungee-Regular");
    textSize(TEXT_HEIGHT);
    textStyle(BOLD);
}


function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    setTextProperties();
    let input = loadInput();
    let wordMap = countsMapToProbability(createMapOfAllWords(input));
    let markovChain = createChain(wordMap, "die", 50);
}
