import React, {useEffect, useState} from 'react'
import {Link, useRouteMatch} from 'react-router-dom'


const Header = ({mainPath}) => {

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
            </nav>
        </header>
    )
}


export default Header