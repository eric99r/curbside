import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Radio, RadioGroup,
    FormHelperText, FormControlLabel, FormControl, FormLabel,
    Button,
    Checkbox,MenuItem,
    TextField,Paper,Grid,label, InputLabel} from '@material-ui/core';
    import Autocomplete from '@material-ui/lab/Autocomplete';
    import HelpIcon from '@material-ui/icons/Help';
    import Typography from '@material-ui/core/Typography';    
import { Formik, Field, FieldArray} from "formik";
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from "react-intl";
import * as sponseredapprealApi from '../../../../crud/sponseredappreal.crud';
import { connect } from "react-redux";import * as onboarding from '../../../../store/ducks/onboarding.duck';
import { authHeader } from '../../../../store/auth.helper';
import { onboardingSections, onboardingStatus } from '../onboarding.constants';
import * as organizationduck from '../../../../store/ducks/organization.duck';
import ToolTipsTag from '../../../../partials/content/ToolTipsTag';
import * as onboardingDuck from '../../../../store/ducks/onboarding.duck';
import * as productAndcatalog from '../../../../store/ducks/productAndcatalog.duck';
import StatusBubble from '../../../../partials/content/StatusBubble';
const authHeaders = authHeader();



const useStyles = makeStyles(theme => ({
    root: {
      flexgrow: 1
       
    },
    formControl: {
        margin: theme.spacing(1,0),
        display: "flex",
        minWidth: 120
    },
    
    
    paper: {
        margin: theme.spacing(2),
        padding: theme.spacing(2),
     //   width: "100%"
    }
}));


 function SponseredApprealGuidlinesStep(props) {
    const { intl } = props;
    const classes = useStyles();
    console.log(props);
    const step = onboardingSections.CATALOG_AND_PRODUCTS.steps.SPONSORED_APPAREL_BRANDS;
    let initialApprealitem=[{ id:1,ApparelitemName:"Nike",disabled:false,Isallow:false},
                            {id:2,ApparelitemName:"Adidas",disabled:false,Isallow:false},
                            {id:3,ApparelitemName:"Callaway",disabled:false,Isallow:false},
                            {id:4,ApparelitemName:"Under Armour",disabled:false,Isallow:false},
                            {id:5,ApparelitemName:"Cutter & Buck",disabled:false,Isallow:false},
                            {id:6,ApparelitemName:"Columbia",disabled:false,Isallow:false},
                            {id:7,ApparelitemName:"We do not have any sponsored apparel brands",disabled:false,Isallow:false}                        
                        ]
      let initialProbhitedApprealitem=[{ id:1,ApparelitemName:"Nike",disabled:false,Isallow:false},
      {id:2,ApparelitemName:"Adidas",disabled:false,Isallow:false},
      {id:3,ApparelitemName:"Callaway",disabled:false,Isallow:false},
      {id:4,ApparelitemName:"Under Armour",disabled:false,Isallow:false},
      {id:5,ApparelitemName:"Cutter & Buck",disabled:false,Isallow:false},
      {id:6,ApparelitemName:"Columbia",disabled:false,Isallow:false},
      {id:8,ApparelitemName:"We do not have any prohibited apparel brands",disabled:false,Isallow:false}                        
  ]



    const [state, setState] = useState({
        initialApprealitem,
        initialProbhitedApprealitem,
        error: undefined
    });

    useEffect(() => {
     
    }, [state]);
    function handleSubmit(values, { setStatus, setSubmitting }) {
        setSubmitting(true);
        setStatus("");
      let  BrandApprealRequest=[];
        if(values.sponsereditem.length>0)
        {
          values.sponsereditem.forEach(function(i,object)
          {
            BrandApprealRequest.push({SponseredBrandId:i.id,status:1,OrganizationId:props.organization.id});

          });
          

        }   
        if(values.probhiteditem.length>0)
        {
          values.probhiteditem.forEach(function(i,object)
          {
            BrandApprealRequest.push({SponseredBrandId:i.id,status:2,OrganizationId:props.organization.id});

          });
        }   


    }

    
    const handleChange = event => {
      
      console.log(event);
      };


    function validate(values) {
        const errors = {};

        if(values.sponsereditem.length===0 || values.sponsereditem===undefined )
        {            
            errors.sponsereditem = intl.formatMessage({
                id: "ORAGANIZATION.ISCOMPANYURL"
              });

        }

        console.log(values);
        return errors;
    }    

    return (
        <div className="kt-section">
            <div className="kt-section__content">
                <div className={classes.root}>
                <Formik
            initialValues={{            
                sponsereditem:[],
                probhiteditem:[],
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
                  <Grid item xs={12}>
                      <Paper variant="outlined" className={classes.paper} elevation={0}>
                          <div className="form-group mb-0">  
                          <FormControl component="fieldset" className={classes.formControl} error={Boolean(touched.sponsereditem && errors.sponsereditem)}>
                            <FormLabel component="legend">Your Sponsored Apparel Brands</FormLabel>
                        <FieldArray
                        name="sponsereditem"

                        value={values.sponsereditem}
                        error={Boolean(touched.sponsereditem && errors.sponsereditem)}
                        render={arrayHelpers => (
                            
                            <div style={{width:"400px"}} >
                            {                    
                                        
                            state.initialApprealitem.map(item => (                                                                                                  

                            <label key={item.id} style={{padding:"18px"}} >
                            <input
                            id={item.id+ "-roles-"+"-0"}
                                name={item.id+ "-roles-"+"-0"}
                                type="checkbox"
                                disabled={item.disabled}
                                checked={item.Isallow}
                                value={item.id}                      
                                onChange={e => {
                                    if (e.target.checked) {
                                        if(item.id!==7)
                                        {                                        
                                        state.initialApprealitem.forEach(function(i,object){                                                   
                                            if (i.id == item.id) {                                                
                                                i.Isallow = true;                                                                                        
                                            } 
                                            if(i.id===7)
                                            {
                                              i.Isallow = false;  
                                              const idx = values.sponsereditem.indexOf(7);
                                             if(idx>-1)
                                             {
                                              console.log(idx);                                            
                                              arrayHelpers.remove(idx);                                                                      
                                             }
                                            }                                           
                                         
                                          });
                                        }
                                        else{
                                            state.initialApprealitem.forEach(function(i,object){                                                   
                                                    if(item.id===7 && i.id===7)
                                                    {
                                                    i.Isallow = true;
                                                    }
                                                    else{
                                                        i.Isallow = false;

                                                    }
                                              });

                                        }
                                        if(e.target.value!=="7")
                                        {
                                        arrayHelpers.push(item.id);
                                        }
                                        if(e.target.value==="7")
                                        {
                                            let count=0;                                         
                                            state.initialApprealitem.forEach(function(i,object){  
                                              let idx =values.sponsereditem.indexOf(i.id); 
                                              arrayHelpers.pop();
                                             } );                                                 
                                            arrayHelpers.push(item.id);    
                                            for (var i = 0; i <  state.initialProbhitedApprealitem.length; i++) {
                                            
                                                state.initialProbhitedApprealitem[i].disabled =false;
                                                
                                            }
                                            
                                        }
                                        for (var i = 0; i <  state.initialProbhitedApprealitem.length; i++) {
                                          if (state.initialProbhitedApprealitem[i].id === item.id) {
                                            state.initialProbhitedApprealitem[i].disabled =true;
                                            break;
                                          }
                                        }
                                      
                                    } else {
                                        const idx = values.sponsereditem.indexOf(item.id);                                                                            
                                        arrayHelpers.remove(idx); 
                                      if(item.id!==7)
                                      {                                        
                                      state.initialApprealitem.forEach(function(i,object){                                                   
                                          if (i.id == item.id) {                                                
                                              i.Isallow = false;
                                            return false;
                                          }                                          
                                          
                                        });
                                      }
                                      else{
                                          state.initialApprealitem.forEach(function(i,object){                                                   
                                                  if(item.id===7 && i.id===7)
                                                  {
                                                  i.Isallow = false;
                                                  }
                                                  else{
                                                      i.Isallow = false;

                                                  }
                                            });

                                      }

                                      for (var i = 0; i <  state.initialProbhitedApprealitem.length; i++) {
                                        if ( state.initialProbhitedApprealitem[i].id === item.id) {
                                          state.initialProbhitedApprealitem[i].disabled =false;
                                          break;
                                        }
                                      }
                                    
                                    }
                                  }}
                                    />
                                                    <span>{item.ApparelitemName}</span>
                  </label>
                    
                            ))
                             
                           }
                           
                     </div>

                     )}  />

                <FormHelperText>{touched.sponsereditem && errors.sponsereditem}</FormHelperText>
                </FormControl>
                          </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                      <Paper variant="outlined" className={classes.paper} elevation={0}>
                      <div className="form-group mb-0">  
                          <FormControl component="fieldset" className={classes.formControl} error={Boolean(touched.sponsereditem && errors.sponsereditem)}>
                            <FormLabel component="legend">Your Sponsored Apparel Brands</FormLabel>
                        <FieldArray
                        name="probhiteditem"

                        value={values.probhiteditem}
                        error={Boolean(touched.probhiteditem && errors.probhiteditem)}
                        render={arrayHelpersnew => (
                            
                            <div style={{width:"400px"}} >
                            {                    
                                        
                            state.initialProbhitedApprealitem.map(item => (                                                                                                  

                            <label key={item.id} style={{padding:"18px"}} >
                            <input
                            id={item.id+ "-roles-"+"-1"}
                                name={item.id+ "-roles-"+"-1"}
                                type="checkbox"
                                checked={item.Isallow}
                                disabled={item.disabled}
                                value={item.id}                      
                                onChange={e => {
                                    if (e.target.checked) {
                                        if(item.id!==8)
                                        {                                        
                                        state.initialProbhitedApprealitem.forEach(function(i,object){                                                   
                                            if (i.id == item.id) {                                                
                                                i.Isallow = true;                                                                                        
                                            } 
                                            if(i.id===8)
                                            {
                                              i.Isallow = false;  
                                              const idx = values.probhiteditem.indexOf(8);
                                             if(idx>-1)
                                             {
                                              console.log(idx);                                            
                                              arrayHelpersnew.remove(idx);                                                                      
                                             }
                                            }                                           
                                         
                                          });
                                        }
                                        else{
                                            state.initialProbhitedApprealitem.forEach(function(i,object){                                                   
                                                    if(item.id===8 && i.id===8)
                                                    {
                                                    i.Isallow = true;
                                                    }
                                                    else{
                                                        i.Isallow = false;

                                                    }
                                              });

                                        }
                                        if(e.target.value!=="8")
                                        {
                                        arrayHelpersnew.push(item.id);
                                        }
                                        if(e.target.value==="8")
                                        {
                                            let count=0;                                         
                                            state.initialProbhitedApprealitem.forEach(function(i,object){  
                                              let idx =values.probhiteditem.indexOf(i.id); 
                                              arrayHelpersnew.pop();
                                             } );                                                 
                                            arrayHelpersnew.push(item.id);         
                                            for (var i = 0; i <  state.initialApprealitem.length; i++) {
                                            
                                              state.initialApprealitem[i].disabled =false;
                                              
                                          }                                   
                                        }
                                        for (var i = 0; i <  state.initialApprealitem.length; i++) {
                                          if ( state.initialApprealitem[i].id === item.id) {
                                            state.initialApprealitem[i].disabled =true;
                                            break;
                                          }
                                        }
                                    } else {
                                        const idx = values.probhiteditem.indexOf(item.id);
                                        console.log(idx);                                            
                                        arrayHelpersnew.remove(idx); 
                                      if(item.id!==8)
                                      {                                        
                                      state.initialProbhitedApprealitem.forEach(function(i,object){                                                   
                                          if (i.id == item.id) {                                                
                                              i.Isallow = false;
                                            return false;
                                          }                                          
                                          
                                        });
                                      }
                                      else{
                                          state.initialProbhitedApprealitem.forEach(function(i,object){                                                   
                                                  if(item.id===8 && i.id===8)
                                                  {
                                                  i.Isallow = false;
                                                  }
                                                  else{
                                                      i.Isallow = false;

                                                  }
                                            });

                                      }


                                      for (var i = 0; i <  state.initialApprealitem.length; i++) {
                                        if ( state.initialApprealitem[i].id === item.id) {
                                          state.initialApprealitem[i].disabled =false;
                                          break;
                                        }
                                      }
                                    
                                    }
                                  }}
                                    />
                                                    <span>{item.ApparelitemName}</span>
                  </label>
                    
                            ))
                             
                           }
                           
                     </div>

                     )}  />

                <FormHelperText>{touched.sponsereditem && errors.sponsereditem}</FormHelperText>
                </FormControl>
                          </div>
                        </Paper>
                    </Grid>
                  </Grid>
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
    );
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
      {...organizationduck.actions,...onboardingDuck.actions }
    )(SponseredApprealGuidlinesStep)
  );


