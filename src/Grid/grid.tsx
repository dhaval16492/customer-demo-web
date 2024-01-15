import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import 'react-toastify/dist/ReactToastify.css';
import { ICustomer, initialCustomer } from '../models/customer';
import CustomerDialog from './add-edit-dialog';
import DeleteConfirmationDialog from '../ConfirmDialog/confirm-dialog';
import { ToastContainer, toast } from 'react-toastify';
import { deleteCustomer, getCustomer, saveCustomer, updateCustomer } from '../Service/customer-service';

const CustomerGrid = () => {
    /**
     * State management
     */
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedCustomer, setSelectedCustomer] = useState<ICustomer>(initialCustomer);
    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [deleteCustomerId, setDeleteCustomerId] = useState<number>(0);   
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

    /**
     * Define column configurations
     */
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 0 },
        { field: 'name', headerName: 'Name', width: 250 },
        { field: 'age', headerName: 'Age', width: 100 },
        { field: 'postCode', headerName: 'Post Code', width: 100 },
        { field: 'height', headerName: 'Height (meters)', width: 150 },
        {
            field: 'edit',
            headerName: 'Edit',
            sortable: false,
            width: 100,
            renderCell: (params) => (
                <IconButton color="primary" onClick={() => handleEditCustomer(params.row)}>
                    <EditIcon />
                </IconButton>
            ),
        },
        {
            field: 'delete',
            headerName: 'Delete',
            sortable: false,
            width: 100,
            renderCell: (params) => (
                <IconButton color="secondary" onClick={() => handleDeleteClick(params.row.id)}>
                    <DeleteIcon />
                </IconButton>
            ),
        },
    ];

    /**
     * Use effects to dispatch actions, handle responses, and set initial values
     */
    useEffect(() => {
        if (customers.length === 0) {
            getCustomers();
        }
    }, []);

    const getCustomers = async () => {
        setIsLoading(true);
        const res: ICustomer[] = await getCustomer();
        if (res && res.length > 0) {
            setCustomers(res);
            setIsLoading(false);
        }

    }

    /**
     * Functions to open dialogs for adding, editing, and deleting customers
     */
    const handleOpenDialog = () => {
        let customer: ICustomer = { ...initialCustomer };
        setSelectedCustomer(customer); // Clear the selected customer for adding a new customer
        setDialogOpen(true);
    };

    const handleEditCustomer = (customer: ICustomer) => {
        setSelectedCustomer(customer); // Set the selected customer for editing
        setDialogOpen(true);
    };

    const handleSaveCustomer = (customerData: ICustomer) => {
        setIsLoading(true);
        if (customerData.id) {
            // If the customer has an "id," it's an existing customer, so update it
            updateCustomer(customerData).then(() => {
                getCustomers();
                setIsLoading(false);
                toast.success('Customer updated successfully.', { autoClose: 2000 });
            }).catch((error) => {
                setIsLoading(false);
                toast.error(error, { autoClose: 2000 });
            });
        } else {
            // If the customer doesn't have an "id," it's a new customer, so add it
            saveCustomer(customerData).then(() => {
                getCustomers();
                setIsLoading(false);
                toast.success('Customer added successfully.', { autoClose: 2000 });
            }).catch((error) => {
                setIsLoading(false);
                toast.error(error, { autoClose: 2000 });
            });
        }
        setDialogOpen(false);
    };

    const handleDeleteClick = (id: number) => {
        // Set the customer ID for deletion and open the delete confirmation dialog
        setDeleteCustomerId(id);
        setDeleteDialogOpen(true);
    };

    /**
     * Handle the customer deletion confirmation
     */
    const handleDeleteConfirm = () => {
        setDeleteCustomerId(0);
        setDeleteDialogOpen(false);
        deleteCustomer(deleteCustomerId).then(() => {
            getCustomers();
            toast.success('Customer updated successfully.', { autoClose: 2000 });
        }).catch((error) => {
            toast.error(error, { autoClose: 2000 });
        });;
    }

    // Custom "No Data" overlay component
    const CustomNoRowsOverlay = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                    <h4>No Data Available</h4>
                    <p>There are no rows to display.</p>
                </div>
            </div>
        );
    };
    return (
        <>
            <ToastContainer />
            <Grid container spacing={2}>
                <Grid item xs={8} sx={{ display: 'flex' }}>
                </Grid>
                <Grid item xs={4} sx={{ justifyContent: 'right', display: 'flex', gap: 2 }}>
                    <Button onClick={handleOpenDialog} variant="outlined" color="primary">
                        Add Customer
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <div style={{ height: 400 }}>
                        <DataGrid
                            rows={customers}
                            columns={columns}
                            loading={isLoading }
                            disableRowSelectionOnClick
                            slots={{ noRowsOverlay: CustomNoRowsOverlay }}
                        />
                    </div>
                </Grid>
            </Grid>
            <CustomerDialog
                open={isDialogOpen}
                onClose={() => setDialogOpen(false)}
                onSave={handleSaveCustomer}
                customer={selectedCustomer}
            />
            <DeleteConfirmationDialog
                open={isDeleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
};
export default CustomerGrid;
