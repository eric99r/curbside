import React from "react";
import { connect } from "react-redux";
import RunnerNavBar from "../../partials/content/RunnerNavBar";
import { Button } from "react-bootstrap";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import { Card } from "react-bootstrap";
import * as orders from "../../store/ducks/order.duck";

function OrderSearch(props) {
  let id = 1;
  const thisOrder = props.orders.orders.filter((x) => x.orderNumber === id)[0];

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
    <div>
      <RunnerNavBar />
      <br />
      <div className={"text-center"} style={{ color: "gray" }}>
        <h1>Search Order!</h1>
        <br />

        <input placeholder="Order ID #" type="text" name="orderId" />
        <h2>OR</h2>
        <PhotoCameraIcon style={{ width: "50px", height: "50px" }} />

        {thisOrder.orderNumber && (
          <div
            style={{ backgroundColor: "#e6ffff", color: "black" }}
            className={"d-flex flex-column"}
          >
            <h1 className={"pt-3"}>Order {thisOrder.orderStatus}</h1>
            {thisOrder.preparedBy && (
              <h4>Prepared By: {thisOrder.preparedBy}</h4>
            )}
            {thisOrder.deliveredBy && (
              <h4>Delivered By: {thisOrder.deliveredBy}</h4>
            )}
            <h4>Scheduled Pickup: {thisOrder.pickupTime}</h4>
            {thisOrder.timeCompleted && (
              <h4>Time Completed: {thisOrder.timeCompleted}</h4>
            )}

            <br />

            <h2>Order Id: #{thisOrder.orderNumber}</h2>
            <h2>Name: {thisOrder.name}</h2>
            {thisOrder.timeArrived && (
              <h2>Arrived At: {thisOrder.timeArrived}</h2>
            )}
            {thisOrder.location && <h2>Location: {thisOrder.location}</h2>}
            {thisOrder.car && <h2>Car: {thisOrder.car}</h2>}

            <br />

            {thisOrder.items && <ul className={"mr-5"}>{orderItems}</ul>}
          </div>
        )}
        {thisOrder.orderNumber && (
          <div className={"p-4"}>
      <UpdateOrderStatusButton thisOrder={thisOrder} event={props} />
          </div>
        )}
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

export default connect(mapStateToProps, orders.actions)(OrderSearch);
