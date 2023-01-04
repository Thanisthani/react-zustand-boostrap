import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom'
import authService from '../api/authService'
import authStore from '../store/authStore';
import {
  useEffect,
  useState
} from 'react'

export default function NavBar() {

    const navigate = useNavigate()
  const { auth, setAuth } = authStore(
    (state: any) => ({ auth: state.auth ,setAuth:state.setAuth}));

  // const auth = authStore((state: any) => state.auth);
  // const  setAuth = authStore((state: any) =>  state.setAuth);

    const logOut = () =>{
      authService.logout()
      setAuth({accessToken:'',isLoggedIn:false})
      navigate('/')
    }

    useEffect(() => {
      console.log("hjojoj",auth.isLoggedIn);
   
    }, []);
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          {auth.isLoggedIn && auth.isLoggedIn ? (
              <Nav.Link href="/login" onClick={logOut}>Logout</Nav.Link>
          ):(
          <>
            <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href="/register">Register</Nav.Link>
          </>
          )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
