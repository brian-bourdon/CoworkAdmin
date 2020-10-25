import React, { useState, useEffect } from 'react';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  useHistory
} from "react-router-dom";
import './SideBar.css';
import { faHome, faUsers, faBuilding, faKey, faLaptopHouse, faUtensils, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Container, Row, Col, Spinner, CardDeck, Alert, Navbar, Form, FormControl, Button} from 'react-bootstrap'
import styled from 'styled-components';
// Component tableau pour toutes les reserv, update, delete, create
import {Header} from './components/Header'
import {TableData} from './components/TableData'
import {Login} from './components/Login'
import {Profil} from './components/Profil'
import {getCookie} from './util/util'
import { DetailUser } from './components/DetailUser';

const Main = styled.main`
position: relative;
overflow: hidden;
transition: all .15s;
margin-left: ${props => (props.extanded ? 240 : 64)}px;
`;

function SideBar(props) {
  const location = useLocation()
  const history = useHistory()

  const onToggle = () => {
    props.data.setExtanded(!props.data.extanded)
    props.data.setLoad(false)
  };

  return(
    <SideNav
      style={{position: "fixed"}}
      expanded={props.data.extanded}
      onSelect={(selected) => {
          const to = '/' + selected;
          if (location.pathname !== to) {
            history.push(to);
          }
      }}
      onToggle={() => onToggle()}
    >
    
    <SideNav.Toggle/>
      <SideNav.Nav defaultSelected={location.pathname === "/" ? "utilisateurs" : null}>
          <NavItem eventKey="utilisateurs" active={location.pathname === "/utilisateurs" ? true : false} onClick={() => props.data.setLoad(true)}>
              <NavIcon>
                <FontAwesomeIcon icon={faUsers} style={{ fontSize: '1.75em', verticalAlign: 'middle' }}/>
              </NavIcon>
              <NavText style={{ paddingRight: 32 }}>
                  Utilisateurs
              </NavText>
          </NavItem>
          <NavItem eventKey="espaces" active={location.pathname === "/espaces" ? true : false} onClick={() => props.data.setLoad(true)}>
              <NavIcon>
                <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '1.75em', verticalAlign: 'middle' }}/>
              </NavIcon>
              <NavText>
                  Espaces
              </NavText>
          </NavItem>
          <NavItem eventKey="espaces_privatifs" active={location.pathname === "/espaces_privatifs" ? true : false} onClick={() => props.data.setLoad(true)}>
              <NavIcon>
                <FontAwesomeIcon icon={faKey} style={{ fontSize: '1.75em', verticalAlign: 'middle' }}/>
              </NavIcon>
              <NavText>
                  Espaces privatifs
              </NavText>
          </NavItem>
          <NavItem eventKey="equipements" active={location.pathname === "/equipements" ? true : false} onClick={() => props.data.setLoad(true)}>
              <NavIcon>
                <i><FontAwesomeIcon icon={faLaptopHouse} style={{ fontSize: '1.75em', verticalAlign: 'middle' }}/></i>
              </NavIcon>
              <NavText>
                  Equipements
              </NavText>
          </NavItem>
          <NavItem eventKey="plateaux_repas" active={location.pathname === "/plateaux_repas" ? true : false} onClick={() => props.data.setLoad(true)}>
              <NavIcon>
                <FontAwesomeIcon icon={faUtensils} style={{ fontSize: '1.75em', verticalAlign: 'middle' }}/>
              </NavIcon>
              <NavText>
                  Plateaux repas
              </NavText>
          </NavItem>
          <NavItem eventKey="evenements" active={location.pathname === "/evenements" ? true : false} onClick={() => props.data.setLoad(true)}>
              <NavIcon>
                <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '1.75em', verticalAlign: 'middle' }}/>
              </NavIcon>
              <NavText>
                  Evenements
              </NavText>
          </NavItem>
      </SideNav.Nav>
    </SideNav>
  )
}

function App() {
  const[extanded, setExtanded] = useState(true)
  const[load, setLoad] = useState(true)
  const[connected, setConnected] = useState(false)
  const[successModification, setSuccessModification] = useState(null)
  
  const handleSuccessModification = (v) => {
    setSuccessModification(v)
  }

  useEffect(() => {
    document.title = "Co'work Admin"
    document.body.style.backgroundColor = null
 }, []);

  return (
    <div className="App">
      <Router>
        <Route render={({ location, history }) => (
            <React.Fragment>
              {!getCookie("id") && <Route path="/" component={props => <Login data={{location, history, setConnected}}/>} />}
              {getCookie("id") && <>
                <SideBar data={{setExtanded, extanded, setLoad}}/>
                <Main extanded={extanded}>
                    <Header data={{history, location, setConnected}}/>
                    <Container fluid className="pr-20 pl-20" style={{paddingTop: "2em", paddingBottom: "2em"}}>
                      <Route path="/" exact component={props => <TableData data={{load}}/>} />
                      <Route path="/utilisateurs" component={props => <TableData data={{load}}/>} />
                      <Route path="/espaces" component={props => <TableData data={{load}}/>} />
                      <Route path="/espaces_privatifs" component={props => <TableData data={{load}}/>} />
                      <Route path="/equipements" component={props => <TableData data={{load}}/>} />
                      <Route path="/plateaux_repas" component={props => <TableData data={{load}}/>} />
                      <Route path="/evenements" component={props => <TableData data={{load}}/>} />
                      <Route path="/profil" component={props => <Profil data={{handleSuccessModification, successModification}}/>} />
                      <Route path="/details" component={props => <DetailUser data={{load}}/>} />
                    </Container>
                </Main>
              </>}
            </React.Fragment>
        )}
        />
      </Router>
    </div>
  );
}

function RootComponent() {
  return(
    <p>"RootComponent"</p>
  )
}

function Home() {
  return(
    "Home"
  )
}

function Devices() {
  return(
    "Devices"
  )
}

export default App;
