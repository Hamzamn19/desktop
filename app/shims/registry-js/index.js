const HKEY = {
  HKEY_CLASSES_ROOT: 0,
  HKEY_CURRENT_USER: 1,
  HKEY_LOCAL_MACHINE: 2,
  HKEY_USERS: 3,
}

const RegistryValueType = {
  REG_NONE: 0,
  REG_SZ: 1,
  REG_EXPAND_SZ: 2,
  REG_BINARY: 3,
  REG_DWORD_LITTLE_ENDIAN: 4,
  REG_QWORD_LITTLE_ENDIAN: 11,
}

const enumerateValues = () => []
const enumerateKeys = () => []
const setValue = () => undefined

module.exports = {
  HKEY,
  RegistryValueType,
  enumerateValues,
  enumerateKeys,
  setValue,
}
