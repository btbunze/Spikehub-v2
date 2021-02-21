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
        .catch((err) => {
            console.log(err)
            setErrMsg(err.code.split('/')[1])
        })
    }

    const createAccount = () =>{



        auth.createUserWithEmailAndPassword(email, password).then((res) => {
            db.collection('users').doc(res.user.uid).set({email, organizations: [], tournaments: []}).then(() => {
                history.push('/')
            })
        }
        )
        .catch((err) => {
            setErrMsg(err.code.split('/')[1])
        })



        console.log(auth.currentUser)
    }

    const displayErr = (err) => {
        switch(err) {
            case "email-already-in-use":
                return <p className = "err-msg">*Email already in use. <Link to = "/sign-in" className = "link" style = {{textDecoration: 'underline'}}>Sign in?</Link></p>
            case "invalid-email":
                return <p className = "err-msg">*Invalid email.</p>
            case "wrong-password":
                return <p className = "err-msg">*Incorrect password</p>
            case "user-not-found":
                return <p className = "err-msg">*No account with this email. <Link to = "/sign-in" className = "link" style = {{textDecoration: 'underline'}}>Sign up?</Link></p>
        }
        if(err == "email-already-in-use"){
        }
        if(err == "invalid-email"){
        }
        if(err == "wrong-password"){
        }
    }

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errMsg, setErrMsg] = useState("")

    return (
        <div style = {{minHeight: "calc(100vh - 3rem)", backgroundColor:'var(--light-gray)', display:'flex'}}>
            <div className = "login-container">
                <Route exact path = "/sign-in">
                    <h3 style = {{marginBottom: '2rem'}}>Welcome to Spikehub</h3>
                    <Link to = "/sign-in/login" className = "link">
                        <Button size = 'medium' color = 'red' label = 'Login' styles = {{width:'100%'}} onClick = {() => setErrMsg("")}></Button>
                    </Link>
                    <p style = {{margin: '.5rem auto'}}>or</p>
                    <Link to = "/sign-in/signup" className = "link">
                        <Button size = 'medium' color = 'red' label = 'Sign Up' styles = {{width:'100%'}} onClick = {() => setErrMsg("")}></Button>
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
                        <input className = "form-input" placeholder = "" id = "pass" type = "password" value = {password} onChange = {(e)=>setPassword(e.target.value)}></input>
                        <Button size = 'medium' color = 'red' label = 'Login' styles = {{width:'100%'}} onClick = {logIn}></Button>
                        {displayErr(errMsg)}
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
                        <input className = "form-input" placeholder = "" id = "pass" type = "password" value = {password} onChange = {(e)=>setPassword(e.target.value)}></input>
                        <Button size = 'medium' color = 'red' label = 'Create Account' styles = {{width:'100%'}} onClick = {createAccount}></Button>
                        {displayErr(errMsg)}
                    </div>
                </Route>
            </div>
        </div>
    )
}

export default SignInPage