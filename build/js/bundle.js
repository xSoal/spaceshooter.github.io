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

        self = this;
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
            canMove: true,
            _shieldEnable: false,
            get shieldEnable() {
                return this._shieldEnable;
            },
            set shieldEnable(value) {
                value ? self.shieldEnable() : this._shieldEnable = false;
            }
        };
        this.disableMoveTime = 2500;

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
                if (!_this.ship.canMove) return;
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

            this.lifeShift();
        }
    }, {
        key: 'lifeShift',
        value: function lifeShift() {

            this.moveStoppedAndSetStartPosition();
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
    }, {
        key: 'moveStoppedAndSetStartPosition',
        value: function moveStoppedAndSetStartPosition() {
            var _this3 = this;

            this.ship.canMove = false;
            // move ship to start

            this.ship.position.x = window.innerWidth / 2;
            this.ship.position.y = window.innerHeight - 150;

            setTimeout(function () {
                _this3.ship.canMove = true;
            }, this.disableMoveTime);
        }
    }, {
        key: 'shieldEnable',
        value: function shieldEnable() {
            var _this4 = this;

            var frameCounterForEnable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 60 * 2;


            this.ship.canTouch = false;
            this.shieldDrawId = this.canvas.addHandlerToDraw(function (ctx) {
                ctx.strokeStyle = "white";
                ctx.beginPath();
                ctx.arc(_this4.ship.position.x, _this4.ship.position.y, _this4.ship.height > _this4.ship.width ? _this4.ship.height + 1 : _this4.ship.width + 1, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.closePath();
            });

            var framesCountWhenShieldStart = _gameConf2.default.dataCanvas.framesAll;
            var loopId = this.canvas.addActionHandler(function (gameConf) {
                if (_this4.gameConf.dataCanvas.framesAll - framesCountWhenShieldStart > frameCounterForEnable) {
                    _this4.canvas.removeHandlerToDraw(_this4.shieldDrawId);
                    _this4.canvas.removeActionHandler(loopId);
                    _this4.ship.shieldEnable = false;
                    _this4.ship.canTouch = true;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvQ2FudmFzR2FtZS5qcyIsImFwcC9qcy9HYW1lQ29tcG9uZW50c0luaXQvQmcuanMiLCJhcHAvanMvR2FtZUNvbXBvbmVudHNJbml0L0Jvb20uanMiLCJhcHAvanMvR2FtZUNvbXBvbmVudHNJbml0L0NvbGxpc2lvbnMuanMiLCJhcHAvanMvR2FtZUNvbXBvbmVudHNJbml0L0VuZW15LmpzIiwiYXBwL2pzL0dhbWVDb21wb25lbnRzSW5pdC9GaXJlLmpzIiwiYXBwL2pzL0dhbWVDb21wb25lbnRzSW5pdC9TaGlwLmpzIiwiYXBwL2pzL0dhbWVDb21wb25lbnRzSW5pdC9pbmRleC5qcyIsImFwcC9qcy9HYW1lQ29tcG9uZW50c0luaXQvcmVzb3VyY2VzLmpzIiwiYXBwL2pzL2RldkZucy5qcyIsImFwcC9qcy9mbnMuanMiLCJhcHAvanMvZ2FtZUNvbmYuanMiLCJhcHAvanMvbWFpbi5qcyIsIm5vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDQ0E7Ozs7Ozs7O0lBRXFCLFU7QUFDakIsd0JBQVksVUFBWixFQUF1QjtBQUFBOztBQUNuQixhQUFLLFNBQUwsR0FBaUIsSUFBakI7O0FBRUEsYUFBSyxNQUFMLEdBQWMsVUFBZDtBQUNBLGFBQUssR0FBTCxHQUFjLEtBQUssTUFBTCxDQUFZLFVBQVosQ0FBdUIsSUFBdkIsQ0FBZDs7QUFFQSxhQUFLLEtBQUwsR0FBYyxTQUFTLGVBQVQsQ0FBeUIsV0FBdkM7QUFDQSxhQUFLLE1BQUwsR0FBYyxTQUFTLGVBQVQsQ0FBeUIsWUFBdkM7O0FBRUEs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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXHJcbmltcG9ydCBnYW1lQ29uZiBmcm9tICcuL2dhbWVDb25mJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhc0dhbWV7XHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXNOb2RlKXtcclxuICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXNOb2RlO1xyXG4gICAgICAgIHRoaXMuY3R4ICAgID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgICAgICAgdGhpcy53aWR0aCAgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xyXG5cclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9ICB0aGlzLndpZHRoO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xyXG5cclxuICAgICAgICB0aGlzLmRhdGFDYW52YXMgPSBnYW1lQ29uZi5kYXRhQ2FudmFzO1xyXG5cclxuICAgICAgICB0aGlzLmlkRm9ySGFuZGxlcnMgICA9IDA7XHJcbiAgICAgICAgdGhpcy5kcmF3SGFuZGxlcnMgICAgPSB7fTtcclxuICAgICAgICB0aGlzLmFjdGlvbnNIYW5kbGVycyA9IHt9O1xyXG4gICAgICAgIHRoaXMuZHJhd0hhbmRsZXJzSW5TdG9wcGVkTW9kZSA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmxvb3AoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZHJhd0FsbCgpe1xyXG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLmRyYXdIYW5kbGVycykuZm9yRWFjaCgoIGl0ZW1GbiApPT57XHJcbiAgICAgICAgICAgIGlmKCBpdGVtRm4gIT0gdW5kZWZpbmVkICl7XHJcbiAgICAgICAgICAgICAgICBpdGVtRm4oIHRoaXMuY3R4ICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmRhdGFDYW52YXMuZnJhbWVzQWxsKys7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tBY3Rpb25zQWxsKCl7XHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLmFjdGlvbnNIYW5kbGVycykuZm9yRWFjaCgoIGl0ZW1GbiApPT57XHJcbiAgICAgICAgICAgIGlmKCBpdGVtRm4gIT0gdW5kZWZpbmVkICl7XHJcbiAgICAgICAgICAgICAgICBpdGVtRm4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEFjdGlvbkhhbmRsZXIoIGFjdGlvbkhhbmRsZXJGbiApe1xyXG4gICAgICAgIGxldCBpZCA9ICsrdGhpcy5pZEZvckhhbmRsZXJzO1xyXG4gICAgICAgIHRoaXMuYWN0aW9uc0hhbmRsZXJzW2lkXSA9IGFjdGlvbkhhbmRsZXJGbjtcclxuICAgICAgICByZXR1cm4gaWQ7ICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUFjdGlvbkhhbmRsZXIoIGlkT2ZIYW5kbGVyICl7XHJcbiAgICAgICAgaWYoIXRoaXMuYWN0aW9uc0hhbmRsZXJzW2lkT2ZIYW5kbGVyXSkgcmV0dXJuO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmFjdGlvbnNIYW5kbGVyc1tpZE9mSGFuZGxlcl07XHJcbiAgICB9XHJcblxyXG4gICAgYWRkSGFuZGxlclRvRHJhdyggZHJhd0hhbmRsZXJGbiApe1xyXG4gICAgICAgIGxldCBpZCA9ICsrdGhpcy5pZEZvckhhbmRsZXJzO1xyXG4gICAgICAgIHRoaXMuZHJhd0hhbmRsZXJzW2lkXSA9IGRyYXdIYW5kbGVyRm47XHJcbiAgICAgICAgcmV0dXJuIGlkO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUhhbmRsZXJUb0RyYXcoIGlkT2ZIYW5kbGVyICkge1xyXG4gICAgICAgIGlmKCF0aGlzLmRyYXdIYW5kbGVyc1tpZE9mSGFuZGxlcl0pIHJldHVybjtcclxuICAgICAgICBkZWxldGUgdGhpcy5kcmF3SGFuZGxlcnNbaWRPZkhhbmRsZXJdO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXdBbGxJblN0b3BwZWRNb2RlKCl7XHJcbiAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuZHJhd0hhbmRsZXJzSW5TdG9wcGVkTW9kZSkuZm9yRWFjaCgoIGl0ZW1GbiApPT57XHJcbiAgICAgICAgICAgIGlmKCBpdGVtRm4gIT0gdW5kZWZpbmVkICl7XHJcbiAgICAgICAgICAgICAgICBpdGVtRm4oIHRoaXMuY3R4ICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmRhdGFDYW52YXMuZnJhbWVzQWxsKys7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkSGFuZGxlclRvRHJhd0luU3RvcHBlZE1vZGUoIGRyYXdIYW5kbGVyRm4gKXtcclxuICAgICAgICBsZXQgaWQgPSArK3RoaXMuaWRGb3JIYW5kbGVycztcclxuICAgICAgICB0aGlzLmRyYXdIYW5kbGVyc0luU3RvcHBlZE1vZGVbaWRdID0gZHJhd0hhbmRsZXJGbjtcclxuICAgICAgICByZXR1cm4gaWQ7XHJcbiAgICB9XHJcbiAgICByZW1vdmVIYW5kbGVyVG9EcmF3SW5TdG9wcGVkTW9kZSggaWRPZkhhbmRsZXIgKXtcclxuICAgICAgICBpZighdGhpcy5kcmF3SGFuZGxlcnNJblN0b3BwZWRNb2RlW2lkT2ZIYW5kbGVyXSkgcmV0dXJuO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmRyYXdIYW5kbGVyc0luU3RvcHBlZE1vZGVbaWRPZkhhbmRsZXJdOyBcclxuICAgIH1cclxuXHJcbiAgICBnbygpe1xyXG4gICAgICAgIHRoaXMuaXNTdG9wcGVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgc3RvcCgpe1xyXG4gICAgICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBsb29wKCl7XHJcbiAgICAgICAgbGV0IGxhc3RGdWxsU2Vjb25kcyAgID0gcGVyZm9ybWFuY2Uubm93KCkgPCAxMDAwID8gMCA6IHBhcnNlSW50KCBwZXJmb3JtYW5jZS5ub3coKSAvIDEwMDAgKTtcclxuICAgICAgICBsZXQgbGFzdFRpbWVJdGVyYXRpb24gPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICBsZXQgbG9vcCA9ICgpID0+IHtcclxuICAgICAgICAgICAgLy8gaXQgbXVzdCBjaGVjayBmb3IgbWF4IGZwcyBhbmQgZG8gbm90IGRyYXcgY2FudmFzIGlmIGl0J3MgdG9vIGZhc3QsXHJcbiAgICAgICAgICAgIC8vIGJlY2F1c2UgdGhlIGdhbWUgZHJhd2luZyBpcyBvcmllbnRlZCBub3QgZm9yIHRpbWUgYW5kIGZwcyB0b2dldGhlclxyXG4gICAgICAgICAgICAvLyBidXQgb25seSBmb3IgZnBzICggd2l0aG91dCBzaXR1YXRpb24gd2l0aCBzcHJpdGVzIClcclxuICAgICAgICAgICAgaWYoICF0aGlzLmlzU3RvcHBlZFxyXG4gICAgICAgICAgICAgICAgJiYgKHBlcmZvcm1hbmNlLm5vdygpIC0gbGFzdFRpbWVJdGVyYXRpb24pID4gKDEwMDAgLyBnYW1lQ29uZi5tYXhGcmFtZXNJblNlY29uZCkgKXtcclxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGZvciBmcHNcclxuICAgICAgICAgICAgICAgIGxldCBub3dGdWxsU2Vjb25kcyA9IHBlcmZvcm1hbmNlLm5vdygpIDwgMTAwMCA/IDAgOiBwYXJzZUludCggcGVyZm9ybWFuY2Uubm93KCkgLyAxMDAwICk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoIGxhc3RGdWxsU2Vjb25kcyA8IG5vd0Z1bGxTZWNvbmRzICl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhQ2FudmFzLmZwcyA9IHRoaXMuZGF0YUNhbnZhcy5mcHNJblNlY29uZE5vdztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFDYW52YXMuZnBzSW5TZWNvbmROb3cgPSAwXHJcbiAgICAgICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhQ2FudmFzLmZwc0luU2Vjb25kTm93Kys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxhc3RGdWxsU2Vjb25kcyA9IG5vd0Z1bGxTZWNvbmRzO1xyXG5cclxuICAgICAgICAgICAgICAgIGxhc3RUaW1lSXRlcmF0aW9uICA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tBY3Rpb25zQWxsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdBbGwoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9IGVsc2UgaWYoIHBlcmZvcm1hbmNlLm5vdygpIC0gbGFzdFRpbWVJdGVyYXRpb24gPiAxMDAwIC8gZ2FtZUNvbmYubWF4RnJhbWVzSW5TZWNvbmQgKXtcclxuICAgICAgICAgICAgICAgIC8vIGNhbGwgdG8gZHJhd2luZyBwcmVsb2FkaW5ncyBhbmQgZWxzZSB0aGF0IG5vdCBuZWVkIHRvIGF3YWl0XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdBbGxJblN0b3BwZWRNb2RlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSggbG9vcCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBsb29wICk7XHJcbiAgICB9XHJcblxyXG59IiwiXHJcbmltcG9ydCBnYW1lQ29uZiBmcm9tICcuLi9nYW1lQ29uZic7XHJcbmltcG9ydCBmbnMgZnJvbSAnLi4vZm5zLmpzJztcclxuaW1wb3J0IHJlc291cmNlcyBmcm9tICcuL3Jlc291cmNlcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCZyB7XHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXMsIGdhbWVPYmplY3RzLCByZXNvdXJjZXMpe1xyXG4gICAgICAgIHRoaXMuY2FudmFzICAgICAgPSBjYW52YXM7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0cyA9IGdhbWVPYmplY3RzO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2VzICAgPSByZXNvdXJjZXM7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhcnNCZ0RyYXdIYW5kbGVyID0gY2FudmFzLmFkZEhhbmRsZXJUb0RyYXcoKGN0eCk9PntcclxuICAgICAgICAgICAgdGhpcy5kcmF3QmcoY3R4KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5wbGFuZXREcmF3SGFuZGxlciA9IGNhbnZhcy5hZGRIYW5kbGVyVG9EcmF3KGN0eD0+e1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdQbGFuZXQoY3R4KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFyc0xvb3BBY3Rpb25zID0gY2FudmFzLmFkZEFjdGlvbkhhbmRsZXIoKCk9PntcclxuICAgICAgICAgICAgdGhpcy5sb29wKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5pbWFnZSAgPSByZXNvdXJjZXMuYmdJbWFnZS5vYmplY3Q7XHJcbiAgICAgICAgdGhpcy5wbGFuZXQgPSByZXNvdXJjZXMucGxhbmV0SW1hZ2Uub2JqZWN0O1xyXG5cclxuICAgICAgICB0aGlzLnBsYW5ldERlZ3JlZSA9IDA7XHJcbiAgICAgICAgdGhpcy5wb3MgPSB7XHJcbiAgICAgICAgICAgIHkxOiBudWxsLFxyXG4gICAgICAgICAgICB5MjogbnVsbCxcclxuICAgICAgICAgICAgeTM6IG51bGwsXHJcbiAgICAgICAgICAgIHNsaWRlczogMyxcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgZHJhd0JnKCBjdHggKXtcclxuICAgICAgICBpZiggdGhpcy5pbWFnZS53aWR0aCA9PSAwICkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKCB0aGlzLnBvcy55MSA9PT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLnBvcy55MSA9IC10aGlzLmltYWdlLmhlaWdodCArIHRoaXMuY2FudmFzLmhlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIHRoaXMucG9zLnkyID09PSBudWxsICl7XHJcbiAgICAgICAgICAgIHRoaXMucG9zLnkyID0gLXRoaXMuaW1hZ2UuaGVpZ2h0ICogMiAgKyB0aGlzLmNhbnZhcy5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0aGlzLnBvcy55MyA9PT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLnBvcy55MyA9IC10aGlzLmltYWdlLmhlaWdodCAqIDMgICsgdGhpcy5jYW52YXMuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNwZWVkID0gMS41O1xyXG4gICAgICAgIGxldCB5UG9zMSA9IHRoaXMucG9zLnkxO1xyXG4gICAgICAgIGxldCB5UG9zMiA9IHRoaXMucG9zLnkyO1xyXG4gICAgICAgIGxldCB5UG9zMyA9IHRoaXMucG9zLnkzO1xyXG5cclxuICAgICAgICBjdHguZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLmhlaWdodCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgeVBvczEsXHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLmhlaWdodCxcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2Uud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UuaGVpZ2h0LFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB5UG9zMixcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UuaGVpZ2h0LFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZShcclxuICAgICAgICAgICAgdGhpcy5pbWFnZSxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS5oZWlnaHQsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHlQb3MzLFxyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS5oZWlnaHQsXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICBcclxuICAgICAgICAvLyBzZWUgZW5kIG9mIGZpcnN0IHNjcmVlbiBpbWFnZVxyXG4gICAgICAgIGlmKCB0aGlzLnBvcy55MSA+PSAwICsgdGhpcy5jYW52YXMuaGVpZ2h0ICYmIHRoaXMucG9zLnNsaWRlcyAlIDMgPT09IDApe1xyXG4gICAgICAgICAgICB0aGlzLnBvcy5zbGlkZXMrK1xyXG4gICAgICAgICAgICB0aGlzLnBvcy55MSA9IHRoaXMucG9zLnkzIC0gdGhpcy5pbWFnZS5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKCB0aGlzLnBvcy55MiA+PSAwICsgdGhpcy5jYW52YXMuaGVpZ2h0ICYmIHRoaXMucG9zLnNsaWRlcyAlIDMgPT09IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3Muc2xpZGVzKytcclxuICAgICAgICAgICAgdGhpcy5wb3MueTIgPSB0aGlzLnBvcy55MSAtIHRoaXMuaW1hZ2UuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIHRoaXMucG9zLnkzID49IDAgKyB0aGlzLmNhbnZhcy5oZWlnaHQgJiYgdGhpcy5wb3Muc2xpZGVzICUgMyA9PT0gMikge1xyXG4gICAgICAgICAgICB0aGlzLnBvcy5zbGlkZXMrK1xyXG4gICAgICAgICAgICB0aGlzLnBvcy55MyA9IHRoaXMucG9zLnkyIC0gdGhpcy5pbWFnZS5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB5UG9zMSA9IHRoaXMucG9zLnkxICs9IHNwZWVkO1xyXG4gICAgICAgIHlQb3MyID0gdGhpcy5wb3MueTIgKz0gc3BlZWQ7IFxyXG4gICAgICAgIHlQb3MzID0gdGhpcy5wb3MueTMgKz0gc3BlZWQ7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBkcmF3UGxhbmV0KCBjdHggKXtcclxuICAgICAgICBpZih0aGlzLnBsYW5ldC53aWR0aCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGxldCBpbWFnZSA9IHRoaXMucGxhbmV0O1xyXG5cclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC50cmFuc2xhdGUoLXRoaXMuY2FudmFzLndpZHRoLzIgKyBpbWFnZS53aWR0aCAvIDIsIHRoaXMuY2FudmFzLmhlaWdodC8yICsgaW1hZ2UuaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgY3R4LnJvdGF0ZSggdGhpcy5wbGFuZXREZWdyZWUgKz0gMC4wMDA3NSApO1xyXG4gICAgICAgIGN0eC50cmFuc2xhdGUoLSgtdGhpcy5jYW52YXMud2lkdGgvMiArIGltYWdlLndpZHRoIC8gMiksIC0odGhpcy5jYW52YXMuaGVpZ2h0LzIgKyBpbWFnZS5oZWlnaHQgLyAyKSk7XHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZShcclxuICAgICAgICAgICAgaW1hZ2UsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIGltYWdlLndpZHRoLFxyXG4gICAgICAgICAgICBpbWFnZS5oZWlnaHQsXHJcbiAgICAgICAgICAgIC10aGlzLmNhbnZhcy53aWR0aC8yLFxyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQvMixcclxuICAgICAgICAgICAgaW1hZ2Uud2lkdGgsXHJcbiAgICAgICAgICAgIGltYWdlLmhlaWdodFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBsb29wKCl7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn0iLCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvb217XHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXMsIGdhbWVPYmplY3QsIHJlc291cmNlcywgY29vcmRpbmF0ZSwgZW5lbXkpe1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xyXG5cclxuICAgICAgICB0aGlzLmJvb20gPSB7XHJcbiAgICAgICAgICAgIGlzRGVzdHJveVN0YXJ0OiBmYWxzZSxcclxuICAgICAgICAgICAgY291bnRlcjogMCxcclxuICAgICAgICAgICAgaW1hZ2U6IHJlc291cmNlcy5ib29tSW1hZ2Uub2JqZWN0LFxyXG4gICAgICAgICAgICB3aWR0aDogNjQsXHJcbiAgICAgICAgICAgIGhlaWdodDogNjQsXHJcbiAgICAgICAgICAgIHNwcml0ZVNpemU6IHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiA1MTIsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDY0LFxyXG4gICAgICAgICAgICAgICAgc3ByaXRlc0NvdW50OiA4LFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvb3JkaW5hdGUgPSBjb29yZGluYXRlO1xyXG5cclxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRIYW5kbGVyVG9EcmF3KChjdHgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0Jvb20oY3R4KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGRyYXdCb29tKGN0eCl7XHJcbiAgICAgICAgbGV0IHhTcHJpdGVQb3NpdGlvbiA9ICsrdGhpcy5ib29tLmNvdW50ZXI7XHJcblxyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgICAgIHRoaXMuYm9vbS5pbWFnZSxcclxuICAgICAgICAgICAgeFNwcml0ZVBvc2l0aW9uICogdGhpcy5ib29tLndpZHRoLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB0aGlzLmJvb20ud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMuYm9vbS5oZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZS54IC0gdGhpcy5ib29tLndpZHRoLzIsXHJcbiAgICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZS55IC0gdGhpcy5ib29tLmhlaWdodC8yLFxyXG4gICAgICAgICAgICB0aGlzLmJvb20ud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMuYm9vbS5oZWlnaHQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gXCJ1dGlsXCI7XHJcbmltcG9ydCBmbnMgZnJvbSAnLi4vZm5zJztcclxuaW1wb3J0IGdhbWVDb25mIGZyb20gXCIuLi9nYW1lQ29uZlwiO1xyXG5pbXBvcnQgQm9vbSBmcm9tICcuL0Jvb20nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29sbGlzaW9ucyB7XHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXMsIGdhbWVPYmplY3RzLCByZXNvdXJjZXMsIHNoaXApe1xyXG4gICAgICAgIHRoaXMuY2FudmFzICAgICAgPSBjYW52YXM7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0cyA9IGdhbWVPYmplY3RzO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2VzICAgPSByZXNvdXJjZXM7XHJcbiAgICAgICAgdGhpcy5zaGlwICAgICAgICA9IHNoaXA7XHJcblxyXG4gICAgICAgIHRoaXMuYWN0aW9uTG9vcEhhbmRsZXJJZCA9IHRoaXMuY2FudmFzLmFkZEFjdGlvbkhhbmRsZXIoKCk9PntcclxuICAgICAgICAgICAgdGhpcy5sb29wKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9vcCgpe1xyXG4gICAgICAgIGlmKHRoaXMuY2FudmFzLmlzU3RvcHBlZCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLmNoZWNrQ29sbGlzaW9uc0ZpcmVzQW5kRW5lbWllcygpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tDb2xsaXNpb25zU2hpcEFuZEVuZW1pZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0NvbGxpc2lvbnNGaXJlc0FuZEVuZW1pZXMoKXtcclxuICAgICAgICBsZXQgZmlyZXMgICAgICA9IHRoaXMuZ2FtZU9iamVjdHMuZmlyZXM7XHJcbiAgICAgICAgbGV0IGVuZW15U2hpcHMgPSB0aGlzLmdhbWVPYmplY3RzLmVuZW15U2hpcHM7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXMoZmlyZXMpLmZvckVhY2goZmlyZT0+e1xyXG4gICAgICAgICAgICBPYmplY3QudmFsdWVzKGVuZW15U2hpcHMpLmZvckVhY2goZW5lbXk9PntcclxuICAgICAgICAgICAgICAgIGlmKGZucy5jaGVja0NvbGxpc2lvblJlY3RhbmdsZXMoZW5lbXkuc2hpcCxmaXJlLmZpcmUpKXtcclxuICAgICAgICAgICAgICAgICAgICBmaXJlLmRlbGV0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVuZW15LnN0YXJ0RGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBCb29tKHRoaXMuY2FudmFzLCB0aGlzLmdhbWVPYmplY3RzLCB0aGlzLnJlc291cmNlcywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiBmaXJlLmZpcmUucG9zaXRpb24ueCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeTogZmlyZS5maXJlLnBvc2l0aW9uLnksXHJcbiAgICAgICAgICAgICAgICAgICAgfSxlbmVteSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrQ29sbGlzaW9uc1NoaXBBbmRFbmVtaWVzKCl7XHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLmdhbWVPYmplY3RzLmVuZW15U2hpcHMpLmZvckVhY2goZW5lbXk9PntcclxuICAgICAgICAgICAgaWYoZm5zLmNoZWNrQ29sbGlzaW9uUmVjdGFuZ2xlcyhlbmVteS5zaGlwLCB0aGlzLnNoaXAuc2hpcCwgdHJ1ZSkpe1xyXG4gICAgICAgICAgICAgICAgbmV3IEJvb20odGhpcy5jYW52YXMsIHRoaXMuZ2FtZU9iamVjdHMsIHRoaXMucmVzb3VyY2VzLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgeDogdGhpcy5zaGlwLnNoaXAucG9zaXRpb24ueCxcclxuICAgICAgICAgICAgICAgICAgICB5OiB0aGlzLnNoaXAuc2hpcC5wb3NpdGlvbi55LFxyXG4gICAgICAgICAgICAgICAgfSxlbmVteSk7ICAgICBcclxuICAgICAgICAgICAgICAgIG5ldyBCb29tKHRoaXMuY2FudmFzLCB0aGlzLmdhbWVPYmplY3RzLCB0aGlzLnJlc291cmNlcywge1xyXG4gICAgICAgICAgICAgICAgICAgIHg6IGVuZW15LnNoaXAucG9zaXRpb24ueCxcclxuICAgICAgICAgICAgICAgICAgICB5OiBlbmVteS5zaGlwLnBvc2l0aW9uLnksXHJcbiAgICAgICAgICAgICAgICB9LGVuZW15KTsgXHJcbiAgICAgICAgICAgICAgICBlbmVteS5zdGFydERlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcC5jb2xsaXNpb25XaWR0aEVuZW15KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiXHJcbmltcG9ydCBmbnMgZnJvbSAnLi4vZm5zJztcclxuaW1wb3J0IGdhbWVDb25mIGZyb20gXCIuLi9nYW1lQ29uZlwiO1xyXG5pbXBvcnQgcmVzb3VyY2VzIGZyb20gJy4vcmVzb3VyY2VzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVuZW15e1xyXG4gICAgY29uc3RydWN0b3IoY2FudmFzLCBnYW1lT2JqZWN0cywgcmVzb3VyY2VzLCB0eXBlLCBpZCl7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgICAgICA9IGNhbnZhcztcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3RzID0gZ2FtZU9iamVjdHM7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZXMgICA9IHJlc291cmNlcztcclxuICAgICAgICB0aGlzLmlkICAgICAgICAgID0gaWQ7XHJcblxyXG4gICAgICAgIHRoaXMuc2hpcDtcclxuICAgICAgICB0aGlzLmlzRGVzdHJveVN0YXJ0ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5kZXN0cm95RnJhbWVzICA9IHtcclxuICAgICAgICAgICAgY291bnRlcjogMCxcclxuICAgICAgICAgICAgYWxsOiBnYW1lQ29uZi5ib29tU3ByaXRlc0NvdW50XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVhc3kgPSB7XHJcbiAgICAgICAgICAgIHdpZHRoOiAxNjcsXHJcbiAgICAgICAgICAgIGhlaWdodDogNzUsXHJcbiAgICAgICAgICAgIHNwZWVkOiAxLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgeDogZm5zLnJhbmRvbUludCgxNzAgLCB0aGlzLmNhbnZhcy53aWR0aCksXHJcbiAgICAgICAgICAgICAgICB5OiAtNDAsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGltYWdlOiB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3Q6IHJlc291cmNlcy5lbmVteUVhc3lJbWFnZS5vYmplY3QsXHJcbiAgICAgICAgICAgICAgICBzcHJpdGVTaXplOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDIzNCxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDE1MCxcclxuICAgICAgICAgICAgICAgICAgICBzcHJpdGVQb3NpdGlvbjogMCxcclxuICAgICAgICAgICAgICAgICAgICBzcHJpdGVzQ291bnQ6IDQsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzb3VuZDoge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0OiByZXNvdXJjZXMuYm9vbUVuZW15U291bmQub2JqZWN0XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiZWFzeVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwID0gdGhpcy5lYXN5O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICBcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpe1xyXG5cclxuICAgICAgICB0aGlzLmRyYXdIYW5kbGVyID0gdGhpcy5jYW52YXMuYWRkSGFuZGxlclRvRHJhdygoY3R4KT0+e1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVEcmF3KGN0eCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWN0aW9uTW92ZUhhbmRsZXIgPSB0aGlzLmNhbnZhcy5hZGRBY3Rpb25IYW5kbGVyKCgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuc2hpcC5wb3NpdGlvbi55ICs9IHRoaXMuc2hpcC5zcGVlZDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlRHJhdyggY3R4ICl7XHJcbiAgICAgICAgbGV0IHhTcHJpdGVQb3NpdGlvbiA9XHJcbiAgICAgICAgICAgIHRoaXMuc2hpcC5pbWFnZS5zcHJpdGVTaXplLnNwcml0ZVBvc2l0aW9uIDwgdGhpcy5zaGlwLmltYWdlLnNwcml0ZVNpemUuc3ByaXRlc0NvdW50IC0gMVxyXG4gICAgICAgICAgICA/ICsrdGhpcy5zaGlwLmltYWdlLnNwcml0ZVNpemUuc3ByaXRlUG9zaXRpb25cclxuICAgICAgICAgICAgOiB0aGlzLnNoaXAuaW1hZ2Uuc3ByaXRlU2l6ZS5zcHJpdGVQb3NpdGlvbiA9IDA7XHJcblxyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgICAgIHRoaXMuc2hpcC5pbWFnZS5vYmplY3QsXHJcbiAgICAgICAgICAgIHhTcHJpdGVQb3NpdGlvbiAqIHRoaXMuc2hpcC5pbWFnZS5zcHJpdGVTaXplLndpZHRoLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB0aGlzLnNoaXAuaW1hZ2Uuc3ByaXRlU2l6ZS53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5zaGlwLmltYWdlLnNwcml0ZVNpemUuaGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLnNoaXAucG9zaXRpb24ueCAtIHRoaXMuc2hpcC53aWR0aCAvIDIsXHJcbiAgICAgICAgICAgIHRoaXMuc2hpcC5wb3NpdGlvbi55IC0gdGhpcy5zaGlwLmhlaWdodCAvIDIsXHJcbiAgICAgICAgICAgIHRoaXMuc2hpcC53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5zaGlwLmhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5jaGVja0Zvck91dFNjcmVlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0RGVzdHJveSgpe1xyXG4gICAgICAgIGlmKHRoaXMuaXNEZXN0cm95U3RhcnQpIHJldHVybjtcclxuICAgICAgICB0aGlzLmlzRGVzdHJveVN0YXJ0ID0gdHJ1ZTtcclxuICAgICAgICBjb25zb2xlLmxvZygnZW5lbXkgZGVzdHJveScpXHJcbiAgICAgICAgdGhpcy5wbGF5U291bmREZXN0cm95aW5nKCk7XHJcblxyXG4gICAgICAgIHRoaXMuYWN0aW9uRGVzdHJveUhhbmRsZXIgPSB0aGlzLmNhbnZhcy5hZGRBY3Rpb25IYW5kbGVyKCgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuc2hpcC5zcGVlZCA9IHRoaXMuc2hpcC5zcGVlZCAqIDAuNSArIDE7XHJcbiAgICAgICAgICAgIGlmKCsrdGhpcy5kZXN0cm95RnJhbWVzLmNvdW50ZXIgPj0gdGhpcy5kZXN0cm95RnJhbWVzLmFsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcGxheVNvdW5kRGVzdHJveWluZygpe1xyXG4gICAgICAgIGxldCBzb3VuZERlc3Ryb3lUb1BsYXkgPSBuZXcgQXVkaW8oKTtcclxuICAgICAgICBzb3VuZERlc3Ryb3lUb1BsYXkuc3JjID0gdGhpcy5zaGlwLnNvdW5kLm9iamVjdC5zcmM7XHJcbiAgICAgICAgc291bmREZXN0cm95VG9QbGF5LnBsYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0Zvck91dFNjcmVlbigpe1xyXG4gICAgICAgIGlmKCB0aGlzLnNoaXAucG9zaXRpb24ueSA+IHRoaXMuY2FudmFzLmhlaWdodCApIHtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlKCl7XHJcbiAgICAgICBcclxuICAgICAgICBkZWxldGUgdGhpcy5nYW1lT2JqZWN0cy5lbmVteVNoaXBzW3RoaXMuaWRdO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUFjdGlvbkhhbmRsZXIodGhpcy5hY3Rpb25Nb3ZlSGFuZGxlcik7XHJcbiAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlSGFuZGxlclRvRHJhdyggdGhpcy5kcmF3SGFuZGxlciApO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUhhbmRsZXJUb0RyYXcoIHRoaXMuZHJhd0Rlc3Ryb3lIYW5kbGVyICk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlQWN0aW9uSGFuZGxlciggdGhpcy5hY3Rpb25Nb3ZlSGFuZGxlciApO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUFjdGlvbkhhbmRsZXIoIHRoaXMuYWN0aW9uRGVzdHJveUhhbmRsZXIgKTtcclxuICAgIH1cclxufSIsIlxyXG5pbXBvcnQgZ2FtZUNvbmYgZnJvbSAnLi4vZ2FtZUNvbmYnO1xyXG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAndXRpbCc7XHJcbmltcG9ydCByZXNvdXJjZXMgZnJvbSAnLi9yZXNvdXJjZXMnO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpcmUge1xyXG4gICAgY29uc3RydWN0b3IoIGNhbnZhcywgZ2FtZU9iamVjdHMsIHJlc291cmNlcywgZGF0YU9iaiApe1xyXG4gICAgICAgIHRoaXMuY2FudmFzICAgICAgPSBjYW52YXM7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0cyA9IGdhbWVPYmplY3RzO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2VzICAgPSByZXNvdXJjZXM7XHJcbiAgICAgICAgdGhpcy5maXJlTW92ZUhhbmRsZXJJZDtcclxuXHJcbiAgICAgICAgdGhpcy5maXJlID0ge1xyXG4gICAgICAgICAgICBpZDogZGF0YU9iai5pZCxcclxuICAgICAgICAgICAgd2lkdGg6IDUsXHJcbiAgICAgICAgICAgIGhlaWdodDogMTAsXHJcbiAgICAgICAgICAgIGNvbG9yOiBcIiNGRjAwMDBcIixcclxuICAgICAgICAgICAgc3BlZWQ6IDM3LFxyXG4gICAgICAgICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgeDogZGF0YU9iai5wb3NpdGlvbi54LFxyXG4gICAgICAgICAgICAgICAgeTogZGF0YU9iai5wb3NpdGlvbi55LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzb3VuZDogZGF0YU9iai5zb3VuZCgpLFxyXG4gICAgICAgICAgICBpbWFnZToge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0OiByZXNvdXJjZXMuZmlyZUltYWdlLm9iamVjdCxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAgLy8gdGhpcyBhdHRyIGlzIGRpZmZlcmVudCBmcmllbmRseSBhbmQgbm90IHNob290J3NcclxuICAgICAgICAvLyAtMSA6IGZyaWVuZGx5LCAgMSA6IGlzIG5vdFxyXG4gICAgICAgIHRoaXMuaXNFbmVtaWVzID0gLTE7ICAgICAgIFxyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgICAgIHRoaXMuZmlyZS5zb3VuZC5wbGF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpe1xyXG4gICAgICAgIHRoaXMuZmlyZU1vdmVIYW5kbGVySWQgPSB0aGlzLmNhbnZhcy5hZGRIYW5kbGVyVG9EcmF3KChjdHgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZU1vdmUoY3R4KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmaXJlTW92ZSggY3R4ICl7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZmlyZS5jb2xvcjtcclxuICAgICAgICBsZXQgbmV3WSA9IHRoaXMuZmlyZS5wb3NpdGlvbi55ICs9IHRoaXMuZmlyZS5zcGVlZCAqIHRoaXMuaXNFbmVtaWVzO1xyXG5cclxuICAgICAgICBjdHguZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICB0aGlzLmZpcmUuaW1hZ2Uub2JqZWN0LFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB0aGlzLmZpcmUud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMuZmlyZS5oZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMuZmlyZS5wb3NpdGlvbi54IC0gdGhpcy5maXJlLndpZHRoIC8gMixcclxuICAgICAgICAgICAgdGhpcy5maXJlLnBvc2l0aW9uLnkgLSB0aGlzLmZpcmUuaGVpZ2h0IC8gMixcclxuICAgICAgICAgICAgdGhpcy5maXJlLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmZpcmUuaGVpZ2h0LFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMuY2hlY2tGb3JPdXRTY3JlZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0Zvck91dFNjcmVlbigpe1xyXG4gICAgICAgIGlmKCB0aGlzLmZpcmUucG9zaXRpb24ueSA8IDAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZSgpe1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmdhbWVPYmplY3RzLmZpcmVzW3RoaXMuZmlyZS5pZF07XHJcbiAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlSGFuZGxlclRvRHJhdyggdGhpcy5maXJlTW92ZUhhbmRsZXJJZCApO1xyXG4gICAgfVxyXG59IiwiXHJcbmltcG9ydCBnYW1lQ29uZiBmcm9tICcuLi9nYW1lQ29uZic7XHJcbmltcG9ydCBGaXJlIGZyb20gJy4vRmlyZSc7XHJcbmltcG9ydCByZXNvdXJjZXMgZnJvbSAnLi9yZXNvdXJjZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hpcCB7XHJcbiAgICBjb25zdHJ1Y3RvciggY2FudmFzLCBnYW1lT2JqZWN0cywgcmVzb3VyY2VzICl7XHJcbiAgICAgICAgdGhpcy5nYW1lQ29uZiAgICA9IGdhbWVDb25mOyBcclxuICAgICAgICB0aGlzLmNhbnZhcyAgICAgID0gY2FudmFzO1xyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdHMgPSBnYW1lT2JqZWN0cztcclxuICAgICAgICB0aGlzLnJlc291cmNlcyAgID0gcmVzb3VyY2VzO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UgID0ge1xyXG4gICAgICAgICAgICBvYmplY3Q6IHJlc291cmNlcy5zaGlwSW1hZ2Uub2JqZWN0LFxyXG4gICAgICAgICAgICBzcHJpdGVTaXplOiB7XHJcbiAgICAgICAgICAgICAgICB3aWR0aDogNjgsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDEyOCxcclxuICAgICAgICAgICAgICAgIHNwcml0ZVBvc2l0aW9uOiAwLFxyXG4gICAgICAgICAgICAgICAgc3ByaXRlc0NvdW50OiA0LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc291bmRzID0ge1xyXG4gICAgICAgICAgICBsYXNlcjoge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0OiByZXNvdXJjZXMuZmlyZVNvdW5kLm9iamVjdCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnNoaXAgID0ge1xyXG4gICAgICAgICAgICB3aWR0aDogMzQsXHJcbiAgICAgICAgICAgIGhlaWdodDogNjQsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICB4OiBnYW1lQ29uZi5tb3VzZS54LFxyXG4gICAgICAgICAgICAgICAgeTogZ2FtZUNvbmYubW91c2UueSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGlmZXM6IGdhbWVDb25mLmRlZmF1bHRMaWZlcyxcclxuICAgICAgICAgICAgbGFzdEZyYW1lQ291bnRPZkZpcmVDcmVhdGU6IDAsXHJcbiAgICAgICAgICAgIGNhblRvdWNoOiB0cnVlLFxyXG4gICAgICAgICAgICBjYW5Nb3ZlOiB0cnVlLFxyXG4gICAgICAgICAgICBfc2hpZWxkRW5hYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgZ2V0IHNoaWVsZEVuYWJsZSgpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NoaWVsZEVuYWJsZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0IHNoaWVsZEVuYWJsZSh2YWx1ZSl7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA/IHNlbGYuc2hpZWxkRW5hYmxlKCkgOiB0aGlzLl9zaGllbGRFbmFibGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5kaXNhYmxlTW92ZVRpbWUgPSAyNTAwO1xyXG5cclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCl7XHJcbiAgICAgICAgdGhpcy5tb3ZlSGFuZGxlcklkID0gdGhpcy5jYW52YXMuYWRkSGFuZGxlclRvRHJhdygoY3R4KT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNoaXBNb3ZlKGN0eCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maXJlQWN0aW9uSGFuZGxlcklkID0gdGhpcy5jYW52YXMuYWRkQWN0aW9uSGFuZGxlcigoKT0+e1xyXG4gICAgICAgICAgICBnYW1lQ29uZi5tb3VzZS5tb3VzZURvd24udmFsdWUgPyB0aGlzLnNoaXBGaXJlKCB0aGlzLmNhbnZhcy5jdHggKSA6IFwiXCI7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5tb3ZlQWN0aW9uSGFuZGxlcklkID0gdGhpcy5jYW52YXMuYWRkQWN0aW9uSGFuZGxlcigoKT0+e1xyXG4gICAgICAgICAgICBpZighdGhpcy5zaGlwLmNhbk1vdmUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5zaGlwLnBvc2l0aW9uLnggPSBnYW1lQ29uZi5tb3VzZS54O1xyXG4gICAgICAgICAgICB0aGlzLnNoaXAucG9zaXRpb24ueSA9IGdhbWVDb25mLm1vdXNlLnk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hpcE1vdmUoIGN0eCApe1xyXG5cclxuICAgICAgICBsZXQgeFNwcml0ZVBvc2l0aW9uID1cclxuICAgICAgICAgICAgdGhpcy5pbWFnZS5zcHJpdGVTaXplLnNwcml0ZVBvc2l0aW9uIDwgdGhpcy5pbWFnZS5zcHJpdGVTaXplLnNwcml0ZXNDb3VudCAtIDFcclxuICAgICAgICAgICAgPyArK3RoaXMuaW1hZ2Uuc3ByaXRlU2l6ZS5zcHJpdGVQb3NpdGlvblxyXG4gICAgICAgICAgICA6IHRoaXMuaW1hZ2Uuc3ByaXRlU2l6ZS5zcHJpdGVQb3NpdGlvbiA9IDA7XHJcblxyXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZS5vYmplY3QsXHJcbiAgICAgICAgICAgICAgICB4U3ByaXRlUG9zaXRpb24gKiB0aGlzLmltYWdlLnNwcml0ZVNpemUud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwLndpZHRoICogMixcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcC5oZWlnaHQgKiAyLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwLnBvc2l0aW9uLnggLSB0aGlzLnNoaXAud2lkdGggLyAyLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwLnBvc2l0aW9uLnkgLSB0aGlzLnNoaXAuaGVpZ2h0IC8gMixcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcC53aWR0aCxcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcC5oZWlnaHQsXHJcbiAgICAgICAgICAgICk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNoaXBGaXJlKCBjdHggKXtcclxuICAgICAgICBcclxuICAgICAgICBpZiggTWF0aC5hYnMoIGdhbWVDb25mLmRhdGFDYW52YXMuZnJhbWVzQWxsIC0gdGhpcy5zaGlwLmxhc3RGcmFtZUNvdW50T2ZGaXJlQ3JlYXRlICkgPCA0ICl7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zaGlwLmxhc3RGcmFtZUNvdW50T2ZGaXJlQ3JlYXRlID0gZ2FtZUNvbmYuZGF0YUNhbnZhcy5mcmFtZXNBbGw7XHJcbiAgICAgICAgbGV0IGlkID0gKyt0aGlzLmdhbWVPYmplY3RzLmlkQ291bnRlcjtcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3RzLmZpcmVzW2lkXSA9IG5ldyBGaXJlKHRoaXMuY2FudmFzLCB0aGlzLmdhbWVPYmplY3RzLCB0aGlzLnJlc291cmNlcywge1xyXG4gICAgICAgICAgICBpZDogaWQsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICB4OiB0aGlzLnNoaXAucG9zaXRpb24ueCxcclxuICAgICAgICAgICAgICAgIHk6IHRoaXMuc2hpcC5wb3NpdGlvbi55IC0gdGhpcy5zaGlwLmhlaWdodCAvIDIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNvdW5kOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc291bmQgPSBuZXcgQXVkaW87XHJcbiAgICAgICAgICAgICAgICBzb3VuZC5zcmMgPSB0aGlzLnNvdW5kcy5sYXNlci5vYmplY3Quc3JjO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNvdW5kO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBjb2xsaXNpb25XaWR0aEVuZW15KCl7XHJcbiAgICAgICBcclxuICAgICAgICBpZighdGhpcy5zaGlwLmNhblRvdWNoKSByZXR1cm47XHJcbiAgICAgICAgLy8gdGhpcy5zaGlwLmNhblRvdWNoID0gZmFsc2U7Lmtra2xsXHJcblxyXG4gICAgICAgIHRoaXMubGlmZVNoaWZ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGlmZVNoaWZ0KCl7XHJcbiAgICBcclxuICAgICAgICB0aGlzLm1vdmVTdG9wcGVkQW5kU2V0U3RhcnRQb3NpdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc2hpZWxkRW5hYmxlKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gaWYoLS10aGlzLnNoaXAubGlmZXMgPiAwKXtcclxuICAgICAgICAvLyAgICAgLy8gdGhpcy5sb29zZUx2bCgpO1xyXG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZygncXdlMicpXHJcbiAgICAgICAgLy8gICAgIHRoaXMubW92ZVN0b3BwZWQoKTtcclxuICAgICAgICAvLyAgICAgdGhpcy5zaGllbGRFbmFibGUoKTtcclxuICAgICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZygncXdlMTIzNCcpXHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBtb3ZlU3RvcHBlZEFuZFNldFN0YXJ0UG9zaXRpb24oKXtcclxuICAgICAgIHRoaXMuc2hpcC5jYW5Nb3ZlID0gZmFsc2U7XHJcbiAgICAgICAgLy8gbW92ZSBzaGlwIHRvIHN0YXJ0XHJcblxyXG4gICAgICAgIHRoaXMuc2hpcC5wb3NpdGlvbi54ID0gd2luZG93LmlubmVyV2lkdGggLyAyO1xyXG4gICAgICAgIHRoaXMuc2hpcC5wb3NpdGlvbi55ID0gd2luZG93LmlubmVySGVpZ2h0IC0gMTUwO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNldFRpbWVvdXQoKCk9PntcclxuICAgICAgICAgICAgdGhpcy5zaGlwLmNhbk1vdmUgPSB0cnVlO1xyXG4gICAgICAgIH0sdGhpcy5kaXNhYmxlTW92ZVRpbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHNoaWVsZEVuYWJsZSggZnJhbWVDb3VudGVyRm9yRW5hYmxlID0gNjAgKiAyICl7XHJcbiAgICAgICBcclxuICAgICAgICB0aGlzLnNoaXAuY2FuVG91Y2ggPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnNoaWVsZERyYXdJZCA9IHRoaXMuY2FudmFzLmFkZEhhbmRsZXJUb0RyYXcoY3R4PT57XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwid2hpdGVcIjtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHguYXJjKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwLnBvc2l0aW9uLngsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoaXAucG9zaXRpb24ueSxcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcC5oZWlnaHQgPiB0aGlzLnNoaXAud2lkdGggP1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hpcC5oZWlnaHQgKyAxXHJcbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLnNoaXAud2lkdGggKyAxLFxyXG4gICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgIDIgKiBNYXRoLlBJKTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBmcmFtZXNDb3VudFdoZW5TaGllbGRTdGFydCA9IGdhbWVDb25mLmRhdGFDYW52YXMuZnJhbWVzQWxsO1xyXG4gICAgICAgIGxldCBsb29wSWQgPSB0aGlzLmNhbnZhcy5hZGRBY3Rpb25IYW5kbGVyKChnYW1lQ29uZik9PntcclxuICAgICAgICAgICAgaWYodGhpcy5nYW1lQ29uZi5kYXRhQ2FudmFzLmZyYW1lc0FsbCAtIGZyYW1lc0NvdW50V2hlblNoaWVsZFN0YXJ0ID4gZnJhbWVDb3VudGVyRm9yRW5hYmxlKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUhhbmRsZXJUb0RyYXcodGhpcy5zaGllbGREcmF3SWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlQWN0aW9uSGFuZGxlcihsb29wSWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwLnNoaWVsZEVuYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwLmNhblRvdWNoID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBsb29zZUx2bCgpe1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0b3AoKTtcclxuICAgIH1cclxuXHJcblxyXG59IiwiXHJcblxyXG5pbXBvcnQgU2hpcCBmcm9tICcuL1NoaXAnO1xyXG5pbXBvcnQgZ2FtZUNvbmYgZnJvbSBcIi4uL2dhbWVDb25mXCI7XHJcbmltcG9ydCBCZyBmcm9tICcuL0JnJztcclxuaW1wb3J0IEVuZW15IGZyb20gJy4vRW5lbXknO1xyXG5pbXBvcnQgQ29sbGlzaW9ucyBmcm9tICcuL0NvbGxpc2lvbnMnO1xyXG5pbXBvcnQgcmVzb3VyY2VzIGZyb20gJy4vcmVzb3VyY2VzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVDb21wb25lbnRzSW5pdHtcclxuICAgIGNvbnN0cnVjdG9yKCBjYW52YXMgKXtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3RzID0ge1xyXG4gICAgICAgICAgICBpZENvdW50ZXI6IC0xLFxyXG4gICAgICAgICAgICBmaXJlczoge30sXHJcbiAgICAgICAgICAgIGVuZW15U2hpcHM6IHt9LFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucmVzb3VyY2VzID0gcmVzb3VyY2VzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuQmcgICA9IG5ldyBCZyggY2FudmFzLCB0aGlzLmdhbWVPYmplY3RzLCB0aGlzLnJlc291cmNlcyApO1xyXG4gICAgICAgIHRoaXMuc2hpcCA9IG5ldyBTaGlwKCBjYW52YXMsIHRoaXMuZ2FtZU9iamVjdHMsIHRoaXMucmVzb3VyY2VzICk7XHJcblxyXG4gICAgICAgIHRoaXMucHJlTG9hZGVyKCk7XHJcbiAgICAgICAgdGhpcy5sb2FkUmVzb3VyY2VzKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVFbmVtaWVzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29sbGlzaW9uQ2hlY2tlciA9IG5ldyBDb2xsaXNpb25zKGNhbnZhcywgdGhpcy5nYW1lT2JqZWN0cywgdGhpcy5yZXNvdXJjZXMsIHRoaXMuc2hpcCk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlRW5lbWllcygpe1xyXG4gICAgICAgIGNvbnN0IGVuZW15TWFwID0gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmcm9tRnJhbWU6IDMwLFxyXG4gICAgICAgICAgICAgICAgZW5lbXlUeXBlOiBcImVhc3lcIixcclxuICAgICAgICAgICAgICAgIGVuZW15Q291bnQ6IDU1NSxcclxuICAgICAgICAgICAgICAgIGVuZW15RGVsYXk6IDM1LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIHRoaXMuZW5lbWllc0NyZWF0ZUFjdGlvbkhhbmRsZXJJZCA9IHRoaXMuY2FudmFzLmFkZEFjdGlvbkhhbmRsZXIoKCk9PntcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgZW5lbXlNYXAuZm9yRWFjaChlbmVteU1hcFBhcnQ9PntcclxuICAgICAgICAgICAgICAgbGV0IGZyYW1lTm93ID0gZ2FtZUNvbmYuZGF0YUNhbnZhcy5mcmFtZXNBbGw7XHJcbiAgICAgICAgICAgICAgIGlmKGZyYW1lTm93ID49IGVuZW15TWFwUGFydC5mcm9tRnJhbWVcclxuICAgICAgICAgICAgICAgICYmIGVuZW15TWFwUGFydC5lbmVteUNvdW50ID4gMFxyXG4gICAgICAgICAgICAgICAgJiYgZnJhbWVOb3cgJSBlbmVteU1hcFBhcnQuZW5lbXlEZWxheSA9PT0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlkID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVPYmplY3RzLmVuZW15U2hpcHNbKyt0aGlzLmdhbWVPYmplY3RzLmlkQ291bnRlcl0gPSBuZXcgRW5lbXkoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVPYmplY3RzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5lbXlNYXBQYXJ0LmVuZW15VHlwZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lT2JqZWN0cy5pZENvdW50ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVuZW15TWFwUGFydC5lbmVteUNvdW50LS07XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveSgpe1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcmVMb2FkZXIoKXtcclxuICAgICAgICBsZXQgcHJlTG9hZGVySGFuZGxlciA9ICggY3R4ICkgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IGFsbENvdW50ZXIgPSBPYmplY3Qua2V5cyh0aGlzLnJlc291cmNlcykubGVuZ3RoO1xyXG4gICAgICAgICAgICBsZXQgaXNMb2FkQ291bnRlciA9IE9iamVjdC52YWx1ZXModGhpcy5yZXNvdXJjZXMpLmZpbHRlcihpdGVtPT57XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5pc1JlYWR5O1xyXG4gICAgICAgICAgICB9KS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJyZWRcIjtcclxuICAgICAgICAgICAgbGV0IHByZUxvYWRlckxpbmVIZWlnaHQgPSAzO1xyXG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCAvIDEwLFxyXG4gICAgICAgICAgICAgICAgKHRoaXMuY2FudmFzLmhlaWdodCAvIDIpIC0gcHJlTG9hZGVyTGluZUhlaWdodCAvIDIsXHJcbiAgICAgICAgICAgICAgICAodGhpcy5jYW52YXMud2lkdGggLyAxMCkgKiA4ICogKGlzTG9hZENvdW50ZXIgLyBhbGxDb3VudGVyKSxcclxuICAgICAgICAgICAgICAgIHByZUxvYWRlckxpbmVIZWlnaHRcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucHJlTG9hZGVyRHJhd0hhbmRsZXJJZCA9IHRoaXMuY2FudmFzLmFkZEhhbmRsZXJUb0RyYXdJblN0b3BwZWRNb2RlKGN0eD0+e1xyXG4gICAgICAgICAgICBwcmVMb2FkZXJIYW5kbGVyKGN0eCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFJlc291cmNlcygpe1xyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5yZXNvdXJjZXMpLmZvckVhY2goaXRlbT0+e1xyXG4gICAgICAgICAgICBpdGVtLmlzUmVhZHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgc3dpdGNoIChpdGVtLnR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJpbWFnZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ub2JqZWN0Lm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5pc1JlYWR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic291bmRcIjpcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLm9iamVjdC5vbmNhbnBsYXl0aHJvdWdoID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmlzUmVhZHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgdCA9IHNldEludGVydmFsKCgpPT57XHJcbiAgICAgICAgICAgIGxldCBpc1JlYWR5ID0gT2JqZWN0LnZhbHVlcyh0aGlzLnJlc291cmNlcykuZXZlcnkoaXRlbT0+e1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uaXNSZWFkeVxyXG4gICAgICAgICAgICAgICAgICAgICYmICggaXRlbS5vYmplY3QuY29tcGxldGUgIT0gMCB8fCAgaXRlbS5vYmplY3QubmF0dXJhbEhlaWdodCAhPSAwKVxyXG4gICAgICAgICAgICAgICAgICAgICYmIGl0ZW0ub2JqZWN0LndpZHRoICE9IDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmKGlzUmVhZHkpe1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmdvKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0KTtcclxuICAgICAgICAgICAgICAgIH0sIDI1NSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTsgXHJcbiAgICB9XHJcbn1cclxuIiwiXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCl7XHJcbiAgICBsZXQgcmVzb3VyY2VzID0ge1xyXG4gICAgICAgIHNoaXBJbWFnZToge1xyXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlXCIsXHJcbiAgICAgICAgICAgIG9iamVjdDogbmV3IEltYWdlKCksXHJcbiAgICAgICAgICAgIHNyYzogXCJpbWFnZXMvc2hpcC5wbmdcIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVuZW15RWFzeUltYWdlOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2VcIixcclxuICAgICAgICAgICAgb2JqZWN0OiBuZXcgSW1hZ2UoKSxcclxuICAgICAgICAgICAgc3JjOiBcImltYWdlcy9lbmVteV9lYXN5X3NoaXAucG5nXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBmaXJlSW1hZ2U6IHtcclxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZVwiLFxyXG4gICAgICAgICAgICBvYmplY3Q6IG5ldyBJbWFnZSgpLFxyXG4gICAgICAgICAgICBzcmM6IFwiaW1hZ2VzL3Nob290X2xhc2VyLnBuZ1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBmaXJlU291bmQ6IHtcclxuICAgICAgICAgICAgdHlwZTogXCJzb3VuZFwiLFxyXG4gICAgICAgICAgICBvYmplY3Q6IG5ldyBBdWRpbyxcclxuICAgICAgICAgICAgc3JjOiBcInNvdW5kcy9zaGlwX293bl9sYXNlci5tcDNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGxhbmV0SW1hZ2U6IHtcclxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZVwiLFxyXG4gICAgICAgICAgICBvYmplY3Q6IG5ldyBJbWFnZSgpLFxyXG4gICAgICAgICAgICBzcmM6IFwiaW1hZ2VzL3BsYW5ldC5wbmdcIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJnSW1hZ2U6IHtcclxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZVwiLFxyXG4gICAgICAgICAgICBvYmplY3Q6IG5ldyBJbWFnZSgpLFxyXG4gICAgICAgICAgICBzcmM6IFwiaW1hZ2VzL2JnMi5qcGdcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYm9vbUltYWdlOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2VcIixcclxuICAgICAgICAgICAgb2JqZWN0OiBuZXcgSW1hZ2UoKSxcclxuICAgICAgICAgICAgc3JjOiBcImltYWdlcy9ib29tLnBuZ1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYm9vbUVuZW15U291bmQ6IHtcclxuICAgICAgICAgICAgdHlwZTogXCJzb3VuZFwiLFxyXG4gICAgICAgICAgICBvYmplY3Q6IG5ldyBBdWRpbygpLFxyXG4gICAgICAgICAgICBzcmM6IFwic291bmRzL2VuZW15X2Jvb20ubXAzXCIsXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIE9iamVjdC52YWx1ZXMocmVzb3VyY2VzKS5mb3JFYWNoKChvYmopPT57XHJcbiAgICAgICAgb2JqLm9iamVjdC5zcmMgPSBvYmouc3JjO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc291cmNlcztcclxufTsiLCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNob3dGcHMoIGZwc1ZhbHVlICkge1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZwcycpLmlubmVySFRNTCA9IGBGUFM6ICR7ZnBzVmFsdWV9YDtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4iLCJpbXBvcnQgRW5lbXkgZnJvbSAnLi9HYW1lQ29tcG9uZW50c0luaXQvRW5lbXknXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICByYW5kb21GbG9hdDogZnVuY3Rpb24obWluLG1heCl7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbjtcclxuICAgIH0sXHJcbiAgICByYW5kb21JbnQ6IGZ1bmN0aW9uKG1pbixtYXgpe1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSkgKyBtaW47XHJcbiAgICB9LFxyXG4gICAgY2hlY2tDb2xsaXNpb25SZWN0YW5nbGVzOiBmdW5jdGlvbiggb2JqQSwgb2JqQiwgZnJvbSApe1xyXG4gICAgICAgIC8vIGl0J3MgbmVlZCBmb3Igb25lIHR5cGUgb2Ygb2JqZWN0IHN0cnVjdHVyZTogXHJcbiAgICAgICAgLy8gbXVzdCB0byB1c2Ugb2JqLnBvc2l0aW9uID0ge3g6IHZhbHVlLCB5OiB2YWx1ZX0gJiYgKCBvYmoud2lkdGggJiYgb2JqLmhlaWdodCApXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHsgeDpheCAsIHk6YXkgfSA9IG9iakEucG9zaXRpb247XHJcbiAgICAgICAgbGV0IHsgeDpieCAsIHk6YnkgfSA9IG9iakIucG9zaXRpb247XHJcbiAgICAgICAgbGV0IHsgd2lkdGg6YXcgLCBoZWlnaHQ6YWggfSA9IG9iakE7XHJcbiAgICAgICAgbGV0IHsgd2lkdGg6YncgLCBoZWlnaHQ6YmggfSA9IG9iakI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGF4TGVmdCAgID0gYXggLSBhdy8yO1xyXG4gICAgICAgIGxldCBheFJpZ2h0ICA9IGF4ICsgYXcvMjtcclxuICAgICAgICBsZXQgYXlUb3AgICAgPSBheSAtIGFoLzI7XHJcbiAgICAgICAgbGV0IGF5Qm90dG9tID0gYXkgKyBhaC8yO1xyXG5cclxuICAgICAgICBsZXQgYnhMZWZ0ICAgPSBieCAtIGJ3LzI7XHJcbiAgICAgICAgbGV0IGJ4UmlnaHQgID0gYnggKyBidy8yO1xyXG4gICAgICAgIGxldCBieVRvcCAgICA9IGJ5IC0gYmgvMjtcclxuICAgICAgICBsZXQgYnlCb3R0b20gPSBieSArIGJoLzI7XHJcblxyXG4gICAgICAgIC8vIGZvciBjb2xsaXNpb24gb2YgMiByZWN0YW5nbGVzIG5lZWQgNCBjb25kaXRpb25zOlxyXG4gICAgICAgIC8vIDEpIGF4UmlnaHQgID4gYnhMZWZ0ICAgICA6IHJpZ2h0IHNpZGUgWCBjb29yZGluYXRlIG9mIDEtc3QgcmVjdCBtb3JlIHRoYW4gbGVmdCBzaXplIFggY29vcmRpbmF0ZSAyLW5kXHJcbiAgICAgICAgLy8gMikgYXhMZWZ0ICAgPCBieFJpZ2h0ICAgIDogLi4uXHJcbiAgICAgICAgLy8gMykgYXlCb3R0b20gPiBieVRvcCAgICAgIFxyXG4gICAgICAgIC8vIDQpIGF5VG9wICAgIDwgYnlCb3R0b21cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICBheFJpZ2h0ICA+IGJ4TGVmdCAgICYmXHJcbiAgICAgICAgICAgIGF4TGVmdCAgIDwgYnhSaWdodCAgJiZcclxuICAgICAgICAgICAgYXlCb3R0b20gPiBieVRvcCAgICAmJlxyXG4gICAgICAgICAgICBheVRvcCAgICA8IGJ5Qm90dG9tID8gdHJ1ZSA6IGZhbHNlXHJcbiAgICAgICAgKTtcclxuICAgIH0sXHJcblxyXG5cclxuXHJcbn07IiwiaW1wb3J0IHNob3dGcHMgZnJvbSAnLi9kZXZGbnMnO1xyXG5cclxuXHJcbi8vIGl0IHdpbGwgbmV3ZXIgYmUgJ3Byb2QnXHJcbmNvbnN0IGdhbWVNb2RlID0gJ2Rldic7XHJcblxyXG5sZXQgb2JqID0ge1xyXG4gICAgbWF4RnJhbWVzSW5TZWNvbmQ6IDYwLFxyXG4gICAgbW91c2U6IHtcclxuICAgICAgICB4OiAwLFxyXG4gICAgICAgIHk6IDAsXHJcbiAgICAgICAgbW91c2VEb3duOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBmYWxzZSxcclxuICAgICAgICAgICAgZXZlbnQ6IG51bGwsXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBkZWZhdWx0TGlmZXM6IDQsXHJcbiAgICBib29tU3ByaXRlc0NvdW50OiA4LFxyXG4gICAgZGF0YUNhbnZhcyA6IHtcclxuICAgICAgICAvLyBpdGVyYXRpb24gb2YgZnJhbWVzIGluIGVhY2ggc2Vjb25kIFxyXG4gICAgICAgIC8vIGZyb20gZWFjaCBuZXcgc2Vjb25kIHdpbGwgPSAwXHJcbiAgICAgICAgZnBzSW5TZWNvbmROb3c6IDAsIFxyXG5cclxuICAgICAgICAvLyBtYXggZnJhbWVzIGNvdW50IG9uIGVhY2ggc2Vjb25kXHJcbiAgICAgICAgX2ZwczowLFxyXG4gICAgICAgIHNldCBmcHModmFsdWUpe1xyXG4gICAgICAgICAgICB0aGlzLl9mcHMgPSB2YWx1ZTtcclxuICAgICAgICAgICAgZ2FtZU1vZGUgPT0gJ2RldicgPyBzaG93RnBzKHZhbHVlKSA6ICcnOyBcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZwcztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldCBmcHMoKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZwcztcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIGFsbCBmcmFtZXMgZnJvbSBzdGFydCBkcmF3aW5nXHJcbiAgICAgICAgLy8gd2lsbCB1c2VkIGxpa2UgdGltZSBjb3VudGVyXHJcbiAgICAgICAgZnJhbWVzQWxsOiAwLCBcclxuICAgIH0sXHJcbiAgICBzb3VuZDoge1xyXG4gICAgICAgIGVuYWJsZTogdHJ1ZSxcclxuICAgIH1cclxufVxyXG5cclxuLy8gd2luZG93Lm9iaiAgPSBvYmo7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGV2ZW50KT0+e1xyXG4gICAgbGV0IGUgPSBldmVudCB8fCB3aW5kb3cuZXZlbnQ7XHJcbiAgICBvYmoubW91c2UueCA9IGUueDtcclxuICAgIG9iai5tb3VzZS55ID0gZS55O1xyXG59KTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZXZlbnQpPT57XHJcblxyXG4gICAgbGV0IGUgPSBldmVudCB8fCB3aW5kb3cuZXZlbnQ7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBvYmoubW91c2UubW91c2VEb3duLnZhbHVlID0gdHJ1ZTtcclxuICAgIG9iai5tb3VzZS5tb3VzZURvd24uZXZlbnQgPSBlO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbGlzdGVuZXJGb3JNb3VzZVVwKTtcclxuICAgIGZ1bmN0aW9uIGxpc3RlbmVyRm9yTW91c2VVcCAoKSB7XHJcbiAgICAgICAgb2JqLm1vdXNlLm1vdXNlRG93bi52YWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgIG9iai5tb3VzZS5tb3VzZURvd24uZXZlbnQgPSBudWxsO1xyXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbGlzdGVuZXJGb3JNb3VzZVVwKTtcclxuICAgIH07XHJcblxyXG59KVxyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgb2JqOyIsIlxyXG5pbXBvcnQgQ2FudmFzR2FtZSBmcm9tICcuL0NhbnZhc0dhbWUnO1xyXG5pbXBvcnQgR2FtZUNvbXBvbmVudHNJbml0IGZyb20gJy4vR2FtZUNvbXBvbmVudHNJbml0L2luZGV4LmpzJztcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCk9PntcclxuICAgIGxldCBjYW52YXNHYW1lID0gbmV3IENhbnZhc0dhbWUoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYW52YXNfX2N0eCcpICk7XHJcbiAgICBuZXcgR2FtZUNvbXBvbmVudHNJbml0KCBjYW52YXNHYW1lICk7XHJcbn0pO1xyXG5cclxuXHJcbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn0iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIGZvcm1hdFJlZ0V4cCA9IC8lW3NkaiVdL2c7XG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uKGYpIHtcbiAgaWYgKCFpc1N0cmluZyhmKSkge1xuICAgIHZhciBvYmplY3RzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9iamVjdHMucHVzaChpbnNwZWN0KGFyZ3VtZW50c1tpXSkpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0cy5qb2luKCcgJyk7XG4gIH1cblxuICB2YXIgaSA9IDE7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICB2YXIgbGVuID0gYXJncy5sZW5ndGg7XG4gIHZhciBzdHIgPSBTdHJpbmcoZikucmVwbGFjZShmb3JtYXRSZWdFeHAsIGZ1bmN0aW9uKHgpIHtcbiAgICBpZiAoeCA9PT0gJyUlJykgcmV0dXJuICclJztcbiAgICBpZiAoaSA+PSBsZW4pIHJldHVybiB4O1xuICAgIHN3aXRjaCAoeCkge1xuICAgICAgY2FzZSAnJXMnOiByZXR1cm4gU3RyaW5nKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclZCc6IHJldHVybiBOdW1iZXIoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVqJzpcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnc1tpKytdKTtcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIHJldHVybiAnW0NpcmN1bGFyXSc7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfSk7XG4gIGZvciAodmFyIHggPSBhcmdzW2ldOyBpIDwgbGVuOyB4ID0gYXJnc1srK2ldKSB7XG4gICAgaWYgKGlzTnVsbCh4KSB8fCAhaXNPYmplY3QoeCkpIHtcbiAgICAgIHN0ciArPSAnICcgKyB4O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgKz0gJyAnICsgaW5zcGVjdCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cblxuLy8gTWFyayB0aGF0IGEgbWV0aG9kIHNob3VsZCBub3QgYmUgdXNlZC5cbi8vIFJldHVybnMgYSBtb2RpZmllZCBmdW5jdGlvbiB3aGljaCB3YXJucyBvbmNlIGJ5IGRlZmF1bHQuXG4vLyBJZiAtLW5vLWRlcHJlY2F0aW9uIGlzIHNldCwgdGhlbiBpdCBpcyBhIG5vLW9wLlxuZXhwb3J0cy5kZXByZWNhdGUgPSBmdW5jdGlvbihmbiwgbXNnKSB7XG4gIC8vIEFsbG93IGZvciBkZXByZWNhdGluZyB0aGluZ3MgaW4gdGhlIHByb2Nlc3Mgb2Ygc3RhcnRpbmcgdXAuXG4gIGlmIChpc1VuZGVmaW5lZChnbG9iYWwucHJvY2VzcykpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhwb3J0cy5kZXByZWNhdGUoZm4sIG1zZykuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHByb2Nlc3Mubm9EZXByZWNhdGlvbiA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgaWYgKHByb2Nlc3MudGhyb3dEZXByZWNhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy50cmFjZURlcHJlY2F0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIGRlcHJlY2F0ZWQ7XG59O1xuXG5cbnZhciBkZWJ1Z3MgPSB7fTtcbnZhciBkZWJ1Z0Vudmlyb247XG5leHBvcnRzLmRlYnVnbG9nID0gZnVuY3Rpb24oc2V0KSB7XG4gIGlmIChpc1VuZGVmaW5lZChkZWJ1Z0Vudmlyb24pKVxuICAgIGRlYnVnRW52aXJvbiA9IHByb2Nlc3MuZW52Lk5PREVfREVCVUcgfHwgJyc7XG4gIHNldCA9IHNldC50b1VwcGVyQ2FzZSgpO1xuICBpZiAoIWRlYnVnc1tzZXRdKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoJ1xcXFxiJyArIHNldCArICdcXFxcYicsICdpJykudGVzdChkZWJ1Z0Vudmlyb24pKSB7XG4gICAgICB2YXIgcGlkID0gcHJvY2Vzcy5waWQ7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbXNnID0gZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKTtcbiAgICAgICAgY29uc29sZS5lcnJvcignJXMgJWQ6ICVzJywgc2V0LCBwaWQsIG1zZyk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge307XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWJ1Z3Nbc2V0XTtcbn07XG5cblxuLyoqXG4gKiBFY2hvcyB0aGUgdmFsdWUgb2YgYSB2YWx1ZS4gVHJ5cyB0byBwcmludCB0aGUgdmFsdWUgb3V0XG4gKiBpbiB0aGUgYmVzdCB3YXkgcG9zc2libGUgZ2l2ZW4gdGhlIGRpZmZlcmVudCB0eXBlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcHJpbnQgb3V0LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdGhhdCBhbHRlcnMgdGhlIG91dHB1dC5cbiAqL1xuLyogbGVnYWN5OiBvYmosIHNob3dIaWRkZW4sIGRlcHRoLCBjb2xvcnMqL1xuZnVuY3Rpb24gaW5zcGVjdChvYmosIG9wdHMpIHtcbiAgLy8gZGVmYXVsdCBvcHRpb25zXG4gIHZhciBjdHggPSB7XG4gICAgc2VlbjogW10sXG4gICAgc3R5bGl6ZTogc3R5bGl6ZU5vQ29sb3JcbiAgfTtcbiAgLy8gbGVnYWN5Li4uXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDMpIGN0eC5kZXB0aCA9IGFyZ3VtZW50c1syXTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCkgY3R4LmNvbG9ycyA9IGFyZ3VtZW50c1szXTtcbiAgaWYgKGlzQm9vbGVhbihvcHRzKSkge1xuICAgIC8vIGxlZ2FjeS4uLlxuICAgIGN0eC5zaG93SGlkZGVuID0gb3B0cztcbiAgfSBlbHNlIGlmIChvcHRzKSB7XG4gICAgLy8gZ290IGFuIFwib3B0aW9uc1wiIG9iamVjdFxuICAgIGV4cG9ydHMuX2V4dGVuZChjdHgsIG9wdHMpO1xuICB9XG4gIC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5zaG93SGlkZGVuKSkgY3R4LnNob3dIaWRkZW4gPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5kZXB0aCkpIGN0eC5kZXB0aCA9IDI7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY29sb3JzKSkgY3R4LmNvbG9ycyA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmN1c3RvbUluc3BlY3QpKSBjdHguY3VzdG9tSW5zcGVjdCA9IHRydWU7XG4gIGlmIChjdHguY29sb3JzKSBjdHguc3R5bGl6ZSA9IHN0eWxpemVXaXRoQ29sb3I7XG4gIHJldHVybiBmb3JtYXRWYWx1ZShjdHgsIG9iaiwgY3R4LmRlcHRoKTtcbn1cbmV4cG9ydHMuaW5zcGVjdCA9IGluc3BlY3Q7XG5cblxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BTlNJX2VzY2FwZV9jb2RlI2dyYXBoaWNzXG5pbnNwZWN0LmNvbG9ycyA9IHtcbiAgJ2JvbGQnIDogWzEsIDIyXSxcbiAgJ2l0YWxpYycgOiBbMywgMjNdLFxuICAndW5kZXJsaW5lJyA6IFs0LCAyNF0sXG4gICdpbnZlcnNlJyA6IFs3LCAyN10sXG4gICd3aGl0ZScgOiBbMzcsIDM5XSxcbiAgJ2dyZXknIDogWzkwLCAzOV0sXG4gICdibGFjaycgOiBbMzAsIDM5XSxcbiAgJ2JsdWUnIDogWzM0LCAzOV0sXG4gICdjeWFuJyA6IFszNiwgMzldLFxuICAnZ3JlZW4nIDogWzMyLCAzOV0sXG4gICdtYWdlbnRhJyA6IFszNSwgMzldLFxuICAncmVkJyA6IFszMSwgMzldLFxuICAneWVsbG93JyA6IFszMywgMzldXG59O1xuXG4vLyBEb24ndCB1c2UgJ2JsdWUnIG5vdCB2aXNpYmxlIG9uIGNtZC5leGVcbmluc3BlY3Quc3R5bGVzID0ge1xuICAnc3BlY2lhbCc6ICdjeWFuJyxcbiAgJ251bWJlcic6ICd5ZWxsb3cnLFxuICAnYm9vbGVhbic6ICd5ZWxsb3cnLFxuICAndW5kZWZpbmVkJzogJ2dyZXknLFxuICAnbnVsbCc6ICdib2xkJyxcbiAgJ3N0cmluZyc6ICdncmVlbicsXG4gICdkYXRlJzogJ21hZ2VudGEnLFxuICAvLyBcIm5hbWVcIjogaW50ZW50aW9uYWxseSBub3Qgc3R5bGluZ1xuICAncmVnZXhwJzogJ3JlZCdcbn07XG5cblxuZnVuY3Rpb24gc3R5bGl6ZVdpdGhDb2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICB2YXIgc3R5bGUgPSBpbnNwZWN0LnN0eWxlc1tzdHlsZVR5cGVdO1xuXG4gIGlmIChzdHlsZSkge1xuICAgIHJldHVybiAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzBdICsgJ20nICsgc3RyICtcbiAgICAgICAgICAgJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVsxXSArICdtJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cblxuZnVuY3Rpb24gc3R5bGl6ZU5vQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgcmV0dXJuIHN0cjtcbn1cblxuXG5mdW5jdGlvbiBhcnJheVRvSGFzaChhcnJheSkge1xuICB2YXIgaGFzaCA9IHt9O1xuXG4gIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsLCBpZHgpIHtcbiAgICBoYXNoW3ZhbF0gPSB0cnVlO1xuICB9KTtcblxuICByZXR1cm4gaGFzaDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRWYWx1ZShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMpIHtcbiAgLy8gUHJvdmlkZSBhIGhvb2sgZm9yIHVzZXItc3BlY2lmaWVkIGluc3BlY3QgZnVuY3Rpb25zLlxuICAvLyBDaGVjayB0aGF0IHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIGFuIGluc3BlY3QgZnVuY3Rpb24gb24gaXRcbiAgaWYgKGN0eC5jdXN0b21JbnNwZWN0ICYmXG4gICAgICB2YWx1ZSAmJlxuICAgICAgaXNGdW5jdGlvbih2YWx1ZS5pbnNwZWN0KSAmJlxuICAgICAgLy8gRmlsdGVyIG91dCB0aGUgdXRpbCBtb2R1bGUsIGl0J3MgaW5zcGVjdCBmdW5jdGlvbiBpcyBzcGVjaWFsXG4gICAgICB2YWx1ZS5pbnNwZWN0ICE9PSBleHBvcnRzLmluc3BlY3QgJiZcbiAgICAgIC8vIEFsc28gZmlsdGVyIG91dCBhbnkgcHJvdG90eXBlIG9iamVjdHMgdXNpbmcgdGhlIGNpcmN1bGFyIGNoZWNrLlxuICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgIHZhciByZXQgPSB2YWx1ZS5pbnNwZWN0KHJlY3Vyc2VUaW1lcywgY3R4KTtcbiAgICBpZiAoIWlzU3RyaW5nKHJldCkpIHtcbiAgICAgIHJldCA9IGZvcm1hdFZhbHVlKGN0eCwgcmV0LCByZWN1cnNlVGltZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLy8gUHJpbWl0aXZlIHR5cGVzIGNhbm5vdCBoYXZlIHByb3BlcnRpZXNcbiAgdmFyIHByaW1pdGl2ZSA9IGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKTtcbiAgaWYgKHByaW1pdGl2ZSkge1xuICAgIHJldHVybiBwcmltaXRpdmU7XG4gIH1cblxuICAvLyBMb29rIHVwIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICB2YXIgdmlzaWJsZUtleXMgPSBhcnJheVRvSGFzaChrZXlzKTtcblxuICBpZiAoY3R4LnNob3dIaWRkZW4pIHtcbiAgICBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpO1xuICB9XG5cbiAgLy8gSUUgZG9lc24ndCBtYWtlIGVycm9yIGZpZWxkcyBub24tZW51bWVyYWJsZVxuICAvLyBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaWUvZHd3NTJzYnQodj12cy45NCkuYXNweFxuICBpZiAoaXNFcnJvcih2YWx1ZSlcbiAgICAgICYmIChrZXlzLmluZGV4T2YoJ21lc3NhZ2UnKSA+PSAwIHx8IGtleXMuaW5kZXhPZignZGVzY3JpcHRpb24nKSA+PSAwKSkge1xuICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICAvLyBTb21lIHR5cGUgb2Ygb2JqZWN0IHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWQuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW0Z1bmN0aW9uJyArIG5hbWUgKyAnXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfVxuICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdkYXRlJyk7XG4gICAgfVxuICAgIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgYmFzZSA9ICcnLCBhcnJheSA9IGZhbHNlLCBicmFjZXMgPSBbJ3snLCAnfSddO1xuXG4gIC8vIE1ha2UgQXJyYXkgc2F5IHRoYXQgdGhleSBhcmUgQXJyYXlcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgYXJyYXkgPSB0cnVlO1xuICAgIGJyYWNlcyA9IFsnWycsICddJ107XG4gIH1cblxuICAvLyBNYWtlIGZ1bmN0aW9ucyBzYXkgdGhhdCB0aGV5IGFyZSBmdW5jdGlvbnNcbiAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgdmFyIG4gPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICBiYXNlID0gJyBbRnVuY3Rpb24nICsgbiArICddJztcbiAgfVxuXG4gIC8vIE1ha2UgUmVnRXhwcyBzYXkgdGhhdCB0aGV5IGFyZSBSZWdFeHBzXG4gIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZGF0ZXMgd2l0aCBwcm9wZXJ0aWVzIGZpcnN0IHNheSB0aGUgZGF0ZVxuICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBEYXRlLnByb3RvdHlwZS50b1VUQ1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZXJyb3Igd2l0aCBtZXNzYWdlIGZpcnN0IHNheSB0aGUgZXJyb3JcbiAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCAmJiAoIWFycmF5IHx8IHZhbHVlLmxlbmd0aCA9PSAwKSkge1xuICAgIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgYnJhY2VzWzFdO1xuICB9XG5cbiAgaWYgKHJlY3Vyc2VUaW1lcyA8IDApIHtcbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tPYmplY3RdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cblxuICBjdHguc2Vlbi5wdXNoKHZhbHVlKTtcblxuICB2YXIgb3V0cHV0O1xuICBpZiAoYXJyYXkpIHtcbiAgICBvdXRwdXQgPSBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKTtcbiAgfSBlbHNlIHtcbiAgICBvdXRwdXQgPSBrZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGN0eC5zZWVuLnBvcCgpO1xuXG4gIHJldHVybiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnKTtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHZhciBzaW1wbGUgPSAnXFwnJyArIEpTT04uc3RyaW5naWZ5KHZhbHVlKS5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSArICdcXCcnO1xuICAgIHJldHVybiBjdHguc3R5bGl6ZShzaW1wbGUsICdzdHJpbmcnKTtcbiAgfVxuICBpZiAoaXNOdW1iZXIodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnbnVtYmVyJyk7XG4gIGlmIChpc0Jvb2xlYW4odmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnYm9vbGVhbicpO1xuICAvLyBGb3Igc29tZSByZWFzb24gdHlwZW9mIG51bGwgaXMgXCJvYmplY3RcIiwgc28gc3BlY2lhbCBjYXNlIGhlcmUuXG4gIGlmIChpc051bGwodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnbnVsbCcsICdudWxsJyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IodmFsdWUpIHtcbiAgcmV0dXJuICdbJyArIEVycm9yLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSArICddJztcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKSB7XG4gIHZhciBvdXRwdXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkodmFsdWUsIFN0cmluZyhpKSkpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAgU3RyaW5nKGkpLCB0cnVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dC5wdXNoKCcnKTtcbiAgICB9XG4gIH1cbiAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIGlmICgha2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBrZXksIHRydWUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3V0cHV0O1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpIHtcbiAgdmFyIG5hbWUsIHN0ciwgZGVzYztcbiAgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodmFsdWUsIGtleSkgfHwgeyB2YWx1ZTogdmFsdWVba2V5XSB9O1xuICBpZiAoZGVzYy5nZXQpIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmICghaGFzT3duUHJvcGVydHkodmlzaWJsZUtleXMsIGtleSkpIHtcbiAgICBuYW1lID0gJ1snICsga2V5ICsgJ10nO1xuICB9XG4gIGlmICghc3RyKSB7XG4gICAgaWYgKGN0eC5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSkgPCAwKSB7XG4gICAgICBpZiAoaXNOdWxsKHJlY3Vyc2VUaW1lcykpIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgcmVjdXJzZVRpbWVzIC0gMSk7XG4gICAgICB9XG4gICAgICBpZiAoc3RyLmluZGV4T2YoJ1xcbicpID4gLTEpIHtcbiAgICAgICAgaWYgKGFycmF5KSB7XG4gICAgICAgICAgc3RyID0gc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpLnN1YnN0cigyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHIgPSAnXFxuJyArIHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tDaXJjdWxhcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoaXNVbmRlZmluZWQobmFtZSkpIHtcbiAgICBpZiAoYXJyYXkgJiYga2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgbmFtZSA9IEpTT04uc3RyaW5naWZ5KCcnICsga2V5KTtcbiAgICBpZiAobmFtZS5tYXRjaCgvXlwiKFthLXpBLVpfXVthLXpBLVpfMC05XSopXCIkLykpIHtcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cigxLCBuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXlwifFwiJCkvZywgXCInXCIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICdzdHJpbmcnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZSArICc6ICcgKyBzdHI7XG59XG5cblxuZnVuY3Rpb24gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpIHtcbiAgdmFyIG51bUxpbmVzRXN0ID0gMDtcbiAgdmFyIGxlbmd0aCA9IG91dHB1dC5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VyKSB7XG4gICAgbnVtTGluZXNFc3QrKztcbiAgICBpZiAoY3VyLmluZGV4T2YoJ1xcbicpID49IDApIG51bUxpbmVzRXN0Kys7XG4gICAgcmV0dXJuIHByZXYgKyBjdXIucmVwbGFjZSgvXFx1MDAxYlxcW1xcZFxcZD9tL2csICcnKS5sZW5ndGggKyAxO1xuICB9LCAwKTtcblxuICBpZiAobGVuZ3RoID4gNjApIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICtcbiAgICAgICAgICAgKGJhc2UgPT09ICcnID8gJycgOiBiYXNlICsgJ1xcbiAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIG91dHB1dC5qb2luKCcsXFxuICAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIGJyYWNlc1sxXTtcbiAgfVxuXG4gIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgJyAnICsgb3V0cHV0LmpvaW4oJywgJykgKyAnICcgKyBicmFjZXNbMV07XG59XG5cblxuLy8gTk9URTogVGhlc2UgdHlwZSBjaGVja2luZyBmdW5jdGlvbnMgaW50ZW50aW9uYWxseSBkb24ndCB1c2UgYGluc3RhbmNlb2ZgXG4vLyBiZWNhdXNlIGl0IGlzIGZyYWdpbGUgYW5kIGNhbiBiZSBlYXNpbHkgZmFrZWQgd2l0aCBgT2JqZWN0LmNyZWF0ZSgpYC5cbmZ1bmN0aW9uIGlzQXJyYXkoYXIpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXIpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gaXNCb29sZWFuKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nO1xufVxuZXhwb3J0cy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5cbmZ1bmN0aW9uIGlzTnVsbChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsID0gaXNOdWxsO1xuXG5mdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGxPclVuZGVmaW5lZCA9IGlzTnVsbE9yVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG5mdW5jdGlvbiBpc1N0cmluZyhhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1N5bWJvbChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnO1xufVxuZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc1JlZ0V4cChyZSkge1xuICByZXR1cm4gaXNPYmplY3QocmUpICYmIG9iamVjdFRvU3RyaW5nKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5leHBvcnRzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICByZXR1cm4gaXNPYmplY3QoZCkgJiYgb2JqZWN0VG9TdHJpbmcoZCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGUpICYmXG4gICAgICAob2JqZWN0VG9TdHJpbmcoZSkgPT09ICdbb2JqZWN0IEVycm9yXScgfHwgZSBpbnN0YW5jZW9mIEVycm9yKTtcbn1cbmV4cG9ydHMuaXNFcnJvciA9IGlzRXJyb3I7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGwgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3ltYm9sJyB8fCAgLy8gRVM2IHN5bWJvbFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3VuZGVmaW5lZCc7XG59XG5leHBvcnRzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5cbmV4cG9ydHMuaXNCdWZmZXIgPSByZXF1aXJlKCcuL3N1cHBvcnQvaXNCdWZmZXInKTtcblxuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuXG5cbmZ1bmN0aW9uIHBhZChuKSB7XG4gIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuLnRvU3RyaW5nKDEwKSA6IG4udG9TdHJpbmcoMTApO1xufVxuXG5cbnZhciBtb250aHMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJyxcbiAgICAgICAgICAgICAgJ09jdCcsICdOb3YnLCAnRGVjJ107XG5cbi8vIDI2IEZlYiAxNjoxOTozNFxuZnVuY3Rpb24gdGltZXN0YW1wKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gIHZhciB0aW1lID0gW3BhZChkLmdldEhvdXJzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRNaW51dGVzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKCc6Jyk7XG4gIHJldHVybiBbZC5nZXREYXRlKCksIG1vbnRoc1tkLmdldE1vbnRoKCldLCB0aW1lXS5qb2luKCcgJyk7XG59XG5cblxuLy8gbG9nIGlzIGp1c3QgYSB0aGluIHdyYXBwZXIgdG8gY29uc29sZS5sb2cgdGhhdCBwcmVwZW5kcyBhIHRpbWVzdGFtcFxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coJyVzIC0gJXMnLCB0aW1lc3RhbXAoKSwgZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKSk7XG59O1xuXG5cbi8qKlxuICogSW5oZXJpdCB0aGUgcHJvdG90eXBlIG1ldGhvZHMgZnJvbSBvbmUgY29uc3RydWN0b3IgaW50byBhbm90aGVyLlxuICpcbiAqIFRoZSBGdW5jdGlvbi5wcm90b3R5cGUuaW5oZXJpdHMgZnJvbSBsYW5nLmpzIHJld3JpdHRlbiBhcyBhIHN0YW5kYWxvbmVcbiAqIGZ1bmN0aW9uIChub3Qgb24gRnVuY3Rpb24ucHJvdG90eXBlKS4gTk9URTogSWYgdGhpcyBmaWxlIGlzIHRvIGJlIGxvYWRlZFxuICogZHVyaW5nIGJvb3RzdHJhcHBpbmcgdGhpcyBmdW5jdGlvbiBuZWVkcyB0byBiZSByZXdyaXR0ZW4gdXNpbmcgc29tZSBuYXRpdmVcbiAqIGZ1bmN0aW9ucyBhcyBwcm90b3R5cGUgc2V0dXAgdXNpbmcgbm9ybWFsIEphdmFTY3JpcHQgZG9lcyBub3Qgd29yayBhc1xuICogZXhwZWN0ZWQgZHVyaW5nIGJvb3RzdHJhcHBpbmcgKHNlZSBtaXJyb3IuanMgaW4gcjExNDkwMykuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB3aGljaCBuZWVkcyB0byBpbmhlcml0IHRoZVxuICogICAgIHByb3RvdHlwZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHN1cGVyQ3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBpbmhlcml0IHByb3RvdHlwZSBmcm9tLlxuICovXG5leHBvcnRzLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuZXhwb3J0cy5fZXh0ZW5kID0gZnVuY3Rpb24ob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCAhaXNPYmplY3QoYWRkKSkgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn07XG5cbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG4iXX0=
