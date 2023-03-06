export abstract class HttpException extends Error {
  public ERROR_CODE: number;
  public status: number;
  public message: any;

  constructor(status: number, message: any) {
    super(message);
    this.status = status;
    this.message = message;
  }
}
