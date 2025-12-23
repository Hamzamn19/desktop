type DesktopNotificationEvent = 'click' | 'close'

export type DesktopNotificationPermission = 'default' | 'denied' | 'granted'

export type NotificationCallback<TUserInfo = unknown> = (
  event: DesktopNotificationEvent,
  id: string,
  userInfo?: TUserInfo
) => void

let notificationHandler: NotificationCallback<any> | null = null

const supportsElectronNotification = () => {
  try {
    const { Notification } = require('electron') as typeof import('electron')
    if (typeof Notification !== 'function') {
      return false
    }
    if (typeof Notification.isSupported === 'function') {
      return Notification.isSupported()
    }
    return true
  } catch (error) {
    log.debug?.(
      'desktop-notifications shim failed to load electron Notification',
      error
    )
    return false
  }
}

const createNotificationId = () =>
  `local-${Date.now()}-${Math.random().toString(16).slice(2)}`

const emitNotificationEvent = <T>(
  event: DesktopNotificationEvent,
  id: string,
  userInfo?: T
) => {
  notificationHandler?.(event, id, userInfo)
}

const tryShowElectronNotification = <T>(
  title: string,
  body: string,
  userInfo: T | undefined,
  id: string
) => {
  try {
    const { Notification } = require('electron') as typeof import('electron')
    if (typeof Notification !== 'function') {
      return null
    }
    if (
      typeof Notification.isSupported === 'function' &&
      !Notification.isSupported()
    ) {
      return null
    }

    const notification = new Notification({ title, body })
    notification.on?.('click', () =>
      emitNotificationEvent('click', id, userInfo)
    )
    notification.on?.('close', () =>
      emitNotificationEvent('close', id, userInfo)
    )
    notification.show?.()

    return id
  } catch (error) {
    log.debug?.(
      'desktop-notifications shim could not show electron notification',
      error
    )
    return null
  }
}

const htmlPermission = (): DesktopNotificationPermission => {
  if (
    typeof Notification === 'undefined' ||
    typeof Notification.permission !== 'string'
  ) {
    return 'default'
  }

  const permission = Notification.permission
  return permission === 'denied' || permission === 'granted'
    ? permission
    : 'default'
}

export const initializeNotifications = (_opts?: {
  toastActivatorClsid?: string
}) => {
  // shim has no setup needs
}

export const terminateNotifications = () => {
  // shim has no teardown needs
}

export const onNotificationEvent = <T>(callback: NotificationCallback<T>) => {
  notificationHandler = callback as NotificationCallback<any>
}

export const supportsNotifications = () => {
  if (__LINUX__) {
    return false
  }

  return supportsElectronNotification() || typeof Notification !== 'undefined'
}

export const supportsNotificationsPermissionRequest = () =>
  typeof Notification !== 'undefined' &&
  typeof Notification.requestPermission === 'function'

export const getNotificationSettingsUrl = () => {
  if (__DARWIN__) {
    return 'x-apple.systempreferences:com.apple.preference.notifications'
  }

  if (__WIN32__) {
    return 'ms-settings:notifications'
  }

  return null
}

export const getNotificationsPermission =
  async (): Promise<DesktopNotificationPermission> => {
    return supportsNotificationsPermissionRequest()
      ? htmlPermission()
      : 'granted'
  }

export const requestNotificationsPermission = async (): Promise<boolean> => {
  if (!supportsNotificationsPermissionRequest()) {
    return true
  }

  try {
    const result = await Notification.requestPermission()
    return result === 'granted'
  } catch (error) {
    log.debug?.(
      'desktop-notifications shim failed to request permission',
      error
    )
    return false
  }
}

export const showNotification = async <T>(
  title: string,
  body: string,
  userInfo?: T
): Promise<string | null> => {
  const id = createNotificationId()

  const electronId = tryShowElectronNotification(title, body, userInfo, id)
  if (electronId !== null) {
    return electronId
  }

  if (typeof Notification !== 'undefined') {
    const notification = new Notification(title, { body })
    notification.onclick = () => emitNotificationEvent('click', id, userInfo)
    notification.onclose = () => emitNotificationEvent('close', id, userInfo)
    return id
  }

  return null
}
