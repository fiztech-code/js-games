let deck = [];
let discard = [];
let table = [];
let p1 = [];
let p2 = [];
let trump;

let isPlayerTurn = false;
let isPlayerMove = false;
let winner;

let message = '';

// #region - get card graphics from unicode chars
let suits = ['Spades','Hearts','Diamonds','Clubs'];
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
    ctx.save();    
    ctx.translate(ctx.canvas.width / 2 - 30, ctx.canvas.height - 10);
    ctx.font = '1rem sans-serif';
    ctx.fillStyle = 'black';
    message = winner != undefined ? (winner == p1 ? 'You win!' : 'You lose') : 'Your turn';
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
        drawCard(ctx.canvas.width-84, (offset + (step*i)), p2[i]);
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
    if (isPlayerMove && i > -1) {
        table.push(...p1.splice(i,1));
        isPlayerMove = false;
    }


    if (isPlayerTurn && isPointInRectangle(x, y, btnPass)) {
        isPlayerTurn = false;
        isPlayerMove = false;        
        discardCards();
        dealCards(p1, p2);
    }

    if (!isPlayerTurn && isPointInRectangle(x, y, btnTake)) {    
        isPlayerTurn = false;
        isPlayerMove = false;    
        takeCards(p1);
        dealCards(p2, p1);
    } 
    

    computerMove();
    draw();
});
// #endregion

// #region - game logic
function checkWinner() {     
    if (!deck.length && (!p1.length || !p2.length)) {
        winner = !p2.length ? p2 : p1;
        console.log('Check winner', (winner == p1 ? 'human' : 'pc'));  
        return true;
    } 
    return false;
}

function discardCards() {
    console.log('Discard cards', table.length);
    while(table.length) {
        discard.push(table[0]);
        table.splice(0,1);
    };
}

function takeCards(player) {
    console.log('Take cards', (player == p1 ? 'human' : 'pc'));
    while(table.length) {
        player.push(table[0]);
        table.splice(0,1);
    };
}

function dealCards(attacker, deferender) {  
    let i = 0, j = 0;
    while ((attacker.length < 6 || deferender.length < 6) && deck.length) {
        if (attacker.length < 6) {
            attacker.push(...deck.splice(0,1));
            i++;
        }
        if (deferender.length < 6) {
            deferender.push(...deck.splice(0,1));
            j++;
        }
    }   
    
    console.log('Deal Cards: ', (attacker == p1 ? `Human: ${i} cards,` : `Pc: ${j} cards,`), (deferender == p1 ? `Human: ${i} cards` : `Pc: ${j} cards`));
}

function isCardBigger(attack, defend) {
    console.log('isCardBigger', suits[attack.suit], attack.value, suits[defend.suit], defend.value);
    if (attack.suit == defend.suit) {
        return defend.value > attack.value;
    } else if (attack.suit != trump.suit && defend.suit == trump.suit) {
        return true;
    }
    return false;
}


function computerMove() {       
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
        }

        if (i > -1) {        
            table.push(...p2.splice(i, 1));
            isPlayerMove = true;
        } else {
            isPlayerTurn = true;
            isPlayerMove = true;
            discardCards();
            dealCards(p2, p1);
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
        }

        if (i > -1) {        
            table.push(...p2.splice(i, 1));
            isPlayerMove = true;
        } else {
            isPlayerTurn = true;
            isPlayerMove = true;   
            takeCards(p2);
            dealCards(p1, p2);
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
    console.log('isPlayerTurn', isPlayerTurn);
    
    computerMove();

    draw();
})();
// #endregion