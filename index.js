let players = [];
let drawnNumbers = [];
let intervalId;

function generateCardNumbers() {
    let card = [];
    for (let i = 0; i < 5; i++) {
        let row = [];
        let possibleNumbers = [];
        for (let j = 0; j < 15; j++) {
            possibleNumbers.push(j + 1 + (i * 15));
        }
        for (let j = 0; j < 5; j++) {
            let index = Math.floor(Math.random() * possibleNumbers.length);
            let num = possibleNumbers.splice(index, 1)[0];
            row.push(num);
        }
        card.push(row);
    }
    return card;
}


function addPlayer() {
    let name = document.querySelector('#name-input').value;
    if (!name) return;
    let card = generateCardNumbers();
    let player = { name: name, card: card };
    players.push(player);
    document.querySelector('#name-input').value = "";
    reloadCards();
}

function reloadCards() {
    let bingoCardDiv = document.querySelector('#bingo-card');
    bingoCardDiv.innerHTML = "";
    players.forEach(player => {
        let table = document.createElement('table');
        
        // adicionar nome do player
        let playerRow = document.createElement('tr');
        let playerData = document.createElement('td');
        playerData.textContent = player.name;
        playerData.setAttribute('colspan', '5');
        playerRow.appendChild(playerData);
        table.appendChild(playerRow);


        let header = document.createElement('tr');
        ['B', 'I', 'N', 'G', 'O'].forEach(char => {
            let th = document.createElement('th');
            th.textContent = char;
            header.appendChild(th);
        });
        table.appendChild(header);


        player.card.forEach(row => {
            let tr = document.createElement('tr');
            row.forEach(num => {
                let td = document.createElement('td');
                td.textContent = num;
                if (drawnNumbers.includes(num)) {
                    td.style.backgroundColor = 'red';
                }
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });
        bingoCardDiv.appendChild(table);
    });
}

function checkWinner(player) {
    for (let i = 0; i < player.card.length; i++) {
        for (let j = 0; j < player.card[i].length; j++) {
            if (!drawnNumbers.includes(player.card[i][j])) {
                return false;
            }
        }
    }
    return true;
}

function resetGame() {
    document.querySelector('#bingo-card').innerHTML = "";
    document.querySelector('#drawn-numbers').innerHTML = "";
    document.querySelector('#winner').textContent = ""; 
    drawnNumbers = [];
}

function drawNumber() {
    if (drawnNumbers.length >= 75) {
        clearInterval(intervalId);
        return;
    }

    let number;
    do {
        number = Math.floor(Math.random() * 75) + 1;
    } while (drawnNumbers.includes(number));

    drawnNumbers.push(number);
    let drawnNumbersDiv = document.querySelector('#drawn-numbers');
    let numberDiv = document.createElement('div');
    numberDiv.textContent = number;
    drawnNumbersDiv.appendChild(numberDiv);
    reloadCards()
   
    players.forEach(player => {
        if (checkWinner(player)) {
           
            document.querySelector('#winner').textContent += player.name + ' venceu!\n';
            clearInterval(intervalId);
        }
    });
}

function startGame() {
    intervalId = setInterval(drawNumber, 100);
}

function stopGame() {
    clearInterval(intervalId);
}

document.querySelector('#generate-btn').addEventListener('click', addPlayer);
document.querySelector('#reset-btn').addEventListener('click', resetGame);
document.querySelector('#play-btn').addEventListener('click', startGame); 
document.querySelector('#stop-btn').addEventListener('click', stopGame);