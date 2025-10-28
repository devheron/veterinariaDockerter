declare module 'keycloak-js' {
  export default class Keycloak {
    constructor(config: any);
    init(options: any): Promise<boolean>;
    login(options?: any): void;
    logout(options?: any): void;
    token?: string;
    refreshToken?: string;
    idToken?: string;
    tokenParsed?: any;
    authenticated?: boolean;
    updateToken(minValidity: number): Promise<boolean>;
  }
}