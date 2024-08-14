import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ProductLine } from '../pages/order-history/order-history.component';

export interface Order {
  status: 'In Progress' | 'Pending' | 'Completed' | 'Default';
  orderNumber: number;
  productLine: 'Ready-Mix' | 'Cement' | 'Aggregates' | 'All product lines';
  product: string;
  quantity: string;
  dateRequested: Date;
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
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
  filterOrders(
    startDate?: Date | null,
    endDate?: Date | null,
    status?: 'In Progress' | 'Pending' | 'Completed' | 'Default',
    productLines?: ProductLine,
    searchString?: string
  ): Observable<Order[]> {
    return of(
      this.defaultOrders.filter((order) => {
        // Date Filtering
        if (
          startDate &&
          endDate &&
          (order.dateRequested < startDate || order.dateRequested > endDate)
        ) {
          return false;
        }

        // Status Filtering
        if (status && status.length > 0 && !status.includes(order.status)) {
          return false;
        }

        // Product Line Filtering
        if (productLines && !order.productLine.includes(productLines.value)) {
          return false;
        }

        // Search String Filtering
        if (
          searchString &&
          !(
            order.product.toLowerCase().includes(searchString.toLowerCase()) ||
            order.orderNumber.toString().includes(searchString)
          )
        ) {
          return false;
        }

        return true;
      })
    );
  }
}
