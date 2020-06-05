/* eslint-disable eqeqeq */
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
    super(props);

    var dayOfWeek = this.dayFromDate(this.props.orders.orders.filter((x) => x.orderNumber == 2)[0].pickupDate);

    this.state={
      day : dayOfWeek,
      timeOpen : props.business.store.curbsideHours.filter((x) => x.day == dayOfWeek)[0].timeOpen,
      timeClosed : props.business.store.curbsideHours.filter((x) => x.day == dayOfWeek)[0].timeClosed,
      pickupTimeSelection : this.props.orders.orders.filter((x) => x.orderNumber == 2)[0].pickupTime,
      pickupDateSelection : this.props.orders.orders.filter((x) => x.orderNumber == 2)[0].pickupDate,
    }
    this.thisOrder = this.props.orders.orders.filter((x) => x.orderNumber == 2)[0];

    this.handlePickupTimeSubmit = this.handlePickupTimeSubmit.bind(this);

    this.timeBuckets = this.timeBuckets();
  }

  dayFromDate(date) {
    //assumes date is in format: Monday, June 1
    //returns day: Monday

    return date.substring(0, date.indexOf(','));
  }

  handlePickupTimeSubmit(event) {

    var orderToUpdate = this.thisOrder;

    orderToUpdate.pickupTime = event.target.value;
    
    this.props.changePickupTime(orderToUpdate);

  }

  timeBucketsInRange(begin, end, timebuckets){
    let range = []
    let inRange = false
    timebuckets.forEach((bucket) => {

      if (bucket === begin)
        inRange = true;
      if (bucket === end){
        range.push(bucket);
        inRange = false;
      }
        

      if (inRange)
        range.push(bucket);

    });

    return range;
  }

  timeBuckets() {
    //increments of 15min

    //Input
    var startTime = "2000-01-01 00:00:00"
    var endTime = "2000-01-01 23:45:00"

    //Parse In
    var parseIn = function (date_time) {
      var d = new Date();
      d.setHours(date_time.substring(11, 13));
      d.setMinutes(date_time.substring(14, 16));

      return d;
    }

    //make list
    var getTimeIntervals = function (time1, time2) {
      var arr = [];
      while (time1 < time2) {

        var timeString = ""

        var pm = time1.getHours() > 11;

        var hours = (time1.getHours() % 12).toString();

        var min = time1.getMinutes().toString();

        if (min == "0")
          min = "00"

        if (hours == "0")
          hours = "12"

        var amOrPm = pm ? " PM" : " AM";

        timeString = hours.toString() + ":" + min.toString() + amOrPm;

        arr.push(timeString);

        time1.setMinutes(time1.getMinutes() + 15);
      }
      return arr;
    }

    startTime = parseIn(startTime);
    endTime = parseIn(endTime);

    var intervals = getTimeIntervals(startTime, endTime);

    return intervals;
  }

  handleDropdownSelection = (selection, dayOrTime) => {
    if (dayOrTime === "date"){
      this.setState({pickupDateSelection: selection,
                    pickupTimeSelection: null});

      var orderToUpdate = this.thisOrder;

      orderToUpdate.pickupDate = selection;
      
      this.props.changePickupTime(orderToUpdate);

      var dayOfWeek = this.dayFromDate(selection);

      this.setState({day : dayOfWeek,
                    timeOpen : this.props.business.store.curbsideHours.filter((x) => x.day == dayOfWeek)[0].timeOpen,
                    timeClosed : this.props.business.store.curbsideHours.filter((x) => x.day == dayOfWeek)[0].timeClosed});
    }
    if (dayOrTime === "time"){
      this.setState({pickupTimeSelection: selection});    
      
      var orderToUpdate = this.thisOrder;

      orderToUpdate.pickupTime = selection;
      
      this.props.changePickupTime(orderToUpdate);
    }
  }

  render(){
    
  return (
    <>
      <Card>
        <Card.Body>
          <div >
            <h1 className={"d-flex justify-content-center"}>Curbside Pickup</h1>

            <div className={"d-flex justify-content-center"}></div>

            <div className={"d-flex justify-content-center"}>
              <p className={"text-center ml-5 pt-3"}>Please schedule a time to pick up your order.</p>
            </div>

            <Form>
              <Form.Group controlId="exampleForm.ControlTextarea1">

                <Form.Label>Pickup Date</Form.Label>

                <Dropdown style={{marginLeft: "1.5em"}}>
                  <Dropdown.Toggle id="dropdown-basic">
                    {this.state.pickupDateSelection ? this.state.pickupDateSelection : "Choose..."}
                  </Dropdown.Toggle>

                  <Dropdown.Menu  style={{maxHeight: "20em", overflowY: "auto"}}>
                    <Dropdown.Item onClick={()=>this.handleDropdownSelection("Monday, June 1", "date")}>Monday, June 1</Dropdown.Item>
                    <Dropdown.Item onClick={()=>this.handleDropdownSelection("Tuesday, June 2", "date")}>Tuesday, June 2</Dropdown.Item>
                    <Dropdown.Item onClick={()=>this.handleDropdownSelection("Wednesday, June 3", "date")}>Wednesday, June 3</Dropdown.Item>
                    <Dropdown.Item onClick={()=>this.handleDropdownSelection("Thursday, June 4", "date")}>Thursday, June 4</Dropdown.Item>
                    <Dropdown.Item onClick={()=>this.handleDropdownSelection("Friday, June 5", "date")}>Friday, June 5</Dropdown.Item>
                    <Dropdown.Item onClick={()=>this.handleDropdownSelection("Saturday, June 6", "date")}>Saturday, June 6</Dropdown.Item>
                    <Dropdown.Item onClick={()=>this.handleDropdownSelection("Sunday, June 7", "date")}>Sunday, June 7</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <div className="kt-space-20" />
                <Form.Label>Pickup Time</Form.Label>

                <Dropdown style={{marginLeft: "1.5em"}}>
                  <Dropdown.Toggle id="dropdown-basic">
                    {this.state.pickupTimeSelection ? this.state.pickupTimeSelection : "Choose..."}
                  </Dropdown.Toggle>

                  <Dropdown.Menu  style={{maxHeight: "20em", overflowY: "auto"}}>
                    {this.timeBucketsInRange(this.state.timeOpen, this.state.timeClosed, this.timeBuckets).map((bucket) => {
                      return <Dropdown.Item key={bucket} onClick={()=>this.handleDropdownSelection(bucket, "time")}>{bucket}</Dropdown.Item>;
                    })}
                  </Dropdown.Menu>
                </Dropdown>

              </Form.Group>
              <div className={"d-flex justify-content-center"}>
                <Button onClick={() => { this.props.history.push('/customerWaiting') }}>Submit</Button>
              </div>
            </Form>

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

export default connect(mapStateToProps, orders.actions)(CustomerSchedule);