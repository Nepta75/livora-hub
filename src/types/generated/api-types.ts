// ⚠️ This file is auto-generated. Do not edit manually.

export interface IHistoryEndpoint {
  createdAt: string;
  updateAt: string;
}

export type AddressType = 'pickup' | 'delivery';
export type CustomerType = 'organization' | 'private_customer';
export type IPricingType = 'distance' | 'city';


// Enum Types (extracted from inline enum properties in OpenAPI schemas)
export type AddressMandatoryType = "pickup" | "delivery" | "starting_point" | "billing" | "warehouse";
export type AppliedPromoCodeType = "discount" | "trial";
export type AuditLogAction = "CREATE" | "UPDATE" | "DELETE";
export type ChangePlanBillingPeriod = "monthly" | "annual";
export type ChangePlanProrationBehavior = "create_prorations" | "none" | "always_invoice";
export type ContactRequestContext = "founding-setup" | "enterprise" | "demo";
export type ContactRequestVolume = "1-50" | "50-200" | "200-500" | "500+";
export type CreatePromoCodeDuration = "once" | "repeating" | "forever";
export type CreatePromoCodeRuleType = "ELIGIBLE_PLAN_IDS" | "ELIGIBLE_TENANT_IDS";
export type CreditNoteType = "cancellation" | "partial";
export type DispatchSettingDefaultReschedulePolicy = "SUGGEST_J1" | "AUTO_J1" | "NONE";
export type DispatchSettingTimezone = "Africa/Abidjan" | "Africa/Accra" | "Africa/Addis_Ababa" | "Africa/Algiers" | "Africa/Asmara" | "Africa/Bamako" | "Africa/Bangui" | "Africa/Banjul" | "Africa/Bissau" | "Africa/Blantyre" | "Africa/Brazzaville" | "Africa/Bujumbura" | "Africa/Cairo" | "Africa/Casablanca" | "Africa/Ceuta" | "Africa/Conakry" | "Africa/Dakar" | "Africa/Dar_es_Salaam" | "Africa/Djibouti" | "Africa/Douala" | "Africa/El_Aaiun" | "Africa/Freetown" | "Africa/Gaborone" | "Africa/Harare" | "Africa/Johannesburg" | "Africa/Juba" | "Africa/Kampala" | "Africa/Khartoum" | "Africa/Kigali" | "Africa/Kinshasa" | "Africa/Lagos" | "Africa/Libreville" | "Africa/Lome" | "Africa/Luanda" | "Africa/Lubumbashi" | "Africa/Lusaka" | "Africa/Malabo" | "Africa/Maputo" | "Africa/Maseru" | "Africa/Mbabane" | "Africa/Mogadishu" | "Africa/Monrovia" | "Africa/Nairobi" | "Africa/Ndjamena" | "Africa/Niamey" | "Africa/Nouakchott" | "Africa/Ouagadougou" | "Africa/Porto-Novo" | "Africa/Sao_Tome" | "Africa/Tripoli" | "Africa/Tunis" | "Africa/Windhoek" | "America/Adak" | "America/Anchorage" | "America/Anguilla" | "America/Antigua" | "America/Araguaina" | "America/Argentina/Buenos_Aires" | "America/Argentina/Catamarca" | "America/Argentina/Cordoba" | "America/Argentina/Jujuy" | "America/Argentina/La_Rioja" | "America/Argentina/Mendoza" | "America/Argentina/Rio_Gallegos" | "America/Argentina/Salta" | "America/Argentina/San_Juan" | "America/Argentina/San_Luis" | "America/Argentina/Tucuman" | "America/Argentina/Ushuaia" | "America/Aruba" | "America/Asuncion" | "America/Atikokan" | "America/Bahia" | "America/Bahia_Banderas" | "America/Barbados" | "America/Belem" | "America/Belize" | "America/Blanc-Sablon" | "America/Boa_Vista" | "America/Bogota" | "America/Boise" | "America/Cambridge_Bay" | "America/Campo_Grande" | "America/Cancun" | "America/Caracas" | "America/Cayenne" | "America/Cayman" | "America/Chicago" | "America/Chihuahua" | "America/Ciudad_Juarez" | "America/Costa_Rica" | "America/Coyhaique" | "America/Creston" | "America/Cuiaba" | "America/Curacao" | "America/Danmarkshavn" | "America/Dawson" | "America/Dawson_Creek" | "America/Denver" | "America/Detroit" | "America/Dominica" | "America/Edmonton" | "America/Eirunepe" | "America/El_Salvador" | "America/Fort_Nelson" | "America/Fortaleza" | "America/Glace_Bay" | "America/Goose_Bay" | "America/Grand_Turk" | "America/Grenada" | "America/Guadeloupe" | "America/Guatemala" | "America/Guayaquil" | "America/Guyana" | "America/Halifax" | "America/Havana" | "America/Hermosillo" | "America/Indiana/Indianapolis" | "America/Indiana/Knox" | "America/Indiana/Marengo" | "America/Indiana/Petersburg" | "America/Indiana/Tell_City" | "America/Indiana/Vevay" | "America/Indiana/Vincennes" | "America/Indiana/Winamac" | "America/Inuvik" | "America/Iqaluit" | "America/Jamaica" | "America/Juneau" | "America/Kentucky/Louisville" | "America/Kentucky/Monticello" | "America/Kralendijk" | "America/La_Paz" | "America/Lima" | "America/Los_Angeles" | "America/Lower_Princes" | "America/Maceio" | "America/Managua" | "America/Manaus" | "America/Marigot" | "America/Martinique" | "America/Matamoros" | "America/Mazatlan" | "America/Menominee" | "America/Merida" | "America/Metlakatla" | "America/Mexico_City" | "America/Miquelon" | "America/Moncton" | "America/Monterrey" | "America/Montevideo" | "America/Montserrat" | "America/Nassau" | "America/New_York" | "America/Nome" | "America/Noronha" | "America/North_Dakota/Beulah" | "America/North_Dakota/Center" | "America/North_Dakota/New_Salem" | "America/Nuuk" | "America/Ojinaga" | "America/Panama" | "America/Paramaribo" | "America/Phoenix" | "America/Port-au-Prince" | "America/Port_of_Spain" | "America/Porto_Velho" | "America/Puerto_Rico" | "America/Punta_Arenas" | "America/Rankin_Inlet" | "America/Recife" | "America/Regina" | "America/Resolute" | "America/Rio_Branco" | "America/Santarem" | "America/Santiago" | "America/Santo_Domingo" | "America/Sao_Paulo" | "America/Scoresbysund" | "America/Sitka" | "America/St_Barthelemy" | "America/St_Johns" | "America/St_Kitts" | "America/St_Lucia" | "America/St_Thomas" | "America/St_Vincent" | "America/Swift_Current" | "America/Tegucigalpa" | "America/Thule" | "America/Tijuana" | "America/Toronto" | "America/Tortola" | "America/Vancouver" | "America/Whitehorse" | "America/Winnipeg" | "America/Yakutat" | "Antarctica/Casey" | "Antarctica/Davis" | "Antarctica/DumontDUrville" | "Antarctica/Macquarie" | "Antarctica/Mawson" | "Antarctica/McMurdo" | "Antarctica/Palmer" | "Antarctica/Rothera" | "Antarctica/Syowa" | "Antarctica/Troll" | "Antarctica/Vostok" | "Arctic/Longyearbyen" | "Asia/Aden" | "Asia/Almaty" | "Asia/Amman" | "Asia/Anadyr" | "Asia/Aqtau" | "Asia/Aqtobe" | "Asia/Ashgabat" | "Asia/Atyrau" | "Asia/Baghdad" | "Asia/Bahrain" | "Asia/Baku" | "Asia/Bangkok" | "Asia/Barnaul" | "Asia/Beirut" | "Asia/Bishkek" | "Asia/Brunei" | "Asia/Chita" | "Asia/Colombo" | "Asia/Damascus" | "Asia/Dhaka" | "Asia/Dili" | "Asia/Dubai" | "Asia/Dushanbe" | "Asia/Famagusta" | "Asia/Gaza" | "Asia/Hebron" | "Asia/Ho_Chi_Minh" | "Asia/Hong_Kong" | "Asia/Hovd" | "Asia/Irkutsk" | "Asia/Jakarta" | "Asia/Jayapura" | "Asia/Jerusalem" | "Asia/Kabul" | "Asia/Kamchatka" | "Asia/Karachi" | "Asia/Kathmandu" | "Asia/Khandyga" | "Asia/Kolkata" | "Asia/Krasnoyarsk" | "Asia/Kuala_Lumpur" | "Asia/Kuching" | "Asia/Kuwait" | "Asia/Macau" | "Asia/Magadan" | "Asia/Makassar" | "Asia/Manila" | "Asia/Muscat" | "Asia/Nicosia" | "Asia/Novokuznetsk" | "Asia/Novosibirsk" | "Asia/Omsk" | "Asia/Oral" | "Asia/Phnom_Penh" | "Asia/Pontianak" | "Asia/Pyongyang" | "Asia/Qatar" | "Asia/Qostanay" | "Asia/Qyzylorda" | "Asia/Riyadh" | "Asia/Sakhalin" | "Asia/Samarkand" | "Asia/Seoul" | "Asia/Shanghai" | "Asia/Singapore" | "Asia/Srednekolymsk" | "Asia/Taipei" | "Asia/Tashkent" | "Asia/Tbilisi" | "Asia/Tehran" | "Asia/Thimphu" | "Asia/Tokyo" | "Asia/Tomsk" | "Asia/Ulaanbaatar" | "Asia/Urumqi" | "Asia/Ust-Nera" | "Asia/Vientiane" | "Asia/Vladivostok" | "Asia/Yakutsk" | "Asia/Yangon" | "Asia/Yekaterinburg" | "Asia/Yerevan" | "Atlantic/Azores" | "Atlantic/Bermuda" | "Atlantic/Canary" | "Atlantic/Cape_Verde" | "Atlantic/Faroe" | "Atlantic/Madeira" | "Atlantic/Reykjavik" | "Atlantic/South_Georgia" | "Atlantic/St_Helena" | "Atlantic/Stanley" | "Australia/Adelaide" | "Australia/Brisbane" | "Australia/Broken_Hill" | "Australia/Darwin" | "Australia/Eucla" | "Australia/Hobart" | "Australia/Lindeman" | "Australia/Lord_Howe" | "Australia/Melbourne" | "Australia/Perth" | "Australia/Sydney" | "Europe/Amsterdam" | "Europe/Andorra" | "Europe/Astrakhan" | "Europe/Athens" | "Europe/Belgrade" | "Europe/Berlin" | "Europe/Bratislava" | "Europe/Brussels" | "Europe/Bucharest" | "Europe/Budapest" | "Europe/Busingen" | "Europe/Chisinau" | "Europe/Copenhagen" | "Europe/Dublin" | "Europe/Gibraltar" | "Europe/Guernsey" | "Europe/Helsinki" | "Europe/Isle_of_Man" | "Europe/Istanbul" | "Europe/Jersey" | "Europe/Kaliningrad" | "Europe/Kirov" | "Europe/Kyiv" | "Europe/Lisbon" | "Europe/Ljubljana" | "Europe/London" | "Europe/Luxembourg" | "Europe/Madrid" | "Europe/Malta" | "Europe/Mariehamn" | "Europe/Minsk" | "Europe/Monaco" | "Europe/Moscow" | "Europe/Oslo" | "Europe/Paris" | "Europe/Podgorica" | "Europe/Prague" | "Europe/Riga" | "Europe/Rome" | "Europe/Samara" | "Europe/San_Marino" | "Europe/Sarajevo" | "Europe/Saratov" | "Europe/Simferopol" | "Europe/Skopje" | "Europe/Sofia" | "Europe/Stockholm" | "Europe/Tallinn" | "Europe/Tirane" | "Europe/Ulyanovsk" | "Europe/Vaduz" | "Europe/Vatican" | "Europe/Vienna" | "Europe/Vilnius" | "Europe/Volgograd" | "Europe/Warsaw" | "Europe/Zagreb" | "Europe/Zurich" | "Indian/Antananarivo" | "Indian/Chagos" | "Indian/Christmas" | "Indian/Cocos" | "Indian/Comoro" | "Indian/Kerguelen" | "Indian/Mahe" | "Indian/Maldives" | "Indian/Mauritius" | "Indian/Mayotte" | "Indian/Reunion" | "Pacific/Apia" | "Pacific/Auckland" | "Pacific/Bougainville" | "Pacific/Chatham" | "Pacific/Chuuk" | "Pacific/Easter" | "Pacific/Efate" | "Pacific/Fakaofo" | "Pacific/Fiji" | "Pacific/Funafuti" | "Pacific/Galapagos" | "Pacific/Gambier" | "Pacific/Guadalcanal" | "Pacific/Guam" | "Pacific/Honolulu" | "Pacific/Kanton" | "Pacific/Kiritimati" | "Pacific/Kosrae" | "Pacific/Kwajalein" | "Pacific/Majuro" | "Pacific/Marquesas" | "Pacific/Midway" | "Pacific/Nauru" | "Pacific/Niue" | "Pacific/Norfolk" | "Pacific/Noumea" | "Pacific/Pago_Pago" | "Pacific/Palau" | "Pacific/Pitcairn" | "Pacific/Pohnpei" | "Pacific/Port_Moresby" | "Pacific/Rarotonga" | "Pacific/Saipan" | "Pacific/Tahiti" | "Pacific/Tarawa" | "Pacific/Tongatapu" | "Pacific/Wake" | "Pacific/Wallis" | "UTC";
export type DriverScheduleStatus = "planned" | "active" | "completed" | "cancelled";
export type DriverScheduleTimeSlotType = "work" | "break" | "lunch" | "meeting" | "unavailable";
export type DriverScheduleType = "regular" | "overtime" | "on_call" | "emergency";
export type GenerateMorningBatchObjective = "asap" | "min_delay" | "optimize_global";
export type GlobalSettingPricingType = "distance" | "city";
export type GlobalSettingRecapAutomationLevel = "off" | "prepare" | "auto";
export type HubUserRoles = "ROLE_ADMIN" | "ROLE_MODERATOR";
export type InviteUserPayModel = "fixed" | "per_credit";
export type InviteUserRoles = "ROLE_CUSTOMER" | "ROLE_CUSTOMER_ADMIN" | "ROLE_DELIVERER" | "ROLE_MANAGER" | "ROLE_MANAGER_ADMIN";
export type OrderCustomerType = "private_customer" | "organization";
export type OrganizationBillingMode = "per_order" | "monthly";
export type PlanFeatureKey = "max_users" | "max_drivers" | "max_orders_per_month" | "max_quotes_per_month" | "max_invoices_per_month" | "max_customers" | "max_vehicles" | "max_warehouses" | "max_pricing_configs" | "max_dispatch_sectors" | "max_prestations" | "max_address_searches_per_month" | "max_route_calculations_per_month" | "can_create_quotes" | "can_create_invoices" | "can_use_dispatch" | "can_use_planning" | "can_use_messaging" | "can_manage_fleet" | "can_view_audit_logs" | "can_use_api" | "can_use_embedded_ordering" | "can_configure_stripe" | "can_use_premium_address_search" | "can_use_route_optimization";
export type PlanType = "standard" | "custom";
export type RecordDriverLocationSource = "simulated" | "gps" | "manual";
export type RefundSubscriptionInvoiceReason = "duplicate" | "fraudulent" | "requested_by_customer";
export type RescheduleOrderReason = "LATE" | "CUSTOMER_REQUEST" | "CAPACITY" | "FAILED_DELIVERY";
export type SubscriptionSource = "stripe" | "manual";
export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | "incomplete" | "registration_failed";
export type TimeSlotDayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export type UpdateTourStopStatusStatus = "arrived" | "completed" | "failed";
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
  phoneNumber: string | null;
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

export interface IAdminEmbeddedPaymentSettingsDto {
  authCaptureEnabled: boolean;
  forceImmediatePayment: boolean;
  onlinePaymentEnabled: boolean;
  chargesEnabled: boolean;
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

export interface IBillingIdentity {
  line1?: string | null;
  line2?: string | null;
  postalCode?: string | null;
  city?: string | null;
  country?: string | null;
  complete: boolean;
}

export interface IChangePlanDto {
  targetPlanId?: string;
  billingPeriod?: ChangePlanBillingPeriod;
  prorationBehavior?: ChangePlanProrationBehavior | null;
  reason?: string | null;
  previewedAt?: number | null;
  force?: boolean;
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

export interface ICommitSuggestionDto {
  chosenDriverId?: string;
  vehicleId?: string | null;
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

export interface ICreditNote {
  id: string;
  tenant: ITenant;
  invoice: Invoice;
  creditNoteNumber: string;
  series: string;
  sequenceYear: number;
  sequenceNumber: number;
  type: string;
  reason: string;
  amountHtCents: number;
  vatCents: number;
  amountTtcCents: number;
  vatRate?: number | null;
  issuedAt: string;
  sentDate?: string | null;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  auditIdentifier: string;
  amountHt: number;
  vat: number;
  amountTtc: number;
}

export interface ICreditNoteDto {
  type: CreditNoteType;
  reason: string;
  amountHtCents?: number | null;
  refundOnline?: boolean;
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
  urgency?: number;
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

export interface IDispatchSector {
  id: string;
}

export interface IDispatchSector2 {
  id: string;
  tenantId: string;
  label: string;
  pricingConfigs: IPricingConfig[];
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  auditIdentifier: string;
}

export interface IDispatchSectorDto {
  label?: string;
  pricingConfigIds?: string[];
}

export interface IDispatchSetting {
  id: string;
  tenantId: string;
  lateModeTriggerMinutes: number;
  comfortableMarginMinutes: number;
  maxRescheduleCount: number;
  defaultReschedulePolicy: string;
  timezone: string;
  maxDeliveryDelayMinutes: number;
  etaDriftThresholdMinutes: number;
  liveRerouteEnabled: boolean;
  urgencyLatenessMultiplier: number;
  shiftOverrunToleranceMinutes: number;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  auditIdentifier: string;
}

export interface IDispatchSettingDto {
  lateModeTriggerMinutes: number;
  comfortableMarginMinutes: number;
  maxRescheduleCount: number;
  maxDeliveryDelayMinutes?: number;
  etaDriftThresholdMinutes?: number;
  defaultReschedulePolicy: DispatchSettingDefaultReschedulePolicy;
  timezone: DispatchSettingTimezone;
  liveRerouteEnabled?: boolean;
  urgencyLatenessMultiplier?: number;
  shiftOverrunToleranceMinutes?: number;
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

export interface IDriverBaseDto {
  latitude: number | null;
  longitude: number | null;
  label?: string | null;
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
  vehicle?: IVehicle | null;
  base: IGeoPoint2;
  dispatchSector?: IDispatchSector2 | null;
  notes?: string | null;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  effectiveDispatchSector?: IDispatchSector2 | null;
}

export interface IDriverScheduleDto {
  driverId: string;
  scheduledDate: string;
  status: DriverScheduleStatus;
  scheduleType: DriverScheduleType;
  preferredZoneId?: string | null;
  vehicleId?: string | null;
  dispatchSectorId?: string | null;
  base?: IDriverBaseDto | null;
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

export interface IExtendTrialDto {
  trialEndsAt: string | null;
  reason?: string;
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

export interface IFinalizeFromSessionDto {
  sessionId?: string;
}

export interface IForgotPasswordDto {
  email: string;
}

export interface IGenerateMorningBatchDto {
  sectorId?: string;
  date?: string;
  objective?: GenerateMorningBatchObjective;
}

export interface IGeoPoint {
  latitude?: number | null;
  longitude?: number | null;
  label?: string | null;
}

export interface IGeoPoint2 {
  latitude?: number | null;
  longitude?: number | null;
  label?: string | null;
  coordinates: boolean;
}

export interface IGlobalSetting {
  id: string;
  tenantId: string;
  customerDefaultCreditPrice: number;
  orderMinimumCreditAmount: number;
  pricingType: string;
  embeddedApplicationFeeRate?: number;
  embeddedAuthCaptureEnabled?: boolean;
  defaultBillingDayOfMonth?: number | null;
  recapAutomationLevel?: string;
  recapAutomationLevelChangedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  auditIdentifier: string;
}

export interface IGlobalSettingDto {
  customerDefaultCreditPrice: number;
  orderMinimumCreditAmount: number;
  pricingType: GlobalSettingPricingType;
  defaultBillingDayOfMonth?: number | null;
  recapAutomationLevel?: GlobalSettingRecapAutomationLevel | null;
  acknowledgeUnreviewed?: boolean;
}

export interface IHistoryInterface {
  createdAt: string;
  updatedAt: string;
  archivedAt: string;
}

export interface IHoldOrderBillingDto {
  reason: string;
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
  payModel?: InviteUserPayModel;
  creditRate?: number | null;
  defaultVehicleId?: string | null;
  defaultDispatchSectorId?: string | null;
  defaultBase?: IDriverBaseDto | null;
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
  bankName?: string | null;
  bankIban?: string | null;
  bankBic?: string | null;
  bankCode?: string | null;
  bankAccountNumber?: string | null;
  bankAccountHolderName?: string | null;
  invoiceNumber?: string | null;
  issuedAt?: string | null;
  sequenceNumber?: number | null;
  sequenceYear?: number | null;
  series?: string | null;
  dueDate: string;
  sentDate?: string | null;
  paymentDate?: string | null;
  collectedOnlineCents?: number;
  heldOnlineCents?: number;
  collectedOnlineAt?: string | null;
  creditPriceCents?: number;
  totalCredit?: number;
  subTotalCents?: number;
  tvaRate?: number | null;
  fuelChargeShareRate?: number | null;
  tvaPriceCents?: number;
  totalPriceCents?: number;
  status: string;
  reviewReasons?: string[] | null;
  orders: IOrder[];
  relanceCount?: number;
  relancedAt?: string | null;
  totalWeight?: number;
  deliveryPrestationLabel?: string | null;
  deliveryPrestationPriceCents?: number;
  weightPriceCents?: number;
  creditTotalCents?: number;
  totalVolume?: number;
  warehousePriceCents?: number | null;
  adjustmentsTotalCents?: number;
  lines: InvoiceLine[];
  periodStart?: string | null;
  periodEnd?: string | null;
  contentHash?: string | null;
  orderCount?: number | null;
  recipientEmail?: string | null;
  mailPendingSince?: string | null;
  mailAttempts?: number;
  creditNotes: ICreditNote[];
  creditedCents?: number;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  auditIdentifier: string;
  creditPrice: number;
  subTotal: number;
  fuelChargeAmount?: number | null;
  tvaPrice: number;
  totalPrice: number;
  remainingDueCents: number;
  demandingPayment: boolean;
  remainingDue: number;
  collectedOnline: number;
  heldOnline: number;
  settledOnline: boolean;
  acquitted: boolean;
  deliveryPrestationPrice: number;
  weightPrice: number;
  creditTotal: number;
  warehousePrice?: number | null;
  adjustmentsTotal: number;
  credited: number;
  creditableCents: number;
  fullyCredited: boolean;
}

export interface InvoiceBatchCustomerDto {
  customerId: string;
  customerType: OrderCustomerType;
}

export interface InvoiceBatchDto {
  month: string;
  customers?: InvoiceBatchCustomerDto[];
  acknowledgeOverage?: boolean;
  acknowledgedDocumentCount?: number | null;
}

export interface InvoiceLine {
  id: string;
  invoice: Invoice;
  position?: number;
  type: string;
  orderId: string;
  releasedAt?: string | null;
  orderReference?: string | null;
  description: string;
  pickupDate?: string | null;
  deliveryDate?: string | null;
  pickupAddress?: string | null;
  deliveryAddress?: string | null;
  quantity?: number;
  unitAmountCents?: number;
  amountCents?: number;
  vatRateBps?: number | null;
  vatAmountCents?: number;
  weightKg?: number;
  volumeM3?: number;
  credits?: number;
  warehouseCents?: number | null;
  weightCents?: number;
  creditCents?: number;
  creditPriceCents?: number;
  prestationCents?: number;
  prestationLabel?: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  amount: number;
  unitAmount: number;
  vatRate?: number | null;
  creditPrice: number;
  prestation: number;
}

export interface IssueInvoiceDto {
  acknowledgeOverage?: boolean;
  acknowledgedDocumentCount?: number | null;
}

export interface IssueOrderInvoiceDto {
  acknowledgeOverage?: boolean;
  acknowledgedDocumentCount?: number | null;
}

export interface IManualAssignOrderDto {
  orderId?: string;
  driverId?: string;
  insertionPosition?: number | null;
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

export interface IOnlinePaymentSettingsDto {
  enabled: boolean;
  applicationFeeRate: number;
  chargesEnabled: boolean;
  authCaptureEnabled: boolean;
  forceImmediatePayment: boolean;
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
  source?: string;
  totalCredit: number;
  collectionCredit?: number;
  deliveryCredit?: number;
  totalPrice?: number;
  pricedAt?: string | null;
  priceHt?: number;
  tvaPrice?: number;
  tvaRate?: number | null;
  warehousePrice?: number | null;
  deliveryPrestationPrice?: number;
  deliveryPrestationLabel?: string;
  creditPrice?: number;
  totalCreditPrice?: number;
  adjustmentsTotal?: number;
  pricingConfig?: IPricingConfig | null;
  requiresManualPricing?: boolean;
  paymentState?: string;
  paymentAmount?: number | null;
  paymentRefundedAmount?: number | null;
  customer?: IHistoryInterface | null;
  invoice?: Invoice | null;
  billingHeldAt?: string | null;
  billingHoldReason?: string | null;
  quote?: IQuote | null;
  pickupAsSoonAsPossible?: boolean;
  deliveryAsSoonAsPossible?: boolean;
  warehouse?: IWarehouse | null;
  warehouseRadius?: number | null;
  adjustments: IOrderAdjustment[];
  originalDeliveryDate?: string | null;
  rescheduledReason?: string | null;
  rescheduledCount?: number;
  strictTimeWindow?: boolean;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  auditIdentifier: string;
  shortReference: string;
  pickupFormattedDate: string;
  totalCreditAmount: number;
  frozenPricing: boolean;
  heldFromBilling: boolean;
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
  pricingConfigId?: string | null;
  deliveryPrestationId: string;
  pricingConfig?: IPricingConfig | null;
}

export interface IOrderMandatoryDto {
  pickupPoints?: IOrderPickupPointDto[];
  deliveryPoints?: IOrderDeliveryPointDto[];
  pricingConfigId: string | null;
  deliveryPrestationId: string;
  pricingConfig?: IPricingConfig | null;
}

export interface IOrderPayment {
  id: string;
  tenantId: string;
  provider?: string;
  channel?: string;
  providerSessionRef?: string | null;
  providerPaymentIntentRef?: string | null;
  connectAccountId?: string | null;
  amount?: number;
  currency?: string;
  applicationFeeAmount?: number | null;
  status?: string;
  refundedAmount?: number;
  createdOrderId?: string | null;
  paidAt?: string | null;
  authorizedAmount?: number | null;
  authorizedAt?: string | null;
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
  vatNumber?: string | null;
  billingIdentity: IBillingIdentity;
  billingMode?: string;
  billingDayOfMonth?: number | null;
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
  vatNumber?: string | null;
  billingMode?: OrganizationBillingMode | null;
  billingDayOfMonth?: number | null;
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
  pricingMode?: string | null;
  sector?: IDispatchSector2 | null;
  priority?: number;
  serviceRadiusKm?: number | null;
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
  tvaRate?: number | null;
  adjustmentsTotal?: number;
  requiresManualPricing?: boolean;
}

export interface IPrivateCustomer {
  id: string;
  tenantId: string;
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
  billingIdentity: IBillingIdentity;
  billingMode?: string;
  billingDayOfMonth?: number | null;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  auditIdentifier: string;
}

export interface IPrivateCustomerRef {
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
  billingMode?: OrganizationBillingMode | null;
  billingDayOfMonth?: number | null;
  defaultBillingAddress: IAddressDto;
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
  applicableBillingPeriods?: ChangePlanBillingPeriod[] | null;
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
  billingPeriod: ChangePlanBillingPeriod;
}

export interface IPublicCustomerDto {
  isCompany?: boolean;
  companyName?: string | null;
  siretNumber?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  company: boolean;
}

export interface IPublicOrderDto {
  customer: IPublicCustomerDto;
  pickupDate: string;
  deliveryDate: string;
  pickupAsSoonAsPossible?: boolean;
  deliveryAsSoonAsPossible?: boolean;
  pickupPoints: IOrderPickupPointDto[];
  deliveryPoints: IOrderDeliveryPointDto[];
  pricingConfigId?: string | null;
  deliveryPrestationId: string;
  pricingConfig?: IPricingConfig | null;
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
  tvaRate?: number | null;
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
  tvaRate?: number | null;
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

export interface IRecordDriverLocationDto {
  latitude?: number;
  longitude?: number;
  source?: RecordDriverLocationSource;
  speed?: number | null;
  accuracy?: number | null;
}

export interface IRefundOrderPaymentDto {
  amount?: number | null;
}

export interface IRefundSubscriptionInvoiceDto {
  amount?: number | null;
  reason?: RefundSubscriptionInvoiceReason;
  note?: string | null;
}

export interface IRegisterFinalizeDto {
  sessionId?: string;
}

export interface IReorderTourDto {
  stopIds?: string[];
}

export interface IRescheduleCarryOverDto {
  orderIds?: string[];
  targetDate?: string;
  reason?: RescheduleOrderReason;
  notifyCustomer?: boolean;
}

export interface IRescheduleOrderDto {
  newDeliveryDate: string;
  newPickupDate?: string | null;
  reason: RescheduleOrderReason;
  notifyCustomer?: boolean;
}

export interface IResetPasswordDto {
  token: string;
  password: string;
}

export interface IResumeCheckoutDto {
  promoCode?: string | null;
}

export interface IRoutePreviewDto {
  suggestionId?: string;
  driverId?: string;
  tourId?: string | null;
  insertionPosition?: number | null;
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
  billingPeriod: ChangePlanBillingPeriod;
  promoCode?: string | null;
}

export interface ISubscription {
  billingPeriod?: ChangePlanBillingPeriod | null;
  pendingBillingPeriod?: ChangePlanBillingPeriod | null;
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
  pendingScheduleId?: string | null;
  pendingChangeEffectiveAt?: string | null;
  pendingPlan?: IPlan2 | null;
  active: boolean;
}

export interface ISubscription2 {
  billingPeriod?: ChangePlanBillingPeriod | null;
  pendingBillingPeriod?: ChangePlanBillingPeriod | null;
  id: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
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
  refundedAmount?: number;
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
  refunds: ISubscriptionInvoiceRefund[];
  automaticTaxEnabled?: boolean;
  automaticTaxStatus?: string | null;
  issuerVatRegime: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export interface ISubscriptionInvoiceCreditNote {
  id: string;
  creditNoteNumber: string;
  currency: string;
  amountHt: number;
  taxAmount: number;
  amountTtc: number;
  taxRatePct: string;
  reason: string;
  issuedAt: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
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
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export interface ISubscriptionInvoiceRefund {
  id: string;
  amount: number;
  currency: string;
  reason: string;
  note?: string | null;
  status: string;
  failureReason?: string | null;
  provider: string;
  actorEmail?: string | null;
  creditNote?: ISubscriptionInvoiceCreditNote | null;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
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
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export interface ISuggestSingleInsertionDto {
  orderId?: string;
  objective?: GenerateMorningBatchObjective;
}

export interface ITenant {
  user?: IUser;
  id: string;
  apiKey: string;
  tenantAdminUser?: IUser | null;
  name: string;
  logo?: string | null;
  brandColor?: string | null;
  publicEmbedId?: string | null;
  allowedEmbedOrigins?: string[];
  embeddedOnlinePaymentEnabled?: boolean;
  embeddedApplicationFeeRate?: number | null;
  embeddedForceImmediatePayment?: boolean;
  email: string;
  userTenants: IUserTenantRead[];
  bankDetails: IBankDetail[];
  siretNumber: string;
  rcsCity: string;
  address?: IAddress | null;
  vatNumber?: string | null;
  vatRate?: number | null;
  fuelChargeShareRate?: number | null;
  defaultBankDetail?: IBankDetail | null;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  auditIdentifier: string;
  sirenNumber: string;
  users: IUser[];
}

export interface ITenant2 {
  user?: IUser;
}

export interface ITenant3 {
  user?: IUser;
  id: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export interface ITenant4 {
  user?: IUser;
  id: string;
}

export interface ITenant5 {
  user?: IUser;
  name: string;
}

export interface ITenantApiKey {
  id: string;
  tenantId: string;
  type: string;
  prefix: string;
  allowedOrigins?: string[];
  scopes?: string[];
  label?: string | null;
  lastUsedAt?: string | null;
  revokedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export interface ITenantPaymentAccount {
  id: string;
  tenantId: string;
  provider: string;
  externalAccountId?: string | null;
  status?: string;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
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
  billingPeriod?: ChangePlanBillingPeriod;
}

export interface ITenantRegisterStartDto {
  email: string;
  turnstileToken?: string;
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
  collectionCredit?: number;
  deliveryCredit?: number;
}

export interface IUpdateAdminEmbeddedPaymentSettingsDto {
  authCaptureEnabled: boolean | null;
}

export interface IUpdateEmbeddedOrderingDto {
  brandColor?: string | null;
  allowedEmbedOrigins?: string[];
}

export interface IUpdateHubUserDto {
  firstName: string;
  lastName: string;
  email: string;
}

export interface IUpdateHubUserRolesDto {
  roles: HubUserRoles[];
}

export interface IUpdateOnlinePaymentSettingsDto {
  enabled?: boolean | null;
  forceImmediatePayment?: boolean | null;
}

export interface IUpdatePasswordDto {
  password: string;
}

export interface IUpdatePromoCodeDto {
  maxRedemptions?: number | null;
  expiresAt?: string | null;
}

export interface IUpdateTenantBillingDto {
  address: ITenantRegisterAddressDto;
  vatNumber?: string;
  vatRate?: number | null;
  fuelChargeShareRate?: number | null;
}

export interface IUpdateTourStopStatusDto {
  status: UpdateTourStopStatusStatus;
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
  defaultVehicleId?: string | null;
  defaultDispatchSectorId?: string | null;
  defaultBase?: IDriverBaseDto | null;
  payModel?: InviteUserPayModel;
  creditRate?: number | null;
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
  defaultVehicle?: IVehicle | null;
  defaultBase: IGeoPoint2;
  defaultDispatchSector?: IDispatchSector2 | null;
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
  creditRate?: number | null;
  payModel?: string | null;
  payModelForTenant: string;
  creditRateForTenant: string;
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
  defaultVehicle?: IVehicle2 | null;
  defaultBase: IGeoPoint;
  defaultDispatchSector?: IDispatchSector | null;
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
  payModel?: string;
  creditRate?: number | null;
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

export interface IVehicle2 {
  id: string;
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
  timeSlots?: ITimeSlotDto[] | null;
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
export type GetAdminUserListResponse = {
  data?: { [key: string]: unknown }[];
  total?: number;
};
export type GetAdminTenantListResponse = {
  data?: {
  tenant?: { [key: string]: unknown };
  userCount?: number;
  subscription?: { [key: string]: unknown } | null;
}[];
  total?: number;
};
export type GetAdminTenantOptionsResponse = {
  id?: string;
  name?: string;
}[];
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
  billingPeriod?: ChangePlanBillingPeriod | null;
  trialEndsAt?: string | null;
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
  pendingScheduleId?: string | null;
  pendingChangeEffectiveAt?: string | null;
  pendingBillingPeriod?: ChangePlanBillingPeriod | null;
  pendingPlan?: {
  id?: string;
  name?: string;
} | null;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: string | null;
  lastPlanChange?: {
  message?: string;
  createdAt?: string;
} | null;
  customerBalance?: {
  cents?: number;
  currency?: string;
} | null;
};
export type PostAdminTenantSubscriptionChangePlanPreviewResponse = {
  lineItems: {
  description?: string;
  amountCents?: number;
  periodStart?: string | null;
  periodEnd?: string | null;
  isProration?: boolean;
}[];
  totalCreditCents: number;
  totalChargeCents: number;
  effectiveAt?: string | null;
  nextInvoiceDate?: string | null;
  previewedAt: number;
  currency: string;
  billingPeriod: ChangePlanBillingPeriod;
  scheduledAt?: string | null;
  targetPriceCents: number;
  subtotalCents: number;
  totalAmountCents: number;
};
export type GetAdminTenantSubscriptionInvoiceReadResponse = {
  data?: ISubscriptionInvoice[];
  total?: number;
};
export type GetAdminTenantEmbeddedPaymentReadResponse = IAdminEmbeddedPaymentSettingsDto;
export type PatchAdminTenantEmbeddedPaymentUpdateResponse = IAdminEmbeddedPaymentSettingsDto;
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
export type GetAdminDashboardMetricsResponse = {
  tenants?: {
  total?: number;
  active?: number;
  trialing?: number;
  pastDue?: number;
  canceled?: number;
  canceledThisMonth?: number;
};
  revenue?: {
  currency?: string;
  totalPaidEuro?: number;
  currentMonthPaidEuro?: number;
  mrrEuro?: number;
};
  refunds?: {
  currency?: string;
  totalRefundedEuro?: number;
  currentMonthRefundedEuro?: number;
  recent?: {
  refundId?: string;
  invoiceId?: string;
  invoiceNumber?: string;
  tenantId?: string;
  tenantName?: string;
  amountEuro?: number;
  currency?: string;
  reason?: RefundSubscriptionInvoiceReason;
  status?: 'pending' | 'requires_action' | 'succeeded' | 'failed' | 'canceled';
  createdAt?: string | null;
}[];
};
  recentPayments?: {
  invoiceId?: string;
  invoiceNumber?: string;
  tenantId?: string;
  tenantName?: string;
  amountPaidEuro?: number;
  currency?: string;
  kind?: 'subscription' | 'overage' | 'subscription_with_overage' | 'other';
  paidAt?: string | null;
}[];
  recentSubscriptions?: {
  subscriptionId?: string;
  tenantId?: string;
  tenantName?: string;
  planName?: string;
  status?: SubscriptionStatus;
  billingPeriod?: ChangePlanBillingPeriod | null;
  createdAt?: string | null;
}[];
};
export type GetAdminBillingOverviewResponse = {
  tenantId?: string;
  tenantName?: string;
  planName?: string;
  billingPeriod?: ChangePlanBillingPeriod | null;
  nextInvoiceDate?: string;
  projectedTotalOverageEuro?: number;
  alreadyBilledTotalEuro?: number;
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
export type PostAdminDevToolsSeedTenantDataResponse = {
  tenantId?: string;
  vehicles?: { [key: string]: unknown };
  drivers?: { [key: string]: unknown };
  warehouses?: { [key: string]: unknown };
  customers?: { [key: string]: unknown };
  ordersAppended?: number;
  schedulesAppended?: number;
  warnings?: string[];
};
export type DeleteAdminDevToolsPurgeTenantSeedDataResponse = {
  tenantId?: string;
  tours?: number;
  assignmentSuggestions?: number;
  driverLocations?: number;
  driverSchedules?: number;
  orders?: number;
  orderAddresses?: number;
  deliveryPrestations?: number;
  pricingConfigs?: number;
  organizations?: number;
  organizationAddresses?: number;
  warehouses?: number;
  vehicles?: number;
  userTenants?: number;
  users?: number;
};
export type GetAdminBillingPendingRecordsResponse = {
  recordId?: string;
  tenantId?: string;
  tenantName?: string;
  planName?: string;
  billingPeriod?: ChangePlanBillingPeriod | null;
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
export type GetDispatchSettingReadResponse = IDispatchSetting;
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
export type GetOrderPaymentReadResponse = {
  payment?: { [key: string]: unknown } | null;
  recipientEmail?: string | null;
  canSendLink?: boolean;
  blockedReason?: 
    | 'already_collected'
    | 'account_cannot_collect'
    | 'zero_amount'
    | 'customer_has_no_email' | null;
};
export type PostOrderPaymentLinkResponse = IOrderPayment;
export type PostOrderCalculateTripResponse = ITripSummaryDto;
export type PostOrderCalculatePricingResponse = IPricingSummaryDto;
export type GetInvoiceListResponse = {
  data: Invoice[];
  total: number;
  summary: {
  outstandingCents: number;
  overdueCents: number;
  overdueCount: number;
  collectedThisMonthCents: number;
  draftCount: number;
  reviewNeededDraftCount: number;
};
};
export type PostInvoiceOrderIssueResponse = Invoice;
export type GetInvoiceBillableReadResponse = {
  month: string;
  groups: {
  customerId: string;
  customerType: string;
  customerName: string;
  customerEmail: string;
  billingMode: OrganizationBillingMode;
  documentCount: number;
  orderCount: number;
  subTotalCents: number;
  vatCents: number;
  totalCents: number;
  periodStart: string;
  periodEnd: string;
  courses: {
  orderId: string;
  reference: string;
  subTotalCents: number;
  vatCents: number;
  totalCents: number;
  pickupDate: string;
  deliveryDate: string;
  estimated: boolean;
}[];
  blockedReason: string | null;
  estimated: boolean;
}[];
  orderCount: number;
  documentCount: number;
  totalCents: number;
  backlog: {
  month: string;
  orderCount: number;
}[];
  held: {
  orderId: string;
  reference: string;
  customerId: string;
  customerName: string;
  totalCents: number;
  month: string;
  deliveryDate: string;
  heldAt: string;
  reason: string | null;
}[];
};
export type PostInvoiceBatchCreateResponse = {
  issued: {
  customerId: string;
  invoiceId: string;
  invoiceNumber: string;
  totalCents: number;
  orderCount: number;
}[];
  failed: {
  customerId: string;
  reason: string;
}[];
  skipped: {
  customerId: string;
  reason: string;
}[];
  aborted: boolean;
};
export type PostInvoiceCreditNoteCreateResponse = {
  creditNote: ICreditNote;
  refundedCents: number;
  refundError: string | null;
  delivered: boolean;
};
export type GetQuoteListResponse = {
  data: IQuote[];
  total: number;
  summary: {
  awaitingResponseCount: number;
  awaitingResponseTotal: number;
  wonThisMonthCount: number;
  wonThisMonthTotal: number;
  draftCount: number;
};
};
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
export type PostSubscriptionChangePlanPreviewResponse = {
  lineItems: {
  description?: string;
  amountCents?: number;
  periodStart?: string | null;
  periodEnd?: string | null;
  isProration?: boolean;
}[];
  totalCreditCents: number;
  totalChargeCents: number;
  effectiveAt?: string | null;
  nextInvoiceDate?: string | null;
  previewedAt: number;
  currency: string;
  billingPeriod: ChangePlanBillingPeriod;
  scheduledAt?: string | null;
  targetPriceCents: number;
  subtotalCents: number;
  totalAmountCents: number;
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
  effectiveLimit?: number;
  billedOverageUnits?: number;
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
export type PostSubscriptionFinalizeFromSessionResponse = {
  status?: string | null;
  subscriptionId?: string | null;
};
export type PostMeAddTenantResponse = {
  checkoutUrl?: string;
  subscriptionId?: string;
  tenantId?: string;
};
export type GetMeDashboardSummaryResponse = {
  counters?: {
  currency?: string;
  activeOrders?: number;
  pendingOrders?: number;
  deliveredThisMonth?: number;
  deliveredPreviousMonth?: number;
  deliveredTrendPercent?: number | null;
  revenueThisMonthEuro?: number;
  revenuePreviousMonthEuro?: number;
  revenueTrendPercent?: number | null;
};
  subscription?: {
  status?: string;
  isActive?: boolean;
  planName?: string;
  trialEndsAt?: string | null;
  trialDaysRemaining?: number | null;
  currentPeriodEnd?: string | null;
  canceledAt?: string | null;
};
  topQuotas?: {
  featureKey?: string;
  limit?: number;
  effectiveLimit?: number;
  currentUsage?: number | null;
  percentUsed?: number | null;
  status?: 'on_track' | 'approaching' | 'at_limit' | 'over_limit' | 'unlimited' | 'unknown';
}[];
  recentOrders?: {
  orderId?: string;
  reference?: string;
  status?: string;
  totalPrice?: number;
  pickupDate?: string;
  createdAt?: string | null;
}[];
  recentCustomers?: {
  totalUsers?: number;
  totalOrganizations?: number;
  totalPrivateCustomers?: number;
};
  ordersByWeek?: {
  weekStart?: string;
  actives?: number;
  livrees?: number;
  annulees?: number;
}[];
  revenueByMonth?: {
  monthStart?: string;
  count?: number;
  revenueEuro?: number;
}[];
};
export type GetMeListApiKeysResponse = ITenantApiKey[];
export type PostMeConnectRefreshResponse = ITenantPaymentAccount;
export type GetMeReadPaymentAccountResponse = ITenantPaymentAccount;
export type GetMeReadOnlinePaymentResponse = IOnlinePaymentSettingsDto;
export type PatchMeUpdateOnlinePaymentResponse = IOnlinePaymentSettingsDto;
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
