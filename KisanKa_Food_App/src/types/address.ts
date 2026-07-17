export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  house: string;
  area: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  label: "Home" | "Work" | "Other";
  isDefault: boolean;
}
