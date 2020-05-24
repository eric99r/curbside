import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Radio, RadioGroup,
  FormHelperText, FormControlLabel, FormControl, FormLabel,
  Button,
  TextField, Paper, Grid,
  Typography,
  CircularProgress
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Formik, Field } from "formik";
//import Autocomplete from "react-autocomplete";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { onboardingSections, onboardingStatus, getOnboardingStatus, allStatusesAreComplete } from '../onboarding.constants';

import ToolTipsTag from '../../../../partials/content/ToolTipsTag';
import StatusBubble from '../../../../partials/content/StatusBubble';

import { updateOrganization } from '../../../../crud/organization.crud';
import * as organizationduck from '../../../../store/ducks/organization.duck';
import * as onboardingDuck from '../../../../store/ducks/onboarding.duck';

const menuStyle = {
  top: "456px",
  left: "300px",
  borderRadius: '3px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
  background: 'rgba(255, 255, 255, 0.9)',
  padding: '2px 0',
  fontSize: '90%',
  position: 'fixed',
  overflow: 'auto',
  maxHeight: '50%', // TODO: don't cheat, let it flow to the bottom
  "zIndex": 100,
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  formControl: {
    margin: theme.spacing(1),
    display: "flex",
    minWidth: 120
  },
  textField: {
    minWidth: 240
  },
  paper: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    //width: "100%"
  },
  gridItem: {
    width: "100%"
  }
}));

function OrganizationStep(props) {

  const step = onboardingSections.ORGANIZATION;
  const { auth, onboarding } = props;

  const [state, setState] = useState({
    licenseData: undefined,
    error: undefined
  });

  const storeUrlBase = props.organization && (props.organization.company_Name + props.organization.companyTypeName).replace(/[^0-9a-z]/gi, '');
  const StoreUrl = [
    {
      UrlText: storeUrlBase + "Store.com",
      UrlValue: storeUrlBase + "Store.com"
    },
    {
      UrlText: storeUrlBase + "Gear.com",
      UrlValue: storeUrlBase + "Gear.com"
    },
    {
      UrlText: "Shop" + storeUrlBase + ".com",
      UrlValue: "Shop" + storeUrlBase + ".com"
    },
    {
      UrlText: storeUrlBase + "Outfitters.com",
      UrlValue: storeUrlBase + "Outfitters.com"
    }
  ];

  const license = [
    {
      LicenseValue: "1",
      LiceneText: "ADSFDFDF"
    },
    {
      LicenseValue: "2",
      LiceneText: "123AOR"
    },
    {
      LicenseValue: "3",
      LiceneText: "3456DRT"
    }
  ];

  const initialLicenseValues = {
    LicenseInfo: {
      LiceneText: "3456DRT"
    }
  };

  const getinitialLicenseValues = () => {
    let license = props.organization.license;
    if (license) {
      let LicenseInfo = {
        LicenseValue: license.id,
        LiceneText: license.licensingName
      }
      return LicenseInfo;
    } else {
      let LicenseInfo = {
        LicenseValue: "3",
        LiceneText: "3456DRT"
      }
      return LicenseInfo;
    }
  };

  const isExistInStoreUrl = (url) => {
    let existUrl = null;
    if (url != "" || url !== null) {
      existUrl = StoreUrl.find((item) => {
        return item.UrlText == url
      })
    }
    return existUrl;
  };

  useEffect(() => {
    if (auth && auth.userData && !props.organization) {
      props.getOrganizationById(auth.userData.account);
    }
  }, [])

  const { intl } = props;
  const classes = useStyles();

  function completeStep() {
    // Complete step.
    props.completeStep(step.name);
    // Complete section since this is the last step.
    props.completeStep(onboardingSections.ORGANIZATION.name);
    // Unlock next section if it's not already.
    if (getOnboardingStatus(onboarding.statuses, onboardingSections.BRANDING.name) === onboardingStatus.LOCKED) {
      props.setStepStatus(onboardingSections.BRANDING.name, onboardingStatus.UNLOCKED);
      props.setStepStatus(onboardingSections.BRANDING.steps.BRAND_GUIDELINES.name, onboardingStatus.UNLOCKED);
    }
  }

  function handleLicensingChanges(hasLicensingCompany, lastHasLicensingCompanyState, hasCompletedOnboarding) {
    let newStatuses = {};
    props.setStepMessage(step.name, "");
    // Only display certain steps if the organization doesn't use a licensing company.
    if (hasLicensingCompany) {
      // Disable steps in branding.
      newStatuses[onboardingSections.BRANDING.steps.BRAND_GUIDELINES.name] = onboardingStatus.DISABLED;
      newStatuses[onboardingSections.BRANDING.steps.VERBIAGE_TAGLINES_AND_FONTS.name] = onboardingStatus.DISABLED;
      newStatuses[onboardingSections.BRANDING.steps.LOGOS_AND_APPROVED_COLORS.name] = onboardingStatus.DISABLED;
      // Unlock next step.
      if (getOnboardingStatus(onboarding.statuses, onboardingSections.BRANDING.name) !== onboardingStatus.COMPLETE) {
        newStatuses[onboardingSections.BRANDING.steps.SPORTS_TEAMS.name] = onboardingStatus.UNLOCKED;
      }
      // Check if the last state was NO.
      if (lastHasLicensingCompanyState === false) {
        const message = intl.formatMessage({
          id: "ORGANIZATION.LICENSING.NO_TO_YES"
        });
        if (hasCompletedOnboarding) {
          // Reset final review and display message.
          newStatuses[onboardingSections.FINAL_REVIEW.name] = onboardingStatus.UNLOCKED;
          props.setStepMessage(onboardingSections.FINAL_REVIEW.name, message, "warning");
        } else {
          props.setStepMessage(step.name, message, "warning");
        }
      }
    } else {
      // Enable any disabled sections.
      newStatuses[onboardingSections.BRANDING.steps.VERBIAGE_TAGLINES_AND_FONTS.name] = onboardingStatus.LOCKED;
      newStatuses[onboardingSections.BRANDING.steps.LOGOS_AND_APPROVED_COLORS.name] = onboardingStatus.LOCKED;
      // Reset Branding section if already completed.
      newStatuses[onboardingSections.BRANDING.name] = onboardingStatus.UNLOCKED;
      // Reset SportsTeam step if already completed.
      newStatuses[onboardingSections.BRANDING.steps.SPORTS_TEAMS.name] = onboardingStatus.LOCKED;
      // Unlock next step.
      newStatuses[onboardingSections.BRANDING.steps.BRAND_GUIDELINES.name] = onboardingStatus.UNLOCKED;
      // Check if last state was YES.
      if (lastHasLicensingCompanyState === true) {
        const message = intl.formatMessage({
          id: "ORGANIZATION.LICENSING.YES_TO_NO"
        })
        if (hasCompletedOnboarding) {
          newStatuses[onboardingSections.FINAL_REVIEW.name] = onboardingStatus.LOCKED;
          props.setStepMessage(onboardingSections.BRANDING.steps.BRAND_GUIDELINES.name, message, "warning");
        } else {
          props.setStepMessage(onboardingSections.BRANDING.steps.BRAND_GUIDELINES.name, message, "warning");
        }
      }
    }
    props.setStatuses(newStatuses);
  }

  function handleSubmit(values, { setStatus, setSubmitting }) {
    setSubmitting(true);
    setStatus("");

    let organization = {
      ...props.organization,
      ownsSiteDomain: values.IsCompanyUrl == "yes" ? true : false,
      hasLicensingCompany: values.isLicenseChanges == "yes" ? true : false,
      site_Name: isExistInStoreUrl(values.storeUrl) ? values.storeUrl : values.customUrlValue,
      returnSiteName: values.webSiteName,
      returnSiteLink: values.webSiteUrl,
      licenseCompanyName: values.isLicenseChanges == "yes" ? values.LicenseInfo : "",
      // license: values.isLicenseChanges == "yes" ? (values.LicenserawValue == "" ? 
      //   {
      //     licensingName: values.LicenseInfo.LiceneText,
      //     id: values.LicenseInfo.LicenseValue
      //   } :
      //   {
      //     licensingName: values.LicenserawValue
      //   })
      //   : null,
      //licenseId: (values.isLicenseChanges == "yes" && values.LicenserawValue == "") ? values.LicenseInfo.LicenseValue : 0

    }
    const previousHasLicensingCompany = props.organization.hasLicensingCompany;

    updateOrganization(organization).then((data) => {
      props.updateOrganization(data.data);
      setSubmitting(false);
      setState({ ...state, error: false });
      if (values.formAction === "submit") {
        completeStep();
        if (previousHasLicensingCompany !== null && organization.hasLicensingCompany !== previousHasLicensingCompany) {
          const hadCompletedOnboarding = allStatusesAreComplete(onboarding.statuses);
          handleLicensingChanges(organization.hasLicensingCompany, previousHasLicensingCompany, hadCompletedOnboarding);
        }
      } else if (values.formAction === "save") {
        setStatus("Saved information successfully.");
      }
    })
      .catch((error) => {
        console.log("Failed to update organization", error);
        setSubmitting(false);
        setStatus(
          "Failed to update organization."
        );
        setState({ ...state, error: true });
      });
  }

  function validate(values) {
    const errors = {};

    const Urlpattern = new RegExp('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$');

    if (!values.isLicenseChanges) {
      errors.isLicenseChanges = intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD"
      });

    }

    if (values.isLicenseChanges === "yes") {
      if (!values.LicenseInfo) {
        errors.LicenseInfo = intl.formatMessage({
          id: "ORGANIZATION.LICENSENO.REQUIRED"
        });
      }
    }

    if (!values.IsCompanyUrl) {
      errors.IsCompanyUrl = intl.formatMessage({
        id: "ORAGANIZATION.ISCOMPANYURL"
      });
    }

    if (values.webSiteUrl === "" || values.webSiteUrl === null) {
      errors.webSiteUrl = intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD"
      });
    } else {
      if (!Urlpattern.test(values.webSiteUrl)) {
        errors.webSiteUrl = intl.formatMessage({
          id: "ORAGANIZATION.VALIDURL"
        });
      }
    }

    if (values.webSiteName === "" || values.webSiteName === null) {
      errors.webSiteName = intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD"
      });
    }

    if (values.storeUrl === "" || values.storeUrl === null) {
      errors.storeUrl = intl.formatMessage({
        id: "ORAGANIZATION.COMPANYURLOPTION"
      });
    } else {
      if (values.storeUrl === "customUrl") {
        if (values.customUrlValue === "" || values.customUrlValue === null) {
          errors.storeUrl = intl.formatMessage({
            id: "ORAGANIZATION.COMPANYURLOPTION"
          });

          errors.customUrlValue = intl.formatMessage({
            id: "AUTH.VALIDATION.REQUIRED_FIELD"
          });
        } else {
          if (!Urlpattern.test(values.customUrlValue)) {
            errors.customUrlValue = intl.formatMessage({
              id: "ORAGANIZATION.VALIDURL"
            });

          }
        }

      }
    }
    return errors;
  }

  if (!props.organization) {
    return (<CircularProgress />);
  }

  return (
    <div className="kt-section">
      <div className="kt-section__content">
        <div className={classes.root}>
          <Formik
            initialValues={{
              // LicenseInfo: getinitialLicenseValues(),
              LicenseInfo: props.organization.licenseCompanyName !== "" ? props.organization.licenseCompanyName : "",
              webSiteUrl: props.organization.returnSiteLink !== "" ? props.organization.returnSiteLink : "",
              webSiteName: props.organization.returnSiteName !== "" ? props.organization.returnSiteName : "",
              storeUrl: props.organization.site_Name !== null ? props.organization.site_Name : "",
              customUrlValue: isExistInStoreUrl(props.organization.site_Name) ? "" : props.organization.site_Name,
              isLicenseChanges: props.organization.hasLicensingCompany !== null ? (props.organization.hasLicensingCompany ? "yes" : "no") : "",
              IsCompanyUrl: props.organization.ownsSiteDomain !== null ? (props.organization.ownsSiteDomain ? "yes" : "no") : "",
              LicenserawValue: "",
              customUrl: props.organization.site_Name !== null ? (isExistInStoreUrl(props.organization.site_Name) ? "customUrl" : props.organization.site_Name) : "customUrl",
              formAction: "submit"
            }}

            validate={validate}
            onSubmit={(values, { setStatus, setSubmitting }) => { handleSubmit(values, { setStatus, setSubmitting }); }}
          >
            {({
              values,
              status,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue
            }) => (
                <form onSubmit={handleSubmit} noValidate autoComplete="off">
                  <Grid container>
                    <Grid item md={6} className={classes.gridItem}>
                      <Paper variant="outlined" className={classes.paper} elevation={0}>
                        <Typography variant="subtitle1">Basic Information</Typography>
                        <div className="form-group mb-0">
                          <FormControl className={classes.formControl}>
                            <span>Company Name: {props.organization.company_Name}</span>
                            <span>Company Type: {props.organization.companyTypeName}</span>
                            <span>Store Type: {props.organization.multi_company === true ? "Multiple Company" : "Single Company"}</span>
                          </FormControl>
                        </div>
                      </Paper>
                    </Grid>
                    <Grid item md={6} className={classes.gridItem}>
                      <Paper variant="outlined" className={classes.paper} elevation={0}>
                        <Typography variant="subtitle1">Program Manager Information</Typography>
                        <div className="form-group mb-0"  >
                          <FormControl className={classes.formControl}>
                            <span>Program Manager: {props.organization.pM_name}</span>
                            <span>Email: {props.organization.pM_email}</span>
                            <span>Phone: {props.organization.pM_phone || "Not Available"}</span>
                          </FormControl>
                        </div>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Paper variant="outlined" className={classes.paper} elevation={0}>
                        <Typography variant="subtitle1">Your Licensing Information</Typography>
                        <div className="form-group mb-0">
                          <FormControl component="fieldset" className={classes.formControl} error={Boolean(touched.isLicenseChanges && errors.isLicenseChanges)}>
                            <FormLabel component="legend">Do you use a licensing company?</FormLabel>
                            <RadioGroup
                              aria-label="Do you use a licensing company?"
                              name="isLicenseChanges"
                              className={classes.group}
                              onChange={handleChange}
                              value={values.isLicenseChanges}
                              row>
                              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                              <FormControlLabel value="no" control={<Radio />} label="No" />
                            </RadioGroup>
                            <FormHelperText>{touched.isLicenseChanges && errors.isLicenseChanges}</FormHelperText>
                          </FormControl>
                        </div>

                        {
                          values.isLicenseChanges === "yes" &&
                          <div className="form-group mb-0">
                            <TextField
                              className={classes.textField}
                              label="Licensing Company Name"
                              name="LicenseInfo"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.LicenseInfo}
                              helperText={touched.LicenseInfo && errors.LicenseInfo}
                              error={Boolean(touched.LicenseInfo && errors.LicenseInfo)}
                            />
                            {/* <FormControl className={classes.formControl} error={Boolean(touched.LicenseInfo && errors.LicenseInfo)}>
                                                <span>      Licensing Company Name: 
                                                  <Autocomplete
                                                            freeSolo
                                                            id="LicenseInfo"
                                                            name="LicenseInfo"
                                                            disableClearable                                                            
                                                            error={touched.LicenseInfo && Boolean(errors.LicenseInfo)}                                                   
                                                            variant="standard"
                                                            options={license}                                                            
                                                            // defaultValue={initialLicenseValues.LicenseInfo}
                                                            defaultValue={getinitialLicenseValues}
                                                            getOptionLabel={option => option.LiceneText}
                                                            onChange={(e, value) => {                                                               
                                                              setFieldValue(                                                                
                                                                "LicenseInfo",
                                                                value !== "" ? value : {...initialLicenseValues.LicenseInfo}
                                                              );
                                                            }}                                                            
                                                            renderInput={(params) => (    
                                                              <TextField 
                                                              name="LicenserawValue"                                                            
                                                              onChange={(e, value) => { 
                                                                setFieldValue(                                                                                                   
                                                                  "LicenserawValue",
                                                                  (value !== undefined) ?"": e.target.value
                                                                );     
                                                              }}                                                              
                                                                {...params}
                                                                label="Search input"
                                                                margin="normal"
                                                                variant="outlined"                                                                                                                                                                                           
                                                                InputProps={{ ...params.InputProps, type: 'search' }}  />
                                                            )}
                                                          />
                                                  </span>
                                                </FormControl> */}
                          </div>
                        }
                      </Paper>
                    </Grid>
                    <Grid item xs={12}>
                      <Paper variant="outlined" className={classes.paper} elevation={0}>
                        <Typography variant="subtitle1">Your Website</Typography>
                        Please provide the URL and a name for your organization's website. We'll include a link for shoppers on
                              your store so they know where to find you.   <br />
                        <br />
                        <div className="form-group mb-0">
                          <Grid container>
                            <Grid item md={6}>
                              <TextField
                                className={classes.textField}
                                label="Website URL"
                                name="webSiteUrl"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.webSiteUrl}
                                helperText={touched.webSiteUrl && errors.webSiteUrl}
                                error={Boolean(touched.webSiteUrl && errors.webSiteUrl)}
                              />
                            </Grid>
                            <Grid item md={6}>
                              <TextField
                                className={classes.textField}
                                label="Website Name"
                                name="webSiteName"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.webSiteName}
                                helperText={touched.webSiteName && errors.webSiteName}
                                error={Boolean(touched.webSiteName && errors.webSiteName)}
                              />
                              <ToolTipsTag iconname="home" tooltiptext="shopper will see for the  link to your website." />
                            </Grid>
                          </Grid>
                        </div>
                      </Paper>
                    </Grid>
                    <Grid item xs={12}>
                      <Paper variant="outlined" className={classes.paper} elevation={0}>
                        <div className="form-group mb-0">
                          <FormControl component="fieldset" className={classes.formControl} error={Boolean(touched.storeUrl && errors.storeUrl)}>
                            <FormLabel component="legend">You can use any URL. Select one of our recommended options listed below or create your own.</FormLabel>
                            <RadioGroup
                              aria-label="Do you use a licensing company?"
                              name="storeUrl"
                              className={classes.group}
                              onChange={handleChange}
                              value={values.storeUrl}>
                              {
                                StoreUrl.map((item, i) => {
                                  return (<div key={i}><FormControlLabel value={item.UrlValue} control={<Radio />} label={item.UrlText} /></div>);
                                })
                              }
                              <span>
                                <FormControlLabel value={values.customUrl} control={<Radio />} />
                                <TextField
                                  name="customUrlValue"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.customUrlValue}
                                  helperText={touched.customUrlValue && errors.customUrlValue}
                                  error={Boolean(touched.customUrlValue && errors.customUrlValue)}
                                />
                                <ToolTipsTag
                                  iconname="InfoIcon"
                                  tooltiptext={intl.formatMessage({ id: "ORGANIZATION.COMPANYURL.CREATIONHELP" })}
                                />
                              </span>
                            </RadioGroup>
                            <FormHelperText>{touched.storeUrl && errors.storeUrl}</FormHelperText>
                          </FormControl>
                        </div>
                        <br />
                        <div className="form-group mb-0">
                          <span>Does your company already own this URL?
                                           <ToolTipsTag iconname="home"
                              tooltiptext={intl.formatMessage({ id: "ORGANIZATION.COMPANYURL.HELP" })} /> </span>
                        </div>
                        <div className="form-group mb-0">
                          <FormControl component="fieldset" className={classes.formControl} error={Boolean(touched.IsCompanyUrl && errors.IsCompanyUrl)}>

                            <RadioGroup
                              aria-label="Do you use a licensing company?"
                              name="IsCompanyUrl"
                              className={classes.group}
                              onChange={handleChange}
                              value={values.IsCompanyUrl}
                              row>
                              <FormControlLabel value="yes" control={<Radio />} label="Yes, we own this URL" />
                              <FormControlLabel value="no" control={<Radio />} label="No, we do not own this URL" />
                            </RadioGroup>
                            <FormHelperText>{touched.IsCompanyUrl && errors.IsCompanyUrl}</FormHelperText>
                          </FormControl>
                        </div>
                      </Paper>
                    </Grid>
                  </Grid>

                  <StatusBubble
                    status={status}
                    error={state.error}
                  />

                  <div className="form-group" style={{ textAlign: 'center' }}>
                    <Button
                      disabled={!touched || isSubmitting}
                      onClick={() => {
                        setFieldValue("formAction", "save", false);
                        handleSubmit();
                      }}>
                      Save Progress
                    </Button>
                    <Button
                      variant="contained"
                      disabled={isSubmitting}
                      color="primary"
                      onClick={() => {
                        setFieldValue("formAction", "submit", false);
                        handleSubmit();
                      }}
                    >
                      Save & Proceed
                    </Button>
                  </div>
                </form>
              )}
          </Formik>

        </div>
      </div>
    </div>

  )

}

function mapStateToProps(state) {
  return {
    auth: state.auth.user,
    onboarding: state.onboarding,
    organization: state.organization.organization
  }
}

export default injectIntl(
  connect(
    mapStateToProps,
    { ...organizationduck.actions, ...onboardingDuck.actions }
  )(OrganizationStep)
);