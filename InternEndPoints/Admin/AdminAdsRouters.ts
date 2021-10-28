import Ads from "../../Schemas/Ads";

const express = require('express');
const _EndPoints = require("../../InternEndPoints/Admin/_EndPoints");

const  AdminAdsRouter = express.Router()

AdminAdsRouter.use('/', _EndPoints(Ads))

module.exports = AdminAdsRouter;














