import { useLocation } from 'react-router-dom';
import './Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
  const { employeename } = location.state;

  return (
    <div>
      <p className='username'>{employeename}</p>

      
          <Link to={'/investments'}>
          <p className='investments'>Investments</p>
          </Link>
      
      <p className='loans'>Loans</p>
      <p className='insurance'>Insurance</p>
    </div>
  );
};

export default Dashboard;