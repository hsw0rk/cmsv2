import React from 'react';
import './RightBar.scss'
import OverallList from '../Components/overall-list/OverallList';
import RevenueList from '../Components/revenue-list/RevenueList';

const DashboardWrapperRight = () => {
  return (
    <div className='dashboard-wrapper__right'>
      <div className="title mb">Overall</div>
  <div className="mb">
    <OverallList />
  </div>
  <div className="title mb">Revenue by channel</div>
  <div className="mb">
    <RevenueList />
  </div>
    </div>
  );
};

export default DashboardWrapperRight;

// // usage
// <DashboardWrapperRight>
  
// </DashboardWrapperRight>
