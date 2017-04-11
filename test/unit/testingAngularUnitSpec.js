describe('Testing  AngularJS Test Suite', function(){
    describe('Testing game Controller', function(){
        it('should initialize the hasPickedCards property in the scope', function(){
            module('mean.system');
            var scope = {};
            var ctrl;

            inject(function($controller) {
                ctrl = $controller('GameController', {$scope:scope});
            });
            expect($scope.hasPickedCards).toBe(true);

        });

    })

})