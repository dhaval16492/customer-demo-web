import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';
import * as yup from 'yup';
import { ICustomer } from '../models/customer';
import { useFormik } from 'formik';

/***
 * Define the props for the CustomerDialog component
 */
interface CustomerDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (customer: ICustomer) => void;
    customer: ICustomer;
}

const CustomerDialog: React.FC<CustomerDialogProps> = ({ open, onClose, onSave, customer }) => {
    /**
     * State to hold the customer data
     */
    const [customerData, setCustomerData] = useState<ICustomer>(customer);

    /**
     * Define the validation schema for the form
     */
    const validationSchema = yup.object({
        name: yup.string().required('Name is required'),
        age: yup.string().required('Age is required'),
        postCode: yup.string().required('Post Code is required'),
        height: yup.string().required('Height is required'),
    });

    /**
     * Initialize formik for form handling
     */
    const formik = useFormik({
        initialValues: {
            id: customerData.id || 0,
            name: customerData.name || '',
            age: customerData.age || null,
            postCode: customerData.postCode || '',
            height: customerData.height || null,
        },
        validationSchema: validationSchema,
        onSubmit: (values: ICustomer) => {
            // Handle form submission here
            handleSave(values);
        },
    });

    /**
     * Use effect to set initial form values
     */
    useEffect(() => {
        setCustomerData(customer);
        formik.setValues({
            id: customer.id || 0,
            name: customer.name || '',
            age: customer.age || null,
            postCode: customer.postCode || '',
            height: customer.height || null,
        });
    }, [customer]);

    /**
     * Handle save button click
     * @param values
     */
    const handleSave = (values: ICustomer) => {
        onSave(values);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} >
            <form onSubmit={formik.handleSubmit}>
                <DialogTitle>{(customer.id ?? 0) > 0 ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
                <DialogContent>
                    <Box sx={{
                        '& .MuiTextField-root': { m: 1 },
                    }}>
                        <div>
                            <TextField
                                label="Name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name ? formik.errors.name : ''}
                            />
                            <TextField
                                label="Age"
                                name="age"
                                value={formik.values.age === null ? '' : formik.values.age}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.age && Boolean(formik.errors.age)}
                                helperText={formik.touched.age && formik.errors.age ? formik.errors.age : ''}
                            />
                            <TextField
                                label="PostCode"
                                name="postCode"
                                type="postCode"
                                value={formik.values.postCode}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.postCode && Boolean(formik.errors.postCode)}
                                helperText={formik.touched.postCode && formik.errors.postCode ? formik.errors.postCode : ''}
                            />
                            <TextField
                                label="Height"
                                name="height"
                                type="number"
                                value={formik.values.height === null ? '' : formik.values.height}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.height && Boolean(formik.errors.height)}
                                helperText={formik.touched.height && formik.errors.height ? formik.errors.height : ''}
                            />
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </form>
        </Dialog >
    );
};

export default CustomerDialog;
