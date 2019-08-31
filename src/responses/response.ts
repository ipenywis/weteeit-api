export default class Response<T = any> {
  constructor(public data: T, public message?: string) {}
}
