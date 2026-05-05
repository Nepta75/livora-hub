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
export type AppliedPromoCodeType = "discount" | "trial";
export type AuditLogAction = "CREATE" | "UPDATE" | "DELETE";
export type ContactRequestContext = "founding-setup" | "enterprise" | "demo";
export type ContactRequestVolume = "1-50" | "50-200" | "200-500" | "500+";
export type CreatePromoCodeDuration = "once" | "repeating" | "forever";
export type CreatePromoCodeRuleType = "ELIGIBLE_PLAN_IDS" | "ELIGIBLE_TENANT_IDS";
export type DriverScheduleStatus = "planned" | "active" | "completed" | "cancelled";
export type DriverScheduleTimeSlotType = "work" | "break" | "lunch" | "meeting" | "unavailable";
export type DriverScheduleType = "regular" | "overtime" | "on_call" | "emergency";
export type GlobalSettingPricingType = "distance" | "city";
export type HubUserRoles = "ROLE_ADMIN" | "ROLE_MODERATOR";
export type InviteUserRoles = "ROLE_CUSTOMER" | "ROLE_CUSTOMER_ADMIN" | "ROLE_DELIVERER" | "ROLE_MANAGER" | "ROLE_MANAGER_ADMIN";
export type OrderCustomerType = "private_customer" | "organization";
export type PlanFeatureKey = "max_users" | "max_drivers" | "max_orders_per_month" | "max_quotes_per_month" | "max_invoices_per_month" | "max_customers" | "max_vehicles" | "max_warehouses" | "max_pricing_configs" | "max_prestations" | "max_address_searches_per_month" | "max_route_calculations_per_month" | "can_create_quotes" | "can_create_invoices" | "can_use_dispatch" | "can_use_planning" | "can_use_messaging" | "can_manage_fleet" | "can_view_audit_logs" | "can_use_api" | "can_configure_stripe" | "can_use_premium_address_search" | "can_use_route_optimization";
export type PlanType = "standard" | "custom";
export type PromoCodeApplicableBillingPeriods = "monthly" | "annual";
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

export interface IAddTenantDto {
  company: ITenantRegisterCompanyDto;
  plan: ITenantRegisterPlanDto;
  promoCode?: string | null;
  acceptedTermsAt?: string;
}

export interface IAdminReplacePromoCodeDto {
  code?: string;
  reason?: string;
}

export interface IAppliedPromoCodeDto {
  code: string;
  type: AppliedPromoCodeType;
  redeemedAt: string;
  amountDiscountedCents: number;
  currency: string;
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
  type?: AppliedPromoCodeType;
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

export interface IHubUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles?: HubUserRoles[];
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
  tenantVatNumber?: string | null;
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

export interface IMigrateCohortDto {
  subscriptionIds?: string[];
  tenantConsentObtainedAt?: string | null;
  reason?: string | null;
  tenantConsentObtainedAtImmutable?: string | null;
}

export interface IMigrateSubscriptionVersionDto {
  targetPlanVersionId: string;
  tenantConsentObtainedAt?: string | null;
  reason?: string | null;
  tenantConsentObtainedAtImmutable?: string | null;
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

export interface IPlanVersion {
  id: string;
  versionNumber: number;
}

export interface IPlanVersionDiff {
  favorableChanges: {
  field: string;
  from: unknown | null;
  to: unknown | null;
}[];
  unfavorableChanges: {
  field: string;
  from: unknown | null;
  to: unknown | null;
}[];
  isFavorable: boolean;
  isUnfavorable: boolean;
  hasChanges: boolean;
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
  type: AppliedPromoCodeType;
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

export interface IPromoCodeRedemptionListItemDto {
  id: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  redeemedAt: string;
  amountDiscountedCents: number;
  currency: string;
  provider: string;
}

export interface IPromoCodeRuleDto {
  id: string;
  type: string;
  value: { [key: string]: unknown };
  createdAt: string;
}

export interface IPromoPreviewDto {
  code: string;
  planSlug?: string | null;
  billingPeriod: PromoCodeApplicableBillingPeriods;
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
  tenantVatNumber?: string | null;
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
  tenantVatNumber?: string | null;
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

export interface IResumeCheckoutDto {
  promoCode?: string | null;
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

export interface ISubscribeToPlanDto {
  planSlug: string;
  billingPeriod: PromoCodeApplicableBillingPeriods;
  promoCode?: string | null;
}

export interface ISubscription {
  id: string;
  tenant?: ITenant4 | null;
  plan?: IPlan2 | null;
  planVersion: IPlanVersion;
  source: string;
  status: string;
  trialEndsAt?: string | null;
  currentPeriodStart?: string | null;
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
  vatNumber?: string | null;
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

export interface ITenantRegisterStartDto {
  email: string;
}

export interface ITenantRegisterUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

export interface ITenantRegisterVerifyCodeDto {
  email: string;
  otp: string;
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

export interface IUpdateHubUserDto {
  firstName: string;
  lastName: string;
  email: string;
}

export interface IUpdateHubUserRolesDto {
  roles: HubUserRoles[];
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
  roles: string[];
  rolesForTenant: string[];
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
}

export interface IUserTenant {
  id: string;
}

export interface IUserTenantRead {
  id: string;
  user: IUser;
  tenant: ITenant;
  roles?: string[];
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
export type GetAuditLogReadResponse = IAuditLog[];
export type GetAuditLogEntityTypesResponse = string[];
export type PostHubRegisterConfirmResponse = IHubUser;
export type PostPublicRegisterStartResponse = {
  alreadyVerified?: boolean;
  userExists?: boolean | null;
  message?: string;
};
export type PostPublicRegisterVerifyCodeResponse = {
  message?: string;
  userExists?: boolean;
};
export type PostPublicRegisterResponse = {
  checkoutUrl?: string;
  subscriptionId?: string;
  resumeToken?: string;
};
export type PostPublicRegisterFinalizeResponse = {
  token?: string;
};
export type PostAdminTenantImpersonateResponse = {
  token?: string;
};
export type GetAdminTenantImpersonationLogsResponse = ImpersonationLog[];
export type GetAdminTenantAuditLogsResponse = IAuditLog[];
export type GetAdminTenantSubscriptionReadResponse = {
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
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  nextOverageCycleStart?: string | null;
  nextOverageCycleEnd?: string | null;
  recentInvoices?: {
  id?: string;
  amountPaidEuroCents?: number;
  totalEuroCents?: number;
  paidAt?: string | null;
  status?: string | null;
  hostedInvoiceUrl?: string | null;
  kind?: 'subscription' | 'overage' | 'subscription_with_overage' | 'other';
  mirrorInvoiceId?: string | null;
  mirrorInvoiceNumber?: string | null;
}[];
  planVersion?: {
  id?: string;
  versionNumber?: number;
  signedAt?: string | null;
};
  planLatestVersion?: {
  id?: string;
  versionNumber?: number;
} | null;
  appliedPromoCode?: IAppliedPromoCodeDto | null;
};
export type GetAdminTenantSubscriptionInvoiceReadResponse = {
  data?: ISubscriptionInvoice[];
  total?: number;
};
export type GetAdminFeatureReadResponse = IFeature | IFeature[];
export type GetAdminPlanReadResponse = IPlan | IPlan[];
export type GetAdminPlanSubscriptionsReadResponse = {
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
export type GetAdminPlanVersionsReadResponse = {
  id: string;
  versionNumber: number;
  isFrozen: boolean;
  tenantCount: number;
  monthlyPriceEuro: number | null;
  annualPriceEuro: number | null;
  trialDays: number | null;
  description: string | null;
  ctaLabel: string | null;
  changeReason: string | null;
  createdAt: string | null;
  diffVsPrevious: IPlanVersionDiff | null;
}[];
export type GetAdminPlanVersionReadResponse = {
  id: string;
  planId: string;
  planName: string;
  versionNumber: number;
  isFrozen: boolean;
  tenantCount: number;
  monthlyPriceEuro: number | null;
  annualPriceEuro: number | null;
  trialDays: number | null;
  description: string | null;
  ctaLabel: string | null;
  changeReason: string | null;
  createdAt: string | null;
  features: {
  featureKey: string;
  enabled: boolean | null;
  limitValue: number | null;
  overageEnabled: boolean;
  overagePriceEuro: number | null;
}[];
};
export type GetAdminPlanVersionTenantsReadResponse = {
  data: {
  subscriptionId: string;
  tenantId: string;
  tenantName: string;
  status: string;
  createdAt: string | null;
}[];
  total: number;
  limit: number;
  offset: number;
};
export type PostAdminPlanVersionMigrateCohortResponse = {
  succeeded: {
  subscriptionId: string;
  fromVersionId: string;
  toVersionId: string;
}[];
  failed: {
  subscriptionId: string;
  reason: string;
}[];
};
export type PostAdminSubscriptionMigrateVersionResponse = {
  subscriptionId: string;
  fromVersionId: string;
  toVersionId: string;
  diff: IPlanVersionDiff;
};
export type GetAdminPromoCodeReadResponse = IPromoCodeDto[];
export type PostAdminPromoCodeCreateResponse = IPromoCodeDto;
export type PatchAdminPromoCodeUpdateResponse = IPromoCodeDto;
export type GetAdminPromoCodeRedemptionsResponse = IPromoCodeRedemptionListItemDto[];
export type PostAdminPromoCodeRuleCreateResponse = IPromoCodeDto;
export type GetAdminBillingOverviewResponse = {
  tenantId?: string;
  tenantName?: string;
  planName?: string;
  billingPeriod?: PromoCodeApplicableBillingPeriods | null;
  nextInvoiceDate?: string;
  projectedTotalOverageEuro?: number;
  status?: 'on_track' | 'approaching' | 'at_limit' | 'over_limit';
  topOverageFeature?: string | null;
}[];
export type PostAdminDevToolsAdvanceBillingResponse = {
  advanced?: number;
  skipped?: number;
  errors?: {
  tenant?: string;
  error?: string;
}[];
};
export type PostAdminDevToolsGenerateOverageInvoicesResponse = {
  billed?: number;
  skipped?: number;
  errors?: number;
};
export type GetAdminBillingPendingRecordsResponse = {
  recordId?: string;
  tenantId?: string;
  tenantName?: string;
  planName?: string;
  billingPeriod?: PromoCodeApplicableBillingPeriods | null;
  featureKey?: string;
  periodStart?: string;
  periodEnd?: string;
  shouldHaveBeenBilledOn?: string;
  daysOverdue?: number;
  overageUnits?: number;
  totalAmountEuro?: number;
}[];
export type PostAdminBillingRunCronResponse = {
  billed?: number;
  skipped?: number;
  errors?: number;
  lockHeld?: boolean | null;
};
export type GetAdminAuditLogsReadResponse = IAuditLog[];
export type GetAdminAuditLogsEntityTypesResponse = string[];
export type GetGlobalSettingReadResponse = IGlobalSetting[] | IGlobalSetting;
export type PostGlobalSettingCreateResponse = IGlobalSetting;
export type PostStripeCustomerPortalResponse = {
  url?: string;
};
export type PostOrganizationCreateResponse = IOrganization;
export type PostUserInviteResponse = {
  user?: IUserRead;
  message?: string;
};
export type GetUserGetTenantsResponse = ITenant[];
export type PatchUserSwitchTenantResponse = {
  token?: string;
};
export type PostUserResendInvitationResponse = {
  message?: string;
};
export type PostPrivateCustomerCreateResponse = IPrivateCustomer;
export type GetPrivateCustomerReadResponse = (IPrivateCustomer | {
  data?: IPrivateCustomer[];
  total?: number;
});
export type PostOrderCreateResponse = IOrder;
export type PostOrderCalculateTripResponse = ITripSummaryDto;
export type PostOrderCalculatePricingResponse = IPricingSummaryDto;
export type PostInvoiceCreateResponse = Invoice;
export type PostQuoteCreateResponse = IQuote;
export type PostPackageCategoryCreateResponse = IPackageCategory;
export type GetPackageCategoryReadResponse = (IPackageCategory | {
  data?: IPackageCategory[];
  total?: number;
});
export type PostWeightPricingTierCreateResponse = IWeightPricingTier;
export type GetWeightPricingTierReadResponse = (IWeightPricingTier | {
  data?: IWeightPricingTier[];
  total?: number;
});
export type PostVehicleCreateResponse = IVehicle;
export type PostWarehouseCreateResponse = IWarehouse;
export type PostWarehouseOrderReadResponse = IOrderWarehouseResponseDto[];
export type PostDriverScheduleCreateResponse = IDriverSchedule;
export type GetDriverScheduleReadResponse = IDriverSchedule[] | IDriverSchedule;
export type PostDeliveryZoneCreateResponse = IDeliveryZone;
export type GetDeliveryZoneReadResponse = IDeliveryZone[] | IDeliveryZone;
export type GetSubscriptionReadResponse = ISubscription & {
  planLatestVersion?: {
  id?: string;
  versionNumber?: number;
} | null;
  signedAt?: string | null;
  effectiveFeatures?: {
  featureKey?: string;
  type?: 'boolean' | 'limit';
  enabled?: boolean | null;
  limitValue?: number | null;
  overageEnabled?: boolean;
  overagePriceEuro?: number | null;
}[];
};
export type GetSubscriptionActiveDiscountResponse = {
  couponRef?: string | null;
  label?: string | null;
  code?: string | null;
  expiresAt?: string | null;
};
export type PostSubscriptionResumeCheckoutResponse = {
  url?: string;
};
export type PostSubscriptionSubscribeToPlanResponse = {
  url?: string;
};
export type PostSubscriptionPromoPreviewResponse = {
  code?: string;
  type?: string;
  percentOff?: number | null;
  amountOff?: number | null;
  currency?: string | null;
  duration?: string | null;
  durationInMonths?: number | null;
  trialDays?: number | null;
};
export type GetSubscriptionUsageResponse = {
  periodStart?: string;
  periodEnd?: string;
  nextInvoiceDate?: string;
  projectedTotalOverageEuro?: number;
  totalOverageEuro?: number;
  limits?: {
  featureKey?: string;
  limit?: number;
  currentUsage?: number | null;
  percentUsed?: number | null;
  status?: 'on_track' | 'approaching' | 'at_limit' | 'over_limit' | 'unlimited' | 'unknown';
  allowOverage?: boolean;
  overagePricePerUnit?: number | null;
  overageUnits?: number;
  projectedOverageEuro?: number;
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
};
export type GetSubscriptionPaymentMethodResponse = {
  brand?: string | null;
  last4?: string | null;
  expMonth?: number | null;
  expYear?: number | null;
};
export type PostSubscriptionSetupIntentResponse = {
  clientSecret?: string;
};
export type PostMeAddTenantResponse = {
  checkoutUrl?: string;
  subscriptionId?: string;
  tenantId?: string;
};
export type PostPublicActivateAccountResponse = {
  token?: string;
  message?: string;
};
export type PostPublicForgotPasswordResponse = {
  message?: string;
};
export type PostPublicResetPasswordResponse = {
  message?: string;
};
export type GetPublicPlanReadResponse = IPlan[];
export type PostPublicContactCreateResponse = {
  message?: string;
};
export type GetPublicPilotProgramReadResponse = IPilotProgramStatus;
export type PostPublicPromoPreviewResponse = {
  code?: string;
  type?: string;
  percentOff?: number | null;
  amountOff?: number | null;
  currency?: string | null;
  duration?: string | null;
  durationInMonths?: number | null;
  trialDays?: number | null;
};
export type PostChatCreateMessageResponse = IChatMessage;
export type GetChatReadMessagesResponse = IChatMessage[];
export type GetChatListConversationsResponse = IChatMessage[];
export type GetChatListTenantUsersResponse = IUser[];
