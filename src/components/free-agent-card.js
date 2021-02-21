import React from 'react';

import Button from './button'

const FreeAgentCard = ({data, user, deleteSelf}) => {

    const {name, img, division, description, email, phone, rpr, creatorId} = data

    return(
        <div className = "free-agent-card">
            <img src = {img || "https://res.cloudinary.com/dicfhqxoo/image/upload/v1611984880/profilepicperson_hdwfcw.png"} style = {{width: '4rem', height: '4rem', borderRadius: "50%"}}></img>
            <div style = {{padding:'0 1rem'}}>
                <h3 style = {{fontSize: '1rem', lineHeight: '1.25rem', color:'#333'}}>{name} ({rpr})</h3>
                <p style = {{fontSize: '.8rem', margin:"0px", color: 'var(--red)', fontWeight: '500'}}>{division}</p>
                <p style = {{margin:".15rem 0", fontSize:'.5rem'}}>{email}</p>
                <p style = {{margin:".15rem 0", fontSize:'.5rem'}}>{phone}</p>
            </div>
            {user && user.uid == creatorId && <Button size = "small" color = "red" label = "X" styles = {{height:'fit-content', margin:'auto'}} onClick = {deleteSelf}></Button>}

        </div>
    )
}

export default FreeAgentCard;