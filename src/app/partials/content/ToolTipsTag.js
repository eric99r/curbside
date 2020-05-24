import React from 'react';
import Popover from '@material-ui/core/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import Box from '@material-ui/core/Box';
import HelpIcon from '@material-ui/icons/Help';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
export default function ToolTipsTag(props) {
  return (
    <PopupState variant="popover" popupId="demo-popup-popover">
      {(popupState) => (
        <>
          {
            (props.iconname === "home" ?
              (<HelpIcon {...bindTrigger(popupState)} />) :
              (<InfoIcon {...bindTrigger(popupState)} />))
          }
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <Box p={2}>
              {
                props.tooltiptext.split('<br/>').map((i, key) => {
                  return (
                    <Typography key={key}>{i}</Typography>
                  )
                })
              }
            </Box>
          </Popover>
        </>
      )}
    </PopupState>
  );

}

