/* eslint-disable no-unused-vars */
import React from "react";
import { connect, useSelector } from "react-redux";
import {
  Portlet,
  PortletBody
} from "../../partials/content/Portlet";
import { metronic } from "../../../_metronic";
//import { browserHistory } from './react-router'
//import { push } from 'react-router-redux';
import { Button, Form, Card } from "react-bootstrap";

import {
  Dropdown,
  FormControl,
  ButtonGroup,
  DropdownButton,
  SplitButton,
  ButtonToolbar
} from "react-bootstrap";

function Customer(props) {
  const { brandColor, dangerColor, successColor, primaryColor } = useSelector(
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
      )
    })
  );


  return (
    <>
      <Card>
        <Card.Body>
          <div >

            <h1 className={"d-flex justify-content-center"}>Curbside Pickup</h1>

            <div className={"d-flex justify-content-center"}>
              <p className={"text-center ml-5 pt-3"}>Please schedule a time to pick up your order.
                      </p>
            </div>

            {/* <Form action="/customerArrival"> */}
            <Form>
              <Form.Group controlId="exampleForm.ControlTextarea1">

                <Form.Label>Pickup Date</Form.Label>
                <Form.Control as="select">
                  <option>Choose...</option>
                  <option>Monday, June 1</option>
                  <option>Tuesday, June 2</option>
                  <option>Wednesday, June 3</option>
                </Form.Control>
                <div className="kt-space-20" />
                <Form.Label>Pickup Time</Form.Label>
                <Form.Control as="select">
                  <option>Choose...</option>
                  <option>4:00pm</option>
                  <option>4:15pm</option>
                  <option>4:30pm</option>
                </Form.Control>
              </Form.Group>
              <div className={"d-flex justify-content-center"}>
                <Button
                  onClick={() => { props.history.push('/customerArrival') }}>Submit</Button>
              </div>
            </Form>

            <div className="kt-separator kt-separator--dashed"></div>

            <h2>Order Summary</h2>

            <h3>Math Textbook</h3>
            <h3>History Textbook</h3>

          </div>


          <div className="kt-space-20" />


        </Card.Body>
      </Card>


    </>
  );
}

function mapStateToProps(state) {
  return {
    //    business: state.business.store,
  }
}

export default connect(mapStateToProps)(Customer);