export type AddressValidationStatus = 'valid' | 'warning' | 'error' | 'unknown';

export interface AddressValidationIssue {
  field: string;
  message: string;
}

export interface AddressValidationResponse {
  status: AddressValidationStatus;
  errors: AddressValidationIssue[];
  warnings: AddressValidationIssue[];
  suggestions: any[];
}

export interface StoreAddressSettings {
  allowed_countries: string[];
  required_fields: string[];
  validation_rules: Record<string, Record<string, { pattern: string; example?: string }>>;
  require_phone: boolean;
  require_company: boolean;
  allow_po_boxes: boolean;
}

export const DEFAULT_STORE_ADDRESS_SETTINGS: StoreAddressSettings = {
  allowed_countries: [],
  required_fields: ['first_name', 'last_name', 'address_line_1', 'city', 'state', 'postal_code', 'country'],
  validation_rules: {},
  require_phone: false,
  require_company: false,
  allow_po_boxes: true,
}

export interface Address {
  id: number;
  user_id: number;
  type: 'shipping' | 'billing' | 'both';
  is_default: boolean;
  first_name: string;
  last_name: string;
  full_name: string;
  company: string | null;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string | null;
  full_address: string;
  created_at: string;
  updated_at: string;
}
