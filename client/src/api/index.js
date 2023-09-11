import axios from 'axios';

const GAMEAPI = axios.create({ baseURL: `http://localhost:5000` });
const MAPAPI = axios.create({ baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places` });

GAMEAPI.interceptors.request.use((req) => {
    const userProfile = localStorage.getItem('profile');

    if (userProfile)
        req.headers.Authorization = `Bearer ${JSON.parse(userProfile).token}`;
    else
        req.headers.Authorization = '';

    return req;
});

const GEOCODING_PARAMS = `limit=4&access_token=${process.env.REACT_APP_GEOCODING_API_KEY}`;

export const getSuggestedAddress = (address) => MAPAPI.get(`/${address}.json?${GEOCODING_PARAMS}`);

export const fetchHostedGames = () => GAMEAPI.get(`/game`);
export const fetchNearbyGames = (lat, lng, sport, distance, start, end) => GAMEAPI.get(`/game/nearby?lat=${lat}&lng=${lng}&distance=${distance}&sport=${sport}&start=${start}&end=${end}`);

export const placeJoinRequest = (gameId) => GAMEAPI.post(`/game/request`, gameId);
export const deleteJoinRequest = (requestId) => GAMEAPI.delete(`/game/request/${requestId}`);
export const updateRequestStatus = (data) => GAMEAPI.patch(`/game/request/update`, data);

export const getPlayersJoinedGameRequests = () => GAMEAPI.get(`/game/joined_game_request`);
export const getJoinedGames = () => GAMEAPI.get(`/game/joined_game`);
export const removePlayerFromGame = (joinedGameId) => GAMEAPI.delete(`/game/joined_game/${joinedGameId}`);

export const hostGame = (gameInfo) => GAMEAPI.patch(`/game/host`, gameInfo);
export const deleteGame = (gameId) => GAMEAPI.delete(`/game/host/${gameId}`);

export const signIn = (formData) => GAMEAPI.post('/user/signin', formData);
export const signUp = (formData) => GAMEAPI.post('/user/signup', formData);
export const updateProfile = (formData) => GAMEAPI.patch('/user/updateProfile', formData);
