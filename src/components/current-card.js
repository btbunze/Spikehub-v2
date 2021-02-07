import React from 'react';
import Button from './button'

const CurrentCard = ({imgSrc, altText, heading, link}) => {
    return(
        <div className = "gen-card current-card">
        <div>
            <img src = {imgSrc} alt = {altText} width = "50%" style = {{paddingBottom:'1rem'}}></img>
            <h3 style = {{marginBottom:'3rem', marginTop:'1.5rem'}}>{heading}</h3>
        </div>
        <div style = {{display:'flex', justifyContent: 'space-around'}}>
            <Button size = "large" color = "dark-gray" label = "See Bracket" styles = {{fontSize:'1rem', padding:'.75rem 1.25rem'}}></Button>
            <Button size = "large" color = "red" label = "Livestream" styles = {{fontSize: '1rem', padding: '.75rem 1.25rem'}} ></Button>
        </div>

    </div>
    )
}

export default CurrentCard;