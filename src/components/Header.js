import React from "react"

const Header = () => (
    <header className="logo">
        <img src="../../assets/logo.png" alt="Who's That Pokemon?" style={{"width": "300px"}}/>
        <audio src="../../assets/game-start.mp3" id="start-audio"></audio>
    </header>
)

export default Header