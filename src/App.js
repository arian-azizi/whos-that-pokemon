import React, { useState, useEffect } from 'react';
import Header from './components/Header'
import Guess from './components/Guess'
import Clues from './components/Clues'
import Reveal from './components/Reveal'
import './App.css';

function App() {

  const [pokemon, setPokemon] = useState('')
  const [guessInput, setGuessInput] = useState('')
  const [guessNum, setGuessNum] = useState(4)
  const [clues, setClues] = useState([])
  const [revealPokemon, setRevealPokemon] = useState(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)

  const startGame = () => {
    setGameStarted(true)
    fetchPokemon()
  }

  const fetchPokemon = () => {
    const startAudio = new Audio('../assets/game-start.mp3')
    startAudio.play()

    const maxPokemonIndex = 386
    const minPokemonIndex = 1
    const pokemonId = Math.floor(Math.random() * (maxPokemonIndex - minPokemonIndex + 1) + minPokemonIndex)

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    .then(response => response.json())
    .then(json => setPokemon(json))
    .catch(error => console.log(error))
  }

  const guessPokemon = () => {
    if (guessInput.toUpperCase() === pokemon.name.toUpperCase()) {
      const winAudio = new Audio('./assets/game-win.mp3')
      const win = (
        <>
          <p>You caught a {pokemon.name.toUpperCase()}!</p>
          <img src={pokemon.sprites.other['offical-artwork'].front_default} id="img-win" alt={pokemon.name} />
        </>
      )
      setRevealPokemon(win)
      winAudio.play()
      setGameEnded(true)
    } else {
      giveClue()
    }
  }

  const giveClue = () => {
    let newClues = [...clues]
    if (guessNum === 4) {
      const type = pokemon.types.map(t => t.type.name).join(' and ')
      newClues.push(<p key={guessNum}>I am a {type} type Pokemon!</p>)
    } else if (guessNum === 3) {
      const gen = pokemon.id <= 151 ? 1 : pokemon.id <= 251 ? 2 : 3
      newClues.push(<p key={guessNum}>I am from Generation {gen}!</p>)
    } else if (guessNum === 2) {
      newClues.push(<p key={guessNum}>My ID in the National Pokedex is #{pokemon.id}!</p>)
    } else if (guessNum === 1) {
      newClues.push(<p key={guessNum}>My name starts with {pokemon.name[0].toUpperCase()}!</p>)
    } else if (guessNum === 0) {
      const loseAudio = new Audio('../assets/game-lose.mp3')
      const lose = (
        <>
          <p>The wild {pokemon.name.toUpperCase()} ran away...</p>
          <img src="../assets/pokeball.png" id="img-lose" alt="Pokeball" width="315" height="315" />
        </>
      )
      setRevealPokemon(lose)
      loseAudio.play()
      setGameEnded(true)
    }
    setClues(newClues)
    setGuessNum(guessNum - 1)
  }

  const restartGame = () => {
    window.location.reload()
  }

  return (
    <div className="App">
      <Header />
      {!gameStarted ? (
        <section>
        <input type="button" onClick={startGame} value="Start Game"></input>        
        </section>
      ) : (
      <main className='game-container'>
        <Reveal revealPokemon={revealPokemon} />
        {!gameEnded && (
          <Guess guessInput={guessInput} setGuessInput={setGuessInput} guessPokemon={guessPokemon}/>
        )}
        <Clues clues={clues} restartGame={restartGame}/>
        {gameEnded && (
          <section>
            <input type="button" onClick={restartGame} id="restart-btn" value="Play Again"></input>
          </section>
        )}
      </main>
      )}
    </div>
  );
}

export default App;
