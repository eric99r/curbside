/* eslint-disable no-unused-vars */
import React from "react";
import { connect } from "react-redux";
import RunnerNavBar from "../../partials/content/RunnerNavBar";
import { useLocation } from "react-router-dom";
<<<<<<< HEAD
import { Button } from "react-bootstrap";
=======
import { Button} from "react-bootstrap";
import { Card } from "react-bootstrap";
>>>>>>> 943b382c9120d57bff75766c1fd15a101899657c

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function OrderDetails(props) {
<<<<<<< HEAD
  let query = useQuery();
  const { orders } = props;
  const thisOrder = props.orders.orders.filter(
    (x) => x.orderNumber == query.get("orderId")
  );
  console.log("Owner props init", props);
  console.log(thisOrder);

  return (
    <div className={"text-center"}>
      <RunnerNavBar />
      <br />

      <h1>Order {thisOrder[0].orderStatus}</h1>
      <h4>Prepared By: {thisOrder[0].preparedBy}</h4>
      <h4>Delivered By: {thisOrder[0].deliveredBy}</h4>
      <h4>Scheduled Pickup: {thisOrder[0].pickupTime}</h4>
      <h4>Time Completed: {thisOrder[0].timeCompleted}</h4>
      <br />

      <div style={{ backgroundColor: "#e6ffff" }}>
        <h2 className={"pt-3"}>Order Id: #{thisOrder[0].orderNumber}</h2>
        <h2>Name: {thisOrder[0].name}</h2>
        <h2>Arrived At: {thisOrder[0].timeArrived}</h2>
        <h2>Location: {thisOrder[0].location}</h2>
        <h2>Car: {thisOrder[0].car}</h2>
        <br />
        <h4>
          {thisOrder[0].items[0].quantity} - {thisOrder[0].items[0].itemName}
        </h4>
        <h4 className={"pb-3"}>
          {thisOrder[0].items[1].quantity} - {thisOrder[0].items[1].itemName}
        </h4>
      </div>
      <Button type="submit">(Order Detail Status)</Button>
    </div>
  );
=======
    let query = useQuery();
    // eslint-disable-next-line eqeqeq 
    const thisOrder = props.orders.orders.filter(x => x.orderNumber == query.get("orderId"))[0]
    console.log("Order Details props init", props);     
    console.log(thisOrder)
  
    const orderItems = thisOrder.items.map((item) => {
        return (
          <Card key={item.itemName}>
            <Card.Body>
              <div>
                  <h4>{item.quantity} - {item.itemName}</h4>
              </div>
            </Card.Body>
          </Card>
        );
      });

    return (
        
            <div>
                <RunnerNavBar />
                <br/>

                <h1>Order {thisOrder.orderStatus}</h1>
                {thisOrder.preparedBy && <h4>Prepared By: {thisOrder.preparedBy}</h4> } 
                {thisOrder.deliveredBy && <h4>Delivered By: {thisOrder.deliveredBy}</h4>}
                <h4>Scheduled Pickup: {thisOrder.pickupTime}</h4>
                {thisOrder.timeCompleted && <h4>Time Completed: {thisOrder.timeCompleted}</h4>}

                <br/>

                <div style={{ backgroundColor: "#e6ffff" }}>
                              <h2>Order Id #{thisOrder.orderNumber}</h2>
                <h2>{thisOrder.name}</h2>
                {thisOrder.timeArrived && <h2>Arrived At: {thisOrder.timeArrived}</h2>}
                {thisOrder.location && <h2>Location: {thisOrder.location}</h2>}
                {thisOrder.car && <h2>Car: {thisOrder.car}</h2>}

                <br/>
                
                {thisOrder.items && 
                  <ul style={{listStyleType : "none"}}>                      
                      { orderItems }
                  </ul>
                }
                </div>
                <Button type="submit">{thisOrder.orderStatus}</Button>

            </div>
        
    );
>>>>>>> 943b382c9120d57bff75766c1fd15a101899657c
}

function mapStateToProps(state) {
  return {
    orders: state.orders,
  };
}

export default connect(mapStateToProps)(OrderDetails);
