import React, { useMemo, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import database from "../../database.json";

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
        <p style={{ textAlign: "center" }}>Orders in Queue</p>
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
