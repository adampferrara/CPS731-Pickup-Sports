import React, { useState, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { getNearbyGames } from '../../redux/actions/games';
import { getSuggestedAddress } from '../../redux/actions/map';

import './SearchBox.css';



const SearchBar = ({ isUsingMap = true, setCoords, setAddress, setCenterCoords, filter, setfilter, defaultAddress = "", placeholder = "Find Nearby Game" }) => {
  const [searchInput, setsearchInput] = useState(defaultAddress);
  const [suggestLocation, setsuggestLocation] = useState([]);
  const dispatch = useDispatch();
  const input = useRef(null);

  const onChange = e => {
    const value = e.target.value;
    setsearchInput(value);

    if (value.trim()) {
      dispatch(getSuggestedAddress(value)).then((data) => {
        if (data) {
          setsuggestLocation(data);
        }
      });
    }
    else {
      setsuggestLocation([]);
    }
  };

  const onLocationClick = (data) => {
    setsuggestLocation([]);
    setsearchInput(data.place_name);

    if (setCoords && setAddress) {
      setCoords(data.geometry.coordinates);
      setAddress(data.place_name);
    }

    if (isUsingMap) {
      setCenterCoords(data.geometry.coordinates);
      filter.coords = [data.geometry.coordinates[1], data.geometry.coordinates[0]];
      setfilter(filter);
      dispatch(getNearbyGames(filter));
    }
  };

  return (
    <div className="flex">
      <form className="form">
        <FaSearch className="searchIcon" />

        <input
          type="text"
          name="text"
          placeholder={placeholder}
          value={searchInput}
          onChange={onChange}
          className="searchBox"
          ref={input}
        />
      </form>

      {
        suggestLocation.length > 0 && (
          <div className="suggestion_container">
            {
              suggestLocation.map((data, _) => (
                <div className="suggestion" key={data.id} onClick={() => onLocationClick(data)}>
                  <p className="suggestion_name">{data.text}</p>
                  <p className="suggestion_address">{data.place_name}</p>
                </div>
              ))
            }
          </div>
        )

      }

    </div>
  );
};

export default SearchBar;