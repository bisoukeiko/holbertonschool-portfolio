import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
import User from './User';
import Child from './Child';


function Home() {
  const { userId } = useUser();

  return (
    <div className='container mt-4'> {/* Bootstrapのコンテナを追加 */}

      {/* 横並びにするためのrowとcolを追加 */}
      <div className='row justify-content-center'>
        <div className='col-md-4'> {/* 画面幅の半分を使用 */}
          <User />
        </div>
        <div className='col-md-4'> {/* 画面幅の半分を使用 */}
          <Child />
        </div>
      </div>
    </div>
  )
}

export default Home