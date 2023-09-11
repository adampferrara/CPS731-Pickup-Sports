import { combineReducers } from 'redux';

import games from './games';
import theme from './theme';
import auth from './auth';
import request from './request';
import joinedGames from './joinedgames';

export default combineReducers({ games, theme, auth, request, joinedGames });