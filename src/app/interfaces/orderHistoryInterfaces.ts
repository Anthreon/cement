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

export interface Status {
  name: 'In Progress' | 'Pending' | 'Completed';
  checked: boolean;
}

export interface ProductLine {
  selected: boolean;
  viewValue: string;
}
