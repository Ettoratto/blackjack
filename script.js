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


let c = 0

let cardData = null

async function init() {
    const response = await fetch("./cards.json")
    cardData = await response.json()

}

let betAmount = 0

let playerName = document.getElementById("player-name")

let standButton = document.getElementById("stand-button")
let hitButton = document.getElementById("hit-button")
let betButton = document.getElementById("bet-button")

let balanceDisplay = document.getElementById("balance")
let playerPointsDisplay = document.getElementById("player-points")
let dealerPointsDisplay = document.getElementById("dealer-points")

let dealerCards = document.getElementById("dealer-cards")
let playerCards = document.getElementById("player-cards")


let players = [
        {name: "Dealer", points: 0, aces: 0, cards: dealerCards}, 
        {name: playerName.innerHTML, points: 0, aces: 0, balance: 1000, cards: playerCards}
    ]



function bet(){

    resetGame()

    betButton.disabled = true
    hitButton.disabled = false
    standButton.disabled = false

    betAmount = parseInt(document.getElementById("bet-amount").value)

    if(players[1].balance >= betAmount){
        
        players[1].balance -= betAmount

        balanceDisplay.innerHTML = "Balance: " + players[1].balance
        dealFirstHand()
    }else{
        window.alert("Broke :/")
    }
}


function dealFirstHand(){

    let dealt = []

    for(let i = 0; i < 4; i++){

        dealt.push(cardData[cards[c].name])
        
        if(i < 2){
            if(isAce(cards[c].name))
                players[0].aces++
            players[0].points = getPoints(cards[c], 0)
        }else{
            if(isAce(cards[c].name))
                players[1].aces++
            players[1].points = getPoints(cards[c], 1)
        }
        c++
    }

    dealerPointsDisplay.innerHTML = "?"
    players[0].cards.innerHTML =  dealt[0] + "<span id='facedown'>" + cardData["redBack"] + "</span>" + "<span id='faceup' hidden>" + dealt[1] + "</span>"

    playerPointsDisplay.innerHTML = players[1].points
    players[1].cards.innerHTML = dealt[2] + dealt[3]

    if(players[1].points == 21)
        endOfRound(1, true)

}

function hit(n = 1){

    players[n].cards.innerHTML += cardData[cards[c].name]
    if(isAce(cards[c].name))
        players[n].aces++

    players[n].points = getPoints(cards[c], n)
    
    if(n == 1)
        playerPointsDisplay.innerHTML = players[n].points
    else
        dealerPointsDisplay.innerHTML = players[n].points
    
    c++

    if(players[n].points > 21)
        endOfRound(+!n)
}

function stand(){

    document.getElementById("facedown").hidden = true
    document.getElementById("faceup").hidden = false

    dealerPointsDisplay.innerHTML = players[0].points
    let i = 0

    while(players[0].points < 17){
        i++
        hit(0)
        dealerPointsDisplay.innerHTML = players[0].points
    }

    if(players[0].points <= 21 && (players[0].points >= players[1].points))
        endOfRound(0, (players[0].points == 21 && i == 0))
    else
        endOfRound(1)
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


function getPoints(card, n){

    let total = card.value + players[n].points

    while(total > 21 && players[n].aces > 0){

        if(((card.value + players[n].points) - (players[n].aces * 10)) > 21 )
            return total
        total -= 10
        players[n].aces--
    }


    return total
}

function endOfRound(n, blackjack = false){

    if(blackjack && n == 1)
        playerPointsDisplay.innerHTML = "Blackjack!"
    else if(blackjack && n == 0)
        dealerPointsDisplay.innerHTML = "Blackjack!"

    hitButton.disabled = true
    standButton.disabled = true

    winCalc(players[n].name, blackjack)

}

function winCalc(winner, blackjack = false){

    if(winner != "Dealer"){

        if(blackjack)
            players[1].balance += betAmount + (betAmount * 1.5)
        else
            players[1].balance += 2 * betAmount 
    }

    loadWinScreen(winner)

}

function loadWinScreen(winner){

    document.getElementById("winner-name").innerHTML = winner
    document.getElementById("winner").hidden = false
    betButton.disabled = false
}

function resetGame(){

    shuffle()

    dealerPointsDisplay.innerHTML = "?"
    playerPointsDisplay.innerHTML = 0
    players[0].points = 0
    players[1].points = 0

    document.getElementById("winner").hidden = true
       
}

function isAce(card){
    let isAce = /ace/i

    return isAce.test(card)
}

function updatePlayerName() {

    let nameTrim = playerName.innerHTML.trim()

    if (nameTrim.toLocaleLowerCase() != "dealer")
        players[1].name = nameTrim
     else {
        playerName.innerHTML = "Player"
        players[1].name = "Player"
        alert("Name can't be 'Dealer'")
    }
}       


