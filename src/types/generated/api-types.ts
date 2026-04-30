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
export type CreatePromoCodeRuleType = "ELIGIBLE_PLAN_IDS" | "ELIGIBLE_TENANT_IDS";
export type DriverScheduleStatus = "planned" | "active" | "completed" | "cancelled";
export type DriverScheduleTimeSlotType = "work" | "break" | "lunch" | "meeting" | "unavailable";
export type DriverScheduleType = "regular" | "overtime" | "on_call" | "emergency";
export type GlobalSettingPricingType = "distance" | "city";
export type InviteUserRoles = "ROLE_CUSTOMER" | "ROLE_CUSTOMER_ADMIN" | "ROLE_DELIVERER" | "ROLE_MANAGER" | "ROLE_MANAGER_ADMIN";
export type OrderCustomerType = "private_customer" | "organization";
export type PlanFeatureKey = "max_users" | "max_drivers" | "max_orders_per_month" | "max_quotes_per_month" | "max_invoices_per_month" | "max_customers" | "max_vehicles" | "max_warehouses" | "max_pricing_configs" | "max_prestations" | "max_address_searches_per_month" | "max_route_calculations_per_month" | "can_create_quotes" | "can_create_invoices" | "can_use_dispatch" | "can_use_planning" | "can_use_messaging" | "can_manage_fleet" | "can_view_audit_logs" | "can_use_api" | "can_configure_stripe" | "can_use_premium_address_search" | "can_use_route_optimization";
export type PlanType = "standard" | "custom";
export type PromoCodeApplicableBillingPeriods = "monthly" | "annual";
export type PromoCodeType = "discount" | "trial";
export type SubscriptionSource = "stripe" | "manual";
export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | "incomplete" | "registration_failed";
export type TimeSlotDayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export type VehicleType = "bike" | "cargo_bike" | "scooter" | "motorbike" | "car" | "van" | "truck" | "electric_van" | "electric_bike" | "pedestrian";
export type WeightPricingTierType = "fixed" | "per_kg";

export interface IActivateAccountDto {
  token: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string | null;
  picture?: string | null;
}

export interface IAddress {
  id: string;
  tenant?: ITenant | null;
  name: string;
  streetNumber: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  type: string;
  phoneNumber?: string | null;
  secondaryPhoneNumber?: string | null;
  additionalInformation?: string | null;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  fullAddress: string;
}

export interface IAddressDto {
  phoneNumber?: string | null;
  secondaryPhoneNumber?: string | null;
  additionalInformation?: string | null;
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

export interface IAdminReplacePromoCodeDto {
  code?: string;
  reason?: string;
}

export interface IApplyPromoCodeDto {
  code?: string;
}

export interface IAuditLog {
  id?: string;
  message?: string;
  action?: AuditLogAction;
  entityType?: string;
  entityId?: string;
  userEmail?: string;
  userId?: string | null;
  tenantId?: string | null;
  isImpersonated?: boolean;
  impersonatedByEmail?: string | null;
  impersonatedByName?: string | null;
  ip?: string | null;
  createdAt?: string;
  changes?: { [key: string]: unknown } | null;
  impersonationSessionId?: string | null;
}

export interface IBankDetail {
  id: string;
  tenant?: ITenant | null;
  bankLabel: string;
  bankName: string;
  iban: string;
  bic: string;
  bankCode: string;
  accountNumber: string;
  accountHolderName: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  auditIdentifier: string;
}

export interface IChatMessage {
  id: string;
  tenantId: string;
  sender: IUser;
  recipient: IUser;
  content: string;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
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
  cityPricingConfig?: ICityPricingConfig | null;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export interface ICityPricingConfig {
  id: string;
  cityPricingList: ICityPricing[];
  pricingConfig?: IPricingConfig | null;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  auditIdentifier: string;
}

export interface IContactRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  volume: ContactRequestVolume;
  context: ContactRequestContext;
  message?: string | null;
}

export interface ICreatePromoCodeDto {
  code: string;
  type?: PromoCodeType;
  trialDays?: number | null;
  percentOff?: number | null;
  amountOff?: number | null;
  currency?: string | null;
  duration?: CreatePromoCodeDuration | null;
  durationInMonths?: number | null;
  maxRedemptions?: number | null;
  expiresAt?: string | null;
  rules?: ICreatePromoCodeRuleDto[];
  applicableBillingPeriods?: string[] | null;
}

export interface ICreatePromoCodeRuleDto {
  type: CreatePromoCodeRuleType;
  value?: { [key: string]: unknown };
}

export interface IDeliveryPrestation {
  id: string;
  tenant: ITenant;
  label: string;
  description?: string | null;
  amount: number;
  pricingType: string;
  timeSlots: IDeliveryPrestationTimeSlot[];
  vehicle: IVehicle;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  auditIdentifier: string;
}

export interface IDeliveryPrestationTimeSlot {
  deliveryPrestation: IDeliveryPrestation;
  id: string;
  dayOfWeek?: string | null;
  startTime: string;
  endTime: string;
  validSlot: boolean;
}

export interface IDeliveryZone {
  id: string;
  tenant: ITenant;
  name: string;
  color?: string | null;
  description?: string | null;
  polygon?: unknown[];
  center?: unknown[] | null;
  priority?: number;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  auditIdentifier: string;
}

export interface IDeliveryZoneDto {
  name: string | null;
  color?: string | null;
  description?: string | null;
  polygon?: unknown[];
  center?: unknown[] | null;
  priority?: number;
  isActive?: boolean;
}

export interface IDistancePricing {
  id: string;
  distance: number;
  creditAmount: number;
  distancePricingConfig?: IDistancePricingConfig | null;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
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
  archivedAt?: string | null;
  auditIdentifier: string;
}

export interface IDriverSchedule {
  id: string;
  tenant: ITenant;
  driver: IUser;
  scheduledDate: string;
  status: string;
  scheduleType: string;
  preferredZone?: IDeliveryZone | null;
  excludedZones: IDeliveryZone[];
  maxDeliveryRadiusKm?: number | null;
  timeSlots: IDriverScheduleTimeSlot[];
  notes?: string | null;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export interface IDriverScheduleDto {
  driverId: string;
  scheduledDate: string;
  status: DriverScheduleStatus;
  scheduleType: DriverScheduleType;
  preferredZoneId?: string | null;
  excludedZoneIds?: string[];
  maxDeliveryRadiusKm?: number | null;
  timeSlots?: IDriverScheduleTimeSlotDto[];
  notes?: string | null;
  isActive?: boolean;
}

export interface IDriverScheduleTimeSlot {
  driverSchedule: IDriverSchedule;
  slotType: string;
  description?: string | null;
  id: string;
  dayOfWeek?: string | null;
  startTime: string;
  endTime: string;
  validSlot: boolean;
}

export interface IDriverScheduleTimeSlotDto {
  startTime: string;
  endTime: string;
  slotType: DriverScheduleTimeSlotType;
  description?: string | null;
}

export interface IFeature {
  id: string;
  key: string;
  type: string;
  description?: string | null;
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
  archivedAt?: string | null;
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
  organizationId?: string | null;
  privateCustomerId?: string | null;
  customerRole: boolean;
}

export interface Invoice {
  id: string;
  tenant: ITenant;
  customerType: string;
  customerId: string;
  customerPhone?: string | null;
  tenantName: string;
  tenantAddress: string;
  tenantPhone?: string | null;
  tenantEmail: string;
  tenantLogo?: string | null;
  tenantSiretNumber: string;
  tenantVatNumber: string;
  tenantRCS: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerLogo?: string | null;
  customerSiretNumber?: string | null;
  customerVatNumber?: string | null;
  bankName: string;
  bankIban: string;
  bankBic: string;
  bankCode: string;
  bankAccountNumber: string;
  bankAccountHolderName: string;
  invoiceNumber: string;
  dueDate: string;
  sentDate?: string | null;
  paymentDate?: string | null;
  creditPrice: number;
  totalCredit?: number;
  subTotal: number;
  totalPrice: number;
  status: string;
  orders: IOrder[];
  relanceCount?: number;
  relancedAt?: string | null;
  totalWeight?: number;
  deliveryPrestationLabel?: string | null;
  deliveryPrestationPrice?: number;
  weightPrice?: number;
  totalVolume?: number;
  warehousePrice?: number | null;
  adjustmentsTotal?: number;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
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
  pricingConfig?: IPricingConfig | null;
  customer?: IHistoryInterface | null;
  invoice?: Invoice | null;
  quote?: IQuote | null;
  pickupAsSoonAsPossible?: boolean;
  deliveryAsSoonAsPossible?: boolean;
  warehouse?: IWarehouse | null;
  warehouseRadius?: number | null;
  adjustments: IOrderAdjustment[];
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
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
  id?: string | null;
  description: string;
  amountHt: number;
  createdAt?: string | null;
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
  warehouseId?: string | null;
  warehouseRadius?: number | null;
  adjustments?: IOrderAdjustmentDto[];
  pickupPoints: IOrderPickupPointDto[];
  deliveryPoints: IOrderDeliveryPointDto[];
  pricingConfigId: string;
  deliveryPrestationId: string;
  pricingConfig?: IPricingConfig | null;
}

export interface IOrderMandatoryDto {
  pickupPoints?: IOrderPickupPointDto[];
  deliveryPoints?: IOrderDeliveryPointDto[];
  pricingConfigId: string;
  deliveryPrestationId: string;
  pricingConfig?: IPricingConfig | null;
}

export interface IOrderPickupPackageDimension {
  id: string;
  pickupPoint: IOrderPickupPoint;
  weight: number;
  height: number;
  length: number;
  width: number;
  description?: string | null;
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
  logo?: string | null;
  email: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string | null;
  siretNumber: string;
  users: IUser[];
  addresses: IAddress[];
  defaultBillingAddress?: IAddress | null;
  defaultPickupAddress?: IAddress | null;
  defaultDeliveryAddress?: IAddress | null;
  creditPrice: number;
  vatNumber: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
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
  logo?: string | null;
  email: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string | null;
  siretNumber: string;
  creditPrice?: number | null;
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
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  auditIdentifier: string;
  volume: number;
  volumetricWeight: number;
}

export interface IPackageCategoryDto {
  label: string;
  dimensions: IPackageDimensionDto;
  description?: string | null;
}

export interface IPackageDimensionDto {
  weight: number;
  height: number;
  length: number;
  width: number;
  description?: string | null;
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
  stripeProductId?: string | null;
  stripeMonthlyPriceId?: string | null;
  stripeAnnualPriceId?: string | null;
  trialDays?: number | null;
  description?: string | null;
  monthlyPriceEuro?: number | null;
  annualPriceEuro?: number | null;
  isFeatured?: boolean;
  ctaLabel?: string | null;
  planFeatures: IPlanFeature[];
}

export interface IPlan2 {
  id: string;
  name: string;
  type: string;
  isVisible?: boolean;
  stripeProductId?: string | null;
  stripeMonthlyPriceId?: string | null;
  stripeAnnualPriceId?: string | null;
  trialDays?: number | null;
  description?: string | null;
  monthlyPriceEuro?: number | null;
  annualPriceEuro?: number | null;
  isFeatured?: boolean;
  ctaLabel?: string | null;
  planFeatures: IPlanFeature2[];
}

export interface IPlanDto {
  name: string;
  type: PlanType;
  isVisible?: boolean;
  trialDays?: number | null;
  description?: string | null;
  monthlyPriceEuro?: number | null;
  annualPriceEuro?: number | null;
  isFeatured?: boolean;
  ctaLabel?: string | null;
  planFeatures?: IPlanFeatureDto[] | null;
  visible: boolean;
  featured: boolean;
}

export interface IPlanFeature {
  id: string;
  feature?: IFeature2 | null;
  enabled?: boolean | null;
  limitValue?: number | null;
  overageEnabled?: boolean;
  overagePriceEuro?: number | null;
}

export interface IPlanFeature2 {
  id: string;
  feature?: IFeature3 | null;
  enabled?: boolean | null;
  limitValue?: number | null;
  overageEnabled?: boolean;
  overagePriceEuro?: number | null;
}

export interface IPlanFeatureDto {
  featureKey: PlanFeatureKey;
  enabled?: boolean | null;
  limitValue?: number | null;
  overageEnabled?: boolean;
  overagePriceEuro?: number | null;
}

export interface IPricingConfig {
  id: string;
  tenantId: string;
  label: string;
  startingPoint?: IAddress | null;
  distancePricingConfig?: IDistancePricingConfig | null;
  cityPricingConfig?: ICityPricingConfig | null;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  auditIdentifier: string;
}

export interface IPricingSummaryDto {
  tripsSummary: ITripSummaryDto;
  warehouse?: IWarehouse | null;
  deliveryPrestationLabel: string;
  deliveryPrestationPrice: number;
  weightPrice: number;
  totalWeight: number;
  totalVolume: number;
  totalPrice: number;
  creditPrice: number;
  totalCredit: number;
  totalCreditPrice: number;
  warehousePrice?: number | null;
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
  secondaryPhoneNumber?: string | null;
  picture?: string | null;
  addresses: IAddress[];
  defaultBillingAddress?: IAddress | null;
  defaultPickupAddress?: IAddress | null;
  defaultDeliveryAddress?: IAddress | null;
  creditPrice: number;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
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
  secondaryPhoneNumber?: string | null;
  picture?: string | null;
  creditPrice?: number | null;
  defaultBillingAddress: IAddressDto;
}

export interface IPrivateCustomerTenant {
  id: string;
  privateCustomer: IPrivateCustomer;
  tenant: ITenant;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export interface IPromoCodeCouponDto {
  percentOff?: number | null;
  amountOff?: number | null;
  currency?: string | null;
  duration?: CreatePromoCodeDuration | null;
  durationInMonths?: number | null;
}

export interface IPromoCodeDto {
  id: string;
  code: string;
  type: PromoCodeType;
  active: boolean;
  maxRedemptions?: number | null;
  timesRedeemed: number;
  redemptionCount: number;
  expiresAt?: string | null;
  createdAt: string;
  coupon?: IPromoCodeCouponDto | null;
  trialDays?: number | null;
  rules?: IPromoCodeRuleDto[];
  applicableBillingPeriods?: PromoCodeApplicableBillingPeriods[] | null;
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
  validUntil?: string | null;
  otpCode?: string | null;
  otpExpiry?: string | null;
  otpAttempts?: number;
  validatedAt?: string | null;
  validatedIp?: string | null;
  relanceCount?: number;
  relancedAt?: string | null;
  tenantName: string;
  tenantAddress: string;
  tenantPhone?: string | null;
  tenantEmail: string;
  tenantLogo?: string | null;
  tenantSiretNumber: string;
  tenantVatNumber: string;
  tenantRCS: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerLogo?: string | null;
  customerSiretNumber?: string | null;
  customerVatNumber?: string | null;
  creditPrice: number;
  totalCredit?: number;
  subTotal: number;
  totalPrice: number;
  status: string;
  cancellationReason?: string | null;
  sentDate?: string | null;
  totalWeight?: number;
  deliveryPrestationLabel?: string | null;
  deliveryPrestationPrice?: number;
  weightPrice?: number;
  totalVolume?: number;
  warehousePrice?: number | null;
  adjustmentsTotal?: number;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
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
  tenantPhone?: string | null;
  tenantEmail: string;
  tenantSiretNumber: string;
  tenantVatNumber: string;
  tenantRCS: string;
  customerName: string;
  customerAddress: string;
  customerLogo?: string | null;
  customerSiretNumber?: string | null;
  customerVatNumber?: string | null;
  orders?: unknown[];
  creditPrice: number;
  totalCredit?: number;
  subTotal: number;
  totalPrice: number;
  totalWeight?: number;
  totalVolume?: number;
  weightPrice?: number;
  warehousePrice?: number | null;
  adjustmentsTotal?: number;
  deliveryPrestationLabel?: string | null;
  deliveryPrestationPrice?: number;
  sentDate?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  auditIdentifier: string;
  sortedOrders: unknown[];
}

export interface IReadWarehouseOrderDto {
  id?: string | null;
  latitude: number;
  longitude: number;
  radius?: number;
  capacity: number;
  daysInWarehouse?: number;
}

export interface IRegisterFinalizeDto {
  sessionId?: string;
}

export interface IResetPasswordDto {
  token: string;
  password: string;
}

export interface ISetDefaultPaymentMethodDto {
  paymentMethodId?: string;
}

export interface IStoragePricing {
  id: string;
  tenant: ITenant;
  warehouses: IWarehouse[];
  pricingType: string;
  storagePricingTiers: IStoragePricingTier[];
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export interface IStoragePricingTier {
  id: string;
  tenant: ITenant;
  storagePricing: IStoragePricing;
  minDays: number;
  maxDays?: number | null;
  price: number;
  maximumPriceCap?: number | null;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export interface ISubscription {
  id: string;
  tenant?: ITenant4 | null;
  plan?: IPlan2 | null;
  source: string;
  status: string;
  trialEndsAt?: string | null;
  currentPeriodEnd?: string | null;
  canceledAt?: string | null;
  cancelAtPeriodEnd?: boolean;
  allowOverage?: boolean;
  billingPeriod?: string | null;
  active: boolean;
}

export interface ISubscription2 {
  id: string;
}

export interface ISubscriptionDto {
  planId: string;
  source: SubscriptionSource;
  status: SubscriptionStatus;
  trialEndsAt?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  allowOverage?: boolean;
}

export interface ISubscriptionInvoice {
  id: string;
  tenant: ITenant3;
  subscription?: ISubscription2 | null;
  invoiceNumber: string;
  status: string;
  currency: string;
  subtotal: number;
  taxAmount?: number;
  discountAmount?: number;
  total: number;
  amountPaid?: number;
  amountDue?: number;
  periodStart: string;
  periodEnd: string;
  issuedAt: string;
  dueAt?: string | null;
  paidAt?: string | null;
  voidedAt?: string | null;
  provider: string;
  issuerLegalName: string;
  issuerLegalAddress: string;
  issuerSiret: string;
  issuerVatNumber: string;
  issuerRcs: string;
  issuerCapital: string;
  customerName: string;
  customerAddress: string;
  customerSiret?: string | null;
  customerVatNumber?: string | null;
  customerEmail: string;
  lines: ISubscriptionInvoiceLine[];
  taxBreakdowns: ISubscriptionInvoiceTaxBreakdown[];
  automaticTaxEnabled?: boolean;
  automaticTaxStatus?: string | null;
  issuerVatRegime: string;
}

export interface ISubscriptionInvoiceLine {
  id: string;
  description: string;
  quantity?: number;
  unitAmount?: number | null;
  amount: number;
  type: string;
  periodStart?: string | null;
  periodEnd?: string | null;
  taxAmount?: number;
}

export interface ISubscriptionInvoiceTaxBreakdown {
  id: string;
  ratePct: string;
  jurisdiction?: string | null;
  country?: string | null;
  taxableAmount: number;
  taxAmount: number;
  inclusive?: boolean;
  taxabilityReason?: string | null;
}

export interface ITenant {
  user?: IUser;
  privateCustomer?: IPrivateCustomer[];
  id: string;
  apiKey: string;
  tenantAdminUser?: IUser | null;
  name: string;
  logo?: string | null;
  email: string;
  userTenants: IUserTenantRead[];
  privateCustomerTenants: IPrivateCustomerTenant[];
  bankDetails: IBankDetail[];
  siretNumber: string;
  rcsCity: string;
  address?: IAddress | null;
  vatNumber: string;
  defaultBankDetail?: IBankDetail | null;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
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
  id: string;
}

export interface ITenant5 {
  user?: IUser;
  privateCustomer?: IPrivateCustomer[];
  name: string;
}

export interface ITenantRegisterAddressDto {
  streetNumber?: string;
  street?: string;
  postalCode?: string;
  city?: string;
  country?: string;
}

export interface ITenantRegisterCompanyDto {
  name?: string;
  siret?: string;
  vatNumber?: string;
  rcsCity?: string;
  address: ITenantRegisterAddressDto;
}

export interface ITenantRegisterDto {
  company: ITenantRegisterCompanyDto;
  user: ITenantRegisterUserDto;
  plan: ITenantRegisterPlanDto;
  promoCode?: string | null;
  acceptedTermsAt?: string;
  turnstileToken?: string;
}

export interface ITenantRegisterPlanDto {
  slug?: string;
  billingPeriod?: PromoCodeApplicableBillingPeriods;
}

export interface ITenantRegisterUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
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
  tripCreditAmount?: number | null;
  cityPricing?: ICityPricing | null;
}

export interface ITripSummaryDto {
  trips: ITripDto[];
  totalDistance: number;
  totalCredit: number;
}

export interface IUpdatePasswordDto {
  password: string;
}

export interface IUpdatePromoCodeDto {
  maxRedemptions?: number | null;
  expiresAt?: string | null;
}

export interface IUpdateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  phoneNumber: string;
  secondaryPhoneNumber?: string | null;
  picture?: string | null;
  organizationId?: string | null;
  privateCustomerId?: string | null;
  customerRole: boolean;
}

export interface IUser {
  tenant?: ITenant;
  id: string;
  email: string;
  password?: string | null;
  invitationToken?: string | null;
  invitationTokenExpiresAt?: string | null;
  passwordResetToken?: string | null;
  passwordResetTokenExpiresAt?: string | null;
  isAccountActivated?: boolean;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string | null;
  picture?: string | null;
  userTenants: IUserTenantRead[];
  organization?: IOrganization | null;
  privateCustomer?: IPrivateCustomer | null;
  ssoProvider?: string | null;
  ssoExternalId?: string | null;
  currentTenantId?: string | null;
  roles?: string[];
  impersonated?: boolean;
  impersonatedByEmail?: string | null;
  impersonatedByName?: string | null;
  impersonationSessionId?: string | null;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  userIdentifier: string;
  accountActivated: boolean;
  invitationTokenValid: boolean;
  passwordResetTokenValid: boolean;
  tenants: ITenant[];
  admin: boolean;
  auditIdentifier: string;
  userName: string;
  salt?: string | null;
}

export interface IUserRead {
  tenant?: ITenant;
  id: string;
  email: string;
  isAccountActivated?: boolean;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string | null;
  picture?: string | null;
  userTenants: IUserTenant[];
  organization?: IOrganizationRef | null;
  privateCustomer?: IPrivateCustomerRef | null;
  ssoProvider?: string | null;
  ssoExternalId?: string | null;
  currentTenantId?: string | null;
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
  archivedAt?: string | null;
  auditIdentifier: string;
}

export interface IVehicle {
  id: string;
  tenant: ITenant;
  label: string;
  vehicleType: string;
  description?: string | null;
  volumeCapacity: number;
  weightCapacity: number;
  isRefrigerated?: boolean;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  auditIdentifier: string;
}

export interface IVehicleDto {
  label: string;
  vehicleType: VehicleType;
  description?: string | null;
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
  address?: IAddress | null;
  label: string;
  timeSlots: IWarehouseTimeSlot[];
  storagePricing?: IStoragePricing | null;
  volumeCapacity: number;
  currentVolume?: number;
  weightCapacity: number;
  currentWeight?: number;
  isRefrigerated?: boolean;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
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
  dayOfWeek?: string | null;
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
  archivedAt?: string | null;
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
export type post_public_registerResponse = {
  checkoutUrl?: string;
  subscriptionId?: string;
  resumeToken?: string;
};
export type post_public_register_finalizeResponse = {
  token?: string;
};
export type post_admin_tenant_impersonateResponse = {
  token?: string;
};
export type get_admin_tenant_impersonation_logsResponse = ImpersonationLog[];
export type get_admin_tenant_audit_logsResponse = IAuditLog[];
export type get_admin_tenant_subscription_readResponse = {
  id?: string | null;
  tenantId?: string;
  planId?: string | null;
  planName?: string | null;
  planType?: string | null;
  status?: string | null;
  stripeSubscriptionId?: string | null;
  startedAt?: string | null;
  currentPriceEuroCents?: number | null;
  planMonthlyPriceEuroCents?: number | null;
  planAnnualPriceEuroCents?: number | null;
  isOnLatestPrice?: boolean | null;
  billingPeriod?: PromoCodeApplicableBillingPeriods | null;
  recentInvoices?: {
  id?: string;
  amountPaidEuroCents?: number;
  paidAt?: string | null;
  status?: string | null;
}[];
};
export type get_admin_tenant_subscription_invoice_readResponse = {
  data?: ISubscriptionInvoice[];
  total?: number;
};
export type get_admin_feature_readResponse = IFeature | IFeature[];
export type get_admin_plan_readResponse = IPlan | IPlan[];
export type get_admin_plan_subscriptions_readResponse = {
  id?: string;
  tenantId?: string;
  tenantName?: string;
  status?: string;
  stripeSubscriptionId?: string | null;
  startedAt?: string | null;
  endedAt?: string | null;
  currentPriceEuroCents?: number | null;
  isOnLatestPrice?: boolean | null;
}[];
export type get_admin_promo_code_readResponse = IPromoCodeDto[];
export type post_admin_promo_code_createResponse = IPromoCodeDto;
export type patch_admin_promo_code_updateResponse = IPromoCodeDto;
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
export type get_subscription_active_discountResponse = {
  couponRef?: string | null;
  label?: string | null;
  code?: string | null;
  expiresAt?: string | null;
};
export type get_subscription_usageResponse = {
  limits?: {
  featureKey?: string;
  limitValue?: number | null;
  overageEnabled?: boolean;
  overagePriceEuro?: number | null;
}[];
  overages?: {
  featureKey?: string;
  baseLimit?: number;
  actualUsage?: number;
  overageUnits?: number;
  overagePricePerUnit?: number;
  totalAmountEuro?: number;
}[];
  totalOverageEuro?: number;
  periodStart?: string;
  periodEnd?: string;
};
export type get_subscription_payment_methodResponse = {
  brand?: string | null;
  last4?: string | null;
  expMonth?: number | null;
  expYear?: number | null;
};
export type post_subscription_setup_intentResponse = {
  clientSecret?: string;
};
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
