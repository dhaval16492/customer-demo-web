export interface ICustomer {
    id: number;
    name: string;
    age: number | null;
    postCode: string;
    height: number | null;
}
export const initialCustomer: ICustomer = {
    id: 0,
    name: '',
    age: null,
    postCode: '',
    height: null
}