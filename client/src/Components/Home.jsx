import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
import User from './User';
import Child from './Child';
import home_3 from '../assets/home/home_3.jpg';


function Home() {
  const { userId } = useUser();

  return (
    <div className='container mt-4'>

    <div className='row text-center g-0'>
      <div className='col'>
        <img src={home_3} className="img-fluid w-50" alt="" />
      </div>
    </div>
    <div className='row justify-content-center g-0'>

        <div className='col-md-4'>
        {userId && (
          <User />
        )}
        </div>
        <div className='col-md-4'>
        {userId && (
          <Child />
        )}
        </div>

      </div>
    </div>

  )
}

export default Home