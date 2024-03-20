export interface RequestI {
  name_request: string;
  request_code: string;
  description_request: string;
  status_request: boolean;
}
export interface DoorAccessRequestRegisterI {
  reason: string;
  office_number: number;
  area: string;
  position: string;
  code: string;
}

export interface UpdateRequestI {
  request_id: number;
  status_id_request: number;
  description?: string;
}

// export interface GetRequestI {
//   id: number;
//   code: string;
//   reason: string;
//   area: string;
//   position: string;
//   date_creation: string;
//   first_name: string;
//   last_name: string;
//   identification: string;
//   email: string;
//   formatted_date?: string;
//   full_name_admin?: string;
//   name_request: string;
// }
export interface GetRequestI {
  user_data_admin: UserDataAdmin;
  request:         Request;
}

export interface Request {
  id:             number;
  area:           string;
  code:           string;
  email:          string;
  reason:         string;
  position:       string;
  last_name:      string;
  first_name:     string;
  name_request:   string;
  date_creation:  string;
  identification: string;
  formatted_date?: string;
}

export interface UserDataAdmin {
  email_admim:      string;
  last_name_admin:  string;
  first_name_admin: string;
}


export interface GetPdf {
  requests_id: number;
}

export interface RegisterRequestI {
  code: string;
  reason: string;
  type_request_id: number;
}

export interface ListRequestI {
  id: number;
  full_name: string;
  name_request: string;
  code: string;
  name_status: string;
  color_status: string;
}

export interface GetRequestNotificationI {
  // id:          number;
  code:        string;
  description: string;
  name_status: string;
  full_name:   string;
  email:       string;
}

export interface ReportPDFI {
  admin:  Admin;
  report: Report;
  formatted_date: string;
  hour:string;
}

export interface Admin {
  email:     string;
  full_name: string;
}

export interface Report {
  total_requests:          number;
  total_requests_accepted: number;
  total_requests_earring: number;
  total_requests_rejected: number;
}

export interface UpdateTypeRequestI {
  request_type_id:  number;
  status:   boolean;
}
