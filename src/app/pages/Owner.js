import React, { useMemo } from "react";
import { useSelector } from "react-redux";

export default function Owner() {
    return(
        <div>
            <div className="row">
            Runner
      </div>
      <br/>

            <div className="row">
                <div className="col-xl-4">
                    Column 1
        </div>
                <div className="col-xl-4">
                    Column 2
        </div>
                <div className="col-xl-4">
                    Column 3
        </div>
            </div>
        </div>
    );
}
