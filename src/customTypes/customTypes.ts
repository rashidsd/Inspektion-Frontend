export interface BrandType {
  id?: string | undefined;
  client_id?: string | undefined;
  name: string;
  descr: string;
}

export interface ContactType {
  id?: string | undefined;
  client_id?: string | undefined;
  contact_person: string;
  contact_no: string;
  designation: string;
  email: string;
}

export interface ContactTypeVendor {
  id?: string | undefined;
  vendor_id?: string | undefined;
  contact_person: string;
  contact_no: string;
  designation: string;
  email: string;
}

export interface ClientVendorType {
  id?: string;
  name: string;
  company: string;
  web?: string;
  address?: string;
  source?: string;
  payment_terms?: string;
  payment_days?: number;
  file_name?: string;
  contacts?: ContactType[] | ContactTypeVendor[];
  brands?: BrandType[];
}

export interface ColoryType {
  id: string;
  color_name: string;
  code?: string;
  descr?: string;
}

export interface SizeType {
  id: string;
  size_name: string;
  category?: string;
  descr?: string;
}

export interface CategoryType {
  id: string;
  name: string;
  descr?: string;
}

export interface ArticleType {
  id: string;
  client_id: string;
  art_no: string;
  art_name: string;
  category: string;
  genre: string;
  color: string;
  size: string;
  brand_id: string;
  barcode?: string;
  descr?: string;
  price?: number;
  uom: string;
  is_hero: boolean;
  parent_id: string;
  season: string;
}

export interface ParentArticleType {
  id?: string;
  client_id: string;
  art_name: string;
  category: string;
  genre: string;
  brand_id: string;
  uom: string;
  hero?: boolean;
}

export interface ArticleSpecType {
  id?: number;
  article_id: string;
  descr: string;
  url: string;
  file_name: string;
  ext: string;
}

export interface OrderDetailType {
  id: number | 0;
  order_no?: string;
  article_id?: string;
  art_no?: string;
  art_name?: string;
  color?: string;
  size?: string;
  qty: number;
  price: number;
  total: number;
  barcode?: string;
}

export interface OrderMasterType {
  order_no?: string;
  dated: string;
  client_id: string;
  client_order_no: string;
  vendor_id: string;
  vendor_order_no?: string;
  remarks?: string;
  ship_date: string;
  ship_type: string;
  ship_country: string;
  ship_address: string;
  reference: string;
  order_detail: OrderDetailType[];
}

export interface UserType {
  id: string;
  user_name: string;
  email: string;
  password: string;
  confirm_password: string;
  user_type: string;
  active: boolean;
  client_id?: string;
  vendor_id?: string;
}

export interface RoleGropType {
  id: string;
  group_name: string;
  descr: string;
}

export interface RoleType {
  id: string;
  role_name: string;
  group_id: string;
  descr: string;
}

export type LoginType = {
  email: string;
  password: string;
};

export type ChangePasswordType = {
  id: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type finalInspection = {
  id?: string;
  dated: string;
  client_id: string;
  vendor_id: string;
  po_no: string;
  po_date: string;
  factory_order_no?: string;
  inspection_type: string;
  order_qty: number;
  packed_qty: number;
  presented_qty: number;
  carton_qty: number;
  article_with_colors: string;
  reference_sample?: string;
  factory_cooporation?: string;
  factory_organization?: string;
  inspection_room: string;
  inspection_team_opinion?: string;
  inspector_name?: string;
  prepared_by?: string;
  verified_by?: string;
  approved_by?: string;
  remarks?: string;
  order_no: string;
  result_summary?: string;
  article_colors?: string;
};

export type inspectionPictureType = {
  id?: string;
  inspection_no: string;
  order_no: string;
  customer_order_no: string;
  article?: string;
  color?: string;
  remarks?: string;
  file_path?: string;
  ext?: string;
};

export type inspectionAnalysisType = {
  id?: number;
  inspection_no: string;
  order_no: string;
  category: string;
  article: string;
  color: string;
  size: string;
  defect_position: string;
  detail: string;
  frequency: number;
  action: string;
};

export type WipData = {
  id?: number;
  brand?: string;
  vendor?: string;
  po_no?: string;
  po_date?: Date;
  style_name?: string;
  units_ordered?: number;
  material_order_date?: Date;
  material_inhouse_date?: Date;
  sample_start_date?: Date;
  sample_send_date?: Date;
  sample_approve_date?: Date;
  production_start_date?: Date;
  to_send_date?: Date;
  off_line_date?: Date;
  qa_complete_date?: Date;
  units_per_day?: number;
  vendor_remarks?: string;
  client_remarks?: string;
  shiped_qty?: number;
  client_id?: string;
  vendor_id?: string;
  dated?: Date;
  approve_xfactory_date?: Date;
};

export type inspectionResults = {
  id?: number;
  inspection_no: string;
  descr: string;
  workmanship: string;
  confirmity: string;
  measurment: string;
  test: string;
  packing: string;
};

export type ShipDataType = {
  id?: number;
  client_id: string;
  vendor_id: string;
  order_no: string;
  client_order_no: string;
  article_id: string;
  color: string;
  size: string;
  qty: number;
  price: number;
  amount: number;
  ship_type: string;
  ship_no: string;
  ship_date: string;
  remarks?: string;
  bl_no?: string;
  bl_date?: string;
};

export type InspectorType = {
  id?: string;
  name: string;
  mobile?: string;
  address?: string;
  active?: boolean;
};
