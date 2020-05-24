import React, { Component } from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import { TextField } from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../../store/ducks/auth.duck";

const divStyle = {
  textAlign: 'left'
   
};
class PasswordChangeConfirmationPage extends Component {
      
    
    render() {
        return (
        <div className="kt-grid__item kt-grid__item--fluid  kt-grid__item--order-tablet-and-mobile-1  kt-login__wrapper">
        <div className="kt-login__body">
          <div className="kt-login__form" >
            <div className="kt-login__title">
              <h3>
                <FormattedMessage id="AUTH.FORGOT.TITLE" />
              </h3>
               <div className="kt-form" style={divStyle}>
               <FormattedMessage id="AUTH.PASSRESETREQUEST.CONFIRMTEXT" />               
                <br/>
                <br/>
                <br/>                
                <FormattedMessage id="AUTH.PASSRESETREQUEST.INSTRUCTION" />               
                
                </div>
                <div className="kt-login__actions">
                    <Link to="/auth">
                      <button
                        type="button"
                        className="btn btn-secondary btn-elevate kt-login__btn-secondary"
                      >
                        Back to Login
                      </button>
                    </Link>
            </div>
            </div>           

</div>
</div>
</div>
    )
    }


}
export default injectIntl(connect(null, auth.actions)(PasswordChangeConfirmationPage));