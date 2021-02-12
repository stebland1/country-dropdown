import axios from 'axios';
import {
  COUNTRY_LIST_REQUEST,
  COUNTRY_LIST_SUCCESS,
  COUNTRY_LIST_FAIL,
  COUNTRY_FILTER,
  CLEAR_SELECTED,
  CLEAR_QUERY,
  CLEAR_AFTER,
  LOAD_MORE,
  SET_SELECTED,
  SET_QUERY,
  PER_PAGE,
} from '../constants/countryPickerConstants';

export const getCountries = () => async (dispatch) => {
  try {
    dispatch({ type: COUNTRY_LIST_REQUEST });

    const { data } = await axios.get(
      'https://restcountries.eu/rest/v2/all?fields=name;currencies;flag'
    );

    dispatch({
      type: COUNTRY_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COUNTRY_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const filterCountries = (query) => (dispatch) => {
  dispatch({ type: SET_QUERY, payload: query });
  dispatch({ type: COUNTRY_FILTER, payload: query });
};

export const setSelectedCountry = (selected) => (dispatch) => {
  dispatch({ type: SET_SELECTED, payload: selected });
  dispatch({ type: CLEAR_QUERY });
};

export const loadMoreCountries = (countriesList, after) => (dispatch) => {
  const countriesToLoad = countriesList.slice(after, after + PER_PAGE);

  dispatch({ type: LOAD_MORE, payload: countriesToLoad });
};

export const clearCountry = () => (dispatch) => {
  dispatch({ type: CLEAR_SELECTED });
  dispatch({ type: CLEAR_QUERY });
  dispatch({ type: CLEAR_AFTER });
  dispatch(filterCountries(''));
};
