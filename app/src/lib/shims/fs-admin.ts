// Linux shim for fs-admin to avoid native module build

const notSupported = (cb?: (err: Error | null) => void) => {
  const error = new Error('fs-admin is not supported on this platform')
  if (typeof cb === 'function') {
    queueMicrotask(() => cb(error))
    return
  }
  throw error
}

export const unlink = (path: string, cb: (err: Error | null) => void) =>
  notSupported(cb)

export const makeTree = (path: string, cb: (err: Error | null) => void) =>
  notSupported(cb)

export const symlink = (
  target: string,
  path: string,
  cb: (err: Error | null) => void
) => notSupported(cb)
