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
  // eslint-disable-next-line eqeqeq
  // const thisOrder = props.orders.orders.filter(
  //   (x) => x.orderNumber == query.get("orderId")
  // )[0];
  console.log('props load')
  console.log(props)
  let data = Array.from(props.orders.orders);
  console.log('list load')
  console.log(data)
  const thisOrder = data.filter(x => x.orderNumber === 1)[0]
  console.log('order load')
  console.log(thisOrder)

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

      <div className={"p-4"}>
        <Button onClick={handleStatusClick(thisOrder, 'Prepared', props)}>Prepared</Button>
      </div>
    </div>
  );
}

const handleStatusClick = (order, nav, props) => {
  console.log('button click order')
  console.log(order)

  console.log('button click nav')
  console.log(nav)

  console.log('button click props')
  console.log(props)

  order.orderStatus = nav;
  props.changeOrderStatus(order);
}

const UpdateOrderStatusButton = (thisOrder) => {
  console.log('render button')
  console.log(thisOrder)
  //console.log(props)
  switch (thisOrder.thisOrder.orderStatus) {
    case 'Queue':
      return <Button onClick={handleStatusClick(thisOrder, 'Prepared')}>Order Prepared</Button>;
    case 'Prepared':
    //  return <Button  onClick={handleStatusClick(props, thisOrder, 'Running')}>On My Way!</Button>;
    case 'Running':
    //   return (
    //     <div>
    //       <Button onClick={handleStatusClick(props, thisOrder, 'Completed')}>Delivered!</Button>;
    //       <br/>
    //       <br/>
    // /     <Button onClick={handleStatusClick(props, thisOrder, 'Prepared')}>Can't Find Customer!</Button>;
    //     </div>
    //   )
    case 'Completed':
      return null;
    default:
      console.log(thisOrder.order)
      return <p>failed to load button</p>
  }
}


function mapStateToProps(state) {
  return {
    orders: state.orders,
  };
}

export default connect(mapStateToProps, orders.actions)(OrderDetails);
