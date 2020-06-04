/* eslint-disable eqeqeq */

import { Button, Form, Modal } from "react-bootstrap";

/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import { connect, useSelector } from "react-redux";
import * as businesses from "../../store/ducks/business.duck";

class StoreHours extends Component {

  //export default function StoreHours(props) {

  constructor(props) {
    super(props);
    this.day = props.day;
    this.curbsideHours = props.curbside;
    this.state = {
      business: props.business,
      show: false,
    }
    this.closeHours = React.createRef();
    this.openHours = React.createRef();

 
  }

  timeBuckets() {
    //increments of 15min

    //Input
    var startTime = "2000-01-01 04:30:00"
    var endTime = "2000-01-01 23:30:00"

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

        var amOrPm = pm ? "pm" : "am";

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


  render() {
    const timeBuckets = this.timeBuckets();

    const setShow = (x) => 
    { 
      this.setState({ show: x }) 
    };

    let handleSave = (event) => {
      if(this.props.curbside){
        const dayData = this.props.business.store.curbside.filter((x) => x.day === this.props.day)[0]
        if(this.openHours.current.value !== "Choose...")
          dayData.timeOpen = this.openHours.current.value;

          if(this.closeHours.current.value !== "Choose...")
          dayData.timeClosed = this.closeHours.current.value;

        this.props.editCurbsideHours(dayData)

      }
      else{
        const dayData = this.props.business.store.storeHours.filter((x) => x.day === this.props.day)[0];       
        if(this.openHours.current.value !== "Choose...")
        dayData.timeOpen = this.openHours.current.value;

        if(this.closeHours.current.value !== "Choose...")
        dayData.timeClosed = this.closeHours.current.value;

        this.props.editStoreHours(dayData)

      }
      setShow(false);
    }

    let handleClose = () => setShow(false);
    let handleShow = () => setShow(true);

    return (
      <tr>
        <td>

          <div>
            <Button variant="primary" onClick={handleShow} className={"w-100 p-3"}>
              {this.props.day}
            </Button>

            <Modal show={this.state.show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>
                  {this.props.day}
                  {this.props.curbside ? " Curbside " : " Store "}
                            Hours
                          </Modal.Title>
              </Modal.Header>
              <Modal.Body>

                <Form>
                  <Form.Label>Open</Form.Label>
                  <Form.Control as="select" ref={this.openHours} >
                    <option>Choose...</option>
                    {timeBuckets.map((bucket) => {
                      return <option key={bucket}>{bucket}</option>;
                    })
                    }
                  </Form.Control>
                  <Form.Label>Close</Form.Label>
                  <Form.Control as="select" ref={this.closeHours} >
                    <option>Choose...</option>
                    {timeBuckets.map((bucket) => {
                      return <option key={bucket}>{bucket}</option>;
                    })
                    }
                  </Form.Control>
                </Form>

              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} >
                  Close
                          </Button>
                <Button variant="primary" onClick={handleSave} >
                  Save Changes
                          </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </td>

        <td className={"text-center"}>
          {this.props.storeHours.timeOpen}
        </td>

        <td className={"text-center"}>
        {this.props.storeHours.timeClosed}
        </td>
      </tr>
    );
  }

}
function mapStateToProps(state) {
  return {
    business: state.business,
    days: state.business.store.storeHours,
    orders: state.orders
  };
}


export default connect(mapStateToProps, businesses.actions)(StoreHours);
