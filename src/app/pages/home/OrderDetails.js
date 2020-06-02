/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { connect } from "react-redux";
import RunnerNavBar from "../../partials/content/RunnerNavBar";
import { useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Card } from "react-bootstrap";
import * as orders from "../../store/ducks/order.duck";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}


function OrderDetails(props) {
  let query = useQuery();
  const thisOrder = props.orders.orders.filter(
    // eslint-disable-next-line eqeqeq
    (x) => x.orderNumber == query.get("orderId")
  )[0];

  const orderItems = thisOrder.items.map((item) => {
    return (
      <Card key={item.itemName}>
        <Card.Body>
          <div>
            <h4>
              {item.quantity} - {item.itemName}
            </h4>
          </div>
        </Card.Body>
      </Card>
    );
  });

  return (
    <div className={"text-center"} style={{ color: "gray" }}>
      <RunnerNavBar />
      <br />

      <h1>Order {thisOrder.orderStatus}</h1>
      {thisOrder.preparedBy && <h4>Prepared By: {thisOrder.preparedBy}</h4>}
      {thisOrder.deliveredBy && <h4>Delivered By: {thisOrder.deliveredBy}</h4>}
      <h4>Scheduled Pickup: {thisOrder.pickupTime}</h4>
      {thisOrder.timeCompleted && (
        <h4>Time Completed: {thisOrder.timeCompleted}</h4>
      )}

      <br />

      <div
        style={{ backgroundColor: "#e6ffff", color: "black" }}
        className={"d-flex flex-column"}
      >
        <h2 className={"pt-3"}>Order Id: #{thisOrder.orderNumber}</h2>
        <h2> Name: {thisOrder.name}</h2>
        {thisOrder.timeArrived && <h2>Arrived At: {thisOrder.timeArrived}</h2>}
        {thisOrder.location && <h2>Location: {thisOrder.location}</h2>}
        {thisOrder.car && <h2>Car: {thisOrder.car}</h2>}

        <br />

        {thisOrder.items && <ul className={"mr-5"}>{orderItems}</ul>}
      </div>
      <UpdateOrderStatusButton thisOrder={thisOrder} event={props} />
      <div className={"p-4"}>
      </div>
    </div>
  );
}

const handleStatusClick = (order, nav, props) => {
  order.thisOrder.orderStatus = nav;
  return order.event.changeOrderStatus(order.thisOrder);
}

const UpdateOrderStatusButton = (thisOrder, event) => {

  switch (thisOrder.thisOrder.orderStatus) {
    case 'In Queue':
      return <Button onClick={() => { handleStatusClick(thisOrder, 'Prepared', event) }}>Order Prepared!</Button>;
    case 'Prepared':
      return <Button onClick={() => { handleStatusClick(thisOrder, 'Running', event) }}>On My Way!</Button>;
    case 'Running':
      return (
        <div>
          <Button onClick={() => { handleStatusClick(thisOrder, 'Delivered', event) }}>Order Delivered!</Button>;
          <br />
          <br />
          <Button onClick={() => { handleStatusClick(thisOrder, 'Prepared', event) }}>Can't Find Customer!</Button>;
        </div>
      )
    case 'Delivered':
      return null;
    default:
      console.log(thisOrder.order)
      return <p>Order status not recognized</p>
  }
}


function mapStateToProps(state) {
  return {
    orders: state.orders,
  };
}

export default connect(mapStateToProps, orders.actions)(OrderDetails);
