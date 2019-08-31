export default class Response<T extends Object> {
  /**
   * data must be an Object
   * @param data
   * @param message
   */
  constructor(data: T, public message?: string) {
    //Save args in class
    Object.assign(this, data);
  }
}
