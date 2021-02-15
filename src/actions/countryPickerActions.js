import axios from 'axios';
import {
  COUNTRY_LIST_REQUEST,
  COUNTRY_LIST_SUCCESS,
  COUNTRY_LIST_FAIL,
  COUNTRY_FILTER,
  CLEAR_FILTERED,
  LOAD_MORE,
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

export const filterCountries = (countries, query) => (dispatch) =>
  dispatch({
    type: COUNTRY_FILTER,
    payload: countries.filter((country) =>
      country.name.toLowerCase().includes(query.toLowerCase())
    ),
  });

export const loadMoreCountries = (countries, after) => (dispatch) =>
  dispatch({
    type: LOAD_MORE,
    payload: countries.slice(after, after + PER_PAGE),
  });

export const clearCountry = () => (dispatch) => {
  dispatch({ type: CLEAR_FILTERED });
};
