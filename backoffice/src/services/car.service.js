import { methodGet, methodDelete, methodPut, methodPost } from './methods';


export const addVehicle = async (query) => {
    return methodPost('/vehicle/', query);
};

export const takeVehicle = async (search = '', query) => {
    return methodGet(`/vehicle/${search !== '' ? `${search}/` : ''}`, query);
};

export const modifyVehicle = async (id, query) => {
    return methodPut('/vehicle/' + id + '/', query);
};

export const deleteVehicle = async (id, query) => {
    return methodDelete('/vehicle/' + id + '/', query);
};
