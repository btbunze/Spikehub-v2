import React from 'react'

const UpcomingCard = ({tournamentName, date, img}) => {
    return (
        <div className = "upcoming-card">
            <div style = {{backgroundColor:'var(--light-gray)', width:'100%'}}> 
                <img src = {img} style = {{width:'100%', height:'100%', objectFit: 'cover', margin:'auto'}}></img>
            </div>
            <div style = {{padding:'.5rem'}}>
                <h5>{date}</h5>
                <h4 className = "upcoming-card--header">{tournamentName}</h4>
            </div>
        </div>
    )
}

export default UpcomingCard