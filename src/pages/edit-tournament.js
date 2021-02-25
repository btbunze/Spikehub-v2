import React, {useState, useEffect} from 'react';
import {Route, Link, useLocation, useHistory} from 'react-router-dom'

import {firebase} from '../firebase/config'
import {useCollection} from 'react-firebase-hooks/firestore'
import generateID from '../utilities/generateID'

import Button from '../components/button'
import OrgCard from '../components/edit-org-card'
import SelectedItem from '../components/selected-item'

import axios from 'axios'
import areEqual from '../utilities/areEqual';

const EditTournamentPage = ({user}) =>{

    const history = useHistory();
    const pathname = useLocation().pathname;
    const query = new URLSearchParams(useLocation().search)
    const db = firebase.firestore();

    const [userData, setUserData] = useState({})

    const [organizations, oLoading, oError] = useCollection(db.collection('organizations'))

    //tournament state
    const [tournaments, tLoading, tError] = useCollection(db.collection('tournaments'))
    const [tournamentList, setTournamentList] = useState([])
    const [initialTournament, setInitialTournament] = useState({})
    const [tournamentData, setTournamentData] = useState({})
    const [changesSaved, setChangesSaved] = useState(true)

    const [tempImg, setTempImg] = useState(null)
    const [tempDivision, setTempDivision] = useState("")
    const [tempResults, setTempResults] = useState({})
    const [schedule, setSchedule] = useState([])
    const [results, setResults] = useState({})
    const [prizes, setPrizes] = useState({})

    const [deleteConfirm, setDeleteConfirm] = useState(false)
    const [dataValidationError, setDataValidationError] = useState("")


    useEffect(()=> {
        if(tournaments && pathname.includes('/tournaments/edit')){

            //in the form of [...slug, id] (slug in multiple parts if "_" in it)
            const slugIdArray = query.get('id').split("_");
            
            const id = `_${slugIdArray[slugIdArray.length-1]}`
            const slug = slugIdArray.slice(0,slugIdArray.length-1).join("_")

            const data = tournaments.docs.find((tournament) => tournament.data().id == id).data()



            setInitialTournament({...data, date: new Date(data.date.seconds*1000).toISOString().slice(0,10), regEndDate: new Date(data.regEndDate.seconds*1000).toISOString().slice(0,10), prizes: JSON.parse(JSON.stringify(data.prizes)), results: JSON.parse(JSON.stringify(data.results))})
            setTournamentData({...data, date: new Date(data.date.seconds*1000).toISOString().slice(0,10), regEndDate: new Date(data.regEndDate.seconds*1000).toISOString().slice(0,10)})
            if(data.schedule){
                setSchedule(data.schedule)
            }
        }
    },[tournaments])

    useEffect(()=>{
        if(user){
            db.collection('users').doc(user.uid).get().then((doc) => {
                setTournamentList(doc.data().tournaments)
                setUserData(doc.data())
            })
        }
    },[user])

    useEffect(() => {

        let tempPrizes = tournamentData.prizes
        
        if(tournamentData.divisions && tournamentData.prizes){
            if(!areEqual(tournamentData.divisions.sort(), Object.keys(tournamentData.prizes).sort())){
                tournamentData.divisions.forEach((division, index) => {
                    if(!tournamentData.prizes[division]){
                        tempPrizes[division] = ["","",""];
                    }
                })
                Object.keys(tournamentData.prizes).forEach((division, index) => {
                    if(!tournamentData.divisions.find((elt) => elt == division)){
                        delete tempPrizes[division]
                    }
                })
                updateTournament("prizes", tempPrizes)
            }
        }


        if(tournamentData.divisions && tournamentData.results){
            if(!areEqual(tournamentData.divisions.sort(), Object.keys(tournamentData.results).sort())){
                tournamentData.divisions.forEach((division, index) => {
                    if(!tournamentData.results[division]){
                        tempResults[division] = {1:["","",""],2:["","",""],3:["","",""]}
                    }
                })
                Object.keys(tournamentData.results).forEach((division, index) => {
                    if(!tournamentData.divisions.find((elt) => elt == division)){
                        delete tempResults[division]
                    }
                })
                updateTournament("results", tempResults)
            }
        }

        if(tournamentData.divisions && !tournamentData.prizes){
            let emptyPrizes = {}
            tournamentData.divisions.forEach((division) => {
                emptyPrizes[division] = ["","",""]
            })
            updateTournament("prizes", emptyPrizes)
        }

        if(tournamentData.divisions && !tournamentData.results){
            let emptyResults = {}
            tournamentData.divisions.forEach((division) => {
                emptyResults[division] = {1:["","",""],2:["","",""],3:["","",""]}
            })
            updateTournament("results", emptyResults)
        }

        const changesMade = !areEqual(tournamentData, initialTournament) || tempImg

        setChangesSaved(!changesMade)
    },[tournamentData, tempImg])


    useEffect(() => {
        if(tournamentData && schedule){
            setTournamentData({
                ...tournamentData, 
                schedule: schedule.filter((val)=> !areEqual(val, {time:'', event:''}))
            })
        }
    }, [schedule])

    const updateTournament = (key, value)=>{

        let val = value;

        console.log('here')

        if(key == "host"){
            if(value == user.uid){
                val = {type: "user", id: value}
            }
            else{
                val = {type: "organization", id: value}
            }
        }
        // else if(key == "date" || key == "regEndDate"){
        //     val = new Date(value + "T00:00:00")
        // }
        console.log(val)

        setTournamentData({...tournamentData, [key]: val})
    }


    const addDivision = () => {

        if(tempDivision == "" || (tournamentData.divisions && tournamentData.divisions.find((elt) => elt == tempDivision))){
            return
        }

        let tempDivisions = []

        if(tournamentData.divisions){
            tempDivisions = [...tournamentData.divisions];
        }
        tempDivisions.push(tempDivision)

        updateTournament("divisions", tempDivisions)
        setTempDivision("")
    }

    const deleteDivision = (division) => {
        let tempDivisions = [...tournamentData.divisions]
        let index = tempDivisions.findIndex((elt) => elt == division)
        tempDivisions.splice(index, 1)

        updateTournament("divisions", tempDivisions)
    }

    const updateSchedule = (index, time, event) => {
        let tempSched = [...schedule];
        tempSched[index] = {time, event}

        setSchedule(tempSched)
    }

    const updatePrizes = (key, index, value) => {
        console.log(initialTournament.prizes) 
        console.log(tournamentData.prizes)
        let tempPrizes = {...tournamentData.prizes};
        tempPrizes[key][index] = value;
       updateTournament("prizes", tempPrizes)
    }

    const updateResults= (key, placement, index, value) => {
        console.log("tournament data:")
        console.log(tournamentData.results)
        console.log(initialTournament.results)
        let tempResults = {...tournamentData.results};
        tempResults[key][placement][index] = value;
        console.log(tempResults)
       updateTournament("results", tempResults)
    }

    const addNewTournament = (e)=>{
        e.preventDefault();

        let missingData = validateData()
        if(missingData.length > 0){
            if(missingData.length >= 2){
                missingData[missingData.length-1] = "and " + missingData[missingData.length-1]
                if(missingData.length == 2){
                    setDataValidationError(`*Make sure your tournament has a ${missingData.join(" ")}`)
                }
                else{
                    setDataValidationError(`*Make sure your tournament has a ${missingData.join(", ")}`)
                }
                return
            }
            if(missingData[0] == "at least 1 division"){
                setDataValidationError(`Make sure your tournament has ${missingData[0]}`)
                return
            }
            setDataValidationError(`Make sure your tournament has a ${missingData[0]}`)
            return
        }

        tournamentData.date = new Date(tournamentData.date + "T00:00:00")
        tournamentData.slug = tournamentData.name.replaceAll(" ","-").toLowerCase().replaceAll("#","").replaceAll("?","");
        tournamentData.owner = user.uid

        if(!tournamentData.host){
            tournamentData.host = {type: 'user', id: user.uid}
        }

        if(!tournamentData.id){
            tournamentData.id = generateID()
        }

        const tournamentRef = db.collection('tournaments').doc(tournamentData.id)

        if(tempImg){
            const file = tempImg
            const formData = new FormData()
            formData.append("file",file)
            formData.append("upload_preset", "spike_hub_tournament")
            axios({
                url: "https://api.cloudinary.com/v1_1/dicfhqxoo/upload",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: formData
            }).then((res) => {
                tournamentRef.get().then((snapshot) => {
                    if(snapshot.exists){
                        tournamentRef.update({...tournamentData,img: res.data.secure_url})
                    }
                    else{
                        db.collection('users').doc(user.uid).update({tournaments: [...tournamentList, tournamentData.id]})
                        tournamentRef.set({...tournamentData,img: res.data.secure_url})
                    }
                })
                .then(()=>history.push("/account-dashboard/tournaments"))
            })
        }
        else{
            tournamentRef.get().then((snapshot) => {
                if(snapshot.exists){
                    tournamentRef.update(tournamentData)
                }
                else{
                    db.collection('users').doc(user.uid).update({tournaments: [...tournamentList, tournamentData.id]})
                    tournamentRef.set(tournamentData)
                }
            })
            .then(() => history.push("/account-dashboard/tournaments"))
        }
    }

    const deleteTournament = () => {
        db.collection("tournaments").doc(tournamentData.id).delete()
        .then(() => db.collection('users').doc(user.uid).update({tournaments: tournamentList.filter((tournamentID) => !(tournamentID == tournamentData.id))}))
        .then(history.push("/account-dashboard/tournaments"))

    }

    const validateData = () => {
        const missingData = []
        
        if(!tournamentData.name){
            missingData.push("name")
        }
        if(!tournamentData.date || !tournamentData.date.match(/^(19|20)\d\d-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
            missingData.push("valid date")
        }
        if(!tournamentData.date){
            missingData.push("location")
        }
        if(!tournamentData.regEndDate){
            missingData.push("registration end date")
        }
        if(!tournamentData.divisions || tournamentData.divisions.length == 0){
            missingData.push("at least 1 division")
        }

        return missingData
    }


    return (
        <> 
                <div className = "underlined" style = {{display:'flex', justifyContent: 'space-between', position:'relative'}}>
                    <h3 className = "dash-header">{tournaments ? (Object.keys(initialTournament).length > 0 ? initialTournament.name : "New Tournament") : null}</h3>
                </div>
                
                <input type = 'file' id = "img" accept = 'image/*' onChange = {(e)=> {setTempImg(e.target.files[0])}} style = {{marginTop:'3rem'}}></input>
                <img src ={tempImg ? URL.createObjectURL(tempImg) : tournamentData && tournamentData.img ? tournamentData.img : "https://res.cloudinary.com/dicfhqxoo/image/upload/v1612321575/tournament-icon_ydpdbe.png" } style = {{width:'10rem', height:'10rem', display:'block', marginTop:'1rem'}} alt = "Tournament Photo Here"></img>
                <h3 className = "dash-subheader">Basic Info</h3>
                <div className = "dash-input-grid">
                    <div className = "input-container">
                        <label className = "dash-label">Tournament Name</label>
                        <input className = "dash-input" placeholder = "" id = "name" maxlength = "72" value = {tournamentData.name} onChange = {(e) => updateTournament(e.target.id, e.target.value)}></input>
                    </div>
                    <div className = "input-container">
                        <label className = "dash-label">Host</label>
                        <select className = "dash-input" id = "host"  value = {tournamentData.host && tournamentData.host.id} onChange = {(e) => updateTournament(e.target.id, e.target.value)}>
                            <option value = {user && user.uid}>{userData && userData.fName + " " + userData.lName}</option>
                            {organizations && Object.keys(userData).length > 0 && userData.organizations.map((orgID) => {
                                const orgData = organizations.docs.find((org) => org.data().id == orgID).data();
                                return (
                                    <option value = {orgID}>{orgData.name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className = "input-container">
                        <label className = "dash-label">Date</label>
                        <input className = "dash-input" type = "date" placeholder = "yyyy-mm-dd" id = "date"
                            value = {Object.keys(tournamentData).length > 0 && tournamentData.date && tournamentData.date} 
                            onChange = {(e) => {updateTournament(e.target.id, e.target.value);}}>
                        </input>
                    </div>
                    <div className = "input-container">
                        <label className = "dash-label">Registration End Date</label>
                        <input className = "dash-input" type = "date" id = "regEndDate" 
                            value = {Object.keys(tournamentData).length > 0 && tournamentData.regEndDate && tournamentData.regEndDate} 
                            onChange = {(e) => updateTournament(e.target.id, e.target.value)}>
                        </input>
                    </div>
                    <div className = "input-container">
                        <label className = "dash-label">Location</label>
                        <input className = "dash-input" placeholder = "" id = "location" maxlength = "35" value = {tournamentData.location} onChange = {(e) => updateTournament(e.target.id, e.target.value)}></input>
                    </div>
                    <div className = "input-container">
                        <label className = "dash-label">Registration Link</label>
                        <input className = "dash-input" placeholder = "" id = "link" value = {tournamentData.link} onChange = {(e) => updateTournament(e.target.id, e.target.value)}></input>
                    </div>

                    <div className = "input-container wide">
                        <label className = "dash-label">Description</label>
                        <textarea className = "dash-input" placeholder = "" id = "desc" maxlength = "255" value = {tournamentData.desc} onChange = {(e) => updateTournament(e.target.id, e.target.value)}></textarea>
                    </div>
                    <div className = "input-container wide">
                        <label className = "dash-label">Divisions</label>
                    </div>
                    <div className = 'input-container'>
                        <input className = "dash-input" placeholder = "Division Name" id = "divisions" maxLength = "20" value = {tempDivision} onChange = {(e) => setTempDivision(e.target.value)}></input> 
                        {tournamentData.divisions && tournamentData.divisions.map((name) =>(
                            <SelectedItem label = {name} remove = {deleteDivision}></SelectedItem>
                        ))
                        }
                    </div>
                    <div className = "input-container">
                        <Button label = "Add Division" color = 'dark-gray' size = "medium" onClick = {addDivision}></Button>
                    </div>

                </div>

                <h3 className = "dash-subheader">Schedule</h3>
                <div className = "dash-input-grid">
                    {tournamentData && Object.keys(tournamentData).length > 0 && Object.keys(schedule).length > 0 && (
                        <>
                        <div className = "input-container skinny">
                            <label className = "dash-label">Time</label>
                        </div>
                        <div className = "input-container three-fourths">
                            <label className = "dash-label">Event</label>
                        </div>
                        </>
                    )}

                    {/* using value is a bit confusing*/}
                    {schedule && Object.keys(schedule).length > 0 && schedule.map((elt, index)=> (
                        <>
                        <input className = "dash-input" value = {elt.time} maxLength = "13" onChange = {(e) => updateSchedule(index, e.target.value, elt.event)}></input>
                        <input className = "dash-input normal" value = {elt.event} maxLength = "50" onChange = {(e) => updateSchedule(index, elt.time, e.target.value)}></input>
                        <div style = {{display:'flex', alignItems:'center', marginBottom:'1rem'}}>
                            <Button label = "X" size = 'small' color = 'red' onClick = {() => setSchedule(schedule.filter((val, i) => index != i))}>x</Button>
                        </div>
                        </>
                    ))}
                    <Button color = 'red' size = "medium" label = "Add Scheduled Event" styles = {{gridColumn: 'span 3'}} onClick = {() =>setSchedule([...schedule, {time:'', event: ''}])}></Button>
                </div>
                <h3 className = "dash-subheader">Prizes</h3>

                    {tournamentData.prizes && Object.keys(tournamentData.prizes).length >0 ?
                    <div className = "dash-input-grid">
                        <div style = {{visibility:'hidden'}}></div>
                        <label className = "dash-label">1st</label>
                        <label className = "dash-label">2nd</label>
                        <label className = "dash-label">3rd</label>
                        {tournamentData.prizes && Object.keys(tournamentData.prizes).length > 0 && Object.keys(tournamentData.prizes).map((elt, index) => (
                            <>
                                <label className = "dash-label" style = {{margin:'auto 0', paddingBottom:'1rem'}}>{elt}</label>
                                <input className = "dash-input skinny" value = {tournamentData.prizes[elt][0]} onChange = {(e) => updatePrizes(elt, 0, e.target.value)}></input>
                                <input className = "dash-input skinny" value = {tournamentData.prizes[elt][1]} onChange = {(e) => updatePrizes(elt, 1, e.target.value)}></input>
                                <input className = "dash-input skinny" value = {tournamentData.prizes[elt][2]} onChange = {(e) => updatePrizes(elt, 2, e.target.value)}></input>
                            </>
                        ))}
                    </div>
                    :
                    <p className = "input-container-wide">Add divisions to edit prizes!</p>}

                <h3 className = "dash-subheader">Happening-Now Links</h3>
                <div className = "dash-input-grid">
                    <div className = "input-container">
                            <label className = "dash-label" >Bracket Link</label>
                            <input className = "dash-input" id = "bracketLink" value = {tournamentData.bracketLink}  onChange = {(e) => updateTournament(e.target.id, e.target.value)}></input>
                    </div>
                    <div className = "input-container">
                            <label className = "dash-label"  >Livestream Link</label>
                            <input className = "dash-input" id = "liveLink" value = {tournamentData.liveLink} onChange = {(e) => updateTournament(e.target.id, e.target.value)}></input>
                    </div>
                </div>
                <h3 className = "dash-subheader">Results</h3>
                <div className = "dash-input-grid">
                    <div className = "input-container">
                        <label className = "dash-label">Number of Teams</label>
                        <input className = "dash-input" placeholder = "" id = "numTeams" maxlength = "3" value = {tournamentData.numTeams} onChange = {(e) => updateTournament(e.target.id, e.target.value)}></input>
                    </div>
                </div>
                {tournamentData.results && Object.keys(tournamentData.results).length > 0 ? 

                    <>
                    <div className = "dash-input-grid" style = {{marginBottom:'1rem'}}>
                        <div className = "input-container">
                                <label className = "dash-label">Link to Full Results (e.g. bracket)</label>
                                <input className = "dash-input"></input>
                        </div>
                    </div>

                    {/*Assignment of value and onChange can be done programatically?*/}
                    {Object.keys(tournamentData.results).map((elt, index) => (
                    <div className = "dash-input-grid"  style = {{marginBottom:'2rem'}}>
                        <label className = "dash-label" style = {{fontSize:'1rem', marginBottom:'2rem'}}>{elt} Results</label>
                        <label className = "dash-label" style = {{marginTop:'2rem'}}>Team Name</label>
                        <label className = "dash-label" style = {{marginTop:'2rem'}}>Player 1</label>
                        <label className = "dash-label" style = {{marginTop:'2rem'}}>Player 2</label>
    
                        <label className = 'dash-label' style = {{margin:"auto 0", paddingBottom:'1rem'}}>1st Place</label>
                        <input className = "dash-input skinny" maxLength = "30" value = {tournamentData.results[elt][1][0]} onChange = {(e) => updateResults(elt, 1, 0, e.target.value)}></input>
                        <input className = "dash-input skinny" maxLength = "30" value = {tournamentData.results[elt][1][1]} onChange = {(e) => updateResults(elt, 1, 1, e.target.value)}></input>
                        <input className = "dash-input skinny" maxLength = "30" value = {tournamentData.results[elt][1][2]} onChange = {(e) => updateResults(elt, 1, 2, e.target.value)}></input>
    
                        <label className = 'dash-label' style = {{margin:"auto 0", paddingBottom:'1rem'}}>2nd Place</label>
                        <input className = "dash-input skinny" maxLength = "30" value = {tournamentData.results[elt][2][0]} onChange = {(e) => updateResults(elt, 2, 0, e.target.value)}></input>
                        <input className = "dash-input skinny" maxLength = "30" value = {tournamentData.results[elt][2][1]} onChange = {(e) => updateResults(elt, 2, 1, e.target.value)}></input>
                        <input className = "dash-input skinny" maxLength = "30" value = {tournamentData.results[elt][2][2]} onChange = {(e) => updateResults(elt, 2, 2, e.target.value)}></input>
    
                        <label className = 'dash-label' style = {{margin:"auto 0", paddingBottom:'1rem'}}>3rd Place</label>
                        <input className = "dash-input skinny" maxLength = "30" value = {tournamentData.results[elt][3][0]} onChange = {(e) => updateResults(elt, 3, 0, e.target.value)}></input>
                        <input className = "dash-input skinny" maxLength = "30" value = {tournamentData.results[elt][3][1]} onChange = {(e) => updateResults(elt, 3, 1, e.target.value)}></input>
                        <input className = "dash-input skinny" maxLength = "30" value = {tournamentData.results[elt][3][2]} onChange = {(e) => updateResults(elt, 3, 2, e.target.value)}></input>
                    </div>
                    ))}
                    </>
                :
                <p className = "input-container-wide" style = {{marginTop:'0'}}>Add divisions to edit results!</p>
                }

                <div style = {{display:'flex', justifyContent:'space-between', width:'100%'}}>
                    <div>
                        <Link className = "link" to= "/account-dashboard/tournaments">
                            <Button size = "medium" color = "dark-gray" label = "Cancel" styles = {{width: 'fit-content', marginTop:'1rem', marginRight:'1rem'}} ></Button>
                        </Link>
                        <Button size = "medium" color = "red" label = {Object.keys(initialTournament).length > 0 ? "Save":"Add Tournament"} styles = {{width: 'fit-content', marginTop:'1rem', marginRight:'1rem'}} onClick = {(e) => addNewTournament(e)} isDisabled = {changesSaved}></Button> 

                    </div>
                    {Object.keys(initialTournament).length > 0 && <Button size = "medium" color = "red" label = {deleteConfirm ? "Confirm Delete":"Delete"} styles = {{width: 'fit-content', marginTop:'1rem'}} onClick = {deleteConfirm ? deleteTournament : () => setDeleteConfirm(true)}></Button>}
                </div>
                {dataValidationError && <p style = {{fontSize:'.8rem'}}>{dataValidationError}</p>}
        </>
    )
}

export default EditTournamentPage