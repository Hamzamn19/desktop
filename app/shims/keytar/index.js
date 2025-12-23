const store = new Map()

const makeKey = (service, account) => `${service}::${account}`

const setPassword = (service, account, password) => {
  store.set(makeKey(service, account), password)
  return Promise.resolve()
}

const getPassword = (service, account) => {
  return Promise.resolve(store.get(makeKey(service, account)) ?? null)
}

const deletePassword = (service, account) => {
  return Promise.resolve(store.delete(makeKey(service, account)))
}

module.exports = { setPassword, getPassword, deletePassword }
