// export class ClientIp {
//   private _url: string;

//   constructor() {
//     this._url = "https://ipinfo.io/json";
//   }

//   async getIp() {
//     let ip = await fetch(this._url)
//       .then((res) => res.json())
//       .then((json) => {
//         return json.ip;
//       })
//       .catch((error) => {
//         console.error(error);
//         return "";
//       });
//     return ip;
//   }
// }
