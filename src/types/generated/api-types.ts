// ⚠️ This file is auto-generated. Do not edit manually.

export interface IHistoryEndpoint {
  createdAt: string;
  updateAt: string;
}

export type AddressType = 'pickup' | 'delivery';
export type CustomerType = 'organization' | 'private_customer';
export type IPricingType = 'distance' | 'city';


// Enum Types (extracted from inline enum properties in OpenAPI schemas)
export type AddressMandatoryType = "pickup" | "delivery" | "starting_point" | "billing";
export type AuditLogAction = "CREATE" | "UPDATE" | "DELETE";
export type ContactRequestContext = "founding-setup" | "enterprise" | "demo";
export type ContactRequestVolume = "1-50" | "50-200" | "200-500" | "500+";
export type CreatePromoCodeDuration = "once" | "repeating" | "forever";
export type CreatePromoCodeRuleType = "ELIGIBLE_PLAN_IDS";
export type DriverScheduleStatus = "planned" | "active" | "completed" | "cancelled";
export type DriverScheduleTimeSlotType = "work" | "break" | "lunch" | "meeting" | "unavailable";
export type DriverScheduleType = "regular" | "overtime" | "on_call" | "emergency";
export type GlobalSettingPricingType = "distance" | "city";
export type InviteUserRoles = "ROLE_CUSTOMER" | "ROLE_CUSTOMER_ADMIN" | "ROLE_DELIVERER" | "ROLE_MANAGER" | "ROLE_MANAGER_ADMIN";
export type OrderCustomerType = "private_customer" | "organization";
export type PlanFeatureKey = "max_users" | "max_drivers" | "max_orders_per_month" | "max_quotes_per_month" | "max_invoices_per_month" | "max_customers" | "max_vehicles" | "max_warehouses" | "max_pricing_configs" | "max_prestations" | "max_address_searches_per_month" | "max_route_calculations_per_month" | "can_create_quotes" | "can_create_invoices" | "can_use_dispatch" | "can_use_planning" | "can_use_messaging" | "can_manage_fleet" | "can_view_audit_logs" | "can_use_api" | "can_configure_stripe" | "can_use_premium_address_search" | "can_use_route_optimization";
export type PlanType = "standard" | "custom";
export type SubscriptionSource = "stripe" | "manual";
export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled";
export type TimeSlotDayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export type VehicleType = "bike" | "cargo_bike" | "scooter" | "motorbike" | "car" | "van" | "truck" | "electric_van" | "electric_bike" | "pedestrian";
export type WeightPricingTierType = "fixed" | "per_kg";

export interface IActivateAccountDto {
  token: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string;
  picture?: string;
}

export interface IAddress {
  id: string;
  tenant?: ITenant;
  name: string;
  streetNumber: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  type: string;
  phoneNumber?: string;
  secondaryPhoneNumber?: string;
  additionalInformation?: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  fullAddress: string;
}

export interface IAddressDto {
  phoneNumber?: string;
  secondaryPhoneNumber?: string;
  additionalInformation?: string;
  name: string;
  streetNumber: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  type: string;
  fullAddress: string;
}

export interface IAddressMandatoryDto {
  name: string;
  streetNumber: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  type: AddressMandatoryType;
  fullAddress: string;
}

export interface IAuditLog {
  id?: string;
  message?: string;
  action?: AuditLogAction;
  entityType?: string;
  entityId?: string;
  userEmail?: string;
  userId?: string;
  tenantId?: string;
  isImpersonated?: boolean;
  impersonatedByEmail?: string;
  impersonatedByName?: string;
  ip?: string;
  createdAt?: string;
  changes?: { [key: string]: unknown };
  impersonationSessionId?: string;
}

export interface IBankDetail {
  id: string;
  tenant?: ITenant;
  bankLabel: string;
  bankName: string;
  iban: string;
  bic: string;
  bankCode: string;
  accountNumber: string;
  accountHolderName: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  auditIdentifier: string;
}

export interface IChatMessage {
  id: string;
  tenantId: string;
  sender: IUser;
  recipient: IUser;
  content: string;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface IChatMessageDto {
  recipientId: string;
  content: string;
}

export interface ICityPricing {
  id: string;
  city: string;
  postalCode: string;
  creditAmount: number;
  cityPricingConfig?: ICityPricingConfig;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface ICityPricingConfig {
  id: string;
  cityPricingList: ICityPricing[];
  pricingConfig?: IPricingConfig;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  auditIdentifier: string;
}

export interface IContactRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  volume: ContactRequestVolume;
  context: ContactRequestContext;
  message?: string;
}

export interface ICreatePromoCodeDto {
  code: string;
  percentOff?: number;
  amountOff?: number;
  currency?: string;
  duration: CreatePromoCodeDuration;
  durationInMonths?: number;
  maxRedemptions?: number;
  expiresAt?: string;
  rules?: ICreatePromoCodeRuleDto[];
}

export interface ICreatePromoCodeRuleDto {
  type: CreatePromoCodeRuleType;
  value?: { [key: string]: unknown };
}

export interface IDeliveryPrestation {
  id: string;
  tenant: ITenant;
  label: string;
  description?: string;
  amount: number;
  pricingType: string;
  timeSlots: IDeliveryPrestationTimeSlot[];
  vehicle: IVehicle;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  auditIdentifier: string;
}

export interface IDeliveryPrestationTimeSlot {
  deliveryPrestation: IDeliveryPrestation;
  id: string;
  dayOfWeek?: string;
  startTime: string;
  endTime: string;
  validSlot: boolean;
}

export interface IDeliveryZone {
  id: string;
  tenant: ITenant;
  name: string;
  color?: string;
  description?: string;
  polygon?: unknown[];
  center?: unknown[];
  priority?: number;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  auditIdentifier: string;
}

export interface IDeliveryZoneDto {
  name: string;
  color?: string;
  description?: string;
  polygon?: unknown[];
  center?: unknown[];
  priority?: number;
  isActive?: boolean;
}

export interface IDistancePricing {
  id: string;
  distance: number;
  creditAmount: number;
  distancePricingConfig?: IDistancePricingConfig;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface IDistancePricingConfig {
  id: string;
  tenantId: string;
  label: string;
  distanceUnit: string;
  distancePricingList: IDistancePricing[];
  pricingConfig: IPricingConfig[];
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  auditIdentifier: string;
}

export interface IDriverSchedule {
  id: string;
  tenant: ITenant;
  driver: IUser;
  scheduledDate: string;
  status: string;
  scheduleType: string;
  preferredZone?: IDeliveryZone;
  excludedZones: IDeliveryZone[];
  maxDeliveryRadiusKm?: number;
  timeSlots: IDriverScheduleTimeSlot[];
  notes?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface IDriverScheduleDto {
  driverId: string;
  scheduledDate: string;
  status: DriverScheduleStatus;
  scheduleType: DriverScheduleType;
  preferredZoneId?: string;
  excludedZoneIds?: string[];
  maxDeliveryRadiusKm?: number;
  timeSlots?: IDriverScheduleTimeSlotDto[];
  notes?: string;
  isActive?: boolean;
}

export interface IDriverScheduleTimeSlot {
  driverSchedule: IDriverSchedule;
  slotType: string;
  description?: string;
  id: string;
  dayOfWeek?: string;
  startTime: string;
  endTime: string;
  validSlot: boolean;
}

export interface IDriverScheduleTimeSlotDto {
  startTime: string;
  endTime: string;
  slotType: DriverScheduleTimeSlotType;
  description?: string;
}

export interface IFeature {
  id: string;
  key: string;
  type: string;
  description?: string;
}

export interface IFeature2 {
  id: string;
  key: string;
  type: string;
}

export interface IFeature3 {
  id: string;
  key: string;
  type: string;
}

export interface IForgotPasswordDto {
  email: string;
}

export interface IGlobalSetting {
  id: string;
  tenantId: string;
  customerDefaultCreditPrice: number;
  orderMinimumCreditAmount: number;
  pricingType: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  auditIdentifier: string;
}

export interface IGlobalSettingDto {
  customerDefaultCreditPrice: number;
  orderMinimumCreditAmount: number;
  pricingType: GlobalSettingPricingType;
}

export interface IHistoryInterface {
  createdAt: string;
  updatedAt: string;
  archivedAt: string;
}

export interface IHubUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles?: string[];
}

export interface ImpersonationLog {
  id?: string;
  hubUserEmail?: string;
  hubUserFirstName?: string;
  hubUserLastName?: string;
  impersonatedUserEmail?: string;
  impersonatedUserFirstName?: string;
  impersonatedUserLastName?: string;
  createdAt?: string;
  tenant: ITenant2;
}

export interface InviteUserDto {
  email: string;
  roles: InviteUserRoles[];
  organizationId?: string;
  privateCustomerId?: string;
  customerRole: boolean;
}

export interface Invoice {
  id: string;
  tenant: ITenant;
  customerType: string;
  customerId: string;
  customerPhone?: string;
  tenantName: string;
  tenantAddress: string;
  tenantPhone?: string;
  tenantEmail: string;
  tenantLogo?: string;
  tenantSiretNumber: string;
  tenantVatNumber: string;
  tenantRCS: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerLogo?: string;
  customerSiretNumber?: string;
  customerVatNumber?: string;
  bankName: string;
  bankIban: string;
  bankBic: string;
  bankCode: string;
  bankAccountNumber: string;
  bankAccountHolderName: string;
  invoiceNumber: string;
  dueDate: string;
  sentDate?: string;
  paymentDate?: string;
  creditPrice: number;
  totalCredit?: number;
  subTotal: number;
  totalPrice: number;
  status: string;
  orders: IOrder[];
  relanceCount?: number;
  relancedAt?: string;
  totalWeight?: number;
  deliveryPrestationLabel?: string;
  deliveryPrestationPrice?: number;
  weightPrice?: number;
  totalVolume?: number;
  warehousePrice?: number;
  adjustmentsTotal?: number;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  auditIdentifier: string;
}

export interface InvoiceDto {
  orderIds: string[];
  customerId: string;
  customerType: OrderCustomerType;
}

export interface IOrder {
  id: string;
  reference: string;
  tenantId: string;
  customerId: string;
  customerType: string;
  pickupPoints: IOrderPickupPoint[];
  deliveryPoints: IOrderDeliveryPoint[];
  deliveryPrestation: IDeliveryPrestation;
  weightPrice?: number;
  totalWeight?: number;
  totalVolume?: number;
  deliverers: IUser[];
  pickupDate: string;
  deliveryDate: string;
  status: string;
  totalCredit: number;
  totalPrice?: number;
  pricingConfig?: IPricingConfig;
  customer?: IHistoryInterface;
  invoice?: Invoice;
  quote?: IQuote;
  pickupAsSoonAsPossible?: boolean;
  deliveryAsSoonAsPossible?: boolean;
  warehouse?: IWarehouse;
  warehouseRadius?: number;
  adjustments: IOrderAdjustment[];
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  auditIdentifier: string;
  shortReference: string;
  pickupFormattedDate: string;
  totalCreditAmount: number;
}

export interface IOrderAdjustment {
  id: string;
  order: IOrder;
  description: string;
  amountHt: number;
  createdAt: string;
  auditIdentifier: string;
}

export interface IOrderAdjustmentDto {
  id?: string;
  description: string;
  amountHt: number;
  createdAt?: string;
}

export interface IOrderDeliveryPoint {
  id: string;
  order: IOrder;
  address: IAddress;
  orderIndex: number;
}

export interface IOrderDeliveryPointDto {
  address: IAddressDto;
  orderIndex: number;
}

export interface IOrderDto {
  customerId: string;
  customerType: OrderCustomerType;
  pickupDate: string;
  deliveryDate: string;
  pickupAsSoonAsPossible?: boolean;
  deliveryAsSoonAsPossible?: boolean;
  warehouseId?: string;
  warehouseRadius?: number;
  adjustments?: IOrderAdjustmentDto[];
  pickupPoints: IOrderPickupPointDto[];
  deliveryPoints: IOrderDeliveryPointDto[];
  pricingConfigId: string;
  deliveryPrestationId: string;
  pricingConfig?: IPricingConfig;
}

export interface IOrderMandatoryDto {
  pickupPoints?: IOrderPickupPointDto[];
  deliveryPoints?: IOrderDeliveryPointDto[];
  pricingConfigId: string;
  deliveryPrestationId: string;
  pricingConfig?: IPricingConfig;
}

export interface IOrderPickupPackageDimension {
  id: string;
  pickupPoint: IOrderPickupPoint;
  weight: number;
  height: number;
  length: number;
  width: number;
  description?: string;
}

export interface IOrderPickupPoint {
  id: string;
  order: IOrder;
  address: IAddress;
  orderIndex: number;
  packageDimensions: IOrderPickupPackageDimension[];
}

export interface IOrderPickupPointDto {
  address: IAddressDto;
  packageDimensions?: IPackageDimensionDto[];
  orderIndex: number;
  totalWeight: number;
  totalVolume: number;
}

export interface IOrderWarehouseResponseDto {
  warehouse?: IWarehouse;
  distance?: number;
}

export interface IOrganization {
  id: string;
  tenantId: string;
  name: string;
  logo?: string;
  email: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string;
  siretNumber: string;
  users: IUser[];
  addresses: IAddress[];
  defaultBillingAddress?: IAddress;
  defaultPickupAddress?: IAddress;
  defaultDeliveryAddress?: IAddress;
  creditPrice: number;
  vatNumber: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  auditIdentifier: string;
  sirenNumber: string;
}

export interface IOrganizationRef {
  id: string;
  tenantId: string;
  name: string;
}

export interface IOrganizationDto {
  name: string;
  logo?: string;
  email: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string;
  siretNumber: string;
  creditPrice?: number;
  vatNumber: string;
  defaultBillingAddress: IAddressDto;
  sirenNumber: string;
}

export interface IOverageDto {
  allowOverage?: boolean;
}

export interface IPackageCategory {
  id: string;
  tenant: ITenant;
  label: string;
  weight: number;
  height: number;
  length: number;
  width: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  auditIdentifier: string;
  volume: number;
  volumetricWeight: number;
}

export interface IPackageCategoryDto {
  label: string;
  dimensions: IPackageDimensionDto;
  description?: string;
}

export interface IPackageDimensionDto {
  weight: number;
  height: number;
  length: number;
  width: number;
  description?: string;
  volume: number;
  volumetricWeight: number;
}

export interface IPilotProgramStatus {
  active: boolean;
  totalSlots: number;
  takenSlots: number;
}

export interface IPlan {
  id: string;
  name: string;
  type: string;
  isVisible?: boolean;
  stripeProductId?: string;
  stripeMonthlyPriceId?: string;
  stripeAnnualPriceId?: string;
  trialDays?: number;
  description?: string;
  monthlyPriceEuro?: number;
  annualPriceEuro?: number;
  isFeatured?: boolean;
  ctaLabel?: string;
  planFeatures: IPlanFeature[];
}

export interface IPlan2 {
  id: string;
  name: string;
  type: string;
  isVisible?: boolean;
  stripeProductId?: string;
  stripeMonthlyPriceId?: string;
  stripeAnnualPriceId?: string;
  trialDays?: number;
  description?: string;
  monthlyPriceEuro?: number;
  annualPriceEuro?: number;
  isFeatured?: boolean;
  ctaLabel?: string;
  planFeatures: IPlanFeature2[];
}

export interface IPlanDto {
  name: string;
  type: PlanType;
  isVisible?: boolean;
  trialDays?: number;
  description?: string;
  monthlyPriceEuro?: number;
  annualPriceEuro?: number;
  isFeatured?: boolean;
  ctaLabel?: string;
  planFeatures?: IPlanFeatureDto[];
  visible: boolean;
  featured: boolean;
}

export interface IPlanFeature {
  id: string;
  feature?: IFeature2;
  enabled?: boolean;
  limitValue?: number;
  overageEnabled?: boolean;
  overagePriceEuro?: number;
}

export interface IPlanFeature2 {
  id: string;
  feature?: IFeature3;
  enabled?: boolean;
  limitValue?: number;
  overageEnabled?: boolean;
  overagePriceEuro?: number;
}

export interface IPlanFeatureDto {
  featureKey: PlanFeatureKey;
  enabled?: boolean;
  limitValue?: number;
  overageEnabled?: boolean;
  overagePriceEuro?: number;
}

export interface IPricingConfig {
  id: string;
  tenantId: string;
  label: string;
  startingPoint?: IAddress;
  distancePricingConfig?: IDistancePricingConfig;
  cityPricingConfig?: ICityPricingConfig;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  auditIdentifier: string;
}

export interface IPricingSummaryDto {
  tripsSummary: ITripSummaryDto;
  warehouse?: IWarehouse;
  deliveryPrestationLabel: string;
  deliveryPrestationPrice: number;
  weightPrice: number;
  totalWeight: number;
  totalVolume: number;
  totalPrice: number;
  creditPrice: number;
  totalCredit: number;
  totalCreditPrice: number;
  warehousePrice?: number;
  tvaPrice: number;
  adjustmentsTotal?: number;
}

export interface IPrivateCustomer {
  tenant?: ITenant;
  id: string;
  privateCustomerTenants: IPrivateCustomerTenant[];
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string;
  picture?: string;
  addresses: IAddress[];
  defaultBillingAddress?: IAddress;
  defaultPickupAddress?: IAddress;
  defaultDeliveryAddress?: IAddress;
  creditPrice: number;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  auditIdentifier: string;
  tenants: ITenant[];
}

export interface IPrivateCustomerRef {
  tenant?: ITenant;
  id: string;
}

export interface IPrivateCustomerDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string;
  picture?: string;
  creditPrice?: number;
  defaultBillingAddress: IAddressDto;
}

export interface IPrivateCustomerTenant {
  id: string;
  privateCustomer: IPrivateCustomer;
  tenant: ITenant;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface IPromoCodeCouponDto {
  percentOff?: number;
  amountOff?: number;
  currency?: string;
  duration: CreatePromoCodeDuration;
  durationInMonths?: number;
}

export interface IPromoCodeDto {
  id: string;
  code: string;
  active: boolean;
  maxRedemptions?: number;
  timesRedeemed: number;
  redemptionCount: number;
  expiresAt?: string;
  createdAt: string;
  coupon: IPromoCodeCouponDto;
  rules?: IPromoCodeRuleDto[];
}

export interface IPromoCodeRuleDto {
  id: string;
  type: string;
  value: { [key: string]: unknown };
  createdAt: string;
}

export interface IQuote {
  id: string;
  tenant: ITenant;
  customerType: string;
  customerId: string;
  orders: IOrder[];
  quoteVersions: IQuoteVersion[];
  quoteNumber: string;
  version?: number;
  validUntil?: string;
  otpCode?: string;
  otpExpiry?: string;
  otpAttempts?: number;
  validatedAt?: string;
  validatedIp?: string;
  relanceCount?: number;
  relancedAt?: string;
  tenantName: string;
  tenantAddress: string;
  tenantPhone?: string;
  tenantEmail: string;
  tenantLogo?: string;
  tenantSiretNumber: string;
  tenantVatNumber: string;
  tenantRCS: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerLogo?: string;
  customerSiretNumber?: string;
  customerVatNumber?: string;
  creditPrice: number;
  totalCredit?: number;
  subTotal: number;
  totalPrice: number;
  status: string;
  cancellationReason?: string;
  sentDate?: string;
  totalWeight?: number;
  deliveryPrestationLabel?: string;
  deliveryPrestationPrice?: number;
  weightPrice?: number;
  totalVolume?: number;
  warehousePrice?: number;
  adjustmentsTotal?: number;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  auditIdentifier: string;
}

export interface IQuoteDto {
  orderIds: string[];
  customerId: string;
  customerType: OrderCustomerType;
}

export interface IQuoteVersion {
  id: string;
  quote: IQuote;
  version: number;
  quoteNumber: string;
  tenantName: string;
  tenantAddress: string;
  tenantPhone?: string;
  tenantEmail: string;
  tenantSiretNumber: string;
  tenantVatNumber: string;
  tenantRCS: string;
  customerName: string;
  customerAddress: string;
  customerLogo?: string;
  customerSiretNumber?: string;
  customerVatNumber?: string;
  orders?: unknown[];
  creditPrice: number;
  totalCredit?: number;
  subTotal: number;
  totalPrice: number;
  totalWeight?: number;
  totalVolume?: number;
  weightPrice?: number;
  warehousePrice?: number;
  adjustmentsTotal?: number;
  deliveryPrestationLabel?: string;
  deliveryPrestationPrice?: number;
  sentDate?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  auditIdentifier: string;
  sortedOrders: unknown[];
}

export interface IReadWarehouseOrderDto {
  id?: string;
  latitude: number;
  longitude: number;
  radius?: number;
  capacity: number;
  daysInWarehouse?: number;
}

export interface IResetPasswordDto {
  token: string;
  password: string;
}

export interface IStoragePricing {
  id: string;
  tenant: ITenant;
  warehouses: IWarehouse[];
  pricingType: string;
  storagePricingTiers: IStoragePricingTier[];
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface IStoragePricingTier {
  id: string;
  tenant: ITenant;
  storagePricing: IStoragePricing;
  minDays: number;
  maxDays?: number;
  price: number;
  maximumPriceCap?: number;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface ISubscription {
  id: string;
  tenant?: ITenant3;
  plan?: IPlan2;
  source: string;
  status: string;
  trialEndsAt?: string;
  currentPeriodEnd?: string;
  canceledAt?: string;
  allowOverage?: boolean;
  active: boolean;
}

export interface ISubscriptionDto {
  planId: string;
  source: SubscriptionSource;
  status: SubscriptionStatus;
  trialEndsAt?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  allowOverage?: boolean;
}

export interface ITenant {
  user?: IUser;
  privateCustomer?: IPrivateCustomer[];
  id: string;
  apiKey: string;
  tenantAdminUser?: IUser;
  name: string;
  logo?: string;
  email: string;
  userTenants: IUserTenantRead[];
  privateCustomerTenants: IPrivateCustomerTenant[];
  bankDetails: IBankDetail[];
  siretNumber: string;
  rcsCity: string;
  address?: IAddress;
  vatNumber: string;
  defaultBankDetail?: IBankDetail;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  auditIdentifier: string;
  sirenNumber: string;
  users: IUser[];
  privateCustomers: IPrivateCustomer[];
}

export interface ITenant2 {
  user?: IUser;
  privateCustomer?: IPrivateCustomer[];
}

export interface ITenant3 {
  user?: IUser;
  privateCustomer?: IPrivateCustomer[];
  id: string;
}

export interface ITenant4 {
  user?: IUser;
  privateCustomer?: IPrivateCustomer[];
  name: string;
}

export interface ITimeSlotDto {
  dayOfWeek: TimeSlotDayOfWeek;
  startTime: string;
  endTime: string;
}

export interface ITripDto {
  startingPoint: IAddressMandatoryDto;
  destination: IAddressMandatoryDto;
  distance: number;
  tripCreditAmount?: number;
  cityPricing?: ICityPricing;
}

export interface ITripSummaryDto {
  trips: ITripDto[];
  totalDistance: number;
  totalCredit: number;
}

export interface IUpdatePasswordDto {
  password: string;
}

export interface IUpdateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  phoneNumber: string;
  secondaryPhoneNumber?: string;
  picture?: string;
  organizationId?: string;
  privateCustomerId?: string;
  customerRole: boolean;
}

export interface IUser {
  tenant?: ITenant;
  id: string;
  email: string;
  password?: string;
  invitationToken?: string;
  invitationTokenExpiresAt?: string;
  passwordResetToken?: string;
  passwordResetTokenExpiresAt?: string;
  isAccountActivated?: boolean;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string;
  picture?: string;
  userTenants: IUserTenantRead[];
  organization?: IOrganization;
  privateCustomer?: IPrivateCustomer;
  ssoProvider?: string;
  ssoExternalId?: string;
  currentTenantId?: string;
  roles?: string[];
  impersonated?: boolean;
  impersonatedByEmail?: string;
  impersonatedByName?: string;
  impersonationSessionId?: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  userIdentifier: string;
  accountActivated: boolean;
  invitationTokenValid: boolean;
  passwordResetTokenValid: boolean;
  tenants: ITenant[];
  admin: boolean;
  auditIdentifier: string;
  userName: string;
  salt?: string;
}

export interface IUserRead {
  tenant?: ITenant;
  id: string;
  email: string;
  isAccountActivated?: boolean;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string;
  picture?: string;
  userTenants: IUserTenant[];
  organization?: IOrganizationRef;
  privateCustomer?: IPrivateCustomerRef;
  ssoProvider?: string;
  ssoExternalId?: string;
  currentTenantId?: string;
  roles?: string[];
}

export interface IUserTenant {
  id: string;
}

export interface IUserTenantRead {
  id: string;
  user: IUser;
  tenant: ITenant;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  auditIdentifier: string;
}

export interface IVehicle {
  id: string;
  tenant: ITenant;
  label: string;
  vehicleType: string;
  description?: string;
  volumeCapacity: number;
  weightCapacity: number;
  isRefrigerated?: boolean;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  auditIdentifier: string;
}

export interface IVehicleDto {
  label: string;
  vehicleType: VehicleType;
  description?: string;
  volumeCapacity: number;
  weightCapacity: number;
  isRefrigerated?: boolean;
  isActive?: boolean;
  refrigerated: boolean;
  active: boolean;
}

export interface IWarehouse {
  id: string;
  tenant: ITenant;
  address?: IAddress;
  label: string;
  timeSlots: IWarehouseTimeSlot[];
  storagePricing?: IStoragePricing;
  volumeCapacity: number;
  currentVolume?: number;
  weightCapacity: number;
  currentWeight?: number;
  isRefrigerated?: boolean;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  auditIdentifier: string;
}

export interface IWarehouseDto {
  address: IAddressDto;
  label: string;
  timeSlots?: ITimeSlotDto[];
  volumeCapacity: number;
  currentVolume?: number;
  weightCapacity: number;
  currentWeight?: number;
  isRefrigerated?: boolean;
  isActive?: boolean;
  refrigerated: boolean;
  active: boolean;
}

export interface IWarehouseTimeSlot {
  warehouse: IWarehouse;
  id: string;
  dayOfWeek?: string;
  startTime: string;
  endTime: string;
  validSlot: boolean;
}

export interface IWeightPricingTier {
  id: string;
  tenant: ITenant;
  minWeight: number;
  maxWeight: number;
  pricePerKg: number;
  pricingType?: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface IWeightPricingTierDto {
  minWeight: number;
  maxWeight: number;
  pricePerKg: number;
  pricingType?: WeightPricingTierType;
}


// API Response Types
export type get_audit_log_readResponse = IAuditLog[];
export type get_audit_log_entity_typesResponse = string[];
export type post_hub_register_confirmResponse = IHubUser;
export type post_admin_tenant_impersonateResponse = {
  token?: string;
};
export type get_admin_tenant_impersonation_logsResponse = ImpersonationLog[];
export type get_admin_tenant_audit_logsResponse = IAuditLog[];
export type get_admin_tenant_subscription_readResponse = {
  id?: string;
  tenantId?: string;
  planId?: string;
  planName?: string;
  planType?: string;
  status?: string;
  stripeSubscriptionId?: string;
  startedAt?: string;
  currentPriceEuroCents?: number;
  planMonthlyPriceEuroCents?: number;
  planAnnualPriceEuroCents?: number;
  isOnLatestPrice?: boolean;
  billingPeriod?: 'monthly' | 'annual';
  recentInvoices?: {
  id?: string;
  amountPaidEuroCents?: number;
  paidAt?: string;
  status?: string;
}[];
};
export type get_admin_feature_readResponse = IFeature | IFeature[];
export type get_admin_plan_readResponse = IPlan | IPlan[];
export type get_admin_plan_subscriptions_readResponse = {
  id?: string;
  tenantId?: string;
  tenantName?: string;
  status?: string;
  stripeSubscriptionId?: string;
  startedAt?: string;
  endedAt?: string;
  currentPriceEuroCents?: number;
  isOnLatestPrice?: boolean;
}[];
export type get_admin_promo_code_readResponse = IPromoCodeDto[];
export type post_admin_promo_code_createResponse = IPromoCodeDto;
export type post_admin_promo_code_rule_createResponse = IPromoCodeDto;
export type get_admin_audit_logs_readResponse = IAuditLog[];
export type get_admin_audit_logs_entity_typesResponse = string[];
export type get_global_setting_readResponse = IGlobalSetting[] | IGlobalSetting;
export type post_global_setting_createResponse = IGlobalSetting;
export type post_stripe_customer_portalResponse = {
  url?: string;
};
export type post_organization_createResponse = IOrganization;
export type post_user_inviteResponse = {
  user?: IUserRead;
  message?: string;
};
export type get_user_get_tenantsResponse = ITenant[];
export type patch_user_switch_tenantResponse = {
  token?: string;
};
export type post_user_resend_invitationResponse = {
  message?: string;
};
export type post_private_customer_createResponse = IPrivateCustomer;
export type get_private_customer_readResponse = (IPrivateCustomer | {
  data?: IPrivateCustomer[];
  total?: number;
});
export type post_order_createResponse = IOrder;
export type post_order_calculate_tripResponse = ITripSummaryDto;
export type post_order_calculate_pricingResponse = IPricingSummaryDto;
export type post_invoice_createResponse = Invoice;
export type post_quote_createResponse = IQuote;
export type post_package_category_createResponse = IPackageCategory;
export type get_package_category_readResponse = (IPackageCategory | {
  data?: IPackageCategory[];
  total?: number;
});
export type post_weight_pricing_tier_createResponse = IWeightPricingTier;
export type get_weight_pricing_tier_readResponse = (IWeightPricingTier | {
  data?: IWeightPricingTier[];
  total?: number;
});
export type post_vehicle_createResponse = IVehicle;
export type post_warehouse_createResponse = IWarehouse;
export type post_warehouse_order_readResponse = IOrderWarehouseResponseDto[];
export type post_driver_schedule_createResponse = IDriverSchedule;
export type get_driver_schedule_readResponse = IDriverSchedule[] | IDriverSchedule;
export type post_delivery_zone_createResponse = IDeliveryZone;
export type get_delivery_zone_readResponse = IDeliveryZone[] | IDeliveryZone;
export type get_subscription_readResponse = ISubscription;
export type post_public_activate_accountResponse = {
  token?: string;
  message?: string;
};
export type post_public_forgot_passwordResponse = {
  message?: string;
};
export type post_public_reset_passwordResponse = {
  message?: string;
};
export type get_public_plan_readResponse = IPlan[];
export type post_public_contact_createResponse = {
  message?: string;
};
export type get_public_pilot_program_readResponse = IPilotProgramStatus;
export type post_chat_create_messageResponse = IChatMessage;
export type get_chat_read_messagesResponse = IChatMessage[];
export type get_chat_list_conversationsResponse = IChatMessage[];
export type get_chat_list_tenant_usersResponse = IUser[];
