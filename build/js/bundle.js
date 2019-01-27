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

        var easySpriteSize = {
            width: 234,
            height: 150,
            spritePosition: 0,
            spritesCount: 4
        };
        var randSize = _fns2.default.randomInt(25, 100);

        this.easy = {
            width: randSize * easySpriteSize.width / easySpriteSize.height,
            height: randSize * easySpriteSize.height / easySpriteSize.width,
            speed: 1,
            position: {
                x: _fns2.default.randomInt(170, this.canvas.width),
                y: -40
            },
            image: {
                object: resources.enemyEasyImage.object,
                spriteSize: easySpriteSize
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvQ2FudmFzR2FtZS5qcyIsImFwcC9qcy9HYW1lQ29tcG9uZW50c0luaXQvQmcuanMiLCJhcHAvanMvR2FtZUNvbXBvbmVudHNJbml0L0Jvb20uanMiLCJhcHAvanMvR2FtZUNvbXBvbmVudHNJbml0L0NvbGxpc2lvbnMuanMiLCJhcHAvanMvR2FtZUNvbXBvbmVudHNJbml0L0VuZW15LmpzIiwiYXBwL2pzL0dhbWVDb21wb25lbnRzSW5pdC9GaXJlLmpzIiwiYXBwL2pzL0dhbWVDb21wb25lbnRzSW5pdC9TaGlwLmpzIiwiYXBwL2pzL0dhbWVDb21wb25lbnRzSW5pdC9pbmRleC5qcyIsImFwcC9qcy9HYW1lQ29tcG9uZW50c0luaXQvcmVzb3VyY2VzLmpzIiwiYXBwL2pzL2RldkZucy5qcyIsImFwcC9qcy9mbnMuanMiLCJhcHAvanMvZ2FtZUNvbmYuanMiLCJhcHAvanMvbWFpbi5qcyIsIm5vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDQ0E7Ozs7Ozs7O0lBRXFCLFU7QUFDakIsd0JBQVksVUFBWixFQUF1QjtBQUFBOztBQUNuQixhQUFLLFNBQUwsR0FBaUIsSUFBakI7O0FBRUEsYUFBSyxNQUFMLEdBQWMsVUFBZDtBQUNBLGFBQUssR0FBTCxHQUFjLEtBQUssTUFBTCxDQUFZLFVBQVosQ0FBdUIsSUFBdkIsQ0FBZDs7QUFFQSxhQUFLLEtBQUwsR0FBYyxTQUFTLGVBQVQsQ0FBeUIsV0FBdkM7QUFDQSxhQUFLLE1BQUwsR0FBYyxTQUFTLGVBQVQsQ0FBeUIsWUFBdkM7O0FBRUEs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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcclxuaW1wb3J0IGdhbWVDb25mIGZyb20gJy4vZ2FtZUNvbmYnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FudmFzR2FtZXtcclxuICAgIGNvbnN0cnVjdG9yKGNhbnZhc05vZGUpe1xyXG4gICAgICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhc05vZGU7XHJcbiAgICAgICAgdGhpcy5jdHggICAgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuICAgICAgICB0aGlzLndpZHRoICA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gIHRoaXMud2lkdGg7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YUNhbnZhcyA9IGdhbWVDb25mLmRhdGFDYW52YXM7XHJcblxyXG4gICAgICAgIHRoaXMuaWRGb3JIYW5kbGVycyAgID0gMDtcclxuICAgICAgICB0aGlzLmRyYXdIYW5kbGVycyAgICA9IHt9O1xyXG4gICAgICAgIHRoaXMuYWN0aW9uc0hhbmRsZXJzID0ge307XHJcbiAgICAgICAgdGhpcy5kcmF3SGFuZGxlcnNJblN0b3BwZWRNb2RlID0gW107XHJcblxyXG4gICAgICAgIHRoaXMubG9vcCgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBkcmF3QWxsKCl7XHJcbiAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuZHJhd0hhbmRsZXJzKS5mb3JFYWNoKCggaXRlbUZuICk9PntcclxuICAgICAgICAgICAgaWYoIGl0ZW1GbiAhPSB1bmRlZmluZWQgKXtcclxuICAgICAgICAgICAgICAgIGl0ZW1GbiggdGhpcy5jdHggKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZGF0YUNhbnZhcy5mcmFtZXNBbGwrKztcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0FjdGlvbnNBbGwoKXtcclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuYWN0aW9uc0hhbmRsZXJzKS5mb3JFYWNoKCggaXRlbUZuICk9PntcclxuICAgICAgICAgICAgaWYoIGl0ZW1GbiAhPSB1bmRlZmluZWQgKXtcclxuICAgICAgICAgICAgICAgIGl0ZW1GbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQWN0aW9uSGFuZGxlciggYWN0aW9uSGFuZGxlckZuICl7XHJcbiAgICAgICAgbGV0IGlkID0gKyt0aGlzLmlkRm9ySGFuZGxlcnM7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zSGFuZGxlcnNbaWRdID0gYWN0aW9uSGFuZGxlckZuO1xyXG4gICAgICAgIHJldHVybiBpZDsgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQWN0aW9uSGFuZGxlciggaWRPZkhhbmRsZXIgKXtcclxuICAgICAgICBpZighdGhpcy5hY3Rpb25zSGFuZGxlcnNbaWRPZkhhbmRsZXJdKSByZXR1cm47XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuYWN0aW9uc0hhbmRsZXJzW2lkT2ZIYW5kbGVyXTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRIYW5kbGVyVG9EcmF3KCBkcmF3SGFuZGxlckZuICl7XHJcbiAgICAgICAgbGV0IGlkID0gKyt0aGlzLmlkRm9ySGFuZGxlcnM7XHJcbiAgICAgICAgdGhpcy5kcmF3SGFuZGxlcnNbaWRdID0gZHJhd0hhbmRsZXJGbjtcclxuICAgICAgICByZXR1cm4gaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlSGFuZGxlclRvRHJhdyggaWRPZkhhbmRsZXIgKSB7XHJcbiAgICAgICAgaWYoIXRoaXMuZHJhd0hhbmRsZXJzW2lkT2ZIYW5kbGVyXSkgcmV0dXJuO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmRyYXdIYW5kbGVyc1tpZE9mSGFuZGxlcl07XHJcbiAgICB9XHJcblxyXG4gICAgZHJhd0FsbEluU3RvcHBlZE1vZGUoKXtcclxuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5kcmF3SGFuZGxlcnNJblN0b3BwZWRNb2RlKS5mb3JFYWNoKCggaXRlbUZuICk9PntcclxuICAgICAgICAgICAgaWYoIGl0ZW1GbiAhPSB1bmRlZmluZWQgKXtcclxuICAgICAgICAgICAgICAgIGl0ZW1GbiggdGhpcy5jdHggKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZGF0YUNhbnZhcy5mcmFtZXNBbGwrKztcclxuICAgIH1cclxuXHJcbiAgICBhZGRIYW5kbGVyVG9EcmF3SW5TdG9wcGVkTW9kZSggZHJhd0hhbmRsZXJGbiApe1xyXG4gICAgICAgIGxldCBpZCA9ICsrdGhpcy5pZEZvckhhbmRsZXJzO1xyXG4gICAgICAgIHRoaXMuZHJhd0hhbmRsZXJzSW5TdG9wcGVkTW9kZVtpZF0gPSBkcmF3SGFuZGxlckZuO1xyXG4gICAgICAgIHJldHVybiBpZDtcclxuICAgIH1cclxuICAgIHJlbW92ZUhhbmRsZXJUb0RyYXdJblN0b3BwZWRNb2RlKCBpZE9mSGFuZGxlciApe1xyXG4gICAgICAgIGlmKCF0aGlzLmRyYXdIYW5kbGVyc0luU3RvcHBlZE1vZGVbaWRPZkhhbmRsZXJdKSByZXR1cm47XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuZHJhd0hhbmRsZXJzSW5TdG9wcGVkTW9kZVtpZE9mSGFuZGxlcl07IFxyXG4gICAgfVxyXG5cclxuICAgIGdvKCl7XHJcbiAgICAgICAgdGhpcy5pc1N0b3BwZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCl7XHJcbiAgICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGxvb3AoKXtcclxuICAgICAgICBsZXQgbGFzdEZ1bGxTZWNvbmRzICAgPSBwZXJmb3JtYW5jZS5ub3coKSA8IDEwMDAgPyAwIDogcGFyc2VJbnQoIHBlcmZvcm1hbmNlLm5vdygpIC8gMTAwMCApO1xyXG4gICAgICAgIGxldCBsYXN0VGltZUl0ZXJhdGlvbiA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIGxldCBsb29wID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBpdCBtdXN0IGNoZWNrIGZvciBtYXggZnBzIGFuZCBkbyBub3QgZHJhdyBjYW52YXMgaWYgaXQncyB0b28gZmFzdCxcclxuICAgICAgICAgICAgLy8gYmVjYXVzZSB0aGUgZ2FtZSBkcmF3aW5nIGlzIG9yaWVudGVkIG5vdCBmb3IgdGltZSBhbmQgZnBzIHRvZ2V0aGVyXHJcbiAgICAgICAgICAgIC8vIGJ1dCBvbmx5IGZvciBmcHMgKCB3aXRob3V0IHNpdHVhdGlvbiB3aXRoIHNwcml0ZXMgKVxyXG4gICAgICAgICAgICBpZiggIXRoaXMuaXNTdG9wcGVkXHJcbiAgICAgICAgICAgICAgICAmJiAocGVyZm9ybWFuY2Uubm93KCkgLSBsYXN0VGltZUl0ZXJhdGlvbikgPiAoMTAwMCAvIGdhbWVDb25mLm1heEZyYW1lc0luU2Vjb25kKSApe1xyXG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgZm9yIGZwc1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vd0Z1bGxTZWNvbmRzID0gcGVyZm9ybWFuY2Uubm93KCkgPCAxMDAwID8gMCA6IHBhcnNlSW50KCBwZXJmb3JtYW5jZS5ub3coKSAvIDEwMDAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiggbGFzdEZ1bGxTZWNvbmRzIDwgbm93RnVsbFNlY29uZHMgKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFDYW52YXMuZnBzID0gdGhpcy5kYXRhQ2FudmFzLmZwc0luU2Vjb25kTm93O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YUNhbnZhcy5mcHNJblNlY29uZE5vdyA9IDBcclxuICAgICAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFDYW52YXMuZnBzSW5TZWNvbmROb3crKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgbGFzdEZ1bGxTZWNvbmRzID0gbm93RnVsbFNlY29uZHM7XHJcblxyXG4gICAgICAgICAgICAgICAgbGFzdFRpbWVJdGVyYXRpb24gID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja0FjdGlvbnNBbGwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0FsbCgpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiggcGVyZm9ybWFuY2Uubm93KCkgLSBsYXN0VGltZUl0ZXJhdGlvbiA+IDEwMDAgLyBnYW1lQ29uZi5tYXhGcmFtZXNJblNlY29uZCApe1xyXG4gICAgICAgICAgICAgICAgLy8gY2FsbCB0byBkcmF3aW5nIHByZWxvYWRpbmdzIGFuZCBlbHNlIHRoYXQgbm90IG5lZWQgdG8gYXdhaXRcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0FsbEluU3RvcHBlZE1vZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBsb29wICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIGxvb3AgKTtcclxuICAgIH1cclxuXHJcbn0iLCJcclxuaW1wb3J0IGdhbWVDb25mIGZyb20gJy4uL2dhbWVDb25mJztcclxuaW1wb3J0IGZucyBmcm9tICcuLi9mbnMuanMnO1xyXG5pbXBvcnQgcmVzb3VyY2VzIGZyb20gJy4vcmVzb3VyY2VzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJnIHtcclxuICAgIGNvbnN0cnVjdG9yKGNhbnZhcywgZ2FtZU9iamVjdHMsIHJlc291cmNlcyl7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgICAgICA9IGNhbnZhcztcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3RzID0gZ2FtZU9iamVjdHM7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZXMgICA9IHJlc291cmNlcztcclxuXHJcbiAgICAgICAgdGhpcy5zdGFyc0JnRHJhd0hhbmRsZXIgPSBjYW52YXMuYWRkSGFuZGxlclRvRHJhdygoY3R4KT0+e1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdCZyhjdHgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnBsYW5ldERyYXdIYW5kbGVyID0gY2FudmFzLmFkZEhhbmRsZXJUb0RyYXcoY3R4PT57XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd1BsYW5ldChjdHgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJzTG9vcEFjdGlvbnMgPSBjYW52YXMuYWRkQWN0aW9uSGFuZGxlcigoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLmxvb3AoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmltYWdlICA9IHJlc291cmNlcy5iZ0ltYWdlLm9iamVjdDtcclxuICAgICAgICB0aGlzLnBsYW5ldCA9IHJlc291cmNlcy5wbGFuZXRJbWFnZS5vYmplY3Q7XHJcblxyXG4gICAgICAgIHRoaXMucGxhbmV0RGVncmVlID0gMDtcclxuICAgICAgICB0aGlzLnBvcyA9IHtcclxuICAgICAgICAgICAgeTE6IG51bGwsXHJcbiAgICAgICAgICAgIHkyOiBudWxsLFxyXG4gICAgICAgICAgICB5MzogbnVsbCxcclxuICAgICAgICAgICAgc2xpZGVzOiAzLFxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBkcmF3QmcoIGN0eCApe1xyXG4gICAgICAgIGlmKCB0aGlzLmltYWdlLndpZHRoID09IDAgKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoIHRoaXMucG9zLnkxID09PSBudWxsICl7XHJcbiAgICAgICAgICAgIHRoaXMucG9zLnkxID0gLXRoaXMuaW1hZ2UuaGVpZ2h0ICsgdGhpcy5jYW52YXMuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggdGhpcy5wb3MueTIgPT09IG51bGwgKXtcclxuICAgICAgICAgICAgdGhpcy5wb3MueTIgPSAtdGhpcy5pbWFnZS5oZWlnaHQgKiAyICArIHRoaXMuY2FudmFzLmhlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIHRoaXMucG9zLnkzID09PSBudWxsICl7XHJcbiAgICAgICAgICAgIHRoaXMucG9zLnkzID0gLXRoaXMuaW1hZ2UuaGVpZ2h0ICogMyAgKyB0aGlzLmNhbnZhcy5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc3BlZWQgPSAxLjU7XHJcbiAgICAgICAgbGV0IHlQb3MxID0gdGhpcy5wb3MueTE7XHJcbiAgICAgICAgbGV0IHlQb3MyID0gdGhpcy5wb3MueTI7XHJcbiAgICAgICAgbGV0IHlQb3MzID0gdGhpcy5wb3MueTM7XHJcblxyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2Uud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UuaGVpZ2h0LFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB5UG9zMSxcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UuaGVpZ2h0LFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZShcclxuICAgICAgICAgICAgdGhpcy5pbWFnZSxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS5oZWlnaHQsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHlQb3MyLFxyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS5oZWlnaHQsXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdHguZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLmhlaWdodCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgeVBvczMsXHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLmhlaWdodCxcclxuICAgICAgICApO1xyXG5cclxuICAgIFxyXG4gICAgICAgIC8vIHNlZSBlbmQgb2YgZmlyc3Qgc2NyZWVuIGltYWdlXHJcbiAgICAgICAgaWYoIHRoaXMucG9zLnkxID49IDAgKyB0aGlzLmNhbnZhcy5oZWlnaHQgJiYgdGhpcy5wb3Muc2xpZGVzICUgMyA9PT0gMCl7XHJcbiAgICAgICAgICAgIHRoaXMucG9zLnNsaWRlcysrXHJcbiAgICAgICAgICAgIHRoaXMucG9zLnkxID0gdGhpcy5wb3MueTMgLSB0aGlzLmltYWdlLmhlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoIHRoaXMucG9zLnkyID49IDAgKyB0aGlzLmNhbnZhcy5oZWlnaHQgJiYgdGhpcy5wb3Muc2xpZGVzICUgMyA9PT0gMSkge1xyXG4gICAgICAgICAgICB0aGlzLnBvcy5zbGlkZXMrK1xyXG4gICAgICAgICAgICB0aGlzLnBvcy55MiA9IHRoaXMucG9zLnkxIC0gdGhpcy5pbWFnZS5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiggdGhpcy5wb3MueTMgPj0gMCArIHRoaXMuY2FudmFzLmhlaWdodCAmJiB0aGlzLnBvcy5zbGlkZXMgJSAzID09PSAyKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zLnNsaWRlcysrXHJcbiAgICAgICAgICAgIHRoaXMucG9zLnkzID0gdGhpcy5wb3MueTIgLSB0aGlzLmltYWdlLmhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHlQb3MxID0gdGhpcy5wb3MueTEgKz0gc3BlZWQ7XHJcbiAgICAgICAgeVBvczIgPSB0aGlzLnBvcy55MiArPSBzcGVlZDsgXHJcbiAgICAgICAgeVBvczMgPSB0aGlzLnBvcy55MyArPSBzcGVlZDtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGRyYXdQbGFuZXQoIGN0eCApe1xyXG4gICAgICAgIGlmKHRoaXMucGxhbmV0LndpZHRoID09PSAwKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgbGV0IGltYWdlID0gdGhpcy5wbGFuZXQ7XHJcblxyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LnRyYW5zbGF0ZSgtdGhpcy5jYW52YXMud2lkdGgvMiArIGltYWdlLndpZHRoIC8gMiwgdGhpcy5jYW52YXMuaGVpZ2h0LzIgKyBpbWFnZS5oZWlnaHQgLyAyKTtcclxuICAgICAgICBjdHgucm90YXRlKCB0aGlzLnBsYW5ldERlZ3JlZSArPSAwLjAwMDc1ICk7XHJcbiAgICAgICAgY3R4LnRyYW5zbGF0ZSgtKC10aGlzLmNhbnZhcy53aWR0aC8yICsgaW1hZ2Uud2lkdGggLyAyKSwgLSh0aGlzLmNhbnZhcy5oZWlnaHQvMiArIGltYWdlLmhlaWdodCAvIDIpKTtcclxuICAgICAgICBjdHguZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICBpbWFnZSxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgaW1hZ2Uud2lkdGgsXHJcbiAgICAgICAgICAgIGltYWdlLmhlaWdodCxcclxuICAgICAgICAgICAgLXRoaXMuY2FudmFzLndpZHRoLzIsXHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLmhlaWdodC8yLFxyXG4gICAgICAgICAgICBpbWFnZS53aWR0aCxcclxuICAgICAgICAgICAgaW1hZ2UuaGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGxvb3AoKXtcclxuICAgICAgICBcclxuICAgIH1cclxufSIsIlxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm9vbXtcclxuICAgIGNvbnN0cnVjdG9yKGNhbnZhcywgZ2FtZU9iamVjdCwgcmVzb3VyY2VzLCBjb29yZGluYXRlLCBlbmVteSl7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XHJcblxyXG4gICAgICAgIHRoaXMuYm9vbSA9IHtcclxuICAgICAgICAgICAgaXNEZXN0cm95U3RhcnQ6IGZhbHNlLFxyXG4gICAgICAgICAgICBjb3VudGVyOiAwLFxyXG4gICAgICAgICAgICBpbWFnZTogcmVzb3VyY2VzLmJvb21JbWFnZS5vYmplY3QsXHJcbiAgICAgICAgICAgIHdpZHRoOiA2NCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA2NCxcclxuICAgICAgICAgICAgc3ByaXRlU2l6ZToge1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDUxMixcclxuICAgICAgICAgICAgICAgIGhlaWdodDogNjQsXHJcbiAgICAgICAgICAgICAgICBzcHJpdGVzQ291bnQ6IDgsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY29vcmRpbmF0ZSA9IGNvb3JkaW5hdGU7XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEhhbmRsZXJUb0RyYXcoKGN0eCk9PntcclxuICAgICAgICAgICAgdGhpcy5kcmF3Qm9vbShjdHgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgZHJhd0Jvb20oY3R4KXtcclxuICAgICAgICBsZXQgeFNwcml0ZVBvc2l0aW9uID0gKyt0aGlzLmJvb20uY291bnRlcjtcclxuXHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZShcclxuICAgICAgICAgICAgdGhpcy5ib29tLmltYWdlLFxyXG4gICAgICAgICAgICB4U3ByaXRlUG9zaXRpb24gKiB0aGlzLmJvb20ud2lkdGgsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHRoaXMuYm9vbS53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5ib29tLmhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy5jb29yZGluYXRlLnggLSB0aGlzLmJvb20ud2lkdGgvMixcclxuICAgICAgICAgICAgdGhpcy5jb29yZGluYXRlLnkgLSB0aGlzLmJvb20uaGVpZ2h0LzIsXHJcbiAgICAgICAgICAgIHRoaXMuYm9vbS53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5ib29tLmhlaWdodCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBpc0FycmF5IH0gZnJvbSBcInV0aWxcIjtcclxuaW1wb3J0IGZucyBmcm9tICcuLi9mbnMnO1xyXG5pbXBvcnQgZ2FtZUNvbmYgZnJvbSBcIi4uL2dhbWVDb25mXCI7XHJcbmltcG9ydCBCb29tIGZyb20gJy4vQm9vbSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2xsaXNpb25zIHtcclxuICAgIGNvbnN0cnVjdG9yKGNhbnZhcywgZ2FtZU9iamVjdHMsIHJlc291cmNlcywgc2hpcCl7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgICAgICA9IGNhbnZhcztcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3RzID0gZ2FtZU9iamVjdHM7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZXMgICA9IHJlc291cmNlcztcclxuICAgICAgICB0aGlzLnNoaXAgICAgICAgID0gc2hpcDtcclxuXHJcbiAgICAgICAgdGhpcy5hY3Rpb25Mb29wSGFuZGxlcklkID0gdGhpcy5jYW52YXMuYWRkQWN0aW9uSGFuZGxlcigoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLmxvb3AoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb29wKCl7XHJcbiAgICAgICAgaWYodGhpcy5jYW52YXMuaXNTdG9wcGVkKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuY2hlY2tDb2xsaXNpb25zRmlyZXNBbmRFbmVtaWVzKCk7XHJcbiAgICAgICAgdGhpcy5jaGVja0NvbGxpc2lvbnNTaGlwQW5kRW5lbWllcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrQ29sbGlzaW9uc0ZpcmVzQW5kRW5lbWllcygpe1xyXG4gICAgICAgIGxldCBmaXJlcyAgICAgID0gdGhpcy5nYW1lT2JqZWN0cy5maXJlcztcclxuICAgICAgICBsZXQgZW5lbXlTaGlwcyA9IHRoaXMuZ2FtZU9iamVjdHMuZW5lbXlTaGlwcztcclxuXHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyhmaXJlcykuZm9yRWFjaChmaXJlPT57XHJcbiAgICAgICAgICAgIE9iamVjdC52YWx1ZXMoZW5lbXlTaGlwcykuZm9yRWFjaChlbmVteT0+e1xyXG4gICAgICAgICAgICAgICAgaWYoZm5zLmNoZWNrQ29sbGlzaW9uUmVjdGFuZ2xlcyhlbmVteS5zaGlwLGZpcmUuZmlyZSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIGZpcmUuZGVsZXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZW5lbXkuc3RhcnREZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IEJvb20odGhpcy5jYW52YXMsIHRoaXMuZ2FtZU9iamVjdHMsIHRoaXMucmVzb3VyY2VzLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IGZpcmUuZmlyZS5wb3NpdGlvbi54LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiBmaXJlLmZpcmUucG9zaXRpb24ueSxcclxuICAgICAgICAgICAgICAgICAgICB9LGVuZW15KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tDb2xsaXNpb25zU2hpcEFuZEVuZW1pZXMoKXtcclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuZ2FtZU9iamVjdHMuZW5lbXlTaGlwcykuZm9yRWFjaChlbmVteT0+e1xyXG4gICAgICAgICAgICBpZihmbnMuY2hlY2tDb2xsaXNpb25SZWN0YW5nbGVzKGVuZW15LnNoaXAsIHRoaXMuc2hpcC5zaGlwLCB0cnVlKSl7XHJcbiAgICAgICAgICAgICAgICBuZXcgQm9vbSh0aGlzLmNhbnZhcywgdGhpcy5nYW1lT2JqZWN0cywgdGhpcy5yZXNvdXJjZXMsIHtcclxuICAgICAgICAgICAgICAgICAgICB4OiB0aGlzLnNoaXAuc2hpcC5wb3NpdGlvbi54LFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IHRoaXMuc2hpcC5zaGlwLnBvc2l0aW9uLnksXHJcbiAgICAgICAgICAgICAgICB9LGVuZW15KTsgICAgIFxyXG4gICAgICAgICAgICAgICAgbmV3IEJvb20odGhpcy5jYW52YXMsIHRoaXMuZ2FtZU9iamVjdHMsIHRoaXMucmVzb3VyY2VzLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgeDogZW5lbXkuc2hpcC5wb3NpdGlvbi54LFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IGVuZW15LnNoaXAucG9zaXRpb24ueSxcclxuICAgICAgICAgICAgICAgIH0sZW5lbXkpOyBcclxuICAgICAgICAgICAgICAgIGVuZW15LnN0YXJ0RGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwLmNvbGxpc2lvbldpZHRoRW5lbXkoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCJcclxuaW1wb3J0IGZucyBmcm9tICcuLi9mbnMnO1xyXG5pbXBvcnQgZ2FtZUNvbmYgZnJvbSBcIi4uL2dhbWVDb25mXCI7XHJcbmltcG9ydCByZXNvdXJjZXMgZnJvbSAnLi9yZXNvdXJjZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW5lbXl7XHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXMsIGdhbWVPYmplY3RzLCByZXNvdXJjZXMsIHR5cGUsIGlkKXtcclxuICAgICAgICB0aGlzLmNhbnZhcyAgICAgID0gY2FudmFzO1xyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdHMgPSBnYW1lT2JqZWN0cztcclxuICAgICAgICB0aGlzLnJlc291cmNlcyAgID0gcmVzb3VyY2VzO1xyXG4gICAgICAgIHRoaXMuaWQgICAgICAgICAgPSBpZDtcclxuXHJcbiAgICAgICAgdGhpcy5zaGlwO1xyXG4gICAgICAgIHRoaXMuaXNEZXN0cm95U3RhcnQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmRlc3Ryb3lGcmFtZXMgID0ge1xyXG4gICAgICAgICAgICBjb3VudGVyOiAwLFxyXG4gICAgICAgICAgICBhbGw6IGdhbWVDb25mLmJvb21TcHJpdGVzQ291bnRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGVhc3lTcHJpdGVTaXplID0ge1xyXG4gICAgICAgICAgICB3aWR0aDogMjM0LFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDE1MCxcclxuICAgICAgICAgICAgc3ByaXRlUG9zaXRpb246IDAsXHJcbiAgICAgICAgICAgIHNwcml0ZXNDb3VudDogNCxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IHJhbmRTaXplICA9IGZucy5yYW5kb21JbnQoMjUsMTAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5lYXN5ID0ge1xyXG4gICAgICAgICAgICB3aWR0aDogcmFuZFNpemUgICogZWFzeVNwcml0ZVNpemUud2lkdGggLyBlYXN5U3ByaXRlU2l6ZS5oZWlnaHQsXHJcbiAgICAgICAgICAgIGhlaWdodDogcmFuZFNpemUgKiBlYXN5U3ByaXRlU2l6ZS5oZWlnaHQgLyBlYXN5U3ByaXRlU2l6ZS53aWR0aCxcclxuICAgICAgICAgICAgc3BlZWQ6IDEsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICB4OiBmbnMucmFuZG9tSW50KDE3MCAsIHRoaXMuY2FudmFzLndpZHRoKSxcclxuICAgICAgICAgICAgICAgIHk6IC00MCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaW1hZ2U6IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdDogcmVzb3VyY2VzLmVuZW15RWFzeUltYWdlLm9iamVjdCxcclxuICAgICAgICAgICAgICAgIHNwcml0ZVNpemU6IGVhc3lTcHJpdGVTaXplLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzb3VuZDoge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0OiByZXNvdXJjZXMuYm9vbUVuZW15U291bmQub2JqZWN0XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gXHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJlYXN5XCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoaXAgPSB0aGlzLmVhc3k7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCl7XHJcblxyXG4gICAgICAgIHRoaXMuZHJhd0hhbmRsZXIgPSB0aGlzLmNhbnZhcy5hZGRIYW5kbGVyVG9EcmF3KChjdHgpPT57XHJcbiAgICAgICAgICAgIHRoaXMubW92ZURyYXcoY3R4KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hY3Rpb25Nb3ZlSGFuZGxlciA9IHRoaXMuY2FudmFzLmFkZEFjdGlvbkhhbmRsZXIoKCk9PntcclxuICAgICAgICAgICAgdGhpcy5zaGlwLnBvc2l0aW9uLnkgKz0gdGhpcy5zaGlwLnNwZWVkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmVEcmF3KCBjdHggKXtcclxuICAgICAgICBsZXQgeFNwcml0ZVBvc2l0aW9uID1cclxuICAgICAgICAgICAgdGhpcy5zaGlwLmltYWdlLnNwcml0ZVNpemUuc3ByaXRlUG9zaXRpb24gPCB0aGlzLnNoaXAuaW1hZ2Uuc3ByaXRlU2l6ZS5zcHJpdGVzQ291bnQgLSAxXHJcbiAgICAgICAgICAgID8gKyt0aGlzLnNoaXAuaW1hZ2Uuc3ByaXRlU2l6ZS5zcHJpdGVQb3NpdGlvblxyXG4gICAgICAgICAgICA6IHRoaXMuc2hpcC5pbWFnZS5zcHJpdGVTaXplLnNwcml0ZVBvc2l0aW9uID0gMDtcclxuXHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZShcclxuICAgICAgICAgICAgdGhpcy5zaGlwLmltYWdlLm9iamVjdCxcclxuICAgICAgICAgICAgeFNwcml0ZVBvc2l0aW9uICogdGhpcy5zaGlwLmltYWdlLnNwcml0ZVNpemUud2lkdGgsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHRoaXMuc2hpcC5pbWFnZS5zcHJpdGVTaXplLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLnNoaXAuaW1hZ2Uuc3ByaXRlU2l6ZS5oZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMuc2hpcC5wb3NpdGlvbi54IC0gdGhpcy5zaGlwLndpZHRoIC8gMixcclxuICAgICAgICAgICAgdGhpcy5zaGlwLnBvc2l0aW9uLnkgLSB0aGlzLnNoaXAuaGVpZ2h0IC8gMixcclxuICAgICAgICAgICAgdGhpcy5zaGlwLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLnNoaXAuaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLmNoZWNrRm9yT3V0U2NyZWVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnREZXN0cm95KCl7XHJcbiAgICAgICAgaWYodGhpcy5pc0Rlc3Ryb3lTdGFydCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuaXNEZXN0cm95U3RhcnQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucGxheVNvdW5kRGVzdHJveWluZygpO1xyXG4gICAgICAgIHRoaXMuYWN0aW9uRGVzdHJveUhhbmRsZXIgPSB0aGlzLmNhbnZhcy5hZGRBY3Rpb25IYW5kbGVyKCgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuc2hpcC5zcGVlZCA9IHRoaXMuc2hpcC5zcGVlZCAqIDAuNSArIDE7XHJcbiAgICAgICAgICAgIGlmKCsrdGhpcy5kZXN0cm95RnJhbWVzLmNvdW50ZXIgPj0gdGhpcy5kZXN0cm95RnJhbWVzLmFsbCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcGxheVNvdW5kRGVzdHJveWluZygpe1xyXG4gICAgICAgIGxldCBzb3VuZERlc3Ryb3lUb1BsYXkgPSBuZXcgQXVkaW8oKTtcclxuICAgICAgICBzb3VuZERlc3Ryb3lUb1BsYXkuc3JjID0gdGhpcy5zaGlwLnNvdW5kLm9iamVjdC5zcmM7XHJcbiAgICAgICAgc291bmREZXN0cm95VG9QbGF5LnBsYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0Zvck91dFNjcmVlbigpe1xyXG4gICAgICAgIGlmKCB0aGlzLnNoaXAucG9zaXRpb24ueSA+IHRoaXMuY2FudmFzLmhlaWdodCApIHtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlKCl7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuZ2FtZU9iamVjdHMuZW5lbXlTaGlwc1t0aGlzLmlkXTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5yZW1vdmVBY3Rpb25IYW5kbGVyKHRoaXMuYWN0aW9uTW92ZUhhbmRsZXIpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUhhbmRsZXJUb0RyYXcoIHRoaXMuZHJhd0hhbmRsZXIgKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5yZW1vdmVIYW5kbGVyVG9EcmF3KCB0aGlzLmRyYXdEZXN0cm95SGFuZGxlciApO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUFjdGlvbkhhbmRsZXIoIHRoaXMuYWN0aW9uTW92ZUhhbmRsZXIgKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5yZW1vdmVBY3Rpb25IYW5kbGVyKCB0aGlzLmFjdGlvbkRlc3Ryb3lIYW5kbGVyICk7XHJcbiAgICB9XHJcbn0iLCJcclxuaW1wb3J0IGdhbWVDb25mIGZyb20gJy4uL2dhbWVDb25mJztcclxuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJ3V0aWwnO1xyXG5pbXBvcnQgcmVzb3VyY2VzIGZyb20gJy4vcmVzb3VyY2VzJztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaXJlIHtcclxuICAgIGNvbnN0cnVjdG9yKCBjYW52YXMsIGdhbWVPYmplY3RzLCByZXNvdXJjZXMsIGRhdGFPYmogKXtcclxuICAgICAgICB0aGlzLmNhbnZhcyAgICAgID0gY2FudmFzO1xyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdHMgPSBnYW1lT2JqZWN0cztcclxuICAgICAgICB0aGlzLnJlc291cmNlcyAgID0gcmVzb3VyY2VzO1xyXG4gICAgICAgIHRoaXMuZmlyZU1vdmVIYW5kbGVySWQ7XHJcblxyXG4gICAgICAgIHRoaXMuZmlyZSA9IHtcclxuICAgICAgICAgICAgaWQ6IGRhdGFPYmouaWQsXHJcbiAgICAgICAgICAgIHdpZHRoOiA1LFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDEwLFxyXG4gICAgICAgICAgICBjb2xvcjogXCIjRkYwMDAwXCIsXHJcbiAgICAgICAgICAgIHNwZWVkOiAzNyxcclxuICAgICAgICAgICAgcG9zaXRpb246IHtcclxuICAgICAgICAgICAgICAgIHg6IGRhdGFPYmoucG9zaXRpb24ueCxcclxuICAgICAgICAgICAgICAgIHk6IGRhdGFPYmoucG9zaXRpb24ueSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc291bmQ6IGRhdGFPYmouc291bmQoKSxcclxuICAgICAgICAgICAgaW1hZ2U6IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdDogcmVzb3VyY2VzLmZpcmVJbWFnZS5vYmplY3QsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgIC8vIHRoaXMgYXR0ciBpcyBkaWZmZXJlbnQgZnJpZW5kbHkgYW5kIG5vdCBzaG9vdCdzXHJcbiAgICAgICAgLy8gLTEgOiBmcmllbmRseSwgIDEgOiBpcyBub3RcclxuICAgICAgICB0aGlzLmlzRW5lbWllcyA9IC0xOyAgICAgICBcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICB0aGlzLmZpcmUuc291bmQucGxheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKXtcclxuICAgICAgICB0aGlzLmZpcmVNb3ZlSGFuZGxlcklkID0gdGhpcy5jYW52YXMuYWRkSGFuZGxlclRvRHJhdygoY3R4KT0+e1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVNb3ZlKGN0eCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZmlyZU1vdmUoIGN0eCApe1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmZpcmUuY29sb3I7XHJcbiAgICAgICAgbGV0IG5ld1kgPSB0aGlzLmZpcmUucG9zaXRpb24ueSArPSB0aGlzLmZpcmUuc3BlZWQgKiB0aGlzLmlzRW5lbWllcztcclxuXHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZShcclxuICAgICAgICAgICAgdGhpcy5maXJlLmltYWdlLm9iamVjdCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdGhpcy5maXJlLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmZpcmUuaGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLmZpcmUucG9zaXRpb24ueCAtIHRoaXMuZmlyZS53aWR0aCAvIDIsXHJcbiAgICAgICAgICAgIHRoaXMuZmlyZS5wb3NpdGlvbi55IC0gdGhpcy5maXJlLmhlaWdodCAvIDIsXHJcbiAgICAgICAgICAgIHRoaXMuZmlyZS53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5maXJlLmhlaWdodCxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLmNoZWNrRm9yT3V0U2NyZWVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tGb3JPdXRTY3JlZW4oKXtcclxuICAgICAgICBpZiggdGhpcy5maXJlLnBvc2l0aW9uLnkgPCAwICkge1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZWxldGUoKXtcclxuICAgICAgICBkZWxldGUgdGhpcy5nYW1lT2JqZWN0cy5maXJlc1t0aGlzLmZpcmUuaWRdO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUhhbmRsZXJUb0RyYXcoIHRoaXMuZmlyZU1vdmVIYW5kbGVySWQgKTtcclxuICAgIH1cclxufSIsIlxyXG5pbXBvcnQgZ2FtZUNvbmYgZnJvbSAnLi4vZ2FtZUNvbmYnO1xyXG5pbXBvcnQgRmlyZSBmcm9tICcuL0ZpcmUnO1xyXG5pbXBvcnQgcmVzb3VyY2VzIGZyb20gJy4vcmVzb3VyY2VzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoaXAge1xyXG4gICAgY29uc3RydWN0b3IoIGNhbnZhcywgZ2FtZU9iamVjdHMsIHJlc291cmNlcyApe1xyXG4gICAgICAgIHRoaXMuZ2FtZUNvbmYgICAgPSBnYW1lQ29uZjsgXHJcbiAgICAgICAgdGhpcy5jYW52YXMgICAgICA9IGNhbnZhcztcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3RzID0gZ2FtZU9iamVjdHM7XHJcbiAgICAgICAgdGhpcy5yZXNvdXJjZXMgICA9IHJlc291cmNlcztcclxuICAgICAgICB0aGlzLmltYWdlICA9IHtcclxuICAgICAgICAgICAgb2JqZWN0OiByZXNvdXJjZXMuc2hpcEltYWdlLm9iamVjdCxcclxuICAgICAgICAgICAgc3ByaXRlU2l6ZToge1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDY4LFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAxMjgsXHJcbiAgICAgICAgICAgICAgICBzcHJpdGVQb3NpdGlvbjogMCxcclxuICAgICAgICAgICAgICAgIHNwcml0ZXNDb3VudDogNCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNvdW5kcyA9IHtcclxuICAgICAgICAgICAgbGFzZXI6IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdDogcmVzb3VyY2VzLmZpcmVTb3VuZC5vYmplY3QsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5zaGlwICA9IHtcclxuICAgICAgICAgICAgd2lkdGg6IDM0LFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDY0LFxyXG4gICAgICAgICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgeDogZ2FtZUNvbmYubW91c2UueCxcclxuICAgICAgICAgICAgICAgIHk6IGdhbWVDb25mLm1vdXNlLnksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxpZmVzOiBnYW1lQ29uZi5kZWZhdWx0TGlmZXMsXHJcbiAgICAgICAgICAgIGxhc3RGcmFtZUNvdW50T2ZGaXJlQ3JlYXRlOiAwLFxyXG4gICAgICAgICAgICBjYW5Ub3VjaDogdHJ1ZSxcclxuICAgICAgICAgICAgY2FuTW92ZTogdHJ1ZSxcclxuICAgICAgICAgICAgX3NoaWVsZEVuYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGdldCBzaGllbGRFbmFibGUoKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zaGllbGRFbmFibGU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldCBzaGllbGRFbmFibGUodmFsdWUpe1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPyBzZWxmLnNoaWVsZEVuYWJsZSgpIDogdGhpcy5fc2hpZWxkRW5hYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZGlzYWJsZU1vdmVUaW1lID0gMjUwMDtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpe1xyXG4gICAgICAgIHRoaXMubW92ZUhhbmRsZXJJZCA9IHRoaXMuY2FudmFzLmFkZEhhbmRsZXJUb0RyYXcoKGN0eCk9PntcclxuICAgICAgICAgICAgdGhpcy5zaGlwTW92ZShjdHgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmlyZUFjdGlvbkhhbmRsZXJJZCA9IHRoaXMuY2FudmFzLmFkZEFjdGlvbkhhbmRsZXIoKCk9PntcclxuICAgICAgICAgICAgZ2FtZUNvbmYubW91c2UubW91c2VEb3duLnZhbHVlID8gdGhpcy5zaGlwRmlyZSggdGhpcy5jYW52YXMuY3R4ICkgOiBcIlwiO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMubW92ZUFjdGlvbkhhbmRsZXJJZCA9IHRoaXMuY2FudmFzLmFkZEFjdGlvbkhhbmRsZXIoKCk9PntcclxuICAgICAgICAgICAgaWYoIXRoaXMuc2hpcC5jYW5Nb3ZlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuc2hpcC5wb3NpdGlvbi54ID0gZ2FtZUNvbmYubW91c2UueDtcclxuICAgICAgICAgICAgdGhpcy5zaGlwLnBvc2l0aW9uLnkgPSBnYW1lQ29uZi5tb3VzZS55O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNoaXBNb3ZlKCBjdHggKXtcclxuXHJcbiAgICAgICAgbGV0IHhTcHJpdGVQb3NpdGlvbiA9XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2Uuc3ByaXRlU2l6ZS5zcHJpdGVQb3NpdGlvbiA8IHRoaXMuaW1hZ2Uuc3ByaXRlU2l6ZS5zcHJpdGVzQ291bnQgLSAxXHJcbiAgICAgICAgICAgID8gKyt0aGlzLmltYWdlLnNwcml0ZVNpemUuc3ByaXRlUG9zaXRpb25cclxuICAgICAgICAgICAgOiB0aGlzLmltYWdlLnNwcml0ZVNpemUuc3ByaXRlUG9zaXRpb24gPSAwO1xyXG5cclxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShcclxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2Uub2JqZWN0LFxyXG4gICAgICAgICAgICAgICAgeFNwcml0ZVBvc2l0aW9uICogdGhpcy5pbWFnZS5zcHJpdGVTaXplLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcC53aWR0aCAqIDIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoaXAuaGVpZ2h0ICogMixcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcC5wb3NpdGlvbi54IC0gdGhpcy5zaGlwLndpZHRoIC8gMixcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcC5wb3NpdGlvbi55IC0gdGhpcy5zaGlwLmhlaWdodCAvIDIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoaXAud2lkdGgsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoaXAuaGVpZ2h0LFxyXG4gICAgICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzaGlwRmlyZSggY3R4ICl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoIE1hdGguYWJzKCBnYW1lQ29uZi5kYXRhQ2FudmFzLmZyYW1lc0FsbCAtIHRoaXMuc2hpcC5sYXN0RnJhbWVDb3VudE9mRmlyZUNyZWF0ZSApIDwgNCApe1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2hpcC5sYXN0RnJhbWVDb3VudE9mRmlyZUNyZWF0ZSA9IGdhbWVDb25mLmRhdGFDYW52YXMuZnJhbWVzQWxsO1xyXG4gICAgICAgIGxldCBpZCA9ICsrdGhpcy5nYW1lT2JqZWN0cy5pZENvdW50ZXI7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0cy5maXJlc1tpZF0gPSBuZXcgRmlyZSh0aGlzLmNhbnZhcywgdGhpcy5nYW1lT2JqZWN0cywgdGhpcy5yZXNvdXJjZXMsIHtcclxuICAgICAgICAgICAgaWQ6IGlkLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgeDogdGhpcy5zaGlwLnBvc2l0aW9uLngsXHJcbiAgICAgICAgICAgICAgICB5OiB0aGlzLnNoaXAucG9zaXRpb24ueSAtIHRoaXMuc2hpcC5oZWlnaHQgLyAyLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzb3VuZDogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNvdW5kID0gbmV3IEF1ZGlvO1xyXG4gICAgICAgICAgICAgICAgc291bmQuc3JjID0gdGhpcy5zb3VuZHMubGFzZXIub2JqZWN0LnNyYztcclxuICAgICAgICAgICAgICAgIHJldHVybiBzb3VuZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgY29sbGlzaW9uV2lkdGhFbmVteSgpe1xyXG4gICAgICAgXHJcbiAgICAgICAgaWYoIXRoaXMuc2hpcC5jYW5Ub3VjaCkgcmV0dXJuO1xyXG4gICAgICAgIC8vIHRoaXMuc2hpcC5jYW5Ub3VjaCA9IGZhbHNlOy5ra2tsbFxyXG5cclxuICAgICAgICB0aGlzLmxpZmVTaGlmdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGxpZmVTaGlmdCgpe1xyXG4gICAgXHJcbiAgICAgICAgdGhpcy5tb3ZlU3RvcHBlZEFuZFNldFN0YXJ0UG9zaXRpb24oKTtcclxuICAgICAgICB0aGlzLnNoaWVsZEVuYWJsZSgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGlmKC0tdGhpcy5zaGlwLmxpZmVzID4gMCl7XHJcbiAgICAgICAgLy8gICAgIC8vIHRoaXMubG9vc2VMdmwoKTtcclxuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ3F3ZTInKVxyXG4gICAgICAgIC8vICAgICB0aGlzLm1vdmVTdG9wcGVkKCk7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuc2hpZWxkRW5hYmxlKCk7XHJcbiAgICAgICAgLy8gfSBlbHNlIHtcclxuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ3F3ZTEyMzQnKVxyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgbW92ZVN0b3BwZWRBbmRTZXRTdGFydFBvc2l0aW9uKCl7XHJcbiAgICAgICB0aGlzLnNoaXAuY2FuTW92ZSA9IGZhbHNlO1xyXG4gICAgICAgIC8vIG1vdmUgc2hpcCB0byBzdGFydFxyXG5cclxuICAgICAgICB0aGlzLnNoaXAucG9zaXRpb24ueCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcclxuICAgICAgICB0aGlzLnNoaXAucG9zaXRpb24ueSA9IHdpbmRvdy5pbm5lckhlaWdodCAtIDE1MDtcclxuICAgICAgICBcclxuICAgICAgICBzZXRUaW1lb3V0KCgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuc2hpcC5jYW5Nb3ZlID0gdHJ1ZTtcclxuICAgICAgICB9LHRoaXMuZGlzYWJsZU1vdmVUaW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzaGllbGRFbmFibGUoIGZyYW1lQ291bnRlckZvckVuYWJsZSA9IDYwICogMiApe1xyXG4gICAgICAgXHJcbiAgICAgICAgdGhpcy5zaGlwLmNhblRvdWNoID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zaGllbGREcmF3SWQgPSB0aGlzLmNhbnZhcy5hZGRIYW5kbGVyVG9EcmF3KGN0eD0+e1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcIndoaXRlXCI7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4LmFyYyhcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcC5wb3NpdGlvbi54LFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwLnBvc2l0aW9uLnksXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoaXAuaGVpZ2h0ID4gdGhpcy5zaGlwLndpZHRoID9cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNoaXAuaGVpZ2h0ICsgMVxyXG4gICAgICAgICAgICAgICAgICAgIDogdGhpcy5zaGlwLndpZHRoICsgMSxcclxuICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgZnJhbWVzQ291bnRXaGVuU2hpZWxkU3RhcnQgPSBnYW1lQ29uZi5kYXRhQ2FudmFzLmZyYW1lc0FsbDtcclxuICAgICAgICBsZXQgbG9vcElkID0gdGhpcy5jYW52YXMuYWRkQWN0aW9uSGFuZGxlcigoZ2FtZUNvbmYpPT57XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZ2FtZUNvbmYuZGF0YUNhbnZhcy5mcmFtZXNBbGwgLSBmcmFtZXNDb3VudFdoZW5TaGllbGRTdGFydCA+IGZyYW1lQ291bnRlckZvckVuYWJsZSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5yZW1vdmVIYW5kbGVyVG9EcmF3KHRoaXMuc2hpZWxkRHJhd0lkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUFjdGlvbkhhbmRsZXIobG9vcElkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcC5zaGllbGRFbmFibGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcC5jYW5Ub3VjaCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgbG9vc2VMdmwoKXtcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdG9wKCk7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIlxyXG5cclxuaW1wb3J0IFNoaXAgZnJvbSAnLi9TaGlwJztcclxuaW1wb3J0IGdhbWVDb25mIGZyb20gXCIuLi9nYW1lQ29uZlwiO1xyXG5pbXBvcnQgQmcgZnJvbSAnLi9CZyc7XHJcbmltcG9ydCBFbmVteSBmcm9tICcuL0VuZW15JztcclxuaW1wb3J0IENvbGxpc2lvbnMgZnJvbSAnLi9Db2xsaXNpb25zJztcclxuaW1wb3J0IHJlc291cmNlcyBmcm9tICcuL3Jlc291cmNlcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQ29tcG9uZW50c0luaXR7XHJcbiAgICBjb25zdHJ1Y3RvciggY2FudmFzICl7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0cyA9IHtcclxuICAgICAgICAgICAgaWRDb3VudGVyOiAtMSxcclxuICAgICAgICAgICAgZmlyZXM6IHt9LFxyXG4gICAgICAgICAgICBlbmVteVNoaXBzOiB7fSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnJlc291cmNlcyA9IHJlc291cmNlcygpO1xyXG5cclxuICAgICAgICB0aGlzLkJnICAgPSBuZXcgQmcoIGNhbnZhcywgdGhpcy5nYW1lT2JqZWN0cywgdGhpcy5yZXNvdXJjZXMgKTtcclxuICAgICAgICB0aGlzLnNoaXAgPSBuZXcgU2hpcCggY2FudmFzLCB0aGlzLmdhbWVPYmplY3RzLCB0aGlzLnJlc291cmNlcyApO1xyXG5cclxuICAgICAgICB0aGlzLnByZUxvYWRlcigpO1xyXG4gICAgICAgIHRoaXMubG9hZFJlc291cmNlcygpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlRW5lbWllcygpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbGxpc2lvbkNoZWNrZXIgPSBuZXcgQ29sbGlzaW9ucyhjYW52YXMsIHRoaXMuZ2FtZU9iamVjdHMsIHRoaXMucmVzb3VyY2VzLCB0aGlzLnNoaXApO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUVuZW1pZXMoKXtcclxuICAgICAgICBjb25zdCBlbmVteU1hcCA9IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZnJvbUZyYW1lOiAzMCxcclxuICAgICAgICAgICAgICAgIGVuZW15VHlwZTogXCJlYXN5XCIsXHJcbiAgICAgICAgICAgICAgICBlbmVteUNvdW50OiA1NTUsXHJcbiAgICAgICAgICAgICAgICBlbmVteURlbGF5OiAzNSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICB0aGlzLmVuZW1pZXNDcmVhdGVBY3Rpb25IYW5kbGVySWQgPSB0aGlzLmNhbnZhcy5hZGRBY3Rpb25IYW5kbGVyKCgpPT57XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGVuZW15TWFwLmZvckVhY2goZW5lbXlNYXBQYXJ0PT57XHJcbiAgICAgICAgICAgICAgIGxldCBmcmFtZU5vdyA9IGdhbWVDb25mLmRhdGFDYW52YXMuZnJhbWVzQWxsO1xyXG4gICAgICAgICAgICAgICBpZihmcmFtZU5vdyA+PSBlbmVteU1hcFBhcnQuZnJvbUZyYW1lXHJcbiAgICAgICAgICAgICAgICAmJiBlbmVteU1hcFBhcnQuZW5lbXlDb3VudCA+IDBcclxuICAgICAgICAgICAgICAgICYmIGZyYW1lTm93ICUgZW5lbXlNYXBQYXJ0LmVuZW15RGVsYXkgPT09IDApe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpZCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lT2JqZWN0cy5lbmVteVNoaXBzWysrdGhpcy5nYW1lT2JqZWN0cy5pZENvdW50ZXJdID0gbmV3IEVuZW15KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lT2JqZWN0cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZW15TWFwUGFydC5lbmVteVR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZU9iamVjdHMuaWRDb3VudGVyKTtcclxuICAgICAgICAgICAgICAgICAgICBlbmVteU1hcFBhcnQuZW5lbXlDb3VudC0tO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKXtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJlTG9hZGVyKCl7XHJcbiAgICAgICAgbGV0IHByZUxvYWRlckhhbmRsZXIgPSAoIGN0eCApID0+IHtcclxuXHJcbiAgICAgICAgICAgIGxldCBhbGxDb3VudGVyID0gT2JqZWN0LmtleXModGhpcy5yZXNvdXJjZXMpLmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IGlzTG9hZENvdW50ZXIgPSBPYmplY3QudmFsdWVzKHRoaXMucmVzb3VyY2VzKS5maWx0ZXIoaXRlbT0+e1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uaXNSZWFkeTtcclxuICAgICAgICAgICAgfSkubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwicmVkXCI7XHJcbiAgICAgICAgICAgIGxldCBwcmVMb2FkZXJMaW5lSGVpZ2h0ID0gMztcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMud2lkdGggLyAxMCxcclxuICAgICAgICAgICAgICAgICh0aGlzLmNhbnZhcy5oZWlnaHQgLyAyKSAtIHByZUxvYWRlckxpbmVIZWlnaHQgLyAyLFxyXG4gICAgICAgICAgICAgICAgKHRoaXMuY2FudmFzLndpZHRoIC8gMTApICogOCAqIChpc0xvYWRDb3VudGVyIC8gYWxsQ291bnRlciksXHJcbiAgICAgICAgICAgICAgICBwcmVMb2FkZXJMaW5lSGVpZ2h0XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnByZUxvYWRlckRyYXdIYW5kbGVySWQgPSB0aGlzLmNhbnZhcy5hZGRIYW5kbGVyVG9EcmF3SW5TdG9wcGVkTW9kZShjdHg9PntcclxuICAgICAgICAgICAgcHJlTG9hZGVySGFuZGxlcihjdHgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRSZXNvdXJjZXMoKXtcclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMucmVzb3VyY2VzKS5mb3JFYWNoKGl0ZW09PntcclxuICAgICAgICAgICAgaXRlbS5pc1JlYWR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoaXRlbS50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiaW1hZ2VcIjpcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLm9iamVjdC5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uaXNSZWFkeSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNvdW5kXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5vYmplY3Qub25jYW5wbGF5dGhyb3VnaCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5pc1JlYWR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IHQgPSBzZXRJbnRlcnZhbCgoKT0+e1xyXG4gICAgICAgICAgICBsZXQgaXNSZWFkeSA9IE9iamVjdC52YWx1ZXModGhpcy5yZXNvdXJjZXMpLmV2ZXJ5KGl0ZW09PntcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmlzUmVhZHlcclxuICAgICAgICAgICAgICAgICAgICAmJiAoIGl0ZW0ub2JqZWN0LmNvbXBsZXRlICE9IDAgfHwgIGl0ZW0ub2JqZWN0Lm5hdHVyYWxIZWlnaHQgIT0gMClcclxuICAgICAgICAgICAgICAgICAgICAmJiBpdGVtLm9iamVjdC53aWR0aCAhPSAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZihpc1JlYWR5KXtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5nbygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodCk7XHJcbiAgICAgICAgICAgICAgICB9LCAyNTUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7IFxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpe1xyXG4gICAgbGV0IHJlc291cmNlcyA9IHtcclxuICAgICAgICBzaGlwSW1hZ2U6IHtcclxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZVwiLFxyXG4gICAgICAgICAgICBvYmplY3Q6IG5ldyBJbWFnZSgpLFxyXG4gICAgICAgICAgICBzcmM6IFwiaW1hZ2VzL3NoaXAucG5nXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbmVteUVhc3lJbWFnZToge1xyXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlXCIsXHJcbiAgICAgICAgICAgIG9iamVjdDogbmV3IEltYWdlKCksXHJcbiAgICAgICAgICAgIHNyYzogXCJpbWFnZXMvZW5lbXlfZWFzeV9zaGlwLnBuZ1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyZUltYWdlOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2VcIixcclxuICAgICAgICAgICAgb2JqZWN0OiBuZXcgSW1hZ2UoKSxcclxuICAgICAgICAgICAgc3JjOiBcImltYWdlcy9zaG9vdF9sYXNlci5wbmdcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyZVNvdW5kOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwic291bmRcIixcclxuICAgICAgICAgICAgb2JqZWN0OiBuZXcgQXVkaW8sXHJcbiAgICAgICAgICAgIHNyYzogXCJzb3VuZHMvc2hpcF9vd25fbGFzZXIubXAzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBsYW5ldEltYWdlOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2VcIixcclxuICAgICAgICAgICAgb2JqZWN0OiBuZXcgSW1hZ2UoKSxcclxuICAgICAgICAgICAgc3JjOiBcImltYWdlcy9wbGFuZXQucG5nXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBiZ0ltYWdlOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2VcIixcclxuICAgICAgICAgICAgb2JqZWN0OiBuZXcgSW1hZ2UoKSxcclxuICAgICAgICAgICAgc3JjOiBcImltYWdlcy9iZzIuanBnXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvb21JbWFnZToge1xyXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlXCIsXHJcbiAgICAgICAgICAgIG9iamVjdDogbmV3IEltYWdlKCksXHJcbiAgICAgICAgICAgIHNyYzogXCJpbWFnZXMvYm9vbS5wbmdcIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvb21FbmVteVNvdW5kOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwic291bmRcIixcclxuICAgICAgICAgICAgb2JqZWN0OiBuZXcgQXVkaW8oKSxcclxuICAgICAgICAgICAgc3JjOiBcInNvdW5kcy9lbmVteV9ib29tLm1wM1wiLFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBPYmplY3QudmFsdWVzKHJlc291cmNlcykuZm9yRWFjaCgob2JqKT0+e1xyXG4gICAgICAgIG9iai5vYmplY3Quc3JjID0gb2JqLnNyYztcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiByZXNvdXJjZXM7XHJcbn07IiwiXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzaG93RnBzKCBmcHNWYWx1ZSApIHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mcHMnKS5pbm5lckhUTUwgPSBgRlBTOiAke2Zwc1ZhbHVlfWA7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuIiwiaW1wb3J0IEVuZW15IGZyb20gJy4vR2FtZUNvbXBvbmVudHNJbml0L0VuZW15J1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgcmFuZG9tRmxvYXQ6IGZ1bmN0aW9uKG1pbixtYXgpe1xyXG4gICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XHJcbiAgICB9LFxyXG4gICAgcmFuZG9tSW50OiBmdW5jdGlvbihtaW4sbWF4KXtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikpICsgbWluO1xyXG4gICAgfSxcclxuICAgIGNoZWNrQ29sbGlzaW9uUmVjdGFuZ2xlczogZnVuY3Rpb24oIG9iakEsIG9iakIsIGZyb20gKXtcclxuICAgICAgICAvLyBpdCdzIG5lZWQgZm9yIG9uZSB0eXBlIG9mIG9iamVjdCBzdHJ1Y3R1cmU6IFxyXG4gICAgICAgIC8vIG11c3QgdG8gdXNlIG9iai5wb3NpdGlvbiA9IHt4OiB2YWx1ZSwgeTogdmFsdWV9ICYmICggb2JqLndpZHRoICYmIG9iai5oZWlnaHQgKVxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB7IHg6YXggLCB5OmF5IH0gPSBvYmpBLnBvc2l0aW9uO1xyXG4gICAgICAgIGxldCB7IHg6YnggLCB5OmJ5IH0gPSBvYmpCLnBvc2l0aW9uO1xyXG4gICAgICAgIGxldCB7IHdpZHRoOmF3ICwgaGVpZ2h0OmFoIH0gPSBvYmpBO1xyXG4gICAgICAgIGxldCB7IHdpZHRoOmJ3ICwgaGVpZ2h0OmJoIH0gPSBvYmpCO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBheExlZnQgICA9IGF4IC0gYXcvMjtcclxuICAgICAgICBsZXQgYXhSaWdodCAgPSBheCArIGF3LzI7XHJcbiAgICAgICAgbGV0IGF5VG9wICAgID0gYXkgLSBhaC8yO1xyXG4gICAgICAgIGxldCBheUJvdHRvbSA9IGF5ICsgYWgvMjtcclxuXHJcbiAgICAgICAgbGV0IGJ4TGVmdCAgID0gYnggLSBidy8yO1xyXG4gICAgICAgIGxldCBieFJpZ2h0ICA9IGJ4ICsgYncvMjtcclxuICAgICAgICBsZXQgYnlUb3AgICAgPSBieSAtIGJoLzI7XHJcbiAgICAgICAgbGV0IGJ5Qm90dG9tID0gYnkgKyBiaC8yO1xyXG5cclxuICAgICAgICAvLyBmb3IgY29sbGlzaW9uIG9mIDIgcmVjdGFuZ2xlcyBuZWVkIDQgY29uZGl0aW9uczpcclxuICAgICAgICAvLyAxKSBheFJpZ2h0ICA+IGJ4TGVmdCAgICAgOiByaWdodCBzaWRlIFggY29vcmRpbmF0ZSBvZiAxLXN0IHJlY3QgbW9yZSB0aGFuIGxlZnQgc2l6ZSBYIGNvb3JkaW5hdGUgMi1uZFxyXG4gICAgICAgIC8vIDIpIGF4TGVmdCAgIDwgYnhSaWdodCAgICA6IC4uLlxyXG4gICAgICAgIC8vIDMpIGF5Qm90dG9tID4gYnlUb3AgICAgICBcclxuICAgICAgICAvLyA0KSBheVRvcCAgICA8IGJ5Qm90dG9tXHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgYXhSaWdodCAgPiBieExlZnQgICAmJlxyXG4gICAgICAgICAgICBheExlZnQgICA8IGJ4UmlnaHQgICYmXHJcbiAgICAgICAgICAgIGF5Qm90dG9tID4gYnlUb3AgICAgJiZcclxuICAgICAgICAgICAgYXlUb3AgICAgPCBieUJvdHRvbSA/IHRydWUgOiBmYWxzZVxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG59OyIsImltcG9ydCBzaG93RnBzIGZyb20gJy4vZGV2Rm5zJztcclxuXHJcblxyXG4vLyBpdCB3aWxsIG5ld2VyIGJlICdwcm9kJ1xyXG5jb25zdCBnYW1lTW9kZSA9ICdkZXYnO1xyXG5cclxubGV0IG9iaiA9IHtcclxuICAgIG1heEZyYW1lc0luU2Vjb25kOiA2MCxcclxuICAgIG1vdXNlOiB7XHJcbiAgICAgICAgeDogMCxcclxuICAgICAgICB5OiAwLFxyXG4gICAgICAgIG1vdXNlRG93bjoge1xyXG4gICAgICAgICAgICB2YWx1ZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGV2ZW50OiBudWxsLFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgZGVmYXVsdExpZmVzOiA0LFxyXG4gICAgYm9vbVNwcml0ZXNDb3VudDogOCxcclxuICAgIGRhdGFDYW52YXMgOiB7XHJcbiAgICAgICAgLy8gaXRlcmF0aW9uIG9mIGZyYW1lcyBpbiBlYWNoIHNlY29uZCBcclxuICAgICAgICAvLyBmcm9tIGVhY2ggbmV3IHNlY29uZCB3aWxsID0gMFxyXG4gICAgICAgIGZwc0luU2Vjb25kTm93OiAwLCBcclxuXHJcbiAgICAgICAgLy8gbWF4IGZyYW1lcyBjb3VudCBvbiBlYWNoIHNlY29uZFxyXG4gICAgICAgIF9mcHM6MCxcclxuICAgICAgICBzZXQgZnBzKHZhbHVlKXtcclxuICAgICAgICAgICAgdGhpcy5fZnBzID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGdhbWVNb2RlID09ICdkZXYnID8gc2hvd0Zwcyh2YWx1ZSkgOiAnJzsgXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mcHM7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXQgZnBzKCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mcHM7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBhbGwgZnJhbWVzIGZyb20gc3RhcnQgZHJhd2luZ1xyXG4gICAgICAgIC8vIHdpbGwgdXNlZCBsaWtlIHRpbWUgY291bnRlclxyXG4gICAgICAgIGZyYW1lc0FsbDogMCwgXHJcbiAgICB9LFxyXG4gICAgc291bmQ6IHtcclxuICAgICAgICBlbmFibGU6IHRydWUsXHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIHdpbmRvdy5vYmogID0gb2JqO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChldmVudCk9PntcclxuICAgIGxldCBlID0gZXZlbnQgfHwgd2luZG93LmV2ZW50O1xyXG4gICAgb2JqLm1vdXNlLnggPSBlLng7XHJcbiAgICBvYmoubW91c2UueSA9IGUueTtcclxufSk7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGV2ZW50KT0+e1xyXG5cclxuICAgIGxldCBlID0gZXZlbnQgfHwgd2luZG93LmV2ZW50O1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgb2JqLm1vdXNlLm1vdXNlRG93bi52YWx1ZSA9IHRydWU7XHJcbiAgICBvYmoubW91c2UubW91c2VEb3duLmV2ZW50ID0gZTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGxpc3RlbmVyRm9yTW91c2VVcCk7XHJcbiAgICBmdW5jdGlvbiBsaXN0ZW5lckZvck1vdXNlVXAgKCkge1xyXG4gICAgICAgIG9iai5tb3VzZS5tb3VzZURvd24udmFsdWUgPSBmYWxzZTtcclxuICAgICAgICBvYmoubW91c2UubW91c2VEb3duLmV2ZW50ID0gbnVsbDtcclxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGxpc3RlbmVyRm9yTW91c2VVcCk7XHJcbiAgICB9O1xyXG5cclxufSlcclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG9iajsiLCJcclxuaW1wb3J0IENhbnZhc0dhbWUgZnJvbSAnLi9DYW52YXNHYW1lJztcclxuaW1wb3J0IEdhbWVDb21wb25lbnRzSW5pdCBmcm9tICcuL0dhbWVDb21wb25lbnRzSW5pdC9pbmRleC5qcyc7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpPT57XHJcbiAgICBsZXQgY2FudmFzR2FtZSA9IG5ldyBDYW52YXNHYW1lKCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FudmFzX19jdHgnKSApO1xyXG4gICAgbmV3IEdhbWVDb21wb25lbnRzSW5pdCggY2FudmFzR2FtZSApO1xyXG59KTtcclxuXHJcblxyXG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQnVmZmVyKGFyZykge1xuICByZXR1cm4gYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnXG4gICAgJiYgdHlwZW9mIGFyZy5jb3B5ID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5maWxsID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5yZWFkVUludDggPT09ICdmdW5jdGlvbic7XG59IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBmb3JtYXRSZWdFeHAgPSAvJVtzZGolXS9nO1xuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbihmKSB7XG4gIGlmICghaXNTdHJpbmcoZikpIHtcbiAgICB2YXIgb2JqZWN0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpO1xuICB9XG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICB2YXIgc3RyID0gU3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHggPT09ICclJScpIHJldHVybiAnJSc7XG4gICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICBzd2l0Y2ggKHgpIHtcbiAgICAgIGNhc2UgJyVzJzogcmV0dXJuIFN0cmluZyhhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclaic6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3NbaSsrXSk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXR1cm4gJ1tDaXJjdWxhcl0nO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gIH0pO1xuICBmb3IgKHZhciB4ID0gYXJnc1tpXTsgaSA8IGxlbjsgeCA9IGFyZ3NbKytpXSkge1xuICAgIGlmIChpc051bGwoeCkgfHwgIWlzT2JqZWN0KHgpKSB7XG4gICAgICBzdHIgKz0gJyAnICsgeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICcgJyArIGluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG5cbi8vIE1hcmsgdGhhdCBhIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4vLyBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuLy8gSWYgLS1uby1kZXByZWNhdGlvbiBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbmV4cG9ydHMuZGVwcmVjYXRlID0gZnVuY3Rpb24oZm4sIG1zZykge1xuICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICBpZiAoaXNVbmRlZmluZWQoZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZWQoKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbikge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBkZXByZWNhdGVkO1xufTtcblxuXG52YXIgZGVidWdzID0ge307XG52YXIgZGVidWdFbnZpcm9uO1xuZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICBpZiAoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlcbiAgICBkZWJ1Z0Vudmlyb24gPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnO1xuICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgaWYgKCFkZWJ1Z3Nbc2V0XSkge1xuICAgIGlmIChuZXcgUmVnRXhwKCdcXFxcYicgKyBzZXQgKyAnXFxcXGInLCAnaScpLnRlc3QoZGVidWdFbnZpcm9uKSkge1xuICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZyA9IGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVidWdzW3NldF07XG59O1xuXG5cbi8qKlxuICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICogaW4gdGhlIGJlc3Qgd2F5IHBvc3NpYmxlIGdpdmVuIHRoZSBkaWZmZXJlbnQgdHlwZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRoYXQgYWx0ZXJzIHRoZSBvdXRwdXQuXG4gKi9cbi8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbmZ1bmN0aW9uIGluc3BlY3Qob2JqLCBvcHRzKSB7XG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgY3R4ID0ge1xuICAgIHNlZW46IFtdLFxuICAgIHN0eWxpemU6IHN0eWxpemVOb0NvbG9yXG4gIH07XG4gIC8vIGxlZ2FjeS4uLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBjdHguZGVwdGggPSBhcmd1bWVudHNbMl07XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gIGlmIChpc0Jvb2xlYW4ob3B0cykpIHtcbiAgICAvLyBsZWdhY3kuLi5cbiAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gIH0gZWxzZSBpZiAob3B0cykge1xuICAgIC8vIGdvdCBhbiBcIm9wdGlvbnNcIiBvYmplY3RcbiAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgfVxuICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguZGVwdGgpKSBjdHguZGVwdGggPSAyO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmNvbG9ycykpIGN0eC5jb2xvcnMgPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICBpZiAoY3R4LmNvbG9ycykgY3R4LnN0eWxpemUgPSBzdHlsaXplV2l0aENvbG9yO1xuICByZXR1cm4gZm9ybWF0VmFsdWUoY3R4LCBvYmosIGN0eC5kZXB0aCk7XG59XG5leHBvcnRzLmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuaW5zcGVjdC5jb2xvcnMgPSB7XG4gICdib2xkJyA6IFsxLCAyMl0sXG4gICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICdncmV5JyA6IFs5MCwgMzldLFxuICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICdibHVlJyA6IFszNCwgMzldLFxuICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgJ3llbGxvdycgOiBbMzMsIDM5XVxufTtcblxuLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG5pbnNwZWN0LnN0eWxlcyA9IHtcbiAgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICdudW1iZXInOiAneWVsbG93JyxcbiAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgJ251bGwnOiAnYm9sZCcsXG4gICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgJ3JlZ2V4cCc6ICdyZWQnXG59O1xuXG5cbmZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgdmFyIHN0eWxlID0gaW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMV0gKyAnbSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsIGN0eCk7XG4gICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICByZXQgPSBmb3JtYXRWYWx1ZShjdHgsIHJldCwgcmVjdXJzZVRpbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFByaW1pdGl2ZSB0eXBlcyBjYW5ub3QgaGF2ZSBwcm9wZXJ0aWVzXG4gIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gIGlmIChwcmltaXRpdmUpIHtcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG5cbiAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcbiAgfVxuXG4gIC8vIElFIGRvZXNuJ3QgbWFrZSBlcnJvciBmaWVsZHMgbm9uLWVudW1lcmFibGVcbiAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2R3dzUyc2J0KHY9dnMuOTQpLmFzcHhcbiAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAmJiAoa2V5cy5pbmRleE9mKCdtZXNzYWdlJykgPj0gMCB8fCBrZXlzLmluZGV4T2YoJ2Rlc2NyaXB0aW9uJykgPj0gMCkpIHtcbiAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgfVxuICBpZiAoIXN0cikge1xuICAgIGlmIChjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpIDwgMCkge1xuICAgICAgaWYgKGlzTnVsbChyZWN1cnNlVGltZXMpKSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgIGlmIChhcnJheSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzVW5kZWZpbmVkKG5hbWUpKSB7XG4gICAgaWYgKGFycmF5ICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xufVxuXG5cbmZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJlxuICAgICAgKG9iamVjdFRvU3RyaW5nKGUpID09PSAnW29iamVjdCBFcnJvcl0nIHx8IGUgaW5zdGFuY2VvZiBFcnJvcik7XG59XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCcgfHwgIC8vIEVTNiBzeW1ib2xcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xufVxuZXhwb3J0cy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG5leHBvcnRzLmlzQnVmZmVyID0gcmVxdWlyZSgnLi9zdXBwb3J0L2lzQnVmZmVyJyk7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5cbi8vIGxvZyBpcyBqdXN0IGEgdGhpbiB3cmFwcGVyIHRvIGNvbnNvbGUubG9nIHRoYXQgcHJlcGVuZHMgYSB0aW1lc3RhbXBcbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xufTtcblxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAqXG4gKiBUaGUgRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzIGZyb20gbGFuZy5qcyByZXdyaXR0ZW4gYXMgYSBzdGFuZGFsb25lXG4gKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAqIGR1cmluZyBib290c3RyYXBwaW5nIHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgcmV3cml0dGVuIHVzaW5nIHNvbWUgbmF0aXZlXG4gKiBmdW5jdGlvbnMgYXMgcHJvdG90eXBlIHNldHVwIHVzaW5nIG5vcm1hbCBKYXZhU2NyaXB0IGRvZXMgbm90IHdvcmsgYXNcbiAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gd2hpY2ggbmVlZHMgdG8gaW5oZXJpdCB0aGVcbiAqICAgICBwcm90b3R5cGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gdG8gaW5oZXJpdCBwcm90b3R5cGUgZnJvbS5cbiAqL1xuZXhwb3J0cy5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmV4cG9ydHMuX2V4dGVuZCA9IGZ1bmN0aW9uKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgIWlzT2JqZWN0KGFkZCkpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59O1xuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuIl19
