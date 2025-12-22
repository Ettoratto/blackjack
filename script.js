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

let standButton = document.getElementById("stand-button")
let hitButton = document.getElementById("hit-button")
let betButton = document.getElementById("bet-button")

let balanceDisplay = document.getElementById("balance")
let playerPointsDisplay = document.getElementById("player-points")
let dealerPointsDisplay = document.getElementById("dealer-points")

let dealerCards = document.getElementById("dealer-cards")
let playerCards = document.getElementById("player-cards")


let players = [{points: 0, aces: 0, cards: dealerCards}, {points: 0, aces: 0, balance: 1000, cards: playerCards}] //dealer, player



function bet(){

    betButton.disabled = true
    hitButton.disabled = false
    standButton.disabled = false
    let amount = parseInt(document.getElementById("bet-amount").value)

    if(players[1].balance >= amount){
        
        players[1].balance -= amount

        balanceDisplay.innerHTML = "Balance: " + players[1].balance
        dealFirstHand()
    }else{
        error()
    }
}


function dealFirstHand(){

    let dealt = []

    for(let i = 0; i < 4; i++){

        dealt.push(cardData[cards[c].name])
        
        if(i < 2){
            if(isAce(cards[c].name))
                players[0].aces++
            players[0].points = getPoints(cards[c], players[0].points, players[0].aces)
        }else{
            if(isAce(cards[c].name))
                players[1].aces++
            players[1].points = getPoints(cards[c], players[1].points, players[1].aces)
        }
        c++
    }

    if(players[1].points == 21)
        endOfRound(1, true)



    dealerPointsDisplay.innerHTML = "?"
    players[0].cards.innerHTML =  dealt[0] + "<span id='facedown'>" + cardData["redBack"] + "</span>" + "<span id='faceup' hidden>" + dealt[1] + "</span>"

    playerPointsDisplay.innerHTML = players[1].points
    players[1].cards.innerHTML = dealt[2] + dealt[3]

}

function hit(n = 1){

    console.log("Aces: " + players[n].aces)

    players[n].cards.innerHTML += cardData[cards[c].name]
    if(isAce(cards[c].name))
        players[n].aces++

    players[n].points = getPoints(cards[c], players[n].points, players[n].aces)
    playerPointsDisplay.innerHTML = players[n].points

    if(players[n].points == 21)
        endOfRound(n)
    c++
}

function stand(){

    while(players[0].points < 17)
        hit(0)
}


function buy(){

    let amount = document.getElementById("add-funds")

    const regex = /^[0-9]+$/

    if(!regex.test(amount.value))
        message = players[1].balance
    else
        message = (players[1].balance += parseInt(amount.value)) 

    balanceDisplay.innerHTML = "Balance: " + message
}

function shuffle(){

    cards.sort(() => Math.random() -0.5)
    c = 0
}


function getPoints(card, points, aces){

    let total = card.value + points
    let i = 0

    while(total > 21 && i < aces){

        console.log((total > 21 && i < aces))
        total -= 10
        i++
    }


    return total
}

function endOfRound(n, blackjack){

    if(blackjack)
        playerPointsDisplay.innerHTML += "Blackjack!"
}

function error(){


}

function isAce(card){
    let isAce = /ace/i

    return isAce.test(card)
}


