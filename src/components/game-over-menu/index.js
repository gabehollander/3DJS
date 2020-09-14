import React from 'react';

const gameOverStyle = {
    backgroundColor: 'white',
    height: '200px',
    width: '200px',
    position: 'fixed',
    top: '50%',
    left: '50%',
    /* bring your own prefixes */
    transform: 'translate(-50%, -50%)'
  }

const GameOverMenu = (props) => {
    return (
        props.gameOver ?
        <div style={gameOverStyle}>
            <p>game over!</p>
            <button onClick={props.restart}>restart</button>
        </div>
        :
        null
    )
}
export default GameOverMenu;
