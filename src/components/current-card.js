import React from 'react';
import Button from './button'

const CurrentCard = ({imgSrc, altText, heading, bracketLink, liveLink}) => {
    return(
        <div className = "gen-card current-card">
        <div>
            <img src = {imgSrc || "https://res.cloudinary.com/dicfhqxoo/image/upload/v1612321575/tournament-icon_ydpdbe.png"} alt = {altText} width = "50%" style = {{paddingBottom:'1rem'}}></img>
            <h3 style = {{marginBottom:'2rem', marginTop:'1rem'}}>{heading}</h3>
        </div>
        <div style = {{display:'flex', justifyContent: 'space-around'}}>
            <a href = {bracketLink || null} target = "_blank" className = "link"><Button size = "large" color = "dark-gray" label = "See Bracket" styles = {{fontSize:'1rem', padding:'.75rem 1.25rem'}} isDisabled = {!bracketLink}></Button></a>
            <a href = {liveLink || null} target = "_blank" className = "link"><Button size = "large" color = "red" label = "Livestream" styles = {{fontSize: '1rem', padding: '.75rem 1.25rem'}} isDisabled = {!liveLink} ></Button> </a>
        </div>

    </div>
    )
}

export default CurrentCard;