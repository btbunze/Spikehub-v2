import React from 'react'
import {Link} from 'react-router-dom'

const UpcomingCard = ({tournamentName, date, img, slug, id}) => {
    return (
        <Link className = "link upcoming-card" to = {`/tournament?id=${slug + id}`}>
                <div style = {{backgroundColor:'var(--light-gray)'}}> 
                    <img src = {img || "https://res.cloudinary.com/dicfhqxoo/image/upload/v1612321575/tournament-icon_ydpdbe.png"} style = {{width:'100%', height:'100%', objectFit: 'cover'}}></img>
                </div>
                <div style = {{padding:'.5rem'}}>
                    <h5>{date}</h5>
                    <h4 className = "upcoming-card--header">{tournamentName}</h4>
                </div>
        </Link>
    )
}

export default UpcomingCard