import React, {useEffect, useState} from 'react'
import {Link, useRouteMatch} from 'react-router-dom'

import {firebase} from '../firebase/config'

const Header = ({mainPath, user}) => {

    const db = firebase.firestore()

    const [img, setImg] = useState(null)

    useEffect(()=>{
        if(user){
            db.collection('users').doc(user.uid).get().then((doc) => {
                setImg(doc.data().img)
            })

        }
    },[user])

    return (
        <header>
            <Link to = "/" className = "link">
                <h1>
                    SPIKEHUB
                </h1>
            </Link>

            <nav>
                <Link to = "/tournaments/upcoming" className = "link">
                    <div className = {mainPath === "tournaments" ? "nav-item active" : "nav-item"}>
                        Tournaments
                    </div>
                </Link>

                <Link to = "/content" className = "link">
                    <div className = {mainPath === "content" ? "nav-item active" : "nav-item"}>
                        Content
                    </div>
                </Link>
                {user ?
                <Link to = '/account-dashboard/profile'className = 'link'>
                    <div className = "nav-item" style = {{height:'1.5rem', padding:'.75rem 1rem'}}>
                        <img style = {{height:'1.5rem', width:'1.5rem', borderRadius:'50%', backgroundColor:'var(--light-gray)'}} src = {img  ? img : "https://res.cloudinary.com/dicfhqxoo/image/upload/v1611984880/profilepicperson_hdwfcw.png"}></img>
                    </div>
                </Link>
                :
                (<Link to = "/sign-in" className = "link">
                    <div className = "nav-item">Sign In</div>
                </Link>)

                }
            </nav>
        </header>
    )
}


export default Header