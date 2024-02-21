import { BulletPointMessage } from '.';

export function isBulletPointMessage(
  object: any
): object is BulletPointMessage {
  return 'bulletPoints' in object;
}
