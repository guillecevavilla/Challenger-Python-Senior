import { methodGet, methodDelete, methodPatch, methodPost } from './methods';

export const getSearchUser = async (search) => {
    return methodGet(`/commons/search-user/?search=${search}`);
};

export const addPeople = async (query) => {
    return methodPost('/people/', query);
};

export const takePeople = async (search = '', query) => {
    return methodGet(`/people/${search !== '' ? `${search}/` : ''}`, query);
};

export const modifyPeople = async (id, query) => {
    return methodPatch('/people/' + id + '/', query);
};

export const deletePeople = async (id, query) => {
    return methodDelete('/people/' + id + '/', query);
};

export const addOficial = async (query) => {
    return methodPost('/oficial/', query);
};

export const takeOficial = async (search = '', query) => {
    return methodGet(`/oficial/${search !== '' ? `${search}/` : ''}`, query);
};

export const modifyOficial = async (id, query) => {
    return methodPatch('/oficial/' + id + '/', query);
};

export const deleteOficial = async (id, query) => {
    return methodDelete('/oficial/' + id + '/', query);
};

export const takeOficialToken = async (query) => {
    return methodPost('/oficial-token/', query);
};