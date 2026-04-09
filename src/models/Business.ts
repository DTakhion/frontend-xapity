import { Modifier } from './Pagination';

export interface ICreateBusinessEntity {
  user: string;
  password: string;
  nombreFantasia?: string;
}

interface BusinessData {
  phone?: string; //Phone viene en data
  iataCode?: string;
  resolutionNumber?: string;
  resolutionDate?: string;
  siiElectronicInvoiceAffected?: boolean;
  razonSocial?: string;
  businessGiro?: string;
  representativeName?: string;
  representativeRut?: string;
  rutSendBooks?: string;
  ppChecks?: string;
  accountantName?: string;
  accountantRut?: string;
  retentionPercentage?: string;
  taxPercentage?: string;

  currencies?: {
    mainCurrency: {
      name: string;
      mask: string;
    };
    secondCurrency: {
      name: string;
      conversionRate: string;
      mask: string;
    };
    thirdCurrency: {
      name: string;
      conversionRate: string;
      mask: string;
    };
  };

  documents?: {
    documentAffectedNormal: string;
    documentExemptNormal: string;
    documentAffectedElectronic: string;
    documentExemptElectronic: string;
    creditNoteAffectedNormal: string;
    creditNoteExemptNormal: string;
    creditNoteAffectedElectronic: string;
    creditNoteExemptElectronic: string;
    debitNoteAffectedElectronic: string;
    debitNoteExemptElectronic: string;
    invoiceFactureExport: string;
    billSaleExport: string;
    invoiceAffectedForm: string;
    invoiceExemptForm: string;
    creditNoteAffectedForm: string;
    creditNoteExemptForm: string;
    invoiceForm: string;
    billSaleForm: string;
    validateId: string;
    issueInvoiceType: string;
    approveVoucherAutomatically: string;
    invoiceClientNationalForeigner: string;
  };
}

export interface CreateBusinessDto {
  name: string;
  rut: string;
  email: string;
  address?: string;
  phone?: string;

  data?: BusinessData
}

export interface IGetBusinessEntity {
  id: number;
  name: string;
  rut: string;
  organizationId: number;
  createdAt: Date;
  updatedAt: Date;
  address?: string;
  email: string;
  imageId: number;
  modifier: Modifier
  data?: BusinessData
}

export interface UpdateBusinessDto extends CreateBusinessDto {
  id: number | undefined;
}
