import {
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware,
} from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  userLoginReducer,
  userRegisterReducer,
  userEmailConfirmReducer,
  userEmailResendReducer,
} from './reducers/userReducers';
import {
  projectCreateReducer,
  projectSetCurrentReducer,
  projectGetDataReducer,
} from './reducers/projectReducers';

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userEmailConfirm: userEmailConfirmReducer,
  userEmailResend: userEmailResendReducer,
  projectCreate: projectCreateReducer,
  projectSetCurrent: projectSetCurrentReducer,
  projectGetData: projectGetDataReducer,
});

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userLogin: {
    userInfo: userInfoFromStorage,
    loading: userInfoFromStorage && userInfoFromStorage.token ? true : false,
  },
};

const middleware = [thunk];

const createStore = reduxCreateStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default createStore;