let player1, player2, currentPlayer;
const ROWS = 6;
const COLS = 7;
let board = [];

const boardElement = document.getElementById("game-board");
const statusElement = document.getElementById("status");

/* Créer la grille  */
createBoard(); // Crée la grille dès le chargement de la page
function createBoard() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    boardElement.innerHTML = '';

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            boardElement.appendChild(cell);
        }
    }
}

/* lance une partie*/
function startGame() {
    player1 = document.getElementById("userInput1").value || "Joueur Rouge";
    player2 = document.getElementById("userInput2").value || "Joueur Jaune";
    currentPlayer = player1;                                /*c au tour du premier joueur*/
    statusElement.textContent = `C'est au tour de ${currentPlayer}`;
    statusElement.classList.remove("win-message");
    createBoard();
    boardElement.style.pointerEvents = "auto";
    updateHover();
}

/*change la couleur du hover selon le joueur*/
function updateHover() {
    boardElement.classList.remove("hover-red", "hover-yellow");
    boardElement.classList.add(currentPlayer === player1 ? "hover-red" : "hover-yellow");
}

/*clique sur la case*/
boardElement.addEventListener("click", (e) => {
    const col = parseInt(e.target.dataset.col);
    if (isNaN(col)) return;

    for (let row = ROWS - 1; row >= 0; row--) {
        if (!board[row][col]) {
            board[row][col] = currentPlayer;
            const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
            cell.classList.add(currentPlayer === player1 ? "red" : "yellow");

            if (checkWin(row, col)) {
                statusElement.textContent = `${currentPlayer.toUpperCase()} a gagné 🎉 !`;
                statusElement.classList.add("win-message");
                boardElement.style.pointerEvents = "none";
            } else {
                currentPlayer = currentPlayer === player1 ? player2 : player1;
                statusElement.textContent = `C'est au tour de ${currentPlayer}`;
                updateHover();
            }
            break;
        }
    }
});

/*vérifie à chaque coup si les 4pions sont alignés*/
function checkWin(row, col) {
    const directions = [
        { dr: 0, dc: 1 },   /* Horizontal*/
        { dr: 1, dc: 0 },   /* Vertical */
        { dr: 1, dc: 1 },   /* Diagonale */
        { dr: 1, dc: -1 }   /* Diagonale mais dans l'autre sens*/
    ];

    for (let { dr, dc } of directions) {
        const line = [[row, col]];
        let r = row + dr, c = col + dc;
        while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) {
            line.push([r, c]);
            r += dr; c += dc;
        }
        r = row - dr; c = col - dc;
        while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) {
            line.push([r, c]);
            r -= dr; c -= dc;
        }

        if (line.length >= 4) {
            highlightWin(line);
            return true;
        }
    }
    return false;
}

/*animation brillante quand on gagne*/
function highlightWin(cells) {
    for (let [r, c] of cells) {
        const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
        if (cell) cell.classList.add("win");
    }
}


/* si on a pas choisi le nom des joueurs*/
boardElement.addEventListener("click", (e) => {
    if (!currentPlayer) {
        alert("⚠️ Choisissez déjà les noms des deux joueurs et lancez la partie !");
        return;
    }

    const col = parseInt(e.target.dataset.col);
    if (isNaN(col)) return;
});
