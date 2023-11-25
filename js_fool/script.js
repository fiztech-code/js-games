let heatMapArr = Array.from({length: 37}, () => Array.from({length: 18}, () => 0))
let heatMap = 
   `0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	1	1	1	3	3	3	5	7	9	11	12	13	15	16	17
    0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	1	1	1	1	3	3	3	5	5	5	7	9	11	12	13	15	16	17	17
    0	0	0	0	0	0	0	0	0	0	0	0	0	1	1	1	1	1	3	3	3	3	5	5	5	7	7	7	9	11	12	13	15	16	17	17	17
    0	0	0	0	0	0	0	1	1	1	1	1	1	3	3	3	3	3	5	5	5	5	7	7	7	9	9	9	11	12	13	15	16	17	17	17	17
    0	1	1	1	1	1	1	3	3	3	3	3	3	5	5	5	5	5	7	7	7	7	9	9	9	11	11	11	12	13	15	16	17	17	17	17	17
    1	3	3	3	3	3	3	5	5	5	5	5	5	7	7	7	7	7	9	9	9	9	11	11	11	12	12	12	13	15	16	17	17	17	17	17	17
    3	5	5	5	5	5	5	7	7	7	7	7	7	9	9	9	9	9	11	11	11	11	12	12	12	13	13	13	15	16	17	17	17	17	17	17	17
    5	7	7	7	7	7	7	9	9	9	9	9	9	11	11	11	11	11	12	12	12	12	13	13	13	15	15	15	16	17	17	17	17	17	17	17	17
    7	9	9	9	9	9	9	11	11	11	11	11	11	12	12	12	12	12	13	13	13	13	15	15	15	16	16	16	17	17	17	17	17	17	17	17	17
    9	11	11	11	11	11	11	12	12	12	12	12	12	13	13	13	13	13	15	15	15	15	16	16	16	17	17	17	17	17	17	17	17	17	17	17	17
    11	12	12	12	12	12	12	13	13	13	13	13	13	15	15	15	15	15	16	16	16	16	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17
    12	13	13	13	13	13	13	15	15	15	15	15	15	16	16	16	16	16	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17
    13	15	15	15	15	15	15	16	16	16	16	16	16	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17
    15	16	16	16	16	16	16	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17
    16	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17
    17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17
    17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17
    17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17	17`;

heatMap.split('\n').forEach((row, i) => {
    let rowArr = row.split('\t');
    rowArr.forEach((cell, j) => {
       heatMapArr[36-j][17-i] = parseInt(cell);
    });
});

const cardWidth = 80;
const cardHeight = 120;
const padding = 4;

let deck = [];
let discard = [];
let table = [];
let p1 = [];
let p2 = [];
let trump;


let isPlayerTurn = false;
let isPlayerMove = false;
let winner;

let showPcCards = document.querySelector('#showComputerCards');

let suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
// #region - get card graphics from unicode chars
/*
    0xD83C 0xDCA0 - Playing Card Back
    0xD83C 0xDCA1 - Spades
    0xD83C 0xDCB1 - Hearts
    0xD83C 0xDCC1 - Diamonds
    0xD83C 0xDCD1 - Clubs
*/
let entity = 0xDCA1;
for (let i = 0; i < 36; i++) { 
    let card = {
        id: i,
        img: entity,
        suit: Math.floor(i / 9),
        value: (i % 9) + 5,
        showFront: false,
        rotate: 0,
        x: 0,
        y: 0,
        width: cardWidth,
        height: cardHeight,
        frotate: 0,
        fx: 0,
        fy: 0
    };
    
    if ((entity & 0xF) == 0x1) {
        card.value += 9; // set ACE value to 14
        entity += 5; // skip 2-5
    } else if ((entity & 0xF) == 0xB) {
        entity += 2; // skip knight
    } else if ((entity & 0xF) == 0xE) {
        entity += 3; // skip to next suit
    } else {
        entity++;
    }  

    deck.push(card);
}

let allCards = [...deck];
// #endregion


// #region - drawing
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const screen = 1000;

ctx.canvas.width = screen;
ctx.canvas.height = screen / 2;

const btnTake = {
    x: 140,
    y: 20,
    width: 100,
    height: 32,
    text: 'Take',
    hover: false
};
const btnPass = {
    x: 260,
    y: 20,
    width: 100,
    height: 32,
    text: 'Pass',
    hover: false
};

const hideBox = {
    x: ctx.canvas.width*.33,
    y: 0,
    width: ctx.canvas.width*.33,
    height: ctx.canvas.height*.3
   
};


const bg = 'white';

let animateSequence = [];

function addAnimateSequence(card) {
    animateSequence.push(card);
}


let animationCard;

function placeCards() {
    // place p1 cards
    let step = Math.min((cardHeight/3), ctx.canvas.height / p1.length);
    let totalHeight = Math.min(ctx.canvas.height, step * p1.length + (cardHeight-step));
    let offset = (ctx.canvas.height/2) - (totalHeight/2);
    for (let i = 0; i < p1.length; i++) { 
        p1[i].showFront = true;               
        placeCard(padding, offset + (step*i), p1[i]);
    }

    // place p2 cards
    step = Math.min((cardHeight/3), ctx.canvas.height / p2.length);
    totalHeight = Math.min(ctx.canvas.height, step * p2.length + (cardHeight - step));
    offset = (ctx.canvas.height/2) - (totalHeight/2);    
    for (let i = 0; i < p2.length; i++) {    
        p2[i].showFront = showPcCards.checked;
        placeCard(ctx.canvas.width - (cardWidth + padding), (offset + (step*i)), p2[i]);
    }

    // // place deck
    // for (let i = 0; i < deck.length; i++) {   
    //     deck.showFront = false;
    //     placeCard((ctx.canvas.width/2) + (cardHeight/2) - ((deck.length-1)/2) + (i/2), (i/2) + padding, deck[i], 90, true);                   
    // }

    // place trump
    if (trump && deck.length) {
        trump.showFront = true;
        placeCard((ctx.canvas.width/2) - (cardWidth/2), ((deck.length-1)/2) + padding, trump, 0);    
    }    

    // place discard
    for (let i = 0; i < discard.length; i++) {           
        discard[i].showFront = false;
        placeCard((ctx.canvas.width*0.75) + (cardHeight/2) - ((deck.length-1)/2) + (i/2), (i/2) + padding, discard[i], 90);        
    }

    // place table
    step = 100;
    let len = table.length;
    let rowLength = Math.floor((len-1) / 14);
    for (let i = 0; i < len; i+=2) {  
        let col = (i % 14 / 2); 
        let row = Math.floor(i / 14);  

        let colCount = Math.floor(Math.min(14, len - (14*row)) / 2);        
        colCount += (rowLength == row && len % 2); // if odd card count, on last row add 1

        let rowWidth = step * colCount;

        let xOffset = (ctx.canvas.width/2) - (rowWidth/2) + (step*col) + 10;
        let yOffset = (ctx.canvas.height/2) + (rowLength == 0 ? -60 : (row == 0 ? -100 : 86));

        table[i].showFront = true;
        placeCard(xOffset , yOffset, table[i]);
        if (table[i+1]) {
            table[i+1].showFront = true;   
            placeCard(xOffset + 6, yOffset + 34, table[i+1]);
        }
    }
}


function draw() {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);   

    if (isPlayerTurn) {
        drawButton(btnPass);
    } else {
        drawButton(btnTake);
    }

    // message
    let message = winner != undefined ? (winner == p1 ? 'You win!' : 'You lose') : (isPlayerMove ? 'Your turn' : 'Computer turn');
    ctx.save();    
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height - 10);
    ctx.font = '1rem sans-serif';
    ctx.fillStyle = 'black';    
    ctx.textAlign = 'center'
    ctx.fillText(message, 0, 0);
    ctx.restore();

    discard.forEach((x,i) => drawCard(x)); // draw discard //i % 4 == 0 && 
    drawCard(trump); // draw trump 
    
    ////deck.forEach((x,i) => i < deck.length-1 && ); // draw deck //i % 4 == 0 &&
    for (let i = deck.length-2; i >= 0; i--) {
        drawCard(deck[i]);
    }
    p1.forEach((x) => drawCard(x)); // draw p1 cards     
    p2.forEach((x) => drawCard(x)); // draw p2 cards
    table.forEach((x) => drawCard(x)); // draw table
    
    requestAnimationFrame(draw);
}

function placeCard(x, y, card, rotate, finalLocation) {    
    
    card.frotate = rotate || 0;
    card.fx = x;
    card.fy = y;

    if (finalLocation) {
        card.rotate = rotate || 0;
        card.x = x;
        card.y = y;
    } 
}

function drawCard(card) {
    if (!card) return;

    if (animateSequence.indexOf(card) == 0) {
        let tx = card.fx - card.x;
        let ty = card.fy - card.y;        
        let dist = Math.sqrt(tx * tx + ty * ty);

        let tr = card.frotate - card.rotate;
        let rDist =  Math.sqrt(tr * tr) || 0;
                
        let speed = 15;        

        if (dist >= speed) {
            let velX = (tx / dist) * speed;
            let velY = (ty / dist) * speed;
            card.x += velX;
            card.y += velY;

            let step = tx / velX;
            let velR = (tr / step) || 0;

            card.rotate += velR;

        } else {            
            card.x = card.fx
            card.y = card.fy;
            card.rotate = card.frotate;

            animateSequence.splice(0,1);
        }
    }

    ctx.save(); 
    ctx.translate(card.x, card.y);
    
    if (card.rotate) {
        ctx.rotate(card.rotate * Math.PI / 180);        
    }    
    
    ctx.fillStyle = 'white';    
    ctx.fillRect(0, 0, cardWidth, cardHeight);

    ctx.font = '129px sans-serif';
    ctx.fillStyle = card.suit % 3 ? 'red' : 'black';
    if (!card.showFront) {
        ctx.fillStyle = '#072774';
    }
    
    // make this nicer, later
    let img = (card.showFront ? card.img : 0xDCA0);
    if (isPointInRectangle(card.x,card.y, hideBox) && card != trump )  {
        ctx.fillStyle = '#072774';
        img = 0xDCA0;
    }

    ctx.fillText(String.fromCharCode(0xD83C, img), -2, 105);
    ctx.restore();
}

function drawButton(btn) {
    ctx.beginPath();
    ctx.rect(btn.x, btn.y, btn.width, btn.height);    
    ctx.fillStyle = `rgba(225,225,225,${(btn.hover ? '1' : '0.5')})`;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.stroke();
    ctx.closePath();
    ctx.font = '1.5rem sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(btn.text, btn.x + btn.width / 4, btn.y + btn.height - 6);
}
// #endregion

// #region - event handlers
function isPointInRectangle(x, y, rectangle) {
    if (x > rectangle.x && x <= (rectangle.x + rectangle.width)
        && (y > rectangle.y && y <= (rectangle.y + rectangle.height))) {                
            return true;
    }
    return false;
}

canvas.onmousemove = (event) => { 
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(event.clientX - rect.left);
    const y = Math.floor(event.clientY - rect.top);

    //mine.x = x;
    //mine.y = y;


    btnPass.hover = isPointInRectangle(x, y, btnPass);
    btnTake.hover = isPointInRectangle(x, y, btnTake);

    canvas.style.cursor = btnPass.hover || btnTake.hover ? 'pointer' : '';
    //draw();
};

canvas.addEventListener('mouseup', (event) => {   
    if (animateSequence.length) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(event.clientX - rect.left);
    const y = Math.floor(event.clientY - rect.top);
   
    let i;
    for (i = p1.length-1; i >= 0; i--) {
        if (isPointInRectangle(x, y, p1[i])) {            
            break;
        }
    }
    if (!isPlayerTurn && (table.length % 2 == 1) && i > -1) { // defent
        let attackCard = table[table.length-1];
        let defendCard = p1[i];
        if (!isCardBigger(attackCard, defendCard)) {
            i = -1;
        }
    }
    if (isPlayerTurn && (table.length > 0 && table.length % 2 == 0)) { // toss
        let canToss = p1.filter((x) => {
            if (!table.length) return true;
            return table.map((y) => y.value).indexOf(x.value) > -1;
        });
        if (canToss.indexOf(p1[i]) == -1) {
            i = -1;
        }
    }
    if (deck.length && !p2.length) {
        i = -1;
    }
    if (isPlayerMove && i > -1) {        
        playCard(p1, i);
        isPlayerMove = false;
    }


    if (isPlayerTurn && isPointInRectangle(x, y, btnPass) && table.length > 0) {        
        discardCards();
        dealCards(p1, p2);
        isPlayerTurn = false;
        isPlayerMove = false;
    }

    if (!isPlayerTurn && isPointInRectangle(x, y, btnTake)) {            
        takeCards(p1);
        dealCards(p2, p1);
        isPlayerTurn = false;
        isPlayerMove = false;
    } 
    
    computerMove();    
});
// #endregion

// #region - game logic
function checkWinner() {     
    if (!deck.length && (!p1.length || !p2.length)) {
        winner = !p2.length ? p2 : p1;
        return true;
    } 
    return false;
}

function discardCards() {
    takeCards(discard);
}

function playCard(player, cardId) {
    //addAnimateSequence(player[cardId]);
    table.push(...player.splice(cardId, 1));
    table.forEach((x) => addAnimateSequence(x));
    player.forEach((x) => addAnimateSequence(x));
    placeCards();
}

function takeCards(player) {
    while(table.length) {        
        player.push(table[0]);        
        table.splice(0,1);
    };
    player.forEach((x) => addAnimateSequence(x));
    placeCards();
}

function dealCards(attacker, deferender) {      
    if (attacker.length < 6) {
        attacker.forEach((x) => addAnimateSequence(x));
    }
    if (deferender.length < 6) {
        deferender.forEach((x) => addAnimateSequence(x));
    }
    while ((attacker.length < 6 || deferender.length < 6) && deck.length) {
        if (attacker.length < 6) {
            addAnimateSequence(deck[0]);
            attacker.push(...deck.splice(0,1));            
        }
        if (deferender.length < 6) {
            addAnimateSequence(deck[0]);
            deferender.push(...deck.splice(0,1));            
        }
    }
    placeCards();
}

function isCardBigger(attack, defend) {    
    if (attack.suit == defend.suit) {
        return defend.value > attack.value;
    } else if (attack.suit != trump.suit && defend.suit == trump.suit) {
        return true;
    }
    return false;
}

async function computerMove() {    
    await new Promise((s,f) => {
        //console.log('waiting for animateSequence');
        let checker = setInterval(() => {
            if (!animateSequence.length) {
                clearInterval(checker);
                setTimeout(() => {
                    //console.log('animateSequence finished');
                    s();
                }, 800);                
            }
        }, 50);        
    });  
    let i;

    if (checkWinner() || isPlayerMove) {        
        return;
    }

    if (!isPlayerTurn) { // attack & toss
        // attack Alorithm
        let canToss = p2.filter((x) => {
            if (!table.length) return true;
            return table.map((y) => y.value).indexOf(x.value) > -1;
        });

        canToss.sort((a, b) => {
            let aSuit = a.suit == trump.suit ? 1 : 0; 
            let bSuit = b.suit == trump.suit ? 1 : 0; 
        
            return aSuit - bSuit || a.value - b.value;  
        });
                
        if (canToss.length) {
            i = p2.indexOf(canToss[0]);

            if (deck.length && !p1.length) {
                console.log('player one has no cards left');
                i = -1;
            }
            
            if (table.length > 0) {
                let tossCard = canToss[0];
                let tossValue = tossCard.value + (tossCard.suit == trump.suit ? 9 : 0);
                
                console.log('tossCard:', `${tossCard.value}${suits[tossCard.suit]}`, 'tossValue', tossValue, 'heatMap', heatMapArr[deck.length][tossValue-6]);

                if (heatMapArr[deck.length][tossValue-6] < 16) {                    
                    console.log('Alorithm says no');
                    i = -1;
                }
            }
        }

        if (i > -1) {            
            playCard(p2, i);
            isPlayerMove = true;
        } else {            
            discardCards();
            dealCards(p2, p1);
            isPlayerTurn = true;
            isPlayerMove = true;
        }
    } else if (isPlayerTurn)  { // defend
        // defend Alorithm
        let canBeat = p2.filter((x) => isCardBigger(table[table.length-1], x));
        canBeat.sort((a, b) => {
            let aSuit = a.suit == trump.suit ? 1 : 0; 
            let bSuit = b.suit == trump.suit ? 1 : 0; 

            return aSuit - bSuit || a.value - b.value;  
        });
        
        if (canBeat.length) {
            i = p2.indexOf(canBeat[0]);
            
            let attachCard = table[table.length-1];
            let attackValue = attachCard.value + (attachCard.suit == trump.suit ? 9 : 0);
            let beatCard = canBeat[0];
            let beatValue = beatCard.value + (beatCard.suit == trump.suit ? 9 : 0);
            
            let row = deck.length;

            let diff = beatValue - attackValue;
            console.log('attack:', `${attachCard.value}${suits[attachCard.suit]}`, 'Beat:', `${beatCard.value}${suits[beatCard.suit]}`, 'diff', diff, 'heatMap', heatMapArr[row][beatValue-6]);

            if (diff > heatMapArr[row][beatValue-6]) {
                console.log('Alorithm says no');
                i = -1;
            }            
        }

        if (i > -1) {                    
            playCard(p2, i);
            isPlayerMove = true;
        } else {
            takeCards(p2);
            dealCards(p1, p2);
            isPlayerTurn = true;
            isPlayerMove = true;
        }
    }
}

(function() {    
    deck = deck.sort(() => 0.5 - Math.random()); // shuffle deck    
    // place deck
    for (let i = 0; i < deck.length; i++) {           
        placeCard((ctx.canvas.width/2) + (cardHeight/2) - ((deck.length-1)/2) + (i/2), (i/2) + padding, deck[i], 90, true);                   
    }
    

    dealCards(p1, p2);
    
    trump = deck[0];
    if (trump) {
        deck.splice(0, 1);
        deck.push(trump); 
        addAnimateSequence(trump);      
    }

    let lowestTrump = p1.concat(p2)
                        .filter((x) => x.suit == trump.suit)
                            .sort((a,b) => a.value - b.value)[0];

    isPlayerTurn = isPlayerMove = p1.indexOf(lowestTrump) > -1;    
    
    placeCards();

    computerMove();
    draw();
})();
// #endregion

showPcCards.addEventListener('change', () => {
    p2.forEach((x) => x.showFront = showPcCards.checked );
});
