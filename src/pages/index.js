import React from 'react'
import DisplayCard from '../components/display-card'
import BlogCard from '../components/blog-card'
import CurrentCard from '../components/current-card'

import upcomingIcon from '../assets/upcoming.svg'
import pastIcon from '../assets/past.svg'
import contentIcon from '../assets/content.svg'

import {firebase} from '../firebase/config'
import {useCollection} from 'react-firebase-hooks/firestore'

import formatDate from '../utilities/formatDate'

const HomePage = () => {

    const db = firebase.firestore()

    const [tournaments, loadingTournaments, tournamentsError] = useCollection(db.collection('tournaments')) 
    const [blogPosts, loadingPosts, postsError] = useCollection(db.collection('tournaments'))


    //TODO: Make more flexible to compare any two dates
    const isSameDay = (date) => {

        const tourneyDate = new Date(date.seconds*1000);

        const today = new Date()
        today.setHours(0,0,0,0)

        return tourneyDate.getTime() == today.getTime();
    }

    const getSoonestTournaments = (tArray) => {
        const sortedUpcoming = tArray.filter((tournament)=>{
                return new Date(tournament.data().date.seconds*1000) > new Date()
            }).sort((a,b) => {
            const dateA = new Date(a.data().date.seconds*1000)
            const dateB = new Date(b.data().date.seconds*1000)
            if(dateA > dateB){
                return 1
            }
            else{
                return -1
            }
        })

        const soonestDate = new Date(sortedUpcoming[0].data().date.seconds*1000);
        
        return sortedUpcoming.filter((tournament) => {
            return new Date(tournament.data().date.seconds*1000).getTime() == soonestDate.getTime();
        })

    }

    return (
        <div style = {{backgroundColor: 'var(--red)', minHeight:'calc(100vh - 3rem)', width:'100%', display:'inline-block'}}>
            <div className = "content">
                <p className = "small-heading">WELCOME TO SPIKEHUB</p>
                <h2>
                    The one-stop shop <br/> for all things roundnet.
                </h2>
            </div>
            <section style = {{height: '16rem', marginTop: '19.5rem'}}>
                <div className = 'grid three-column' style = {{position:'relative', bottom:'16rem'}}>
                        <DisplayCard 
                            imgSrc = {upcomingIcon}
                            heading = "Upcoming Events" 
                            content = "Find a partner and sign up for a tournament"
                            link = "/tournaments/upcoming"
                        />
                        <DisplayCard
                            imgSrc = {pastIcon}
                            heading = "Past Events"
                            content = "See results and info from past tournaments"
                            link = "/tournaments/past"
                        />
                        <DisplayCard
                            imgSrc = {contentIcon}
                            heading = "Community Content"
                            content = "Find the best podcasts, highlight videos, and tutorials"
                            link = "/content"
                        />
                </div>
            </section>
            <section>
                <h2 className = "section-header">Happening Now</h2>
                <h4 className = "section-subheader">Stay up-to-date and follow along with <br/> tournaments across the world</h4>
                {tournaments && tournaments.docs.filter((tournament) => isSameDay(tournament.data().date)).length > 0 ? 
                    (<div className = "grid three-column">
                        {tournaments.docs.filter((tournament) => isSameDay(tournament.data().date)).map((tournament) =>
                        (
                            <CurrentCard
                                imgSrc = {tournament.data().img}
                                heading = {tournament.data().name}

                            />
                        ))
                        }
                    </div>)
                    :
                    <div className = "no-tournaments">

                    <h4 style = {{margin:'0 auto'}}>Come back on <b>{tournaments && formatDate(new Date(getSoonestTournaments(tournaments.docs)[0].data().date.seconds*1000))}</b> for the next event{tournaments && getSoonestTournaments(tournaments.docs).length > 1 ? "s" : null}</h4>
                        <div style = {{marginTop:'2rem', display:'flex', alignItems:'center', justifyContent:'center'}}>
                            {tournaments && getSoonestTournaments(tournaments.docs).map((tournament)=> 
                                <img src = {tournament.data().img} style = {{width:'10rem', margin:'0 1rem'}}></img>
                            )}
                        </div>

                    </div>
                } 
            </section>
            <section>
                <h2 className = "section-header">Spikehub News</h2>
                <h4 className = "section-subheader">Check out the latest features and see <br/> what’s coming soon to SpikeHub</h4>
                <div className = 'grid two-column' style = {{margin:'2rem 0'}}>
                    <BlogCard
                        heading = "Spikehub 2.0 Released!"
                        date = "1/19/2021"
                        content = "Little blurb about the blog or whatever post this is. If it is too long for like a couple of lines, like it will be once I type the rest of this, I’ll just cut it off with an ellipse like this..."
                        link = "https://thespikehub.com"
                    />
                    <BlogCard
                        heading = "Spikehub 2.0 Released!"
                        date = "1/19/2021"
                        content = "Little blurb about the blog or whatever post this is. If it is too long for like a couple of lines, like it will be once I type the rest of this, I’ll just cut it off with an ellipse like this..."
                        link = "https://thespikehub.com"
                    />
                </div>
            </section>

        </div>
    )
}

export default HomePage