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
        img: entity,
        suit: Math.floor(i / 9),
        value: (i % 9) + 5
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
// #endregion

let myCard =  {
    img: 0xDCA2,
    suit: 0,
    value: 2,
    fx: 2,
    fy: 291,
    x: 500,
    y: 250
};

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
    text: 'Take'
};
const btnPass = {
    x: 260,
    y: 20,
    width: 100,
    height: 32,
    text: 'Pass'
};

const bg = 'white';

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
    
    // draw p1 cards
    let step = Math.min(40, ctx.canvas.height / p1.length);
    let totalHeight = Math.min(ctx.canvas.height, step * p1.length + 80);
    let offset = 106 + (ctx.canvas.height - totalHeight) / 2;    
    for (let i = 0; i < p1.length; i++) {        
        drawCard(0, (offset + (step*i)), p1[i]);
    }

    // draw p2 cards
    step = Math.min(40, ctx.canvas.height / p2.length);
    totalHeight = Math.min(ctx.canvas.height, step * p2.length + 80);
    offset = 106 + (ctx.canvas.height - totalHeight) / 2;    
    for (let i = 0; i < p2.length; i++) {  
        let card = {
            img: 0xDCA0,
            suit: 1,
            value: 0        
        };      
        if (showPcCards.checked) {
            card = p2[i];
        }
        drawCard(ctx.canvas.width-84, (offset + (step*i)), card);
    }

    // draw trump
    drawCard(ctx.canvas.width/2 - 40, 120, deck[deck.length-1]);

    // draw deck
    for (let i = 0; i < deck.length/4; i++) {   
        let card = {
            img: 0xDCA0,
            suit: 1,
            value: 0        
        };

        drawCard(ctx.canvas.width/2-44+(2*i), 120-(2*i), card, true);
    }

    // draw discard
    for (let i = 0; i < discard.length/4; i++) {   
        let card = {
            img: 0xDCA0,
            suit: 1,
            value: 0        
        };

        drawCard(ctx.canvas.width/2+220+(2*i), 120-(2*i), card, true);
    }

    // draw table
    step = 100;
    for (let i = 0; i < table.length; i+=2) {  
        let j = Math.floor(i % 14 / 2);

        let columnCount = i > 0 && (Math.floor(i / 14) > 0) 
                            ? Math.min(table.length % 14, 14)
                                : Math.min(table.length, 14);  

        let columnWidth = step * Math.ceil(columnCount / 2);

        let xOffset = (ctx.canvas.width - columnWidth) / 2 + 8;
        let yOffset = table.length > 14 && Math.floor(i / 14) > 0 
                        ? 168 // bottom row
                            : (table.length > 14 ? 0 : 44); // top or middle rows
        
        drawCard(xOffset + (step*j), yOffset + (ctx.canvas.height / 2), table[i]);
        if (table[i+1]) {
            drawCard(xOffset + (step*j) + (6), yOffset + (ctx.canvas.height / 2) + 34, table[i+1]);
        }
    }

    //let aa = (myCard.fx - myCard.x)/2;
    //let bb = (myCard.fy - myCard.y)/2;
    //drawCard(aa,bb, myCard);
    //requestAnimationFrame(draw);
}

function drawCard(x, y, card, rotate) {
    if (!card) return;

    ctx.save();    
    ctx.translate(x, y);

    card.x = x + 2;
    card.y = y + 15 - 120;
    card.width = 80;
    card.height = 120;
    
    if (rotate) {
        ctx.rotate(90 * Math.PI / 180);            
        ctx.translate(-106, 0);     

        card.x += -106;        
    }    
    
    ctx.fillStyle = 'white';      
    ctx.fillRect(2, 15, 80, -120);

    ctx.font = '8rem sans-serif';
    ctx.fillStyle = card.suit % 3 ? 'red' : 'black';
    if (!card.value) {
        ctx.fillStyle = '#072774';
    }

    ctx.fillText(String.fromCharCode(0xD83C, card.img), 0, 0);
    ctx.restore();
}

function drawButton(btn) {
    ctx.beginPath();
    ctx.rect(btn.x, btn.y, btn.width, btn.height);
    ctx.fillStyle = 'rgba(225,225,225,0.5)';
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

canvas.addEventListener('mouseup', (event) => {   
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
        table.push(...p1.splice(i,1));
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
    

    draw();
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

function takeCards(player) {
    while(table.length) {
        player.push(table[0]);
        table.splice(0,1);
    };
}

function dealCards(attacker, deferender) {      
    while ((attacker.length < 6 || deferender.length < 6) && deck.length) {
        if (attacker.length < 6) {
            attacker.push(...deck.splice(0,1));            
        }
        if (deferender.length < 6) {
            deferender.push(...deck.splice(0,1));            
        }
    }
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
    await new Promise(r => setTimeout(r, 800));  
    let i;

    if (checkWinner() || isPlayerMove) {
        draw();
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
            table.push(...p2.splice(i, 1));
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
            table.push(...p2.splice(i, 1));
            isPlayerMove = true;
        } else {
            takeCards(p2);
            dealCards(p1, p2);
            isPlayerTurn = true;
            isPlayerMove = true;
        }
    }

    draw();
}

(function() {    
    deck = deck.sort(() => 0.5 - Math.random()); // shuffle deck

    dealCards(p1, p2);
    
    trump = deck[0];
    if (trump) {
        deck.splice(0, 1);
        deck.push(trump);
    }

    let lowestTrump = p1.concat(p2)
                        .filter((x) => x.suit == trump.suit)
                            .sort((a,b) => a.value - b.value)[0];

    isPlayerTurn = isPlayerMove = p1.indexOf(lowestTrump) > -1;    
    
    draw();
    computerMove();    
})();
// #endregion

showPcCards.addEventListener('change', () => draw());