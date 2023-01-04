import {
    useState,
    useEffect
  } from 'react'
  import { useNavigate } from "react-router-dom";
  import { User } from '../types/user.type';
  import Spinner from '../components/spinner/spinner'
  import authService from '../api/authService'
  import Button from 'react-bootstrap/Button';
  import Form from 'react-bootstrap/Form';
  import styles from '../styles/Home.module.css'
import authStore from '../store/authStore';
  
  export default function RegisterPage() {
  
    const navigate = useNavigate();
    const { auth,setAuth } = authStore((state:any) => ({ auth: state.auth ,setAuth:state.setAuth}));
  
    const [fields,setFields] = useState({
      name: '',
      email:'',
      password: ''
    }) 
  
    const [loading,setLoading] = useState<Boolean>(false)
    const [error,setError] = useState<String>('')
  
   
  // Form onchange function 
    
    const onChange =  (event:any) =>{
      setFields({...fields, [event.target.name] : event.target.value});
      setError('')
    }
  
  
    // submit form function
    const handleRegister = async (e :any) => {
      e.preventDefault();
      setError('');
      setLoading(true);
  
      const user : User = {
        name: fields.name as string,
        email: fields.email as string,
        password: fields.password as string
      }
  
      try
      {
        // get response from register endpoint
        const response = await authService.register(user);
        
        const name = response?.data?.name;
        const accessToken = response?.data?.accessToken;
  
  // set value on zustand state
        setAuth({accessToken,isLoggedIn:true})
            
      } catch (error: any)
      {
        const message = error.response && error.response.data.error ? error.response.data.error : 'Something went wrong';
        setError(message);
      }
      setLoading(false);
    };
  
  
    useEffect(() => {
      if (auth.isLoggedIn) {
        navigate('/')
      }
    
    }, [auth]);
  
  
    return (
      <>
        <div>
          <h2 className={styles.title}>Register</h2>
          <Form className={styles.form} onSubmit={handleRegister}>
  
            {/* Name */}
            <Form.Group className="mb-4" controlId="username">
              <Form.Label>name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" name="name" onChange={onChange} value={fields.name} />
            </Form.Group>
  
            {/* Email */}
            <Form.Group className="mb-4" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" name="email" onChange={onChange} value={fields.email} />
            </Form.Group>
  
            {/* Password */}
            <Form.Group className="mb-4" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter password" name="password" onChange={onChange} value={fields.password} />
            </Form.Group>
  
            <Button variant="primary" type="submit" className={styles.btn}>
              Submit
            </Button>
  
            <Form.Label>{error}</Form.Label>
  
            {<Form.Label>{loading && <Spinner />}</Form.Label>}
            
          </Form>
  
        </div>
        
      </> 
    )
  }
  