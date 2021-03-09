import React, {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'

import Button from '../components/button'
import FreeAgentCard from '../components/free-agent-card'

import tourneyIcon from '../assets/ex-tourney-icon.png'

import {firebase} from '../firebase/config'
import {useDocument} from 'react-firebase-hooks/firestore'
import axios from 'axios'
import TournamentsPage from './tournaments'

import formatDate from '../utilities/formatDate'
import generateID from '../utilities/generateID'

const useQueryString = () =>{
    return new URLSearchParams(useLocation().search);
}


const TournamentPage = ({user}) => {

    const db = firebase.firestore()

    //in the form of [...slug, id] (slug in multiple parts if "_" in it)
    const slugIdArray = useQueryString().get('id').split("_");
    
    console.log(slugIdArray)

    const id = `_${slugIdArray[slugIdArray.length-1]}`
    const slug = slugIdArray.slice(0,slugIdArray.length-1).join("_")

    console.log(id)

    const [tournament, loading, error] = useDocument(db.doc(`tournaments/${id}`))

    const [isFreeAgentsOpen, setIsFreeAgentsOpen] = useState(true)
    const [isScheduleOpen, setIsScheduleOpen] = useState(false)
    const [isPrizesOpen, setIsPrizesOpen] = useState(false)
    const [isTeamsOpen, setIsTeamsOpen] = useState(false)
    const [isResultsOpen, setIsResultsOpen] = useState(true)

    const [userData, setUserData] = useState({})
    const [isOverlayOpen, setIsOverlayOpen] = useState(false)
    const [manualEntry, setManualEntry] = useState(false)
    const [freeAgent, setFreeAgent] = useState({})
    const [profileAlert, setProfileAlert] = useState(false)

    const [prizesExist, setPrizesExist] = useState(false)
    const [hostName, setHostName] = useState("")

    useEffect(() => {
        if(tournament){
            const hostType = tournament.data().host.type;
            const hostId = tournament.data().host.id;


            if(hostType == "organization"){
                db.collection("organizations").doc(hostId).get().then((doc) => {
                    setHostName(doc.data().name)
                })
            }
            if(hostType == "user"){
                db.collection("users").doc(hostId).get().then((doc) => {
                    setHostName(doc.data().fName + " " + doc.data().lName)
                })
            }
            if(hostType == "temp"){
                setHostName(tournament.data().host.name)
            }

            setFreeAgent({...freeAgent, division: tournament.data().divisions[0]})
        }
    },[tournament])

    useEffect(()=>{
        if(user){
            db.collection('users').doc(user.uid).get().then((doc) => {
                setUserData(doc.data())
            })
        }
    },[user])

    const toggleAccordion = (accordionName) => {
        // e.currentTarget.nextElementSibling.classList.toggle('open');
        switch(accordionName) {
            case 'freeAgents':
                setIsFreeAgentsOpen(!isFreeAgentsOpen);
            case 'teams': 
                setIsTeamsOpen(!isTeamsOpen);
                return
            case 'results':
                setIsResultsOpen(!isResultsOpen)
                return
            case 'schedule':
                setIsScheduleOpen(!isScheduleOpen)
                return
            case 'prizes':
                setIsPrizesOpen(!isPrizesOpen)
        }

    }

    const addFreeAgent = (isSelf, e) => {
        e.currentTarget.disabled = true;
        let player = {}

        if(isSelf){
            if(!userData.fName || !userData.lName || !(userData.email || userData.phone) || !userData.rpr){
                setProfileAlert(true)
                return;
            }
            player = {
                name: userData.fName + " " + userData.lName,
                img: userData.img,
                email: userData.email,
                phone: userData.phone,
                rpr: userData.rpr,
                division: freeAgent.division,
                freeAgentId: generateID(),
                creatorId: user.uid
            }
        }

        else{
            if(user){
                player = {...freeAgent, freeAgentId: generateID(), creatorId: user.uid}
            }else{
                player = freeAgent
            }
        }

        if(tournament.data().freeAgents){
            db.doc(`tournaments/${id}`).update({freeAgents: [...tournament.data().freeAgents, player]}).then(()=> {setIsOverlayOpen(false); setManualEntry(false)})
        }
        else{
            db.doc(`tournaments/${id}`).update({freeAgents: [player]}).then(()=> {setIsOverlayOpen(false); setManualEntry(false)})

        }

    }

    const deleteFreeAgent = (faID) => {

        const updatedFreeAgents = tournament.data().freeAgents.filter((obj) => {
            return !(obj.freeAgentId == faID)
        })


        db.doc(`tournaments/${id}`).update({freeAgents: updatedFreeAgents}).then(()=> setIsOverlayOpen(false))
    }


    return (
        <div style = {{minHeight: "calc(100vh - 3rem)", backgroundColor:'var(--light-gray'}}>
            <div className = "content" style = {{padding: '2rem 0rem'}}>
                {tournament && console.log(tournament.data())}
                <h2 className = "tournament-heading" >{tournament && tournament.data().name}</h2>
                <h4 className = "tournament-subheading">{tournament && `Hosted By ${hostName }`}</h4>
            </div>
            <div className = "content tournament-info-section">
                <div className = "tournament-sidebar">
                    <img src = {tournament && tournament.data().img || "https://res.cloudinary.com/dicfhqxoo/image/upload/v1612321575/tournament-icon_ydpdbe.png"} style = {{width: '95%', margin:'0 auto 1.5rem auto'}}></img>
                    <h3>{tournament && tournament.data().location }</h3>
                    <h3 style = {{fontSize:'1.25rem', marginTop:'.5rem'}}>{tournament && formatDate(new Date(tournament.data().date.seconds*1000))}</h3>
                    <p>{tournament && tournament.data().description}</p>
                    {tournament && new Date(tournament.data().date.seconds*1000) > new Date() &&
                    <>
                        {new Date(tournament.data().regEndDate.seconds*1000) > new Date() ? 
                        <>
                            {tournament.data().link ? 
                            <a href = {tournament && tournament.data().link} className = "link" target = "_blank"><Button size = "large" color = "red" label = "Register"></Button></a>
                            :
                            <Button size = "medium" color = "red" label = "No Registration Link" onClick = {tournament && tournament.data().link} isDisabled = {true}></Button>                   
                            }
                            <p style = {{fontSize:'.8rem', margin:'.5rem auto 0 auto'}}>Registration ends on <br/><strong>{formatDate(new Date(tournament.data().regEndDate.seconds * 1000))}</strong></p>
                        </>
                        :
                        <Button size = "medium" color = "light-gray" label = "Registration Has Ended" onClick = {tournament && tournament.data().link} isDisabled = {true}></Button>
                        }
                    </>
                    }
                    
                </div>
                <div className = "tournament-info">
                    {tournament && new Date(tournament.data().date.seconds*1000) > new Date() ? 
                    (<>
                        <button className= "accordion-header" onClick = {() => toggleAccordion('freeAgents')}>
                            <div style = {{display:'flex'}}>
                                <h3 className = "accordion-header-label">Free Agents</h3>
                                <Button size = "medium" color = "red" label = "Add New" styles = {{margin:'auto'}} onClick = {(e)=>{e.stopPropagation(); setIsOverlayOpen(true)}}></Button>
                            </div>
                            <h3>{isFreeAgentsOpen ? "-" : "+"}</h3>
                        </button>
                        <div className = {`accordion-content grid two-column ${isFreeAgentsOpen ? "open" : ""}`} style = {{gap: '1rem', width: 'calc(100% - 2rem)'}}>
                            {tournament && tournament.data().freeAgents && Object.keys(tournament.data().freeAgents).length > 0 ? 
                                tournament.data().freeAgents.map((data) => (<FreeAgentCard data = {data} user = {user} deleteSelf = {() => deleteFreeAgent(data.freeAgentId)}></FreeAgentCard>))
                            :
                            <h4 style = {{margin: '0 1rem'}}>No Free Agents Yet!</h4>
                            }
                        </div>
                        <button className= "accordion-header" onClick = {() => toggleAccordion('schedule')}>
                            <div style = {{display:'flex'}}>
                                <h3 className = "accordion-header-label">Schedule</h3>
                            </div>
                            <h3>{isScheduleOpen ? "-" : "+"}</h3>
                        </button>
                        <div className = {`accordion-content grid two-column ${isScheduleOpen ? "open" : ""}`} style = {{gap: '1rem', width: 'calc(100% - 2rem)'}}>
                            {tournament && tournament.data().schedule && tournament.data().schedule.length > 0 ? 
                            <div className = "grid" style = {{gridTemplateColumns: 'auto 1fr', columnGap: '1rem', margin:'0 1rem'}}>
                                {tournament.data().schedule.map((data) => (<>
                                    <p className = "schedule-time">{data.time}</p>
                                    <p className = "schedule-event">{data.event}</p>
                                </>))}
                            </div>
                            :
                            <h4 style = {{margin: '0 1rem'}}>Schedule TBD</h4>
                            }

                        </div>
                        <button className= "accordion-header" onClick = {() => toggleAccordion('prizes')}>
                            <div style = {{display:'flex'}}>
                                <h3 className = "accordion-header-label">Prizes</h3>
                            </div>
                            <h3>{isPrizesOpen ? "-" : "+"}</h3>
                        </button>
                        <div className = {`accordion-content grid two-column ${isPrizesOpen ? "open" : ""}`} style = {{gap: '1rem', width: 'calc(100% - 2rem)'}}>
                            {(tournament && tournament.data().prizes && Object.keys(tournament.data().prizes).length > 0) &&
                            <div className = "grid" style = {{gridTemplateColumns: 'auto auto 1fr', columnGap: '1rem', margin:'0 1rem'}}>
                                {Object.keys(tournament.data().prizes).map((key) => {
                                    if(tournament.data().prizes[key][0] != "" && tournament.data().prizes[key][1] != "" && tournament.data().prizes[key][2] != ""){
                                            if(prizesExist == false){
                                                setPrizesExist(true)
                                            }
                                            return <>
                                                <p className = "schedule-time" style = {{gridRow: 'span 3'}}>{key}</p>
                                                <p className = "schedule-event">1st</p>
                                                <p className = "schedule-event">{tournament.data().prizes[key][0]}</p>
                                                <p className = "schedule-event">2nd</p>
                                                <p className = "schedule-event">{tournament.data().prizes[key][1]}</p>
                                                <p className = "schedule-event">3rd</p>
                                                <p className = "schedule-event">{tournament.data().prizes[key][2]}</p>
                                            </>
                                    }
                                })}
                            </div>   
                            }
                            {!prizesExist && <h4 style = {{margin:'-1rem 1rem 0 1rem'}}>Prizes TBD</h4>}
                     
                        </div>
                    </>) 
                    :
                    (<>
                        {/* <button className= "accordion-header" onClick = {() => toggleAccordion('teams')}>
                            <div style = {{display:'flex'}}>
                                <h3 style = {{display:'inline-block', paddingRight: '1rem'}}>Teams</h3>
                                <Button size = "medium" color = "red" label = "Add New" styles = {{margin:'auto'}}></Button>
                            </div>
                            <h3>{isTeamsOpen ? "-":"+"}</h3>
                        </button>
                        <div className = {`accordion-content ${isTeamsOpen ? "open" : ""}`}>
                            Hi
                        </div> */}
                        <button className= "accordion-header" onClick = {() => toggleAccordion('results')}>
                            <div style = {{display:'flex'}}>
                                <h3 className = "accordion-header-label">Results</h3>
                            </div>
                            <h3>{isResultsOpen ? "-":"+"}</h3>
                        </button>
                        <div className = {`accordion-content ${isResultsOpen ? "open" : ""}`}>
                            <div className = "grid" style = {{gridTemplateColumns: 'auto auto 1fr 1fr 1fr', columnGap: '1rem', margin:'0 1rem'}}>
                                <p style = {{gridColumn:'3'}}>Team Name</p>
                                <p>Player 1</p>
                                <p>Player 2</p>
                                {tournament && tournament.data().results && Object.keys(tournament.data().results).sort().map((division) => (
                                <>
                                    <p className = "schedule-time line-above" style = {{gridRow: 'span 3'}}>{division}</p>
                                    {Object.keys(tournament.data().results[division]).map((place, index) => {
                                        const teamArrs = tournament.data().results[division][place] 
                                        
                                        return (<>
                                            <p className = "schedule-time" style = {{fontWeight:'500'}}>{place == 1 && "1st"}{place == 2 && "2nd"}{place == 3 && "3rd"}</p>
                                            <p className = "schedule-event" >{teamArrs[0]}</p>
                                            <p className = "schedule-event">{teamArrs[0]}</p>
                                            <p className = "schedule-event">{teamArrs[0]}</p>                                            
                                        </>)})
                                        }
                                </>))}
                            </div>
                        </div>
                    </>)}
                </div>
            </div>
            {isOverlayOpen ? 
            (<div style = {{width:'100%',height:'100%', position:'fixed', top:0, left:0, backgroundColor: 'rgba(0,0,0,.5)', display:'flex'}}>
                <div style = {{width:'90%', maxWidth:'15rem', backgroundColor:'white', padding:'2rem', margin:'auto', borderRadius:'.5rem'}}>
                    <h3>Add a Free Agent</h3>
                    {user && !manualEntry ? 
                    (<>
                        <div style = {{marginTop: '1rem'}}>
                            <label className = "dash-label" style = {{width:'100%', textAlign:'left'}}>Choose a division</label>
                            <select className = "dash-input" placeholder = "division" style = {{marginBottom:'1rem'}} value = {freeAgent.division} onChange = {(e) => setFreeAgent({...freeAgent, division: e.target.value})}>
                                {tournament && tournament.data().divisions.map((div) => (
                                    <option value = {div}>{div}</option>
                                ))}
                            </select>
                            <Button size = "medium" color = "red" label = "Add Yourself" onClick = {(e)=> {e.currentTarget.classList.add("loading"); addFreeAgent(true, e)}} styles = {{marginBottom:'1rem'}}></Button>
                            {profileAlert ? <p style = {{margin:'-.5rem 0 .5rem 0', fontSize: '.7rem'}}>Make sure your profile has enough information!</p>:null}
                            <Button size = "medium" color = "red" label = "Enter Player Info" onClick = {() => setManualEntry(true)} styles = {{marginBottom:'1rem', marginRight:'1rem'}}></Button>
                            <Button size = "medium" color = "dark-gray" label = "Cancel" onClick = {() => {setIsOverlayOpen(false); setProfileAlert(false)}}></Button>
                        </div>
                    </>)
                    :(<>
                        <div style = {{marginTop:'1rem'}}>
                            <label className = "dash-label">Name</label>
                            <input className = "dash-input" value = {freeAgent.name} onChange = {(e)=> setFreeAgent({...freeAgent, name: e.target.value})}></input>
                            <label className = "dash-label">Email</label>
                            <input className = "dash-input"  value = {freeAgent.email} onChange = {(e)=> setFreeAgent({...freeAgent, email: e.target.value})}></input>
                            <label className = "dash-label">Phone</label>
                            <input className = "dash-input"  value = {freeAgent.phone} onChange = {(e)=> setFreeAgent({...freeAgent, phone: e.target.value})}></input>
                            <label className = "dash-label">RPR</label>
                            <input className = "dash-input"  value = {freeAgent.rpr} onChange = {(e)=> setFreeAgent({...freeAgent, rpr: e.target.value})}></input>
                            <div style = {{textAlign:'right'}}>
                                <Button size = "medium" color = "dark-gray" label = {user ? "Back" : "Cancel"} onClick = {() => user ?  setManualEntry(false) : setIsOverlayOpen(false)} styles = {{marginRight:'1rem'}}></Button>
                                <Button size = "medium" color = "red" label = "Submit" onClick = {(e) => {e.currentTarget.classList.add("loading"); addFreeAgent(false, e)}} styles = {{marginBottom:'1rem'}}></Button>
                            </div>
                        </div>
                    </>)}
                </div>
            </div>):
            null
            }
        </div>   
    )
}

export default TournamentPage