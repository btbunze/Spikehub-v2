import React from 'react'
import Button from './button'
import {Link} from 'react-router-dom'

const DisplayCard = ({imgSrc, altText, heading, content, link}) => {
    return (
        <div className = "gen-card podcast-card">
            <div>
                <img src = {imgSrc} alt = {altText} width = "50%" style = {{marginBottom:'1rem', borderRadius: '1.5rem'}}></img>
                <h3>{heading}</h3>
                <h4 style = {{marginTop:'.5rem', marginBottom: '2rem', fontSize: '1.25rem'}}>{content}</h4>
            </div>
            <div>
                <Link to = {link}>
                    <Button size = "large" color = "red" label = "Listen Now"></Button>
                </Link>

            </div>

        </div>
    )
}

export default DisplayCard