import 'intersection-observer';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Custom Hook
import useOutsideClick from '../utils/useOutsideClick';

import GlobalStyles from '../styles/GlobalStyles';
import styled from 'styled-components';

import {
  getCountries,
  filterCountries,
  setSelectedCountry,
  loadMoreCountries,
  clearCountry,
} from '../actions/countryPickerActions';

import ChevronIcon from '../assets/images/chevron-down.svg';

const CountryPickerContainer = styled.div`
  width: 200px;
`;

const PlaceholderContainer = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  left: 11px;
  overflow: hidden;
  height: 36px;
  width: 180px;
`;

const Placeholder = styled.span`
  color: #637480;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  background-color: #fff;
  border: 1px solid #d8d2cc;
  border-radius: 4px;
  height: 36px;
  width: 100%;
  &:focus {
    box-shadow: 0 0 0 2pt #4134ff;
  }
`;

const Input = styled.input`
  cursor: default;
  height: 100%;
  width: 100%;
  border: none;
  padding: 0 11px;
  background-color: transparent;
  z-index: 10;
  font-size: 14px;
`;

const InputIcon = styled.label`
  position: absolute;
  right: 7px;
  height: 16px;
`;

const CountryListContainer = styled.div`
  border-radius: 4px;
  overflow: scroll;
  box-shadow: 0px 0px 12px 5px rgba(0, 0, 0, 0.2);
`;

const CountryList = styled.ul`
  max-height: 180px;
  margin: 8px 0;
`;

const Country = styled.li`
  min-height: 36px;
  width: 100%;
  padding: 0 21px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    color: #4134ff;
    background-color: #fbfafa;
  }
  &.selected {
    color: #4134ff;
    background-color: #f2f3ff;
  }
`;

const CountryImage = styled.img`
  margin-right: 14px;
`;

const SelectedCountryImage = styled.img`
  margin-right: 7px;
  margin-left: 1px;
`;

const CountryPicker = () => {
  // Redux State
  const dispatch = useDispatch();
  const countryPicker = useSelector((state) => state.countryPicker);
  const {
    loading,
    countries,
    selected,
    filtered,
    query,
    after,
    loaded,
    more,
  } = countryPicker;

  // Get Countries
  useEffect(() => {
    dispatch(getCountries());
  }, [dispatch]);

  // Component State
  const [isOpen, setIsOpen] = useState(false);
  const [element, setElement] = useState(null);

  const countriesList = filtered !== null ? filtered : countries;

  // Infinite Scroll
  const load = () => {
    dispatch(loadMoreCountries(countriesList, after));
  };

  const loader = useRef(load);

  useEffect(() => {
    loader.current = load;
  }, [load]);

  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          loader.current();
        }
      },
      {
        threshold: 1,
        root: document.querySelector('#infinite-scroll'),
      }
    )
  );

  useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [element]);

  // Track Outside Click
  const containerRef = useRef();
  useOutsideClick(containerRef, () => setIsOpen(false));

  // Event Handlers
  const toggleDropDown = () => setIsOpen(true);
  const onChangeHandler = (e) => dispatch(filterCountries(e.target.value));

  const onKeyDownHandler = (e) => {
    if (selected !== null && e.keyCode === 8) {
      dispatch(clearCountry());
    }
  };

  const onClickHandler = (name, flag) => {
    dispatch(
      setSelectedCountry({
        name,
        flag,
      })
    );
    setIsOpen(false);
  };

  return (
    <>
      <GlobalStyles />
      {loading ? (
        <span>Loading...</span>
      ) : (
        <CountryPickerContainer ref={containerRef}>
          <InputContainer>
            <Input
              id="search"
              type="text"
              onChange={onChangeHandler}
              onKeyDown={onKeyDownHandler}
              onFocus={toggleDropDown}
              value={query}
              autoComplete="off"
            />
            {!query && (
              <PlaceholderContainer>
                {selected ? (
                  <>
                    <SelectedCountryImage
                      src={selected.flag}
                      alt={selected.name}
                      width="16px"
                    />
                    <span>{selected.name}</span>
                  </>
                ) : isOpen ? (
                  <Placeholder>Search</Placeholder>
                ) : (
                  <Placeholder>Select</Placeholder>
                )}
              </PlaceholderContainer>
            )}
            <InputIcon htmlFor="search">
              <img src={ChevronIcon} alt="Chevron" />
            </InputIcon>
          </InputContainer>
          {isOpen && countries && (
            <CountryListContainer id="infinite-scroll">
              <CountryList>
                {loaded !== null &&
                  loaded.map((country) => (
                    <Country
                      key={country.name}
                      onClick={() => onClickHandler(country.name, country.flag)}
                      className={
                        selected !== null &&
                        selected.name === country.name &&
                        'selected'
                      }
                    >
                      <CountryImage
                        src={country.flag}
                        alt={country.name}
                        width="16px"
                      />
                      {country.name}
                    </Country>
                  ))}
                {more && <li style={{ height: '8px' }} ref={setElement}></li>}
              </CountryList>
            </CountryListContainer>
          )}
        </CountryPickerContainer>
      )}
    </>
  );
};

export default CountryPicker;
