import {
  COUNTRY_LIST_REQUEST,
  COUNTRY_LIST_SUCCESS,
  COUNTRY_LIST_FAIL,
  COUNTRY_FILTER,
  LOAD_MORE,
  SET_SELECTED,
  CLEAR_SELECTED,
  CLEAR_QUERY,
  SET_QUERY,
  PER_PAGE,
  CLEAR_AFTER,
} from '../constants/countryPickerConstants';

export const countryPickerReducer = (
  state = {
    countries: [],
    filtered: null,
    selected: null,
    loaded: [],
    query: '',
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
        filtered: state.countries.filter((country) =>
          country.name.toLowerCase().includes(action.payload.toLowerCase())
        ),
        loaded: state.countries
          .filter((country) =>
            country.name.toLowerCase().includes(action.payload.toLowerCase())
          )
          .slice(0, PER_PAGE),
        after: PER_PAGE,
        more: true,
      };
    case LOAD_MORE:
      return {
        ...state,
        loaded: [...state.loaded, ...action.payload],
        more: action.payload.length !== PER_PAGE ? false : true,
        after: state.after + PER_PAGE,
      };
    case SET_QUERY:
      return {
        ...state,
        query: action.payload,
      };
    case CLEAR_QUERY:
      return {
        ...state,
        query: '',
      };
    case SET_SELECTED:
      return {
        ...state,
        selected: action.payload,
      };
    case CLEAR_SELECTED:
      return {
        ...state,
        selected: null,
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
