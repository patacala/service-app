import { ChipOption } from "@/design-system";

export interface ProviderFormData {
  title: string;
  phone: string;
  city: string;
  address: string;
  selectedServices: string[];
  selectedServiceOptions: ChipOption[];
  description: string;
  media: string[];
  addressService: string;
  pricePerHour: number;
}