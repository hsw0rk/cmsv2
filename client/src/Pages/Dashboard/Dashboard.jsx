import './Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {

  return (
    <div>

      <div className="d-in-hl-inu">
        <Link to={'/investments'}><p className="p-in-hl-inu">Investments</p></Link>
        <p className="p-in-hl-inu">Home Loans</p>
        <p className="p-in-hl-inu">Insurance</p>
        <p className="p-in-hl-inu">Order Book</p>
      </div>


    </div>
  );
};

export default Dashboard;