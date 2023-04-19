import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
  const { username, email } = location.state;

  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <p>Your email is: {email}</p>
    </div>
  );
};

export default Dashboard;