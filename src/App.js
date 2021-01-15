import {useState,useEffect} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import HomePage from './pages/index'
import TournamentsPage from './pages/tournaments'
import ContentPage from './pages/content'
import Header from './components/header'
import Footer from './components/footer'

function App() {

  return (
    <>
      <Router>
        <Switch>
          <Route path exact = '/'>
            <Header/>
            <HomePage></HomePage>
          </Route>
          <Route path = '/tournaments'>
            <Header mainPath = "tournaments"/>
            <TournamentsPage></TournamentsPage>
          </Route>
          <Route>
            <Header mainPath = "content"/>
            <ContentPage></ContentPage>
          </Route>
        </Switch>
      </Router>

      <Footer/>
    </>

  );
}

export default App;
