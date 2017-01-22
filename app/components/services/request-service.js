class RequestService {
  constructor($http) {
    Object.assign(this, { $http });
  }

  init(url) {
    return {
      get: () => {
        return this.$http({
          url: url,
          method: 'GET',
        })
      },
      jsonp: () => {
        return this.$http.jsonp(url, {
          jsonpCallbackParam: 'callback'
        })
      }
    }
  }

}

angular
  .module('stockApp')
  .service('requestService', RequestService)
