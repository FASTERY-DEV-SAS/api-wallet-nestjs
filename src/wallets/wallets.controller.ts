import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Wallets')
@ApiBearerAuth()
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  // USER++
  @Post('createWallet')
  @Auth(ValidRoles.user)
  createWallet(
    @Body() createWalletDto: CreateWalletDto,
    @GetUser() user: User,
  ) {
    return this.walletsService.createWallet(createWalletDto, user);
  }
  // USER++
  @Patch('updateWallet/:id')
  @Auth(ValidRoles.user)
  updateWallet(
    @Param('id') id: string,
    @Body() updateWalletDto: UpdateWalletDto,
  ) {
    return this.walletsService.updateWallet(id, updateWalletDto);
  }
  // USER++
  @Get('getWallet/:id')
  @Auth(ValidRoles.user)
  getWallet(@Param('id') id: string, @GetUser() user: User) {
    return this.walletsService.getWallet(id, user);
  }
  // USER++
  @Get('getTotalBalanceOfWallets')
  @Auth(ValidRoles.user)
  getTotalBalanceOfWallets(@GetUser() user: User) {
    return this.walletsService.getTotalBalanceOfWallets(user);
  }
  // USER++
  @Get('getWallets')
  @Auth(ValidRoles.user)
  getWallets(@GetUser() user: User) {
    return this.walletsService.getWallets(user);
  }
  // ADMIN+
  @Get('updateWalletBalance/:id')
  @Auth(ValidRoles.user)
  updateWalletBalance(@Param('id') id: string) {
    return this.walletsService.updateWalletBalance(id);
  }
  // ADMIN+
  @Get('validateWalletBalance/:id')
  @Auth(ValidRoles.user)
  validateWalletBalance(@GetUser() user: User, @Param('id') id: string) {
    return this.walletsService.validateWalletBalance(user, id);
  }
}
