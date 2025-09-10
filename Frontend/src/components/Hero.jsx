import React from "react";
import royalImg from "../../assets/royal.jpeg";

import "../styles/Hero.css";

function Hero() {
    return (
        <div id="hero-container">
            <img src={royalImg} alt="hero image" />
        </div>
    )
};

export default Hero;