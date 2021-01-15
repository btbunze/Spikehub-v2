import React from 'react'

const Button = ({size, color, label, onClick}) => {
    
    return (
        <button className = {`${size} ${color}`} onClick = {onClick}>
            {label}
        </button>
    )
}



export default Button