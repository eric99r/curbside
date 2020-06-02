import React from "react";
import {
  makeStyles,
  BottomNavigation,
  BottomNavigationAction,
} from "@material-ui/core/";

import ListIcon from "@material-ui/icons/List";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    width: "auto",
  },
});

export default function LabelBottomNavigation() {
  const classes = useStyles();
  const [value, setValue] = React.useState("recents");
  let history = useHistory();

  function handleChange(event, newValue) {
    history.push(`${newValue}`);
    setValue(newValue);
  }

  return (
    <div>
      <BottomNavigation
        value={value}
        onChange={handleChange}
        className={classes.root}
      >
        <BottomNavigationAction
          value="orderQueue"
          icon={<ListIcon />}
          className={"pl-5"}
        />
        <BottomNavigationAction
          value="orderPrepared"
          icon={<LocalMallIcon />}
        />
        <BottomNavigationAction
          value="orderRunning"
          icon={<DirectionsRunIcon />}
        />
        <BottomNavigationAction
          value="orderCompleted"
          icon={<CheckCircleOutlineIcon />}
        />
        <BottomNavigationAction
          value="orderSearch"
          icon={<PhotoCameraIcon />}
          className={"pr-5"}
        />
      </BottomNavigation>
    </div>
  );
}
