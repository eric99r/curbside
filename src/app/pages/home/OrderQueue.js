import React from "react";
import { connect } from "react-redux";
import database from "../../database.json";
import RunnerNavBar from "../../partials/content/RunnerNavBar";
import { Card } from "react-bootstrap";
import { useHistory } from "react-router-dom";

function OrderQueue(props) {
  const order = database.orders;
  const history = useHistory();
  const allorders = order.map((order) => {
    return (
      <Card
        key={order.orderNumber}
        tag="a"
        onClick={() =>
          history.push("/orderDetails?orderId=" + order.orderNumber)
        }
      >
        <Card.Body>
          <div className={"d-flex"}>
            <Card.Text className={"mr-5"} style={{ color: "gray" }}>
              {order.pickupTime}
            </Card.Text>
            <Card.Text className={"ml-5"} style={{ color: "blue" }}>
              {"#" + order.orderNumber}
            </Card.Text>

            <Card.Text className={"ml-auto"} style={{ color: "blue" }}>
              {order.name}
            </Card.Text>
          </div>
        </Card.Body>
      </Card>
    );
  });
  return (
    <>
      <div>
        <RunnerNavBar />

        <h1 className={"text-center ml-5 pt-3"} style={{ color: "gray" }}>
          Orders in Queue
        </h1>
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
