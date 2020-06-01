import React from "react";
import { connect } from "react-redux";
import RunnerNavBar from "../../partials/content/RunnerNavBar";
import { Button } from "react-bootstrap";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import { Card } from "react-bootstrap";

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
            <Button type="submit">{thisOrder.orderStatus}</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    orders: state.orders,
  };
}

export default connect(mapStateToProps)(OrderSearch);
