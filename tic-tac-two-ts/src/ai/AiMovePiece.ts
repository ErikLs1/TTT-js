import {gameController} from "../ui/GameController.ts";
import {cloneBoard} from "./AiGameBrain.ts";
import {MovePieceMove} from "./AIMoveTypes.ts";
import {evaluateMove, simulateWinCondition} from "./AiPutPiece.ts";

export function findBestMovePieceForAI(): MovePieceMove | null {
    const currentPlayer = gameController.gameBrain.currentPlayer;
    const gridPosition = gameController.gameBrain.gridPosition;
    const board = gameController.gameBrain.gameBoard;
    const aiPieceCells: Array<{ x: number, y: number}> = [];
    for (let x = gridPosition.left; x < gridPosition.right; x++) {
        for (let y = gridPosition.top; y < gridPosition.bottom; y++) {
            if (board[x][y] === currentPlayer) {
                aiPieceCells.push({ x, y });
            }
        }
    }

    const emptyCells = gameController.gameBrain.emptyCellsCoordinatesInGrid();

    let bestMove: MovePieceMove | null = null;
    let highestScore = -Infinity;

    for (let piece of aiPieceCells) {
        for (let target of emptyCells) {
            const score = simulateMovePiece(piece.x, piece.y, target.x, target.y, currentPlayer);
            if (score > highestScore) {
                highestScore = score;
                bestMove = { type: "movePiece", from: { x: piece.x, y: piece.y }, to: { x: target.x, y: target.y}, score: score};
            }
        }
    }

    return bestMove;
}

/**
 * Simulates moving a piece form chosen position to target position.
 *
 * @param fromX - Row index of chosen position.
 * @param fromY - Column index of chosen position.
 * @param toX - Target row index.
 * @param toY - Target column index.
 * @param player - Tha player symbol.
 * @returns {number} - The evaluated core of the move.
 */
export function simulateMovePiece(fromX: number, fromY: number, toX:number, toY:number, player: 'X' | 'O') : number {
    const boardCopy = cloneBoard();
    if (boardCopy[toX][toY] !== 'Empty') {
        return -Infinity;
    }

    boardCopy[fromX][fromY] = 'Empty';
    boardCopy[toX][toY] = player;
    if (simulateWinCondition(toX, toY, player, boardCopy)) {
        return 1000;
    }

    return evaluateMove(toX, toY, player, boardCopy);
}