import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
import User from "./User";
import Child from "./Child";
import Todo from "./Todo";

function Home() {
  const { userId } = useUser();

  return (
    <div>
      <h1>Home</h1>
      {userId ? (
        <p>Welcome, user with ID: {userId}</p>
      ) : (
        <p>Please log in to access the content.</p>  // ログインしていない場合のメッセージ
      )}

      <User />
      <Child />
      {/* <Todo /> */}
    </div>
  )
}

export default Home