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
  name: 'In Progress' | 'Pending' | 'Completed' | 'Default' | undefined;
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
  displayedColumns: string[] = [
    'status',
    'orderNumber',
    'productLine',
    'product',
    'quantity',
    'dateRequested',
  ];

  orders: Order[] = [];
  filteredOrders: Order[] = [];

  public productLines: ProductLine[] = [
    { selected: true, viewValue: 'All product lines' },
    { selected: false, viewValue: 'Cement' },
    { selected: false, viewValue: 'Aggregates' },
    { selected: false, viewValue: 'ReadyMix' },
  ];

  public selectedProductLine: ProductLine = {
    selected: true,
    viewValue: 'All product lines',
  };

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
    checkboxName:
      | 'In Progress'
      | 'Pending'
      | 'Completed'
      | 'Default'
      | undefined
  ) {
    const index: number = this.statuses.findIndex(
      (item) => item.name === checkboxName
    );

    this.statuses[index].checked = checked;
    console.log(this.statuses);
    const newFilters: Filters = this.ordersService.currentFilters.getValue();
    newFilters.status = this.statuses;
    this.ordersService.currentFilters.next(
      this.ordersService.currentFilters.getValue()
    );
    // this.filteredOrders = this.ordersService.filterOrders(
    //   this.statuses,
    //   this.from.value,
    //   this.to.value,
    //   this.selectedProductLine,
    //   this.searchOrder
    // );
  }

  public selectProductLine(selectedProductLine: ProductLine) {
    this.selectedProductLine = selectedProductLine;
    console.log(this.selectedProductLine);
  }

  public getFromSelectedDate(): void {
    const selectedDate: Date | null = this.from.value;
    if (selectedDate) {
      console.log('Selected Date:', selectedDate);
    } else {
      console.log('No date selected');
    }
  }

  public getToSelectedDate(): void {
    const selectedDate: Date | null = this.to.value;
    if (selectedDate) {
      console.log('Selected Date:', selectedDate);
    } else {
      console.log('No date selected');
    }
  }

  public searchForOrder() {
    console.log(this.searchOrder);
  }
}
