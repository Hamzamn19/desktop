const notSupported = cb => {
  const err = new Error('fs-admin is not supported on this platform')
  if (typeof cb === 'function') {
    process.nextTick(() => cb(err))
    return
  }
  throw err
}

const unlink = (_path, cb) => notSupported(cb)
const makeTree = (_path, cb) => notSupported(cb)
const symlink = (_target, _path, cb) => notSupported(cb)

module.exports = { unlink, makeTree, symlink }
