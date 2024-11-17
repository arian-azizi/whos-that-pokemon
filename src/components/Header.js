import React from "react"

const Header = () => (
    <header className="logo">
        <img src={`${process.env.PUBLIC_URL}/assets/logo.png`} alt="Who's That Pokemon?" style={{"width": "300px"}}/>
        <audio src={`${process.env.PUBLIC_URL}/assets/game-start.mp3`} id="start-audio"></audio>
    </header>
)

export default Header