import React from "react";
import { connect } from "react-redux";
import database from "../../database.json";
import RunnerNavBar from '../../partials/content/RunnerNavBar'

function OrderQueue() {
  const order = database.orders;
  const allorders = order.map((order) => {
    return (
      <li style={{ listStyleType: "none" }}>
        <div
          className="col-sm-12 col-md-2 col-lg-8"
          style={{ backgroundColor: "lightblue" }}
        >
          {order.pickupTime}
          {order.orderNumber}
          {order.name}
        </div>
      </li>
    );
  });
  return (
    <>
      <div>
      <RunnerNavBar/>

      <h1>Orders in Queue</h1>
        <ul>{allorders}</ul>
      </div>
    </>
  );
}

function mapStateToProps(state) {
  return {
    //order: state.order.orders,
  };
}

export default connect(mapStateToProps)(OrderQueue);
