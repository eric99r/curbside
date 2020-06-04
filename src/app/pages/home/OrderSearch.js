/* eslint-disable eqeqeq */
import React, {Component} from "react";
import { connect } from "react-redux";
import RunnerNavBar from "../../partials/content/RunnerNavBar";
import { Button } from "react-bootstrap";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import { Card } from "react-bootstrap";
import * as orders from "../../store/ducks/order.duck";

class OrderSearch extends Component{
  constructor(props) {
    super(props);
    this.state = {
     filterCriteria: ''
   }
  }

render(){
  // eslint-disable-next-line eqeqeq
  const thisOrder = this.props.orders.orders.filter((x) => {
    const query = this.state.filterCriteria;
    if(query == ''){
    return(x.name === query)
    }                                                    
    return (
      x.name.toLowerCase().indexOf(query) >= 0 ||
      x.orderNumber == query
    )
  });    
  return (
    <div>
      <RunnerNavBar />
      <br />
      <div className={"text-center"} style={{ color: "gray" }}>
        <h1>Search Order!</h1>
        <br />

        <input type='alpha'
          value={this.state.filterCriteria ? this.state.filterCriteria : ''} 
          onChange={event => this.setState({ filterCriteria: event.target.value })}/>

        <h2>OR</h2>
        <PhotoCameraIcon style={{ width: "50px", height: "50px" }} />

        {thisOrder[0] && <Details thisOrder={thisOrder[0]} event={this.props} />}
        


      </div>
    </div>
  );
}
}
const Details = (order, event) => {
  const thisOrder = order.thisOrder;
  const orderItems = <h1> </h1>;

  if(thisOrder){
    // eslint-disable-next-line no-unused-vars
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
  }
  return(
  <div>
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
      <UpdateOrderStatusButton thisOrder={thisOrder} event={order.event} />
    </div>
  )}
    </div>
  )
}

const handleStatusClick = (order, nav, event) => {
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
    orders: state.orders
  };
}

export default connect(mapStateToProps, orders.actions)(OrderSearch);
