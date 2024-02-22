import { BulletPointMessage } from '.';

export function isBulletPointMessage(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any
): object is BulletPointMessage {
  return 'bulletPoints' in object;
}
