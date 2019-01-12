(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gameConf = require('./gameConf');

var _gameConf2 = _interopRequireDefault(_gameConf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CanvasGame = function () {
    function CanvasGame(canvasNode) {
        _classCallCheck(this, CanvasGame);

        this.isStopped = true;

        this.canvas = canvasNode;
        this.ctx = this.canvas.getContext('2d');

        this.width = document.documentElement.clientWidth;
        this.height = document.documentElement.clientHeight;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.dataCanvas = _gameConf2.default.dataCanvas;

        this.idForHandlers = 0;
        this.drawHandlers = {};
        this.actionsHandlers = {};
        this.drawHandlersInStoppedMode = [];

        this.loop();
    }

    _createClass(CanvasGame, [{
        key: 'drawAll',
        value: function drawAll() {
            var _this = this;

            this.ctx.clearRect(0, 0, this.width, this.height);
            Object.values(this.drawHandlers).forEach(function (itemFn) {
                if (itemFn != undefined) {
                    itemFn(_this.ctx);
                }
            });
            this.dataCanvas.framesAll++;
        }
    }, {
        key: 'checkActionsAll',
        value: function checkActionsAll() {
            Object.values(this.actionsHandlers).forEach(function (itemFn) {
                if (itemFn != undefined) {
                    itemFn();
                }
            });
        }
    }, {
        key: 'addActionHandler',
        value: function addActionHandler(actionHandlerFn) {
            var id = ++this.idForHandlers;
            this.actionsHandlers[id] = actionHandlerFn;
            return id;
        }
    }, {
        key: 'removeActionHandler',
        value: function removeActionHandler(idOfHandler) {
            if (!this.actionsHandlers[idOfHandler]) return;
            delete this.actionsHandlers[idOfHandler];
        }
    }, {
        key: 'addHandlerToDraw',
        value: function addHandlerToDraw(drawHandlerFn) {
            var id = ++this.idForHandlers;
            this.drawHandlers[id] = drawHandlerFn;
            return id;
        }
    }, {
        key: 'removeHandlerToDraw',
        value: function removeHandlerToDraw(idOfHandler) {
            if (!this.drawHandlers[idOfHandler]) return;
            delete this.drawHandlers[idOfHandler];
        }
    }, {
        key: 'drawAllInStoppedMode',
        value: function drawAllInStoppedMode() {
            var _this2 = this;

            this.ctx.clearRect(0, 0, this.width, this.height);
            Object.values(this.drawHandlersInStoppedMode).forEach(function (itemFn) {
                if (itemFn != undefined) {
                    itemFn(_this2.ctx);
                }
            });
            this.dataCanvas.framesAll++;
        }
    }, {
        key: 'addHandlerToDrawInStoppedMode',
        value: function addHandlerToDrawInStoppedMode(drawHandlerFn) {
            var id = ++this.idForHandlers;
            this.drawHandlersInStoppedMode[id] = drawHandlerFn;
            return id;
        }
    }, {
        key: 'removeHandlerToDrawInStoppedMode',
        value: function removeHandlerToDrawInStoppedMode(idOfHandler) {
            if (!this.drawHandlersInStoppedMode[idOfHandler]) return;
            delete this.drawHandlersInStoppedMode[idOfHandler];
        }
    }, {
        key: 'go',
        value: function go() {
            this.isStopped = false;
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.isStopped = true;
        }
    }, {
        key: 'loop',
        value: function loop() {
            var _this3 = this;

            var lastFullSeconds = performance.now() < 1000 ? 0 : parseInt(performance.now() / 1000);
            var lastTimeIteration = performance.now();
            var loop = function loop() {
                // it must check for max fps and do not draw canvas if it's too fast,
                // because the game drawing is oriented not for time and fps together
                // but only for fps ( without situation with sprites )
                if (!_this3.isStopped && performance.now() - lastTimeIteration > 1000 / _gameConf2.default.maxFramesInSecond) {
                    // check for fps
                    var nowFullSeconds = performance.now() < 1000 ? 0 : parseInt(performance.now() / 1000);
                    lastFullSeconds < nowFullSeconds ? _this3.dataCanvas.fps = 0 : _this3.dataCanvas.fps++;
                    lastFullSeconds = nowFullSeconds;

                    lastTimeIteration = performance.now();

                    _this3.checkActionsAll();
                    _this3.drawAll();
                } else if (performance.now() - lastTimeIteration > 1000 / _gameConf2.default.maxFramesInSecond) {
                    // call to drawing preloadings and else that not need to await
                    _this3.drawAllInStoppedMode();
                }
                window.requestAnimationFrame(loop);
            };
            window.requestAnimationFrame(loop);
        }
    }]);

    return CanvasGame;
}();

exports.default = CanvasGame;

},{"./gameConf":11}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gameConf = require('../gameConf');

var _gameConf2 = _interopRequireDefault(_gameConf);

var _fns = require('../fns.js');

var _fns2 = _interopRequireDefault(_fns);

var _resources = require('./resources');

var _resources2 = _interopRequireDefault(_resources);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bg = function () {
    function Bg(canvas, gameObjects, resources) {
        var _this = this;

        _classCallCheck(this, Bg);

        this.canvas = canvas;
        this.gameObjects = gameObjects;
        this.resources = resources;

        this.starsBgDrawHandler = canvas.addHandlerToDraw(function (ctx) {
            _this.drawBg(ctx);
        });

        this.planetDrawHandler = canvas.addHandlerToDraw(function (ctx) {
            _this.drawPlanet(ctx);
        });

        this.starsLoopActions = canvas.addActionHandler(function () {
            _this.loop();
        });

        this.image = resources.bgImage.object;
        this.planet = resources.planetImage.object;

        this.planetDegree = 0;
        this.pos = {
            y1: null,
            y2: null,
            y3: null,
            slides: 3
        };
    }

    _createClass(Bg, [{
        key: 'drawBg',
        value: function drawBg(ctx) {
            if (this.image.width == 0) return false;

            if (this.pos.y1 === null) {
                this.pos.y1 = -this.image.height + this.canvas.height;
            }
            if (this.pos.y2 === null) {
                this.pos.y2 = -this.image.height * 2 + this.canvas.height;
            }
            if (this.pos.y3 === null) {
                this.pos.y3 = -this.image.height * 3 + this.canvas.height;
            }

            var speed = 1.5;
            var yPos1 = this.pos.y1;
            var yPos2 = this.pos.y2;
            var yPos3 = this.pos.y3;

            ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, yPos1, this.canvas.width, this.image.height);
            ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, yPos2, this.canvas.width, this.image.height);
            ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, yPos3, this.canvas.width, this.image.height);

            // see end of first screen image
            if (this.pos.y1 >= 0 + this.canvas.height && this.pos.slides % 3 === 0) {
                this.pos.slides++;
                this.pos.y1 = this.pos.y3 - this.image.height;
            }

            if (this.pos.y2 >= 0 + this.canvas.height && this.pos.slides % 3 === 1) {
                this.pos.slides++;
                this.pos.y2 = this.pos.y1 - this.image.height;
            }

            if (this.pos.y3 >= 0 + this.canvas.height && this.pos.slides % 3 === 2) {
                this.pos.slides++;
                this.pos.y3 = this.pos.y2 - this.image.height;
            }

            yPos1 = this.pos.y1 += speed;
            yPos2 = this.pos.y2 += speed;
            yPos3 = this.pos.y3 += speed;
        }
    }, {
        key: 'drawPlanet',
        value: function drawPlanet(ctx) {
            if (this.planet.width === 0) return false;
            var image = this.planet;

            ctx.save();
            ctx.translate(-this.canvas.width / 2 + image.width / 2, this.canvas.height / 2 + image.height / 2);
            ctx.rotate(this.planetDegree += 0.00075);
            ctx.translate(-(-this.canvas.width / 2 + image.width / 2), -(this.canvas.height / 2 + image.height / 2));
            ctx.drawImage(image, 0, 0, image.width, image.height, -this.canvas.width / 2, this.canvas.height / 2, image.width, image.height);
            ctx.restore();
        }
    }, {
        key: 'loop',
        value: function loop() {}
    }]);

    return Bg;
}();

exports.default = Bg;

},{"../fns.js":10,"../gameConf":11,"./resources":9}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Boom = function () {
    function Boom(canvas, gameObject, resources, coordinate, enemy) {
        var _this = this;

        _classCallCheck(this, Boom);

        this.canvas = canvas;

        this.boom = {
            isDestroyStart: false,
            counter: 0,
            image: resources.boom.object,
            width: 64,
            height: 64,
            spriteSize: {
                width: 512,
                height: 64,
                spritesCount: 8
            }
        };

        this.coordinate = coordinate;

        this.canvas.addHandlerToDraw(function (ctx) {
            _this.drawBoom(ctx);
        });
    }

    _createClass(Boom, [{
        key: "drawBoom",
        value: function drawBoom(ctx) {
            var xSpritePosition = ++this.boom.counter;

            ctx.drawImage(this.boom.image, xSpritePosition * this.boom.width, 0, this.boom.width, this.boom.height, this.coordinate.x - this.boom.width / 2, this.coordinate.y - this.boom.height / 2, this.boom.width, this.boom.height);
        }
    }]);

    return Boom;
}();

exports.default = Boom;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require("util");

var _fns = require("../fns");

var _fns2 = _interopRequireDefault(_fns);

var _gameConf = require("../gameConf");

var _gameConf2 = _interopRequireDefault(_gameConf);

var _Boom = require("./Boom");

var _Boom2 = _interopRequireDefault(_Boom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Collisions = function () {
    function Collisions(canvas, gameObjects, resources, ship) {
        var _this = this;

        _classCallCheck(this, Collisions);

        this.canvas = canvas;
        this.gameObjects = gameObjects;
        this.resources = resources;
        this.ship = ship;

        this.actionLoopHandlerId = this.canvas.addActionHandler(function () {
            _this.loop();
        });
    }

    _createClass(Collisions, [{
        key: "loop",
        value: function loop() {
            if (this.canvas.isStopped) return false;

            this.checkCollisionsFiresAndEnemies();
            this.checkCollisionsShipAndEnemies();
        }
    }, {
        key: "checkCollisionsFiresAndEnemies",
        value: function checkCollisionsFiresAndEnemies() {
            var _this2 = this;

            var fires = this.gameObjects.fires;
            var enemyShips = this.gameObjects.enemyShips;

            Object.values(fires).forEach(function (fire) {
                Object.values(enemyShips).forEach(function (enemy) {
                    if (_fns2.default.checkCollisionRectangles(enemy.ship, fire.fire)) {
                        fire.delete();
                        enemy.startDestroy();
                        new _Boom2.default(_this2.canvas, _this2.gameObjects, _this2.resources, {
                            x: fire.fire.position.x,
                            y: fire.fire.position.y
                        }, enemy);
                    }
                });
            });
        }
    }, {
        key: "checkCollisionsShipAndEnemies",
        value: function checkCollisionsShipAndEnemies() {
            var _this3 = this;

            Object.values(this.gameObjects.enemyShips).forEach(function (enemy) {
                console.log(_this3.ship.ship.position, enemy.ship.position);
                if (_fns2.default.checkCollisionRectangles(enemy.ship, _this3.ship.ship)) {}
            });
        }
    }]);

    return Collisions;
}();

exports.default = Collisions;

},{"../fns":10,"../gameConf":11,"./Boom":3,"util":16}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fns = require('../fns');

var _fns2 = _interopRequireDefault(_fns);

var _gameConf = require('../gameConf');

var _gameConf2 = _interopRequireDefault(_gameConf);

var _resources = require('./resources');

var _resources2 = _interopRequireDefault(_resources);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Enemy = function () {
    function Enemy(canvas, gameObjects, resources, type, id) {
        _classCallCheck(this, Enemy);

        this.canvas = canvas;
        this.gameObjects = gameObjects;
        this.resources = resources;
        this.id = id;

        this.ship;
        this.isDestroyStart = false;
        this.destroyFrames = {
            counter: 0,
            all: _gameConf2.default.boomSpritesCount
        };

        this.easy = {
            width: 167,
            height: 75,
            speed: 15,
            position: {
                x: _fns2.default.randomInt(170, this.canvas.width),
                y: -40
            },
            image: {
                object: resources.enemyEasyImage.object,
                spriteSize: {
                    width: 234,
                    height: 150,
                    spritePosition: 0,
                    spritesCount: 4
                }
            }
        };

        switch (type) {
            case "easy":
                this.ship = this.easy;
                this.init();
                break;

            default:
                break;
        };
    }

    _createClass(Enemy, [{
        key: 'init',
        value: function init() {
            var _this = this;

            this.drawHandler = this.canvas.addHandlerToDraw(function (ctx) {
                _this.moveDraw(ctx);
            });

            this.actionMoveHandler = this.canvas.addActionHandler(function () {
                _this.ship.position.y += _this.ship.speed;
            });
        }
    }, {
        key: 'moveDraw',
        value: function moveDraw(ctx) {
            var xSpritePosition = this.ship.image.spriteSize.spritePosition < this.ship.image.spriteSize.spritesCount - 1 ? ++this.ship.image.spriteSize.spritePosition : this.ship.image.spriteSize.spritePosition = 0;

            ctx.drawImage(this.ship.image.object, xSpritePosition * this.ship.image.spriteSize.width, 0, this.ship.image.spriteSize.width, this.ship.image.spriteSize.height, this.ship.position.x - this.ship.width / 2, this.ship.position.y - this.ship.height / 2, this.ship.width, this.ship.height);
            this.checkForOutScreen();
        }
    }, {
        key: 'startDestroy',
        value: function startDestroy() {
            var _this2 = this;

            if (this.isDestroyStart) return;
            this.isDestroyStart = true;

            this.actionDestroyHandler = this.canvas.addActionHandler(function () {
                _this2.ship.speed = _this2.ship.speed * 0.5 + 1;
                if (++_this2.destroyFrames.counter >= _this2.destroyFrames.all) {
                    _this2.delete();
                }
            });
        }
    }, {
        key: 'checkForOutScreen',
        value: function checkForOutScreen() {
            if (this.ship.position.y > this.canvas.height) {
                this.delete();
            }
        }
    }, {
        key: 'delete',
        value: function _delete() {

            delete this.gameObjects.enemyShips[this.id];
            this.canvas.removeActionHandler(this.actionMoveHandler);
            this.canvas.removeHandlerToDraw(this.drawHandler);
            this.canvas.removeHandlerToDraw(this.drawDestroyHandler);
            this.canvas.removeActionHandler(this.actionMoveHandler);
            this.canvas.removeActionHandler(this.actionDestroyHandler);
        }
    }]);

    return Enemy;
}();

exports.default = Enemy;

},{"../fns":10,"../gameConf":11,"./resources":9}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gameConf = require('../gameConf');

var _gameConf2 = _interopRequireDefault(_gameConf);

var _util = require('util');

var _resources = require('./resources');

var _resources2 = _interopRequireDefault(_resources);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Fire = function () {
    function Fire(canvas, gameObjects, resources, dataObj) {
        _classCallCheck(this, Fire);

        this.canvas = canvas;
        this.gameObjects = gameObjects;
        this.resources = resources;
        this.fireMoveHandlerId;

        this.fire = {
            id: dataObj.id,
            width: 5,
            height: 10,
            color: "#FF0000",
            speed: 37,
            position: {
                x: dataObj.position.x,
                y: dataObj.position.y
            },
            sound: dataObj.sound(),
            image: {
                object: resources.fireImage.object
            }
        };

        // this attr is different friendly and not shoot's
        // -1 : friendly,  1 : is not
        this.isEnemies = -1;
        this.init();
        this.fire.sound.play();
    }

    _createClass(Fire, [{
        key: 'init',
        value: function init() {
            var _this = this;

            this.fireMoveHandlerId = this.canvas.addHandlerToDraw(function (ctx) {
                _this.fireMove(ctx);
            });
        }
    }, {
        key: 'fireMove',
        value: function fireMove(ctx) {
            ctx.fillStyle = this.fire.color;
            var newY = this.fire.position.y += this.fire.speed * this.isEnemies;

            ctx.drawImage(this.fire.image.object, 0, 0, this.fire.width, this.fire.height, this.fire.position.x - this.fire.width / 2, this.fire.position.y - this.fire.height / 2, this.fire.width, this.fire.height);

            this.checkForOutScreen();
        }
    }, {
        key: 'checkForOutScreen',
        value: function checkForOutScreen() {
            if (this.fire.position.y < 0) {
                this.delete();
            }
        }
    }, {
        key: 'delete',
        value: function _delete() {
            delete this.gameObjects.fires[this.fire.id];
            this.canvas.removeHandlerToDraw(this.fireMoveHandlerId);
        }
    }]);

    return Fire;
}();

exports.default = Fire;

},{"../gameConf":11,"./resources":9,"util":16}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gameConf = require('../gameConf');

var _gameConf2 = _interopRequireDefault(_gameConf);

var _Fire = require('./Fire');

var _Fire2 = _interopRequireDefault(_Fire);

var _resources = require('./resources');

var _resources2 = _interopRequireDefault(_resources);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ship = function () {
    function Ship(canvas, gameObjects, resources) {
        _classCallCheck(this, Ship);

        this.canvas = canvas;
        this.gameObjects = gameObjects;
        this.resources = resources;
        this.image = {
            object: resources.shipImage.object,
            spriteSize: {
                width: 68,
                height: 128,
                spritePosition: 0,
                spritesCount: 4
            }
        };

        this.sounds = {
            laser: {
                object: resources.fireSound.object
            }
        };

        this.ship = {
            size: {
                width: 34,
                height: 64
            },
            position: {
                x: _gameConf2.default.mouse.x,
                y: _gameConf2.default.mouse.y
            },
            lifes: _gameConf2.default.defaultLifes,
            lastFrameCountOfFireCreate: 0
        };
        this.init();
    }

    _createClass(Ship, [{
        key: 'init',
        value: function init() {
            var _this = this;

            this.moveHandlerId = this.canvas.addHandlerToDraw(function (ctx) {
                _this.shipMove(ctx);
            });
            this.fireActionHandlerId = this.canvas.addActionHandler(function () {
                _gameConf2.default.mouse.mouseDown.value ? _this.shipFire(_this.canvas.ctx) : "";
            });
        }
    }, {
        key: 'shipMove',
        value: function shipMove(ctx) {
            this.ship.position.x = _gameConf2.default.mouse.x;
            this.ship.position.y = _gameConf2.default.mouse.y;

            var xSpritePosition = this.image.spriteSize.spritePosition < this.image.spriteSize.spritesCount - 1 ? ++this.image.spriteSize.spritePosition : this.image.spriteSize.spritePosition = 0;

            ctx.drawImage(this.image.object, xSpritePosition * this.image.spriteSize.width, 0, this.ship.size.width * 2, this.ship.size.height * 2, this.ship.position.x - this.ship.size.width / 2, this.ship.position.y - this.ship.size.height / 2, this.ship.size.width, this.ship.size.height);
        }
    }, {
        key: 'shipFire',
        value: function shipFire(ctx) {
            var _this2 = this;

            if (Math.abs(_gameConf2.default.dataCanvas.framesAll - this.ship.lastFrameCountOfFireCreate) < 4) {
                return false;
            }
            this.ship.lastFrameCountOfFireCreate = _gameConf2.default.dataCanvas.framesAll;
            var id = ++this.gameObjects.idCounter;
            this.gameObjects.fires[id] = new _Fire2.default(this.canvas, this.gameObjects, this.resources, {
                id: id,
                position: {
                    x: this.ship.position.x,
                    y: this.ship.position.y - this.ship.size.height / 2
                },
                sound: function sound() {
                    var sound = new Audio();
                    sound.src = _this2.sounds.laser.object.src;
                    return sound;
                }
            });
        }
    }]);

    return Ship;
}();

exports.default = Ship;

},{"../gameConf":11,"./Fire":6,"./resources":9}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Ship = require('./Ship');

var _Ship2 = _interopRequireDefault(_Ship);

var _gameConf = require('../gameConf');

var _gameConf2 = _interopRequireDefault(_gameConf);

var _Bg = require('./Bg');

var _Bg2 = _interopRequireDefault(_Bg);

var _Enemy = require('./Enemy');

var _Enemy2 = _interopRequireDefault(_Enemy);

var _Collisions = require('./Collisions');

var _Collisions2 = _interopRequireDefault(_Collisions);

var _resources = require('./resources');

var _resources2 = _interopRequireDefault(_resources);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameComponentsInit = function () {
    function GameComponentsInit(canvas) {
        _classCallCheck(this, GameComponentsInit);

        this.canvas = canvas;
        this.gameObjects = {
            idCounter: -1,
            fires: {},
            enemyShips: {}
        };

        this.resources = (0, _resources2.default)();

        this.Bg = new _Bg2.default(canvas, this.gameObjects, this.resources);
        this.ship = new _Ship2.default(canvas, this.gameObjects, this.resources);

        this.preLoader();
        this.loadResources();
        this.createEnemies();

        this.collisionChecker = new _Collisions2.default(canvas, this.gameObjects, this.resources, this.ship);
    }

    _createClass(GameComponentsInit, [{
        key: 'createEnemies',
        value: function createEnemies() {
            var _this = this;

            var enemyMap = [{
                fromFrame: 30,
                enemyType: "easy",
                enemyCount: 555,
                enemyDelay: 35
            }];

            this.enemiesCreateActionHandlerId = this.canvas.addActionHandler(function () {

                enemyMap.forEach(function (enemyMapPart) {
                    var frameNow = _gameConf2.default.dataCanvas.framesAll;
                    if (frameNow >= enemyMapPart.fromFrame && enemyMapPart.enemyCount > 0 && frameNow % enemyMapPart.enemyDelay === 0) {
                        var id = "";
                        _this.gameObjects.enemyShips[++_this.gameObjects.idCounter] = new _Enemy2.default(_this.canvas, _this.gameObjects, _this.resources, enemyMapPart.enemyType, _this.gameObjects.idCounter);
                        enemyMapPart.enemyCount--;
                    }
                });
            });
        }
    }, {
        key: 'destroy',
        value: function destroy() {}
    }, {
        key: 'preLoader',
        value: function preLoader() {
            var _this2 = this;

            var preLoaderHandler = function preLoaderHandler(ctx) {

                var allCounter = Object.keys(_this2.resources).length;
                var isLoadCounter = Object.values(_this2.resources).filter(function (item) {
                    return item.isReady;
                }).length;

                ctx.fillStyle = "red";
                var preLoaderLineHeight = 3;
                ctx.fillRect(_this2.canvas.width / 10, _this2.canvas.height / 2 - preLoaderLineHeight / 2, _this2.canvas.width / 10 * 8 * (isLoadCounter / allCounter), preLoaderLineHeight);
            };
            this.preLoaderDrawHandlerId = this.canvas.addHandlerToDrawInStoppedMode(function (ctx) {
                preLoaderHandler(ctx);
            });
        }
    }, {
        key: 'loadResources',
        value: function loadResources() {
            var _this3 = this;

            Object.values(this.resources).forEach(function (item) {
                item.isReady = false;
                switch (item.type) {
                    case "image":
                        item.object.onload = function () {
                            item.isReady = true;
                        };
                        break;
                    case "sound":
                        item.object.oncanplaythrough = function () {
                            item.isReady = true;
                        };
                    default:
                        break;
                }
            });
            var t = setInterval(function () {
                var isReady = Object.values(_this3.resources).every(function (item) {
                    return item.isReady && (item.object.complete != 0 || item.object.naturalHeight != 0) && item.object.width != 0;
                });
                if (isReady) {
                    setTimeout(function () {
                        _this3.canvas.go();
                        clearInterval(t);
                    }, 255);
                }
            });
        }
    }]);

    return GameComponentsInit;
}();

exports.default = GameComponentsInit;

},{"../gameConf":11,"./Bg":2,"./Collisions":4,"./Enemy":5,"./Ship":7,"./resources":9}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var resources = {
        shipImage: {
            type: "image",
            object: new Image(),
            src: "images/ship.png"
        },
        enemyEasyImage: {
            type: "image",
            object: new Image(),
            src: "images/enemy_easy_ship.png"
        },
        fireImage: {
            type: "image",
            object: new Image(),
            src: "images/shoot_laser.png"
        },
        fireSound: {
            type: "sound",
            object: new Audio(),
            src: "sounds/ship_own_laser.mp3"
        },
        planetImage: {
            type: "image",
            object: new Image(),
            src: "images/planet.png"
        },
        bgImage: {
            type: "image",
            object: new Image(),
            src: "images/bg2.jpg"
        },
        boom: {
            type: "image",
            object: new Image(),
            src: "images/boom.png"
        }
    };

    Object.values(resources).forEach(function (obj) {
        obj.object.src = obj.src;
    });

    return resources;
};

;

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    randomFloat: function randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    },
    randomInt: function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    checkCollisionRectangles: function checkCollisionRectangles(objA, objB) {
        // it's need for one type of object structure: 
        // must to use obj.position = {x: value, y: value} && ( obj.width && obj.height )
        var _objA$position = objA.position,
            ax = _objA$position.x,
            ay = _objA$position.y;
        var _objB$position = objB.position,
            bx = _objB$position.x,
            by = _objB$position.y;
        var aw = objA.width,
            ah = objA.height;
        var bw = objB.width,
            bh = objB.height;


        var axLeft = ax - aw / 2;
        var axRight = ax + aw / 2;
        var ayTop = ay - ah / 2;
        var ayBottom = ay + ah / 2;

        var bxLeft = bx - bw / 2;
        var bxRight = bx + bw / 2;
        var byTop = by - bh / 2;
        var byBottom = by + bh / 2;

        // for collision of 2 rectangles need 4 conditions:
        // 1) axRight  > bxLeft     : right side X coordinate of 1-st rect more than left size X coordinate 2-nd
        // 2) axLeft   < bxRight    : ...
        // 3) ayBottom > byTop      
        // 4) ayTop    < byBottom

        return axRight > bxLeft && axLeft < bxRight && ayBottom > byTop && ayTop < byBottom ? true : false;
    }

};

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});


var obj = {
    maxFramesInSecond: 50,
    mouse: {
        x: 0,
        y: 0,
        mouseDown: {
            value: false,
            event: null
        }
    },
    defaultLifes: 4,
    boomSpritesCount: 8,
    dataCanvas: {
        fps: 0,
        framesAll: 0
    },
    sound: {
        enable: true
    }

    // window.obj  = obj;

};window.addEventListener('mousemove', function (event) {
    var e = event || window.event;
    obj.mouse.x = e.x;
    obj.mouse.y = e.y;
});

window.addEventListener('mousedown', function (event) {
    var e = event || window.event;
    obj.mouse.mouseDown.value = true;
    obj.mouse.mouseDown.event = e;

    window.addEventListener('mouseup', listenerForMouseUp);
    function listenerForMouseUp() {
        obj.mouse.mouseDown.value = false;
        obj.mouse.mouseDown.event = null;
        window.removeEventListener('mouseup', listenerForMouseUp);
    };
});

exports.default = obj;

},{}],12:[function(require,module,exports){
'use strict';

var _CanvasGame = require('./CanvasGame');

var _CanvasGame2 = _interopRequireDefault(_CanvasGame);

var _index = require('./GameComponentsInit/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.addEventListener('load', function () {
    var canvasGame = new _CanvasGame2.default(document.querySelector('.canvas__ctx'));
    new _index2.default(canvasGame);
});

},{"./CanvasGame":1,"./GameComponentsInit/index.js":8}],13:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],14:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],15:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],16:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":15,"_process":14,"inherits":13}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvQ2FudmFzR2FtZS5qcyIsImFwcC9qcy9HYW1lQ29tcG9uZW50c0luaXQvQmcuanMiLCJhcHAvanMvR2FtZUNvbXBvbmVudHNJbml0L0Jvb20uanMiLCJhcHAvanMvR2FtZUNvbXBvbmVudHNJbml0L0NvbGxpc2lvbnMuanMiLCJhcHAvanMvR2FtZUNvbXBvbmVudHNJbml0L0VuZW15LmpzIiwiYXBwL2pzL0dhbWVDb21wb25lbnRzSW5pdC9GaXJlLmpzIiwiYXBwL2pzL0dhbWVDb21wb25lbnRzSW5pdC9TaGlwLmpzIiwiYXBwL2pzL0dhbWVDb21wb25lbnRzSW5pdC9pbmRleC5qcyIsImFwcC9qcy9HYW1lQ29tcG9uZW50c0luaXQvcmVzb3VyY2VzLmpzIiwiYXBwL2pzL2Zucy5qcyIsImFwcC9qcy9nYW1lQ29uZi5qcyIsImFwcC9qcy9tYWluLmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvc3VwcG9ydC9pc0J1ZmZlckJyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXRpbC91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNDQTs7Ozs7Ozs7SUFFcUIsVTtBQUNqQix3QkFBWSxVQUFaLEVBQXVCO0FBQUE7O0FBQ25CLGFBQUssU0FBTCxHQUFpQixJQUFqQjs7QUFFQSxhQUFLLE1BQUwsR0FBYyxVQUFkO0FBQ0EsYUFBSyxHQUFMLEdBQWMsS0FBSyxNQUFMLENBQVksVUFBWixDQUF1QixJQUF2QixDQUFkOztBQUVBLGFBQUssS0FBTCxHQUFjLFNBQVMsZUFBVCxDQUF5QixXQUF2QztBQUNBLGFBQUssTUFBTCxHQUFjLFNBQVMsZUFBVCxDQUF5QixZQUF2Qzs7QUFFQSxhQUFLLE1BQUwsQ0FBWSxLQUFa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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxyXG5pbXBvcnQgZ2FtZUNvbmYgZnJvbSAnLi9nYW1lQ29uZic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXNHYW1le1xyXG4gICAgY29uc3RydWN0b3IoY2FudmFzTm9kZSl7XHJcbiAgICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzTm9kZTtcclxuICAgICAgICB0aGlzLmN0eCAgICA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG4gICAgICAgIHRoaXMud2lkdGggID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDtcclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSAgdGhpcy53aWR0aDtcclxuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhQ2FudmFzID0gZ2FtZUNvbmYuZGF0YUNhbnZhcztcclxuXHJcbiAgICAgICAgdGhpcy5pZEZvckhhbmRsZXJzICAgPSAwO1xyXG4gICAgICAgIHRoaXMuZHJhd0hhbmRsZXJzICAgID0ge307XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zSGFuZGxlcnMgPSB7fTtcclxuICAgICAgICB0aGlzLmRyYXdIYW5kbGVyc0luU3RvcHBlZE1vZGUgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5sb29wKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGRyYXdBbGwoKXtcclxuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5kcmF3SGFuZGxlcnMpLmZvckVhY2goKCBpdGVtRm4gKT0+e1xyXG4gICAgICAgICAgICBpZiggaXRlbUZuICE9IHVuZGVmaW5lZCApe1xyXG4gICAgICAgICAgICAgICAgaXRlbUZuKCB0aGlzLmN0eCApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5kYXRhQ2FudmFzLmZyYW1lc0FsbCsrO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrQWN0aW9uc0FsbCgpe1xyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5hY3Rpb25zSGFuZGxlcnMpLmZvckVhY2goKCBpdGVtRm4gKT0+e1xyXG4gICAgICAgICAgICBpZiggaXRlbUZuICE9IHVuZGVmaW5lZCApe1xyXG4gICAgICAgICAgICAgICAgaXRlbUZuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRBY3Rpb25IYW5kbGVyKCBhY3Rpb25IYW5kbGVyRm4gKXtcclxuICAgICAgICBsZXQgaWQgPSArK3RoaXMuaWRGb3JIYW5kbGVycztcclxuICAgICAgICB0aGlzLmFjdGlvbnNIYW5kbGVyc1tpZF0gPSBhY3Rpb25IYW5kbGVyRm47XHJcbiAgICAgICAgcmV0dXJuIGlkOyAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVBY3Rpb25IYW5kbGVyKCBpZE9mSGFuZGxlciApe1xyXG4gICAgICAgIGlmKCF0aGlzLmFjdGlvbnNIYW5kbGVyc1tpZE9mSGFuZGxlcl0pIHJldHVybjtcclxuICAgICAgICBkZWxldGUgdGhpcy5hY3Rpb25zSGFuZGxlcnNbaWRPZkhhbmRsZXJdO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEhhbmRsZXJUb0RyYXcoIGRyYXdIYW5kbGVyRm4gKXtcclxuICAgICAgICBsZXQgaWQgPSArK3RoaXMuaWRGb3JIYW5kbGVycztcclxuICAgICAgICB0aGlzLmRyYXdIYW5kbGVyc1tpZF0gPSBkcmF3SGFuZGxlckZuO1xyXG4gICAgICAgIHJldHVybiBpZDtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVIYW5kbGVyVG9EcmF3KCBpZE9mSGFuZGxlciApIHtcclxuICAgICAgICBpZighdGhpcy5kcmF3SGFuZGxlcnNbaWRPZkhhbmRsZXJdKSByZXR1cm47XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuZHJhd0hhbmRsZXJzW2lkT2ZIYW5kbGVyXTtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3QWxsSW5TdG9wcGVkTW9kZSgpe1xyXG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLmRyYXdIYW5kbGVyc0luU3RvcHBlZE1vZGUpLmZvckVhY2goKCBpdGVtRm4gKT0+e1xyXG4gICAgICAgICAgICBpZiggaXRlbUZuICE9IHVuZGVmaW5lZCApe1xyXG4gICAgICAgICAgICAgICAgaXRlbUZuKCB0aGlzLmN0eCApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5kYXRhQ2FudmFzLmZyYW1lc0FsbCsrO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEhhbmRsZXJUb0RyYXdJblN0b3BwZWRNb2RlKCBkcmF3SGFuZGxlckZuICl7XHJcbiAgICAgICAgbGV0IGlkID0gKyt0aGlzLmlkRm9ySGFuZGxlcnM7XHJcbiAgICAgICAgdGhpcy5kcmF3SGFuZGxlcnNJblN0b3BwZWRNb2RlW2lkXSA9IGRyYXdIYW5kbGVyRm47XHJcbiAgICAgICAgcmV0dXJuIGlkO1xyXG4gICAgfVxyXG4gICAgcmVtb3ZlSGFuZGxlclRvRHJhd0luU3RvcHBlZE1vZGUoIGlkT2ZIYW5kbGVyICl7XHJcbiAgICAgICAgaWYoIXRoaXMuZHJhd0hhbmRsZXJzSW5TdG9wcGVkTW9kZVtpZE9mSGFuZGxlcl0pIHJldHVybjtcclxuICAgICAgICBkZWxldGUgdGhpcy5kcmF3SGFuZGxlcnNJblN0b3BwZWRNb2RlW2lkT2ZIYW5kbGVyXTsgXHJcbiAgICB9XHJcblxyXG4gICAgZ28oKXtcclxuICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3AoKXtcclxuICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgbG9vcCgpe1xyXG4gICAgICAgIGxldCBsYXN0RnVsbFNlY29uZHMgICA9IHBlcmZvcm1hbmNlLm5vdygpIDwgMTAwMCA/IDAgOiBwYXJzZUludCggcGVyZm9ybWFuY2Uubm93KCkgLyAxMDAwICk7XHJcbiAgICAgICAgbGV0IGxhc3RUaW1lSXRlcmF0aW9uID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgbGV0IGxvb3AgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGl0IG11c3QgY2hlY2sgZm9yIG1heCBmcHMgYW5kIGRvIG5vdCBkcmF3IGNhbnZhcyBpZiBpdCdzIHRvbyBmYXN0LFxyXG4gICAgICAgICAgICAvLyBiZWNhdXNlIHRoZSBnYW1lIGRyYXdpbmcgaXMgb3JpZW50ZWQgbm90IGZvciB0aW1lIGFuZCBmcHMgdG9nZXRoZXJcclxuICAgICAgICAgICAgLy8gYnV0IG9ubHkgZm9yIGZwcyAoIHdpdGhvdXQgc2l0dWF0aW9uIHdpdGggc3ByaXRlcyApXHJcbiAgICAgICAgICAgIGlmKCAhdGhpcy5pc1N0b3BwZWRcclxuICAgICAgICAgICAgICAgICYmIChwZXJmb3JtYW5jZS5ub3coKSAtIGxhc3RUaW1lSXRlcmF0aW9uKSA+ICgxMDAwIC8gZ2FtZUNvbmYubWF4RnJhbWVzSW5TZWNvbmQpICl7XHJcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3IgZnBzXHJcbiAgICAgICAgICAgICAgICBsZXQgbm93RnVsbFNlY29uZHMgPSBwZXJmb3JtYW5jZS5ub3coKSA8IDEwMDAgPyAwIDogcGFyc2VJbnQoIHBlcmZvcm1hbmNlLm5vdygpIC8gMTAwMCApO1xyXG4gICAgICAgICAgICAgICAgbGFzdEZ1bGxTZWNvbmRzIDwgbm93RnVsbFNlY29uZHMgPyB0aGlzLmRhdGFDYW52YXMuZnBzID0gMCA6IHRoaXMuZGF0YUNhbnZhcy5mcHMrKztcclxuICAgICAgICAgICAgICAgIGxhc3RGdWxsU2Vjb25kcyA9IG5vd0Z1bGxTZWNvbmRzO1xyXG5cclxuICAgICAgICAgICAgICAgIGxhc3RUaW1lSXRlcmF0aW9uICA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tBY3Rpb25zQWxsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdBbGwoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9IGVsc2UgaWYoIHBlcmZvcm1hbmNlLm5vdygpIC0gbGFzdFRpbWVJdGVyYXRpb24gPiAxMDAwIC8gZ2FtZUNvbmYubWF4RnJhbWVzSW5TZWNvbmQgKXtcclxuICAgICAgICAgICAgICAgIC8vIGNhbGwgdG8gZHJhd2luZyBwcmVsb2FkaW5ncyBhbmQgZWxzZSB0aGF0IG5vdCBuZWVkIHRvIGF3YWl0XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdBbGxJblN0b3BwZWRNb2RlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSggbG9vcCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBsb29wICk7XHJcbiAgICB9XHJcblxyXG59IiwiXHJcbmltcG9ydCBnYW1lQ29uZiBmcm9tICcuLi9nYW1lQ29uZic7XHJcbmltcG9ydCBmbnMgZnJvbSAnLi4vZm5zLmpzJztcclxuaW1wb3J0IHJlc291cmNlcyBmcm9tICcuL3Jlc291cmNlcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCZyB7XHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXMsIGdhbWVPYmplY3RzLCByZXNvdXJjZXMpe1xyXG4gICAgICAgIHRoaXMuY2FudmFzICAgICAgPSBjYW52YXM7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0cyA9IGdhbWVPYmplY3RzO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2VzICAgPSByZXNvdXJjZXM7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhcnNCZ0RyYXdIYW5kbGVyID0gY2FudmFzLmFkZEhhbmRsZXJUb0RyYXcoKGN0eCk9PntcclxuICAgICAgICAgICAgdGhpcy5kcmF3QmcoY3R4KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5wbGFuZXREcmF3SGFuZGxlciA9IGNhbnZhcy5hZGRIYW5kbGVyVG9EcmF3KGN0eD0+e1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdQbGFuZXQoY3R4KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFyc0xvb3BBY3Rpb25zID0gY2FudmFzLmFkZEFjdGlvbkhhbmRsZXIoKCk9PntcclxuICAgICAgICAgICAgdGhpcy5sb29wKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5pbWFnZSAgPSByZXNvdXJjZXMuYmdJbWFnZS5vYmplY3Q7XHJcbiAgICAgICAgdGhpcy5wbGFuZXQgPSByZXNvdXJjZXMucGxhbmV0SW1hZ2Uub2JqZWN0O1xyXG5cclxuICAgICAgICB0aGlzLnBsYW5ldERlZ3JlZSA9IDA7XHJcbiAgICAgICAgdGhpcy5wb3MgPSB7XHJcbiAgICAgICAgICAgIHkxOiBudWxsLFxyXG4gICAgICAgICAgICB5MjogbnVsbCxcclxuICAgICAgICAgICAgeTM6IG51bGwsXHJcbiAgICAgICAgICAgIHNsaWRlczogMyxcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgZHJhd0JnKCBjdHggKXtcclxuICAgICAgICBpZiggdGhpcy5pbWFnZS53aWR0aCA9PSAwICkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKCB0aGlzLnBvcy55MSA9PT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLnBvcy55MSA9IC10aGlzLmltYWdlLmhlaWdodCArIHRoaXMuY2FudmFzLmhlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIHRoaXMucG9zLnkyID09PSBudWxsICl7XHJcbiAgICAgICAgICAgIHRoaXMucG9zLnkyID0gLXRoaXMuaW1hZ2UuaGVpZ2h0ICogMiAgKyB0aGlzLmNhbnZhcy5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0aGlzLnBvcy55MyA9PT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLnBvcy55MyA9IC10aGlzLmltYWdlLmhlaWdodCAqIDMgICsgdGhpcy5jYW52YXMuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNwZWVkID0gMS41O1xyXG4gICAgICAgIGxldCB5UG9zMSA9IHRoaXMucG9zLnkxO1xyXG4gICAgICAgIGxldCB5UG9zMiA9IHRoaXMucG9zLnkyO1xyXG4gICAgICAgIGxldCB5UG9zMyA9IHRoaXMucG9zLnkzO1xyXG5cclxuICAgICAgICBjdHguZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLmhlaWdodCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgeVBvczEsXHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLmhlaWdodCxcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2Uud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UuaGVpZ2h0LFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB5UG9zMixcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UuaGVpZ2h0LFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZShcclxuICAgICAgICAgICAgdGhpcy5pbWFnZSxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS5oZWlnaHQsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHlQb3MzLFxyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS5oZWlnaHQsXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICBcclxuICAgICAgICAvLyBzZWUgZW5kIG9mIGZpcnN0IHNjcmVlbiBpbWFnZVxyXG4gICAgICAgIGlmKCB0aGlzLnBvcy55MSA+PSAwICsgdGhpcy5jYW52YXMuaGVpZ2h0ICYmIHRoaXMucG9zLnNsaWRlcyAlIDMgPT09IDApe1xyXG4gICAgICAgICAgICB0aGlzLnBvcy5zbGlkZXMrK1xyXG4gICAgICAgICAgICB0aGlzLnBvcy55MSA9IHRoaXMucG9zLnkzIC0gdGhpcy5pbWFnZS5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKCB0aGlzLnBvcy55MiA+PSAwICsgdGhpcy5jYW52YXMuaGVpZ2h0ICYmIHRoaXMucG9zLnNsaWRlcyAlIDMgPT09IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3Muc2xpZGVzKytcclxuICAgICAgICAgICAgdGhpcy5wb3MueTIgPSB0aGlzLnBvcy55MSAtIHRoaXMuaW1hZ2UuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIHRoaXMucG9zLnkzID49IDAgKyB0aGlzLmNhbnZhcy5oZWlnaHQgJiYgdGhpcy5wb3Muc2xpZGVzICUgMyA9PT0gMikge1xyXG4gICAgICAgICAgICB0aGlzLnBvcy5zbGlkZXMrK1xyXG4gICAgICAgICAgICB0aGlzLnBvcy55MyA9IHRoaXMucG9zLnkyIC0gdGhpcy5pbWFnZS5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB5UG9zMSA9IHRoaXMucG9zLnkxICs9IHNwZWVkO1xyXG4gICAgICAgIHlQb3MyID0gdGhpcy5wb3MueTIgKz0gc3BlZWQ7IFxyXG4gICAgICAgIHlQb3MzID0gdGhpcy5wb3MueTMgKz0gc3BlZWQ7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBkcmF3UGxhbmV0KCBjdHggKXtcclxuICAgICAgICBpZih0aGlzLnBsYW5ldC53aWR0aCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGxldCBpbWFnZSA9IHRoaXMucGxhbmV0O1xyXG5cclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC50cmFuc2xhdGUoLXRoaXMuY2FudmFzLndpZHRoLzIgKyBpbWFnZS53aWR0aCAvIDIsIHRoaXMuY2FudmFzLmhlaWdodC8yICsgaW1hZ2UuaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgY3R4LnJvdGF0ZSggdGhpcy5wbGFuZXREZWdyZWUgKz0gMC4wMDA3NSApO1xyXG4gICAgICAgIGN0eC50cmFuc2xhdGUoLSgtdGhpcy5jYW52YXMud2lkdGgvMiArIGltYWdlLndpZHRoIC8gMiksIC0odGhpcy5jYW52YXMuaGVpZ2h0LzIgKyBpbWFnZS5oZWlnaHQgLyAyKSk7XHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZShcclxuICAgICAgICAgICAgaW1hZ2UsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIGltYWdlLndpZHRoLFxyXG4gICAgICAgICAgICBpbWFnZS5oZWlnaHQsXHJcbiAgICAgICAgICAgIC10aGlzLmNhbnZhcy53aWR0aC8yLFxyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQvMixcclxuICAgICAgICAgICAgaW1hZ2Uud2lkdGgsXHJcbiAgICAgICAgICAgIGltYWdlLmhlaWdodFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBsb29wKCl7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn0iLCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvb217XHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXMsIGdhbWVPYmplY3QsIHJlc291cmNlcywgY29vcmRpbmF0ZSwgZW5lbXkpe1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xyXG5cclxuICAgICAgICB0aGlzLmJvb20gPSB7XHJcbiAgICAgICAgICAgIGlzRGVzdHJveVN0YXJ0OiBmYWxzZSxcclxuICAgICAgICAgICAgY291bnRlcjogMCxcclxuICAgICAgICAgICAgaW1hZ2U6IHJlc291cmNlcy5ib29tLm9iamVjdCxcclxuICAgICAgICAgICAgd2lkdGg6IDY0LFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDY0LFxyXG4gICAgICAgICAgICBzcHJpdGVTaXplOiB7XHJcbiAgICAgICAgICAgICAgICB3aWR0aDogNTEyLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA2NCxcclxuICAgICAgICAgICAgICAgIHNwcml0ZXNDb3VudDogOCxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb29yZGluYXRlID0gY29vcmRpbmF0ZTtcclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkSGFuZGxlclRvRHJhdygoY3R4KT0+e1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdCb29tKGN0eCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBkcmF3Qm9vbShjdHgpe1xyXG4gICAgICAgIGxldCB4U3ByaXRlUG9zaXRpb24gPSArK3RoaXMuYm9vbS5jb3VudGVyO1xyXG5cclxuICAgICAgICBjdHguZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICB0aGlzLmJvb20uaW1hZ2UsXHJcbiAgICAgICAgICAgIHhTcHJpdGVQb3NpdGlvbiAqIHRoaXMuYm9vbS53aWR0aCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdGhpcy5ib29tLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmJvb20uaGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLmNvb3JkaW5hdGUueCAtIHRoaXMuYm9vbS53aWR0aC8yLFxyXG4gICAgICAgICAgICB0aGlzLmNvb3JkaW5hdGUueSAtIHRoaXMuYm9vbS5oZWlnaHQvMixcclxuICAgICAgICAgICAgdGhpcy5ib29tLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmJvb20uaGVpZ2h0KTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IGlzQXJyYXkgfSBmcm9tIFwidXRpbFwiO1xyXG5pbXBvcnQgZm5zIGZyb20gJy4uL2Zucyc7XHJcbmltcG9ydCBnYW1lQ29uZiBmcm9tIFwiLi4vZ2FtZUNvbmZcIjtcclxuaW1wb3J0IEJvb20gZnJvbSAnLi9Cb29tJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbGxpc2lvbnMge1xyXG4gICAgY29uc3RydWN0b3IoY2FudmFzLCBnYW1lT2JqZWN0cywgcmVzb3VyY2VzLCBzaGlwKXtcclxuICAgICAgICB0aGlzLmNhbnZhcyAgICAgID0gY2FudmFzO1xyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdHMgPSBnYW1lT2JqZWN0cztcclxuICAgICAgICB0aGlzLnJlc291cmNlcyAgID0gcmVzb3VyY2VzO1xyXG4gICAgICAgIHRoaXMuc2hpcCAgICAgICAgPSBzaGlwO1xyXG5cclxuICAgICAgICB0aGlzLmFjdGlvbkxvb3BIYW5kbGVySWQgPSB0aGlzLmNhbnZhcy5hZGRBY3Rpb25IYW5kbGVyKCgpPT57XHJcbiAgICAgICAgICAgIHRoaXMubG9vcCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvb3AoKXtcclxuICAgICAgICBpZih0aGlzLmNhbnZhcy5pc1N0b3BwZWQpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5jaGVja0NvbGxpc2lvbnNGaXJlc0FuZEVuZW1pZXMoKTtcclxuICAgICAgICB0aGlzLmNoZWNrQ29sbGlzaW9uc1NoaXBBbmRFbmVtaWVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tDb2xsaXNpb25zRmlyZXNBbmRFbmVtaWVzKCl7XHJcbiAgICAgICAgbGV0IGZpcmVzICAgICAgPSB0aGlzLmdhbWVPYmplY3RzLmZpcmVzO1xyXG4gICAgICAgIGxldCBlbmVteVNoaXBzID0gdGhpcy5nYW1lT2JqZWN0cy5lbmVteVNoaXBzO1xyXG5cclxuICAgICAgICBPYmplY3QudmFsdWVzKGZpcmVzKS5mb3JFYWNoKGZpcmU9PntcclxuICAgICAgICAgICAgT2JqZWN0LnZhbHVlcyhlbmVteVNoaXBzKS5mb3JFYWNoKGVuZW15PT57XHJcbiAgICAgICAgICAgICAgICBpZihmbnMuY2hlY2tDb2xsaXNpb25SZWN0YW5nbGVzKGVuZW15LnNoaXAsZmlyZS5maXJlKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5kZWxldGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBlbmVteS5zdGFydERlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgICAgICBuZXcgQm9vbSh0aGlzLmNhbnZhcywgdGhpcy5nYW1lT2JqZWN0cywgdGhpcy5yZXNvdXJjZXMsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeDogZmlyZS5maXJlLnBvc2l0aW9uLngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IGZpcmUuZmlyZS5wb3NpdGlvbi55LFxyXG4gICAgICAgICAgICAgICAgICAgIH0sZW5lbXkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0NvbGxpc2lvbnNTaGlwQW5kRW5lbWllcygpe1xyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5nYW1lT2JqZWN0cy5lbmVteVNoaXBzKS5mb3JFYWNoKGVuZW15PT57XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCB0aGlzLnNoaXAuc2hpcC5wb3NpdGlvbiwgZW5lbXkuc2hpcC5wb3NpdGlvbiApXHJcbiAgICAgICAgICAgIGlmKGZucy5jaGVja0NvbGxpc2lvblJlY3RhbmdsZXMoZW5lbXkuc2hpcCwgdGhpcy5zaGlwLnNoaXApKXtcclxuICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiXHJcbmltcG9ydCBmbnMgZnJvbSAnLi4vZm5zJztcclxuaW1wb3J0IGdhbWVDb25mIGZyb20gXCIuLi9nYW1lQ29uZlwiO1xyXG5pbXBvcnQgcmVzb3VyY2VzIGZyb20gJy4vcmVzb3VyY2VzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVuZW15e1xyXG4gICAgY29uc3RydWN0b3IoY2FudmFzLCBnYW1lT2JqZWN0cywgcmVzb3VyY2VzLCB0eXBlLCBpZCl7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgICAgICA9IGNhbnZhcztcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3RzID0gZ2FtZU9iamVjdHM7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZXMgICA9IHJlc291cmNlcztcclxuICAgICAgICB0aGlzLmlkICAgICAgICAgID0gaWQ7XHJcblxyXG4gICAgICAgIHRoaXMuc2hpcDtcclxuICAgICAgICB0aGlzLmlzRGVzdHJveVN0YXJ0ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5kZXN0cm95RnJhbWVzICA9IHtcclxuICAgICAgICAgICAgY291bnRlcjogMCxcclxuICAgICAgICAgICAgYWxsOiBnYW1lQ29uZi5ib29tU3ByaXRlc0NvdW50XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVhc3kgPSB7XHJcbiAgICAgICAgICAgIHdpZHRoOiAxNjcsXHJcbiAgICAgICAgICAgIGhlaWdodDogNzUsXHJcbiAgICAgICAgICAgIHNwZWVkOiAxNSxcclxuICAgICAgICAgICAgcG9zaXRpb246IHtcclxuICAgICAgICAgICAgICAgIHg6IGZucy5yYW5kb21JbnQoMTcwICwgdGhpcy5jYW52YXMud2lkdGgpLFxyXG4gICAgICAgICAgICAgICAgeTogLTQwLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpbWFnZToge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0OiByZXNvdXJjZXMuZW5lbXlFYXN5SW1hZ2Uub2JqZWN0LFxyXG4gICAgICAgICAgICAgICAgc3ByaXRlU2l6ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAyMzQsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAxNTAsXHJcbiAgICAgICAgICAgICAgICAgICAgc3ByaXRlUG9zaXRpb246IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgc3ByaXRlc0NvdW50OiA0LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJlYXN5XCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoaXAgPSB0aGlzLmVhc3k7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCl7XHJcblxyXG4gICAgICAgIHRoaXMuZHJhd0hhbmRsZXIgPSB0aGlzLmNhbnZhcy5hZGRIYW5kbGVyVG9EcmF3KChjdHgpPT57XHJcbiAgICAgICAgICAgIHRoaXMubW92ZURyYXcoY3R4KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hY3Rpb25Nb3ZlSGFuZGxlciA9IHRoaXMuY2FudmFzLmFkZEFjdGlvbkhhbmRsZXIoKCk9PntcclxuICAgICAgICAgICAgdGhpcy5zaGlwLnBvc2l0aW9uLnkgKz0gdGhpcy5zaGlwLnNwZWVkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmVEcmF3KCBjdHggKXtcclxuICAgICAgICBsZXQgeFNwcml0ZVBvc2l0aW9uID1cclxuICAgICAgICAgICAgdGhpcy5zaGlwLmltYWdlLnNwcml0ZVNpemUuc3ByaXRlUG9zaXRpb24gPCB0aGlzLnNoaXAuaW1hZ2Uuc3ByaXRlU2l6ZS5zcHJpdGVzQ291bnQgLSAxXHJcbiAgICAgICAgICAgID8gKyt0aGlzLnNoaXAuaW1hZ2Uuc3ByaXRlU2l6ZS5zcHJpdGVQb3NpdGlvblxyXG4gICAgICAgICAgICA6IHRoaXMuc2hpcC5pbWFnZS5zcHJpdGVTaXplLnNwcml0ZVBvc2l0aW9uID0gMDtcclxuXHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZShcclxuICAgICAgICAgICAgdGhpcy5zaGlwLmltYWdlLm9iamVjdCxcclxuICAgICAgICAgICAgeFNwcml0ZVBvc2l0aW9uICogdGhpcy5zaGlwLmltYWdlLnNwcml0ZVNpemUud2lkdGgsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHRoaXMuc2hpcC5pbWFnZS5zcHJpdGVTaXplLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLnNoaXAuaW1hZ2Uuc3ByaXRlU2l6ZS5oZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMuc2hpcC5wb3NpdGlvbi54IC0gdGhpcy5zaGlwLndpZHRoIC8gMixcclxuICAgICAgICAgICAgdGhpcy5zaGlwLnBvc2l0aW9uLnkgLSB0aGlzLnNoaXAuaGVpZ2h0IC8gMixcclxuICAgICAgICAgICAgdGhpcy5zaGlwLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLnNoaXAuaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLmNoZWNrRm9yT3V0U2NyZWVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnREZXN0cm95KCl7XHJcbiAgICAgICAgaWYodGhpcy5pc0Rlc3Ryb3lTdGFydCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuaXNEZXN0cm95U3RhcnQgPSB0cnVlO1xyXG5cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgdGhpcy5hY3Rpb25EZXN0cm95SGFuZGxlciA9IHRoaXMuY2FudmFzLmFkZEFjdGlvbkhhbmRsZXIoKCk9PntcclxuICAgICAgICAgICAgdGhpcy5zaGlwLnNwZWVkID0gdGhpcy5zaGlwLnNwZWVkICogMC41ICsgMTtcclxuICAgICAgICAgICAgaWYoKyt0aGlzLmRlc3Ryb3lGcmFtZXMuY291bnRlciA+PSB0aGlzLmRlc3Ryb3lGcmFtZXMuYWxsKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICBjaGVja0Zvck91dFNjcmVlbigpe1xyXG4gICAgICAgIGlmKCB0aGlzLnNoaXAucG9zaXRpb24ueSA+IHRoaXMuY2FudmFzLmhlaWdodCApIHtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlKCl7XHJcbiAgICAgICBcclxuICAgICAgICBkZWxldGUgdGhpcy5nYW1lT2JqZWN0cy5lbmVteVNoaXBzW3RoaXMuaWRdO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUFjdGlvbkhhbmRsZXIodGhpcy5hY3Rpb25Nb3ZlSGFuZGxlcik7XHJcbiAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlSGFuZGxlclRvRHJhdyggdGhpcy5kcmF3SGFuZGxlciApO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUhhbmRsZXJUb0RyYXcoIHRoaXMuZHJhd0Rlc3Ryb3lIYW5kbGVyICk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlQWN0aW9uSGFuZGxlciggdGhpcy5hY3Rpb25Nb3ZlSGFuZGxlciApO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUFjdGlvbkhhbmRsZXIoIHRoaXMuYWN0aW9uRGVzdHJveUhhbmRsZXIgKTtcclxuICAgIH1cclxufSIsIlxyXG5pbXBvcnQgZ2FtZUNvbmYgZnJvbSAnLi4vZ2FtZUNvbmYnO1xyXG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAndXRpbCc7XHJcbmltcG9ydCByZXNvdXJjZXMgZnJvbSAnLi9yZXNvdXJjZXMnO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpcmUge1xyXG4gICAgY29uc3RydWN0b3IoIGNhbnZhcywgZ2FtZU9iamVjdHMsIHJlc291cmNlcywgZGF0YU9iaiApe1xyXG4gICAgICAgIHRoaXMuY2FudmFzICAgICAgPSBjYW52YXM7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0cyA9IGdhbWVPYmplY3RzO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2VzICAgPSByZXNvdXJjZXM7XHJcbiAgICAgICAgdGhpcy5maXJlTW92ZUhhbmRsZXJJZDtcclxuXHJcbiAgICAgICAgdGhpcy5maXJlID0ge1xyXG4gICAgICAgICAgICBpZDogZGF0YU9iai5pZCxcclxuICAgICAgICAgICAgd2lkdGg6IDUsXHJcbiAgICAgICAgICAgIGhlaWdodDogMTAsXHJcbiAgICAgICAgICAgIGNvbG9yOiBcIiNGRjAwMDBcIixcclxuICAgICAgICAgICAgc3BlZWQ6IDM3LFxyXG4gICAgICAgICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgeDogZGF0YU9iai5wb3NpdGlvbi54LFxyXG4gICAgICAgICAgICAgICAgeTogZGF0YU9iai5wb3NpdGlvbi55LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzb3VuZDogZGF0YU9iai5zb3VuZCgpLFxyXG4gICAgICAgICAgICBpbWFnZToge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0OiByZXNvdXJjZXMuZmlyZUltYWdlLm9iamVjdCxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAgLy8gdGhpcyBhdHRyIGlzIGRpZmZlcmVudCBmcmllbmRseSBhbmQgbm90IHNob290J3NcclxuICAgICAgICAvLyAtMSA6IGZyaWVuZGx5LCAgMSA6IGlzIG5vdFxyXG4gICAgICAgIHRoaXMuaXNFbmVtaWVzID0gLTE7ICAgICAgIFxyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgICAgIHRoaXMuZmlyZS5zb3VuZC5wbGF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpe1xyXG4gICAgICAgIHRoaXMuZmlyZU1vdmVIYW5kbGVySWQgPSB0aGlzLmNhbnZhcy5hZGRIYW5kbGVyVG9EcmF3KChjdHgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZU1vdmUoY3R4KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmaXJlTW92ZSggY3R4ICl7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZmlyZS5jb2xvcjtcclxuICAgICAgICBsZXQgbmV3WSA9IHRoaXMuZmlyZS5wb3NpdGlvbi55ICs9IHRoaXMuZmlyZS5zcGVlZCAqIHRoaXMuaXNFbmVtaWVzO1xyXG5cclxuICAgICAgICBjdHguZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICB0aGlzLmZpcmUuaW1hZ2Uub2JqZWN0LFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB0aGlzLmZpcmUud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMuZmlyZS5oZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMuZmlyZS5wb3NpdGlvbi54IC0gdGhpcy5maXJlLndpZHRoIC8gMixcclxuICAgICAgICAgICAgdGhpcy5maXJlLnBvc2l0aW9uLnkgLSB0aGlzLmZpcmUuaGVpZ2h0IC8gMixcclxuICAgICAgICAgICAgdGhpcy5maXJlLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmZpcmUuaGVpZ2h0LFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMuY2hlY2tGb3JPdXRTY3JlZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0Zvck91dFNjcmVlbigpe1xyXG4gICAgICAgIGlmKCB0aGlzLmZpcmUucG9zaXRpb24ueSA8IDAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZSgpe1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmdhbWVPYmplY3RzLmZpcmVzW3RoaXMuZmlyZS5pZF07XHJcbiAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlSGFuZGxlclRvRHJhdyggdGhpcy5maXJlTW92ZUhhbmRsZXJJZCApO1xyXG4gICAgfVxyXG59IiwiXHJcbmltcG9ydCBnYW1lQ29uZiBmcm9tICcuLi9nYW1lQ29uZic7XHJcbmltcG9ydCBGaXJlIGZyb20gJy4vRmlyZSc7XHJcbmltcG9ydCByZXNvdXJjZXMgZnJvbSAnLi9yZXNvdXJjZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hpcCB7XHJcbiAgICBjb25zdHJ1Y3RvciggY2FudmFzLCBnYW1lT2JqZWN0cywgcmVzb3VyY2VzICl7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgICAgICA9IGNhbnZhcztcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3RzID0gZ2FtZU9iamVjdHM7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZXMgICA9IHJlc291cmNlcztcclxuICAgICAgICB0aGlzLmltYWdlICA9IHtcclxuICAgICAgICAgICAgb2JqZWN0OiByZXNvdXJjZXMuc2hpcEltYWdlLm9iamVjdCxcclxuICAgICAgICAgICAgc3ByaXRlU2l6ZToge1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY4LFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAxMjgsXHJcbiAgICAgICAgICAgICAgICBzcHJpdGVQb3NpdGlvbjogMCxcclxuICAgICAgICAgICAgICAgIHNwcml0ZXNDb3VudDogNCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNvdW5kcyA9IHtcclxuICAgICAgICAgICAgbGFzZXI6IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdDogcmVzb3VyY2VzLmZpcmVTb3VuZC5vYmplY3QsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2hpcCAgPSB7XHJcbiAgICAgICAgICAgIHNpemU6IHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAzNCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogNjQsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICB4OiBnYW1lQ29uZi5tb3VzZS54LFxyXG4gICAgICAgICAgICAgICAgeTogZ2FtZUNvbmYubW91c2UueSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGlmZXM6IGdhbWVDb25mLmRlZmF1bHRMaWZlcyxcclxuICAgICAgICAgICAgbGFzdEZyYW1lQ291bnRPZkZpcmVDcmVhdGU6IDAsXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCl7XHJcbiAgICAgICAgdGhpcy5tb3ZlSGFuZGxlcklkID0gdGhpcy5jYW52YXMuYWRkSGFuZGxlclRvRHJhdygoY3R4KT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNoaXBNb3ZlKGN0eCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maXJlQWN0aW9uSGFuZGxlcklkID0gdGhpcy5jYW52YXMuYWRkQWN0aW9uSGFuZGxlcigoKT0+e1xyXG4gICAgICAgICAgICBnYW1lQ29uZi5tb3VzZS5tb3VzZURvd24udmFsdWUgPyB0aGlzLnNoaXBGaXJlKCB0aGlzLmNhbnZhcy5jdHggKSA6IFwiXCI7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hpcE1vdmUoIGN0eCApe1xyXG4gICAgICAgIHRoaXMuc2hpcC5wb3NpdGlvbi54ID0gZ2FtZUNvbmYubW91c2UueDtcclxuICAgICAgICB0aGlzLnNoaXAucG9zaXRpb24ueSA9IGdhbWVDb25mLm1vdXNlLnk7XHJcblxyXG4gICAgICAgIGxldCB4U3ByaXRlUG9zaXRpb24gPVxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLnNwcml0ZVNpemUuc3ByaXRlUG9zaXRpb24gPCB0aGlzLmltYWdlLnNwcml0ZVNpemUuc3ByaXRlc0NvdW50IC0gMVxyXG4gICAgICAgICAgICA/ICsrdGhpcy5pbWFnZS5zcHJpdGVTaXplLnNwcml0ZVBvc2l0aW9uXHJcbiAgICAgICAgICAgIDogdGhpcy5pbWFnZS5zcHJpdGVTaXplLnNwcml0ZVBvc2l0aW9uID0gMDtcclxuXHJcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlLm9iamVjdCxcclxuICAgICAgICAgICAgICAgIHhTcHJpdGVQb3NpdGlvbiAqIHRoaXMuaW1hZ2Uuc3ByaXRlU2l6ZS53aWR0aCxcclxuICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoaXAuc2l6ZS53aWR0aCAqIDIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoaXAuc2l6ZS5oZWlnaHQgKiAyLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwLnBvc2l0aW9uLnggLSB0aGlzLnNoaXAuc2l6ZS53aWR0aCAvIDIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoaXAucG9zaXRpb24ueSAtIHRoaXMuc2hpcC5zaXplLmhlaWdodCAvIDIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoaXAuc2l6ZS53aWR0aCxcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcC5zaXplLmhlaWdodCxcclxuICAgICAgICAgICAgKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2hpcEZpcmUoIGN0eCApe1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKCBNYXRoLmFicyggZ2FtZUNvbmYuZGF0YUNhbnZhcy5mcmFtZXNBbGwgLSB0aGlzLnNoaXAubGFzdEZyYW1lQ291bnRPZkZpcmVDcmVhdGUgKSA8IDQgKXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNoaXAubGFzdEZyYW1lQ291bnRPZkZpcmVDcmVhdGUgPSBnYW1lQ29uZi5kYXRhQ2FudmFzLmZyYW1lc0FsbDtcclxuICAgICAgICBsZXQgaWQgPSArK3RoaXMuZ2FtZU9iamVjdHMuaWRDb3VudGVyO1xyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdHMuZmlyZXNbaWRdID0gbmV3IEZpcmUodGhpcy5jYW52YXMsIHRoaXMuZ2FtZU9iamVjdHMsIHRoaXMucmVzb3VyY2VzLCB7XHJcbiAgICAgICAgICAgIGlkOiBpZCxcclxuICAgICAgICAgICAgcG9zaXRpb246IHtcclxuICAgICAgICAgICAgICAgIHg6IHRoaXMuc2hpcC5wb3NpdGlvbi54LFxyXG4gICAgICAgICAgICAgICAgeTogdGhpcy5zaGlwLnBvc2l0aW9uLnkgLSB0aGlzLnNoaXAuc2l6ZS5oZWlnaHQgLyAyLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzb3VuZDogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNvdW5kID0gbmV3IEF1ZGlvO1xyXG4gICAgICAgICAgICAgICAgc291bmQuc3JjID0gdGhpcy5zb3VuZHMubGFzZXIub2JqZWN0LnNyYztcclxuICAgICAgICAgICAgICAgIHJldHVybiBzb3VuZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxufSIsIlxyXG5cclxuaW1wb3J0IFNoaXAgZnJvbSAnLi9TaGlwJztcclxuaW1wb3J0IGdhbWVDb25mIGZyb20gXCIuLi9nYW1lQ29uZlwiO1xyXG5pbXBvcnQgQmcgZnJvbSAnLi9CZyc7XHJcbmltcG9ydCBFbmVteSBmcm9tICcuL0VuZW15JztcclxuaW1wb3J0IENvbGxpc2lvbnMgZnJvbSAnLi9Db2xsaXNpb25zJztcclxuaW1wb3J0IHJlc291cmNlcyBmcm9tICcuL3Jlc291cmNlcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQ29tcG9uZW50c0luaXR7XHJcbiAgICBjb25zdHJ1Y3RvciggY2FudmFzICl7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0cyA9IHtcclxuICAgICAgICAgICAgaWRDb3VudGVyOiAtMSxcclxuICAgICAgICAgICAgZmlyZXM6IHt9LFxyXG4gICAgICAgICAgICBlbmVteVNoaXBzOiB7fSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnJlc291cmNlcyA9IHJlc291cmNlcygpO1xyXG5cclxuICAgICAgICB0aGlzLkJnICAgPSBuZXcgQmcoIGNhbnZhcywgdGhpcy5nYW1lT2JqZWN0cywgdGhpcy5yZXNvdXJjZXMgKTtcclxuICAgICAgICB0aGlzLnNoaXAgPSBuZXcgU2hpcCggY2FudmFzLCB0aGlzLmdhbWVPYmplY3RzLCB0aGlzLnJlc291cmNlcyApO1xyXG5cclxuICAgICAgICB0aGlzLnByZUxvYWRlcigpO1xyXG4gICAgICAgIHRoaXMubG9hZFJlc291cmNlcygpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlRW5lbWllcygpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbGxpc2lvbkNoZWNrZXIgPSBuZXcgQ29sbGlzaW9ucyhjYW52YXMsIHRoaXMuZ2FtZU9iamVjdHMsIHRoaXMucmVzb3VyY2VzLCB0aGlzLnNoaXApO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUVuZW1pZXMoKXtcclxuICAgICAgICBjb25zdCBlbmVteU1hcCA9IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZnJvbUZyYW1lOiAzMCxcclxuICAgICAgICAgICAgICAgIGVuZW15VHlwZTogXCJlYXN5XCIsXHJcbiAgICAgICAgICAgICAgICBlbmVteUNvdW50OiA1NTUsXHJcbiAgICAgICAgICAgICAgICBlbmVteURlbGF5OiAzNSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICB0aGlzLmVuZW1pZXNDcmVhdGVBY3Rpb25IYW5kbGVySWQgPSB0aGlzLmNhbnZhcy5hZGRBY3Rpb25IYW5kbGVyKCgpPT57XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGVuZW15TWFwLmZvckVhY2goZW5lbXlNYXBQYXJ0PT57XHJcbiAgICAgICAgICAgICAgIGxldCBmcmFtZU5vdyA9IGdhbWVDb25mLmRhdGFDYW52YXMuZnJhbWVzQWxsO1xyXG4gICAgICAgICAgICAgICBpZihmcmFtZU5vdyA+PSBlbmVteU1hcFBhcnQuZnJvbUZyYW1lXHJcbiAgICAgICAgICAgICAgICAmJiBlbmVteU1hcFBhcnQuZW5lbXlDb3VudCA+IDBcclxuICAgICAgICAgICAgICAgICYmIGZyYW1lTm93ICUgZW5lbXlNYXBQYXJ0LmVuZW15RGVsYXkgPT09IDApe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpZCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lT2JqZWN0cy5lbmVteVNoaXBzWysrdGhpcy5nYW1lT2JqZWN0cy5pZENvdW50ZXJdID0gbmV3IEVuZW15KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lT2JqZWN0cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZW15TWFwUGFydC5lbmVteVR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZU9iamVjdHMuaWRDb3VudGVyKTtcclxuICAgICAgICAgICAgICAgICAgICBlbmVteU1hcFBhcnQuZW5lbXlDb3VudC0tO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKXtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJlTG9hZGVyKCl7XHJcbiAgICAgICAgbGV0IHByZUxvYWRlckhhbmRsZXIgPSAoIGN0eCApID0+IHtcclxuXHJcbiAgICAgICAgICAgIGxldCBhbGxDb3VudGVyID0gT2JqZWN0LmtleXModGhpcy5yZXNvdXJjZXMpLmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IGlzTG9hZENvdW50ZXIgPSBPYmplY3QudmFsdWVzKHRoaXMucmVzb3VyY2VzKS5maWx0ZXIoaXRlbT0+e1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uaXNSZWFkeTtcclxuICAgICAgICAgICAgfSkubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwicmVkXCI7XHJcbiAgICAgICAgICAgIGxldCBwcmVMb2FkZXJMaW5lSGVpZ2h0ID0gMztcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMud2lkdGggLyAxMCxcclxuICAgICAgICAgICAgICAgICh0aGlzLmNhbnZhcy5oZWlnaHQgLyAyKSAtIHByZUxvYWRlckxpbmVIZWlnaHQgLyAyLFxyXG4gICAgICAgICAgICAgICAgKHRoaXMuY2FudmFzLndpZHRoIC8gMTApICogOCAqIChpc0xvYWRDb3VudGVyIC8gYWxsQ291bnRlciksXHJcbiAgICAgICAgICAgICAgICBwcmVMb2FkZXJMaW5lSGVpZ2h0XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnByZUxvYWRlckRyYXdIYW5kbGVySWQgPSB0aGlzLmNhbnZhcy5hZGRIYW5kbGVyVG9EcmF3SW5TdG9wcGVkTW9kZShjdHg9PntcclxuICAgICAgICAgICAgcHJlTG9hZGVySGFuZGxlcihjdHgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRSZXNvdXJjZXMoKXtcclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMucmVzb3VyY2VzKS5mb3JFYWNoKGl0ZW09PntcclxuICAgICAgICAgICAgaXRlbS5pc1JlYWR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoaXRlbS50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiaW1hZ2VcIjpcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLm9iamVjdC5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uaXNSZWFkeSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNvdW5kXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5vYmplY3Qub25jYW5wbGF5dGhyb3VnaCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5pc1JlYWR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IHQgPSBzZXRJbnRlcnZhbCgoKT0+e1xyXG4gICAgICAgICAgICBsZXQgaXNSZWFkeSA9IE9iamVjdC52YWx1ZXModGhpcy5yZXNvdXJjZXMpLmV2ZXJ5KGl0ZW09PntcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmlzUmVhZHlcclxuICAgICAgICAgICAgICAgICAgICAmJiAoIGl0ZW0ub2JqZWN0LmNvbXBsZXRlICE9IDAgfHwgIGl0ZW0ub2JqZWN0Lm5hdHVyYWxIZWlnaHQgIT0gMClcclxuICAgICAgICAgICAgICAgICAgICAmJiBpdGVtLm9iamVjdC53aWR0aCAhPSAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZihpc1JlYWR5KXtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5nbygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodCk7XHJcbiAgICAgICAgICAgICAgICB9LCAyNTUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7IFxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpe1xyXG4gICAgbGV0IHJlc291cmNlcyA9IHtcclxuICAgICAgICBzaGlwSW1hZ2U6IHtcclxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZVwiLFxyXG4gICAgICAgICAgICBvYmplY3Q6IG5ldyBJbWFnZSgpLFxyXG4gICAgICAgICAgICBzcmM6IFwiaW1hZ2VzL3NoaXAucG5nXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbmVteUVhc3lJbWFnZToge1xyXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlXCIsXHJcbiAgICAgICAgICAgIG9iamVjdDogbmV3IEltYWdlKCksXHJcbiAgICAgICAgICAgIHNyYzogXCJpbWFnZXMvZW5lbXlfZWFzeV9zaGlwLnBuZ1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyZUltYWdlOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2VcIixcclxuICAgICAgICAgICAgb2JqZWN0OiBuZXcgSW1hZ2UoKSxcclxuICAgICAgICAgICAgc3JjOiBcImltYWdlcy9zaG9vdF9sYXNlci5wbmdcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyZVNvdW5kOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwic291bmRcIixcclxuICAgICAgICAgICAgb2JqZWN0OiBuZXcgQXVkaW8sXHJcbiAgICAgICAgICAgIHNyYzogXCJzb3VuZHMvc2hpcF9vd25fbGFzZXIubXAzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBsYW5ldEltYWdlOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2VcIixcclxuICAgICAgICAgICAgb2JqZWN0OiBuZXcgSW1hZ2UoKSxcclxuICAgICAgICAgICAgc3JjOiBcImltYWdlcy9wbGFuZXQucG5nXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBiZ0ltYWdlOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2VcIixcclxuICAgICAgICAgICAgb2JqZWN0OiBuZXcgSW1hZ2UoKSxcclxuICAgICAgICAgICAgc3JjOiBcImltYWdlcy9iZzIuanBnXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvb206IHtcclxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZVwiLFxyXG4gICAgICAgICAgICBvYmplY3Q6IG5ldyBJbWFnZSgpLFxyXG4gICAgICAgICAgICBzcmM6IFwiaW1hZ2VzL2Jvb20ucG5nXCIsXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIE9iamVjdC52YWx1ZXMocmVzb3VyY2VzKS5mb3JFYWNoKChvYmopPT57XHJcbiAgICAgICAgb2JqLm9iamVjdC5zcmMgPSBvYmouc3JjO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc291cmNlcztcclxufTsiLCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIHJhbmRvbUZsb2F0OiBmdW5jdGlvbihtaW4sbWF4KXtcclxuICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluO1xyXG4gICAgfSxcclxuICAgIHJhbmRvbUludDogZnVuY3Rpb24obWluLG1heCl7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pKSArIG1pbjtcclxuICAgIH0sXHJcbiAgICBjaGVja0NvbGxpc2lvblJlY3RhbmdsZXM6IGZ1bmN0aW9uKCBvYmpBLCBvYmpCICl7XHJcbiAgICAgICAgLy8gaXQncyBuZWVkIGZvciBvbmUgdHlwZSBvZiBvYmplY3Qgc3RydWN0dXJlOiBcclxuICAgICAgICAvLyBtdXN0IHRvIHVzZSBvYmoucG9zaXRpb24gPSB7eDogdmFsdWUsIHk6IHZhbHVlfSAmJiAoIG9iai53aWR0aCAmJiBvYmouaGVpZ2h0IClcclxuICAgICAgICBsZXQgeyB4OmF4ICwgeTpheSB9ID0gb2JqQS5wb3NpdGlvbjtcclxuICAgICAgICBsZXQgeyB4OmJ4ICwgeTpieSB9ID0gb2JqQi5wb3NpdGlvbjtcclxuICAgICAgICBsZXQgeyB3aWR0aDphdyAsIGhlaWdodDphaCB9ID0gb2JqQTtcclxuICAgICAgICBsZXQgeyB3aWR0aDpidyAsIGhlaWdodDpiaCB9ID0gb2JqQjtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgYXhMZWZ0ICAgPSBheCAtIGF3LzI7XHJcbiAgICAgICAgbGV0IGF4UmlnaHQgID0gYXggKyBhdy8yO1xyXG4gICAgICAgIGxldCBheVRvcCAgICA9IGF5IC0gYWgvMjtcclxuICAgICAgICBsZXQgYXlCb3R0b20gPSBheSArIGFoLzI7XHJcblxyXG4gICAgICAgIGxldCBieExlZnQgICA9IGJ4IC0gYncvMjtcclxuICAgICAgICBsZXQgYnhSaWdodCAgPSBieCArIGJ3LzI7XHJcbiAgICAgICAgbGV0IGJ5VG9wICAgID0gYnkgLSBiaC8yO1xyXG4gICAgICAgIGxldCBieUJvdHRvbSA9IGJ5ICsgYmgvMjtcclxuXHJcbiAgICAgICAgLy8gZm9yIGNvbGxpc2lvbiBvZiAyIHJlY3RhbmdsZXMgbmVlZCA0IGNvbmRpdGlvbnM6XHJcbiAgICAgICAgLy8gMSkgYXhSaWdodCAgPiBieExlZnQgICAgIDogcmlnaHQgc2lkZSBYIGNvb3JkaW5hdGUgb2YgMS1zdCByZWN0IG1vcmUgdGhhbiBsZWZ0IHNpemUgWCBjb29yZGluYXRlIDItbmRcclxuICAgICAgICAvLyAyKSBheExlZnQgICA8IGJ4UmlnaHQgICAgOiAuLi5cclxuICAgICAgICAvLyAzKSBheUJvdHRvbSA+IGJ5VG9wICAgICAgXHJcbiAgICAgICAgLy8gNCkgYXlUb3AgICAgPCBieUJvdHRvbVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIGF4UmlnaHQgID4gYnhMZWZ0ICAgJiZcclxuICAgICAgICAgICAgYXhMZWZ0ICAgPCBieFJpZ2h0ICAmJlxyXG4gICAgICAgICAgICBheUJvdHRvbSA+IGJ5VG9wICAgICYmXHJcbiAgICAgICAgICAgIGF5VG9wICAgIDwgYnlCb3R0b20gPyB0cnVlIDogZmFsc2VcclxuICAgICAgICApO1xyXG4gICAgfSxcclxuXHJcblxyXG5cclxufTsiLCJcclxuXHJcbmxldCBvYmogPSB7XHJcbiAgICBtYXhGcmFtZXNJblNlY29uZDogNTAsXHJcbiAgICBtb3VzZToge1xyXG4gICAgICAgIHg6IDAsXHJcbiAgICAgICAgeTogMCxcclxuICAgICAgICBtb3VzZURvd246IHtcclxuICAgICAgICAgICAgdmFsdWU6IGZhbHNlLFxyXG4gICAgICAgICAgICBldmVudDogbnVsbCxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIGRlZmF1bHRMaWZlczogNCxcclxuICAgIGJvb21TcHJpdGVzQ291bnQ6IDgsXHJcbiAgICBkYXRhQ2FudmFzIDoge1xyXG4gICAgICAgIGZwczogMCxcclxuICAgICAgICBmcmFtZXNBbGw6IDAsIFxyXG4gICAgfSxcclxuICAgIHNvdW5kOiB7XHJcbiAgICAgICAgZW5hYmxlOiB0cnVlLFxyXG4gICAgfVxyXG59XHJcblxyXG4vLyB3aW5kb3cub2JqICA9IG9iajtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZXZlbnQpPT57XHJcbiAgICBsZXQgZSA9IGV2ZW50IHx8IHdpbmRvdy5ldmVudDtcclxuICAgIG9iai5tb3VzZS54ID0gZS54O1xyXG4gICAgb2JqLm1vdXNlLnkgPSBlLnk7XHJcbn0pO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIChldmVudCk9PntcclxuICAgIGxldCBlID0gZXZlbnQgfHwgd2luZG93LmV2ZW50O1xyXG4gICAgb2JqLm1vdXNlLm1vdXNlRG93bi52YWx1ZSA9IHRydWU7XHJcbiAgICBvYmoubW91c2UubW91c2VEb3duLmV2ZW50ID0gZTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGxpc3RlbmVyRm9yTW91c2VVcCk7XHJcbiAgICBmdW5jdGlvbiBsaXN0ZW5lckZvck1vdXNlVXAgKCkge1xyXG4gICAgICAgIG9iai5tb3VzZS5tb3VzZURvd24udmFsdWUgPSBmYWxzZTtcclxuICAgICAgICBvYmoubW91c2UubW91c2VEb3duLmV2ZW50ID0gbnVsbDtcclxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGxpc3RlbmVyRm9yTW91c2VVcCk7XHJcbiAgICB9O1xyXG5cclxufSlcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG9iajsiLCJcclxuaW1wb3J0IENhbnZhc0dhbWUgZnJvbSAnLi9DYW52YXNHYW1lJztcclxuaW1wb3J0IEdhbWVDb21wb25lbnRzSW5pdCBmcm9tICcuL0dhbWVDb21wb25lbnRzSW5pdC9pbmRleC5qcyc7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpPT57XHJcbiAgICBsZXQgY2FudmFzR2FtZSA9IG5ldyBDYW52YXNHYW1lKCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FudmFzX19jdHgnKSApO1xyXG4gICAgbmV3IEdhbWVDb21wb25lbnRzSW5pdCggY2FudmFzR2FtZSApO1xyXG59KTtcclxuXHJcblxyXG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQnVmZmVyKGFyZykge1xuICByZXR1cm4gYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnXG4gICAgJiYgdHlwZW9mIGFyZy5jb3B5ID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5maWxsID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5yZWFkVUludDggPT09ICdmdW5jdGlvbic7XG59IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBmb3JtYXRSZWdFeHAgPSAvJVtzZGolXS9nO1xuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbihmKSB7XG4gIGlmICghaXNTdHJpbmcoZikpIHtcbiAgICB2YXIgb2JqZWN0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpO1xuICB9XG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICB2YXIgc3RyID0gU3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHggPT09ICclJScpIHJldHVybiAnJSc7XG4gICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICBzd2l0Y2ggKHgpIHtcbiAgICAgIGNhc2UgJyVzJzogcmV0dXJuIFN0cmluZyhhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclaic6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3NbaSsrXSk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXR1cm4gJ1tDaXJjdWxhcl0nO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gIH0pO1xuICBmb3IgKHZhciB4ID0gYXJnc1tpXTsgaSA8IGxlbjsgeCA9IGFyZ3NbKytpXSkge1xuICAgIGlmIChpc051bGwoeCkgfHwgIWlzT2JqZWN0KHgpKSB7XG4gICAgICBzdHIgKz0gJyAnICsgeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICcgJyArIGluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG5cbi8vIE1hcmsgdGhhdCBhIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4vLyBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuLy8gSWYgLS1uby1kZXByZWNhdGlvbiBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbmV4cG9ydHMuZGVwcmVjYXRlID0gZnVuY3Rpb24oZm4sIG1zZykge1xuICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICBpZiAoaXNVbmRlZmluZWQoZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZWQoKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbikge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBkZXByZWNhdGVkO1xufTtcblxuXG52YXIgZGVidWdzID0ge307XG52YXIgZGVidWdFbnZpcm9uO1xuZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICBpZiAoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlcbiAgICBkZWJ1Z0Vudmlyb24gPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnO1xuICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgaWYgKCFkZWJ1Z3Nbc2V0XSkge1xuICAgIGlmIChuZXcgUmVnRXhwKCdcXFxcYicgKyBzZXQgKyAnXFxcXGInLCAnaScpLnRlc3QoZGVidWdFbnZpcm9uKSkge1xuICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZyA9IGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVidWdzW3NldF07XG59O1xuXG5cbi8qKlxuICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICogaW4gdGhlIGJlc3Qgd2F5IHBvc3NpYmxlIGdpdmVuIHRoZSBkaWZmZXJlbnQgdHlwZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRoYXQgYWx0ZXJzIHRoZSBvdXRwdXQuXG4gKi9cbi8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbmZ1bmN0aW9uIGluc3BlY3Qob2JqLCBvcHRzKSB7XG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgY3R4ID0ge1xuICAgIHNlZW46IFtdLFxuICAgIHN0eWxpemU6IHN0eWxpemVOb0NvbG9yXG4gIH07XG4gIC8vIGxlZ2FjeS4uLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBjdHguZGVwdGggPSBhcmd1bWVudHNbMl07XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gIGlmIChpc0Jvb2xlYW4ob3B0cykpIHtcbiAgICAvLyBsZWdhY3kuLi5cbiAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gIH0gZWxzZSBpZiAob3B0cykge1xuICAgIC8vIGdvdCBhbiBcIm9wdGlvbnNcIiBvYmplY3RcbiAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgfVxuICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguZGVwdGgpKSBjdHguZGVwdGggPSAyO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmNvbG9ycykpIGN0eC5jb2xvcnMgPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICBpZiAoY3R4LmNvbG9ycykgY3R4LnN0eWxpemUgPSBzdHlsaXplV2l0aENvbG9yO1xuICByZXR1cm4gZm9ybWF0VmFsdWUoY3R4LCBvYmosIGN0eC5kZXB0aCk7XG59XG5leHBvcnRzLmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuaW5zcGVjdC5jb2xvcnMgPSB7XG4gICdib2xkJyA6IFsxLCAyMl0sXG4gICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICdncmV5JyA6IFs5MCwgMzldLFxuICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICdibHVlJyA6IFszNCwgMzldLFxuICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgJ3llbGxvdycgOiBbMzMsIDM5XVxufTtcblxuLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG5pbnNwZWN0LnN0eWxlcyA9IHtcbiAgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICdudW1iZXInOiAneWVsbG93JyxcbiAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgJ251bGwnOiAnYm9sZCcsXG4gICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgJ3JlZ2V4cCc6ICdyZWQnXG59O1xuXG5cbmZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgdmFyIHN0eWxlID0gaW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMV0gKyAnbSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsIGN0eCk7XG4gICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICByZXQgPSBmb3JtYXRWYWx1ZShjdHgsIHJldCwgcmVjdXJzZVRpbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFByaW1pdGl2ZSB0eXBlcyBjYW5ub3QgaGF2ZSBwcm9wZXJ0aWVzXG4gIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gIGlmIChwcmltaXRpdmUpIHtcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG5cbiAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcbiAgfVxuXG4gIC8vIElFIGRvZXNuJ3QgbWFrZSBlcnJvciBmaWVsZHMgbm9uLWVudW1lcmFibGVcbiAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2R3dzUyc2J0KHY9dnMuOTQpLmFzcHhcbiAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAmJiAoa2V5cy5pbmRleE9mKCdtZXNzYWdlJykgPj0gMCB8fCBrZXlzLmluZGV4T2YoJ2Rlc2NyaXB0aW9uJykgPj0gMCkpIHtcbiAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgfVxuICBpZiAoIXN0cikge1xuICAgIGlmIChjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpIDwgMCkge1xuICAgICAgaWYgKGlzTnVsbChyZWN1cnNlVGltZXMpKSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgIGlmIChhcnJheSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzVW5kZWZpbmVkKG5hbWUpKSB7XG4gICAgaWYgKGFycmF5ICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xufVxuXG5cbmZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJlxuICAgICAgKG9iamVjdFRvU3RyaW5nKGUpID09PSAnW29iamVjdCBFcnJvcl0nIHx8IGUgaW5zdGFuY2VvZiBFcnJvcik7XG59XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCcgfHwgIC8vIEVTNiBzeW1ib2xcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xufVxuZXhwb3J0cy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG5leHBvcnRzLmlzQnVmZmVyID0gcmVxdWlyZSgnLi9zdXBwb3J0L2lzQnVmZmVyJyk7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5cbi8vIGxvZyBpcyBqdXN0IGEgdGhpbiB3cmFwcGVyIHRvIGNvbnNvbGUubG9nIHRoYXQgcHJlcGVuZHMgYSB0aW1lc3RhbXBcbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xufTtcblxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAqXG4gKiBUaGUgRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzIGZyb20gbGFuZy5qcyByZXdyaXR0ZW4gYXMgYSBzdGFuZGFsb25lXG4gKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAqIGR1cmluZyBib290c3RyYXBwaW5nIHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgcmV3cml0dGVuIHVzaW5nIHNvbWUgbmF0aXZlXG4gKiBmdW5jdGlvbnMgYXMgcHJvdG90eXBlIHNldHVwIHVzaW5nIG5vcm1hbCBKYXZhU2NyaXB0IGRvZXMgbm90IHdvcmsgYXNcbiAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gd2hpY2ggbmVlZHMgdG8gaW5oZXJpdCB0aGVcbiAqICAgICBwcm90b3R5cGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gdG8gaW5oZXJpdCBwcm90b3R5cGUgZnJvbS5cbiAqL1xuZXhwb3J0cy5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmV4cG9ydHMuX2V4dGVuZCA9IGZ1bmN0aW9uKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgIWlzT2JqZWN0KGFkZCkpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59O1xuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuIl19
