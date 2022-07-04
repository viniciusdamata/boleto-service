import { BadRequestException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { BankSlipResponse } from './interfaces/bank-slip-response';

@Injectable()
export class BankSlipService {
  validate(serialNumber: string): BankSlipResponse {
    if (serialNumber.length != 47) {
      throw new BadRequestException('wrong-length');
    }

    const [, fieldOne, vdOne, fieldTwo, vdTwo, fieldThree, vdThree] =
      serialNumber.match(/(\d{9})(\d{1})(\d{10})(\d{1})(\d{10})(\d{1})/);

    const fields = [
      { field: fieldOne, verificationDigit: vdOne },
      { field: fieldTwo, verificationDigit: vdTwo },
      { field: fieldThree, verificationDigit: vdThree },
    ];

    if (
      !fields.every(
        ({ field, verificationDigit }) =>
          this.calculateVerificationDigit(field) === Number(verificationDigit),
      )
    ) {
      throw new BadRequestException('invalid-serial-number');
    }

    return {
      barCode: this.getBarCode(serialNumber),
      amount: this.getValue(serialNumber),
      expirationDate: this.getExpirationDate(serialNumber),
    };
  }

  calculateVerificationDigit = (field: string): number => {
    const sum = field
      .split('')
      .reverse()
      .reduce((prev, curr, index) => {
        const WEIGHT = ((index + 1) % 2) + 1;
        const multiplication = parseInt(curr) * WEIGHT;
        if (multiplication > 9) {
          return prev + Math.floor(multiplication / 10 + (multiplication % 10));
        }

        return prev + multiplication;
      }, 0);

    const sub = (Math.ceil(sum / 10) * 10 - (sum % 10)) % 10;
    return sub === 10 ? 0 : sub;
  };

  /**
   *
   * AAABC.CCCCX DDDDD.DDDDDY EEEEE.EEEEEZ K UUUUVVVVVVVVVV
   * AAA B K UUUU VVVVVVVVVV CCCCC DDDDDDDDDD EEEEEEEEEE
   */

  getBarCode(serialNumber: string): string {
    let barCode = '';
    barCode += serialNumber.substring(0, 3);
    barCode += serialNumber.substring(3, 4);
    barCode += serialNumber.substring(32, 33);
    barCode += serialNumber.substring(33, 37);
    barCode += serialNumber.substring(37, 47);
    barCode += serialNumber.substring(4, 9);
    barCode += serialNumber.substring(10, 16);
    barCode += serialNumber.substring(16, 20);
    barCode += serialNumber.substring(21, 31);
    return barCode;
  }

  getValue(serialNumber: string): string {
    return serialNumber
      .substring(37, 47)
      .replace(/(0)+([1-9]+)/g, '$2')
      .replace(/(\d+)(\d\d)$/, '$1.$2');
  }

  getExpirationDate(serialNumber: string): string {
    const dateField = serialNumber.substring(33, 37);
    const BASE_DATE = new Date(2000, 6, 3, 0, 0, 0, 0);
    const BASE_FACTOR = 1000;
    const daysToAdd = Number(dateField) - BASE_FACTOR;
    return dayjs(BASE_DATE).add(daysToAdd, 'days').format('YYYY-MM-DD');
  }
}
