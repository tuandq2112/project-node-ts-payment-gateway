import ChargeController from '@/controllers/charge.controller';
import { PagingDTO } from '@/dtos/base/PagingDTO';
import { ChargeDetailDTO } from '@/dtos/charge/charge.detail.dto';
import { CreateInvoiceDTO } from '@/dtos/charge/create.invoice.dto';
import authMiddleware from '@/middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { Routes } from '@interfaces/routes.interface';
import { Router } from 'express';

class ChargeRoute implements Routes {
  public path = '';
  public router = Router();
  public chargeController = new ChargeController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(`${this.path}/invoices`, authMiddleware, validationMiddleware(CreateInvoiceDTO, 'body'), this.chargeController.createInvoice);

    this.router.get(`${this.path}/invoices`, authMiddleware, validationMiddleware(PagingDTO, 'query'), this.chargeController.getInvoices);
    this.router.get(`${this.path}/charges/:code`, validationMiddleware(ChargeDetailDTO, 'params'), this.chargeController.getInvoiceByCode);
  }
}

export default ChargeRoute;
