/* eslint-disable no-unused-vars */
import { connect, useSelector } from "react-redux";
import {
  Portlet,
  PortletBody
} from "../../partials/content/Portlet";
import { metronic } from "../../../_metronic";
import React, {Component} from "react";
import "../../../custom.scss";
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
    super(props);
    this.state = {
      arrivedLocation: "",
      carDescription: "",
      arrivedTime: ""
    };
    this.thisOrder = this.props.orders.orders.filter((x) => x.orderNumber == 2)[0];
    this.handleCustomerArrived = this.handleCustomerArrived.bind(this);
    this.handleArrivedLocationChange = this.handleArrivedLocationChange.bind(this);
    this.handleCarDescriptionChange = this.handleCarDescriptionChange.bind(this);
  }

  handleCustomerArrived(event) {
    var orderToUpdate = this.thisOrder;

    orderToUpdate.arrived = true;
    orderToUpdate.location = this.state.arrivedLocation;
    orderToUpdate.car = this.state.carDescription;
    
    this.props.customerArrived(orderToUpdate);

  }

  handleArrivedLocationChange(event) {

    this.setState({arrivedLocation: event.target.value});

  }

  handleCarDescriptionChange(event) {

    this.setState({carDescription: event.target.value});

  }

  render() {
  return (
    <>
      <Card>
        <Card.Body>
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
                  <Form.Control  as="textarea" rows="3" onChange={this.handleCarDescriptionChange}/>
                  <div className="kt-space-20" />
                  <Form.Label>Where are you waiting?</Form.Label>
                  <Form.Control as="textarea" rows="3" onChange={this.handleArrivedLocationChange}/>
                </Form.Group>
                <div className={"d-flex justify-content-center"}>
                  <Button onClick={this.handleCustomerArrived}>I'm here!</Button>
                </div>
              </Form>
            </div>

            <div className="kt-separator kt-separator--dashed"></div>

            
            <div>
              <h2>Order Summary:</h2>
              <h4>{"Order ID: " + this.thisOrder.orderNumber}</h4>
              <h4>{"Name: " + this.thisOrder.name}</h4>

              {this.thisOrder.items.map((x)=> {

                  return <h6>{x.itemName}</h6>

              })}
            </div>

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