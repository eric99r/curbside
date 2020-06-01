/* eslint-disable no-unused-vars */
import React from "react";
import { connect, useSelector } from "react-redux";
import {
  Portlet,
  PortletBody} from "../../partials/content/Portlet";
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
  Modal
} from "react-bootstrap";


function StoreInfo(props) {

  const { brandColor, dangerColor, successColor, primaryColor, modalShow } = useSelector(
    state => ({
      brandColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.brand"
      ),
      dangerColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.danger"
      ),
      successColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.success"
      ),
      primaryColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.primary"
      ),
      modalShow: false
    }))
  


  // const state = {modalShow : false,
  //             show: false,
  //             setShow: false};

  const [show, setShow] = React.useState(false);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", 
                      "Friday", "Saturday", "Sunday"]

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="row">
        <div className="col-xl-6">
          <div className="row row-full-height">
            <div className="col-lg-12">
              <Portlet className="kt-portlet--border-bottom-brand">
                <PortletBody fluid={true}>
                  {/* <!--kt-portlet--height-fluid-half--> */}

                  <div class="kt-section">
                    <span className="kt-section__sub">
                    
                      <h1>Store Information</h1>
                    </span>

                    <div className="kt-separator kt-separator--dashed"></div>

                      <Form>
                        <Form.Group controlId="exampleForm.ControlTextarea1">

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


                      Store Hours
                      <ul style={{listStyleType : "none"}}>
                      {
                        daysOfWeek.map((day)=>{
                          return <li style={{float : "left"}}><StoreHours day={day} curbside={false}></StoreHours></li>;
                        })
                      }
                      </ul>

                      <div className="kt-separator kt-separator--dashed"></div>

                      <Form.Group controlId="formBasicChecbox">
                        <Form.Check type="checkbox" label="Curbside hours different from store hours" />
                      </Form.Group>

                      Curbside Hours

                      <ul style={{listStyleType : "none"}}>
                      
                      {
                        daysOfWeek.map((day)=>{
                          return <li style={{float : "left"}}><StoreHours day={day} curbside={true}></StoreHours></li>;
                        })
                      }
                      </ul>
                      {/* <Button variant="primary" onClick={handleShow}>
                        Launch demo modal
                      </Button>

                      <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>Monday Store Hours</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                          <Form>
                            <Form.Label>Open</Form.Label>
                              <Form.Control as="select">
                                <option>Choose...</option>
                                <option>4:00pm</option>
                                <option>4:15pm</option>
                                <option>4:30pm</option>
                              </Form.Control>
                            <Form.Label>Close</Form.Label>
                              <Form.Control as="select">
                                <option>Choose...</option>
                                <option>4:00pm</option>
                                <option>4:15pm</option>
                                <option>4:30pm</option>
                              </Form.Control>
                          </Form>

                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            Close
                          </Button>
                          <Button variant="primary" onClick={handleClose}>
                            Save Changes
                          </Button>
                        </Modal.Footer>
                      </Modal> */}
                      
                  
                <div className="kt-separator kt-separator--dashed"></div>

                

                  </div>

                </PortletBody>
              </Portlet>

              <div className="kt-space-20" />

            </div>

            <div className="col-sm-12 col-md-12 col-lg-6">


              <div className="kt-space-20" />

            </div>
          </div>
        </div>

        <div className="col-xl-6">

        </div>
      </div>



      <div className="row">

      </div>


      <div className="row">

      </div>
    </>
  );
}

function mapStateToProps(state) {
  return {
//    business: state.business.store,
  }
}

export default connect(mapStateToProps)(StoreInfo);