document.addEventListener('DOMContentLoaded', () => {
    const gridSize = 20;
    let grid = createGridArray(gridSize);
    let gameInterval = null; // Global variable to store the interval ID
    const container = document.getElementById('gameContainer');
    let isMouseDown = false; // Track if the mouse is pressed

    const toggleCell = (cell) => {
        let index = Array.from(cell.parentNode.children).indexOf(cell);
        let x = Math.floor(index / gridSize);
        let y = index % gridSize;
        grid[x][y] = !grid[x][y]; // Toggle cell state
        updateDisplay();
        updateClickCount(); // Add this line to update the click count
    };
    

    // Initialize grid display
    for (let i = 0; i < gridSize * gridSize; i++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        container.appendChild(cell);

        cell.addEventListener('mousedown', () => {
            isMouseDown = true;
            toggleCell(cell);
        });

        cell.addEventListener('mouseenter', () => {
            if (isMouseDown) {
                toggleCell(cell);
            }
        });

        cell.addEventListener('mouseup', () => {
            isMouseDown = false;
        });
    }

    // Add mouseup event listener to the whole document
    document.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    // Create a 2D array to represent the grid
    function createGridArray(size) {
        return new Array(size).fill(null).map(() => new Array(size).fill(false));
    }

    // Update display based on the grid state
    function updateDisplay() {
        let cells = document.querySelectorAll('.cell');
        cells.forEach((cell, i) => {
            let x = Math.floor(i / gridSize);
            let y = i % gridSize;
            if (grid[x][y]) {
                cell.classList.add('alive');
            } else {
                cell.classList.remove('alive');
            }
        });
    }

    // Function to calculate the next state
    function updateGameState() {
        let newGrid = createGridArray(gridSize);

        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                let aliveNeighbors = countAliveNeighbors(x, y);
                
                if (grid[x][y]) { // If cell is alive
                    newGrid[x][y] = aliveNeighbors === 2 || aliveNeighbors === 3;
                } else { // If cell is dead
                    newGrid[x][y] = aliveNeighbors === 3;
                }
            }
        }

        grid = newGrid;
        updateDisplay();
        updateTurnCount(); // Update the turn count each time the game state updates

        // Check if the grid is empty
        if (isGridEmpty()) {
            console.log("Grid is empty"); // For debugging
            clearInterval(gameInterval);
            gameInterval = null;
            gameStateButton.textContent = 'Start';
            alert("Game Over! The grid is empty.");
        }

        
    }

    function isGridEmpty() {
        return grid.every(row => row.every(cell => cell === false));
    }
    

    // Count alive neighbors
    function countAliveNeighbors(x, y) {
        let count = 0;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue; // Skip the cell itself
                let nx = x + dx, ny = y + dy;
                if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
                    count += grid[nx][ny] ? 1 : 0;
                }
            }
        }
        return count;
    }

    const startPauseButton = document.getElementById('startPauseButton');
    startPauseButton.addEventListener('click', () => {
        if (startPauseButton.textContent === 'Start') {
            gameInterval = setInterval(updateGameState, 200); // Start the game
            startPauseButton.textContent = 'Pause';
        } else if (startPauseButton.textContent === 'Pause') {
            clearInterval(gameInterval); // Pause the game
            gameInterval = null;
            startPauseButton.textContent = 'Resume';
        } else if (startPauseButton.textContent === 'Resume') {
            gameInterval = setInterval(updateGameState, 200); // Resume the game
            startPauseButton.textContent = 'Pause';
        }
    });

    const resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', () => {
        // Stop the game if it's running
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = null;
        }
    
        resetGrid();
        resetClickCount();
        resetTurnCount();
    
        // Reset the Start/Pause/Resume button text to 'Start'
        gameStateButton.textContent = 'Start';
    });

    function resetGrid() {
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = null;
            gameStateButton.textContent = 'Start';
        }
        grid = createGridArray(gridSize);
        updateDisplay();
    }
    

    let clickCount = 0;

    const updateClickCount = () => {
        clickCount++;
        // Update the click count display
        document.getElementById('clickCountDisplay').textContent = `Clicks: ${clickCount}`;
    };

    // Reset click count
    const resetClickCount = () => {
        clickCount = 0;
        document.getElementById('clickCountDisplay').textContent = `Clicks: ${clickCount}`;
    };

    let turnCount = 0;

    const updateTurnCount = () => {
        turnCount++;
        document.getElementById('turnCountDisplay').textContent = `Turns: ${turnCount}`;
    };

    // Reset turn count
    const resetTurnCount = () => {
        turnCount = 0;
        document.getElementById('turnCountDisplay').textContent = `Turns: ${turnCount}`;
    };

    function gridsAreSame(grid1, grid2) {
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                if (grid1[x][y] !== grid2[x][y]) {
                    return false;
                }
            }
        }
        return true;
    }
    

});
