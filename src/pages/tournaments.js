import React, {useState, useEffect} from 'react'
import {BrowserRouter as Router, Route, Switch, Link, useRouteMatch} from 'react-router-dom'
import SearchBar from '../components/search-bar'
import Button from '../components/button'
import UpcomingCard from '../components/upcoming-card'

import tourneyIcon from '../assets/ex-tourney-icon.png'

const TournamentsPage = () => {

    const [currentTab, setCurrentTab] = useState(window.location.pathname.split("/")[2])
    const [tournaments, setTournaments] = useState(null)
    const [keyword, setKeyword] = useState("")

    useEffect(() => {console.log(keyword)}, [keyword])

    return (
        <div style = {{backgroundColor: 'var(--red)', minHeight:'calc(100vh - 3rem)', width:'100%', display:'inline-block'}}>
            <section className = "connected-header">
                <div style = {{display:'flex', justifyContent: 'space-between', height:'100%', padding:'0 1rem'}}>
                    <div style = {{margin:'auto 0'}}>
                        <Link to = {"/tournaments/upcoming"} className = "link" onClick = {()=> setCurrentTab("upcoming")}>
                            <h3 className = {`tournaments-heading ${currentTab == "upcoming" ? "selected" : ""}`}>Upcoming Events</h3>
                        </Link>
                        <Link to = {"/tournaments/past"} className = "link" onClick = {()=> setCurrentTab("past")}>
                            <h3 className = {`tournaments-heading ${currentTab == "past" ? "selected" : ""}`}>Past Events</h3>
                        </Link>
                    </div>
                    <SearchBar keyword = {keyword} setKeyword = {setKeyword} placeholder = {currentTab.charAt(0).toUpperCase() + currentTab.slice(1) + " Events"}/>
                </div>
            </section>

                <Route path = "/tournaments/upcoming" >
                <section>
                    <div className = "grid four-column" style = {{margin: '1rem 0'}}>
                            <UpcomingCard
                                img = {tourneyIcon}
                                tournamentName = "The 2021 Winter Slam Spectacular"
                                date = "January 2, 2021"
                            />
                            <UpcomingCard/>
                            <UpcomingCard/>
                            <UpcomingCard/>
                    </div>
                </section>
                </Route>
                <Route path = "/tournaments/past">
                    <section style = {{padding:0}}>
                        <table className = "past-table">
                            <tr>
                                <th>Event Name</th>
                                <th>Location</th>
                                <th>Date</th>
                                <th># Teams</th>
                                <th></th>
                            </tr>
                            <tr>
                                <td>Event</td>
                                <td>Loc</td>
                                <td>Date</td>
                                <td>#</td>
                                <td><Button
                                    size = "medium"
                                    color = 'red'
                                    label = 'See More'
                                /></td>
                            </tr>
                        </table>
                    </section>
                </Route>

        </div>

    )
}

export default TournamentsPage