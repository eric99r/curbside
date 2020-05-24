import React from "react";
import { CircularProgress } from "@material-ui/core";
import { toAbsoluteUrl } from "../../../_metronic";

class SplashScreen extends React.Component {
  render() {
    return (
      <>
        <div className="kt-splash-screen">
        <img src={toAbsoluteUrl("/media/logos/advanced-online-logo.png")}
          alt="Advanced-Online logo" />
        <CircularProgress className="kt-splash-screen__spinner" />
        </div>
      </>
    );
  }
}

export default SplashScreen;
