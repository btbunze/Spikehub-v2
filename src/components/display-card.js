import React from 'react'
import {Link} from 'react-router-dom'
import Button from './button'

const DisplayCard = ({imgSrc, altText, heading, content, link, comingSoon}) => {
    return (
        <div className = {`gen-card animated-card ${comingSoon ? "hide-at-midsize" : null}`}>
            <div>
                <img src = {imgSrc} alt = {altText} width = "50%" style = {{paddingBottom:'1rem'}}></img>
                <h3>{heading}</h3>
                <h4>{content}</h4>
            </div>
            <div>
                <Link to = {link}>
                    <Button size = "large" color = "red" label = {comingSoon ? "COMING SOON" : "SEE ALL"} isDisabled = {comingSoon}></Button>
                </Link>
            </div>

        </div>
    )
}

export default DisplayCard