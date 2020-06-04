import React, { useEffect } from "react";
import { connect } from "react-redux";
import RunnerNavBar from "../../partials/content/RunnerNavBar";
import { Card } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import * as order from "../../store/ducks/order.duck";
import "../../../custom.scss";
function OrderPrepared(props) {
  const history = useHistory();
  const { order } = props;

  const orders = order.orders.filter(
    (status) => status.orderStatus === "Prepared"
  );

  useEffect(() => {
  }, [order, order.lastUpdated]);

  const allorders = orders.map((order) => {
    return (
      <Card
        key={order.orderNumber}
        tag="a"
        onClick={() =>
          history.push("/orderDetails?orderId=" + order.orderNumber)
        }
      >
        <Card.Body className={order.arrived ? "order-arrived" : ""}>
          <div className={"d-flex" }>
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
          Orders Prepared
        </h1>
        <ul>{allorders}</ul>
      </div>
    </>
  );
}

function mapStateToProps(state) {
  return {
    order: state.orders,
  };
}

export default connect(mapStateToProps, order.actions)(OrderPrepared);
