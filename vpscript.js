let gv = {
  playersHand: [],
  credits: 100,
  deckOfCards: [],
  discard: [],
  result: 0
}

function randRange(high, low = 0) {
  let num = Math.floor(Math.random() * (high - low) + low);
  return num;
}

function createDeck() {
  let card = [];
  let deck = [];
  let rank = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
  let suit = ['Spades', 'Clubs', 'Diamonds', 'Hearts'];
  for (let i = 0; i < suit.length; i++) {
    for (let j = 0; j < rank.length; j++) {
      card = [rank[j], suit[i], j + 1, false];
      deck.push(card);
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  let pile1 = deck.splice(0, deck.length / 2);
  let pile2 = deck.splice(0, deck.length);
  let temp;
  let shuffledDeck = [];
  let x;
  let y;
  for (let i = 0; i <= pile1.length * 150; i++) {
    x = randRange(pile1.length);
    y = randRange(pile2.length);
    temp = pile1[x];
    pile1[x] = pile2[y];
    pile2[y] = temp;
  }
  shuffledDeck = pile2.concat(pile1);
  return shuffledDeck;
}

function dealCards(deck, hand, numberOfCards) {
  for (let i = 0; i < numberOfCards; i++) {
    hand[i] = deck.pop();
  }
  return hand;
}

/*pairCheck determines: pair = 1, 2-pair = 2, 3 of Kind = 3, 
  Full house = 4, and 4 of a Kind = 6
*/
function pairCheck(playersHand) {
  let result = 0;
  let jacks = 0;
  for (let i = 0; i < 5; i++) {
    let j = i + 1;
    while (j < 5) {
      if (playersHand[i][0] === playersHand[j][0]) {
        result++;
        jacks = playersHand[i][2] < 11 ? 0 : 1;
      } 
      
    j++;
    }
  }
  return (result === 1 && jacks === 0 ? 0 : result);
}

function flushCheck(cards) {
  let i = 1;
  while (i < 5) {
    if (cards[0][1] !== cards[i][1]) {
      return 0;
    }
    i++;
  }
  return 7;
}

function straightTest(cards) {  
  for (let i = 0; i < 4; i++) {
    if (cards[i] + 1 !== cards[i + 1]) {
      return 0;
    }
  }
  return 5;
}

function straightCheck(cards) {
  let values = [];
  let valuesA = [];
  let result = 0;
    for (let i = 0; i < 5; i++) {
      values.push(cards[i][2]);
    }
  values.sort(function(a,b) {return a-b});
  if (values[0] === 1) {
    valuesA = values.slice(1); 
    valuesA.push(14); 
  }
  
  if (straightTest(values) === 5) {
    return 5;
  }
  else if (valuesA === null) {
      return 0;
  } 
  else if (straightTest(valuesA) === 5) {
      return 5;
  }
  else {
    return 0;
  }
}

function payOut(result) {
  if (result < 2) {
    return (result === 0 ? 0 : 1);
  }
  else if (result < 6)  {
    if (result < 4) {
      return (result === 2 ? 2 : 3);
    }
    return (result === 4 ? 9 : 4);
  }
  else {
    if (result < 8) {
      return (result === 6 ? 25 : 6);
    }
    return (result === 8 ? 50 : 250);
  }
}

function makeBet(amount, wager) {
  gv.credits = amount - wager;
}

function payBet(amount, wager, payout) {
  return amount + wager * payout;
}

function putElements(cards,id) {
  let para = document.createElement("p");
  let node = document.createTextNode(cards);
  let element = document.getElementById(id);
  para.appendChild(node);
  return element.appendChild(para);
}

function displayCard(hand) {
  let handL = hand.length;
  for (let i = 0; i < handL; i++) {
    let x = hand[i];
    let y = `${x[0]} of ${x[1]}`;
    putElements(y, 'card' + (i+1));
  }
}

function detectEvents(id, len = 1) {
  for (let i = 1; i <= len; i++) {
    document.getElementById(id + i).addEventListener("click", function() {holdCard(id, i)});
  }
}

function holdCard(text, i) {
  if (gv.playersHand[i - 1][3] === false) {
    document.getElementById(text + i).style.border = "2px solid yellow";
    gv.playersHand[i - 1][3] = true;
  }
  else {
    document.getElementById(text + i).style.border = "1px solid black";
    gv.playersHand[i - 1][3] = false;
  }console.log(gv.playersHand[i - 1][3]);
}

function drawCards(hand, deck) {
  for (let i = 0; i < hand.length; i++) {
    if (hand[i][1] === true) continue;
    let card = hand[i];
    hand[i] = deck.pop();
    deck.unshift(card);
  }
}

function updateCredits(credits) {
  
  document.getElementById('credits').innerHTML = credits;
}

function initPoker() {
  // putElements(gv.credits, "credits");
  gv.deckOfCards = createDeck();
  gv.deckOfCards = shuffleDeck(gv.deckOfCards);
  document.getElementById('bet').addEventListener('click', function() {makeBet(gv.credits, 1);});
  document.getElementById('dealOrDraw').addEventListener('click', playPokerDeal);
  updateCredits(gv.credits);
}

function playPokerDeal() {
  detectEvents("card", 5);
  updateCredits(gv.credits);
  dealCards(gv.deckOfCards, gv.playersHand, 5);
  displayCard(gv.playersHand);
  gv.result = pairCheck(gv.playersHand);
  document.getElementById('result').innerHTML = gv.result;
  playPokerDraw();
  
  
}

function playPokerDraw() {
  document.getElementById('dealOrDraw').innerHTML = 'DRAW';
  gv.deckOfCards = gv.deckOfCards.concat(gv.playersHand);
}

initPoker();
console.log("done");

// putElements("does it work", "cards");
