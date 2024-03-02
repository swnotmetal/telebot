export interface Options {
  timeout?: number,
  protocol?: string,
  host?: string,
  apiVersion?: string,
}

export interface DetectionResult {
  language: string,
  isReliable: boolean,
  confidence: number,
}

export interface Language {
  code: string,
  name: string,
}

export interface UserStatus {
  status: string,
  date: string,
  requests: number,
  bytes: number,
  plan: string,
  plan_expires?: string,
  daily_rquests_limit: number,
  daily_bytes_limit: number,
}

export interface Client {
  get(path: string): Promise<any>;
  post(path: string, data: any): Promise<any>;
}

export default class DetectLanguage {
  client: Client;
  constructor (apiKey: string, options?: Options);
  detect(text: string): Promise<DetectionResult[]>
  detect(text: string[]): Promise<DetectionResult[][]>;
  detectCode(text: string): Promise<string | null>;
  languages(): Promise<Language[]>;
  userStatus(): Promise<UserStatus>;
}
