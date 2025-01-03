export type Address = {
  street: string;
  additional?: string;
  zip: string;
  city: string;
  country: string;
};

export type InvoiceAddress = Address & {
  company?: string;
  companyId?: string;
  taxId?: string;
  vatId?: string;
};
