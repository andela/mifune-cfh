describe('Testing  AngularJS Test Suite', function () {
  describe('Testing header Controller', function () {
    it('should test scope object', function() {
      module('mean.system');
      const scope = {};
      inject(function ($controller) {
        const ctrl = $controller('HeaderController', { $scope: scope, Global: { test: 'test' } });
      });
      expect(scope.menu.length).toBe(2);
      expect(typeof scope.global).toBe('object');
      expect(scope.global.test).toBe('test');
    });
  });
});
