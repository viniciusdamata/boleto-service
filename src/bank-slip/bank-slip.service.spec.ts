import { Test, TestingModule } from '@nestjs/testing';
import { BankSlipService } from './bank-slip.service';

describe('BankSlipService', () => {
  let service: BankSlipService;

  const validBankSlips = [
    {
      serialNumber: '34195000080123320318964221470004584410000002000',
      barCode: '34195844100000020005000001233203186422147000',
      amount: '20.00',
      expirationDate: '2020-11-16',
    },
    {
      serialNumber: '23793381286000782713695000063305975520000370000',
      barCode: '23799755200003700003381260007827139500006330',
      amount: '3700.00',
      expirationDate: '2018-06-11',
    },
    {
      serialNumber: '00190500954014481606906809350314337370000000100',
      barCode: '00193373700000001000500940144816060680935031',
      amount: '1.00',
      expirationDate: '2007-12-31',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankSlipService],
    }).compile();

    service = module.get<BankSlipService>(BankSlipService);
    expect(service).toBeDefined();
  });

  it('should return a barcode, amount and expiration date given the valid serial numbers', () => {
    validBankSlips.map((bankSlip) =>
      expect(service.validate(bankSlip.serialNumber)).toEqual({
        barCode: bankSlip.barCode,
        amount: bankSlip.amount,
        expirationDate: bankSlip.expirationDate,
      }),
    );
  });

  it('should throw an error for wrong length serial numbers', () => {
    const wrongLengthSerialNumber = '0019050095401448160690680935031433';

    expect(() => service.validate(wrongLengthSerialNumber)).toThrowError(
      /wrong-length/,
    );
  });

  it('should throw an error for invalid serial numbers', () => {
    const invalidSerialNumber =
      '34195400080123320318964221470004584410000002000';
    expect(() => service.validate(invalidSerialNumber)).toThrowError(
      /invalid-serial-number/,
    );
  });
});
