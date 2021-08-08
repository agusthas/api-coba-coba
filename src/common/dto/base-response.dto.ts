import { Expose } from 'class-transformer';

export type StatusType = 'success' | 'fail' | 'error';

export class BaseResponse<T extends Record<string, any>> {
  @Expose()
  public status!: StatusType;

  @Expose()
  public message!: string;

  @Expose()
  public data?: Optional<T>;

  constructor(status: StatusType, message: string, data?: T) {
    this.status = status;
    this.message = message;
    this.data = data || <T>{};
  }
}
