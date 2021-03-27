import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import { useCollection } from 'react-firebase-hooks/firestore'
import {GoogleMap, Marker, InfoWindow, withScriptjs, withGoogleMap} from 'react-google-maps'

import {firebase} from '../firebase/config'

const Map = () => {

    const db = firebase.firestore()

    const [selectedEvent, setSelectedEvent] = useState(null)
    const [tourneyPositions, setTourneyPositions] = useState(null)
    const [tournaments, loadingTournaments, error] = useCollection(db.collection('tournaments'))
    const [upcoming, setUpcoming] = useState([])

    useEffect(() => {
        if(tournaments){

            const today = new Date()

            setUpcoming(tournaments.docs.filter((tournament) => {
                return new Date(tournament.data().date.seconds*1000) > today
            }))
        }
    },[tournaments])



    return(
        <GoogleMap
            defaultZoom = {4}
            defaultCenter = {{lat: 39, lng:-95}}
        >
            {tournaments && upcoming.map((doc)=>{ 
                
                const data = doc.data()

                return (
            <Marker
                key = {doc.id}
                position = {{lat: data.lat, lng: data.lng}}
                onClick = {() => {setSelectedEvent({...data, id: doc.id})}}
            >
                {selectedEvent && selectedEvent.id == doc.id && 
                    <InfoWindow
                        onCloseClick = {()=>{
                            setSelectedEvent(null)
                        }}
                    >
                        <div style = {{textAlign:'left', padding:'0 .5rem'}}>
                           <h3 style = {{fontSize:'1.5rem'}}>{selectedEvent.name}</h3>
                           <p>{selectedEvent.location}</p> 
                           <a href= {`/tournament?id=${selectedEvent.slug+selectedEvent.id}`}>More Info →</a>
                        </div>
                    </InfoWindow>
                }
            </Marker>)}
            )

            }


        </GoogleMap>
    )
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

export default WrappedMap