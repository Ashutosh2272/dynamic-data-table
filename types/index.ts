export interface RowData {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  [key: string]: any;
}

export interface Column {
  key: string;
  label: string;
  visible: boolean;
}
