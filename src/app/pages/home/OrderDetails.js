import React, { useEffect } from "react";
import { connect } from "react-redux";
import RunnerNavBar from '../../partials/content/RunnerNavBar'
import { useLocation } from "react-router-dom";
import { Button} from "react-bootstrap";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}
function OrderDetails(props) {
    let query = useQuery();
    const { orders } = props;
    const thisOrder = props.orders.orders.filter(x => x.orderNumber == query.get("orderId"))
    console.log("Owner props init", props);     
    console.log(thisOrder)
  

    return (
            <div>

                <RunnerNavBar />
                <br/>

                <h1>Order {thisOrder[0].orderStatus}</h1>
                <h4>Prepared By: {thisOrder[0].preparedBy}</h4>
                <h4>Delivered By: {thisOrder[0].deliveredBy}</h4>
                <h4>Scheduled Pickup: {thisOrder[0].pickupTime}</h4>
                <h4>Time Completed: {thisOrder[0].timeCompleted}</h4>
                <br/>

                <div style={{ backgroundColor: "#e6ffff" }}>
                <h2>Order Id #{thisOrder[0].orderNumber}</h2>
                <h2>{thisOrder[0].name}</h2>
                <h2>Arrived At: {thisOrder[0].timeArrived}</h2>
                <h2>Location: {thisOrder[0].location}</h2>
                <h2>Car: {thisOrder[0].car}</h2>
                <br/>
                <h4>{thisOrder[0].items[0].quantity} - {thisOrder[0].items[0].itemName}</h4>
                <h4>{thisOrder[0].items[1].quantity} - {thisOrder[0].items[1].itemName}</h4>
                </div>
                <Button type="submit">(Order Detail Status)</Button>

            </div>
        
    );
}

function mapStateToProps(state) {
    return {
        orders: state.orders,
    };
}

export default connect(mapStateToProps)(OrderDetails);
