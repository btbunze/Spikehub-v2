import React, {useState, useEffect} from 'react';
import {Route, Link, useLocation, useHistory} from 'react-router-dom'

import {firebase} from '../firebase/config'
import {useCollection} from 'react-firebase-hooks/firestore'
import generateID from '../utilities/generateID'

import Button from '../components/button'
import OrgCard from '../components/edit-org-card'

import axios from 'axios'

const EditOrganizationPage = ({user}) =>{

    const history = useHistory();
    const pathname = useLocation().pathname;
    const query = new URLSearchParams(useLocation().search)
    const db = firebase.firestore();



    //organization state
    const [organizations, loading, error] = useCollection(db.collection('organizations'))
    const [orgList, setOrgList] = useState([])
    const [initialOrg, setInitialOrg] = useState({name: '', location: '', link:'', desc:''})
    const [orgData, setOrgData] = useState({})
    const [changesSaved, setChangesSaved] = useState(true)
    const [dataValidationError,setDataValidationError] = useState(null)
    const [deleteConfirm, setDeleteConfirm] = useState(false)
    const [tempImg, setTempImg] = useState(null)

    useEffect(()=> {
        if(organizations && pathname.includes('/organizations/edit')){
            setInitialOrg(organizations.docs.find((org) => org.data().id == query.get("id")).data())
            setOrgData(organizations.docs.find((org) => org.data().id == query.get("id")).data())
        }
    },[organizations])

    useEffect(()=>{
        if(user){
            db.collection('users').doc(user.uid).get().then((doc) => {
                setOrgList(doc.data().organizations)
            })
        }
    },[user])


    useEffect(() => {
        let changesMade = false;

        for(let i of Object.keys(orgData)){
            if(orgData[i] != initialOrg[i]){
                changesMade = true
            }
        }

        if(tempImg){
            changesMade = true;
        }

        setChangesSaved(!changesMade)
    },[orgData, tempImg])

    const updateOrg= (key, value)=>{
        setOrgData({...orgData, [key]: value})
    }

    const addNewOrg = (e)=>{
        e.preventDefault();

        //can all be done in validateData
        const missingData = validateData()
        if(missingData.length > 0){
            setDataValidationError(`*Make sure your organization has a ${missingData[0]}`)
            return
        }

        //better way than storing id inside org's data object?
        if(!orgData.id){
            orgData.id = generateID()
        }
        orgData.owner = user.uid

        const orgRef = db.collection('organizations').doc(orgData.id)

        console.log('here')
        db.collection('users').doc(user.uid).update({organizations: [...orgList, orgData.id]})

        if(tempImg){
            const file = tempImg
            const formData = new FormData()
            formData.append("file",file)
            formData.append("upload_preset", "spike_hub_organization")
            axios({
                url: "https://api.cloudinary.com/v1_1/dicfhqxoo/upload",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: formData
            }).then((res) => {
                orgRef.get().then((snapshot) => {
                    if(snapshot.exists){
                        orgRef.update({...orgData,img: res.data.secure_url})
                    }
                    else{
                        orgRef.set({...orgData,img: res.data.secure_url})
                    }
                })
                .then(()=>history.push("/account-dashboard/organizations"))
            })
        }
        else{
            orgRef.get().then((snapshot) => {
                if(snapshot.exists){
                    orgRef.update(orgData)
                }
                else{
                    orgRef.set(orgData)
                }
            })
            .then(() => history.push("/account-dashboard/organizations"))
        }
    }

    const deleteOrg = () => {
        db.collection("organizations").doc(orgData.id).delete()
        .then(() => db.collection('users').doc(user.uid).update({organizations: orgList.filter((orgID) => !(orgID == orgData.id))}))
        .then(history.push("/account-dashboard/organizations"))

    }

    const validateData = () => {
        const missingData = []
        
        if(!orgData.name){
            missingData.push("name")
        }
        return missingData
    }



    return (
        <> 

                <div className = "underlined" style = {{display:'flex', justifyContent: 'space-between', position:'relative'}}>
                    <h3 className = "dash-header">{organizations ? (orgData.id ? initialOrg.name : "New Organization"):null}</h3>
                </div>
                <input type = 'file' id = "img" accept = 'image/*' onChange = {(e)=> {setTempImg(e.target.files[0])}} style = {{marginTop:'3rem'}}></input>
                <img src ={tempImg ? URL.createObjectURL(tempImg) : orgData && orgData.img ? orgData.img : "https://res.cloudinary.com/dicfhqxoo/image/upload/v1612321575/tournament-icon_ydpdbe.png" } style = {{width:'10rem', height:'10rem', display:'block', marginTop:'1rem'}} alt = "Organization Photo Here"></img>

                <div className = "dash-input-grid" style = {{marginTop:'3rem'}}>
                    <div className = "input-container">
                        <label className = "dash-label">Organization Name</label>
                        <input className = "dash-input" placeholder = "" id = "name" value = {orgData.name} onChange = {(e) => updateOrg(e.target.id, e.target.value)}></input>
                    </div>
                    <div className = "input-container">
                        <label className = "dash-label">Location</label>
                        <input className = "dash-input" placeholder = "" id = "location"  value = {orgData.location} onChange = {(e) => updateOrg(e.target.id, e.target.value)}></input>
                    </div>
                    <div className = "input-container wide">
                        <label className = "dash-label">Website Link</label>
                        <input className = "dash-input" placeholder = "" id = "link" value = {orgData.link} onChange = {(e) => updateOrg(e.target.id, e.target.value)}></input>
                    </div>
                    <div className = "input-container wide">
                        <label className = "dash-label">Short Description</label>
                        <input className = "dash-input" placeholder = "" id = "desc" value = {orgData.desc} onChange = {(e) => updateOrg(e.target.id, e.target.value)}></input>
                    </div>
                </div>

                <div style = {{display:'flex', justifyContent:'space-between', width:'100%'}}>
                    <div>
                        <Link className = "link" to= "/account-dashboard/organizations">
                            <Button size = "medium" color = "dark-gray" label = "Cancel" styles = {{width: 'fit-content', marginTop:'1rem', marginRight:'1rem'}} ></Button>
                        </Link>
                        <Button size = "medium" color = "red" label = {orgData.id ? "Save Organization":"Add Organization"} styles = {{width: 'fit-content', marginTop:'1rem'}} onClick = {(e) => addNewOrg(e)} isDisabled = {changesSaved}></Button> 
                    </div>
                    {Object.keys(initialOrg).length > 0 && <Button size = "medium" color = "red" label = {deleteConfirm ? "Confirm Delete":"Delete"} styles = {{width: 'fit-content', marginTop:'1rem'}} onClick = {deleteConfirm ? deleteOrg : () => setDeleteConfirm(true)}></Button>}
                </div>

                {dataValidationError && <p style = {{fontSize:'.8rem'}}>{dataValidationError}</p>}
        </>
    )
}

export default EditOrganizationPage
