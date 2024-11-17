import React from "react"

const Guess = ({ guessInput, setGuessInput, guessPokemon }) => (
    <section className="guess">
        <form onSubmit={(e) => {e.preventDefault(); guessPokemon();}}>
            <input type="text" id="guess-input" placeholder="It's..." value={guessInput} onChange={(e) => setGuessInput(e.target.value)}/>
            <input type="submit" id="guess-btn" value="GUESS"/>
        </form>
    </section>
)

export default Guess