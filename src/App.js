import React, { useState } from 'react';
import Header from './components/Header'
import Guess from './components/Guess'
import Clues from './components/Clues'
import Reveal from './components/Reveal'
import './App.css';

function App() {

  const [pokemon, setPokemon] = useState('')
  const [species, setSpecies] = useState('')
  const [guessInput, setGuessInput] = useState('')
  const [guessNum, setGuessNum] = useState(4)
  const [clues, setClues] = useState([])
  const [revealPokemon, setRevealPokemon] = useState(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)
  const [selectedGens, setSelectedGens] = useState({gen1: true, gen2: true, gen3: true})

  const startGame = () => {
    if (!selectedGens.gen1 && !selectedGens.gen2 && !selectedGens.gen3) {
      alert('Please select at least one Pokemon generation to play!')
      return
    }
    setGameStarted(true)
    fetchPokemon()
  }

  const fetchPokemon = () => {
    const startAudio = new Audio(`${process.env.PUBLIC_URL}/assets/game-start.mp3`)
    startAudio.play()

    const genRanges =[]
    if (selectedGens.gen1) genRanges.push([1, 151])
    if (selectedGens.gen2) genRanges.push([152, 251])
    if (selectedGens.gen3) genRanges.push([252, 386])

    const selectedRange = genRanges[Math.floor(Math.random() * genRanges.length)]
    const pokemonId = Math.floor(Math.random() * (selectedRange[1] - selectedRange[0] + 1) + selectedRange[0])

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    .then(response => response.json())
    .then(json => setPokemon(json))
    .catch(error => console.log(error))

    fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
    .then(response => response.json())
    .then(json => setSpecies(json))
    .catch(error => console.log(error))
  }

  const handleGenChange = (event) => {
    const { name, checked } = event.target
    setSelectedGens(prevState => ({
      ...prevState,
      [name]: checked
    }))
  }

  const guessPokemon = () => {
    if (guessInput.toUpperCase() === pokemon.name.toUpperCase()) {
      const winAudio = new Audio(`${process.env.PUBLIC_URL}/assets/game-win.mp3`)
      const win = (
        <>
          <p>You caught a {pokemon.name.toUpperCase()}!</p>
          <img src={pokemon['sprites']['other']['official-artwork']['front_default']} id="img-win" alt={pokemon.name} />
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
      const color = species.color.name
      newClues.push(<p key={guessNum}>I am {color}!</p>)
    } else if (guessNum === 2) {
      const genus = species.genera[7].genus
      newClues.push(<p key={guessNum}>I am regarded as a {genus}!</p>)
    } else if (guessNum === 1) {
      const firstLetter = pokemon.name[0].toUpperCase()
      newClues.push(<p key={guessNum}>My name starts with {firstLetter}!</p>)
    } else if (guessNum === 0) {
      const loseAudio = new Audio(`${process.env.PUBLIC_URL}/assets/game-lose.mp3`)
      const lose = (
        <>
          <p>The wild {pokemon.name.toUpperCase()} ran away...</p>
          <img src={`${process.env.PUBLIC_URL}/assets/pokeball.png`} id="img-lose" alt="Pokeball" width="315" height="315" />
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
        <div>
          <div className="gen-select">
              <input type="checkbox" id="gen1" name="gen1" checked={selectedGens.gen1} onChange={handleGenChange}/>
              <label htmlFor="gen1">Gen 1</label>
              <input type="checkbox" id="gen2" name="gen2" checked={selectedGens.gen2} onChange={handleGenChange}/>
              <label htmlFor="gen2">Gen 2</label>
              <input type="checkbox" id="gen3" name="gen3" checked={selectedGens.gen3} onChange={handleGenChange}/>
              <label htmlFor="gen3">Gen 3</label>
          </div>     
          <section>
            <input type="button" onClick={startGame} value="Start Game"/>        
          </section>
        </div>
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
