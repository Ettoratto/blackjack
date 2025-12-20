
let cards = [
  { name: "clubAce", value: 11 },
  { name: "clubKing", value: 10 },
  { name: "clubQueen", value: 10 },
  { name: "clubJack", value: 10 },
  { name: "heartAce", value: 11 },
  { name: "heartKing", value: 10 },
  { name: "heartQueen", value: 10 },
  { name: "heartJack", value: 10 },
  { name: "diamondAce", value: 11 },
  { name: "diamondKing", value: 10 },
  { name: "diamondQueen", value: 10 },
  { name: "diamondJack", value: 10 },
  { name: "spadeAce", value: 11 },
  { name: "spadeKing", value: 10 },
  { name: "spadeQueen", value: 10 },
  { name: "spadeJack", value: 10 }
]

for(i = 2; i < 11; i++){

    cards.push({name:"club" + i,value: i})
    cards.push({name:"heart" + i,value: i})
    cards.push({name:"diamond" + i,value: i})
    cards.push({name:"spade" + i,value: i})
}


let c;
shuffle()

let cardData = null

async function init() {
    const response = await fetch("./cards.json")
    cardData = await response.json()

}




let dealerCards = document.getElementById("dealer-cards")
let playerCards = document.getElementById("player-cards")
let balanceSpan = document.getElementById("balance")

let balance = 1000;
let dealerAces = 0
let playerAces = 0
let dealerPoints = 0
let playerPoints = 0

balanceSpan.innerHTML = "Balance: " + balance

function bet(){

    let amount = parseInt(document.getElementById("bet-amount").value)

    if(balance >= amount){
        
        balance -= amount

        balanceSpan.innerHTML = "Balance: " + balance
        deal()
    }else{
        error()
    }
}


function deal(){

    let dealt = []

    for(let i = 0; i < 4; i++){

        dealt.push(cardData[cards[c].name])
        
        if(i < 2){
            if(isAce(cards[c].name))
                dealerAces++
            dealerPoints += getPoints(cards[c], dealerPoints, dealerAces)
        }else{
            if(isAce(cards[c].name))
            playerAces++
            playerPoints += getPoints(cards[c], playerPoints, playerAces)
        }

        console.log("d:" +dealerPoints, "\np:" + playerPoints)
        c++
    }




    dealerCards.innerHTML =  dealt[0] + "<span id='facedown'>" + cardData["redBack"] + "</span>" + "<span id='faceup' hidden>" + dealt[1] + "</span>"

    playerCards.innerHTML = dealt[2] + dealt[3]

}

function hit(dealer){

    if(dealer != null){
        dealerCards.innerHTML += cardData[cards[c].name]
        dealerPoints += getPoints(cards[c], dealerPoints, dealerAces)
    }else{
        playerCards.innerHTML += cardData[cards[c].name]
        playerPoints += getPoints(cards[c], playerPoints, playerAces) 
    }
}


function buy(){

    let amount = document.getElementById("add-funds")

    const regex = /^[0-9]+$/

    if(!regex.test(amount.value))
        message = balance
    else
        message = (balance += parseInt(amount.value)) 

    balanceSpan.innerHTML = "Balance: " + message
}

function shuffle(){

    cards.sort(() => Math.random() -0.5)
    c = 0;
}


function getPoints(card, points, aces){

    let total = card.value + points
    let i = 0
    let lowAce = false

    while(total > 21 && i < aces){

        total -= 10
        i++
        lowAce = true
    }
    
    if(lowAce)
        return 1

    return card.value
}

function error(){


}

function isAce(card){
    let isAce = /ace/i

    return isAce.test(card)
}


