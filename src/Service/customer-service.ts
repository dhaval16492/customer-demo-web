import { ICustomer } from "../models/customer";
import axios from 'axios';

const customerApiUrl: string = 'https://localhost:7287/api/customer';
export async function getCustomer() {
    const response: ICustomer[] = await axios
        .get(customerApiUrl)
        .then(res => {
            console.log('res', res);
            return res.data;
        })
        .catch(error => {
            throw error.response?.data?.error;
        });

    return response;

}
export async function saveCustomer(customer: ICustomer) {
    const response: ICustomer[] = await axios
        .post(customerApiUrl, customer)
        .then(res => {
            return res.data;
        })
        .catch(error => {
            throw error.response?.data?.error;
        });
    console.log('error 1', response);

    return response;

}

export async function updateCustomer(customer: ICustomer) {
    const response: ICustomer[] = await axios
        .put(customerApiUrl, customer)
        .then(res => {
            console.log('res', res.data);
            return res.data;
        })
        .catch(error => {
            throw error.response?.data?.error;
        });

    return response;

}

export async function deleteCustomer(id: number) {
    const response: ICustomer[] = await axios
        .delete(`${customerApiUrl}/${id}`)
        .then(res => {
            return res.data;
        })
        .catch(error => {
            throw error.response?.data?.error;
        });

    return response;

}