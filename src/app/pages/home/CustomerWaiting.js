/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React, {Component} from "react";
import { connect } from "react-redux";
import {
  Portlet,
  PortletBody
} from "../../partials/content/Portlet";
import { Button, Form, Card } from "react-bootstrap";

import "../../../custom.scss";
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

class CustomerWaiting extends Component{
  constructor(props) {
    super(props);

    this.state={}
    this.thisOrder = this.props.orders.orders.filter((x) => x.orderNumber == 2)[0];

    this.handleSubmitClick = this.handleSubmitClick.bind(this);
  }

  handleSubmitClick(){
    console.log(orderToUpdate);
    var orderToUpdate = this.thisOrder;
    orderToUpdate.customerPhase = "arrival";
    this.props.changeCustomerPhase(orderToUpdate);
    console.log(orderToUpdate);
    this.props.history.push('/customerArrival');
  }

  render(){
    
  return (
    <>
      <Card>
        <Card.Body>
          <div >
            <h1 className={"d-flex justify-content-center"}>Curbside Pickup</h1>

            <div style={{marginLeft: "0px!important"}}>

            <div className={"d-flex justify-content-center"}>
              <h2 className={"text-center ml-5 pt-3"}>Thank you for scheduling your order!</h2>
            </div>

            <div className={"d-flex justify-content-center"}>
              <div>
              <h3 className={"text-center ml-5 pt-3"}>Pickup details:</h3>
              <h4 className={"text-center ml-5 pt-3"}>{"Date: " + this.thisOrder.pickupDate}</h4>
              <h4 className={"text-center ml-5 pt-3"}>{"Time: " + this.thisOrder.pickupTime}</h4>
              <h4 className={"text-center ml-5 pt-3"}>{"Location: College Station, TX"}</h4>
              </div>

            </div>

            <div  className={"d-flex justify-content-center"}></div>

            <div  className={"d-flex justify-content-center"}>
              <Button style={{marginTop: "2rem"}} className={"d-flex justify-content-center"} onClick={this.handleSubmitClick}>
                Click here when you've arrived.
              </Button>
            </div>
            </div>

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

export default connect(mapStateToProps, orders.actions)(CustomerWaiting);