// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiURL: 'http://82.201.223.6:2020/edaapi/api/',
  secondApiURL: 'http://92.205.58.182:2045/api/',
 // secondApiURL: 'https://localhost:44323/api/',
  thirdApiURL: 'http://82.201.223.6:2051/api/', // Verna
  cloudServerApiURL: 'http://92.205.58.182:2045/api/' ,
  cloudValidationServerApiURL: 'http://92.205.58.182:2046/api/' 
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
