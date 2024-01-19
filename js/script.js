document.addEventListener('DOMContentLoaded', () => {
    const gridSize = 10; // 10x10 grid for simplicity
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

    // Multi-state button
    let gameStateButton = document.createElement('button');
    gameStateButton.textContent = 'Start';
    document.body.appendChild(gameStateButton);

    gameStateButton.addEventListener('click', () => {
        if (gameStateButton.textContent === 'Start') {
            gameInterval = setInterval(updateGameState, 200); // Start the game
            gameStateButton.textContent = 'Pause';
        } else if (gameStateButton.textContent === 'Pause') {
            clearInterval(gameInterval); // Pause the game
            gameInterval = null;
            gameStateButton.textContent = 'Resume';
        } else if (gameStateButton.textContent === 'Resume') {
            gameInterval = setInterval(updateGameState, 200); // Resume the game
            gameStateButton.textContent = 'Pause';
        }
    });

});
