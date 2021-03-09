import React, {useState, useEffect} from 'react'
import {BrowserRouter as Router, Route, Switch, Link, useRouteMatch} from 'react-router-dom'
import {firebase} from '../firebase/config'
import {useCollection} from 'react-firebase-hooks/firestore'

import SearchBar from '../components/search-bar'
import Button from '../components/button'
import UpcomingCard from '../components/upcoming-card'

import tourneyIcon from '../assets/ex-tourney-icon.png'

import formatDate from '../utilities/formatDate'
import useWindowSize from '../utilities/useWindowSize'

const TournamentsPage = () => {

    const db = firebase.firestore()

    const [currentTab, setCurrentTab] = useState(window.location.pathname.split("/")[2])
    const [tournaments, loadingTournaments , error] = useCollection(db.collection('tournaments'))
    const [upcoming, setUpcoming]= useState([])
    const [past, setPast] = useState([])
    const [keyword, setKeyword] = useState("")
    const [searchBy, setSearchBy] = useState("Name")

    const windowSize = useWindowSize()


    //whenever tournaments or search keyword changes, reset upcoming and past
    useEffect(() => {
        if(tournaments){
            let queriedTournaments = tournaments.docs.sort((a,b) => {
                const dateA = a.data().date.seconds
                const dateB = b.data().date.seconds
                if(dateA > dateB){
                    return 1
                }
                else{
                    return -1
                }
            }).filter((tournament) => {
                switch (searchBy){
                    case "Name":
                        return tournament.data().name.toLowerCase().includes(keyword.toLowerCase())
                    case "Location":
                        return tournament.data().location.toLowerCase().includes(keyword.toLowerCase())
                    // case "Host":
                    //     return db.collection("users").doc(tournament.data().host.id).get().then((doc) => {
                    //             if(doc.exists){
                    //                 console.log(doc.data().fName)
                    //                 const name = doc.data().fName + " " + doc.data().lName
                    //                 return name.includes(keyword) 
                    //             }
                    //         }
                    //     )

                }


            } )

            const today = new Date()
            const yesterday = new Date()
            yesterday.setDate(today.getDate() - 1)

            setUpcoming(queriedTournaments.filter((tournament) => {
                return new Date(tournament.data().date.seconds*1000) > today
            }))

            setPast(queriedTournaments.filter((tournament) => {
                return new Date(tournament.data().date.seconds*1000) < yesterday
            }))

        }
    },[tournaments,keyword,searchBy])

    //whenever the keyword or either list changes, filter the respective list
    // useEffect(() => {
    //     if(currentTab == "upcoming" && tournaments){
    //         console.log(tournaments)
    //         setUpcoming(tournaments.docs.filter((tournament)=> tournament.data().name.includes(keyword))
    //     }
    // },[keyword])


    return (
        <div style = {{backgroundColor: 'var(--red)', minHeight:'calc(100vh - 3rem)', width:'100%', display:'inline-block'}}>
            <section className = "connected-header">
                <div className = "connected-header-content">
                    <div className = "tournaments-heading-container">
                        <Link to = {"/tournaments/upcoming"} className = "link" onClick = {() => setCurrentTab("upcoming")}>
                            <h3 className = {`tournaments-heading ${currentTab == "upcoming" ? "selected" : ""}`}>Upcoming Events</h3>
                        </Link>
                        <Link to = {"/tournaments/past"} className = "link" onClick = {() => setCurrentTab("past")}>
                            <h3 className = {`tournaments-heading ${currentTab == "past" ? "selected" : ""}`}>Past Events</h3>
                        </Link>
                    </div>
                    <div className = "search-container">
                        <select className = "search-toggle" onChange = {(e) => {setSearchBy(e.target.value)}}>
                            <option value = "Name">Name</option>
                            {/*<option value = "Host">Host</option>*/}
                            <option value = "Location">Location</option>
                        </select>
                        <SearchBar keyword = {keyword} setKeyword = {setKeyword} placeholder = {currentTab.charAt(0).toUpperCase() + currentTab.slice(1) + " Events"}/>
                    </div>
                </div>
            </section>

                <Route path = "/tournaments/upcoming" >
                <section>
                    {upcoming && upcoming.length > 0 ? 
                        <div className = "grid four-column" style = {{margin: '1rem', gap:'1rem', width: 'calc(100% - 2rem)'}}>
                                {upcoming && upcoming.map((tournament) => (
                                    <>
                                    <UpcomingCard
                                        img = {tournament.data().img}
                                        tournamentName = {tournament.data().name}
                                        date = {formatDate(new Date(tournament.data().date.seconds*1000))}
                                        slug = {tournament.data().slug}
                                        id = {tournament.data().id}
                                    />
                                        {/*<button onClick = {() => db.collection('tournaments').doc('example-current').set(tournament.data())}> BUTTON</button>*/}
                                    </>
                                ))}
                        </div>
                        :
                        <h4 style = {{margin:'2rem auto'}}>No tournaments found!</h4>
                    }

                </section>
                </Route>
                <Route path = "/tournaments/past">
                    <section style = {{padding:0, width: "calc(90% + 2rem)"}}>
                        {past && past.length > 0 ? 
                            <table className = "past-table">
                                <thead>
                                    <tr>
                                        <th className = "name-col">{windowSize.width > 550 ? "Event Name":"Past Events"}</th>
                                        <th className = "loc-col">Location</th>
                                        <th className = "date-col">Date</th>
                                        <th className = "teams-col"># Teams</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {past && past.map((tournament)=>(
                                        <tr>
                                            <td className = "name-col">{tournament.data().name}</td>
                                            <td className = "loc-col" style = {{whiteSpace:'nowrap'}}>{tournament.data().location}</td>
                                            <td className = "date-col" style = {{whiteSpace:'nowrap'}}>{formatDate(new Date(tournament.data().date.seconds*1000))}</td>
                                            <td className = "teams-col">{tournament.data().numTeams}</td>
                                            <td>
                                                <Link className = "link" to = {`/tournament?id=${tournament.data().slug + tournament.data().id}`}>
                                                    <Button
                                                        size = "medium"
                                                        color = 'red'
                                                        label = 'See More'
                                                    />
                                                </Link>
                                            </td>
                                        </tr>   
                                    ))}
                                </tbody>
                            </table>
                            :
                            <h4 style = {{padding:'2rem 0', margin:'0 auto'}}>No tournaments found!</h4>
                        }

                    </section>
                </Route>

        </div>

    )
}

export default TournamentsPage