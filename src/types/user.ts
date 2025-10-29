export interface User {
  id: string;
  email: string;
  name: string;
  businessName: string;
  businessAddress: string;
  phone: string;
  gstNo: string;
  bankDetails: {
    bankName: string;
    accountNo: string;
    ifsc: string;
  };
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  businessName: string;
  businessAddress: string;
  phone: string;
  gstNo?: string;
}