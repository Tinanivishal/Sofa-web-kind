const customer=require('../services/customer');
const {StatusCodes}=require('http-status-codes');
const catchAsync=require('../utils/catchAsync');

const getcustomers=catchAsync(async(req,res)=>{
    const customers=await customer.getcustomers();
    res.status(StatusCodes.OK).json(customers);
});

const getcustomerById=catchAsync(async(req,res)=>{
    const customerById=await customer.getcustomerById(req.params.id);
    res.status(StatusCodes.OK).json(customerById);
});

const deletecustomer=catchAsync(async(req,res)=>{
    await customer.deletecustomer(req.params.id);
    res.status(StatusCodes.NO_CONTENT).send();
});

module.exports={
    getcustomers,
    getcustomerById,
    deletecustomer,
};