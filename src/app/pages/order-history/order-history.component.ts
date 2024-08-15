import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Filters, Order, OrdersService } from '../../services/orders.service';
import { MatTableModule } from '@angular/material/table';
import { skip, Subscription } from 'rxjs';

export interface Status {
  name: 'In Progress' | 'Pending' | 'Completed';
  checked: boolean;
}

export interface ProductLine {
  selected: boolean;
  viewValue: string;
}

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
  ) {
    const index: number = this.statuses.findIndex(
      (item) => item.name === checkboxName
    );

    this.statuses[index].checked = checked;
    console.log(this.statuses);
    const newFilters: Filters = this.ordersService.currentFilters.getValue();
    newFilters.status = this.statuses;
    this.ordersService.currentFilters.next(newFilters);
  }

  public selectProductLine(selectedProductLine: ProductLine) {
    this.productLines.forEach((productLine) => {
      productLine.selected =
        productLine.viewValue === selectedProductLine.viewValue;
    });
    const newFilters: Filters = this.ordersService.currentFilters.getValue();
    newFilters.productLines = this.productLines;
    console.log(newFilters);
    this.ordersService.currentFilters.next(newFilters);
  }

  public getFromSelectedDate(): void {
    const selectedDate: Date | null = this.from.value;
    if (selectedDate) {
      console.log('Selected Date:', selectedDate);
      const newFilters: Filters = this.ordersService.currentFilters.getValue();
      newFilters.from = selectedDate;
      this.ordersService.currentFilters.next(newFilters);
    } else {
      console.log('No date selected');
    }
  }

  public getToSelectedDate(): void {
    const selectedDate: Date | null = this.to.value;
    if (selectedDate) {
      console.log('Selected Date:', selectedDate);
      const newFilters: Filters = this.ordersService.currentFilters.getValue();
      newFilters.to = selectedDate;
      this.ordersService.currentFilters.next(newFilters);
    } else {
      console.log('No date selected');
    }
  }

  public searchForOrder(): void {
    console.log(this.searchOrder);
    const newFilters: Filters = this.ordersService.currentFilters.getValue();
    newFilters.searchOrder = this.searchOrder;
    this.ordersService.currentFilters.next(newFilters);
  }

  public clearFromDate(): void {
    const newFilters: Filters = this.ordersService.currentFilters.getValue();
    this.from.reset();
    newFilters.from = undefined;
    this.ordersService.currentFilters.next(newFilters);
  }

  public clearToDate(): void {
    const newFilters: Filters = this.ordersService.currentFilters.getValue();
    this.to.reset();
    newFilters.to = undefined;
    this.ordersService.currentFilters.next(newFilters);
  }
}
