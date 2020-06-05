//THE RULES OF DUCKS!!!
// https://i.stack.imgur.com/TjVsQ.gif

// MUST export default a function called reducer()
// MUST export its action creators as functions
// MUST have action types in the form npm-module-or-app/reducer/ACTION_TYPE
// MAY export its action types as UPPER_SNAKE_CASE, if an external reducer needs to listen for them, or if it is a published reusable library
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import database from '../../database.json';


// Actions
export const actionTypes = {
  changeOrderStatus: "[changeOrderStatus] Action",
  changePickupTime: "[changePickupTime] Action",
  changeCustomerPhase: "[changeCustomerPhase] Action",
  customerArrived: "[customerArrived] Action"
};

//What you'll access in the pages you're mapping the reducer to
const initialState = {
  orders: database.orders,
  lastUpdated: undefined
};

export const reducer = persistReducer(
  { storage, key: "demo1-auth", whitelist: ["user", "authToken"] },
  (state = initialState, action) => {
    switch (action.type) {            
      //BEST Example of changing a value in an array (By Object) 
      case actionTypes.changeOrderStatus: {
          const { order } = action.payload;
          let newState = state;
            newState =
            {
              ...newState,
                orders: newState.orders.map(o => o.orderNumber === order.orderNumber ? order : o )
            }            
            newState.lastUpdated = Date.now();
          return newState;
        }

      case actionTypes.changePickupTime: {
          const { order } = action.payload;
          let newState = state;
            newState =
            {
              ...newState,
                orders: newState.orders.map(o => o.orderNumber === order.orderNumber ? order : o )
            }            
            newState.lastUpdated = Date.now();
          return newState;
        }

      case actionTypes.customerArrived: {
          const { order } = action.payload;
          order.customerPhase = "submitted location";
          let newState = state;
            newState =
            {
              ...newState,
                orders: newState.orders.map(o => o.orderNumber === order.orderNumber ? order : o )
            }            
            newState.lastUpdated = Date.now();
          return newState;
        }

      case actionTypes.changeCustomerPhase: {
        const { order } = action.payload;
        console.log(order);
        console.log(211);
        let newState = state;
          newState =
          {
            ...newState,
              orders: newState.orders.map(o => o.orderNumber === order.orderNumber ? order : o )
          }            
          newState.lastUpdated = Date.now();
        return newState;
      }

      default:
        return state;
    }
  }
);

export const actions = {
  
  changeOrderStatus: (order) => ({ type: actionTypes.changeOrderStatus, payload: { order } }),
  changePickupTime: (order) => ({ type: actionTypes.changePickupTime, payload: { order } }),
  changeCustomerPhase: (order) => ({ type: actionTypes.changeCustomerPhase, payload: { order } }),
  customerArrived: (order) => ({ type: actionTypes.customerArrived, payload: { order } })
};

export function* saga() {
}
