// Linux-friendly persistent shim for keytar to bypass native build.
// Persists credentials to a JSON file in the user's home directory so tokens
// survive restarts in environments where the native keyring isn't available.
import * as Fs from 'fs'
import * as Path from 'path'
import * as Os from 'os'
import * as Crypto from 'crypto'

const STORE_FILENAME = '.github-desktop-tokenstore.json'
const STORE_PATH = Path.join(Os.homedir(), STORE_FILENAME)

const store = new Map<string, string>()

const makeKey = (service: string, account: string) => `${service}::${account}`

// Attempt to derive an encryption key from machine-specific/stable environment
function deriveKey(): Buffer {
  const salt = 'github-desktop-tokenstore-salt-v1'
  let machineId = ''
  try {
    // On many Linux systems /etc/machine-id exists and is stable across reboots
    if (Fs.existsSync('/etc/machine-id')) {
      machineId = Fs.readFileSync('/etc/machine-id', 'utf8').trim()
    }
  } catch {}

  if (!machineId) {
    try {
      machineId = Os.hostname()
    } catch {}
  }

  const user = process.env.USER || ''
  const base = `${user}:${machineId}`
  // Derive a 32-byte key using PBKDF2 so we don't hardcode a key
  return Crypto.pbkdf2Sync(base, salt, 100_000, 32, 'sha256')
}

function loadStoreFromDisk() {
  try {
    if (!Fs.existsSync(STORE_PATH)) {
      return
    }
    const raw = Fs.readFileSync(STORE_PATH, { encoding: 'utf8' })
    const parsed = JSON.parse(raw) as any

    // If file looks encrypted (has data/iv/tag), attempt decryption
    if (parsed && parsed.data && parsed.iv && parsed.tag) {
      try {
        const key = deriveKey()
        const iv = Buffer.from(parsed.iv, 'base64')
        const tag = Buffer.from(parsed.tag, 'base64')
        const encrypted = Buffer.from(parsed.data, 'base64')
        const decipher = Crypto.createDecipheriv('aes-256-gcm', key, iv)
        decipher.setAuthTag(tag)
        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
        const obj = JSON.parse(decrypted.toString('utf8')) as Record<string, string>
        for (const k of Object.keys(obj)) {
          store.set(k, obj[k])
        }
        console.log(`[KEYTAR-SHIM] Loaded ${Object.keys(obj).length} entries from ${STORE_PATH}`)
        return
      } catch (e) {
        // Decryption failed (likely key mismatch) — handle gracefully
        console.error('[KEYTAR-SHIM] Failed to decrypt token store (will not crash)', e)
        return
      }
    }

    // Fallback: assume plaintext JSON mapping (older format)
    if (parsed && typeof parsed === 'object') {
      for (const k of Object.keys(parsed)) {
        store.set(k, parsed[k])
      }
      console.log(`[KEYTAR-SHIM] Loaded ${Object.keys(parsed).length} entries from ${STORE_PATH}`)
    }
  } catch (e) {
    console.error('[KEYTAR-SHIM] Failed to load token store from disk', e)
  }
}

function persistStoreToDisk() {
  try {
    const obj: Record<string, string> = {}
    for (const [k, v] of store.entries()) {
      obj[k] = v
    }

    const plaintext = JSON.stringify(obj)
    const key = deriveKey()
    const iv = Crypto.randomBytes(12)
    const cipher = Crypto.createCipheriv('aes-256-gcm', key, iv)
    const encrypted = Buffer.concat([cipher.update(Buffer.from(plaintext, 'utf8')), cipher.final()])
    const tag = cipher.getAuthTag()

    const payload = {
      v: 1,
      iv: iv.toString('base64'),
      tag: tag.toString('base64'),
      data: encrypted.toString('base64')
    }

    Fs.writeFileSync(STORE_PATH, JSON.stringify(payload), { encoding: 'utf8' })
    console.log(`[KEYTAR-SHIM] Persisted ${Object.keys(obj).length} entries to ${STORE_PATH} (encrypted)`)
  } catch (e) {
    console.error('[KEYTAR-SHIM] Failed to persist token store to disk', e)
  }
}

loadStoreFromDisk()

export function setPassword(
  service: string,
  account: string,
  password: string
) {
  store.set(makeKey(service, account), password)
  try {
    persistStoreToDisk()
  } catch {}
  return Promise.resolve()
}

export function getPassword(service: string, account: string) {
  const value = store.get(makeKey(service, account)) ?? null
  console.log(`[KEYTAR-SHIM] getPassword ${service} / ${account} -> ${value ? 'FOUND' : 'MISSING'}`)
  return Promise.resolve(value)
}

export function deletePassword(service: string, account: string) {
  const deleted = store.delete(makeKey(service, account))
  try {
    persistStoreToDisk()
  } catch {}
  return Promise.resolve(deleted)
}
