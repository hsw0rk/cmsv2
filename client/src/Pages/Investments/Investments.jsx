import React, { useState } from 'react'
import Axios from 'axios';
import './Investments.css'
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';



const Investments = () => {
  const [principal, setprincipal] = useState('');
  const [product, setproduct] = useState('');
  const [FreshRenewal, setFreshRenewal] = useState('');
  const [pan, setpan] = useState('');
  const [mobileno, setmobileno] = useState('');
  const [customername, setcustomername] = useState('');
  const [creditbranch, setcreditbranch] = useState('');
  const [business, setbusiness] = useState('');
  const [vertical, setvertical] = useState('');
  const [employeename, setemployeename] = useState('');
  const [employeecode, setemployeecode] = useState('');


  // Onclick get what user has entered
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Using Axios to create an API that connects to the server
    Axios.post('http://localhost:8800/api/investments', {
      // Creating variable to send to server through the route
      principal: principal,
      product: product,
      FreshRenewal: FreshRenewal,
      pan: pan,
      mobileno: mobileno,
      customername: customername,
      creditbranch: creditbranch,
      business: business,
      vertical: vertical,
      employeename: employeename,
      employeecode: employeecode,
    })
    location.reload();
  }

  return (
    <>

      <div className="in-hl-inu">
        <p className="in-in-hl-inu">Investments</p>
        <p className="p-in-hl-inu">Home Loans</p>
        <p className="p-in-hl-inu">Insurance</p>
      </div>

      <div className="form-container-investments">

        <form action="" onSubmit={handleSubmit} className='forminvestments' >

          <div class="mb-1">
            <label htmlFor="principal">Product</label>
            <select className='investmentsinput' aria-descendant='' onChange={(event) => {
              setprincipal(event.target.value);
              if (event.target.value === 'Mutual Funds') {
                setproduct('');
                setFreshRenewal('');
                setcreditbranch('');
              } else if (event.target.value === 'Bonds') {
                setproduct('');
                setFreshRenewal('');
                setcreditbranch('');
              }
            }} required>
              <option value="">select</option>
              <option value="Deposits">Deposits</option>
              <option value="Mutual Funds">Mutual Funds</option>
              <option value="PMS">PMS</option>
              <option value="AIF">AIF</option>
              <option value="Bonds">Bonds</option>
            </select>
          </div>

          <div className="mb-1" style={{ display: (principal === 'Mutual Funds' || principal === 'PMS' || principal === 'AIF' || principal === 'Bonds') ? 'none' : 'block' }}>
            <label htmlFor="product">Principal</label>
            <select className='investmentsinput' aria-descendant='' disabled={(principal === 'Mutual Funds' || principal === 'PMS' || principal === 'AIF' || principal === 'Bonds')} onChange={(event) => { setproduct(event.target.value) }} required>
              <option value="">select</option>
              <option value="SFL">SFL</option>
              <option value="SHFL">SHFL</option>
              <option value="HDFC">HDFC</option>
              <option value="JM Financial Services">JM Financial Services</option>
              <option value="Edelweiss Financial Services">Edelweiss Financial Services</option>
            </select>
          </div>

          <div className="mb-1" style={{ display: principal === 'Bonds' ? 'block' : 'none' }}>
            <label htmlFor="product">Principal</label>
            <select required className='investmentsinput' aria-descendant='' disabled={principal !== 'Bonds'} onChange={(event) => { setproduct(event.target.value) }}>
              <option value="">select</option>
              <option value="JM Financial Services">JM Financial Services</option>
              <option value="Edelweiss Financial Services">Edelweiss Financial Services</option>
            </select>
          </div>

          <div className="mb-1" style={{ display: principal === 'Mutual Funds' || principal === 'PMS' || principal === 'AIF' || principal === 'Bonds' ? 'none' : 'block' }}>
            <label htmlFor="product" >Fresh / Renewal</label>
            <select required className='investmentsinput' aria-descendant='' disabled={principal === 'Mutual Funds' || principal === 'PMS' || principal === 'AIF' || principal === 'Bonds'} onChange={(event) => { setFreshRenewal(event.target.value) }}>
              <option value="">select</option>
              <option value="Fresh">Fresh</option>
              <option value="Renewal">Renewal</option>
            </select>
            {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
          </div>

          <div class="mb-1">
            <label htmlFor="pan" >PAN</label>
            <input required className='investmentsinput' type="text" aria-descendant='' maxLength={10}
              pattern="[a-z]{5}[0-9]{4}[a-z]{1}" style={{ textTransform: 'uppercase' }}
              onChange={(event) => { setpan(event.target.value) }} title="Enter a valid PAN (eg: NQUPS6703M)" />
            {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
          </div>

          <div class="mb-1">
            <label htmlFor="customername">Customername</label>
            <input required className='investmentsinput' type="text" aria-descendant=''
              onChange={(event) => { setcustomername(event.target.value) }} />
            {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
          </div>

          <div class="mb-1">
            <label htmlFor="mobileno">Mobile Number</label>
            <input required className='investmentsinput' type="text" aria-descendant='' maxLength={12}
              onChange={(event) => { setmobileno(event.target.value) }} />
            {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
          </div>


          <div className="mb-1" style={{ display: principal === 'Mutual Funds' ? 'none' : 'block' }}>
            <label htmlFor="creditbranch" >Credit Branch</label>
            <select className='investmentsinput' aria-descendant='' disabled={principal === 'Mutual Funds'} onChange={(event) => { setcreditbranch(event.target.value) }} required>
              <option value="select">select</option>
              <option ></option>
              <option ></option>
            </select>
            {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
          </div>

          <div class="mb-1">
            <label htmlFor="business">Business Amount</label>
            <input type="text" className='investmentsinput' aria-descendant='' required
              onChange={(event) => { setbusiness(event.target.value) }} />
            {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
          </div>

          <div class="mb-1">
            <input type="text" className='investmentsinput' aria-descendant='' style={{ display: 'none' }} value={'investment'}
              onChange={(event) => { setvertical(event.target.value) }} />
          </div>

          <div class="mb-1">
            <input type="text" className='investmentsinput' aria-descendant='' style={{ display: 'none' }} disabled value={''}
              onChange={(event) => { setemployeename(event.target.value) }} />
          </div>

          <div class="mb-1">
            <input type="text" className='investmentsinput' aria-descendant='' style={{ display: 'none' }} disabled value={''}
              onChange={(event) => { setemployeecode(event.target.value) }} />
          </div>


          <button type='submit' >Submit</button>
        </form>
      </div>
    </>
  )
}

export default Investments