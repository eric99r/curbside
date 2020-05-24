import React from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import { toAbsoluteUrl } from "../../../_metronic";
import { Link } from "react-router-dom";
import { TextField } from "@material-ui/core";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../../store/ducks/auth.duck";
import UserProfile from "../../../app/partials/layout/UserProfile";
import { ResetPassword } from "../../crud/auth.crud";
import{PASSRESETSERVERRESPONSE} from "../../serverErrorconstant/serverError.constant";
const divStyle = {
  textAlign: 'left'
};
const sendalign = {
  verticalAlign: '6px',
  padding: '.5em'
}
class ResetPasswordPage extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }
  
  logout(e) {
    this.props.logout();
  }

  ValidatePasswordwithName(passvalue) {
    let i = 0, Isfind = true, emailname = [];
    Isfind = this.props.auth.userData.lastName.length > 0 ? this.IsMatchFound(this.props.auth.userData.lastName.toUpperCase(), passvalue.toUpperCase()) : true;
    if (Isfind === true) {
      Isfind = this.props.auth.userData.firstName.length > 0 ? this.IsMatchFound(this.props.auth.userData.firstName.toUpperCase(), passvalue.toUpperCase()) : true;
    }
    if (Isfind === true) {
      emailname = this.props.auth.userData.email_address.split("@")
      Isfind = emailname[0].length > 0 ? this.IsMatchFound(emailname[0].toUpperCase(), passvalue.toUpperCase()) : true;
    }
    return Isfind;
  }
  IsMatchFound(comparerstring, givenvalue) {
    let Isfind = true;
    for (let i = 0; i < givenvalue.length - 2; i++) {
      var j = comparerstring.indexOf(givenvalue[i]);
      if (j > -1 && j + 2 < comparerstring.length &&
        givenvalue[i + 1] === comparerstring[j + 1] &&
        givenvalue[i + 2] === comparerstring[j + 2]) {

        Isfind = false;
        break;
      }
    }
    return Isfind;

  }
  render() {

    const { user, showHi, showAvatar, showBadge } = this.props;
    const { intl } = this.props;
    return (

      <div className="kt-grid kt-grid--ver kt-grid--root">

        <div id="kt_login"
          className="kt-grid kt-grid--hor kt-grid--root kt-login kt-login--v1" >

          <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--desktop kt-grid--ver-desktop kt-grid--hor-tablet-and-mobile">
            <div
              className="kt-grid__item kt-grid__item--order-tablet-and-mobile-2 kt-grid kt-grid--hor kt-login__aside"
              style={{
                backgroundImage: `url(${toAbsoluteUrl("/media/bg/bg-7.jpg")})`
              }}
            >
              <div className="kt-grid__item">
                <Link to="/" className="kt-login__logo">
                  <img
                    alt="Logo"
                    src={toAbsoluteUrl("/media/logos/follett_Logo_1.png")}
                  />
                </Link>
              </div>
              <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver">
                <div className="kt-grid__item kt-grid__item--middle">
                  <h3 className="kt-login__title">Welcome to Advanced-Online </h3>
                  <h4 className="kt-login__subtitle">
                    Customer Service Portal
                  </h4>
                </div>
              </div>
            </div>

            <div className="kt-grid__item kt-grid__item--fluid  kt-grid__item--order-tablet-and-mobile-1  kt-login__wrapper">
              <div className="kt-login__head">

                <UserProfile showAvatar={true} showHi={true} showBadge={false} />

              </div>
              <div className="kt-login__body">

                <div className="kt-login__form" >
                  <div className="kt-login__title" style={divStyle}>
                    <h3>
                      <FormattedMessage id="AUTH.RESETPASSWORD.TITLE" />
                    </h3>
                    <div className="kt-form"><FormattedMessage id="AUTH.RESETPASSWORD.INSTRUCTION" /></div>
                  </div>
                  <Formik
                    initialValues={{

                      password: "",
                      confirmPassword: ""
                    }}
                    validate={values => {
                      const errors = {};
                     
                      const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
                      var vals=strongRegex.test(values.password);
                                           
                      if (!values.password) {
                        errors.password = intl.formatMessage({
                          id: "AUTH.VALIDATION.REQUIRED_FIELD"

                        });

                      }
                      else if (
                        ! vals
                      ) {
                        errors.password = intl.formatMessage({
                          id: "AUTH.RESETPASSWORD.INPUTPOLICY"
                        });
                      }
                      else if (!this.ValidatePasswordwithName(values.password)) {

                        errors.password = intl.formatMessage({
                          id: "AUTH.RESETPASSWORD.INPUTPOLICY"
                        });

                      }


                      if (!values.confirmPassword) {
                        errors.confirmPassword = intl.formatMessage({
                          id: "AUTH.VALIDATION.REQUIRED_FIELD"
                        });
                      } else if (values.password !== values.confirmPassword) {
                        errors.confirmPassword =
                          "Password and Confirm Password didn't match.";
                      }


                      return errors;
                    }}
                    onSubmit={(values, { setStatus, setSubmitting }) => {                     
                      ResetPassword(this.props.auth.userData, values.password)
                        .then((data) => {
                          this.props.login(data.data);
                        }).catch((error) => {
                          if(error.response.data===PASSRESETSERVERRESPONSE.PASSALREADYUSE)
                            {
                              setStatus(
                              intl.formatMessage(
                                { id: "AUTH.RESETPASSWORD.PASSALREADYUSE" }
                              )
                              )
                            }
                            else
                            {
                              setStatus(
                                intl.formatMessage(
                                  { id: "AUTH.VALIDATION.NOT_FOUND" }
                                )
                              );
                            }
                          setSubmitting(false);
                          
                        });
                    }}
                  >
                    {({
                      values,
                      status,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting
                    }) => (
                        <form onSubmit={handleSubmit} noValidate autoComplete="off">
                          {status && (
                            <div role="alert" className="alert alert-danger">
                              <div className="alert-text">{status}</div>
                            </div>
                          )}

                          <div className="form-group mb-0">
                            <TextField
                              type="password"
                              margin="normal"
                              label="New Password"
                              className="kt-width-full"
                              name="password"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.password}
                              helperText={touched.password && errors.password}
                              error={Boolean(touched.password && errors.password)}
                              InputLabelProps={{ style: { fontSize: 18 } }}
                              FormHelperTextProps={{ style: { fontSize: 12 } }}
                            />
                          </div>

                          <div className="form-group">
                            <TextField
                              type="password"
                              margin="normal"
                              label="Confirm Password"
                              className="kt-width-full"
                              name="confirmPassword"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.confirmPassword}
                              helperText={touched.confirmPassword && errors.confirmPassword}
                              error={Boolean(
                                touched.confirmPassword && errors.confirmPassword
                              )}
                              InputLabelProps={{ style: { fontSize: 18 } }}
                              FormHelperTextProps={{ style: { fontSize: 12 } }}
                            />
                          </div>

                          <div className="kt-login__actions">
                            <button
                              disabled={isSubmitting}
                              className="btn btn-primary btn-elevate kt-login__btn-primary"
                            >
                              <span className="material-icons" >
                                exit_to_app
                    </span>
                              <span style={sendalign}>Submit</span>

                            </button>
                          </div>
                        </form>
                      )}
                  </Formik>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }



}

const mapStateToProps = ({ auth: { user } }) => ({
  auth: user
});

export default injectIntl(connect(mapStateToProps, auth.actions)(ResetPasswordPage));