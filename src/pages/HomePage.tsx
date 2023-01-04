import {
  useEffect,
  useState
} from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/usePrivateRoute';
import authStore from '../store/authStore';
  
export default function HomePage()
{
    
  const [user, setUser] = useState<String>();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  
  // zustand state
  const auth = authStore((state: any) => state.auth);
  
  useEffect(() => {
    if (auth.isLoggedIn)
    {
      let isMounted = true;
      const controller = new AbortController();
      

      const getUsers = async () =>
      {
        try {
          const response = await axiosPrivate.get('/private',
            {
              signal: controller.signal

            });
          console.log(response.data);
          isMounted && setUser(response.data.user.name);
        }
        catch (err)
        {
            console.error(err);
            navigate('/login');
        }
      }

      getUsers();
  
      return () => {
        isMounted = false;
        controller.abort();
      }
        
    }
  }, []);
  
  
  return (
    <>
      <div>
        <h3>
          Welcome
        </h3>

        <h3>
          {user && user}
        </h3>
      </div>
    </>
  )
}
  
  