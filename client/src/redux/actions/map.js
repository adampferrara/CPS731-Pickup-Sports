import * as api from '../../api';

export const getSuggestedAddress = (address) => async () => {
    try {
        address = address.toLowerCase().replaceAll(' ', '%20');
        const { data: { features } } = await api.getSuggestedAddress(address);

        return features;
    } catch (error) {
        const { data: { message } } = error.response;
        return message;
    }

};