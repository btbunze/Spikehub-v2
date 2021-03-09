import React, {useState, useEffect} from 'react';
import {Route, Link, useLocation, useHistory} from 'react-router-dom'


import {firebase} from '../firebase/config'
import {useCollection} from 'react-firebase-hooks/firestore'
import {useAuthState} from 'react-firebase-hooks/auth'

import generateID from '../utilities/generateID'
import useWindowSize from '../utilities/useWindowSize'
import areEqual from "../utilities/areEqual"

import EditTournamentPage from './edit-tournament'
import EditOrganizationPage from './edit-organization'
import Button from '../components/button'
import OrgCard from '../components/edit-org-card'
import TournamentCard from '../components/edit-tournament-card'

import axios from 'axios'
import { unstable_concurrentAct } from 'react-dom/test-utils';

//TODO: Break into components for each sub-page

const AcctDashPage = ({user}) => {

    const location = useLocation().pathname
    const history = useHistory()
    const db = firebase.firestore()
    const auth = firebase.auth()


    //application state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const window = useWindowSize()

    //profile state
    const [initialUser, setInitialUser] = useState({})
    const [userData, setUserData] = useState({})
    const [tempImg, setTempImg] = useState(null)
    const [changesSaved, setChangesSaved] = useState(true)

    //tournament state

    const [tournaments, tLoading, tError] = useCollection(db.collection('tournaments'))
    const [organizations, oLoading, oError] = useCollection(db.collection('organizations'))

    //when profile loads, set temporary local state
    useEffect(()=>{
        if(user){
            db.collection('users').doc(user.uid).get().then((doc) => {
                setInitialUser(doc.data())
                setUserData(doc.data())
            })
        }
    },[user])


    useEffect(() => {
        setChangesSaved(areEqual(userData, initialUser))
    },[userData])

    useEffect(() => {
        if(window.width < 800){
            setIsSidebarOpen(false)
        }
        else{
            if(!isSidebarOpen){
                setIsSidebarOpen(true)
            }
        }
    },[window])


    const updateUser = (key, value)=>{
        setUserData({...userData, [key]: value})
    }

    const submitChanges = () =>{
        user.updateProfile({
            email: userData.email
        })

        if(tempImg){
            const file = tempImg
            const formData = new FormData()
            formData.append("file",file)
            formData.append("upload_preset", "spike_hub")
            axios({
                url: "https://api.cloudinary.com/v1_1/dicfhqxoo/upload",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: formData
            }).then((res) => {
    
                db.collection('users').doc(user.uid).update({... userData, img: res.data.secure_url}).then(()=>history.go(0))
            })
        }

        else{
            console.log(userData.fName)
            db.collection('users').doc(user.uid).update(userData).then(() => history.go(0))

        }
    }

    const getTimePeriod = (tournament) => {

        const tournamentDate = new Date(tournament.data().date.seconds*1000) 
        const today = new Date()
        const yesterday = new Date()
        yesterday.setDate(today.getDate() - 1)

        if(tournamentDate > today){
            return "upcoming"
        }

        else if(tournamentDate < yesterday){
            return "past"
        }

        else {
            return "current"
        }
    }

    const signOut = () => {
        auth.signOut().then(() => history.push('/'))
    }

    return (
        <>
            <nav className = "sidebar-toggle">
                <span onClick = {() => setIsSidebarOpen(true)} style = {{cursor:'pointer'}}>☰</span>
            </nav>
            <div style = {{minHeight: "calc(100vh - 6.5rem)", display:'flex'}}>
                {isSidebarOpen &&
                    (
                    <>
                    <aside>
                        <div className = "sidebar-tab main">Account Dashboard</div>
                        <Link to = "/account-dashboard/profile" onClick = {()=> {if(window.width < 800){setIsSidebarOpen(false) }}}>
                            <div className = {`sidebar-tab ${location.includes("profile")? "active":""}`}>Profile</div>
                        </Link>
                        <Link to = "/account-dashboard/tournaments" onClick = {()=> {if(window.width < 800){setIsSidebarOpen(false) }}}>
                            <div className = {`sidebar-tab ${location.includes("tournaments")? "active":""}`}>Tournaments</div>
                        </Link>
                        <Link to = "/account-dashboard/organizations" onClick = {()=> {if(window.width < 800){setIsSidebarOpen(false) }}}>
                            <div className = {`sidebar-tab ${location.includes("organizations")? "active":""}`}>Organizations</div>
                        </Link>
                        <div className = {`sidebar-tab`} style = {{cursor:'pointer'}} onClick = {signOut}>Sign Out</div>
                    </aside>
                    {window.width < 800 && (
                        <div className = "clickable-shadow" onClick = {() => setIsSidebarOpen(false)}></div>
                    )}
                    </>
                    )
                }
                <div className = "dashboard-content">
                    <Route path = "/account-dashboard/profile">
                        <h3 className = "dash-header">Profile</h3>
                        <h3 className = "dash-subheader">Profile Picture</h3>
                        <input type = 'file' id = "img" accept = 'image/*' onChange = {(e)=> {setTempImg(e.target.files[0])}}></input>
                        <img src ={tempImg ? URL.createObjectURL(tempImg) : userData && userData.img ? userData.img : "https://res.cloudinary.com/dicfhqxoo/image/upload/v1611984880/profilepicperson_hdwfcw.png" } style = {{width:'10rem', display:'block', marginTop:'1rem'}} alt = "Your Profile Picture Here"></img>
                        <h3 className = "dash-subheader">Personal Information</h3>
                        <div className = "dash-input-grid">
                            <div className = "input-container">
                                <label className = "dash-label">First Name</label>
                                <input className = "dash-input" placeholder = "" id = "fName" value = {userData.fName} onChange = {(e) => updateUser(e.target.id, e.target.value)}></input>
                            </div>
                            <div className = "input-container">
                                <label className = "dash-label">Last Name</label>
                                <input className = "dash-input" placeholder = "" id = "lName" value = {userData.lName}  onChange = {(e) => updateUser(e.target.id, e.target.value)}></input>
                            </div>
                            <div className = "input-container">
                                <label className = "dash-label">Email</label>
                                <input className = "dash-input" placeholder = "" id = "email" value = {userData.email}  onChange = {(e) => updateUser(e.target.id, e.target.value)}></input>
                            </div>
                            <div className = "input-container-skinny">
                                <label className = "dash-label">Phone #</label>
                                <input className = "dash-input" placeholder = "" id = "phone" maxLength = "16" value = {userData.phone} onChange = {(e) => updateUser(e.target.id, e.target.value)}></input>
                            </div>
                            <div className = "input-container-skinny">
                                <label className = "dash-label">RPR</label>
                                <input className = "dash-input" placeholder = "" id = "rpr" maxLength = "3" value = {userData.rpr} onChange = {(e) => updateUser(e.target.id, e.target.value)}></input>
                            </div> 
                            <Button size = "medium" color = "red" label = "Save Changes" styles = {{width: 'fit-content', marginTop:'2rem'}} onClick = {(e) => {e.currentTarget.classList.add("loading"); submitChanges(); }} isDisabled = {changesSaved}></Button>
                        </div>
                    </Route>
                    <Route exact path = "/account-dashboard/tournaments">
                        <div className = "underlined" style = {{display:'flex', justifyContent: 'space-between', position:'relative'}}>
                            <h3 className = "dash-header">Tournaments</h3>
                            <Link className = 'link' to = "/account-dashboard/tournaments/new">
                                <Button color = "red" size = "medium" label = "Add New" styles = {{marginBottom:'1rem'}}></Button>
                            </Link>
                        </div>
                        <h3 className = "dash-subheader">Current Tournaments</h3>
                        <div className = "grid " style = {{margin: '2rem 0', gap: '2rem', maxWidth:'800px'}}>
                            {user && tournaments && tournaments.docs
                                .filter((tournament)=> getTimePeriod(tournament) == "current" && tournament.data().owner == user.uid)
                                .map((tournament) => (
                                    <TournamentCard tournamentName = {tournament.data().name} date = {tournament.data().date} slug = {tournament.data().slug} img = {tournament.data().img} id = {tournament.data().id}></TournamentCard>
                                ))
                            }
                        </div>
                        <h3 className = "dash-subheader">Upcoming Tournaments</h3>
                        <div className = "grid three-column" style = {{margin: '2rem 0', gap: '2rem', maxWidth:'800px'}}>
                            {user && tournaments && tournaments.docs
                                .filter((tournament)=> getTimePeriod(tournament) == "upcoming" && tournament.data().owner == user.uid)
                                .map((tournament) => (
                                    <TournamentCard tournamentName = {tournament.data().name} date = {tournament.data().date} slug = {tournament.data().slug} img = {tournament.data().img} id = {tournament.data().id}></TournamentCard>
                                ))
                            }
                        </div>
                        <h3 className = "dash-subheader">Past Tournaments</h3>
                        <div className = "grid three-column" style = {{margin: '2rem 0', gap: '1rem', maxWidth:'800px'}}>
                            {user && tournaments && tournaments.docs
                                .filter((tournament)=> getTimePeriod(tournament) == "past" && tournament.data().owner == user.uid)
                                .map((tournament) => (
                                    <TournamentCard tournamentName = {tournament.data().name} date = {tournament.data().date} slug = {tournament.data().slug} img = {tournament.data().img} id = {tournament.data().id}></TournamentCard>
                                ))
                            }
                        </div>

                    </Route>
                    <Route path = {["/account-dashboard/tournaments/new","/account-dashboard/tournaments/edit"]}>
                        <EditTournamentPage user = {user}></EditTournamentPage>
                    </Route>
                    <Route exact path = "/account-dashboard/organizations">
                        <div className = "underlined" style = {{display:'flex', justifyContent: 'space-between', position:'relative'}}>
                            <h3 className = "dash-header">Organizations</h3>
                            <Link className = 'link' to = "/account-dashboard/organizations/new">
                                <Button color = "red" size = "medium" label = "Add New" styles = {{marginBottom:'1rem'}}></Button>
                            </Link>
                        </div>
                        <div className = "grid three-column" style = {{margin: '2rem 0', gap: '2rem', maxWidth:'800px'}}>
                            {user && organizations && organizations.docs
                                .filter((org)=> org.data().owner == user.uid)
                                .map((org) => (
                                    <OrgCard orgName = {org.data().name} id = {org.data().id} img = {org.data().img}></OrgCard>
                                ))
                            }
                        </div>
                    </Route>
                    <Route path = {["/account-dashboard/organizations/new","/account-dashboard/organizations/edit"]}>
                        <EditOrganizationPage user = {user}></EditOrganizationPage>
                    </Route>
                </div>
            </div>
        </>
    )
}

export default AcctDashPage;