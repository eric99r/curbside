/* eslint-disable no-unused-vars */
import React, {Component} from "react";
import { connect } from "react-redux";
import {
  Portlet,
  PortletBody
} from "../../partials/content/Portlet";
import { Button, Form, Card } from "react-bootstrap";

import * as businesses from "../../store/ducks/business.duck";
import * as orders from "../../store/ducks/order.duck";

import {
  Dropdown,
  FormControl,
  ButtonGroup,
  DropdownButton,
  SplitButton,
  ButtonToolbar
} from "react-bootstrap";

class CustomerSchedule extends Component{
  constructor(props) {
    console.log(props);
    console.log(222);
    super(props);
    // this.state = {
      
    // };
    this.thisOrder = this.props.orders.orders.filter((x) => x.orderNumber == 2)[0];
    //this.thisOrder = props.orders.orders.filter((x)=>{x.orderNumber==2})[0];

    this.handlePickupTimeSubmit = this.handlePickupTimeSubmit.bind(this);
  }

  handlePickupTimeSubmit(event) {

    var orderToUpdate = this.thisOrder;

    orderToUpdate.pickupTime = event.target.value;
    console.log(this.props);
    
    this.props.changePickupTime(orderToUpdate);

  }


  render(){
    console.log(this.props);
    console.log(99);
  return (
    <>
      <Card>
        <Card.Body>
          <div >
            <p>{this.thisOrder.orderStatus}</p>
            <h1 className={"d-flex justify-content-center"}>Curbside Pickup</h1>

            <div className={"d-flex justify-content-center"}>
              
            </div>

            <div className={"d-flex justify-content-center"}>
              <p className={"text-center ml-5 pt-3"}>Please schedule a time to pick up your order.</p>
            </div>

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
                <Form.Control as="select" onChange={this.handlePickupTimeSubmit}>
                  <option>Choose...</option>
                  <option>4:00pm</option>
                  <option>4:15pm</option>
                  <option>4:30pm</option>
                </Form.Control>
              </Form.Group>
              <div className={"d-flex justify-content-center"}>
                <Button onClick={() => { this.props.history.push('/customerArrival') }}>Submit</Button>
              </div>
            </Form>

            <div className="kt-separator kt-separator--dashed"></div>
            
              <h2>Order Summary</h2>

              {/* <h3>Math Textbook</h3>
              <h3>History Textbook</h3> */}

              {this.thisOrder.items.map((x)=> {

                  return <h3>{x.itemName}</h3>

              })}


          </div>


          <div className="kt-space-20" />


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

export default connect(mapStateToProps, orders.actions)(CustomerSchedule);