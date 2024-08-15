import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { skip, Subscription } from 'rxjs';
import { EmptyResultsComponent } from '../../components/empty-results/empty-results.component';
import {
  Filters,
  Order,
  ProductLine,
  Status,
} from '../../interfaces/orderHistoryInterfaces';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    MatCheckboxModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule,
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    EmptyResultsComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss',
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  private filtersSubscription: Subscription = new Subscription();
  public searchOrder: string = '';
  public from = new FormControl<Date | null>(null);
  public to = new FormControl<Date | null>(null);
  public displayedColumns: string[] = [
    'status',
    'orderNumber',
    'productLine',
    'product',
    'quantity',
    'dateRequested',
  ];

  public filteredOrders: Order[] = [];

  public productLines: ProductLine[] = [
    { selected: true, viewValue: 'All product lines' },
    { selected: false, viewValue: 'Cement' },
    { selected: false, viewValue: 'Aggregates' },
    { selected: false, viewValue: 'Ready-Mix' },
  ];

  public statuses: Status[] = [
    { name: 'Pending', checked: false },
    { name: 'In Progress', checked: false },
    { name: 'Completed', checked: false },
  ];

  constructor(private ordersService: OrdersService) {}

  get weHaveOrders(): boolean {
    return this.filteredOrders.length > 0;
  }

  ngOnInit(): void {
    this.filteredOrders = this.ordersService.getDefaultOrders();
    this.filtersSubscription = this.ordersService.currentFilters
      .pipe(skip(1))
      .subscribe((newFilters: Filters) => {
        this.filteredOrders = this.ordersService.filterOrders(newFilters);
      });
  }

  ngOnDestroy(): void {
    this.filtersSubscription.unsubscribe();
  }

  public updateStatus(
    checked: boolean,
    checkboxName: 'In Progress' | 'Pending' | 'Completed'
  ): void {
    const index: number = this.statuses.findIndex(
      (item) => item.name === checkboxName
    );

    this.statuses[index].checked = checked;
    const newFilters: Filters = this.ordersService.currentFilters.getValue();
    newFilters.status = this.statuses;
    this.ordersService.currentFilters.next(newFilters);
  }

  public selectProductLine(selectedProductLine: ProductLine): void {
    this.productLines.forEach((productLine) => {
      productLine.selected =
        productLine.viewValue === selectedProductLine.viewValue;
    });
    const newFilters: Filters = this.ordersService.currentFilters.getValue();
    newFilters.productLines = this.productLines;
    this.ordersService.currentFilters.next(newFilters);
  }

  // Utility function to update filters
  private updateFilters<K extends keyof Filters>(
    filterKey: K,
    value?: Filters[K]
  ): void {
    const newFilters: Filters = this.ordersService.currentFilters.getValue();
    if (value === undefined) {
      delete newFilters[filterKey];
    } else {
      newFilters[filterKey] = value;
    }
    this.ordersService.currentFilters.next(newFilters);
  }

  // Simplified methods
  public getFromSelectedDate(): void {
    const selectedDate: Date | null = this.from.value;
    this.updateFilters('from', selectedDate ?? undefined);
  }

  public getToSelectedDate(): void {
    const selectedDate: Date | null = this.to.value;
    this.updateFilters('to', selectedDate ?? undefined);
  }

  public searchForOrder(): void {
    const newFilters: Filters = this.ordersService.currentFilters.getValue();
    newFilters.searchOrder = this.searchOrder;
    this.ordersService.currentFilters.next(newFilters);
  }

  public clearFromDate(): void {
    this.from.reset();
    this.updateFilters('from');
  }

  public clearToDate(): void {
    this.to.reset();
    this.updateFilters('to');
  }

  public fromDateChange(
    type: string,
    event: MatDatepickerInputEvent<Date>
  ): void {
    this.updateFilters('from', event.value!);
  }

  public toDateChange(
    type: string,
    event: MatDatepickerInputEvent<Date>
  ): void {
    this.updateFilters('to', event.value!);
  }
}
