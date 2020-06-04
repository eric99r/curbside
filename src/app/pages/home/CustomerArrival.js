/* eslint-disable no-unused-vars */
import { connect, useSelector } from "react-redux";
import {
  Portlet,
  PortletBody
} from "../../partials/content/Portlet";
import { metronic } from "../../../_metronic";
import React, {Component} from "react";
import * as businesses from "../../store/ducks/business.duck";
import * as orders from "../../store/ducks/order.duck";

import { Button, Form, Card } from "react-bootstrap";

import {
  Dropdown,
  FormControl,
  ButtonGroup,
  DropdownButton,
  SplitButton,
  ButtonToolbar
} from "react-bootstrap";

class CustomerArrival extends Component{
  constructor(props) {
    console.log(props);
    console.log(2288);
    super(props);
    // this.state = {
      
    // };
    this.thisOrder = this.props.orders.orders.filter((x) => x.orderNumber == 2)[0];
    //this.thisOrder = props.orders.orders.filter((x)=>{x.orderNumber==2})[0];

    this.handleCustomerArrived = this.handleCustomerArrived.bind(this);
  }

  handleCustomerArrived(event) {

    var orderToUpdate = this.thisOrder;

    orderToUpdate.arrived = true;
    console.log(this.props);
    
    this.props.customerArrived(orderToUpdate);

  }
  render() {
  return (
    <>
      <Card>
        <Card.Body>
          {/* <!--kt-portlet--height-fluid-half--> */}

          <div class="kt-section">
            <span classname="kt-section__sub">

              <h1 className={"d-flex justify-content-center"}>Curbside Pickup</h1>
              <div className={"d-flex justify-content-center"}>
                <p >Your order is ready!</p>
              </div>
              <div className={"d-flex justify-content-center"}>
                <p >Please park and give us some details about how to find you.</p>
              </div>
            </span>
            <div className={"d-flex justify-content-center"}>
              <Form style={{width: "80%"}}>
                <Form.Group controlId="exampleForm.ControlTextarea1">

                  <Form.Label>What model/color is your car?</Form.Label>
                  <Form.Control  as="textarea" rows="3" />
                  <div className="kt-space-20" />
                  <Form.Label>Where are you waiting?</Form.Label>
                  <Form.Control as="textarea" rows="3" />
                </Form.Group>
                <div className={"d-flex justify-content-center"}>
                  <Button onClick={this.handleCustomerArrived}>I'm here!</Button>
                </div>
              </Form>
            </div>

            <div className="kt-separator kt-separator--dashed"></div>

            <h2>Order Summary</h2>

            <h3>Math Textbook</h3>
            <h3>History Textbook</h3>

          </div>

        </Card.Body>
      </Card>







    </>
  );
}
}

function mapStateToProps(state) {
  return {
    business: state.business,
    orders: state.orders
  };
}

export default connect(mapStateToProps, orders.actions)(CustomerArrival);