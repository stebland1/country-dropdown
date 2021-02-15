import {
  COUNTRY_LIST_REQUEST,
  COUNTRY_LIST_SUCCESS,
  COUNTRY_LIST_FAIL,
  COUNTRY_FILTER,
  CLEAR_FILTERED,
  CLEAR_AFTER,
  LOAD_MORE,
  PER_PAGE,
} from '../constants/countryPickerConstants';

export const countryPickerReducer = (
  state = {
    countries: [],
    filtered: null,
    loaded: [],
    more: true,
    after: 0,
  },
  action
) => {
  switch (action.type) {
    case COUNTRY_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        countries: [],
      };
    case COUNTRY_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        countries: action.payload,
      };
    case COUNTRY_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case COUNTRY_FILTER:
      return {
        ...state,
        filtered: action.payload,
        loaded: action.payload.slice(0, PER_PAGE),
        after: PER_PAGE,
        more: true,
      };
    case CLEAR_FILTERED:
      return {
        ...state,
        filtered: null,
        loaded: [],
        more: true,
      };
    case LOAD_MORE:
      return {
        ...state,
        loaded: [...state.loaded, ...action.payload],
        more: action.payload.length !== PER_PAGE ? false : true,
        after: state.after + PER_PAGE,
      };
    case CLEAR_AFTER:
      return {
        ...state,
        after: 0,
      };
    default:
      return state;
  }
};
