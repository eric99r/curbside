/* eslint-disable no-unused-vars */
import React from "react";
import { connect, useSelector } from "react-redux";
import {
  Portlet,
  PortletBody} from "../../partials/content/Portlet";
import { metronic } from "../../../_metronic";

import { Button, Form } from "react-bootstrap";

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
      <div className="row">
        <div className="col-xl-6">
          <div className="row row-full-height">
            <div className="col-lg-12">
              <Portlet className="kt-portlet--border-bottom-brand">
                <PortletBody fluid={true}>
                  {/* <!--kt-portlet--height-fluid-half--> */}

                  <div class="kt-section">
                    <span classname="kt-section__sub">
                    
                      <h1>Curbside Pickup</h1>
                      Order status:
                      <br/>
                      Ready in 1 hour!
                      <br/>
                      (5:00pm)
                    </span>

                    <div className="kt-separator kt-separator--dashed"></div>

                      <Form>
                        <Form.Group controlId="exampleForm.ControlTextarea1">

                          <Form.Label>Pickup Date</Form.Label>
                          <Form.Control as="select">
                            <option>Choose...</option>
                            <option>Monday, June 1</option>
                            <option>Tuesday, June 2</option>
                            <option>Wednesday, June 3</option>
                          </Form.Control>

                          <Form.Label>Pickup Time</Form.Label>
                          <Form.Control as="select">
                            <option>Choose...</option>
                            <option>4:00pm</option>
                            <option>4:15pm</option>
                            <option>4:30pm</option>
                          </Form.Control>

                          <Form.Label>What model/color is your car?</Form.Label>
                          <Form.Control as="textarea" rows="3" />

                          <Form.Label>Where are you waiting?</Form.Label>
                          <Form.Control as="textarea" rows="3" />
                        </Form.Group>
                        <Button type="submit">I'm here!</Button>
                      </Form>
                  
                <div className="kt-separator kt-separator--dashed"></div>

                    <h2>Order Summary</h2>

                    <h3>Math Textbook</h3>
                    <h3>History Textbook</h3>

                  </div>

                </PortletBody>
              </Portlet>

              <div className="kt-space-20" />

            </div>

            <div className="col-sm-12 col-md-12 col-lg-6">


              <div className="kt-space-20" />

            </div>
          </div>
        </div>

        <div className="col-xl-6">

        </div>
      </div>



      <div className="row">

      </div>


      <div className="row">

      </div>
    </>
  );
}

function mapStateToProps(state) {
  return {
//    business: state.business.store,
  }
}

export default connect(mapStateToProps)(Customer);