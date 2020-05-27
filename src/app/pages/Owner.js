import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import data from '../database.json'
var owner = data.owner;



//

export default function Owner() {
    return (
        <div>
            <div className="row" >
                <p className="btn-success" >
                    {owner.name}
                </p>

            </div>
            <br />

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
