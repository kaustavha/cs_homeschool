import RocketService from '../services/RocketService';

export const ACTIONS = {
    REQUEST_ROCKET: 'REQUEST_ROCKET',
    RECEIVE_ROCKET: 'RECEIVE_ROCKET'
};

export const requestRocket = () => ({
  type: ACTIONS.REQUEST_ROCKET
});

const recieveRocket = response => ({
  type: ACTIONS.RECEIVE_ROCKET,
  payload: {
    rocket: response.data
  }
});

export const fetchRocket = (dispatch, rocketId) => {
  dispatch(requestRocket());
  return RocketService.get(rocketId).then(response => dispatch(recieveRocket(response)));
};
