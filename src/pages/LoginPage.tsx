import {
    useState,
    useEffect
  } from 'react';
  import { useNavigate } from "react-router-dom";
  import { User } from '../types/user.type';
  import Spinner from '../components/spinner/spinner';
  import authService from '../api/authService'
  import Button from 'react-bootstrap/Button';
  import Form from 'react-bootstrap/Form';
  import styles from '../styles/Home.module.css'
import authStore from '../store/authStore';
  
  
  export default function Login() {
  
    
    const navigate = useNavigate();
  
    // context state
    const { auth,setAuth } = authStore((state:any) => ({ auth: state.auth ,setAuth:state.setAuth}));
  
    const [fields, setFields] = useState<User>({
      email: '',
      password: ''
    });
  
    const [loading, setLoading] = useState<Boolean>(false);
    const [error, setError] = useState<String>('');
  
    
    const onChange =  (event:any) =>{
      setFields({...fields, [event.target.name] : event.target.value});
      setError(''); // set error state to empty
    }
  
    // Submit form
    const handleLogin = async (e: any) => {
      e.preventDefault();
      setError('');
      setLoading(true);
      
      const user: User = {
        email: fields.email as string,
        password: fields.password as string
      }
  
      try
      {
        // get response from login end point 
        const response = await authService.login(user);
  
        const accessToken = response?.data?.accessToken;
        // set value on zustand state
        setAuth({ accessToken, isLoggedIn: true });
      }
      catch (error: any)
      {
        const message = error.response && error.response.data.error ? error.response.data.error : 'Something went wrong'
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
  
          <h2 className={styles.title}>Login</h2>
          <Form className={styles.form} onSubmit={handleLogin} >
  
            <Form.Group className="mb-4" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" placeholder="Enter email" name='email' onChange={onChange} value={fields.email} />
            </Form.Group>
  
            <Form.Group className="mb-4" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter password" onChange={onChange} name='password' value={fields.password} />
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
   
  