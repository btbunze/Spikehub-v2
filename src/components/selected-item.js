import React, {useState} from 'react';

const SelectedItem = ({label, remove}) => {

    return(
        <div className = "selected-item">
            <p className = "selected-item-text">{label}</p>
            <button className = "selected-item-remove"  onClick = {() => remove(label)}>X
            </button>
        </div>
    )
}

export default SelectedItem;