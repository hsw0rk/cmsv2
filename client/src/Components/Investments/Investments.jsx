import React, { useState } from 'react';
import axios from 'axios';
import './Investments.css'

function Investments() {
  const [formData, setFormData] = useState({
    name: '',
    product: '',
    principal: '',
    customername: '',
    pan: '',
    mobileno: '',
    creditbranch: '',
    business: '',
    vertical: '',
    employeename: '',
    employeecode: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/investments', formData);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Investments</h2>
      <form className='center-form' onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} required/>
        </div>
        <div>
          <label>Product:</label>
          <input type="text" name="product" value={formData.product} onChange={handleInputChange} required/>
        </div>
        <div>
          <label>Principal:</label>
          <input type="text" name="principal" value={formData.principal} onChange={handleInputChange} required/>
        </div>
        <div>
          <label>Customer Name:</label>
          <input type="text" name="customername" value={formData.customername} onChange={handleInputChange} required/>
        </div>
        <div>
          <label>PAN:</label>
          <input type="text" name="pan" value={formData.pan} onChange={handleInputChange} required/>
        </div>
        <div>
          <label>Mobile No:</label>
          <input type="text" name="mobileno" value={formData.mobileno} onChange={handleInputChange} required/>
        </div>
        <div>
          <label>Credit Branch:</label>
          <input type="text" name="creditbranch" value={formData.creditbranch} onChange={handleInputChange} required/>
        </div>
        <div>
          <label>Business:</label>
          <input type="text" name="business" value={formData.business} onChange={handleInputChange} required/>
        </div>
        <div>
          <label>Vertical:</label>
          <input type="text" name="vertical" value={formData.vertical} onChange={handleInputChange} required/>
        </div>
        <div>
          <label>Employee Name:</label>
          <input type="text" name="employeename" value={formData.employeename} onChange={handleInputChange} required/>
        </div>
        <div>
          <label>Employee Code:</label>
          <input type="text" name="employeecode" value={formData.employeecode} onChange={handleInputChange} required/>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Investments;
