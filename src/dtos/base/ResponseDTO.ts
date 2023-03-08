export class ResponseDTO {
  public code: number;
  public message: string;
  public data: any;
  constructor(code: number, message: string, data: any) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
}
