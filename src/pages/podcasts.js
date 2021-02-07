import React, {useState, useEffect} from 'react'

import PodcastCard from '../components/podcast-card'

import {firebase} from '../firebase/config'
import {useCollection} from 'react-firebase-hooks/firestore'

const PodcastsPage = () => {

    const db = firebase.firestore()

    const [podcasts, loading, error] = useCollection(db.collection('podcasts'))
    const [sortedPodcasts, setSortedPodcasts] = useState([])


    useEffect(() =>{
        if(podcasts){

            setSortedPodcasts(podcasts.docs.sort((a,b) => {
                const dateA = new Date(a.data().date.seconds*1000)
                const dateB = new Date(b.data().date.seconds*1000)
                if(dateA < dateB){
                    return 1
                }
                else{
                    return -1
                }
            }))
        }
    },[podcasts])
    
    return (
        <div style = {{backgroundColor: 'var(--red)', minHeight:'calc(100vh - 3rem)', width:'100%', display:'inline-block'}}>
            <div className = "content" style = {{textAlign:'center'}}>
                <h2 style = {{marginTop:'4rem'}}>Explore # Podcasts</h2>
                <section>
                    <div className = "grid three-column">
                        {sortedPodcasts.map((podcast)=> (
                            <PodcastCard 
                                heading = {podcast.data().name} 
                                content = {podcast.data().desc} 
                                imgSrc = {podcast.data().img} 
                                altText = {podcast.data().name}
                                link = {podcast.data().links.spotify}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default PodcastsPage