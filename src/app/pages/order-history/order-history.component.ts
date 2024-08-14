import { Component } from '@angular/core';
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
import { Order, OrdersService } from '../../services/orders.service';
import { MatTableModule } from '@angular/material/table';

export interface Status {
  name: string;
  checked: boolean;
}

export interface ProductLine {
  value: string;
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
export class OrderHistoryComponent {
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
    { value: 'all', viewValue: 'All product lines' },
    { value: 'cement', viewValue: 'Cement' },
    { value: 'aggregates', viewValue: 'Aggregates' },
    { value: 'readymix', viewValue: 'ReadyMix' },
  ];

  public selectedProductLine: ProductLine = {
    value: 'all',
    viewValue: 'All product lines',
  };

  public selectedStatus:
    | 'In Progress'
    | 'Pending'
    | 'Completed'
    | 'Default'
    | undefined = 'Default';

  public statuses: Status[] = [
    { name: 'Pending', checked: false },
    { name: 'In Progress', checked: false },
    { name: 'Completed', checked: false },
  ];

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.orders = this.ordersService.getDefaultOrders();
  }

  loadOrders(): void {
    this.ordersService
      .filterOrders(
        this.from.value,
        this.to.value,
        this.selectedStatus,
        this.selectedProductLine,
        this.searchOrder
      )
      .subscribe((filteredOrders) => {
        this.filteredOrders = filteredOrders;
      });
  }

  public updateStatus(checked: boolean, checkboxName: string) {
    const index: number = this.statuses.findIndex(
      (item) => item.name === checkboxName
    );
    for (let i = 0; i < this.statuses.length; i++) {
      if (i !== index) {
        this.statuses[i].checked = false;
      }
    }
    this.statuses[index].checked = checked;
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
