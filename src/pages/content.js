import React from 'react';
import {Link} from 'react-router-dom'

import {firebase} from '../firebase/config'
import {useCollection} from 'react-firebase-hooks/firestore'

import Button from '../components/button'

const ContentPage = () => {

    const [allVideos, videosLoading, videosError] = useCollection()

    return(
        <div style = {{backgroundColor: 'var(--red)', minHeight:'calc(100vh - 3rem)', width:'100%', display:'inline-block'}}>
            <div class = "content">
                <p className = "small-heading">COMMUNITY CONTENT</p>
                <h2>
                    Everything Roundnet <br/> for your eyes and ears.
                </h2>
            </div>
            <section>
                <h2 className = "section-header">Recent Videos</h2>
                <h4 className = "section-subheader">See everything you've missed</h4>
                <div className = "grid two-column" style = {{padding:'1rem 0'}}>
                    <iframe style = {{margin:'auto'}} width="525" height="295" src="https://www.youtube.com/embed/KAPPdgNZenc" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    <iframe style = {{margin:'auto'}} width="525" height="295" src="https://www.youtube.com/embed/KAPPdgNZenc" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
                <Link to = "/videos" className = "link">
                    <Button size = "large" color = "red" label = "More Videos" styles = {{margin:'1rem'}}></Button>
                </Link>
            </section>
            <section>
                <h2 className = "section-header">Recent Podcasts</h2>
                <h4 className = "section-subheader">Catch up on your favorite roundnet podcasts</h4>
                <Link to = "/podcasts" className = "link">
                    <div className = "grid three-column" style = {{padding:'1rem 0'}}>
                        <iframe style ={{margin:'auto'}} src="https://open.spotify.com/embed-podcast/show/0A1vQ9W7EsrwjM0YmZB2tA" width="90%" height="232" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                        <iframe style ={{margin:'auto'}} src="https://open.spotify.com/embed-podcast/show/0A1vQ9W7EsrwjM0YmZB2tA" width="90%" height="232" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                        <iframe style ={{margin:'auto'}} src="https://open.spotify.com/embed-podcast/show/0A1vQ9W7EsrwjM0YmZB2tA" width="90%" height="232" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                    </div>
                    <Button size = "large" color = "red" label = "More Podcasts" styles = {{margin:'1rem'}} ></Button>
                </Link>
            </section>
        </div>
    )
}

export default ContentPage;