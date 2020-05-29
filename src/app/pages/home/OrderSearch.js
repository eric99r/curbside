import React from "react";
import { connect } from "react-redux";
import RunnerNavBar from '../../partials/content/RunnerNavBar'
import { Button } from "react-bootstrap";
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';

function OrderCompleted() {

  return (
    <>
      <div>
      <RunnerNavBar />
                <br/>

                <h1>Search Order!</h1>
                <br/>

                <input placeholder="Order ID #" type="text" name="orderId" />
                <h2>OR</h2>
                <PhotoCameraIcon style={{ width: '50px', height: '50px' }}/>

                <div style={{ backgroundColor: "#e6ffff" }}>
                <h2>Order id #(id)</h2>
                <h2>(Student Name)</h2>

                <br/>
                <h4>1 English 141</h4>
                <h4>1 Calculus 370</h4>
                </div>
                <Button type="submit">(Order Detail Status)</Button>

      </div>
    </>
  );
}

function mapStateToProps(state) {
  return {
    //order: state.order.orders,
  };
}

export default connect(mapStateToProps)(OrderCompleted);
