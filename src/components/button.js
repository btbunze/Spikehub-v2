import React from 'react'

const Button = ({size, color, label, onClick, styles, isDisabled = false}) => {
    
    return (
        <button className = {`${size} ${color} ${isDisabled ? "disabled" : ""}`} onClick = {onClick} style = {styles} {...isDisabled && {disabled:true}}>
            <span>{label}</span>
        </button>
    )
}



export default Button