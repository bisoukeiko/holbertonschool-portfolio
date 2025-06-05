import { useUser } from '../Contexts/UserContext';
import Child from '../Components/Child';
import home_3 from '../assets/home/home_3.jpg';


function Home() {
  const { userId } = useUser();

  return (
    <div className='container mt-4'>

    <div className='row text-center g-0'>
      <div className='col'>
        {!userId && (
          <img src={home_3} className="img-fluid w-100" alt="" />
        )}
      </div>
    </div>
    <div className='row g-0'>

        {/* <div className='col-md-4'>
        {userId && (
          <User />
        )}
        </div> */}
        <div className='col'>
        {userId && (
          <Child />
        )}
        </div>

      </div>
    </div>

  )
}

export default Home