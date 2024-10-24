import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { CreateIncomeDto } from './dto/create-income.dto';
import { CreateExpenseDto } from './dto/create-exprense.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationRateDto } from './dto/pagination-rate.dto';

@ApiTags('Transfers')
@ApiBearerAuth()
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  // @Post('transfer')
  // @Auth(ValidRoles.user)
  // transferWalletToWallet(@Body() createTransferDto: CreateTransferDto, @GetUser() user: User) {
  //   return this.transfersService.transferWalletToWallet(createTransferDto, user);
  // }

  // USER+
  @Post('createExpense')
  @Auth(ValidRoles.user)
  createExpense(
    @Body() createExpenseDto: CreateExpenseDto,
    @GetUser() user: User,
  ) {
    return this.transfersService.createExpense(createExpenseDto, user);
  }

  // USER+
  @Post('createIncome')
  @Auth(ValidRoles.user)
  createIncome(
    @Body() createIncomeDto: CreateIncomeDto,
    @GetUser() user: User,
  ) {
    return this.transfersService.createIncome(createIncomeDto, user);
  }
  // USER+
  @Get('getTransfer/:id')
  @Auth(ValidRoles.user)
  getTransfer(@GetUser() user: User, @Param('id') id: string) {
    return this.transfersService.getTransfer(id, user);
  }
  // USER+
  @Get('getTransfers')
  @Auth(ValidRoles.user)
  getTransfers(@GetUser() user: User, @Query() paginationDto: PaginationDto) {
    return this.transfersService.getTransfers(user, paginationDto);
  }
  // USER
  @Get('getRates')
  @Auth(ValidRoles.user)
  getRates(
    @GetUser() user: User,
    @Query() paginationRateDto: PaginationRateDto,
  ) {
    return this.transfersService.getRates(user, paginationRateDto);
  }
}
