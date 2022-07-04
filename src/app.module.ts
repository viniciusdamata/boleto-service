import { Module } from '@nestjs/common';
import { BankSlipModule } from './bank-slip/bank-slip.module';
import { BankSlipService } from './bank-slip/bank-slip.service';

@Module({
  imports: [BankSlipModule],
  controllers: [],
  providers: [BankSlipService],
})
export class AppModule {}
