/* eslint-disable no-unused-vars */
import React from "react";
import { connect, useSelector } from "react-redux";
import {
  Portlet,
  PortletBody
} from "../../partials/content/Portlet";
import { metronic } from "../../../_metronic";

import { Button, Form, Card } from "react-bootstrap";

import {
  Dropdown,
  FormControl,
  ButtonGroup,
  DropdownButton,
  SplitButton,
  ButtonToolbar
} from "react-bootstrap";

function Customer() {
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
          {/* <!--kt-portlet--height-fluid-half--> */}

          <div class="kt-section">
            <span classname="kt-section__sub">

              <h1 className={"d-flex justify-content-center"}>Curbside Pickup</h1>
              <div className={"d-flex justify-content-center"}>
                <p >Your order is ready!</p>
              </div>
            </span>

            <div className="kt-separator kt-separator--dashed"></div>
            <div className={"d-flex justify-content-center"}>
              <Form>
                <Form.Group controlId="exampleForm.ControlTextarea1">

                  <Form.Label>What model/color is your car?</Form.Label>
                  <Form.Control as="textarea" rows="3" />

                  <Form.Label>Where are you waiting?</Form.Label>
                  <Form.Control as="textarea" rows="3" />
                </Form.Group>
                <div className={"d-flex justify-content-center"}>
                  <Button type="submit">I'm here!</Button>
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

function mapStateToProps(state) {
  return {
    //    business: state.business.store,
  }
}

export default connect(mapStateToProps)(Customer);