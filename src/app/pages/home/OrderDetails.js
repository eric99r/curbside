import React from "react";
import { connect } from "react-redux";
import RunnerNavBar from '../../partials/content/RunnerNavBar'
import { useLocation } from "react-router-dom";
import { Button} from "react-bootstrap";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}
function OrderDetails() {
    let query = useQuery();

    return (
        <>
            <div>

                <RunnerNavBar />
                <br/>

                <h1>Order (Status)!</h1>
                <h4>Prepared By: (Runner)</h4>
                <h4>Delivered By: (Runner)</h4>
                <h4>Scheduled Pickup: (Time)</h4>
                <h4>Time Completed: (Time)</h4>
                <br/>

                <div style={{ backgroundColor: "#e6ffff" }}>
                <h2>Order id #{query.get("orderId")}</h2>
                <h2>(Student Name)</h2>
                <h2>Arrived At: (Time)</h2>
                <h2>Location: (Location)</h2>
                <h2>Car: (Car Info)</h2>
                <br/>
                <h4>1 English 141</h4>
                <h4>1 Calculus 370</h4>
                </div>
                <Button type="submit">(Order Detail Status)</Button>

            </div>
        </>
    );
}

function mapStateToProps(state) {
    return {
        //order: state.order.orders,
    };
}

export default connect(mapStateToProps)(OrderDetails);
