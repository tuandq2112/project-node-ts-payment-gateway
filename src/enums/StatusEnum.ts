export enum CurrentStatusEnum { // status cua token price va apikey
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ChargeStatusEnum {
  NEW = 'NEW',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
  UNRESOLVED = 'UNRESOLVED',
  RESOLVED = 'RESOLVED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum ContextChargeStatusEnum { // For charges with UNRESOLVED status
  UNDERPAID = 'UNDERPAID',
  OVERPAID = 'OVERPAID',
  DELAYED = 'DELAYED',
  MULTIPLE = 'MULTIPLE',
  MANUAL = 'MANUAL',
  OTHER = 'OTHER',
}
