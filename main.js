class Tetris {
    constructor(element) {
        this.element = element;
        this.canvas = element.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.context.scale(20, 20);

        this.arena = this.createMatrix(12, 20);
        this.player = {
            pos: { x: 0, y: 0 },
            matrix: null,
            score: 0,
            level: 1,
        };

        this.colors = [
            null,
            '#FF0D72', '#0DC2FF', '#0DFF72', '#F538FF',
            '#FF8E0D', '#FFE138', '#3877FF',
        ];

        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;
        this.isPaused = false;
        this.isGameOver = false;

        this.update = this.update.bind(this);
        this.reset();
    }

    createMatrix(w, h) {
        const matrix = [];
        while (h--) {
            matrix.push(new Array(w).fill(0));
        }
        return matrix;
    }

    createPiece(type) {
        if (type === 'I') {
            return [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
            ];
        } else if (type === 'L') {
            return [
                [0, 2, 0],
                [0, 2, 0],
                [0, 2, 2],
            ];
        } else if (type === 'J') {
            return [
                [0, 3, 0],
                [0, 3, 0],
                [3, 3, 0],
            ];
        } else if (type === 'O') {
            return [
                [4, 4],
                [4, 4],
            ];
        } else if (type === 'Z') {
            return [
                [5, 5, 0],
                [0, 5, 5],
                [0, 0, 0],
            ];
        } else if (type === 'S') {
            return [
                [0, 6, 6],
                [6, 6, 0],
                [0, 0, 0],
            ];
        } else if (type === 'T') {
            return [
                [0, 7, 0],
                [7, 7, 7],
                [0, 0, 0],
            ];
        }
    }

    draw() {
        // Clear canvas
        this.context.fillStyle = '#050505';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Grid Lines (Polish)
        this.context.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        this.context.lineWidth = 0.05;
        for (let x = 0; x < 12; x++) {
            this.context.beginPath();
            this.context.moveTo(x, 0);
            this.context.lineTo(x, 20);
            this.context.stroke();
        }
        for (let y = 0; y < 20; y++) {
            this.context.beginPath();
            this.context.moveTo(0, y);
            this.context.lineTo(12, y);
            this.context.stroke();
        }

        // Draw Ghost Piece (Polish)
        if (this.player.matrix && !this.isGameOver) {
            const ghostPos = { ...this.player.pos };
            while (!this.collide(this.arena, { pos: ghostPos, matrix: this.player.matrix })) {
                ghostPos.y++;
            }
            ghostPos.y--; // Step back one

            this.drawMatrix(this.player.matrix, ghostPos, true);
        }

        // Draw Arena and Player
        this.drawMatrix(this.arena, { x: 0, y: 0 });
        this.drawMatrix(this.player.matrix, this.player.pos);
    }

    drawMatrix(matrix, offset, isGhost = false) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    if (isGhost) {
                        this.context.fillStyle = 'rgba(255, 255, 255, 0.1)';
                        this.context.fillRect(x + offset.x, y + offset.y, 1, 1);
                        this.context.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                        this.context.lineWidth = 0.05;
                        this.context.strokeRect(x + offset.x, y + offset.y, 1, 1);
                    } else {
                        // Enhanced Block Rendering (Polish)
                        // Base color
                        this.context.fillStyle = this.colors[value];
                        this.context.fillRect(x + offset.x, y + offset.y, 1, 1);

                        // Inner highlight (Top-Left)
                        this.context.fillStyle = 'rgba(255, 255, 255, 0.3)';
                        this.context.fillRect(x + offset.x, y + offset.y, 1, 0.1);
                        this.context.fillRect(x + offset.x, y + offset.y, 0.1, 1);

                        // Inner shadow (Bottom-Right)
                        this.context.fillStyle = 'rgba(0, 0, 0, 0.3)';
                        this.context.fillRect(x + offset.x, y + offset.y + 0.9, 1, 0.1);
                        this.context.fillRect(x + offset.x + 0.9, y + offset.y, 0.1, 1);
                    }
                }
            });
        });
    }

    merge(arena, player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    arena[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
    }

    rotate(matrix, dir) {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
            }
        }
        if (dir > 0) matrix.forEach(row => row.reverse());
        else matrix.reverse();
    }

    playerDrop() {
        this.player.pos.y++;
        if (this.collide(this.arena, this.player)) {
            this.player.pos.y--;
            this.merge(this.arena, this.player);
            this.playerReset();
            this.arenaSweep();
            this.updateScore();
            this.emitEvents(); // Send state to peer
        }
        this.dropCounter = 0;
    }

    playerHardDrop() {
        while (!this.collide(this.arena, this.player)) {
            this.player.pos.y++;
        }
        this.player.pos.y--;
        this.merge(this.arena, this.player);
        this.playerReset();
        this.arenaSweep();
        this.updateScore();
        this.emitEvents();
        this.dropCounter = 0;
    }

    playerMove(dir) {
        this.player.pos.x += dir;
        if (this.collide(this.arena, this.player)) {
            this.player.pos.x -= dir;
        }
    }

    playerReset() {
        const pieces = 'ILJOTSZ';
        this.player.matrix = this.createPiece(pieces[pieces.length * Math.random() | 0]);
        this.player.pos.y = 0;
        this.player.pos.x = (this.arena[0].length / 2 | 0) - (this.player.matrix[0].length / 2 | 0);

        if (this.collide(this.arena, this.player)) {
            this.isGameOver = true;
            this.element.querySelector('.overlay').classList.remove('hidden');
            this.element.querySelector('.overlay h2').innerText = 'GAME OVER';
            // Emit game over
        }
    }

    playerRotate(dir) {
        const pos = this.player.pos.x;
        let offset = 1;
        this.rotate(this.player.matrix, dir);
        // Basic Wall Kick (Polish)
        while (this.collide(this.arena, this.player)) {
            this.player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > this.player.matrix[0].length) {
                this.rotate(this.player.matrix, -dir);
                this.player.pos.x = pos;
                return;
            }
        }
    }

    collide(arena, player) {
        const [m, o] = [player.matrix, player.pos];
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    arenaSweep() {
        let rowCount = 1;
        outer: for (let y = this.arena.length - 1; y > 0; --y) {
            for (let x = 0; x < this.arena[y].length; ++x) {
                if (this.arena[y][x] === 0) {
                    continue outer;
                }
            }
            const row = this.arena.splice(y, 1)[0].fill(0);
            this.arena.unshift(row);
            ++y;
            this.player.score += rowCount * 10;
            rowCount *= 2;
        }
    }

    updateScore() {
        this.element.querySelector('.score').innerText = this.player.score;
        this.player.level = Math.floor(this.player.score / 100) + 1;
        this.element.querySelector('.level').innerText = this.player.level;
        // Slower start (Polish)
        this.dropInterval = Math.max(100, 1000 - (this.player.level - 1) * 50);
    }

    update(time = 0) {
        if (this.isPaused || this.isGameOver) return;

        const deltaTime = time - this.lastTime;
        this.lastTime = time;

        this.dropCounter += deltaTime;
        if (this.dropCounter > this.dropInterval) {
            this.playerDrop();
        }

        this.draw();
        requestAnimationFrame(this.update);
    }

    reset() {
        this.arena.forEach(row => row.fill(0));
        this.player.score = 0;
        this.player.level = 1;
        this.updateScore();
        this.isGameOver = false;
        this.isPaused = false;
        this.element.querySelector('.overlay').classList.add('hidden');
        this.playerReset();
        this.update();
    }

    // Networking hooks
    serialize() {
        return {
            arena: this.arena,
            score: this.player.score,
            level: this.player.level,
            isGameOver: this.isGameOver
        };
    }

    deserialize(state) {
        this.arena = state.arena;
        this.player.score = state.score;
        this.player.level = state.level;
        this.isGameOver = state.isGameOver;

        this.updateScore();
        this.draw();

        if (this.isGameOver) {
            this.element.querySelector('.overlay').classList.remove('hidden');
            this.element.querySelector('.overlay h2').innerText = 'OPPONENT LOST';
        } else {
            this.element.querySelector('.overlay').classList.add('hidden');
        }
    }

    emitEvents() {
        if (this.onStateChange) {
            this.onStateChange(this.serialize());
        }
    }
}

class ConnectionManager {
    constructor(tetrisManager) {
        this.conn = null;
        this.peers = new Map();
        this.tetrisManager = tetrisManager;
        this.localTetris = tetrisManager.instances[0];
        this.remoteTetris = tetrisManager.instances[1];
    }

    connect(address) {
        this.conn = this.peer.connect(address);
        this.conn.addEventListener('open', () => {
            console.log('Connection established');
            this.initSession();
        });
    }

    initSession() {
        this.conn.on('data', data => {
            console.log('Received data', data);
            if (data.type === 'state-update') {
                this.remoteTetris.deserialize(data.state);
            }
        });

        // Send local state updates
        this.localTetris.onStateChange = (state) => {
            if (this.conn && this.conn.open) {
                this.conn.send({
                    type: 'state-update',
                    state: state
                });
            }
        };
    }

    createRoom() {
        this.peer = new Peer();
        this.peer.on('open', id => {
            document.getElementById('my-id-display').classList.remove('hidden');
            document.getElementById('my-id-display').querySelector('.code').innerText = id;
            document.getElementById('status').innerText = 'Room Created! Waiting for player...';
        });

        this.peer.on('connection', conn => {
            this.conn = conn;
            document.getElementById('status').innerText = 'Player Connected!';
            this.initSession();
        });
    }

    joinRoom(id) {
        this.peer = new Peer();
        this.peer.on('open', () => {
            this.connect(id);
            document.getElementById('status').innerText = 'Connecting...';
        });
    }
}

class TetrisManager {
    constructor(document) {
        this.document = document;
        this.instances = [];

        // Init Local Player
        const localElement = document.querySelector('.player.local');
        const localTetris = new Tetris(localElement);
        this.instances.push(localTetris);

        // Init Remote Player
        const remoteElement = document.querySelector('.player.remote');
        const remoteTetris = new Tetris(remoteElement);
        // Override update loop for remote (it only draws)
        remoteTetris.update = function () { this.draw(); };
        this.instances.push(remoteTetris);

        // Input Handling
        document.addEventListener('keydown', event => {
            const player = localTetris;
            if (player.isGameOver) return;

            if (event.keyCode === 37) { // Left
                player.playerMove(-1);
            } else if (event.keyCode === 39) { // Right
                player.playerMove(1);
            } else if (event.keyCode === 40) { // Down
                player.playerDrop();
            } else if (event.keyCode === 38) { // Up
                player.playerRotate(1);
            } else if (event.keyCode === 32) { // Space (Hard Drop)
                player.playerHardDrop();
            }
        });

        // Restart Handler
        document.querySelector('.restart-btn').addEventListener('click', () => {
            localTetris.reset();
        });
    }
}

// Initialize
const tetrisManager = new TetrisManager(document);
const connectionManager = new ConnectionManager(tetrisManager);

document.getElementById('create-btn').addEventListener('click', () => {
    connectionManager.createRoom();
});

document.getElementById('join-btn').addEventListener('click', () => {
    const id = document.getElementById('room-id').value;
    if (id) connectionManager.joinRoom(id);
});
