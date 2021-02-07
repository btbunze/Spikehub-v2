import React, {useState, useEffect} from 'react';
import {Route, Link, useHistory} from 'react-router-dom'
import Button from '../components/button'

import {firebase} from '../firebase/config'

import axios from 'axios'



const SignInPage = () => {

    const auth = firebase.auth();
    const db = firebase.firestore();
    let history = useHistory();

    const logIn = () =>{
        auth.signInWithEmailAndPassword(email,password).then((res) => {
            history.push('/')
        })
    }

    const createAccount = () =>{


        auth.createUserWithEmailAndPassword(email, password).then((res) => {
            db.collection('users').doc(res.user.uid).set({email, organizations: [], tournaments: []}).then(() => {
                history.push('/')
            })

        }
        )
        console.log(auth.currentUser)
    }

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
        <div style = {{minHeight: "calc(100vh - 3rem)", backgroundColor:'var(--light-gray)', display:'flex'}}>
            <div className = "login-container">
                <Route exact path = "/sign-in">
                    <h3 style = {{marginBottom: '2rem'}}>Welcome to Spikehub</h3>
                    <Link to = "/sign-in/login" className = "link">
                        <Button size = 'medium' color = 'red' label = 'Login' styles = {{width:'100%'}} onClick = {null}></Button>
                    </Link>
                    <p style = {{margin: '.5rem auto'}}>or</p>
                    <Link to = "/sign-in/signup" className = "link">
                        <Button size = 'medium' color = 'red' label = 'Sign Up' styles = {{width:'100%'}} onClick = {null}></Button>
                    </Link>
                </Route>
                        
                <Route path = "/sign-in/login">
                    <h4 style = {{marginTop:'0px', marginBottom:'1.5rem'}}>Welcome Back!</h4>
                    <div className = 'login-input-pair'>
                        <label className = "form-label">email</label>
                        <input className = "form-input" placeholder = "" id = "user" value = {email} onChange = {(e)=>setEmail(e.target.value)}></input>
                    </div>
                    <div className = 'login-input-pair'>
                        <label className = "form-label">password</label>
                        <input className = "form-input" placeholder = "" id = "pass" value = {password} onChange = {(e)=>setPassword(e.target.value)}></input>
                        <Button size = 'medium' color = 'red' label = 'Login' styles = {{width:'100%'}} onClick = {logIn}></Button>
                    </div>
                </Route>
                <Route path = "/sign-in/signup">
                    <h4 style = {{marginTop:'0px', marginBottom:'1.5rem'}}>Register for Spikehub</h4>
                    <div className = 'login-input-pair'>
                        <label className = "form-label">email</label>
                        <input className = "form-input" placeholder = "" id = "user" value = {email} onChange = {(e)=>setEmail(e.target.value)}></input>
                    </div>
                    <div className = 'login-input-pair'>
                        <label className = "form-label">password</label>
                        <input className = "form-input" placeholder = "" id = "pass" value = {password} onChange = {(e)=>setPassword(e.target.value)}></input>
                        <Button size = 'medium' color = 'red' label = 'Create Account' styles = {{width:'100%'}} onClick = {createAccount}></Button>
                    </div>
                </Route>
            </div>
        </div>
    )
}

export default SignInPage