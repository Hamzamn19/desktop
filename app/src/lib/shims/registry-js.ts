// Linux shim for registry-js to avoid native module build
export enum HKEY {
  HKEY_CLASSES_ROOT = 0,
  HKEY_CURRENT_USER = 1,
  HKEY_LOCAL_MACHINE = 2,
  HKEY_USERS = 3,
}

export enum RegistryValueType {
  REG_NONE = 0,
  REG_SZ = 1,
  REG_EXPAND_SZ = 2,
  REG_BINARY = 3,
  REG_DWORD_LITTLE_ENDIAN = 4,
  REG_QWORD_LITTLE_ENDIAN = 11,
}

export type RegistryValue = {
  readonly name: string
  readonly type: RegistryValueType
  readonly data: any
}

export type RegistryStringEntry = RegistryValue & { readonly data: string }

export type RegistryKey = { readonly name: string; readonly subKey: string }

export const enumerateValues = (
  _hive: HKEY,
  _subKey: string
): ReadonlyArray<RegistryValue> => []

export const enumerateKeys = (
  _hive: HKEY,
  _subKey: string
): ReadonlyArray<RegistryKey> => []

export const setValue = (
  _hive: HKEY,
  _subKey: string,
  _name: string,
  _type: RegistryValueType,
  _data: string | number | Buffer
): void => {
  // no-op on Linux
}
