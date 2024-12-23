import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
import { UpdateAnalyticsDto } from './dto/update-analytics.dto';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { TransfersService } from 'src/transfers/transfers.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly transfersService: TransfersService) {}

  async chartTransfers(user: User, paginationDto: PaginationDto) {
    const { transfers } = await this.transfersService.getTransfers(
      user,
      paginationDto,
    );
    const dailyData: {
      [key: string]: { total: number; expense: number; income: number };
    } = {};

    // Recorre las transferencias y agrúpalas por día
    for (const transfer of transfers) {
      const day = transfer.operationAt.toISOString().split('T')[0]; // Obtén la fecha en formato YYYY-MM-DD
      if (!dailyData[day]) {
        dailyData[day] = { total: 0, expense: 0, income: 0 };
      }

      // Calcula el total y clasifica como retiro o depósito
      const amount = transfer.total;
      dailyData[day].total += amount;

      if (transfer.type === 'expense') {
        dailyData[day].expense += amount;
      } else if (transfer.type === 'income') {
        dailyData[day].income += amount;
      }
    }

    // Convierte el objeto en un array, divide expense e income por 100, y ordena por día
    const chartData = Object.keys(dailyData)
      .map((day) => ({
        day: new Date(day).getDate().toString(), // Extrae solo el día del mes
        ...dailyData[day],
      }))
      .sort((a, b) => a.day.localeCompare(b.day));

    // Calcula el promedio de gastos e ingresos en porcentaje
    const totalDays = chartData.length;
    const totalExpense = chartData.reduce((sum, day) => sum + day.expense, 0);
    const totalIncome = chartData.reduce((sum, day) => sum + day.income, 0);

    const averageExpensePercentage = totalExpense / totalDays / 10000;
    const averageIncomePercentage = totalIncome / totalDays / 10000;

    return {
      message: 'Chart transfers',
      data: chartData,
      averageExpensePercentage: averageExpensePercentage.toFixed(2),
      averageIncomePercentage: averageIncomePercentage.toFixed(2),
    };
  }
}
