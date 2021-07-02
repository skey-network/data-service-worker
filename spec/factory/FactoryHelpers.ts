export const randInt = (min: number, max: number) => Math.floor(Math.random() * max + min)

export const randElement = <T>(arr: T[]) => arr[randInt(0, arr.length - 1)]

export const randBool = () => Math.random() < 0.5

export const randTimestamp = () => {
  const day = 3600 * 24 * 1000
  const year = 365 * day

  const min = Date.now() + day
  const max = Date.now() + year

  return randInt(min, max)
}

export const multiplyAndExec = <T>(func: () => T, count: number) =>
  Array(count)
    .fill(null)
    .map(() => func())

export const basicInfoEntries = (type: string, name: string, desc: String) => [
  { key: 'type', value: type },
  { key: 'name', value: name },
  { key: 'description', value: desc }
]
