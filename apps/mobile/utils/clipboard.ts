import * as Clipboard from 'expo-clipboard'

import { isBitcoinAddress } from './bitcoin'

export async function setClipboard(value: string): Promise<void> {
  try {
    await Clipboard.setStringAsync(value)
  } catch (_error) {
    // TO DO: add error logger
  }
}

export async function getClipboard(): Promise<string | void> {
  try {
    if (!(await Clipboard.hasStringAsync())) {
      return
    }
    const value = await Clipboard.getStringAsync()
    if (!isBitcoinAddress(value)) {
      return
    }
    return value
  } catch (_error) {}
}

export async function clearClipboard(): Promise<void> {
  try {
    await Clipboard.setStringAsync('')
  } catch (_error) {}
}