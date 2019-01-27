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

                    if (lastFullSeconds < nowFullSeconds) {
                        _this3.dataCanvas.fps = _this3.dataCanvas.fpsInSecondNow;
                        _this3.dataCanvas.fpsInSecondNow = 0;
                    } else {
                        _this3.dataCanvas.fpsInSecondNow++;
                    }

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

},{"./gameConf":12}],2:[function(require,module,exports){
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

},{"../fns.js":11,"../gameConf":12,"./resources":9}],3:[function(require,module,exports){
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
            image: resources.boomImage.object,
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
                if (_fns2.default.checkCollisionRectangles(enemy.ship, _this3.ship.ship, true)) {
                    new _Boom2.default(_this3.canvas, _this3.gameObjects, _this3.resources, {
                        x: _this3.ship.ship.position.x,
                        y: _this3.ship.ship.position.y
                    }, enemy);
                    new _Boom2.default(_this3.canvas, _this3.gameObjects, _this3.resources, {
                        x: enemy.ship.position.x,
                        y: enemy.ship.position.y
                    }, enemy);
                    enemy.startDestroy();
                    _this3.ship.collisionWidthEnemy();
                }
            });
        }
    }]);

    return Collisions;
}();

exports.default = Collisions;

},{"../fns":11,"../gameConf":12,"./Boom":3,"util":17}],5:[function(require,module,exports){
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
            speed: 1,
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
            },
            sound: {
                object: resources.boomEnemySound.object
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
            console.log('enemy destroy');
            this.playSoundDestroying();

            this.actionDestroyHandler = this.canvas.addActionHandler(function () {
                _this2.ship.speed = _this2.ship.speed * 0.5 + 1;
                if (++_this2.destroyFrames.counter >= _this2.destroyFrames.all) {
                    _this2.delete();
                }
            });
        }
    }, {
        key: 'playSoundDestroying',
        value: function playSoundDestroying() {
            var soundDestroyToPlay = new Audio();
            soundDestroyToPlay.src = this.ship.sound.object.src;
            soundDestroyToPlay.play();
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

},{"../fns":11,"../gameConf":12,"./resources":9}],6:[function(require,module,exports){
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

},{"../gameConf":12,"./resources":9,"util":17}],7:[function(require,module,exports){
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

        this.gameConf = _gameConf2.default;
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
            width: 34,
            height: 64,
            position: {
                x: _gameConf2.default.mouse.x,
                y: _gameConf2.default.mouse.y
            },
            lifes: _gameConf2.default.defaultLifes,
            lastFrameCountOfFireCreate: 0,
            canTouch: true,
            shieldEnable: false
        };
        this.disableMoveTime = 500;

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
            this.moveActionHandlerId = this.canvas.addActionHandler(function () {
                _this.ship.position.x = _gameConf2.default.mouse.x;
                _this.ship.position.y = _gameConf2.default.mouse.y;
            });
        }
    }, {
        key: 'shipMove',
        value: function shipMove(ctx) {

            var xSpritePosition = this.image.spriteSize.spritePosition < this.image.spriteSize.spritesCount - 1 ? ++this.image.spriteSize.spritePosition : this.image.spriteSize.spritePosition = 0;

            ctx.drawImage(this.image.object, xSpritePosition * this.image.spriteSize.width, 0, this.ship.width * 2, this.ship.height * 2, this.ship.position.x - this.ship.width / 2, this.ship.position.y - this.ship.height / 2, this.ship.width, this.ship.height);
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
                    y: this.ship.position.y - this.ship.height / 2
                },
                sound: function sound() {
                    var sound = new Audio();
                    sound.src = _this2.sounds.laser.object.src;
                    return sound;
                }
            });
        }
    }, {
        key: 'collisionWidthEnemy',
        value: function collisionWidthEnemy() {

            if (!this.ship.canTouch) return;
            // this.ship.canTouch = false;.kkkll


            this.startDestroying();
        }
    }, {
        key: 'startDestroying',
        value: function startDestroying() {
            console.log(this.ship.shieldEnable);
            if (this.ship.shieldEnable) {
                this.moveStopped();
            } else {
                this.shieldEnable();
                // if(--this.ship.lifes > 0){
                //     // this.looseLvl();
                //     console.log('qwe2')
                //     this.moveStopped();
                //     this.shieldEnable();
                // } else {
                //     console.log('qwe1234')
                // }
            }
        }
    }, {
        key: 'moveStopped',
        value: function moveStopped() {
            var _this3 = this;

            this.canvas.removeActionHandler(this.moveActionHandlerId);
            setTimeout(function () {
                _this3.moveActionHandlerId = _this3.canvas.addActionHandler(function () {
                    _this3.ship.position.x = _gameConf2.default.mouse.x;
                    _this3.ship.position.y = _gameConf2.default.mouse.y;
                });
            }, this.disableMoveTime);
        }
    }, {
        key: 'shieldEnable',
        value: function shieldEnable() {
            var _this4 = this;

            this.ship.shieldEnable = true;
            this.shieldDrawId = this.canvas.addHandlerToDraw(function (ctx) {
                ctx.strokeStyle = "white";
                ctx.beginPath();
                ctx.arc(_this4.ship.position.x, _this4.ship.position.y, _this4.ship.height > _this4.ship.width ? _this4.ship.height + 1 : _this4.ship.width + 1, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.closePath();
            });

            var framesCountWhenShieldStart = _gameConf2.default.dataCanvas.framesAll;
            var loopId = this.canvas.addActionHandler(function (gameConf) {
                if (_this4.gameConf.dataCanvas.framesAll - framesCountWhenShieldStart > 60 * 2) {
                    _this4.canvas.removeHandlerToDraw(_this4.shieldDrawId);
                    _this4.canvas.removeActionHandler(loopId);
                    _this4.ship.shieldEnable = false;
                }
            });
        }
    }, {
        key: 'looseLvl',
        value: function looseLvl() {
            this.canvas.stop();
        }
    }]);

    return Ship;
}();

exports.default = Ship;

},{"../gameConf":12,"./Fire":6,"./resources":9}],8:[function(require,module,exports){
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

},{"../gameConf":12,"./Bg":2,"./Collisions":4,"./Enemy":5,"./Ship":7,"./resources":9}],9:[function(require,module,exports){
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
        boomImage: {
            type: "image",
            object: new Image(),
            src: "images/boom.png"
        },
        boomEnemySound: {
            type: "sound",
            object: new Audio(),
            src: "sounds/enemy_boom.mp3"
        }
    };

    Object.values(resources).forEach(function (obj) {
        obj.object.src = obj.src;
    });

    return resources;
};

;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = showFps;
function showFps(fpsValue) {
    document.querySelector('.fps').innerHTML = 'FPS: ' + fpsValue;
}

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Enemy = require('./GameComponentsInit/Enemy');

var _Enemy2 = _interopRequireDefault(_Enemy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    randomFloat: function randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    },
    randomInt: function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    checkCollisionRectangles: function checkCollisionRectangles(objA, objB, from) {
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

},{"./GameComponentsInit/Enemy":5}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _devFns = require('./devFns');

var _devFns2 = _interopRequireDefault(_devFns);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// it will newer be 'prod'
var gameMode = 'dev';

var obj = {
    maxFramesInSecond: 60,
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
        // iteration of frames in each second 
        // from each new second will = 0
        fpsInSecondNow: 0,

        // max frames count on each second
        _fps: 0,
        set fps(value) {
            this._fps = value;
            gameMode == 'dev' ? (0, _devFns2.default)(value) : '';
            return this._fps;
        },
        get fps() {
            return this._fps;
        },
        // all frames from start drawing
        // will used like time counter
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
    e.preventDefault();
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

},{"./devFns":10}],13:[function(require,module,exports){
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

},{"./CanvasGame":1,"./GameComponentsInit/index.js":8}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],17:[function(require,module,exports){
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

},{"./support/isBuffer":16,"_process":15,"inherits":14}]},{},[13])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvQ2FudmFzR2FtZS5qcyIsImFwcC9qcy9HYW1lQ29tcG9uZW50c0luaXQvQmcuanMiLCJhcHAvanMvR2FtZUNvbXBvbmVudHNJbml0L0Jvb20uanMiLCJhcHAvanMvR2FtZUNvbXBvbmVudHNJbml0L0NvbGxpc2lvbnMuanMiLCJhcHAvanMvR2FtZUNvbXBvbmVudHNJbml0L0VuZW15LmpzIiwiYXBwL2pzL0dhbWVDb21wb25lbnRzSW5pdC9GaXJlLmpzIiwiYXBwL2pzL0dhbWVDb21wb25lbnRzSW5pdC9TaGlwLmpzIiwiYXBwL2pzL0dhbWVDb21wb25lbnRzSW5pdC9pbmRleC5qcyIsImFwcC9qcy9HYW1lQ29tcG9uZW50c0luaXQvcmVzb3VyY2VzLmpzIiwiYXBwL2pzL2RldkZucy5qcyIsImFwcC9qcy9mbnMuanMiLCJhcHAvanMvZ2FtZUNvbmYuanMiLCJhcHAvanMvbWFpbi5qcyIsIm5vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDQ0E7Ozs7Ozs7O0lBRXFCLFU7QUFDakIsd0JBQVksVUFBWixFQUF1QjtBQUFBOztBQUNuQixhQUFLLFNBQUwsR0FBaUIsSUFBakI7O0FBRUEsYUFBSyxNQUFMLEdBQWMsVUFBZDtBQUNBLGFBQUssR0FBTCxHQUFjLEtBQUssTUFBTCxDQUFZLFVBQVosQ0FBdUIsSUFBdkIsQ0FBZDs7QUFFQSxhQUFLLEtBQUwsR0FBYyxTQUFTLGVBQVQsQ0FBeUIsV0FBdkM7QUFDQSxhQUFLLE1BQUwsR0FBYyxTQUFTLGVBQVQsQ0FBeUIsWUFBdkM7O0FBRUEs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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxyXG5pbXBvcnQgZ2FtZUNvbmYgZnJvbSAnLi9nYW1lQ29uZic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXNHYW1le1xyXG4gICAgY29uc3RydWN0b3IoY2FudmFzTm9kZSl7XHJcbiAgICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzTm9kZTtcclxuICAgICAgICB0aGlzLmN0eCAgICA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG4gICAgICAgIHRoaXMud2lkdGggID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDtcclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSAgdGhpcy53aWR0aDtcclxuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhQ2FudmFzID0gZ2FtZUNvbmYuZGF0YUNhbnZhcztcclxuXHJcbiAgICAgICAgdGhpcy5pZEZvckhhbmRsZXJzICAgPSAwO1xyXG4gICAgICAgIHRoaXMuZHJhd0hhbmRsZXJzICAgID0ge307XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zSGFuZGxlcnMgPSB7fTtcclxuICAgICAgICB0aGlzLmRyYXdIYW5kbGVyc0luU3RvcHBlZE1vZGUgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5sb29wKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGRyYXdBbGwoKXtcclxuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5kcmF3SGFuZGxlcnMpLmZvckVhY2goKCBpdGVtRm4gKT0+e1xyXG4gICAgICAgICAgICBpZiggaXRlbUZuICE9IHVuZGVmaW5lZCApe1xyXG4gICAgICAgICAgICAgICAgaXRlbUZuKCB0aGlzLmN0eCApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5kYXRhQ2FudmFzLmZyYW1lc0FsbCsrO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrQWN0aW9uc0FsbCgpe1xyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5hY3Rpb25zSGFuZGxlcnMpLmZvckVhY2goKCBpdGVtRm4gKT0+e1xyXG4gICAgICAgICAgICBpZiggaXRlbUZuICE9IHVuZGVmaW5lZCApe1xyXG4gICAgICAgICAgICAgICAgaXRlbUZuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRBY3Rpb25IYW5kbGVyKCBhY3Rpb25IYW5kbGVyRm4gKXtcclxuICAgICAgICBsZXQgaWQgPSArK3RoaXMuaWRGb3JIYW5kbGVycztcclxuICAgICAgICB0aGlzLmFjdGlvbnNIYW5kbGVyc1tpZF0gPSBhY3Rpb25IYW5kbGVyRm47XHJcbiAgICAgICAgcmV0dXJuIGlkOyAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVBY3Rpb25IYW5kbGVyKCBpZE9mSGFuZGxlciApe1xyXG4gICAgICAgIGlmKCF0aGlzLmFjdGlvbnNIYW5kbGVyc1tpZE9mSGFuZGxlcl0pIHJldHVybjtcclxuICAgICAgICBkZWxldGUgdGhpcy5hY3Rpb25zSGFuZGxlcnNbaWRPZkhhbmRsZXJdO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEhhbmRsZXJUb0RyYXcoIGRyYXdIYW5kbGVyRm4gKXtcclxuICAgICAgICBsZXQgaWQgPSArK3RoaXMuaWRGb3JIYW5kbGVycztcclxuICAgICAgICB0aGlzLmRyYXdIYW5kbGVyc1tpZF0gPSBkcmF3SGFuZGxlckZuO1xyXG4gICAgICAgIHJldHVybiBpZDtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVIYW5kbGVyVG9EcmF3KCBpZE9mSGFuZGxlciApIHtcclxuICAgICAgICBpZighdGhpcy5kcmF3SGFuZGxlcnNbaWRPZkhhbmRsZXJdKSByZXR1cm47XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuZHJhd0hhbmRsZXJzW2lkT2ZIYW5kbGVyXTtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3QWxsSW5TdG9wcGVkTW9kZSgpe1xyXG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLmRyYXdIYW5kbGVyc0luU3RvcHBlZE1vZGUpLmZvckVhY2goKCBpdGVtRm4gKT0+e1xyXG4gICAgICAgICAgICBpZiggaXRlbUZuICE9IHVuZGVmaW5lZCApe1xyXG4gICAgICAgICAgICAgICAgaXRlbUZuKCB0aGlzLmN0eCApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5kYXRhQ2FudmFzLmZyYW1lc0FsbCsrO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEhhbmRsZXJUb0RyYXdJblN0b3BwZWRNb2RlKCBkcmF3SGFuZGxlckZuICl7XHJcbiAgICAgICAgbGV0IGlkID0gKyt0aGlzLmlkRm9ySGFuZGxlcnM7XHJcbiAgICAgICAgdGhpcy5kcmF3SGFuZGxlcnNJblN0b3BwZWRNb2RlW2lkXSA9IGRyYXdIYW5kbGVyRm47XHJcbiAgICAgICAgcmV0dXJuIGlkO1xyXG4gICAgfVxyXG4gICAgcmVtb3ZlSGFuZGxlclRvRHJhd0luU3RvcHBlZE1vZGUoIGlkT2ZIYW5kbGVyICl7XHJcbiAgICAgICAgaWYoIXRoaXMuZHJhd0hhbmRsZXJzSW5TdG9wcGVkTW9kZVtpZE9mSGFuZGxlcl0pIHJldHVybjtcclxuICAgICAgICBkZWxldGUgdGhpcy5kcmF3SGFuZGxlcnNJblN0b3BwZWRNb2RlW2lkT2ZIYW5kbGVyXTsgXHJcbiAgICB9XHJcblxyXG4gICAgZ28oKXtcclxuICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3AoKXtcclxuICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgbG9vcCgpe1xyXG4gICAgICAgIGxldCBsYXN0RnVsbFNlY29uZHMgICA9IHBlcmZvcm1hbmNlLm5vdygpIDwgMTAwMCA/IDAgOiBwYXJzZUludCggcGVyZm9ybWFuY2Uubm93KCkgLyAxMDAwICk7XHJcbiAgICAgICAgbGV0IGxhc3RUaW1lSXRlcmF0aW9uID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgbGV0IGxvb3AgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGl0IG11c3QgY2hlY2sgZm9yIG1heCBmcHMgYW5kIGRvIG5vdCBkcmF3IGNhbnZhcyBpZiBpdCdzIHRvbyBmYXN0LFxyXG4gICAgICAgICAgICAvLyBiZWNhdXNlIHRoZSBnYW1lIGRyYXdpbmcgaXMgb3JpZW50ZWQgbm90IGZvciB0aW1lIGFuZCBmcHMgdG9nZXRoZXJcclxuICAgICAgICAgICAgLy8gYnV0IG9ubHkgZm9yIGZwcyAoIHdpdGhvdXQgc2l0dWF0aW9uIHdpdGggc3ByaXRlcyApXHJcbiAgICAgICAgICAgIGlmKCAhdGhpcy5pc1N0b3BwZWRcclxuICAgICAgICAgICAgICAgICYmIChwZXJmb3JtYW5jZS5ub3coKSAtIGxhc3RUaW1lSXRlcmF0aW9uKSA+ICgxMDAwIC8gZ2FtZUNvbmYubWF4RnJhbWVzSW5TZWNvbmQpICl7XHJcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3IgZnBzXHJcbiAgICAgICAgICAgICAgICBsZXQgbm93RnVsbFNlY29uZHMgPSBwZXJmb3JtYW5jZS5ub3coKSA8IDEwMDAgPyAwIDogcGFyc2VJbnQoIHBlcmZvcm1hbmNlLm5vdygpIC8gMTAwMCApO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCBsYXN0RnVsbFNlY29uZHMgPCBub3dGdWxsU2Vjb25kcyApe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YUNhbnZhcy5mcHMgPSB0aGlzLmRhdGFDYW52YXMuZnBzSW5TZWNvbmROb3c7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhQ2FudmFzLmZwc0luU2Vjb25kTm93ID0gMFxyXG4gICAgICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YUNhbnZhcy5mcHNJblNlY29uZE5vdysrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBsYXN0RnVsbFNlY29uZHMgPSBub3dGdWxsU2Vjb25kcztcclxuXHJcbiAgICAgICAgICAgICAgICBsYXN0VGltZUl0ZXJhdGlvbiAgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrQWN0aW9uc0FsbCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3QWxsKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSBlbHNlIGlmKCBwZXJmb3JtYW5jZS5ub3coKSAtIGxhc3RUaW1lSXRlcmF0aW9uID4gMTAwMCAvIGdhbWVDb25mLm1heEZyYW1lc0luU2Vjb25kICl7XHJcbiAgICAgICAgICAgICAgICAvLyBjYWxsIHRvIGRyYXdpbmcgcHJlbG9hZGluZ3MgYW5kIGVsc2UgdGhhdCBub3QgbmVlZCB0byBhd2FpdFxyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3QWxsSW5TdG9wcGVkTW9kZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIGxvb3AgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSggbG9vcCApO1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5pbXBvcnQgZ2FtZUNvbmYgZnJvbSAnLi4vZ2FtZUNvbmYnO1xyXG5pbXBvcnQgZm5zIGZyb20gJy4uL2Zucy5qcyc7XHJcbmltcG9ydCByZXNvdXJjZXMgZnJvbSAnLi9yZXNvdXJjZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmcge1xyXG4gICAgY29uc3RydWN0b3IoY2FudmFzLCBnYW1lT2JqZWN0cywgcmVzb3VyY2VzKXtcclxuICAgICAgICB0aGlzLmNhbnZhcyAgICAgID0gY2FudmFzO1xyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdHMgPSBnYW1lT2JqZWN0cztcclxuICAgICAgICB0aGlzLnJlc291cmNlcyAgID0gcmVzb3VyY2VzO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJzQmdEcmF3SGFuZGxlciA9IGNhbnZhcy5hZGRIYW5kbGVyVG9EcmF3KChjdHgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0JnKGN0eCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucGxhbmV0RHJhd0hhbmRsZXIgPSBjYW52YXMuYWRkSGFuZGxlclRvRHJhdyhjdHg9PntcclxuICAgICAgICAgICAgdGhpcy5kcmF3UGxhbmV0KGN0eCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhcnNMb29wQWN0aW9ucyA9IGNhbnZhcy5hZGRBY3Rpb25IYW5kbGVyKCgpPT57XHJcbiAgICAgICAgICAgIHRoaXMubG9vcCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuaW1hZ2UgID0gcmVzb3VyY2VzLmJnSW1hZ2Uub2JqZWN0O1xyXG4gICAgICAgIHRoaXMucGxhbmV0ID0gcmVzb3VyY2VzLnBsYW5ldEltYWdlLm9iamVjdDtcclxuXHJcbiAgICAgICAgdGhpcy5wbGFuZXREZWdyZWUgPSAwO1xyXG4gICAgICAgIHRoaXMucG9zID0ge1xyXG4gICAgICAgICAgICB5MTogbnVsbCxcclxuICAgICAgICAgICAgeTI6IG51bGwsXHJcbiAgICAgICAgICAgIHkzOiBudWxsLFxyXG4gICAgICAgICAgICBzbGlkZXM6IDMsXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIGRyYXdCZyggY3R4ICl7XHJcbiAgICAgICAgaWYoIHRoaXMuaW1hZ2Uud2lkdGggPT0gMCApIHJldHVybiBmYWxzZTtcclxuICAgICAgICBcclxuICAgICAgICBpZiggdGhpcy5wb3MueTEgPT09IG51bGwgKXtcclxuICAgICAgICAgICAgdGhpcy5wb3MueTEgPSAtdGhpcy5pbWFnZS5oZWlnaHQgKyB0aGlzLmNhbnZhcy5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0aGlzLnBvcy55MiA9PT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLnBvcy55MiA9IC10aGlzLmltYWdlLmhlaWdodCAqIDIgICsgdGhpcy5jYW52YXMuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggdGhpcy5wb3MueTMgPT09IG51bGwgKXtcclxuICAgICAgICAgICAgdGhpcy5wb3MueTMgPSAtdGhpcy5pbWFnZS5oZWlnaHQgKiAzICArIHRoaXMuY2FudmFzLmhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBzcGVlZCA9IDEuNTtcclxuICAgICAgICBsZXQgeVBvczEgPSB0aGlzLnBvcy55MTtcclxuICAgICAgICBsZXQgeVBvczIgPSB0aGlzLnBvcy55MjtcclxuICAgICAgICBsZXQgeVBvczMgPSB0aGlzLnBvcy55MztcclxuXHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZShcclxuICAgICAgICAgICAgdGhpcy5pbWFnZSxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS5oZWlnaHQsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHlQb3MxLFxyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS5oZWlnaHQsXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdHguZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLmhlaWdodCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgeVBvczIsXHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLmhlaWdodCxcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2Uud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UuaGVpZ2h0LFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB5UG9zMyxcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UuaGVpZ2h0LFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgXHJcbiAgICAgICAgLy8gc2VlIGVuZCBvZiBmaXJzdCBzY3JlZW4gaW1hZ2VcclxuICAgICAgICBpZiggdGhpcy5wb3MueTEgPj0gMCArIHRoaXMuY2FudmFzLmhlaWdodCAmJiB0aGlzLnBvcy5zbGlkZXMgJSAzID09PSAwKXtcclxuICAgICAgICAgICAgdGhpcy5wb3Muc2xpZGVzKytcclxuICAgICAgICAgICAgdGhpcy5wb3MueTEgPSB0aGlzLnBvcy55MyAtIHRoaXMuaW1hZ2UuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiggdGhpcy5wb3MueTIgPj0gMCArIHRoaXMuY2FudmFzLmhlaWdodCAmJiB0aGlzLnBvcy5zbGlkZXMgJSAzID09PSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zLnNsaWRlcysrXHJcbiAgICAgICAgICAgIHRoaXMucG9zLnkyID0gdGhpcy5wb3MueTEgLSB0aGlzLmltYWdlLmhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCB0aGlzLnBvcy55MyA+PSAwICsgdGhpcy5jYW52YXMuaGVpZ2h0ICYmIHRoaXMucG9zLnNsaWRlcyAlIDMgPT09IDIpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3Muc2xpZGVzKytcclxuICAgICAgICAgICAgdGhpcy5wb3MueTMgPSB0aGlzLnBvcy55MiAtIHRoaXMuaW1hZ2UuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgeVBvczEgPSB0aGlzLnBvcy55MSArPSBzcGVlZDtcclxuICAgICAgICB5UG9zMiA9IHRoaXMucG9zLnkyICs9IHNwZWVkOyBcclxuICAgICAgICB5UG9zMyA9IHRoaXMucG9zLnkzICs9IHNwZWVkO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgZHJhd1BsYW5ldCggY3R4ICl7XHJcbiAgICAgICAgaWYodGhpcy5wbGFuZXQud2lkdGggPT09IDApIHJldHVybiBmYWxzZTtcclxuICAgICAgICBsZXQgaW1hZ2UgPSB0aGlzLnBsYW5ldDtcclxuXHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBjdHgudHJhbnNsYXRlKC10aGlzLmNhbnZhcy53aWR0aC8yICsgaW1hZ2Uud2lkdGggLyAyLCB0aGlzLmNhbnZhcy5oZWlnaHQvMiArIGltYWdlLmhlaWdodCAvIDIpO1xyXG4gICAgICAgIGN0eC5yb3RhdGUoIHRoaXMucGxhbmV0RGVncmVlICs9IDAuMDAwNzUgKTtcclxuICAgICAgICBjdHgudHJhbnNsYXRlKC0oLXRoaXMuY2FudmFzLndpZHRoLzIgKyBpbWFnZS53aWR0aCAvIDIpLCAtKHRoaXMuY2FudmFzLmhlaWdodC8yICsgaW1hZ2UuaGVpZ2h0IC8gMikpO1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgICAgIGltYWdlLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICBpbWFnZS53aWR0aCxcclxuICAgICAgICAgICAgaW1hZ2UuaGVpZ2h0LFxyXG4gICAgICAgICAgICAtdGhpcy5jYW52YXMud2lkdGgvMixcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0LzIsXHJcbiAgICAgICAgICAgIGltYWdlLndpZHRoLFxyXG4gICAgICAgICAgICBpbWFnZS5oZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgbG9vcCgpe1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG59IiwiXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb29te1xyXG4gICAgY29uc3RydWN0b3IoY2FudmFzLCBnYW1lT2JqZWN0LCByZXNvdXJjZXMsIGNvb3JkaW5hdGUsIGVuZW15KXtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcclxuXHJcbiAgICAgICAgdGhpcy5ib29tID0ge1xyXG4gICAgICAgICAgICBpc0Rlc3Ryb3lTdGFydDogZmFsc2UsXHJcbiAgICAgICAgICAgIGNvdW50ZXI6IDAsXHJcbiAgICAgICAgICAgIGltYWdlOiByZXNvdXJjZXMuYm9vbUltYWdlLm9iamVjdCxcclxuICAgICAgICAgICAgd2lkdGg6IDY0LFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDY0LFxyXG4gICAgICAgICAgICBzcHJpdGVTaXplOiB7XHJcbiAgICAgICAgICAgICAgICB3aWR0aDogNTEyLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA2NCxcclxuICAgICAgICAgICAgICAgIHNwcml0ZXNDb3VudDogOCxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb29yZGluYXRlID0gY29vcmRpbmF0ZTtcclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkSGFuZGxlclRvRHJhdygoY3R4KT0+e1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdCb29tKGN0eCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBkcmF3Qm9vbShjdHgpe1xyXG4gICAgICAgIGxldCB4U3ByaXRlUG9zaXRpb24gPSArK3RoaXMuYm9vbS5jb3VudGVyO1xyXG5cclxuICAgICAgICBjdHguZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICB0aGlzLmJvb20uaW1hZ2UsXHJcbiAgICAgICAgICAgIHhTcHJpdGVQb3NpdGlvbiAqIHRoaXMuYm9vbS53aWR0aCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdGhpcy5ib29tLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmJvb20uaGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLmNvb3JkaW5hdGUueCAtIHRoaXMuYm9vbS53aWR0aC8yLFxyXG4gICAgICAgICAgICB0aGlzLmNvb3JkaW5hdGUueSAtIHRoaXMuYm9vbS5oZWlnaHQvMixcclxuICAgICAgICAgICAgdGhpcy5ib29tLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmJvb20uaGVpZ2h0KTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IGlzQXJyYXkgfSBmcm9tIFwidXRpbFwiO1xyXG5pbXBvcnQgZm5zIGZyb20gJy4uL2Zucyc7XHJcbmltcG9ydCBnYW1lQ29uZiBmcm9tIFwiLi4vZ2FtZUNvbmZcIjtcclxuaW1wb3J0IEJvb20gZnJvbSAnLi9Cb29tJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbGxpc2lvbnMge1xyXG4gICAgY29uc3RydWN0b3IoY2FudmFzLCBnYW1lT2JqZWN0cywgcmVzb3VyY2VzLCBzaGlwKXtcclxuICAgICAgICB0aGlzLmNhbnZhcyAgICAgID0gY2FudmFzO1xyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdHMgPSBnYW1lT2JqZWN0cztcclxuICAgICAgICB0aGlzLnJlc291cmNlcyAgID0gcmVzb3VyY2VzO1xyXG4gICAgICAgIHRoaXMuc2hpcCAgICAgICAgPSBzaGlwO1xyXG5cclxuICAgICAgICB0aGlzLmFjdGlvbkxvb3BIYW5kbGVySWQgPSB0aGlzLmNhbnZhcy5hZGRBY3Rpb25IYW5kbGVyKCgpPT57XHJcbiAgICAgICAgICAgIHRoaXMubG9vcCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvb3AoKXtcclxuICAgICAgICBpZih0aGlzLmNhbnZhcy5pc1N0b3BwZWQpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5jaGVja0NvbGxpc2lvbnNGaXJlc0FuZEVuZW1pZXMoKTtcclxuICAgICAgICB0aGlzLmNoZWNrQ29sbGlzaW9uc1NoaXBBbmRFbmVtaWVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tDb2xsaXNpb25zRmlyZXNBbmRFbmVtaWVzKCl7XHJcbiAgICAgICAgbGV0IGZpcmVzICAgICAgPSB0aGlzLmdhbWVPYmplY3RzLmZpcmVzO1xyXG4gICAgICAgIGxldCBlbmVteVNoaXBzID0gdGhpcy5nYW1lT2JqZWN0cy5lbmVteVNoaXBzO1xyXG5cclxuICAgICAgICBPYmplY3QudmFsdWVzKGZpcmVzKS5mb3JFYWNoKGZpcmU9PntcclxuICAgICAgICAgICAgT2JqZWN0LnZhbHVlcyhlbmVteVNoaXBzKS5mb3JFYWNoKGVuZW15PT57XHJcbiAgICAgICAgICAgICAgICBpZihmbnMuY2hlY2tDb2xsaXNpb25SZWN0YW5nbGVzKGVuZW15LnNoaXAsZmlyZS5maXJlKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5kZWxldGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBlbmVteS5zdGFydERlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgICAgICBuZXcgQm9vbSh0aGlzLmNhbnZhcywgdGhpcy5nYW1lT2JqZWN0cywgdGhpcy5yZXNvdXJjZXMsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeDogZmlyZS5maXJlLnBvc2l0aW9uLngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IGZpcmUuZmlyZS5wb3NpdGlvbi55LFxyXG4gICAgICAgICAgICAgICAgICAgIH0sZW5lbXkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0NvbGxpc2lvbnNTaGlwQW5kRW5lbWllcygpe1xyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5nYW1lT2JqZWN0cy5lbmVteVNoaXBzKS5mb3JFYWNoKGVuZW15PT57XHJcbiAgICAgICAgICAgIGlmKGZucy5jaGVja0NvbGxpc2lvblJlY3RhbmdsZXMoZW5lbXkuc2hpcCwgdGhpcy5zaGlwLnNoaXAsIHRydWUpKXtcclxuICAgICAgICAgICAgICAgIG5ldyBCb29tKHRoaXMuY2FudmFzLCB0aGlzLmdhbWVPYmplY3RzLCB0aGlzLnJlc291cmNlcywge1xyXG4gICAgICAgICAgICAgICAgICAgIHg6IHRoaXMuc2hpcC5zaGlwLnBvc2l0aW9uLngsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogdGhpcy5zaGlwLnNoaXAucG9zaXRpb24ueSxcclxuICAgICAgICAgICAgICAgIH0sZW5lbXkpOyAgICAgXHJcbiAgICAgICAgICAgICAgICBuZXcgQm9vbSh0aGlzLmNhbnZhcywgdGhpcy5nYW1lT2JqZWN0cywgdGhpcy5yZXNvdXJjZXMsIHtcclxuICAgICAgICAgICAgICAgICAgICB4OiBlbmVteS5zaGlwLnBvc2l0aW9uLngsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogZW5lbXkuc2hpcC5wb3NpdGlvbi55LFxyXG4gICAgICAgICAgICAgICAgfSxlbmVteSk7IFxyXG4gICAgICAgICAgICAgICAgZW5lbXkuc3RhcnREZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoaXAuY29sbGlzaW9uV2lkdGhFbmVteSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsIlxyXG5pbXBvcnQgZm5zIGZyb20gJy4uL2Zucyc7XHJcbmltcG9ydCBnYW1lQ29uZiBmcm9tIFwiLi4vZ2FtZUNvbmZcIjtcclxuaW1wb3J0IHJlc291cmNlcyBmcm9tICcuL3Jlc291cmNlcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbmVteXtcclxuICAgIGNvbnN0cnVjdG9yKGNhbnZhcywgZ2FtZU9iamVjdHMsIHJlc291cmNlcywgdHlwZSwgaWQpe1xyXG4gICAgICAgIHRoaXMuY2FudmFzICAgICAgPSBjYW52YXM7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0cyA9IGdhbWVPYmplY3RzO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2VzICAgPSByZXNvdXJjZXM7XHJcbiAgICAgICAgdGhpcy5pZCAgICAgICAgICA9IGlkO1xyXG5cclxuICAgICAgICB0aGlzLnNoaXA7XHJcbiAgICAgICAgdGhpcy5pc0Rlc3Ryb3lTdGFydCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZGVzdHJveUZyYW1lcyAgPSB7XHJcbiAgICAgICAgICAgIGNvdW50ZXI6IDAsXHJcbiAgICAgICAgICAgIGFsbDogZ2FtZUNvbmYuYm9vbVNwcml0ZXNDb3VudFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lYXN5ID0ge1xyXG4gICAgICAgICAgICB3aWR0aDogMTY3LFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDc1LFxyXG4gICAgICAgICAgICBzcGVlZDogMSxcclxuICAgICAgICAgICAgcG9zaXRpb246IHtcclxuICAgICAgICAgICAgICAgIHg6IGZucy5yYW5kb21JbnQoMTcwICwgdGhpcy5jYW52YXMud2lkdGgpLFxyXG4gICAgICAgICAgICAgICAgeTogLTQwLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpbWFnZToge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0OiByZXNvdXJjZXMuZW5lbXlFYXN5SW1hZ2Uub2JqZWN0LFxyXG4gICAgICAgICAgICAgICAgc3ByaXRlU2l6ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAyMzQsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAxNTAsXHJcbiAgICAgICAgICAgICAgICAgICAgc3ByaXRlUG9zaXRpb246IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgc3ByaXRlc0NvdW50OiA0LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc291bmQ6IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdDogcmVzb3VyY2VzLmJvb21FbmVteVNvdW5kLm9iamVjdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImVhc3lcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcCA9IHRoaXMuZWFzeTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKXtcclxuXHJcbiAgICAgICAgdGhpcy5kcmF3SGFuZGxlciA9IHRoaXMuY2FudmFzLmFkZEhhbmRsZXJUb0RyYXcoKGN0eCk9PntcclxuICAgICAgICAgICAgdGhpcy5tb3ZlRHJhdyhjdHgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmFjdGlvbk1vdmVIYW5kbGVyID0gdGhpcy5jYW52YXMuYWRkQWN0aW9uSGFuZGxlcigoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNoaXAucG9zaXRpb24ueSArPSB0aGlzLnNoaXAuc3BlZWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZURyYXcoIGN0eCApe1xyXG4gICAgICAgIGxldCB4U3ByaXRlUG9zaXRpb24gPVxyXG4gICAgICAgICAgICB0aGlzLnNoaXAuaW1hZ2Uuc3ByaXRlU2l6ZS5zcHJpdGVQb3NpdGlvbiA8IHRoaXMuc2hpcC5pbWFnZS5zcHJpdGVTaXplLnNwcml0ZXNDb3VudCAtIDFcclxuICAgICAgICAgICAgPyArK3RoaXMuc2hpcC5pbWFnZS5zcHJpdGVTaXplLnNwcml0ZVBvc2l0aW9uXHJcbiAgICAgICAgICAgIDogdGhpcy5zaGlwLmltYWdlLnNwcml0ZVNpemUuc3ByaXRlUG9zaXRpb24gPSAwO1xyXG5cclxuICAgICAgICBjdHguZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICB0aGlzLnNoaXAuaW1hZ2Uub2JqZWN0LFxyXG4gICAgICAgICAgICB4U3ByaXRlUG9zaXRpb24gKiB0aGlzLnNoaXAuaW1hZ2Uuc3ByaXRlU2l6ZS53aWR0aCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdGhpcy5zaGlwLmltYWdlLnNwcml0ZVNpemUud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMuc2hpcC5pbWFnZS5zcHJpdGVTaXplLmhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy5zaGlwLnBvc2l0aW9uLnggLSB0aGlzLnNoaXAud2lkdGggLyAyLFxyXG4gICAgICAgICAgICB0aGlzLnNoaXAucG9zaXRpb24ueSAtIHRoaXMuc2hpcC5oZWlnaHQgLyAyLFxyXG4gICAgICAgICAgICB0aGlzLnNoaXAud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMuc2hpcC5oZWlnaHQpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tGb3JPdXRTY3JlZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydERlc3Ryb3koKXtcclxuICAgICAgICBpZih0aGlzLmlzRGVzdHJveVN0YXJ0KSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5pc0Rlc3Ryb3lTdGFydCA9IHRydWU7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2VuZW15IGRlc3Ryb3knKVxyXG4gICAgICAgIHRoaXMucGxheVNvdW5kRGVzdHJveWluZygpO1xyXG5cclxuICAgICAgICB0aGlzLmFjdGlvbkRlc3Ryb3lIYW5kbGVyID0gdGhpcy5jYW52YXMuYWRkQWN0aW9uSGFuZGxlcigoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNoaXAuc3BlZWQgPSB0aGlzLnNoaXAuc3BlZWQgKiAwLjUgKyAxO1xyXG4gICAgICAgICAgICBpZigrK3RoaXMuZGVzdHJveUZyYW1lcy5jb3VudGVyID49IHRoaXMuZGVzdHJveUZyYW1lcy5hbGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWxldGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXlTb3VuZERlc3Ryb3lpbmcoKXtcclxuICAgICAgICBsZXQgc291bmREZXN0cm95VG9QbGF5ID0gbmV3IEF1ZGlvKCk7XHJcbiAgICAgICAgc291bmREZXN0cm95VG9QbGF5LnNyYyA9IHRoaXMuc2hpcC5zb3VuZC5vYmplY3Quc3JjO1xyXG4gICAgICAgIHNvdW5kRGVzdHJveVRvUGxheS5wbGF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tGb3JPdXRTY3JlZW4oKXtcclxuICAgICAgICBpZiggdGhpcy5zaGlwLnBvc2l0aW9uLnkgPiB0aGlzLmNhbnZhcy5oZWlnaHQgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZSgpe1xyXG4gICAgICAgXHJcbiAgICAgICAgZGVsZXRlIHRoaXMuZ2FtZU9iamVjdHMuZW5lbXlTaGlwc1t0aGlzLmlkXTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5yZW1vdmVBY3Rpb25IYW5kbGVyKHRoaXMuYWN0aW9uTW92ZUhhbmRsZXIpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUhhbmRsZXJUb0RyYXcoIHRoaXMuZHJhd0hhbmRsZXIgKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5yZW1vdmVIYW5kbGVyVG9EcmF3KCB0aGlzLmRyYXdEZXN0cm95SGFuZGxlciApO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUFjdGlvbkhhbmRsZXIoIHRoaXMuYWN0aW9uTW92ZUhhbmRsZXIgKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5yZW1vdmVBY3Rpb25IYW5kbGVyKCB0aGlzLmFjdGlvbkRlc3Ryb3lIYW5kbGVyICk7XHJcbiAgICB9XHJcbn0iLCJcclxuaW1wb3J0IGdhbWVDb25mIGZyb20gJy4uL2dhbWVDb25mJztcclxuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJ3V0aWwnO1xyXG5pbXBvcnQgcmVzb3VyY2VzIGZyb20gJy4vcmVzb3VyY2VzJztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaXJlIHtcclxuICAgIGNvbnN0cnVjdG9yKCBjYW52YXMsIGdhbWVPYmplY3RzLCByZXNvdXJjZXMsIGRhdGFPYmogKXtcclxuICAgICAgICB0aGlzLmNhbnZhcyAgICAgID0gY2FudmFzO1xyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdHMgPSBnYW1lT2JqZWN0cztcclxuICAgICAgICB0aGlzLnJlc291cmNlcyAgID0gcmVzb3VyY2VzO1xyXG4gICAgICAgIHRoaXMuZmlyZU1vdmVIYW5kbGVySWQ7XHJcblxyXG4gICAgICAgIHRoaXMuZmlyZSA9IHtcclxuICAgICAgICAgICAgaWQ6IGRhdGFPYmouaWQsXHJcbiAgICAgICAgICAgIHdpZHRoOiA1LFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDEwLFxyXG4gICAgICAgICAgICBjb2xvcjogXCIjRkYwMDAwXCIsXHJcbiAgICAgICAgICAgIHNwZWVkOiAzNyxcclxuICAgICAgICAgICAgcG9zaXRpb246IHtcclxuICAgICAgICAgICAgICAgIHg6IGRhdGFPYmoucG9zaXRpb24ueCxcclxuICAgICAgICAgICAgICAgIHk6IGRhdGFPYmoucG9zaXRpb24ueSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc291bmQ6IGRhdGFPYmouc291bmQoKSxcclxuICAgICAgICAgICAgaW1hZ2U6IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdDogcmVzb3VyY2VzLmZpcmVJbWFnZS5vYmplY3QsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgIC8vIHRoaXMgYXR0ciBpcyBkaWZmZXJlbnQgZnJpZW5kbHkgYW5kIG5vdCBzaG9vdCdzXHJcbiAgICAgICAgLy8gLTEgOiBmcmllbmRseSwgIDEgOiBpcyBub3RcclxuICAgICAgICB0aGlzLmlzRW5lbWllcyA9IC0xOyAgICAgICBcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICB0aGlzLmZpcmUuc291bmQucGxheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKXtcclxuICAgICAgICB0aGlzLmZpcmVNb3ZlSGFuZGxlcklkID0gdGhpcy5jYW52YXMuYWRkSGFuZGxlclRvRHJhdygoY3R4KT0+e1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVNb3ZlKGN0eCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZmlyZU1vdmUoIGN0eCApe1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmZpcmUuY29sb3I7XHJcbiAgICAgICAgbGV0IG5ld1kgPSB0aGlzLmZpcmUucG9zaXRpb24ueSArPSB0aGlzLmZpcmUuc3BlZWQgKiB0aGlzLmlzRW5lbWllcztcclxuXHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZShcclxuICAgICAgICAgICAgdGhpcy5maXJlLmltYWdlLm9iamVjdCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdGhpcy5maXJlLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmZpcmUuaGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLmZpcmUucG9zaXRpb24ueCAtIHRoaXMuZmlyZS53aWR0aCAvIDIsXHJcbiAgICAgICAgICAgIHRoaXMuZmlyZS5wb3NpdGlvbi55IC0gdGhpcy5maXJlLmhlaWdodCAvIDIsXHJcbiAgICAgICAgICAgIHRoaXMuZmlyZS53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5maXJlLmhlaWdodCxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLmNoZWNrRm9yT3V0U2NyZWVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tGb3JPdXRTY3JlZW4oKXtcclxuICAgICAgICBpZiggdGhpcy5maXJlLnBvc2l0aW9uLnkgPCAwICkge1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZWxldGUoKXtcclxuICAgICAgICBkZWxldGUgdGhpcy5nYW1lT2JqZWN0cy5maXJlc1t0aGlzLmZpcmUuaWRdO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUhhbmRsZXJUb0RyYXcoIHRoaXMuZmlyZU1vdmVIYW5kbGVySWQgKTtcclxuICAgIH1cclxufSIsIlxyXG5pbXBvcnQgZ2FtZUNvbmYgZnJvbSAnLi4vZ2FtZUNvbmYnO1xyXG5pbXBvcnQgRmlyZSBmcm9tICcuL0ZpcmUnO1xyXG5pbXBvcnQgcmVzb3VyY2VzIGZyb20gJy4vcmVzb3VyY2VzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoaXAge1xyXG4gICAgY29uc3RydWN0b3IoIGNhbnZhcywgZ2FtZU9iamVjdHMsIHJlc291cmNlcyApe1xyXG4gICAgICAgIHRoaXMuZ2FtZUNvbmYgICAgPSBnYW1lQ29uZjsgXHJcbiAgICAgICAgdGhpcy5jYW52YXMgICAgICA9IGNhbnZhcztcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3RzID0gZ2FtZU9iamVjdHM7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZXMgICA9IHJlc291cmNlcztcclxuICAgICAgICB0aGlzLmltYWdlICA9IHtcclxuICAgICAgICAgICAgb2JqZWN0OiByZXNvdXJjZXMuc2hpcEltYWdlLm9iamVjdCxcclxuICAgICAgICAgICAgc3ByaXRlU2l6ZToge1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY4LFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAxMjgsXHJcbiAgICAgICAgICAgICAgICBzcHJpdGVQb3NpdGlvbjogMCxcclxuICAgICAgICAgICAgICAgIHNwcml0ZXNDb3VudDogNCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNvdW5kcyA9IHtcclxuICAgICAgICAgICAgbGFzZXI6IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdDogcmVzb3VyY2VzLmZpcmVTb3VuZC5vYmplY3QsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zaGlwICA9IHtcclxuICAgICAgICAgICAgd2lkdGg6IDM0LFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDY0LFxyXG4gICAgICAgICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgeDogZ2FtZUNvbmYubW91c2UueCxcclxuICAgICAgICAgICAgICAgIHk6IGdhbWVDb25mLm1vdXNlLnksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxpZmVzOiBnYW1lQ29uZi5kZWZhdWx0TGlmZXMsXHJcbiAgICAgICAgICAgIGxhc3RGcmFtZUNvdW50T2ZGaXJlQ3JlYXRlOiAwLFxyXG4gICAgICAgICAgICBjYW5Ub3VjaDogdHJ1ZSxcclxuICAgICAgICAgICAgc2hpZWxkRW5hYmxlOiBmYWxzZSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZGlzYWJsZU1vdmVUaW1lID0gNTAwO1xyXG5cclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCl7XHJcbiAgICAgICAgdGhpcy5tb3ZlSGFuZGxlcklkID0gdGhpcy5jYW52YXMuYWRkSGFuZGxlclRvRHJhdygoY3R4KT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNoaXBNb3ZlKGN0eCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maXJlQWN0aW9uSGFuZGxlcklkID0gdGhpcy5jYW52YXMuYWRkQWN0aW9uSGFuZGxlcigoKT0+e1xyXG4gICAgICAgICAgICBnYW1lQ29uZi5tb3VzZS5tb3VzZURvd24udmFsdWUgPyB0aGlzLnNoaXBGaXJlKCB0aGlzLmNhbnZhcy5jdHggKSA6IFwiXCI7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5tb3ZlQWN0aW9uSGFuZGxlcklkID0gdGhpcy5jYW52YXMuYWRkQWN0aW9uSGFuZGxlcigoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNoaXAucG9zaXRpb24ueCA9IGdhbWVDb25mLm1vdXNlLng7XHJcbiAgICAgICAgICAgIHRoaXMuc2hpcC5wb3NpdGlvbi55ID0gZ2FtZUNvbmYubW91c2UueTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzaGlwTW92ZSggY3R4ICl7XHJcblxyXG4gICAgICAgIGxldCB4U3ByaXRlUG9zaXRpb24gPVxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLnNwcml0ZVNpemUuc3ByaXRlUG9zaXRpb24gPCB0aGlzLmltYWdlLnNwcml0ZVNpemUuc3ByaXRlc0NvdW50IC0gMVxyXG4gICAgICAgICAgICA/ICsrdGhpcy5pbWFnZS5zcHJpdGVTaXplLnNwcml0ZVBvc2l0aW9uXHJcbiAgICAgICAgICAgIDogdGhpcy5pbWFnZS5zcHJpdGVTaXplLnNwcml0ZVBvc2l0aW9uID0gMDtcclxuXHJcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlLm9iamVjdCxcclxuICAgICAgICAgICAgICAgIHhTcHJpdGVQb3NpdGlvbiAqIHRoaXMuaW1hZ2Uuc3ByaXRlU2l6ZS53aWR0aCxcclxuICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoaXAud2lkdGggKiAyLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwLmhlaWdodCAqIDIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoaXAucG9zaXRpb24ueCAtIHRoaXMuc2hpcC53aWR0aCAvIDIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoaXAucG9zaXRpb24ueSAtIHRoaXMuc2hpcC5oZWlnaHQgLyAyLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwLmhlaWdodCxcclxuICAgICAgICAgICAgKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2hpcEZpcmUoIGN0eCApe1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKCBNYXRoLmFicyggZ2FtZUNvbmYuZGF0YUNhbnZhcy5mcmFtZXNBbGwgLSB0aGlzLnNoaXAubGFzdEZyYW1lQ291bnRPZkZpcmVDcmVhdGUgKSA8IDQgKXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNoaXAubGFzdEZyYW1lQ291bnRPZkZpcmVDcmVhdGUgPSBnYW1lQ29uZi5kYXRhQ2FudmFzLmZyYW1lc0FsbDtcclxuICAgICAgICBsZXQgaWQgPSArK3RoaXMuZ2FtZU9iamVjdHMuaWRDb3VudGVyO1xyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdHMuZmlyZXNbaWRdID0gbmV3IEZpcmUodGhpcy5jYW52YXMsIHRoaXMuZ2FtZU9iamVjdHMsIHRoaXMucmVzb3VyY2VzLCB7XHJcbiAgICAgICAgICAgIGlkOiBpZCxcclxuICAgICAgICAgICAgcG9zaXRpb246IHtcclxuICAgICAgICAgICAgICAgIHg6IHRoaXMuc2hpcC5wb3NpdGlvbi54LFxyXG4gICAgICAgICAgICAgICAgeTogdGhpcy5zaGlwLnBvc2l0aW9uLnkgLSB0aGlzLnNoaXAuaGVpZ2h0IC8gMixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc291bmQ6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBzb3VuZCA9IG5ldyBBdWRpbztcclxuICAgICAgICAgICAgICAgIHNvdW5kLnNyYyA9IHRoaXMuc291bmRzLmxhc2VyLm9iamVjdC5zcmM7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc291bmQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGNvbGxpc2lvbldpZHRoRW5lbXkoKXtcclxuICAgICAgIFxyXG4gICAgICAgIGlmKCF0aGlzLnNoaXAuY2FuVG91Y2gpIHJldHVybjtcclxuICAgICAgICAvLyB0aGlzLnNoaXAuY2FuVG91Y2ggPSBmYWxzZTsua2trbGxcclxuXHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0RGVzdHJveWluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0RGVzdHJveWluZygpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc2hpcC5zaGllbGRFbmFibGUpXHJcbiAgICAgICAgaWYodGhpcy5zaGlwLnNoaWVsZEVuYWJsZSl7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZVN0b3BwZWQoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNoaWVsZEVuYWJsZSgpO1xyXG4gICAgICAgICAgICAvLyBpZigtLXRoaXMuc2hpcC5saWZlcyA+IDApe1xyXG4gICAgICAgICAgICAvLyAgICAgLy8gdGhpcy5sb29zZUx2bCgpO1xyXG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ3F3ZTInKVxyXG4gICAgICAgICAgICAvLyAgICAgdGhpcy5tb3ZlU3RvcHBlZCgpO1xyXG4gICAgICAgICAgICAvLyAgICAgdGhpcy5zaGllbGRFbmFibGUoKTtcclxuICAgICAgICAgICAgLy8gfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdxd2UxMjM0JylcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIG1vdmVTdG9wcGVkKCl7XHJcbiAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlQWN0aW9uSGFuZGxlcih0aGlzLm1vdmVBY3Rpb25IYW5kbGVySWQpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCk9PntcclxuICAgICAgICAgICAgdGhpcy5tb3ZlQWN0aW9uSGFuZGxlcklkID0gdGhpcy5jYW52YXMuYWRkQWN0aW9uSGFuZGxlcigoKT0+e1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwLnBvc2l0aW9uLnggPSBnYW1lQ29uZi5tb3VzZS54O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwLnBvc2l0aW9uLnkgPSBnYW1lQ29uZi5tb3VzZS55O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LHRoaXMuZGlzYWJsZU1vdmVUaW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzaGllbGRFbmFibGUoKXtcclxuICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2hpcC5zaGllbGRFbmFibGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuc2hpZWxkRHJhd0lkID0gdGhpcy5jYW52YXMuYWRkSGFuZGxlclRvRHJhdyhjdHg9PntcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5hcmMoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoaXAucG9zaXRpb24ueCxcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcC5wb3NpdGlvbi55LFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwLmhlaWdodCA+IHRoaXMuc2hpcC53aWR0aCA/XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaGlwLmhlaWdodCArIDFcclxuICAgICAgICAgICAgICAgICAgICA6IHRoaXMuc2hpcC53aWR0aCArIDEsXHJcbiAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgMiAqIE1hdGguUEkpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIGxldCBmcmFtZXNDb3VudFdoZW5TaGllbGRTdGFydCA9IGdhbWVDb25mLmRhdGFDYW52YXMuZnJhbWVzQWxsO1xyXG4gICAgICAgIGxldCBsb29wSWQgPSB0aGlzLmNhbnZhcy5hZGRBY3Rpb25IYW5kbGVyKChnYW1lQ29uZik9PntcclxuICAgICAgICAgICAgaWYodGhpcy5nYW1lQ29uZi5kYXRhQ2FudmFzLmZyYW1lc0FsbCAtIGZyYW1lc0NvdW50V2hlblNoaWVsZFN0YXJ0ID4gNjAgKiAyKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUhhbmRsZXJUb0RyYXcodGhpcy5zaGllbGREcmF3SWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlQWN0aW9uSGFuZGxlcihsb29wSWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwLnNoaWVsZEVuYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGxvb3NlTHZsKCl7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3RvcCgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCJcclxuXHJcbmltcG9ydCBTaGlwIGZyb20gJy4vU2hpcCc7XHJcbmltcG9ydCBnYW1lQ29uZiBmcm9tIFwiLi4vZ2FtZUNvbmZcIjtcclxuaW1wb3J0IEJnIGZyb20gJy4vQmcnO1xyXG5pbXBvcnQgRW5lbXkgZnJvbSAnLi9FbmVteSc7XHJcbmltcG9ydCBDb2xsaXNpb25zIGZyb20gJy4vQ29sbGlzaW9ucyc7XHJcbmltcG9ydCByZXNvdXJjZXMgZnJvbSAnLi9yZXNvdXJjZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUNvbXBvbmVudHNJbml0e1xyXG4gICAgY29uc3RydWN0b3IoIGNhbnZhcyApe1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdHMgPSB7XHJcbiAgICAgICAgICAgIGlkQ291bnRlcjogLTEsXHJcbiAgICAgICAgICAgIGZpcmVzOiB7fSxcclxuICAgICAgICAgICAgZW5lbXlTaGlwczoge30sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZXMgPSByZXNvdXJjZXMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5CZyAgID0gbmV3IEJnKCBjYW52YXMsIHRoaXMuZ2FtZU9iamVjdHMsIHRoaXMucmVzb3VyY2VzICk7XHJcbiAgICAgICAgdGhpcy5zaGlwID0gbmV3IFNoaXAoIGNhbnZhcywgdGhpcy5nYW1lT2JqZWN0cywgdGhpcy5yZXNvdXJjZXMgKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcmVMb2FkZXIoKTtcclxuICAgICAgICB0aGlzLmxvYWRSZXNvdXJjZXMoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUVuZW1pZXMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb2xsaXNpb25DaGVja2VyID0gbmV3IENvbGxpc2lvbnMoY2FudmFzLCB0aGlzLmdhbWVPYmplY3RzLCB0aGlzLnJlc291cmNlcywgdGhpcy5zaGlwKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVFbmVtaWVzKCl7XHJcbiAgICAgICAgY29uc3QgZW5lbXlNYXAgPSBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZyb21GcmFtZTogMzAsXHJcbiAgICAgICAgICAgICAgICBlbmVteVR5cGU6IFwiZWFzeVwiLFxyXG4gICAgICAgICAgICAgICAgZW5lbXlDb3VudDogNTU1LFxyXG4gICAgICAgICAgICAgICAgZW5lbXlEZWxheTogMzUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgdGhpcy5lbmVtaWVzQ3JlYXRlQWN0aW9uSGFuZGxlcklkID0gdGhpcy5jYW52YXMuYWRkQWN0aW9uSGFuZGxlcigoKT0+e1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICBlbmVteU1hcC5mb3JFYWNoKGVuZW15TWFwUGFydD0+e1xyXG4gICAgICAgICAgICAgICBsZXQgZnJhbWVOb3cgPSBnYW1lQ29uZi5kYXRhQ2FudmFzLmZyYW1lc0FsbDtcclxuICAgICAgICAgICAgICAgaWYoZnJhbWVOb3cgPj0gZW5lbXlNYXBQYXJ0LmZyb21GcmFtZVxyXG4gICAgICAgICAgICAgICAgJiYgZW5lbXlNYXBQYXJ0LmVuZW15Q291bnQgPiAwXHJcbiAgICAgICAgICAgICAgICAmJiBmcmFtZU5vdyAlIGVuZW15TWFwUGFydC5lbmVteURlbGF5ID09PSAwKXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaWQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZU9iamVjdHMuZW5lbXlTaGlwc1srK3RoaXMuZ2FtZU9iamVjdHMuaWRDb3VudGVyXSA9IG5ldyBFbmVteShcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZU9iamVjdHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmVteU1hcFBhcnQuZW5lbXlUeXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVPYmplY3RzLmlkQ291bnRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgZW5lbXlNYXBQYXJ0LmVuZW15Q291bnQtLTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCl7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByZUxvYWRlcigpe1xyXG4gICAgICAgIGxldCBwcmVMb2FkZXJIYW5kbGVyID0gKCBjdHggKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBsZXQgYWxsQ291bnRlciA9IE9iamVjdC5rZXlzKHRoaXMucmVzb3VyY2VzKS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGxldCBpc0xvYWRDb3VudGVyID0gT2JqZWN0LnZhbHVlcyh0aGlzLnJlc291cmNlcykuZmlsdGVyKGl0ZW09PntcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmlzUmVhZHk7XHJcbiAgICAgICAgICAgIH0pLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcInJlZFwiO1xyXG4gICAgICAgICAgICBsZXQgcHJlTG9hZGVyTGluZUhlaWdodCA9IDM7XHJcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdChcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLndpZHRoIC8gMTAsXHJcbiAgICAgICAgICAgICAgICAodGhpcy5jYW52YXMuaGVpZ2h0IC8gMikgLSBwcmVMb2FkZXJMaW5lSGVpZ2h0IC8gMixcclxuICAgICAgICAgICAgICAgICh0aGlzLmNhbnZhcy53aWR0aCAvIDEwKSAqIDggKiAoaXNMb2FkQ291bnRlciAvIGFsbENvdW50ZXIpLFxyXG4gICAgICAgICAgICAgICAgcHJlTG9hZGVyTGluZUhlaWdodFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5wcmVMb2FkZXJEcmF3SGFuZGxlcklkID0gdGhpcy5jYW52YXMuYWRkSGFuZGxlclRvRHJhd0luU3RvcHBlZE1vZGUoY3R4PT57XHJcbiAgICAgICAgICAgIHByZUxvYWRlckhhbmRsZXIoY3R4KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkUmVzb3VyY2VzKCl7XHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnJlc291cmNlcykuZm9yRWFjaChpdGVtPT57XHJcbiAgICAgICAgICAgIGl0ZW0uaXNSZWFkeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGl0ZW0udHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImltYWdlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5vYmplY3Qub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmlzUmVhZHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzb3VuZFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ub2JqZWN0Lm9uY2FucGxheXRocm91Z2ggPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uaXNSZWFkeSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCB0ID0gc2V0SW50ZXJ2YWwoKCk9PntcclxuICAgICAgICAgICAgbGV0IGlzUmVhZHkgPSBPYmplY3QudmFsdWVzKHRoaXMucmVzb3VyY2VzKS5ldmVyeShpdGVtPT57XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5pc1JlYWR5XHJcbiAgICAgICAgICAgICAgICAgICAgJiYgKCBpdGVtLm9iamVjdC5jb21wbGV0ZSAhPSAwIHx8ICBpdGVtLm9iamVjdC5uYXR1cmFsSGVpZ2h0ICE9IDApXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgaXRlbS5vYmplY3Qud2lkdGggIT0gMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYoaXNSZWFkeSl7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuZ28oKTtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHQpO1xyXG4gICAgICAgICAgICAgICAgfSwgMjU1KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pOyBcclxuICAgIH1cclxufVxyXG4iLCJcclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKXtcclxuICAgIGxldCByZXNvdXJjZXMgPSB7XHJcbiAgICAgICAgc2hpcEltYWdlOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2VcIixcclxuICAgICAgICAgICAgb2JqZWN0OiBuZXcgSW1hZ2UoKSxcclxuICAgICAgICAgICAgc3JjOiBcImltYWdlcy9zaGlwLnBuZ1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW5lbXlFYXN5SW1hZ2U6IHtcclxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZVwiLFxyXG4gICAgICAgICAgICBvYmplY3Q6IG5ldyBJbWFnZSgpLFxyXG4gICAgICAgICAgICBzcmM6IFwiaW1hZ2VzL2VuZW15X2Vhc3lfc2hpcC5wbmdcIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZpcmVJbWFnZToge1xyXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlXCIsXHJcbiAgICAgICAgICAgIG9iamVjdDogbmV3IEltYWdlKCksXHJcbiAgICAgICAgICAgIHNyYzogXCJpbWFnZXMvc2hvb3RfbGFzZXIucG5nXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZpcmVTb3VuZDoge1xyXG4gICAgICAgICAgICB0eXBlOiBcInNvdW5kXCIsXHJcbiAgICAgICAgICAgIG9iamVjdDogbmV3IEF1ZGlvLFxyXG4gICAgICAgICAgICBzcmM6IFwic291bmRzL3NoaXBfb3duX2xhc2VyLm1wM1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwbGFuZXRJbWFnZToge1xyXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlXCIsXHJcbiAgICAgICAgICAgIG9iamVjdDogbmV3IEltYWdlKCksXHJcbiAgICAgICAgICAgIHNyYzogXCJpbWFnZXMvcGxhbmV0LnBuZ1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYmdJbWFnZToge1xyXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlXCIsXHJcbiAgICAgICAgICAgIG9iamVjdDogbmV3IEltYWdlKCksXHJcbiAgICAgICAgICAgIHNyYzogXCJpbWFnZXMvYmcyLmpwZ1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBib29tSW1hZ2U6IHtcclxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZVwiLFxyXG4gICAgICAgICAgICBvYmplY3Q6IG5ldyBJbWFnZSgpLFxyXG4gICAgICAgICAgICBzcmM6IFwiaW1hZ2VzL2Jvb20ucG5nXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBib29tRW5lbXlTb3VuZDoge1xyXG4gICAgICAgICAgICB0eXBlOiBcInNvdW5kXCIsXHJcbiAgICAgICAgICAgIG9iamVjdDogbmV3IEF1ZGlvKCksXHJcbiAgICAgICAgICAgIHNyYzogXCJzb3VuZHMvZW5lbXlfYm9vbS5tcDNcIixcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgT2JqZWN0LnZhbHVlcyhyZXNvdXJjZXMpLmZvckVhY2goKG9iaik9PntcclxuICAgICAgICBvYmoub2JqZWN0LnNyYyA9IG9iai5zcmM7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcmVzb3VyY2VzO1xyXG59OyIsIlxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2hvd0ZwcyggZnBzVmFsdWUgKSB7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZnBzJykuaW5uZXJIVE1MID0gYEZQUzogJHtmcHNWYWx1ZX1gO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiIsImltcG9ydCBFbmVteSBmcm9tICcuL0dhbWVDb21wb25lbnRzSW5pdC9FbmVteSdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIHJhbmRvbUZsb2F0OiBmdW5jdGlvbihtaW4sbWF4KXtcclxuICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluO1xyXG4gICAgfSxcclxuICAgIHJhbmRvbUludDogZnVuY3Rpb24obWluLG1heCl7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pKSArIG1pbjtcclxuICAgIH0sXHJcbiAgICBjaGVja0NvbGxpc2lvblJlY3RhbmdsZXM6IGZ1bmN0aW9uKCBvYmpBLCBvYmpCLCBmcm9tICl7XHJcbiAgICAgICAgLy8gaXQncyBuZWVkIGZvciBvbmUgdHlwZSBvZiBvYmplY3Qgc3RydWN0dXJlOiBcclxuICAgICAgICAvLyBtdXN0IHRvIHVzZSBvYmoucG9zaXRpb24gPSB7eDogdmFsdWUsIHk6IHZhbHVlfSAmJiAoIG9iai53aWR0aCAmJiBvYmouaGVpZ2h0IClcclxuICAgICAgICBcclxuICAgICAgICBsZXQgeyB4OmF4ICwgeTpheSB9ID0gb2JqQS5wb3NpdGlvbjtcclxuICAgICAgICBsZXQgeyB4OmJ4ICwgeTpieSB9ID0gb2JqQi5wb3NpdGlvbjtcclxuICAgICAgICBsZXQgeyB3aWR0aDphdyAsIGhlaWdodDphaCB9ID0gb2JqQTtcclxuICAgICAgICBsZXQgeyB3aWR0aDpidyAsIGhlaWdodDpiaCB9ID0gb2JqQjtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgYXhMZWZ0ICAgPSBheCAtIGF3LzI7XHJcbiAgICAgICAgbGV0IGF4UmlnaHQgID0gYXggKyBhdy8yO1xyXG4gICAgICAgIGxldCBheVRvcCAgICA9IGF5IC0gYWgvMjtcclxuICAgICAgICBsZXQgYXlCb3R0b20gPSBheSArIGFoLzI7XHJcblxyXG4gICAgICAgIGxldCBieExlZnQgICA9IGJ4IC0gYncvMjtcclxuICAgICAgICBsZXQgYnhSaWdodCAgPSBieCArIGJ3LzI7XHJcbiAgICAgICAgbGV0IGJ5VG9wICAgID0gYnkgLSBiaC8yO1xyXG4gICAgICAgIGxldCBieUJvdHRvbSA9IGJ5ICsgYmgvMjtcclxuXHJcbiAgICAgICAgLy8gZm9yIGNvbGxpc2lvbiBvZiAyIHJlY3RhbmdsZXMgbmVlZCA0IGNvbmRpdGlvbnM6XHJcbiAgICAgICAgLy8gMSkgYXhSaWdodCAgPiBieExlZnQgICAgIDogcmlnaHQgc2lkZSBYIGNvb3JkaW5hdGUgb2YgMS1zdCByZWN0IG1vcmUgdGhhbiBsZWZ0IHNpemUgWCBjb29yZGluYXRlIDItbmRcclxuICAgICAgICAvLyAyKSBheExlZnQgICA8IGJ4UmlnaHQgICAgOiAuLi5cclxuICAgICAgICAvLyAzKSBheUJvdHRvbSA+IGJ5VG9wICAgICAgXHJcbiAgICAgICAgLy8gNCkgYXlUb3AgICAgPCBieUJvdHRvbVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIGF4UmlnaHQgID4gYnhMZWZ0ICAgJiZcclxuICAgICAgICAgICAgYXhMZWZ0ICAgPCBieFJpZ2h0ICAmJlxyXG4gICAgICAgICAgICBheUJvdHRvbSA+IGJ5VG9wICAgICYmXHJcbiAgICAgICAgICAgIGF5VG9wICAgIDwgYnlCb3R0b20gPyB0cnVlIDogZmFsc2VcclxuICAgICAgICApO1xyXG4gICAgfSxcclxuXHJcblxyXG5cclxufTsiLCJpbXBvcnQgc2hvd0ZwcyBmcm9tICcuL2RldkZucyc7XHJcblxyXG5cclxuLy8gaXQgd2lsbCBuZXdlciBiZSAncHJvZCdcclxuY29uc3QgZ2FtZU1vZGUgPSAnZGV2JztcclxuXHJcbmxldCBvYmogPSB7XHJcbiAgICBtYXhGcmFtZXNJblNlY29uZDogNjAsXHJcbiAgICBtb3VzZToge1xyXG4gICAgICAgIHg6IDAsXHJcbiAgICAgICAgeTogMCxcclxuICAgICAgICBtb3VzZURvd246IHtcclxuICAgICAgICAgICAgdmFsdWU6IGZhbHNlLFxyXG4gICAgICAgICAgICBldmVudDogbnVsbCxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIGRlZmF1bHRMaWZlczogNCxcclxuICAgIGJvb21TcHJpdGVzQ291bnQ6IDgsXHJcbiAgICBkYXRhQ2FudmFzIDoge1xyXG4gICAgICAgIC8vIGl0ZXJhdGlvbiBvZiBmcmFtZXMgaW4gZWFjaCBzZWNvbmQgXHJcbiAgICAgICAgLy8gZnJvbSBlYWNoIG5ldyBzZWNvbmQgd2lsbCA9IDBcclxuICAgICAgICBmcHNJblNlY29uZE5vdzogMCwgXHJcblxyXG4gICAgICAgIC8vIG1heCBmcmFtZXMgY291bnQgb24gZWFjaCBzZWNvbmRcclxuICAgICAgICBfZnBzOjAsXHJcbiAgICAgICAgc2V0IGZwcyh2YWx1ZSl7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZwcyA9IHZhbHVlO1xyXG4gICAgICAgICAgICBnYW1lTW9kZSA9PSAnZGV2JyA/IHNob3dGcHModmFsdWUpIDogJyc7IFxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZnBzO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0IGZwcygpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZnBzO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gYWxsIGZyYW1lcyBmcm9tIHN0YXJ0IGRyYXdpbmdcclxuICAgICAgICAvLyB3aWxsIHVzZWQgbGlrZSB0aW1lIGNvdW50ZXJcclxuICAgICAgICBmcmFtZXNBbGw6IDAsIFxyXG4gICAgfSxcclxuICAgIHNvdW5kOiB7XHJcbiAgICAgICAgZW5hYmxlOiB0cnVlLFxyXG4gICAgfVxyXG59XHJcblxyXG4vLyB3aW5kb3cub2JqICA9IG9iajtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZXZlbnQpPT57XHJcbiAgICBsZXQgZSA9IGV2ZW50IHx8IHdpbmRvdy5ldmVudDtcclxuICAgIG9iai5tb3VzZS54ID0gZS54O1xyXG4gICAgb2JqLm1vdXNlLnkgPSBlLnk7XHJcbn0pO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIChldmVudCk9PntcclxuXHJcbiAgICBsZXQgZSA9IGV2ZW50IHx8IHdpbmRvdy5ldmVudDtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIG9iai5tb3VzZS5tb3VzZURvd24udmFsdWUgPSB0cnVlO1xyXG4gICAgb2JqLm1vdXNlLm1vdXNlRG93bi5ldmVudCA9IGU7XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBsaXN0ZW5lckZvck1vdXNlVXApO1xyXG4gICAgZnVuY3Rpb24gbGlzdGVuZXJGb3JNb3VzZVVwICgpIHtcclxuICAgICAgICBvYmoubW91c2UubW91c2VEb3duLnZhbHVlID0gZmFsc2U7XHJcbiAgICAgICAgb2JqLm1vdXNlLm1vdXNlRG93bi5ldmVudCA9IG51bGw7XHJcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBsaXN0ZW5lckZvck1vdXNlVXApO1xyXG4gICAgfTtcclxuXHJcbn0pXHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBvYmo7IiwiXHJcbmltcG9ydCBDYW52YXNHYW1lIGZyb20gJy4vQ2FudmFzR2FtZSc7XHJcbmltcG9ydCBHYW1lQ29tcG9uZW50c0luaXQgZnJvbSAnLi9HYW1lQ29tcG9uZW50c0luaXQvaW5kZXguanMnO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKT0+e1xyXG4gICAgbGV0IGNhbnZhc0dhbWUgPSBuZXcgQ2FudmFzR2FtZSggZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhbnZhc19fY3R4JykgKTtcclxuICAgIG5ldyBHYW1lQ29tcG9uZW50c0luaXQoIGNhbnZhc0dhbWUgKTtcclxufSk7XHJcblxyXG5cclxuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICYmIHR5cGVvZiBhcmcuY29weSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcuZmlsbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xufSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cbiJdfQ==
