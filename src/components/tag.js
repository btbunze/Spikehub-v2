import React, {useState} from 'react';

const Tag = ({label, count, isSelected = false, select, deselect}) => {


    const [selected, setSelected] = useState(null)
    console.log(label)
    console.log(isSelected)

    const toggleSelected = () => {
        if((selected != null && selected ) || isSelected){
            deselect()
        }
        else{
            select()
        }
       
        selected != null ? setSelected(!selected) : setSelected(!isSelected)

    }

    return(
        <div className = {`tag ${selected ? "selected" : (isSelected ? "selected" : "")}`} onClick = {toggleSelected}>
            <p className = "tag-text">{label}</p>
            <div className = "tag-count-div">
                <p className = "tag-num">{count}</p>
            </div>
        </div>
    )
}

export default Tag;