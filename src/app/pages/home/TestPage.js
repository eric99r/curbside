/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as business from "../../store/ducks/business.duck";

function TestPage(props) {
  const { business } = props;

  useEffect(() => {
    console.log("TestPage props init", props);
    props.changeOwner("test");
    props.editStoreHours(
      {
        day: "Sunday",
        timeClosed: "5:55 PM",
        timeOpen: "5:00 AM",
        willNotOpen: false
      })
    props.editCurbsideHours("Sunday", "9:55 PM");
  }, []);

  useEffect(() => {
    console.log("After state update", business);
  }, [business, business.lastUpdated]);


  return (
      <div>
        <p>{props.business.store.id}</p>
        <p>{business.store.owner}</p>
        <p>{business.store.location}</p>
        <p>{business.store.curbsideLocation}</p>
      </div>
  );
}

function mapStateToProps(state) {
  return {
    business: state.business,
  }
}

export default connect(mapStateToProps, business.actions)(TestPage);