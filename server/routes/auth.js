import express from 'express';
import { login, logout, investments, cmsverticalformdata, investmentsCount, homeloansCount, insuranceCount, orderbookCount } from '../controllers/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/investments', investments);
router.get('/cmsverticalformdata', cmsverticalformdata);
router.get('/investmentscount', investmentsCount);
router.get('/homeloanscount', homeloansCount);
router.get('/insurancecount', insuranceCount);
router.get('/orderbookcount', orderbookCount);



export default router;
