import {useState,useEffect} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import HomePage from './pages/index'
import TournamentsPage from './pages/tournaments'
import TournamentPage from './pages/tournament'
import ContentPage from './pages/content'
import VideosPage from './pages/videos'
import PodcastsPage from './pages/podcasts'
import AdminPage from './pages/admin'
import SignInPage from './pages/sign-in'
import AcctDashPage from './pages/account-dashboard'
import Header from './components/header'
import Footer from './components/footer'

import {firebase} from './firebase/config'
import { useAuthState } from 'react-firebase-hooks/auth';

import ScrollToTop from './utilities/scrollToTop'


function App() {

  const auth = firebase.auth();

  const [user, loading, error] = useAuthState(auth);

  return (
    <>
      <Router>
        <Switch>
          <Route path exact = '/'>
            <Header user = {user}/>
            <HomePage></HomePage>
          </Route>
          <Route path = '/tournaments'>
            <ScrollToTop/>
            <Header mainPath = "tournaments" user = {user}/>
            <TournamentsPage></TournamentsPage>
          </Route>
          <Route path = '/content'>
            <ScrollToTop/>
            <Header mainPath = "content" user = {user}/>
            <ContentPage></ContentPage>
          </Route>
          <Route path = '/tournament'>
            <ScrollToTop/>
            <Header mainPath = "tournaments" user = {user}/>
            <TournamentPage user = {user}></TournamentPage>
          </Route>
          <Route path = '/videos'>
            <ScrollToTop/>
            <Header mainPath = "content" user = {user}/>
            <VideosPage></VideosPage>
          </Route>
          <Route path = '/podcasts'>
            <ScrollToTop/>
            <Header mainPath = "content" user = {user}/>
            <PodcastsPage></PodcastsPage>
          </Route>
          <Route path = "/admin">
            <ScrollToTop/>
            <Header user = {user}/>
            <AdminPage></AdminPage>
          </Route>
          <Route path = "/sign-in">
            <ScrollToTop/>
            <Header user = {user}/>
            <SignInPage></SignInPage>
          </Route>
          <Route path = "/account-dashboard">
            <ScrollToTop/>
            <Header user = {user}/>
            <AcctDashPage user = {user} ></AcctDashPage>
          </Route>
        </Switch>
      </Router>

      {/*<Footer/>*/}
    </>

  );
}

export default App;
