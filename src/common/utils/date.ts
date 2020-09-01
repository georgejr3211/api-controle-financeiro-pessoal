import * as moment from 'moment-timezone';

export function add(date, amount: moment.DurationInputArg1, unit: moment.unitOfTime.DurationConstructor, format: string) {
  return moment(date).add(amount, unit).format(format);
}