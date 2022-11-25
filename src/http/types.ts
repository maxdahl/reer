export type ResponseHeaders = Record<string, string> & {
  "set-cookie"?: string[];
};

export type RequestConfig = {
  method?: string;
  url: string;
  type?: string;
  headers?: Record<string, string>;
  cookies?: Record<string, string>;
  data?: any;
};
