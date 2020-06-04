/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import { connect } from "react-redux";
import StoreHours from "./StoreHours";
import { Form } from "react-bootstrap";

import {
  Card
} from "react-bootstrap";

class StoreInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      orderId: 0
    }
    this.storeHours = props.business.store.storeHours;
    this.curbsideHours = props.business.store.curbsideHours;
    this.daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday",
      "Friday", "Saturday", "Sunday"]
  }

  render() {
    return (
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
                  <option>{this.props.business.store.location}</option>
                </Form.Control>
                <div className="kt-space-20" />
                <Form.Label>Sub-Location</Form.Label>
                <Form.Control as="select">
                  <option>Choose...</option>
                  <option>{this.props.business.store.curbsideLocation}</option>
                </Form.Control>

              </Form.Group>
            </Form>

            <div className={"d-flex justify-content-center"}>
              <h2 className={"text-center"}>Store Hours</h2>
            </div>
            <div className={"d-flex justify-content-center"}>
              <table style={{ width: "100%" }}>
                <tbody>
                <tr>
                  <th className={"text-center"}>Day</th>
                  <th className={"text-center"}>Open</th>
                  <th className={"text-center"}>Close</th>
                </tr>
                {

                  this.daysOfWeek.map((day) => {
                    return <StoreHours key={day} day={day} curbside={false} 
                    storeHours={this.storeHours.filter(x => x.day === day)[0]} />
                  })
                }
                </tbody>
              </table>

            </div>
            <div className="kt-space-20" />

            <Form.Group className={"d-flex justify-content-center"} controlId="formBasicChecbox">
              <Form.Check type="checkbox" label="Curbside hours different from store hours" />
            </Form.Group>

            <div className={"d-flex justify-content-center"}>
              <h2 className={"text-center"}>Curbside Hours</h2>
            </div>
            <div className={"d-flex justify-content-center"}>
              <table style={{ width: "100%" }}>
                <tbody>
                <tr>
                  <th className={"text-center"}>Day</th>
                  <th className={"text-center"}>Open</th>
                  <th className={"text-center"}>Close</th>
                </tr>
                {
                  this.daysOfWeek.map((day) => {
                    return <StoreHours key={day} day={day} curbside={true} 
                    storeHours={this.curbsideHours.filter(x => x.day === day)[0]} />
                  })
                }
                </tbody>
              </table>
            </div>

          </div>

        </Card.Body>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    business: state.business,
    orders: state.orders
  };
}


export default connect(mapStateToProps)(StoreInfo);
