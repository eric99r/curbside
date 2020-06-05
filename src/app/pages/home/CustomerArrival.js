/* eslint-disable eqeqeq */
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
      arrivedTime: "",
      submitted: false
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

    this.setState({submitted: true});

  }

  handleArrivedLocationChange(event) {

    this.setState({arrivedLocation: event.target.value});

  }

  handleCarDescriptionChange(event) {

    this.setState({carDescription: event.target.value});

  }

  orderStatusDescription(orderStatus) {
    switch(orderStatus){
      case "In Queue":
      case "Prepared":
        return "Your order will be ready soon.";

      case "Running":
        return "Your order is ready! We're on our way to deliver it to you.";

      case "Delivered":
        return "We've delivered you your order. Thank you for shopping with us!";

      default:
        return "";

    }

  }

  render() {
  return (
    <>
      <Card>
        <Card.Body>
          <div className="kt-section">
            <span className="kt-section__sub">

              <h1 className={"d-flex justify-content-center"}>Curbside Pickup</h1>

              </span>
              {this.state.submitted ? 
              
              <div>
                <div style={{marginTop: "1rem"}} className={"d-flex justify-content-center"}>
                  <h3 className={"text-center"}>Thank you!</h3>
                </div>
                <div className={"d-flex justify-content-center"}></div>
                <div style={{marginTop: "5rem", marginBottom: "5rem"}} className={"d-flex justify-content-center"}>
                  <h5 className={"text-center"}>
                    {
                      this.orderStatusDescription(this.thisOrder.orderStatus)
                    }
                  </h5>
                </div>
              </div>
              
              :

              <div>
              <div className={"d-flex justify-content-center"}>
                <p >Please park and give us some details about how to find you.</p>
              </div>
            
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
            </div>  
          }

            <div className="kt-separator kt-separator--dashed"></div>

            
            <div>
              <h2>Order Summary:</h2>
              <h4>{"Order ID: " + this.thisOrder.orderNumber}</h4>
              <h4>{"Name: " + this.thisOrder.name}</h4>

              {this.thisOrder.items.map((x)=> {

                  return <h6 key={x.itemName}>{x.itemName}</h6>

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