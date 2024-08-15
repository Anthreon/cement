import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  ProductLine,
  Status,
} from '../pages/order-history/order-history.component';
import { isEqual } from 'lodash';

export interface Order {
  status: 'In Progress' | 'Pending' | 'Completed';
  orderNumber: number;
  productLine: 'Ready-Mix' | 'Cement' | 'Aggregates' | 'All product lines';
  product: string;
  quantity: string;
  dateRequested: Date;
}

export interface Filters {
  status: Status[];
  productLines: ProductLine[];
  from: Date | undefined;
  to: Date | undefined;
  searchOrder: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private defaultFilters: Filters = {
    status: [
      { name: 'Pending', checked: false },
      { name: 'In Progress', checked: false },
      { name: 'Completed', checked: false },
    ],
    productLines: [
      { selected: true, viewValue: 'All product lines' },
      { selected: false, viewValue: 'Cement' },
      { selected: false, viewValue: 'Aggregates' },
      { selected: false, viewValue: 'Ready-Mix' },
    ],
    from: undefined,
    to: undefined,
    searchOrder: '',
  };

  public currentFilters: BehaviorSubject<Filters> =
    new BehaviorSubject<Filters>({
      status: [
        { name: 'Pending', checked: false },
        { name: 'In Progress', checked: false },
        { name: 'Completed', checked: false },
      ],
      productLines: [
        { selected: true, viewValue: 'All product lines' },
        { selected: false, viewValue: 'Cement' },
        { selected: false, viewValue: 'Aggregates' },
        { selected: false, viewValue: 'ReadyMix' },
      ],
      from: undefined,
      to: undefined,
      searchOrder: '',
    });

  private defaultOrders: Order[] = [
    {
      status: 'In Progress',
      orderNumber: 3301,
      productLine: 'Ready-Mix',
      product: '1-200-2-C-28-12-1-3-000',
      quantity: '12 m3',
      dateRequested: new Date(),
    },
    {
      status: 'Pending',
      orderNumber: 3305,
      productLine: 'Cement',
      product: 'Gris CPC 30 R Monterrey Extra 50Kg',
      quantity: '10 TN',
      dateRequested: new Date(),
    },
    {
      status: 'Pending',
      orderNumber: 3290,
      productLine: 'Aggregates',
      product: 'Arena Triturada Caliza Malla 4',
      quantity: '2 TN',
      dateRequested: new Date(),
    },
    {
      status: 'Completed',
      orderNumber: 3184,
      productLine: 'Aggregates',
      product: 'Arena Triturada Caliza Malla 4',
      quantity: '5 TN',
      dateRequested: new Date(),
    },
    {
      status: 'Completed',
      orderNumber: 3295,
      productLine: 'Cement',
      product: 'Gris CPC30R Tolteca Extra 50Kg',
      quantity: '12 TN',
      dateRequested: new Date(),
    },
    {
      status: 'Completed',
      orderNumber: 2994,
      productLine: 'Ready-Mix',
      product: '1-200-2-C-28-14-1-3-000',
      quantity: '15.5 m3',
      dateRequested: new Date(),
    },
  ];

  constructor() {}

  public getDefaultOrders(): Order[] {
    return structuredClone(this.defaultOrders);
  }

  // Filter orders based on criteria
  filterOrders(newFilters: Filters): Order[] {
    // console.log(newFilters);
    // console.log(this.defaultFilters);
    if (isEqual(this.defaultFilters, newFilters)) {
      return this.defaultOrders;
    }

    let filteredOrders: Order[] = structuredClone(this.defaultOrders);

    const activeStatusFilters = newFilters.status
      .filter((f) => f.checked)
      .map((f) => f.name);

    console.log(activeStatusFilters);

    if (activeStatusFilters.length > 0) {
      filteredOrders = this.defaultOrders.filter((order) => {
        return newFilters.status?.some((status: Status) => {
          if (order.status === status.name && status.checked) {
            return true;
          }
          return false;
        });
      });
    }

    console.log('First filter: ', filteredOrders);

    const selectedProductLine = newFilters.productLines.find(
      (pl) => pl.selected && pl.viewValue !== 'All product lines'
    );

    if (selectedProductLine) {
      filteredOrders = filteredOrders.filter((order) => {
        return newFilters.productLines?.some((productLine: ProductLine) => {
          if (
            order.productLine === productLine.viewValue &&
            productLine.selected
          ) {
            return true;
          }
          return false;
        });
      });
    }

    // Filter by date range (from and to)
    if (newFilters.from) {
      filteredOrders = filteredOrders.filter(
        (order) => order.dateRequested >= newFilters.from!
      );
    }

    if (newFilters.to) {
      filteredOrders = filteredOrders.filter(
        (order) => order.dateRequested <= newFilters.to!
      );
    }

    // Filter by searchOrder (order number search)
    if (newFilters.searchOrder.length > 0) {
      filteredOrders = filteredOrders.filter((order) =>
        order.orderNumber.toString().includes(newFilters.searchOrder)
      );
    }

    console.log('Second filter: ', filteredOrders);

    return filteredOrders;
  }
}
