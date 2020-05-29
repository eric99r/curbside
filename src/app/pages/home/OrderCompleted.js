import React from "react";
import { connect } from "react-redux";
import RunnerNavBar from '../../partials/content/RunnerNavBar'
import {Link} from "react-router-dom";
function OrderCompleted() {

  return (
    <>
      <div>
      <RunnerNavBar/>
        <h1>Orders Completed</h1>
        <Link to="/orderDetails?orderId=123">Order 123</Link>

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
