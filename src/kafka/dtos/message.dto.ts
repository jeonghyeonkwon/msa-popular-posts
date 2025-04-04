import { TypeEnum } from './type.enum';

export class KafkaMessageDto<T> {
  eventId: Number;
  type: TypeEnum;
  payload: T;
}
