export class Result {
  total?: number;
  message?: string | object;
  error: boolean;
  data: any[];

  constructor({ data, error, total, message }) {
    this.data = data;
    this.error = error;
    this.total = total;
    this.message = message;
  }
}