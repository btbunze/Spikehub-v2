import React from 'react'

const NewsPage = () => (
    <div className = "content news-content">
        <p style = {{textAlign:'center', }} className = "blog-date"> <span style = {{color:'var(--red)', fontWeight:'bold'}}>3/19/2021</span> | <span style = {{color:'var(--dark-gray)', fontWeight:'400'}}>Benjamin Bunze</span></p>
        <h2 className = "blog-header">
            SpikeHub 2.0 Released (and more coming soon)!
        </h2>
        <p className = "blog-content">It's finally here! This new version of Spikehub has been under construction for months, and I'm incredibly excited to present it to you. The original Spikehub came out at the end of last summer, and it was solely a partner-finder (or in other words, a glorified free-agent list). I was very happy with the outcome and people seemed to appreciate it, but I felt it could be so much more. In a time when roundnet is becoming more and more popular, people are looking for a way to find information about tournaments and other roundnet content without having to search every corner of the SRA facebook group and different RRO websites. Spikehub 2.0 is the solution to that problem. </p>
        <h3 className = "blog-subheader">Upcoming Tournaments</h3>
        <p className = "blog-content">The primary benefit of Spikehub is that it presents one central place to see what tournaments are coming up. Tournament directors and RROs can get more eyes on their tournaments, and thus get more signups. Players can find out what's coming up and get information on tournaments, including date, location, prizes, and even free agents! Hopefully, this duality of benefit will make Spikehub the go-to for promoting upcoming tournaments. After all, the more people that use it, the more useful it becomes!</p>
        <h3 className = "blog-subheader">Past Tournaments</h3>
        <p className = "blog-content">If you're reading this immediately after launch, you might notice that there aren't any tournaments in the "Past Tournaments" section. This is the location where, after a tournament ends, anyone who is interested can find results in the form of links to bracket pics and a list of the top 3 teams in each division. In the past, results have faded into the wind after tournaments, and if you wanted information about a tournament that happened a while ago, you would have to search high and low, but with Spikehub, everything will be in one place.</p>
        <h3 className = "blog-subheader">Tournaments "Happening Now"</h3>
        <p className = "blog-content">This is one of my favorite parts of the site. On the homepage, there is a "Happening Now" section where, on tournament day, TDs can upload bracket links and livestream links. This way, anyone who wants to follow along with events from home (or anywhere) can check out every tournament that's happening, all in one location.</p>
        <h3 className = "blog-subheader">Coming Soon: Content</h3>
        <p className = "blog-content">Spikehub can't truly be a "hub" without having a place where creators can display their creations. The "Content" section of the site is already mostly complete, and when it's done, it will showcase podcasts, videos, blogs, and more in a way that is easy to digest and fun to explore. Keep an eye out for this in the near future :)</p>
        <p className = "blog-content">If you've made it this far, thank you for checking it out. I'm incredibly excited to be releasing this, and I hope that you enjoy using it as much as I enjoyed making it. Hopefully I'll see you at the next tournament!</p>
        <p className = "blog-content">-Ben Bunze</p>
    </div>
)

export default NewsPage