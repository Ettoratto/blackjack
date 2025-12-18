let cards = [
  "clubAce", "clubKing", "clubQueen", "clubJack", 
  "heartAce", "heartKing", "heartQueen", "heartJack",
  "diamondAce", "diamondKing", "diamondQueen", "diamondJack",
  "spadeAce", "spadeKing", "spadeQueen", "spadeJack"
]

for(i = 2; i < 11; i++){

    cards.push("club" + i)
    cards.push("heart" + i)
    cards.push("diamond" + i)
    cards.push("spade" + i)
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
balanceSpan.innerHTML = "Balance: " + balance

function bet(){

    let amount = parseInt(document.getElementById("bet-amount").value)

    if(balance >= amount){
        
        balance -= amount

        balanceSpan.innerHTML = "Balance: " + balance
        deal()
    }
}


function deal(){

    if(c == 51)
        shuffle()

    let dealt = []
    for(let i = 0; i < 4; i++){
        dealt.push(cardData[cards[c].toString()])
        c++
    }

    let dealerPoints
    let playerPoints

    dealerCards.innerHTML =  dealt[0] + "<span id='facedown'>" + cardData["redBack"] + "</span>" + "<span id='faceup' hidden>" + dealt[1] + "</span>"

    playerCards.innerHTML = dealt[2] + dealt[3]
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

    cards.sort(() => Math.random() - 0.5)
    c = 0;
}



