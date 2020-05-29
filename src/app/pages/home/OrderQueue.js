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
        tag="a"
        onClick={() => history.push("/orderDetails?orderId=" + order.orderId)}
      >
        <Card.Body>
          <div>
            <Card.Text>
              {order.pickupTime} {"Order:#" + order.orderNumber} {order.name}
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
