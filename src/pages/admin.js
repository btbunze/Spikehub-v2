import React, {useState, useEffect} from 'react';
import Button from '../components/button'

import {firebase} from '../firebase/config'
import {useCollection} from 'react-firebase-hooks/firestore'

import axios from 'axios'

const AdminPage = () => {
    
    const db = firebase.firestore();

    const [canAddTournament,setCanAddTournament] = useState(false)
    const [canAddVideo,setCanAddVideo] = useState(false)
    const [tournamentPass, setTournamentPass] = useState("")
    const [contentPass, setContentPass] = useState("")

    const [tournamentFormOpen, setTournamentFormOpen] = useState(false)

    const tournamentCode = "hi";
    const contentCode = "hello";

    useEffect(()=>{
        console.log(tournamentPass)
        if(tournamentPass == tournamentCode){
            setCanAddTournament(true)
        }
    },[tournamentPass])

    useEffect(() => {
        console.log(contentPass)
        if(contentPass == contentCode){
            setCanAddVideo(true)
        }
    },[contentPass])

    const submitTournament = (e) =>{
        e.preventDefault();
        const tournament = {}
        const form = e.currentTarget.parentNode

        Array.from(form.children).forEach((node)=>{
            if(node.nodeName == "INPUT"){
                let value = null
                if(node.id == "date" || node.id == "regEndDate"){
                    value = new Date(node.value)
                } 
                else if(node.id == "img"){
                    value = node.files[0]
                }
                else{
                    value = node.value
                }

                tournament[node.id] = value
            }
        })

        const file = tournament.img
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
            tournament.img = res.data.secure_url;
            tournament.bracketLink = null;
            tournament.liveLink = null;
            tournament.numTeams = null;
            tournament.results = null;
            tournament.freeAgents = [];
            tournament.slug = tournament.name.replace(" ","-").toLowerCase();
            db.collection('tournaments').doc(tournament.slug).set(tournament)

        })
    }

    return(
        <div style = {{minHeight: "calc(100vh - 3rem)", backgroundColor:'var(--light-gray)', padding:'3rem 0'}}>
            <section style = {{marginTop: "0"}}>
                <h3 style = {{marginTop: '1rem'}}>Tournament Host Dashboard</h3>
                {!canAddTournament ? (<>
                <h4 style = {{marginTop: '1rem'}}>Please input the tournament host password</h4>
                <input 
                    placeholder = "Enter Pass" 
                    className = "search" 
                    value = {tournamentPass}
                    onChange = {(e) => setTournamentPass(e.target.value)}
                    style = {{display:'block', margin: 'auto', marginBottom: '2rem'}}
                ></input>
                </>)
                :
                (<>
                    <h4 style = {{marginTop: '1rem'}}>Welcome! Click the button below to add a tournament</h4>
                    {!tournamentFormOpen ? 
                    (<div style = {{margin: '1rem auto'}}>
                        <Button size = "large" color = "red" label = "Add A Tournament" styles = {{margin:'0 1rem'}} onClick = {()=> setTournamentFormOpen(true)}></Button>
                    </div>)
                    :
                    (<form>
                        <label className = "form-label">Tournament Name</label>
                        <input className = "form-input" placeholder = "" id = "name"></input>
                        <label className = "form-label">Host</label>
                        <input className = "form-input" placeholder = "Host or organization name" id = "host"></input>
                        <label className = "form-label">Location</label>
                        <input className = "form-input" placeholder = "City, ST" id = "location"></input>
                        <label className = "form-label">Divisions</label>
                        <input className = "form-input" placeholder = "Comma-separated list" id = "divisions"></input>
                        <label className = "form-label">Date</label>
                        <input className = "form-input" type = "date" id = "date"></input>
                        <label className = "form-label">Registration End Date</label>
                        <input className = "form-input" type = "date" id = "regEndDate"></input>
                        <label className = "form-label">Registration Link</label>
                        <input className = "form-input" placeholder = "Link to registration form" id = "link"></input>
                        <label className = "form-label">Short Description</label>
                        <input className = "form-input" placeholder = "Blurb about tournament" id = "desc"></input>
                        <label className = "form-label">Picture</label>
                        <input className = "form-input" type = "file" style = {{backgroundColor:'white'}} id = "img"></input>
                        <Button size = "medium" color = "red" label = "Submit" styles = {{width: 'fit-content'}} onClick = {submitTournament}></Button>
                    </form>)}
                </>)
                }          
            </section>

            <section style = {{marginBottom:'0'}}>
                <h3 style = {{marginTop: '1rem'}}>Content Creator Dashboard</h3>
                {!canAddVideo ? (<>
                <h4 style = {{marginTop:'1rem'}}>COMING SOON!</h4>
                {/*<input 
                    placeholder = "Enter Pass" 
                    className = "search" 
                    value = {contentPass}
                    onChange = {(e) => setContentPass(e.target.value)}
                    style = {{display:'block', margin: 'auto', marginBottom: '2rem'}}
                ></input>*/}
                </>)
                :
                (<div style = {{margin: '1rem auto'}}>
                    <h4 style = {{marginTop: '1rem'}}>Welcome! Click one of the buttons below to add content!</h4>
                    <Button size = "large" color = "red" label = "Add A Video" styles = {{margin:'0 1rem'}}></Button>
                    <Button size = "large" color = "red" label = "Add A Podcast" styles = {{margin:'0 1rem'}}></Button>
                </div>)
                }
            </section>
        </div>
    )
}

export default AdminPage;