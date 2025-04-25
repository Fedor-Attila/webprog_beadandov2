document.addEventListener('DOMContentLoaded', function() {
    // Játék osztály
    class TicTacToe {
        constructor() {
            this.board = Array(9).fill(null);
            this.currentPlayer = 'X';
            this.gameOver = false;
            this.winner = null;
            this.moves = 0;
            
            this.render();
        }
        
        // Játék állapotának renderelése
        render() {
            const gameBoard = document.getElementById('gameBoard');
            const gameInfo = document.getElementById('gameInfo');
            
            // Tábla ürítése
            gameBoard.innerHTML = '';
            
            // Cellák létrehozása
            this.board.forEach((cell, index) => {
                const cellElement = document.createElement('div');
                cellElement.classList.add('cell');
                cellElement.textContent = cell || '';
                cellElement.addEventListener('click', () => this.makeMove(index));
                gameBoard.appendChild(cellElement);
            });
            
            // Játék információ
            if (this.gameOver) {
                if (this.winner) {
                    gameInfo.textContent = `A játék véget ért! Nyertes: ${this.winner}`;
                } else {
                    gameInfo.textContent = 'A játék véget ért! Döntetlen!';
                }
            } else {
                gameInfo.textContent = `Következő játékos: ${this.currentPlayer}`;
            }
        }
        
        // Lépés végrehajtása
        makeMove(index) {
            if (this.gameOver || this.board[index] !== null) return;
            
            this.board[index] = this.currentPlayer;
            this.moves++;
            
            // Győzelem ellenőrzése
            if (this.checkWin()) {
                this.gameOver = true;
                this.winner = this.currentPlayer;
            } else if (this.moves === 9) {
                this.gameOver = true; // Döntetlen
            } else {
                // Játékos váltás
                this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            }
            
            this.render();
        }
        
        // Győzelem ellenőrzése
        checkWin() {
            const winPatterns = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // sorok
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // oszlopok
                [0, 4, 8], [2, 4, 6]             // átlók
            ];
            
            return winPatterns.some(pattern => {
                const [a, b, c] = pattern;
                return this.board[a] && 
                       this.board[a] === this.board[b] && 
                       this.board[a] === this.board[c];
            });
        }
        
        // Játék újraindítása
        reset() {
            this.board = Array(9).fill(null);
            this.currentPlayer = 'X';
            this.gameOver = false;
            this.winner = null;
            this.moves = 0;
            this.render();
        }
    }
    
    // Játék létrehozása
    const game = new TicTacToe();
    
    // Új játék gomb
    document.getElementById('newGameBtn').addEventListener('click', function() {
        game.reset();
    });
    
    // Speciális játékos osztály
    class AdvancedPlayer extends TicTacToe {
        constructor() {
            super();
            this.scores = { X: 0, O: 0, draw: 0 };
        }
        
        render() {
            super.render();
            
            const gameInfo = document.getElementById('gameInfo');
            if (!this.gameOver) {
                gameInfo.textContent += ` | Pontok: X: ${this.scores.X}, O: ${this.scores.O}, Döntetlen: ${this.scores.draw}`;
            }
        }
        
        makeMove(index) {
            super.makeMove(index);
            
            if (this.gameOver) {
                if (this.winner) {
                    this.scores[this.winner]++;
                } else {
                    this.scores.draw++;
                }
            }
        }
    }
    
    // Speciális játék indítása (bemutatás céljából)
    // const advancedGame = new AdvancedPlayer();
    // document.getElementById('newGameBtn').addEventListener('click', function() {
    //     advancedGame.reset();
    // });
});