import React from "react"

const Clues = ({ clues, restartGame }) => (
    <section className="clues">
        <p id="instructions">Type my name and press GUESS!</p>
        {clues}
        <input type="button" id="restart-btn" value="Play Again" onClick={ restartGame } hidden/>
    </section>
)

export default Clues