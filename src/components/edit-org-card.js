import React from 'react'
import {Link} from 'react-router-dom'

const OrgCard = ({orgName, img, id}) => {

    console.log(orgName)

    return (
        <Link className = "link upcoming-card" to = {`/account-dashboard/organizations/edit?id=${id}`}>
                <div style = {{backgroundColor:'var(--light-gray)'}}> 
                    <img src = {img || "https://res.cloudinary.com/dicfhqxoo/image/upload/v1612321575/tournament-icon_ydpdbe.png"} style = {{width:'100%', height:'100%', objectFit: 'cover'}}></img>
                </div>
                <div style = {{padding:'.5rem'}}>
                    <h4 className = "upcoming-card--header">{orgName}</h4>
                </div>
        </Link>
    )
}

export default OrgCard