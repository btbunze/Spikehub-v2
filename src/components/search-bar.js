import React, {useEffect} from 'react'

const SearchBar = ({keyword, setKeyword, placeholder}) => {


    return (
        <input className = "search" value = {keyword} onChange = {(e) => setKeyword(e.target.value)} placeholder = {`Search ${placeholder}`}>
        </input> 
    )
}

export default SearchBar;