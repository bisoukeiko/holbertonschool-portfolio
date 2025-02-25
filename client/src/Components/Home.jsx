import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
import User from './User';
import Child from './Child';


function Home() {
  const { userId } = useUser();

  return (
    <div className='container mt-4'>

      <div className='row justify-content-center g-0'>
        <div className='col-md-4'>
          <User />
        </div>
        <div className='col-md-4'>
          <Child />
        </div>
      </div>
    </div>

  )
}

export default Home