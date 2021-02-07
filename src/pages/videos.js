import React, {useEffect, useState} from 'react'

import Tag from '../components/tag'

import {firebase} from '../firebase/config'
import {useCollection} from 'react-firebase-hooks/firestore'

const VideosPage = () => {

    const db = firebase.firestore()

    const [videos, loading, error] = useCollection(db.collection('videos'))

    const [sortedVideos, setSortedVideos] = useState([])
    const [genTags, setGenTags] = useState({})
    const [players, setPlayers] = useState({})
    const [teams, setTeams] = useState({})
    const [tournaments, setTournaments] = useState({})

    const [selectedTags, setSelectedTags] = useState([])
    const [selectedPlayers, setSelectedPlayers] = useState([])
    const [selectedTeams, setSelectedTeams] = useState([])
    const [selectedTournaments, setSelectedTournaments] = useState([])

    const videoReducer = (accumulator, currentValue) =>{
        accumulator.genTags = [...accumulator.genTags, ...currentValue.data().tags.general]
        accumulator.players = [...accumulator.players, ...currentValue.data().tags.players]
        accumulator.teams = [...accumulator.teams, ...currentValue.data().tags.teams]
        accumulator.tournaments = [...accumulator.tournaments, ...currentValue.data().tags.tournament]
        return accumulator;
    }


    const selectTag = (label, count) => {
        setSelectedTags([...selectedTags, [label, count]])
    }

    //pass setSelectedX and selectedX to function as parameters to eliminate duplicate code?
    const deselectTag = (tagType, label) => {
        
        let index = 0;
        switch(tagType){
            case "genTag":
                index = selectedTags.map((a)=> a[0]).indexOf(label)
                const newSelectedTags = [...selectedTags]
                newSelectedTags.splice(index, 1)
                setSelectedTags(newSelectedTags)
                break
            case "player":
                index = selectedPlayers.map((a)=> a[0]).indexOf(label)
                console.log(index)
                console.log(selectedPlayers)
                const newSelectedPlayers = [...selectedPlayers]
                newSelectedPlayers.splice(index, 1)
                console.log(newSelectedPlayers)
                console.log(selectedPlayers)
                setSelectedPlayers(newSelectedPlayers)
                break
            case "team":
                index = selectedTeams.map((a)=> a[0]).indexOf(label)
                const newSelectedTeams = [...selectedTeams]
                newSelectedTeams.splice(index, 1)
                setSelectedTeams(newSelectedTeams)
                break
            case "tournament":
                index = selectedTournaments.map((a)=> a[0]).indexOf(label)
                const newSelectedTournaments = [...selectedTournaments]
                newSelectedTournaments.splice(index, 1)
                setSelectedTournaments(newSelectedTournaments)

        }

    }



    useEffect(() =>{
        if(videos){

            setSortedVideos(videos.docs.sort((a,b) => {
                const dateA = new Date(a.data().date.seconds*1000)
                const dateB = new Date(b.data().date.seconds*1000)
                if(dateA < dateB){
                    return 1
                }
                else{
                    return -1
                }
            }))


            const tags = videos.docs.reduce(videoReducer, {genTags:[], players:[], teams:[], tournaments:[]});
            const tagCountsArr = Object.entries(tags).map(([label, values]) => {
                const counts = {}
                values.forEach((val)=> {
                    if(counts[val]){
                        counts[val] += 1;
                    }
                    else{
                        counts[val] = 1;
                    }
                })
                return [label, counts];
            })
            
            const tagCounts = Object.fromEntries(tagCountsArr)

            setGenTags(tagCounts.genTags);
            setPlayers(tagCounts.players);
            setTeams(tagCounts.teams);
            setTournaments(tagCounts.tournaments)
        }
    }, [videos])


    //note: array select values come through as strings with comma separating elements
    const handleChange = (e, category) => {
        switch (category) {
            case "players":
                if(!selectedPlayers.map((elt) => elt[0]).includes(e.currentTarget.value)){
                    setSelectedPlayers([...selectedPlayers, [e.currentTarget.value, players[e.currentTarget.value]]])
                }
                break
            case "teams":
                if(!selectedTeams.map((elt) => elt[0]).includes(e.currentTarget.value)){
                    setSelectedTeams([...selectedTeams, [e.currentTarget.value, teams[e.currentTarget.value]]])
                }
                break
            case "tournaments":
                setSelectedTournaments([[e.currentTarget.value, tournaments[e.currentTarget.value]]])
        }
        e.currentTarget.selectedIndex = 0;
    }

    return (
        <div style = {{backgroundColor: 'var(--red)', minHeight:'calc(100vh - 3rem)', width:'100%', display:'inline-block'}}>
            <div className = "content" style = {{textAlign:'center'}}>
                <h2 style = {{marginTop:'4rem', marginBottom:'.5rem'}}>Explore {videos ? videos.docs.length : "#"} Videos</h2>
                <p className = "small-heading" style = {{marginTop: '0rem', marginBottom:'4rem'}}>Choose a tag below to filter</p>
            </div>
            <div className = "content">
                <div style = {{paddingBottom:'2rem'}}>
                    {genTags && Object.keys(genTags).map((tag)=> {
                        return (<Tag 
                                    label = {tag} 
                                    count = {genTags[tag]} 
                                    select = {()=> selectTag(tag, genTags[tag])} 
                                    deselect = {() => deselectTag("genTag", tag)}>
                                </Tag>)
                    })}
                </div>
            </div>
            <div className = "content">
                <div className = "grid three-column" style = {{gap: '2rem'}}>
                    <div className = "dropdown-filter-section">
                        <select className = "dropdown-filter" onChange = {(e) => handleChange(e, "players")} >
                            <option disabled selected hidden>Choose Players...</option>
                            {players && Object.keys(players).map((label)=> (
                                <option value = {label}>{label} ({players[label]})</option>
                            ))}
                        </select>
                        <div>
                            {selectedPlayers && selectedPlayers.map(([label, count]) => (
                                <Tag label = {label} count = {count} isSelected deselect = {() => deselectTag("player", label)}></Tag>
                            ))}
                        </div>
                    </div>
                    <div>
                        <select className = "dropdown-filter" onChange = {(e) => handleChange(e, "teams")}>
                            <option disabled selected hidden>Choose Teams...</option>
                            {teams && Object.keys(teams).map((label)=> (
                                <option value = {label}>{label} ({teams[label]})</option>
                            ))}
                        </select>
                        <div>
                            {selectedTeams && selectedTeams.map(([label, count]) => (
                                <Tag label = {label} count = {count} isSelected deselect = {() => deselectTag("team", label)}></Tag>
                            ))}
                        </div>
                    </div>
                    <div>
                        <select className = "dropdown-filter" onChange = {(e) => handleChange(e, "tournaments")}>
                            <option disabled selected hidden>Choose Tournament...</option>
                            {tournaments && Object.keys(tournaments).map((label)=> (
                                <option value = {label}>{label} ({tournaments[label]})</option>
                            ))}
                        </select>
                        <div>
                            {selectedTournaments && selectedTournaments.map(([label, count]) => (
                                <Tag label = {label} count = {count} isSelected deselect = {() => deselectTag("tournament", label)}></Tag>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <section>
                <div className = "grid three-column">
                    {videos && sortedVideos.filter((video) => {
                        let keep = true;
                        const {link, tags} = video.data()
                        const tagsArray = Object.values(tags).flat()
                        const filterTags = [...selectedTags.map((a) => a[0]), ...selectedPlayers.map((a)=> a[0]), ...selectedTeams.map((a)=> a[0]), ...selectedTournaments.map((a)=> a[0])]
                        filterTags.forEach((tag) => {
                            if(!tagsArray.includes(tag)){
                                keep = false;
                            }
                        })
                        return keep
                    }).map((video) => {
                        const videoId = video.data().link.split("?v=")[1].split('&')[0];
                        return (<iframe width="350" height="197" style = {{margin:'auto'}} src= {`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>)
                    })
                    }
                </div>
            </section>
        </div>
    )
}

export default VideosPage