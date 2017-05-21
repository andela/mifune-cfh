/* eslint-disable prefer-arrow-callback */
describe('Testing  AngularJS Test Suite', function () {
  describe('Testing header Controller', function () {
    it('should test scope object', function () {
      module('mean.system');
      const scope = {};
      let ctrl;
      inject(($controller) => {
        ctrl = $controller('HeaderController', { $scope: scope, Global: { test: 'test' } });
      });
      expect(ctrl).toBeDefined();
      expect(scope.menu.length).toBe(2);
      expect(typeof scope.global).toBe('object');
      expect(scope.global.test).toBe('test');
    });
  });
});
