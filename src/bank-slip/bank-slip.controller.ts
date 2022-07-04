import { Controller, Get, Param } from '@nestjs/common';
import { BankSlipService } from './bank-slip.service';
import { BankSlipResponse } from './interfaces/bank-slip-response';

@Controller('boleto')
export class BankSlipController {
  constructor(private readonly bankSlipService: BankSlipService) {}

  @Get(':serialNumber')
  public async validateSerialNumber(
    @Param('serialNumber') serialNumber: string,
  ): Promise<BankSlipResponse> {
    return this.bankSlipService.validate(serialNumber);
  }
}
