import { Module } from '@nestjs/common';
import { BankSlipController } from './bank-slip.controller';
import { BankSlipService } from './bank-slip.service';

@Module({
  controllers: [BankSlipController],
  providers: [BankSlipService],
})
export class BankSlipModule {}
