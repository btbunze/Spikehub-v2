import React from 'react'
import DisplayCard from '../components/display-card'
import BlogCard from '../components/blog-card'

import upcomingIcon from '../assets/upcoming.svg'
import pastIcon from '../assets/past.svg'
import contentIcon from '../assets/content.svg'

const HomePage = () => {
    return (
        <div style = {{backgroundColor: 'var(--red)', minHeight:'calc(100vh - 3rem)', width:'100%', display:'inline-block'}}>
            <div class = "content">
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
                            content = "See results and highlight videos from past tournaments"
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
                {/*check if tournaments are happening now*/ false ? 
                    (<div className = 'grid three-column'>
                        <DisplayCard/>
                        <DisplayCard/>
                        <DisplayCard/>
                    </div>)
                    :
                    <div className = "no-tournaments">
                        <h4 style = {{margin:'auto'}}>Come back on <b>1/16/2020</b> for the next event(s)</h4>
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