import React, { useState } from 'react'
import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import axios from "../src/Services/axio";
import { ToastContainer, toast } from 'react-toastify';
import { Alert } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/bootstrap-datetimepicker.min.css';
import './css/font-awesome.min.css';
import './css/magnific-popup.css';
import './css/owl.theme.css';
import './css/owl.carousel.css';
import './css/style.css';
import 'react-toastify/dist/ReactToastify.css';


var _ = require('lodash');




function App() {

  let [vehicleCat, setVehicleCat] = useState([]);
  let [vehicles, setVehicles] = useState([]);
  let [branch, setBranch] = useState([]);
  let [bookingCount, setBookingsCount] = useState([]);
  let [bookings, setBookings] = useState([]);
  let [bookingMsg, setBookingMsg] = useState(false);

  const [isLogged, setIsLogged] = useState(false)
  const [id, setId] = useState('');
  const [firstName, setfName] = useState('');
  const [lastName, setlName] = useState('');
  const [contact, setContact] = useState('');
  const [nic, setNic] = useState('');
  const [distance, setDistance] = useState(0);
  const [loggedUser, setLoggedUser] = useState({});

  const [email, setEmail] = useState('');
  let [branchId, setBranchId] = useState();
  let [catId, setCatId] = useState();
  const [show, setShow] = useState(false);

  const [loginUsername, setLoginUserName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [smShow, setSmShow] = useState(false);
  const [lgShow, setLgShow] = useState(false);

  const [showAlert, setShowAlert] = useState(true);

  React.useEffect(() => {

    axios.get('/vehicle_cat/view-all')
      .then(res => {

        console.log("res");
        console.log(res.data.data);
        setVehicleCat(res.data.data);
      })
      .catch((error) => {
      })

    axios.get('/vehicle/view-all')
      .then(res => {

        console.log("res");
        console.log(res.data.data);
        setVehicles(res.data.data);
      })
      .catch((error) => {
      })

    axios.get('/branch/view-all')
      .then(res => {

        console.log("res");
        console.log(res.data.data);
        setBranch(res.data.data);
      })
      .catch((error) => {
      })

    axios.get('/booking/view-all')
      .then(res => {

        console.log("res");
        console.log(res.data.data);
        setBookingsCount(res.data.data.length);
        setBookings(res.data.data);
      })
      .catch((error) => {
      })



  }, []);

  const handleValidation = (event) => {
    let formIsValid = false;

    return formIsValid;
  };

  const handelSubmitLogin = (e) => {
    console.log("Hits");

    try {

      var form = new FormData();
      form.append("username", loginUsername);
      form.append("password", loginPassword);

      var settings = {
        "url": "http://localhost:8080/api/v1/go-cheeta/customer/login",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
      };

      $.ajax(settings).done(function (response) {
        console.log(response);
        setIsLogged(true);
      });

      if (isLogged) {
        setShow(false);



      }

      axios.get('/user/view-cust')
        .then(res => {

          console.log("res");
          setLoggedUser(_.find(res.data.data, { 'nic': loginUsername }))
          console.log(loggedUser);

        })
        .catch((error) => {
        })

      console.log("isLogged");
      console.log(isLogged);


    } catch (error) {
      console.log(error)
    }

  };

  const handelSubmit = (e) => {

    var vehicle = _.find(vehicles, { 'vehicle_id': catId });
    console.log("vehicle");
    console.log(vehicle);
    var total = distance * vehicle.vehicle_price;

    const bookingObj = {
      reservation_number: bookingCount,
      duration: distance,
      customer_id: loggedUser.user_id,
      amount: total,
      vehicle_id: catId,
      driver_id: "",
      branch_id: branchId
    };

    console.log("obj");
    console.log(bookingObj);

    axios.post('/booking/save', bookingObj)
      .then((res) => {
        console.log("res");
        console.log(res);
        if (res.data.code === 200) {
          toast("Wow so easy!");
          setfName("");
          setlName("");
          setEmail("");
          setContact("");
          setNic("");
          setDistance("");
          setBranchId("");
          setCatId("");

        } else {

          toast.warn("Some thing has occured please contact the administrator.", { position: toast.POSITION.TOP_RIGHT })
        }

      }).catch((error) => {
        toast.warn("Some thing has occured please contact the administrator.", { position: toast.POSITION.TOP_RIGHT })
      })

  }


  return (

    <div className="App">



      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Booking Summery
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>Booking Reference</th>
                <th>Distance (Km)</th>
                <th className='text-end'>Amount (Rs/Km)</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((option) => (
                     <tr>
                     <td>{option.reservation_number}</td>
                     <td>{option.duration}</td>
                     <td className='text-end'>{option.amount}.00</td>
                   </tr>
              ))}
         
        
            </tbody>
          </Table>

        </Modal.Body>
      </Modal>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Login To GoCheeta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label htmlFor="inputPassword5">NIC</Form.Label>
          <Form.Control
            onChange={e => setLoginUserName(e.target.value)}
            type="text"
            id="inputPassword5"
            aria-describedby="passwordHelpBlock"
          />
          <Form.Label htmlFor="inputPassword5">Password</Form.Label>
          <Form.Control
            onChange={e => setLoginPassword(e.target.value)}
            type="password"
            id="inputPassword5"
            aria-describedby="passwordHelpBlock"
          />
          <Form.Text id="passwordHelpBlock" muted>
            <small>
              Your password must be 8-20 characters long, contain letters and numbers,
              and must not contain spaces, special characters, or emoji.
            </small>

          </Form.Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={e => handelSubmitLogin(e)}>Login</Button>
        </Modal.Footer>
      </Modal>

      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home"><a href="index.html" class="navbar-brand">Go <span>Cheeta</span></a> </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home" class="smoothScroll">Home</Nav.Link>
            <Nav.Link href="#booking" class="smoothScroll">Reserve</Nav.Link>
            <Nav.Link href="#cars" class="smoothScroll">Cars</Nav.Link>
            <Nav.Link href="#team" class="smoothScroll">Contact us</Nav.Link>
            {!isLogged && <Nav.Link href="#login" className="smoothScroll profile" onClick={handleShow} >Login</Nav.Link>}
            {isLogged && <Nav.Link href="#login" className="smoothScroll profile" onClick={() => setLgShow(true)}>My Bookings {nic}</Nav.Link>}
          </Nav>
        </Container>
      </Navbar>
      <div id="home" class="parallax-section">
        <div class="container">
          <div class="row">
            <div class="slide-text">
              <h3>What we offer? <a href="#" class="typewrite" data-period="2000" data-type='[ "Car Rental", "Special Rates", "One Way Rental", "City to City", "Free Rides" ]'> <span class="wrap"></span> </a> </h3>
              <h1>Welcome to GoCheeta</h1>
              <p>We are providing a good qulity service for the customers.</p>
              <a href="#team" class="btn btn-default section-btn" id='booking'> Get Started</a> </div>
          </div>
        </div>
      </div>

      <div class="container" >
        <div class="bformBox" >
          <h3>BOOK YOUR CAR TODAY!</h3>

          <form method="POST">
            <div className='row'>
              <Form.Group className="mb-3 col-md-4">
                <Form.Label className='lables'>Customer First Name</Form.Label>
                <Form.Control placeholder="" onChange={e => setfName(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3 col-md-4">
                <Form.Label className='lables'>Customer Last Name</Form.Label>
                <Form.Control placeholder="" onChange={e => setlName(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3 col-md-4" >
                <Form.Label className='lables'>Customer Email</Form.Label>
                <Form.Control placeholder="" onChange={e => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3 col-md-6">
                <Form.Label className='lables'>Customer Contact</Form.Label>
                <Form.Control placeholder="" onChange={e => setContact(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3 col-md-6">
                <Form.Label className='lables'>Customer Nic</Form.Label>
                <Form.Control placeholder="" onChange={e => setNic(e.target.value)} />
              </Form.Group>
            </div>
            <div className='row'>
              <Form.Group className="mb-3 col-md-4">
                <Form.Label className='lables'>Distance (Km)</Form.Label>
                <Form.Control placeholder="" onChange={e => setDistance(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3 col-md-4">
                <Form.Label>Select Location</Form.Label>
                <Form.Select onClick={e => setBranchId(e.target.value)}>
                  <option value=""  >Select Your Location</option>
                  {branch.map((option) => (
                    <option value={option.code} >{option.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3 col-md-4">
                <Form.Label>Select Vehicle</Form.Label>
                <Form.Select onClick={e => setCatId(e.target.value)}>
                  <option value="" >Select Your Car For Booking</option>
                  {vehicles.map((option) => (
                    <option value={option.vehicle_id} >{option.vehicle_name} ({option.vehicle_number})</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
            {bookingMsg && <p className='mt-3 text-success'>Booking Saved successfully...!</p>}

            {!isLogged && <Button variant="dark" className='mt-3' disabled>Find Rider & Make a booking</Button>}
            {isLogged && <Button variant="dark" className='mt-3' onClick={e => handelSubmit(e)}>Find Rider & Make a booking</Button>}
          </form>
        </div>
      </div>


      <div class="parallax-section" id="cars">
        <div class="container">
          <div class="section-title">
            <h3>Vehicle Models <span>For Rent</span></h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquet, massa ac ornare feugiat, nunc dui auctor ipsum, sed posuere eros sapien id quam. Maecenas odio nisi, efficitur eget</p>
          </div>
          <div class="vehiclesList">
            <ul class="carsmodals">
              <li class="item">
                <div class="row">
                  <div class="col-md-3">
                    <h3>BMW 3-SERIES</h3>
                    <div class="subtitle">ModernLine</div>
                    <div class="carPrice"> <strong>RS 100.00</strong> <span>/Day</span> </div>
                    <a href="#" class="btn"><i class="fa fa-calendar" aria-hidden="true"></i> Reserve Now</a> </div>
                  <div class="col-md-6"><a href="images/cars/01.jpg" class="image-popup"><img src={require('./images/cars/01.jpg')} /></a></div>
                  <div class="col-md-3">
                    <div class="carinfo">
                      <ul>
                        <li>Doors: <strong>4</strong></li>
                        <li>Passengers: <strong>5</strong></li>
                        <li>Luggage: <strong>2 Bags</strong></li>
                        <li>Transmission: <strong>Automatic</strong></li>
                        <li>Air conditioning: <strong>Dual Zone</strong></li>
                        <li>Minimum age: <strong>35 years</strong></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>


      <div id="counter">
        <div class="container">
          <div class="row">
            <div class="col-md-3 col-sm-3 col-xs-12 counter-item">
              <div class="counterbox">
                <div class="counter-icon"><i class="fa fa-users" aria-hidden="true"></i></div>
                <span class="counter-number" data-from="1" data-to="499" data-speed="1000"></span> <span class="counter-text">Happy Client</span> </div>
            </div>
            <div class="col-md-3 col-sm-3 col-xs-12 counter-item">
              <div class="counterbox">
                <div class="counter-icon"><i class="fa fa-car" aria-hidden="true"></i></div>
                <span class="counter-number" data-from="1" data-to="199" data-speed="2000"></span> <span class="counter-text">Cars</span> </div>
            </div>
            <div class="col-md-3 col-sm-3 col-xs-12 counter-item">
              <div class="counterbox">
                <div class="counter-icon"><i class="fa fa-map-signs" aria-hidden="true"></i></div>
                <span class="counter-number" data-from="1" data-to="50" data-speed="3000"></span> <span class="counter-text">Destinations</span> </div>
            </div>
            <div class="col-md-3 col-sm-3 col-xs-12 counter-item">
              <div class="counterbox">
                <div class="counter-icon"><i class="fa fa-trophy" aria-hidden="true"></i></div>
                <span class="counter-number" data-from="1" data-to="199" data-speed="4000"></span> <span class="counter-text">Awards</span> </div>
            </div>
          </div>
        </div>
      </div>

      <div id="team" class="parallax-section">
        <div class="container">

          <div class="section-title" >
            <h3>Customer <span>Suport</span> Center</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquet, massa ac ornare feugiat, nunc dui auctor ipsum, sed posuere eros sapien id quam. Maecenas odio nisi, efficitur eget.</p>
          </div>
          <div class="row">
            <div class="col-md-3 col-sm-6" >
              <div class="team-thumb">
                <div class="thumb-image"><img src={require('./images/team/team-img1.jpg')} /></div>
                <h4>Sophia DOE</h4>
                <h5>Support Manager</h5>
                <div class="contct"><i class="fa fa-phone" aria-hidden="true"></i> +1-123-456-7890</div>
                <div class="contct"><i class="fa fa-envelope-o" aria-hidden="true"></i> joseph@example.com</div>
              </div>
            </div>

            <div class="col-md-3 col-sm-6" >
              <div class="team-thumb">
                <div class="thumb-image"><img src={require('./images/team/team-img2.jpg')} /></div>
                <h4>Emily DOE</h4>
                <h5>Support Manager</h5>
                <div class="contct"><i class="fa fa-phone" aria-hidden="true"></i> +1-123-456-7890</div>
                <div class="contct"><i class="fa fa-envelope-o" aria-hidden="true"></i> joseph@example.com</div>
              </div>
            </div>

            <div class="col-md-3 col-sm-6" >
              <div class="team-thumb">
                <div class="thumb-image"><img src={require('./images/team/team-img3.jpg')} /></div>
                <h4>Olivia DOE</h4>
                <h5>Support Manager</h5>
                <div class="contct"><i class="fa fa-phone" aria-hidden="true"></i> +1-123-456-7890</div>
                <div class="contct"><i class="fa fa-envelope-o" aria-hidden="true"></i> joseph@example.com</div>
              </div>
            </div>

            <div class="col-md-3 col-sm-6" >
              <div class="team-thumb">
                <div class="thumb-image"><img src={require('./images/team/team-img4.jpg')} /></div>
                <h4>MARTIN DOE</h4>
                <h5>Support Manager</h5>
                <div class="contct"><i class="fa fa-phone" aria-hidden="true"></i> +1-123-456-7890</div>
                <div class="contct"><i class="fa fa-envelope-o" aria-hidden="true"></i> joseph@example.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <div class="container">
          <div class="socialLinks" > <a href="#"><i class="fa fa-facebook" aria-hidden="true"></i></a> <a href="#"><i class="fa fa-twitter" aria-hidden="true"></i></a> <a href="#"><i class="fa fa-linkedin" aria-hidden="true"></i></a> <a href="#"><i class="fa fa-google-plus" aria-hidden="true"></i></a> <a href="#"><i class="fa fa-behance" aria-hidden="true"></i></a> </div>
          <div class="row">
            <div class="col-md-12 col-sm-12">
              <div class="footer-copyright">
                <p>&copy; 2021 Go Cheeta | All Rights Reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
