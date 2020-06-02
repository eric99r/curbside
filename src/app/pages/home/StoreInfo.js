/* eslint-disable no-unused-vars */
import React from "react";
import { connect, useSelector } from "react-redux";
import {
  Portlet,
  PortletBody} from "../../partials/content/Portlet";
  import * as order from "../../store/ducks/storeinfo.duck";
import { metronic } from "../../../_metronic";
import StoreHours from "./StoreHours";
import { Form } from "react-bootstrap";

import {
  Dropdown,
  FormControl,
  ButtonGroup,
  DropdownButton,
  SplitButton,
  ButtonToolbar,
  Modal,
  Card
} from "react-bootstrap";


function StoreInfo(props) {

  
  const { order } = props;

  const storeHours = props.business.store.storeHours;
  const curbsideHours = props.business.store.curbsideHours;

  console.log(storeHours);
  console.log(props);
  console.log(222);

  // const state = {modalShow : false,
  //             show: false,
  //             setShow: false};

  const [show, setShow] = React.useState(false);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", 
                      "Friday", "Saturday", "Sunday"]



  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  console.log(storeHours.filter((x) => x.day == "Monday"));
  return (
            <>
                  {/* <!--kt-portlet--height-fluid-half--> */}

                  {/* <div className="kt-section">
                    <span className="kt-section__sub"> */}
                                      
                  <Card>
                    <Card.Body>
                    <div>
                      <span>
                      <h1 className={"text-center ml-5 pt-3"}>Store Information</h1>
                    </span>


                      <Form>
                        <Form.Group >

                          <Form.Label>Location</Form.Label>
                          <Form.Control as="select">
                            <option>Choose...</option>
                            <option>Dominican University</option>
                            <option>Knox College</option>
                          </Form.Control>

                          <Form.Label>Sub-Location</Form.Label>
                          <Form.Control as="select">
                            <option>Choose...</option>
                            <option>Main Str</option>
                            <option>By the cafeteria</option>
                          </Form.Control>

                        </Form.Group>
                      </Form>

                      {/* Store Hours
                      <ul style={{listStyleType : "none"}}>
                      {
                        daysOfWeek.map((day)=>{ 
                          return  <li key={day} style={{float : "left"}}><StoreHours key={day} day={day} curbside={false} /></li>
                        })
                      }
                      </ul> */}

                      <div className={"d-flex justify-content-center"}>
                      <h2 className={"text-center"}>Store Hours</h2>
                      </div>
                      <div className={"d-flex justify-content-center"}>
                      <table style={{width: "100%"}}>
                        <tr>
                          <th className={"text-center"}>Day</th>
                          <th className={"text-center"}>Open</th>
                          <th className={"text-center"}>Close</th>
                        </tr>
                      {
                        
                        daysOfWeek.map((day)=>{ 
                          return  <tr key={day} >
                                    <td className={"text-center"}> <StoreHours key={day} day={day} curbside={false} /> </td>
                                    <td className={"text-center"}> {  storeHours.filter((x) => x.day === day)[0].timeOpen} </td>
                                    <td className={"text-center"}> {  storeHours.filter((x) => x.day === day)[0].timeClosed} </td>
                                  </tr>
                        })
                      }
                      </table>

                      </div>
                      <div className="kt-space-20" />

                      <Form.Group className={"d-flex justify-content-center"} controlId="formBasicChecbox">
                        <Form.Check type="checkbox" label="Curbside hours different from store hours" />
                      </Form.Group>

                      {/* Curbside Hours

                      <ul style={{listStyleType : "none"}}>                      
                      {
                        daysOfWeek.map((day)=>{
                          return <li key={day}  style={{float : "left"}}><StoreHours key={day} day={day} curbside={true} /></li>
                        })
                      }
                      </ul> */}

                      <div className={"d-flex justify-content-center"}>
                      <h2 className={"text-center"}>Curbside Hours</h2>
                      </div>
                      <div className={"d-flex justify-content-center"}>
                      <table style={{width: "100%"}}>
                        <tr>
                          <th className={"text-center"}>Day</th>
                          <th className={"text-center"}>Open</th>
                          <th className={"text-center"}>Close</th>
                        </tr>
                      {
                        
                        daysOfWeek.map((day)=>{ 
                          return  <tr key={day} >
                                    <td className={"text-center"}> <StoreHours key={day} day={day} curbside={true} /> </td>
                                    <td className={"text-center"}> {  storeHours.filter((x) => x.day === day)[0].timeOpen} </td>
                                    <td className={"text-center"}> {  storeHours.filter((x) => x.day === day)[0].timeClosed} </td>
                                  </tr>
                        })
                      }
                      </table>
                      </div>
                      
                  </div>



</Card.Body>
</Card>



    </>
  );
}

// function mapStateToProps(state) {
//   return {
//     business: state.store,
//   }
// }

// export default connect(mapStateToProps, "")(StoreInfo);
function mapStateToProps(state) {

  console.log(state);
  console.log(333);

  return {
    business: state.business,
    orders: state.orders
  };
}


export default connect(mapStateToProps)(StoreInfo);
