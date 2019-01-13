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
            setTimeout(function () {
                _this4.canvas.removeHandlerToDraw(_this4.shieldDrawId);
                _this4.ship.shieldEnable = false;
            }, 2000);
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

},{"./GameComponentsInit/Enemy":5}],11:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvQ2FudmFzR2FtZS5qcyIsImFwcC9qcy9HYW1lQ29tcG9uZW50c0luaXQvQmcuanMiLCJhcHAvanMvR2FtZUNvbXBvbmVudHNJbml0L0Jvb20uanMiLCJhcHAvanMvR2FtZUNvbXBvbmVudHNJbml0L0NvbGxpc2lvbnMuanMiLCJhcHAvanMvR2FtZUNvbXBvbmVudHNJbml0L0VuZW15LmpzIiwiYXBwL2pzL0dhbWVDb21wb25lbnRzSW5pdC9GaXJlLmpzIiwiYXBwL2pzL0dhbWVDb21wb25lbnRzSW5pdC9TaGlwLmpzIiwiYXBwL2pzL0dhbWVDb21wb25lbnRzSW5pdC9pbmRleC5qcyIsImFwcC9qcy9HYW1lQ29tcG9uZW50c0luaXQvcmVzb3VyY2VzLmpzIiwiYXBwL2pzL2Zucy5qcyIsImFwcC9qcy9nYW1lQ29uZi5qcyIsImFwcC9qcy9tYWluLmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvc3VwcG9ydC9pc0J1ZmZlckJyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXRpbC91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNDQTs7Ozs7Ozs7SUFFcUIsVTtBQUNqQix3QkFBWSxVQUFaLEVBQXVCO0FBQUE7O0FBQ25CLGFBQUssU0FBTCxHQUFpQixJQUFqQjs7QUFFQSxhQUFLLE1BQUwsR0FBYyxVQUFkO0FBQ0EsYUFBSyxHQUFMLEdBQWMsS0FBSyxNQUFMLENBQVksVUFBWixDQUF1QixJQUF2QixDQUFkOztBQUVBLGFBQUssS0FBTCxHQUFjLFNBQVMsZUFBVCxDQUF5QixXQUF2QztBQUNBLGFBQUssTUFBTCxHQUFjLFNBQVMsZUFBVCxDQUF5QixZQUF2Qzs7QUFFQSxhQUFLLE1BQUwsQ0FBWSxLQUFa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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcclxuaW1wb3J0IGdhbWVDb25mIGZyb20gJy4vZ2FtZUNvbmYnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FudmFzR2FtZXtcclxuICAgIGNvbnN0cnVjdG9yKGNhbnZhc05vZGUpe1xyXG4gICAgICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhc05vZGU7XHJcbiAgICAgICAgdGhpcy5jdHggICAgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuICAgICAgICB0aGlzLndpZHRoICA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gIHRoaXMud2lkdGg7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YUNhbnZhcyA9IGdhbWVDb25mLmRhdGFDYW52YXM7XHJcblxyXG4gICAgICAgIHRoaXMuaWRGb3JIYW5kbGVycyAgID0gMDtcclxuICAgICAgICB0aGlzLmRyYXdIYW5kbGVycyAgICA9IHt9O1xyXG4gICAgICAgIHRoaXMuYWN0aW9uc0hhbmRsZXJzID0ge307XHJcbiAgICAgICAgdGhpcy5kcmF3SGFuZGxlcnNJblN0b3BwZWRNb2RlID0gW107XHJcblxyXG4gICAgICAgIHRoaXMubG9vcCgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBkcmF3QWxsKCl7XHJcbiAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuZHJhd0hhbmRsZXJzKS5mb3JFYWNoKCggaXRlbUZuICk9PntcclxuICAgICAgICAgICAgaWYoIGl0ZW1GbiAhPSB1bmRlZmluZWQgKXtcclxuICAgICAgICAgICAgICAgIGl0ZW1GbiggdGhpcy5jdHggKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZGF0YUNhbnZhcy5mcmFtZXNBbGwrKztcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0FjdGlvbnNBbGwoKXtcclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuYWN0aW9uc0hhbmRsZXJzKS5mb3JFYWNoKCggaXRlbUZuICk9PntcclxuICAgICAgICAgICAgaWYoIGl0ZW1GbiAhPSB1bmRlZmluZWQgKXtcclxuICAgICAgICAgICAgICAgIGl0ZW1GbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQWN0aW9uSGFuZGxlciggYWN0aW9uSGFuZGxlckZuICl7XHJcbiAgICAgICAgbGV0IGlkID0gKyt0aGlzLmlkRm9ySGFuZGxlcnM7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zSGFuZGxlcnNbaWRdID0gYWN0aW9uSGFuZGxlckZuO1xyXG4gICAgICAgIHJldHVybiBpZDsgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQWN0aW9uSGFuZGxlciggaWRPZkhhbmRsZXIgKXtcclxuICAgICAgICBpZighdGhpcy5hY3Rpb25zSGFuZGxlcnNbaWRPZkhhbmRsZXJdKSByZXR1cm47XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuYWN0aW9uc0hhbmRsZXJzW2lkT2ZIYW5kbGVyXTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRIYW5kbGVyVG9EcmF3KCBkcmF3SGFuZGxlckZuICl7XHJcbiAgICAgICAgbGV0IGlkID0gKyt0aGlzLmlkRm9ySGFuZGxlcnM7XHJcbiAgICAgICAgdGhpcy5kcmF3SGFuZGxlcnNbaWRdID0gZHJhd0hhbmRsZXJGbjtcclxuICAgICAgICByZXR1cm4gaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlSGFuZGxlclRvRHJhdyggaWRPZkhhbmRsZXIgKSB7XHJcbiAgICAgICAgaWYoIXRoaXMuZHJhd0hhbmRsZXJzW2lkT2ZIYW5kbGVyXSkgcmV0dXJuO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmRyYXdIYW5kbGVyc1tpZE9mSGFuZGxlcl07XHJcbiAgICB9XHJcblxyXG4gICAgZHJhd0FsbEluU3RvcHBlZE1vZGUoKXtcclxuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5kcmF3SGFuZGxlcnNJblN0b3BwZWRNb2RlKS5mb3JFYWNoKCggaXRlbUZuICk9PntcclxuICAgICAgICAgICAgaWYoIGl0ZW1GbiAhPSB1bmRlZmluZWQgKXtcclxuICAgICAgICAgICAgICAgIGl0ZW1GbiggdGhpcy5jdHggKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZGF0YUNhbnZhcy5mcmFtZXNBbGwrKztcclxuICAgIH1cclxuXHJcbiAgICBhZGRIYW5kbGVyVG9EcmF3SW5TdG9wcGVkTW9kZSggZHJhd0hhbmRsZXJGbiApe1xyXG4gICAgICAgIGxldCBpZCA9ICsrdGhpcy5pZEZvckhhbmRsZXJzO1xyXG4gICAgICAgIHRoaXMuZHJhd0hhbmRsZXJzSW5TdG9wcGVkTW9kZVtpZF0gPSBkcmF3SGFuZGxlckZuO1xyXG4gICAgICAgIHJldHVybiBpZDtcclxuICAgIH1cclxuICAgIHJlbW92ZUhhbmRsZXJUb0RyYXdJblN0b3BwZWRNb2RlKCBpZE9mSGFuZGxlciApe1xyXG4gICAgICAgIGlmKCF0aGlzLmRyYXdIYW5kbGVyc0luU3RvcHBlZE1vZGVbaWRPZkhhbmRsZXJdKSByZXR1cm47XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuZHJhd0hhbmRsZXJzSW5TdG9wcGVkTW9kZVtpZE9mSGFuZGxlcl07IFxyXG4gICAgfVxyXG5cclxuICAgIGdvKCl7XHJcbiAgICAgICAgdGhpcy5pc1N0b3BwZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCl7XHJcbiAgICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGxvb3AoKXtcclxuICAgICAgICBsZXQgbGFzdEZ1bGxTZWNvbmRzICAgPSBwZXJmb3JtYW5jZS5ub3coKSA8IDEwMDAgPyAwIDogcGFyc2VJbnQoIHBlcmZvcm1hbmNlLm5vdygpIC8gMTAwMCApO1xyXG4gICAgICAgIGxldCBsYXN0VGltZUl0ZXJhdGlvbiA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIGxldCBsb29wID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBpdCBtdXN0IGNoZWNrIGZvciBtYXggZnBzIGFuZCBkbyBub3QgZHJhdyBjYW52YXMgaWYgaXQncyB0b28gZmFzdCxcclxuICAgICAgICAgICAgLy8gYmVjYXVzZSB0aGUgZ2FtZSBkcmF3aW5nIGlzIG9yaWVudGVkIG5vdCBmb3IgdGltZSBhbmQgZnBzIHRvZ2V0aGVyXHJcbiAgICAgICAgICAgIC8vIGJ1dCBvbmx5IGZvciBmcHMgKCB3aXRob3V0IHNpdHVhdGlvbiB3aXRoIHNwcml0ZXMgKVxyXG4gICAgICAgICAgICBpZiggIXRoaXMuaXNTdG9wcGVkXHJcbiAgICAgICAgICAgICAgICAmJiAocGVyZm9ybWFuY2Uubm93KCkgLSBsYXN0VGltZUl0ZXJhdGlvbikgPiAoMTAwMCAvIGdhbWVDb25mLm1heEZyYW1lc0luU2Vjb25kKSApe1xyXG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgZm9yIGZwc1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vd0Z1bGxTZWNvbmRzID0gcGVyZm9ybWFuY2Uubm93KCkgPCAxMDAwID8gMCA6IHBhcnNlSW50KCBwZXJmb3JtYW5jZS5ub3coKSAvIDEwMDAgKTtcclxuICAgICAgICAgICAgICAgIGxhc3RGdWxsU2Vjb25kcyA8IG5vd0Z1bGxTZWNvbmRzID8gdGhpcy5kYXRhQ2FudmFzLmZwcyA9IDAgOiB0aGlzLmRhdGFDYW52YXMuZnBzKys7XHJcbiAgICAgICAgICAgICAgICBsYXN0RnVsbFNlY29uZHMgPSBub3dGdWxsU2Vjb25kcztcclxuXHJcbiAgICAgICAgICAgICAgICBsYXN0VGltZUl0ZXJhdGlvbiAgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrQWN0aW9uc0FsbCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3QWxsKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSBlbHNlIGlmKCBwZXJmb3JtYW5jZS5ub3coKSAtIGxhc3RUaW1lSXRlcmF0aW9uID4gMTAwMCAvIGdhbWVDb25mLm1heEZyYW1lc0luU2Vjb25kICl7XHJcbiAgICAgICAgICAgICAgICAvLyBjYWxsIHRvIGRyYXdpbmcgcHJlbG9hZGluZ3MgYW5kIGVsc2UgdGhhdCBub3QgbmVlZCB0byBhd2FpdFxyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3QWxsSW5TdG9wcGVkTW9kZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIGxvb3AgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSggbG9vcCApO1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5pbXBvcnQgZ2FtZUNvbmYgZnJvbSAnLi4vZ2FtZUNvbmYnO1xyXG5pbXBvcnQgZm5zIGZyb20gJy4uL2Zucy5qcyc7XHJcbmltcG9ydCByZXNvdXJjZXMgZnJvbSAnLi9yZXNvdXJjZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmcge1xyXG4gICAgY29uc3RydWN0b3IoY2FudmFzLCBnYW1lT2JqZWN0cywgcmVzb3VyY2VzKXtcclxuICAgICAgICB0aGlzLmNhbnZhcyAgICAgID0gY2FudmFzO1xyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdHMgPSBnYW1lT2JqZWN0cztcclxuICAgICAgICB0aGlzLnJlc291cmNlcyAgID0gcmVzb3VyY2VzO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJzQmdEcmF3SGFuZGxlciA9IGNhbnZhcy5hZGRIYW5kbGVyVG9EcmF3KChjdHgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0JnKGN0eCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucGxhbmV0RHJhd0hhbmRsZXIgPSBjYW52YXMuYWRkSGFuZGxlclRvRHJhdyhjdHg9PntcclxuICAgICAgICAgICAgdGhpcy5kcmF3UGxhbmV0KGN0eCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhcnNMb29wQWN0aW9ucyA9IGNhbnZhcy5hZGRBY3Rpb25IYW5kbGVyKCgpPT57XHJcbiAgICAgICAgICAgIHRoaXMubG9vcCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuaW1hZ2UgID0gcmVzb3VyY2VzLmJnSW1hZ2Uub2JqZWN0O1xyXG4gICAgICAgIHRoaXMucGxhbmV0ID0gcmVzb3VyY2VzLnBsYW5ldEltYWdlLm9iamVjdDtcclxuXHJcbiAgICAgICAgdGhpcy5wbGFuZXREZWdyZWUgPSAwO1xyXG4gICAgICAgIHRoaXMucG9zID0ge1xyXG4gICAgICAgICAgICB5MTogbnVsbCxcclxuICAgICAgICAgICAgeTI6IG51bGwsXHJcbiAgICAgICAgICAgIHkzOiBudWxsLFxyXG4gICAgICAgICAgICBzbGlkZXM6IDMsXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIGRyYXdCZyggY3R4ICl7XHJcbiAgICAgICAgaWYoIHRoaXMuaW1hZ2Uud2lkdGggPT0gMCApIHJldHVybiBmYWxzZTtcclxuICAgICAgICBcclxuICAgICAgICBpZiggdGhpcy5wb3MueTEgPT09IG51bGwgKXtcclxuICAgICAgICAgICAgdGhpcy5wb3MueTEgPSAtdGhpcy5pbWFnZS5oZWlnaHQgKyB0aGlzLmNhbnZhcy5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0aGlzLnBvcy55MiA9PT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLnBvcy55MiA9IC10aGlzLmltYWdlLmhlaWdodCAqIDIgICsgdGhpcy5jYW52YXMuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggdGhpcy5wb3MueTMgPT09IG51bGwgKXtcclxuICAgICAgICAgICAgdGhpcy5wb3MueTMgPSAtdGhpcy5pbWFnZS5oZWlnaHQgKiAzICArIHRoaXMuY2FudmFzLmhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBzcGVlZCA9IDEuNTtcclxuICAgICAgICBsZXQgeVBvczEgPSB0aGlzLnBvcy55MTtcclxuICAgICAgICBsZXQgeVBvczIgPSB0aGlzLnBvcy55MjtcclxuICAgICAgICBsZXQgeVBvczMgPSB0aGlzLnBvcy55MztcclxuXHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZShcclxuICAgICAgICAgICAgdGhpcy5pbWFnZSxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS5oZWlnaHQsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHlQb3MxLFxyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS5oZWlnaHQsXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdHguZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLmhlaWdodCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgeVBvczIsXHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmltYWdlLmhlaWdodCxcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2Uud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UuaGVpZ2h0LFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB5UG9zMyxcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UuaGVpZ2h0LFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgXHJcbiAgICAgICAgLy8gc2VlIGVuZCBvZiBmaXJzdCBzY3JlZW4gaW1hZ2VcclxuICAgICAgICBpZiggdGhpcy5wb3MueTEgPj0gMCArIHRoaXMuY2FudmFzLmhlaWdodCAmJiB0aGlzLnBvcy5zbGlkZXMgJSAzID09PSAwKXtcclxuICAgICAgICAgICAgdGhpcy5wb3Muc2xpZGVzKytcclxuICAgICAgICAgICAgdGhpcy5wb3MueTEgPSB0aGlzLnBvcy55MyAtIHRoaXMuaW1hZ2UuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiggdGhpcy5wb3MueTIgPj0gMCArIHRoaXMuY2FudmFzLmhlaWdodCAmJiB0aGlzLnBvcy5zbGlkZXMgJSAzID09PSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zLnNsaWRlcysrXHJcbiAgICAgICAgICAgIHRoaXMucG9zLnkyID0gdGhpcy5wb3MueTEgLSB0aGlzLmltYWdlLmhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCB0aGlzLnBvcy55MyA+PSAwICsgdGhpcy5jYW52YXMuaGVpZ2h0ICYmIHRoaXMucG9zLnNsaWRlcyAlIDMgPT09IDIpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3Muc2xpZGVzKytcclxuICAgICAgICAgICAgdGhpcy5wb3MueTMgPSB0aGlzLnBvcy55MiAtIHRoaXMuaW1hZ2UuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgeVBvczEgPSB0aGlzLnBvcy55MSArPSBzcGVlZDtcclxuICAgICAgICB5UG9zMiA9IHRoaXMucG9zLnkyICs9IHNwZWVkOyBcclxuICAgICAgICB5UG9zMyA9IHRoaXMucG9zLnkzICs9IHNwZWVkO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgZHJhd1BsYW5ldCggY3R4ICl7XHJcbiAgICAgICAgaWYodGhpcy5wbGFuZXQud2lkdGggPT09IDApIHJldHVybiBmYWxzZTtcclxuICAgICAgICBsZXQgaW1hZ2UgPSB0aGlzLnBsYW5ldDtcclxuXHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBjdHgudHJhbnNsYXRlKC10aGlzLmNhbnZhcy53aWR0aC8yICsgaW1hZ2Uud2lkdGggLyAyLCB0aGlzLmNhbnZhcy5oZWlnaHQvMiArIGltYWdlLmhlaWdodCAvIDIpO1xyXG4gICAgICAgIGN0eC5yb3RhdGUoIHRoaXMucGxhbmV0RGVncmVlICs9IDAuMDAwNzUgKTtcclxuICAgICAgICBjdHgudHJhbnNsYXRlKC0oLXRoaXMuY2FudmFzLndpZHRoLzIgKyBpbWFnZS53aWR0aCAvIDIpLCAtKHRoaXMuY2FudmFzLmhlaWdodC8yICsgaW1hZ2UuaGVpZ2h0IC8gMikpO1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgICAgIGltYWdlLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICBpbWFnZS53aWR0aCxcclxuICAgICAgICAgICAgaW1hZ2UuaGVpZ2h0LFxyXG4gICAgICAgICAgICAtdGhpcy5jYW52YXMud2lkdGgvMixcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0LzIsXHJcbiAgICAgICAgICAgIGltYWdlLndpZHRoLFxyXG4gICAgICAgICAgICBpbWFnZS5oZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgbG9vcCgpe1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG59IiwiXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb29te1xyXG4gICAgY29uc3RydWN0b3IoY2FudmFzLCBnYW1lT2JqZWN0LCByZXNvdXJjZXMsIGNvb3JkaW5hdGUsIGVuZW15KXtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcclxuXHJcbiAgICAgICAgdGhpcy5ib29tID0ge1xyXG4gICAgICAgICAgICBpc0Rlc3Ryb3lTdGFydDogZmFsc2UsXHJcbiAgICAgICAgICAgIGNvdW50ZXI6IDAsXHJcbiAgICAgICAgICAgIGltYWdlOiByZXNvdXJjZXMuYm9vbUltYWdlLm9iamVjdCxcclxuICAgICAgICAgICAgd2lkdGg6IDY0LFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDY0LFxyXG4gICAgICAgICAgICBzcHJpdGVTaXplOiB7XHJcbiAgICAgICAgICAgICAgICB3aWR0aDogNTEyLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA2NCxcclxuICAgICAgICAgICAgICAgIHNwcml0ZXNDb3VudDogOCxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb29yZGluYXRlID0gY29vcmRpbmF0ZTtcclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkSGFuZGxlclRvRHJhdygoY3R4KT0+e1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdCb29tKGN0eCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBkcmF3Qm9vbShjdHgpe1xyXG4gICAgICAgIGxldCB4U3ByaXRlUG9zaXRpb24gPSArK3RoaXMuYm9vbS5jb3VudGVyO1xyXG5cclxuICAgICAgICBjdHguZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICB0aGlzLmJvb20uaW1hZ2UsXHJcbiAgICAgICAgICAgIHhTcHJpdGVQb3NpdGlvbiAqIHRoaXMuYm9vbS53aWR0aCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdGhpcy5ib29tLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmJvb20uaGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLmNvb3JkaW5hdGUueCAtIHRoaXMuYm9vbS53aWR0aC8yLFxyXG4gICAgICAgICAgICB0aGlzLmNvb3JkaW5hdGUueSAtIHRoaXMuYm9vbS5oZWlnaHQvMixcclxuICAgICAgICAgICAgdGhpcy5ib29tLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmJvb20uaGVpZ2h0KTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IGlzQXJyYXkgfSBmcm9tIFwidXRpbFwiO1xyXG5pbXBvcnQgZm5zIGZyb20gJy4uL2Zucyc7XHJcbmltcG9ydCBnYW1lQ29uZiBmcm9tIFwiLi4vZ2FtZUNvbmZcIjtcclxuaW1wb3J0IEJvb20gZnJvbSAnLi9Cb29tJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbGxpc2lvbnMge1xyXG4gICAgY29uc3RydWN0b3IoY2FudmFzLCBnYW1lT2JqZWN0cywgcmVzb3VyY2VzLCBzaGlwKXtcclxuICAgICAgICB0aGlzLmNhbnZhcyAgICAgID0gY2FudmFzO1xyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdHMgPSBnYW1lT2JqZWN0cztcclxuICAgICAgICB0aGlzLnJlc291cmNlcyAgID0gcmVzb3VyY2VzO1xyXG4gICAgICAgIHRoaXMuc2hpcCAgICAgICAgPSBzaGlwO1xyXG5cclxuICAgICAgICB0aGlzLmFjdGlvbkxvb3BIYW5kbGVySWQgPSB0aGlzLmNhbnZhcy5hZGRBY3Rpb25IYW5kbGVyKCgpPT57XHJcbiAgICAgICAgICAgIHRoaXMubG9vcCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvb3AoKXtcclxuICAgICAgICBpZih0aGlzLmNhbnZhcy5pc1N0b3BwZWQpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5jaGVja0NvbGxpc2lvbnNGaXJlc0FuZEVuZW1pZXMoKTtcclxuICAgICAgICB0aGlzLmNoZWNrQ29sbGlzaW9uc1NoaXBBbmRFbmVtaWVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tDb2xsaXNpb25zRmlyZXNBbmRFbmVtaWVzKCl7XHJcbiAgICAgICAgbGV0IGZpcmVzICAgICAgPSB0aGlzLmdhbWVPYmplY3RzLmZpcmVzO1xyXG4gICAgICAgIGxldCBlbmVteVNoaXBzID0gdGhpcy5nYW1lT2JqZWN0cy5lbmVteVNoaXBzO1xyXG5cclxuICAgICAgICBPYmplY3QudmFsdWVzKGZpcmVzKS5mb3JFYWNoKGZpcmU9PntcclxuICAgICAgICAgICAgT2JqZWN0LnZhbHVlcyhlbmVteVNoaXBzKS5mb3JFYWNoKGVuZW15PT57XHJcbiAgICAgICAgICAgICAgICBpZihmbnMuY2hlY2tDb2xsaXNpb25SZWN0YW5nbGVzKGVuZW15LnNoaXAsZmlyZS5maXJlKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlyZS5kZWxldGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBlbmVteS5zdGFydERlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgICAgICBuZXcgQm9vbSh0aGlzLmNhbnZhcywgdGhpcy5nYW1lT2JqZWN0cywgdGhpcy5yZXNvdXJjZXMsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeDogZmlyZS5maXJlLnBvc2l0aW9uLngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IGZpcmUuZmlyZS5wb3NpdGlvbi55LFxyXG4gICAgICAgICAgICAgICAgICAgIH0sZW5lbXkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0NvbGxpc2lvbnNTaGlwQW5kRW5lbWllcygpe1xyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5nYW1lT2JqZWN0cy5lbmVteVNoaXBzKS5mb3JFYWNoKGVuZW15PT57XHJcbiAgICAgICAgICAgIGlmKGZucy5jaGVja0NvbGxpc2lvblJlY3RhbmdsZXMoZW5lbXkuc2hpcCwgdGhpcy5zaGlwLnNoaXAsIHRydWUpKXtcclxuICAgICAgICAgICAgICAgIG5ldyBCb29tKHRoaXMuY2FudmFzLCB0aGlzLmdhbWVPYmplY3RzLCB0aGlzLnJlc291cmNlcywge1xyXG4gICAgICAgICAgICAgICAgICAgIHg6IHRoaXMuc2hpcC5zaGlwLnBvc2l0aW9uLngsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogdGhpcy5zaGlwLnNoaXAucG9zaXRpb24ueSxcclxuICAgICAgICAgICAgICAgIH0sZW5lbXkpOyAgICAgXHJcbiAgICAgICAgICAgICAgICBuZXcgQm9vbSh0aGlzLmNhbnZhcywgdGhpcy5nYW1lT2JqZWN0cywgdGhpcy5yZXNvdXJjZXMsIHtcclxuICAgICAgICAgICAgICAgICAgICB4OiBlbmVteS5zaGlwLnBvc2l0aW9uLngsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogZW5lbXkuc2hpcC5wb3NpdGlvbi55LFxyXG4gICAgICAgICAgICAgICAgfSxlbmVteSk7IFxyXG4gICAgICAgICAgICAgICAgZW5lbXkuc3RhcnREZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoaXAuY29sbGlzaW9uV2lkdGhFbmVteSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsIlxyXG5pbXBvcnQgZm5zIGZyb20gJy4uL2Zucyc7XHJcbmltcG9ydCBnYW1lQ29uZiBmcm9tIFwiLi4vZ2FtZUNvbmZcIjtcclxuaW1wb3J0IHJlc291cmNlcyBmcm9tICcuL3Jlc291cmNlcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbmVteXtcclxuICAgIGNvbnN0cnVjdG9yKGNhbnZhcywgZ2FtZU9iamVjdHMsIHJlc291cmNlcywgdHlwZSwgaWQpe1xyXG4gICAgICAgIHRoaXMuY2FudmFzICAgICAgPSBjYW52YXM7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0cyA9IGdhbWVPYmplY3RzO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2VzICAgPSByZXNvdXJjZXM7XHJcbiAgICAgICAgdGhpcy5pZCAgICAgICAgICA9IGlkO1xyXG5cclxuICAgICAgICB0aGlzLnNoaXA7XHJcbiAgICAgICAgdGhpcy5pc0Rlc3Ryb3lTdGFydCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZGVzdHJveUZyYW1lcyAgPSB7XHJcbiAgICAgICAgICAgIGNvdW50ZXI6IDAsXHJcbiAgICAgICAgICAgIGFsbDogZ2FtZUNvbmYuYm9vbVNwcml0ZXNDb3VudFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lYXN5ID0ge1xyXG4gICAgICAgICAgICB3aWR0aDogMTY3LFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDc1LFxyXG4gICAgICAgICAgICBzcGVlZDogMSxcclxuICAgICAgICAgICAgcG9zaXRpb246IHtcclxuICAgICAgICAgICAgICAgIHg6IGZucy5yYW5kb21JbnQoMTcwICwgdGhpcy5jYW52YXMud2lkdGgpLFxyXG4gICAgICAgICAgICAgICAgeTogLTQwLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpbWFnZToge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0OiByZXNvdXJjZXMuZW5lbXlFYXN5SW1hZ2Uub2JqZWN0LFxyXG4gICAgICAgICAgICAgICAgc3ByaXRlU2l6ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAyMzQsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAxNTAsXHJcbiAgICAgICAgICAgICAgICAgICAgc3ByaXRlUG9zaXRpb246IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgc3ByaXRlc0NvdW50OiA0LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc291bmQ6IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdDogcmVzb3VyY2VzLmJvb21FbmVteVNvdW5kLm9iamVjdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImVhc3lcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcCA9IHRoaXMuZWFzeTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKXtcclxuXHJcbiAgICAgICAgdGhpcy5kcmF3SGFuZGxlciA9IHRoaXMuY2FudmFzLmFkZEhhbmRsZXJUb0RyYXcoKGN0eCk9PntcclxuICAgICAgICAgICAgdGhpcy5tb3ZlRHJhdyhjdHgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmFjdGlvbk1vdmVIYW5kbGVyID0gdGhpcy5jYW52YXMuYWRkQWN0aW9uSGFuZGxlcigoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNoaXAucG9zaXRpb24ueSArPSB0aGlzLnNoaXAuc3BlZWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZURyYXcoIGN0eCApe1xyXG4gICAgICAgIGxldCB4U3ByaXRlUG9zaXRpb24gPVxyXG4gICAgICAgICAgICB0aGlzLnNoaXAuaW1hZ2Uuc3ByaXRlU2l6ZS5zcHJpdGVQb3NpdGlvbiA8IHRoaXMuc2hpcC5pbWFnZS5zcHJpdGVTaXplLnNwcml0ZXNDb3VudCAtIDFcclxuICAgICAgICAgICAgPyArK3RoaXMuc2hpcC5pbWFnZS5zcHJpdGVTaXplLnNwcml0ZVBvc2l0aW9uXHJcbiAgICAgICAgICAgIDogdGhpcy5zaGlwLmltYWdlLnNwcml0ZVNpemUuc3ByaXRlUG9zaXRpb24gPSAwO1xyXG5cclxuICAgICAgICBjdHguZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICB0aGlzLnNoaXAuaW1hZ2Uub2JqZWN0LFxyXG4gICAgICAgICAgICB4U3ByaXRlUG9zaXRpb24gKiB0aGlzLnNoaXAuaW1hZ2Uuc3ByaXRlU2l6ZS53aWR0aCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdGhpcy5zaGlwLmltYWdlLnNwcml0ZVNpemUud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMuc2hpcC5pbWFnZS5zcHJpdGVTaXplLmhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy5zaGlwLnBvc2l0aW9uLnggLSB0aGlzLnNoaXAud2lkdGggLyAyLFxyXG4gICAgICAgICAgICB0aGlzLnNoaXAucG9zaXRpb24ueSAtIHRoaXMuc2hpcC5oZWlnaHQgLyAyLFxyXG4gICAgICAgICAgICB0aGlzLnNoaXAud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMuc2hpcC5oZWlnaHQpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tGb3JPdXRTY3JlZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydERlc3Ryb3koKXtcclxuICAgICAgICBpZih0aGlzLmlzRGVzdHJveVN0YXJ0KSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5pc0Rlc3Ryb3lTdGFydCA9IHRydWU7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2VuZW15IGRlc3Ryb3knKVxyXG4gICAgICAgIHRoaXMucGxheVNvdW5kRGVzdHJveWluZygpO1xyXG5cclxuICAgICAgICB0aGlzLmFjdGlvbkRlc3Ryb3lIYW5kbGVyID0gdGhpcy5jYW52YXMuYWRkQWN0aW9uSGFuZGxlcigoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnNoaXAuc3BlZWQgPSB0aGlzLnNoaXAuc3BlZWQgKiAwLjUgKyAxO1xyXG4gICAgICAgICAgICBpZigrK3RoaXMuZGVzdHJveUZyYW1lcy5jb3VudGVyID49IHRoaXMuZGVzdHJveUZyYW1lcy5hbGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWxldGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXlTb3VuZERlc3Ryb3lpbmcoKXtcclxuICAgICAgICBsZXQgc291bmREZXN0cm95VG9QbGF5ID0gbmV3IEF1ZGlvKCk7XHJcbiAgICAgICAgc291bmREZXN0cm95VG9QbGF5LnNyYyA9IHRoaXMuc2hpcC5zb3VuZC5vYmplY3Quc3JjO1xyXG4gICAgICAgIHNvdW5kRGVzdHJveVRvUGxheS5wbGF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tGb3JPdXRTY3JlZW4oKXtcclxuICAgICAgICBpZiggdGhpcy5zaGlwLnBvc2l0aW9uLnkgPiB0aGlzLmNhbnZhcy5oZWlnaHQgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZSgpe1xyXG4gICAgICAgXHJcbiAgICAgICAgZGVsZXRlIHRoaXMuZ2FtZU9iamVjdHMuZW5lbXlTaGlwc1t0aGlzLmlkXTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5yZW1vdmVBY3Rpb25IYW5kbGVyKHRoaXMuYWN0aW9uTW92ZUhhbmRsZXIpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUhhbmRsZXJUb0RyYXcoIHRoaXMuZHJhd0hhbmRsZXIgKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5yZW1vdmVIYW5kbGVyVG9EcmF3KCB0aGlzLmRyYXdEZXN0cm95SGFuZGxlciApO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUFjdGlvbkhhbmRsZXIoIHRoaXMuYWN0aW9uTW92ZUhhbmRsZXIgKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5yZW1vdmVBY3Rpb25IYW5kbGVyKCB0aGlzLmFjdGlvbkRlc3Ryb3lIYW5kbGVyICk7XHJcbiAgICB9XHJcbn0iLCJcclxuaW1wb3J0IGdhbWVDb25mIGZyb20gJy4uL2dhbWVDb25mJztcclxuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJ3V0aWwnO1xyXG5pbXBvcnQgcmVzb3VyY2VzIGZyb20gJy4vcmVzb3VyY2VzJztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaXJlIHtcclxuICAgIGNvbnN0cnVjdG9yKCBjYW52YXMsIGdhbWVPYmplY3RzLCByZXNvdXJjZXMsIGRhdGFPYmogKXtcclxuICAgICAgICB0aGlzLmNhbnZhcyAgICAgID0gY2FudmFzO1xyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdHMgPSBnYW1lT2JqZWN0cztcclxuICAgICAgICB0aGlzLnJlc291cmNlcyAgID0gcmVzb3VyY2VzO1xyXG4gICAgICAgIHRoaXMuZmlyZU1vdmVIYW5kbGVySWQ7XHJcblxyXG4gICAgICAgIHRoaXMuZmlyZSA9IHtcclxuICAgICAgICAgICAgaWQ6IGRhdGFPYmouaWQsXHJcbiAgICAgICAgICAgIHdpZHRoOiA1LFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDEwLFxyXG4gICAgICAgICAgICBjb2xvcjogXCIjRkYwMDAwXCIsXHJcbiAgICAgICAgICAgIHNwZWVkOiAzNyxcclxuICAgICAgICAgICAgcG9zaXRpb246IHtcclxuICAgICAgICAgICAgICAgIHg6IGRhdGFPYmoucG9zaXRpb24ueCxcclxuICAgICAgICAgICAgICAgIHk6IGRhdGFPYmoucG9zaXRpb24ueSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc291bmQ6IGRhdGFPYmouc291bmQoKSxcclxuICAgICAgICAgICAgaW1hZ2U6IHtcclxuICAgICAgICAgICAgICAgIG9iamVjdDogcmVzb3VyY2VzLmZpcmVJbWFnZS5vYmplY3QsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgIC8vIHRoaXMgYXR0ciBpcyBkaWZmZXJlbnQgZnJpZW5kbHkgYW5kIG5vdCBzaG9vdCdzXHJcbiAgICAgICAgLy8gLTEgOiBmcmllbmRseSwgIDEgOiBpcyBub3RcclxuICAgICAgICB0aGlzLmlzRW5lbWllcyA9IC0xOyAgICAgICBcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICB0aGlzLmZpcmUuc291bmQucGxheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKXtcclxuICAgICAgICB0aGlzLmZpcmVNb3ZlSGFuZGxlcklkID0gdGhpcy5jYW52YXMuYWRkSGFuZGxlclRvRHJhdygoY3R4KT0+e1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVNb3ZlKGN0eCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZmlyZU1vdmUoIGN0eCApe1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmZpcmUuY29sb3I7XHJcbiAgICAgICAgbGV0IG5ld1kgPSB0aGlzLmZpcmUucG9zaXRpb24ueSArPSB0aGlzLmZpcmUuc3BlZWQgKiB0aGlzLmlzRW5lbWllcztcclxuXHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZShcclxuICAgICAgICAgICAgdGhpcy5maXJlLmltYWdlLm9iamVjdCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdGhpcy5maXJlLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLmZpcmUuaGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLmZpcmUucG9zaXRpb24ueCAtIHRoaXMuZmlyZS53aWR0aCAvIDIsXHJcbiAgICAgICAgICAgIHRoaXMuZmlyZS5wb3NpdGlvbi55IC0gdGhpcy5maXJlLmhlaWdodCAvIDIsXHJcbiAgICAgICAgICAgIHRoaXMuZmlyZS53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5maXJlLmhlaWdodCxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLmNoZWNrRm9yT3V0U2NyZWVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tGb3JPdXRTY3JlZW4oKXtcclxuICAgICAgICBpZiggdGhpcy5maXJlLnBvc2l0aW9uLnkgPCAwICkge1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZWxldGUoKXtcclxuICAgICAgICBkZWxldGUgdGhpcy5nYW1lT2JqZWN0cy5maXJlc1t0aGlzLmZpcmUuaWRdO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUhhbmRsZXJUb0RyYXcoIHRoaXMuZmlyZU1vdmVIYW5kbGVySWQgKTtcclxuICAgIH1cclxufSIsIlxyXG5pbXBvcnQgZ2FtZUNvbmYgZnJvbSAnLi4vZ2FtZUNvbmYnO1xyXG5pbXBvcnQgRmlyZSBmcm9tICcuL0ZpcmUnO1xyXG5pbXBvcnQgcmVzb3VyY2VzIGZyb20gJy4vcmVzb3VyY2VzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoaXAge1xyXG4gICAgY29uc3RydWN0b3IoIGNhbnZhcywgZ2FtZU9iamVjdHMsIHJlc291cmNlcyApe1xyXG4gICAgICAgIHRoaXMuY2FudmFzICAgICAgPSBjYW52YXM7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0cyA9IGdhbWVPYmplY3RzO1xyXG4gICAgICAgIHRoaXMucmVzb3VyY2VzICAgPSByZXNvdXJjZXM7XHJcbiAgICAgICAgdGhpcy5pbWFnZSAgPSB7XHJcbiAgICAgICAgICAgIG9iamVjdDogcmVzb3VyY2VzLnNoaXBJbWFnZS5vYmplY3QsXHJcbiAgICAgICAgICAgIHNwcml0ZVNpemU6IHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiA2OCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogMTI4LFxyXG4gICAgICAgICAgICAgICAgc3ByaXRlUG9zaXRpb246IDAsXHJcbiAgICAgICAgICAgICAgICBzcHJpdGVzQ291bnQ6IDQsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zb3VuZHMgPSB7XHJcbiAgICAgICAgICAgIGxhc2VyOiB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3Q6IHJlc291cmNlcy5maXJlU291bmQub2JqZWN0LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2hpcCAgPSB7XHJcbiAgICAgICAgICAgIHdpZHRoOiAzNCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA2NCxcclxuICAgICAgICAgICAgcG9zaXRpb246IHtcclxuICAgICAgICAgICAgICAgIHg6IGdhbWVDb25mLm1vdXNlLngsXHJcbiAgICAgICAgICAgICAgICB5OiBnYW1lQ29uZi5tb3VzZS55LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsaWZlczogZ2FtZUNvbmYuZGVmYXVsdExpZmVzLFxyXG4gICAgICAgICAgICBsYXN0RnJhbWVDb3VudE9mRmlyZUNyZWF0ZTogMCxcclxuICAgICAgICAgICAgY2FuVG91Y2g6IHRydWUsXHJcbiAgICAgICAgICAgIHNoaWVsZEVuYWJsZTogZmFsc2UsXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmRpc2FibGVNb3ZlVGltZSA9IDUwMDtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpe1xyXG4gICAgICAgIHRoaXMubW92ZUhhbmRsZXJJZCA9IHRoaXMuY2FudmFzLmFkZEhhbmRsZXJUb0RyYXcoKGN0eCk9PntcclxuICAgICAgICAgICAgdGhpcy5zaGlwTW92ZShjdHgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmlyZUFjdGlvbkhhbmRsZXJJZCA9IHRoaXMuY2FudmFzLmFkZEFjdGlvbkhhbmRsZXIoKCk9PntcclxuICAgICAgICAgICAgZ2FtZUNvbmYubW91c2UubW91c2VEb3duLnZhbHVlID8gdGhpcy5zaGlwRmlyZSggdGhpcy5jYW52YXMuY3R4ICkgOiBcIlwiO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMubW92ZUFjdGlvbkhhbmRsZXJJZCA9IHRoaXMuY2FudmFzLmFkZEFjdGlvbkhhbmRsZXIoKCk9PntcclxuICAgICAgICAgICAgdGhpcy5zaGlwLnBvc2l0aW9uLnggPSBnYW1lQ29uZi5tb3VzZS54O1xyXG4gICAgICAgICAgICB0aGlzLnNoaXAucG9zaXRpb24ueSA9IGdhbWVDb25mLm1vdXNlLnk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hpcE1vdmUoIGN0eCApe1xyXG5cclxuICAgICAgICBsZXQgeFNwcml0ZVBvc2l0aW9uID1cclxuICAgICAgICAgICAgdGhpcy5pbWFnZS5zcHJpdGVTaXplLnNwcml0ZVBvc2l0aW9uIDwgdGhpcy5pbWFnZS5zcHJpdGVTaXplLnNwcml0ZXNDb3VudCAtIDFcclxuICAgICAgICAgICAgPyArK3RoaXMuaW1hZ2Uuc3ByaXRlU2l6ZS5zcHJpdGVQb3NpdGlvblxyXG4gICAgICAgICAgICA6IHRoaXMuaW1hZ2Uuc3ByaXRlU2l6ZS5zcHJpdGVQb3NpdGlvbiA9IDA7XHJcblxyXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZS5vYmplY3QsXHJcbiAgICAgICAgICAgICAgICB4U3ByaXRlUG9zaXRpb24gKiB0aGlzLmltYWdlLnNwcml0ZVNpemUud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwLndpZHRoICogMixcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcC5oZWlnaHQgKiAyLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwLnBvc2l0aW9uLnggLSB0aGlzLnNoaXAud2lkdGggLyAyLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwLnBvc2l0aW9uLnkgLSB0aGlzLnNoaXAuaGVpZ2h0IC8gMixcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcC53aWR0aCxcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcC5oZWlnaHQsXHJcbiAgICAgICAgICAgICk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNoaXBGaXJlKCBjdHggKXtcclxuICAgICAgICBcclxuICAgICAgICBpZiggTWF0aC5hYnMoIGdhbWVDb25mLmRhdGFDYW52YXMuZnJhbWVzQWxsIC0gdGhpcy5zaGlwLmxhc3RGcmFtZUNvdW50T2ZGaXJlQ3JlYXRlICkgPCA0ICl7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zaGlwLmxhc3RGcmFtZUNvdW50T2ZGaXJlQ3JlYXRlID0gZ2FtZUNvbmYuZGF0YUNhbnZhcy5mcmFtZXNBbGw7XHJcbiAgICAgICAgbGV0IGlkID0gKyt0aGlzLmdhbWVPYmplY3RzLmlkQ291bnRlcjtcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3RzLmZpcmVzW2lkXSA9IG5ldyBGaXJlKHRoaXMuY2FudmFzLCB0aGlzLmdhbWVPYmplY3RzLCB0aGlzLnJlc291cmNlcywge1xyXG4gICAgICAgICAgICBpZDogaWQsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICB4OiB0aGlzLnNoaXAucG9zaXRpb24ueCxcclxuICAgICAgICAgICAgICAgIHk6IHRoaXMuc2hpcC5wb3NpdGlvbi55IC0gdGhpcy5zaGlwLmhlaWdodCAvIDIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNvdW5kOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc291bmQgPSBuZXcgQXVkaW87XHJcbiAgICAgICAgICAgICAgICBzb3VuZC5zcmMgPSB0aGlzLnNvdW5kcy5sYXNlci5vYmplY3Quc3JjO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNvdW5kO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBjb2xsaXNpb25XaWR0aEVuZW15KCl7XHJcbiAgICAgICBcclxuICAgICAgICBpZighdGhpcy5zaGlwLmNhblRvdWNoKSByZXR1cm47XHJcbiAgICAgICAgLy8gdGhpcy5zaGlwLmNhblRvdWNoID0gZmFsc2U7Lmtra2xsXHJcblxyXG5cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgdGhpcy5zdGFydERlc3Ryb3lpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydERlc3Ryb3lpbmcoKXtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnNoaXAuc2hpZWxkRW5hYmxlKVxyXG4gICAgICAgIGlmKHRoaXMuc2hpcC5zaGllbGRFbmFibGUpe1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVTdG9wcGVkKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zaGllbGRFbmFibGUoKTtcclxuICAgICAgICAgICAgLy8gaWYoLS10aGlzLnNoaXAubGlmZXMgPiAwKXtcclxuICAgICAgICAgICAgLy8gICAgIC8vIHRoaXMubG9vc2VMdmwoKTtcclxuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdxd2UyJylcclxuICAgICAgICAgICAgLy8gICAgIHRoaXMubW92ZVN0b3BwZWQoKTtcclxuICAgICAgICAgICAgLy8gICAgIHRoaXMuc2hpZWxkRW5hYmxlKCk7XHJcbiAgICAgICAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZygncXdlMTIzNCcpXHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBtb3ZlU3RvcHBlZCgpe1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUFjdGlvbkhhbmRsZXIodGhpcy5tb3ZlQWN0aW9uSGFuZGxlcklkKTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpPT57XHJcbiAgICAgICAgICAgIHRoaXMubW92ZUFjdGlvbkhhbmRsZXJJZCA9IHRoaXMuY2FudmFzLmFkZEFjdGlvbkhhbmRsZXIoKCk9PntcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcC5wb3NpdGlvbi54ID0gZ2FtZUNvbmYubW91c2UueDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcC5wb3NpdGlvbi55ID0gZ2FtZUNvbmYubW91c2UueTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSx0aGlzLmRpc2FibGVNb3ZlVGltZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hpZWxkRW5hYmxlKCl7XHJcbiAgICAgICBcclxuICAgICAgICB0aGlzLnNoaXAuc2hpZWxkRW5hYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnNoaWVsZERyYXdJZCA9IHRoaXMuY2FudmFzLmFkZEhhbmRsZXJUb0RyYXcoY3R4PT57XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwid2hpdGVcIjtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHguYXJjKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGlwLnBvc2l0aW9uLngsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoaXAucG9zaXRpb24ueSxcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hpcC5oZWlnaHQgPiB0aGlzLnNoaXAud2lkdGggP1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hpcC5oZWlnaHQgKyAxXHJcbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLnNoaXAud2lkdGggKyAxLFxyXG4gICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgIDIgKiBNYXRoLlBJKTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5yZW1vdmVIYW5kbGVyVG9EcmF3KHRoaXMuc2hpZWxkRHJhd0lkKTtcclxuICAgICAgICAgICAgdGhpcy5zaGlwLnNoaWVsZEVuYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIH0sMjAwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9vc2VMdmwoKXtcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdG9wKCk7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIlxyXG5cclxuaW1wb3J0IFNoaXAgZnJvbSAnLi9TaGlwJztcclxuaW1wb3J0IGdhbWVDb25mIGZyb20gXCIuLi9nYW1lQ29uZlwiO1xyXG5pbXBvcnQgQmcgZnJvbSAnLi9CZyc7XHJcbmltcG9ydCBFbmVteSBmcm9tICcuL0VuZW15JztcclxuaW1wb3J0IENvbGxpc2lvbnMgZnJvbSAnLi9Db2xsaXNpb25zJztcclxuaW1wb3J0IHJlc291cmNlcyBmcm9tICcuL3Jlc291cmNlcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQ29tcG9uZW50c0luaXR7XHJcbiAgICBjb25zdHJ1Y3RvciggY2FudmFzICl7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0cyA9IHtcclxuICAgICAgICAgICAgaWRDb3VudGVyOiAtMSxcclxuICAgICAgICAgICAgZmlyZXM6IHt9LFxyXG4gICAgICAgICAgICBlbmVteVNoaXBzOiB7fSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnJlc291cmNlcyA9IHJlc291cmNlcygpO1xyXG5cclxuICAgICAgICB0aGlzLkJnICAgPSBuZXcgQmcoIGNhbnZhcywgdGhpcy5nYW1lT2JqZWN0cywgdGhpcy5yZXNvdXJjZXMgKTtcclxuICAgICAgICB0aGlzLnNoaXAgPSBuZXcgU2hpcCggY2FudmFzLCB0aGlzLmdhbWVPYmplY3RzLCB0aGlzLnJlc291cmNlcyApO1xyXG5cclxuICAgICAgICB0aGlzLnByZUxvYWRlcigpO1xyXG4gICAgICAgIHRoaXMubG9hZFJlc291cmNlcygpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlRW5lbWllcygpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbGxpc2lvbkNoZWNrZXIgPSBuZXcgQ29sbGlzaW9ucyhjYW52YXMsIHRoaXMuZ2FtZU9iamVjdHMsIHRoaXMucmVzb3VyY2VzLCB0aGlzLnNoaXApO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUVuZW1pZXMoKXtcclxuICAgICAgICBjb25zdCBlbmVteU1hcCA9IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZnJvbUZyYW1lOiAzMCxcclxuICAgICAgICAgICAgICAgIGVuZW15VHlwZTogXCJlYXN5XCIsXHJcbiAgICAgICAgICAgICAgICBlbmVteUNvdW50OiA1NTUsXHJcbiAgICAgICAgICAgICAgICBlbmVteURlbGF5OiAzNSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICB0aGlzLmVuZW1pZXNDcmVhdGVBY3Rpb25IYW5kbGVySWQgPSB0aGlzLmNhbnZhcy5hZGRBY3Rpb25IYW5kbGVyKCgpPT57XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGVuZW15TWFwLmZvckVhY2goZW5lbXlNYXBQYXJ0PT57XHJcbiAgICAgICAgICAgICAgIGxldCBmcmFtZU5vdyA9IGdhbWVDb25mLmRhdGFDYW52YXMuZnJhbWVzQWxsO1xyXG4gICAgICAgICAgICAgICBpZihmcmFtZU5vdyA+PSBlbmVteU1hcFBhcnQuZnJvbUZyYW1lXHJcbiAgICAgICAgICAgICAgICAmJiBlbmVteU1hcFBhcnQuZW5lbXlDb3VudCA+IDBcclxuICAgICAgICAgICAgICAgICYmIGZyYW1lTm93ICUgZW5lbXlNYXBQYXJ0LmVuZW15RGVsYXkgPT09IDApe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpZCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lT2JqZWN0cy5lbmVteVNoaXBzWysrdGhpcy5nYW1lT2JqZWN0cy5pZENvdW50ZXJdID0gbmV3IEVuZW15KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lT2JqZWN0cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZW15TWFwUGFydC5lbmVteVR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZU9iamVjdHMuaWRDb3VudGVyKTtcclxuICAgICAgICAgICAgICAgICAgICBlbmVteU1hcFBhcnQuZW5lbXlDb3VudC0tO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKXtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJlTG9hZGVyKCl7XHJcbiAgICAgICAgbGV0IHByZUxvYWRlckhhbmRsZXIgPSAoIGN0eCApID0+IHtcclxuXHJcbiAgICAgICAgICAgIGxldCBhbGxDb3VudGVyID0gT2JqZWN0LmtleXModGhpcy5yZXNvdXJjZXMpLmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IGlzTG9hZENvdW50ZXIgPSBPYmplY3QudmFsdWVzKHRoaXMucmVzb3VyY2VzKS5maWx0ZXIoaXRlbT0+e1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uaXNSZWFkeTtcclxuICAgICAgICAgICAgfSkubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwicmVkXCI7XHJcbiAgICAgICAgICAgIGxldCBwcmVMb2FkZXJMaW5lSGVpZ2h0ID0gMztcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMud2lkdGggLyAxMCxcclxuICAgICAgICAgICAgICAgICh0aGlzLmNhbnZhcy5oZWlnaHQgLyAyKSAtIHByZUxvYWRlckxpbmVIZWlnaHQgLyAyLFxyXG4gICAgICAgICAgICAgICAgKHRoaXMuY2FudmFzLndpZHRoIC8gMTApICogOCAqIChpc0xvYWRDb3VudGVyIC8gYWxsQ291bnRlciksXHJcbiAgICAgICAgICAgICAgICBwcmVMb2FkZXJMaW5lSGVpZ2h0XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnByZUxvYWRlckRyYXdIYW5kbGVySWQgPSB0aGlzLmNhbnZhcy5hZGRIYW5kbGVyVG9EcmF3SW5TdG9wcGVkTW9kZShjdHg9PntcclxuICAgICAgICAgICAgcHJlTG9hZGVySGFuZGxlcihjdHgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRSZXNvdXJjZXMoKXtcclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMucmVzb3VyY2VzKS5mb3JFYWNoKGl0ZW09PntcclxuICAgICAgICAgICAgaXRlbS5pc1JlYWR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoaXRlbS50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiaW1hZ2VcIjpcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLm9iamVjdC5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uaXNSZWFkeSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNvdW5kXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5vYmplY3Qub25jYW5wbGF5dGhyb3VnaCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5pc1JlYWR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IHQgPSBzZXRJbnRlcnZhbCgoKT0+e1xyXG4gICAgICAgICAgICBsZXQgaXNSZWFkeSA9IE9iamVjdC52YWx1ZXModGhpcy5yZXNvdXJjZXMpLmV2ZXJ5KGl0ZW09PntcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmlzUmVhZHlcclxuICAgICAgICAgICAgICAgICAgICAmJiAoIGl0ZW0ub2JqZWN0LmNvbXBsZXRlICE9IDAgfHwgIGl0ZW0ub2JqZWN0Lm5hdHVyYWxIZWlnaHQgIT0gMClcclxuICAgICAgICAgICAgICAgICAgICAmJiBpdGVtLm9iamVjdC53aWR0aCAhPSAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZihpc1JlYWR5KXtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5nbygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodCk7XHJcbiAgICAgICAgICAgICAgICB9LCAyNTUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7IFxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpe1xyXG4gICAgbGV0IHJlc291cmNlcyA9IHtcclxuICAgICAgICBzaGlwSW1hZ2U6IHtcclxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZVwiLFxyXG4gICAgICAgICAgICBvYmplY3Q6IG5ldyBJbWFnZSgpLFxyXG4gICAgICAgICAgICBzcmM6IFwiaW1hZ2VzL3NoaXAucG5nXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbmVteUVhc3lJbWFnZToge1xyXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlXCIsXHJcbiAgICAgICAgICAgIG9iamVjdDogbmV3IEltYWdlKCksXHJcbiAgICAgICAgICAgIHNyYzogXCJpbWFnZXMvZW5lbXlfZWFzeV9zaGlwLnBuZ1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyZUltYWdlOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2VcIixcclxuICAgICAgICAgICAgb2JqZWN0OiBuZXcgSW1hZ2UoKSxcclxuICAgICAgICAgICAgc3JjOiBcImltYWdlcy9zaG9vdF9sYXNlci5wbmdcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyZVNvdW5kOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwic291bmRcIixcclxuICAgICAgICAgICAgb2JqZWN0OiBuZXcgQXVkaW8sXHJcbiAgICAgICAgICAgIHNyYzogXCJzb3VuZHMvc2hpcF9vd25fbGFzZXIubXAzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBsYW5ldEltYWdlOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2VcIixcclxuICAgICAgICAgICAgb2JqZWN0OiBuZXcgSW1hZ2UoKSxcclxuICAgICAgICAgICAgc3JjOiBcImltYWdlcy9wbGFuZXQucG5nXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBiZ0ltYWdlOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2VcIixcclxuICAgICAgICAgICAgb2JqZWN0OiBuZXcgSW1hZ2UoKSxcclxuICAgICAgICAgICAgc3JjOiBcImltYWdlcy9iZzIuanBnXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvb21JbWFnZToge1xyXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlXCIsXHJcbiAgICAgICAgICAgIG9iamVjdDogbmV3IEltYWdlKCksXHJcbiAgICAgICAgICAgIHNyYzogXCJpbWFnZXMvYm9vbS5wbmdcIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvb21FbmVteVNvdW5kOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwic291bmRcIixcclxuICAgICAgICAgICAgb2JqZWN0OiBuZXcgQXVkaW8oKSxcclxuICAgICAgICAgICAgc3JjOiBcInNvdW5kcy9lbmVteV9ib29tLm1wM1wiLFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBPYmplY3QudmFsdWVzKHJlc291cmNlcykuZm9yRWFjaCgob2JqKT0+e1xyXG4gICAgICAgIG9iai5vYmplY3Quc3JjID0gb2JqLnNyYztcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiByZXNvdXJjZXM7XHJcbn07IiwiaW1wb3J0IEVuZW15IGZyb20gJy4vR2FtZUNvbXBvbmVudHNJbml0L0VuZW15J1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgcmFuZG9tRmxvYXQ6IGZ1bmN0aW9uKG1pbixtYXgpe1xyXG4gICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XHJcbiAgICB9LFxyXG4gICAgcmFuZG9tSW50OiBmdW5jdGlvbihtaW4sbWF4KXtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikpICsgbWluO1xyXG4gICAgfSxcclxuICAgIGNoZWNrQ29sbGlzaW9uUmVjdGFuZ2xlczogZnVuY3Rpb24oIG9iakEsIG9iakIsIGZyb20gKXtcclxuICAgICAgICAvLyBpdCdzIG5lZWQgZm9yIG9uZSB0eXBlIG9mIG9iamVjdCBzdHJ1Y3R1cmU6IFxyXG4gICAgICAgIC8vIG11c3QgdG8gdXNlIG9iai5wb3NpdGlvbiA9IHt4OiB2YWx1ZSwgeTogdmFsdWV9ICYmICggb2JqLndpZHRoICYmIG9iai5oZWlnaHQgKVxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB7IHg6YXggLCB5OmF5IH0gPSBvYmpBLnBvc2l0aW9uO1xyXG4gICAgICAgIGxldCB7IHg6YnggLCB5OmJ5IH0gPSBvYmpCLnBvc2l0aW9uO1xyXG4gICAgICAgIGxldCB7IHdpZHRoOmF3ICwgaGVpZ2h0OmFoIH0gPSBvYmpBO1xyXG4gICAgICAgIGxldCB7IHdpZHRoOmJ3ICwgaGVpZ2h0OmJoIH0gPSBvYmpCO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBheExlZnQgICA9IGF4IC0gYXcvMjtcclxuICAgICAgICBsZXQgYXhSaWdodCAgPSBheCArIGF3LzI7XHJcbiAgICAgICAgbGV0IGF5VG9wICAgID0gYXkgLSBhaC8yO1xyXG4gICAgICAgIGxldCBheUJvdHRvbSA9IGF5ICsgYWgvMjtcclxuXHJcbiAgICAgICAgbGV0IGJ4TGVmdCAgID0gYnggLSBidy8yO1xyXG4gICAgICAgIGxldCBieFJpZ2h0ICA9IGJ4ICsgYncvMjtcclxuICAgICAgICBsZXQgYnlUb3AgICAgPSBieSAtIGJoLzI7XHJcbiAgICAgICAgbGV0IGJ5Qm90dG9tID0gYnkgKyBiaC8yO1xyXG5cclxuICAgICAgICAvLyBmb3IgY29sbGlzaW9uIG9mIDIgcmVjdGFuZ2xlcyBuZWVkIDQgY29uZGl0aW9uczpcclxuICAgICAgICAvLyAxKSBheFJpZ2h0ICA+IGJ4TGVmdCAgICAgOiByaWdodCBzaWRlIFggY29vcmRpbmF0ZSBvZiAxLXN0IHJlY3QgbW9yZSB0aGFuIGxlZnQgc2l6ZSBYIGNvb3JkaW5hdGUgMi1uZFxyXG4gICAgICAgIC8vIDIpIGF4TGVmdCAgIDwgYnhSaWdodCAgICA6IC4uLlxyXG4gICAgICAgIC8vIDMpIGF5Qm90dG9tID4gYnlUb3AgICAgICBcclxuICAgICAgICAvLyA0KSBheVRvcCAgICA8IGJ5Qm90dG9tXHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgYXhSaWdodCAgPiBieExlZnQgICAmJlxyXG4gICAgICAgICAgICBheExlZnQgICA8IGJ4UmlnaHQgICYmXHJcbiAgICAgICAgICAgIGF5Qm90dG9tID4gYnlUb3AgICAgJiZcclxuICAgICAgICAgICAgYXlUb3AgICAgPCBieUJvdHRvbSA/IHRydWUgOiBmYWxzZVxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuXHJcblxyXG59OyIsIlxyXG5cclxubGV0IG9iaiA9IHtcclxuICAgIG1heEZyYW1lc0luU2Vjb25kOiA1MCxcclxuICAgIG1vdXNlOiB7XHJcbiAgICAgICAgeDogMCxcclxuICAgICAgICB5OiAwLFxyXG4gICAgICAgIG1vdXNlRG93bjoge1xyXG4gICAgICAgICAgICB2YWx1ZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGV2ZW50OiBudWxsLFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgZGVmYXVsdExpZmVzOiA0LFxyXG4gICAgYm9vbVNwcml0ZXNDb3VudDogOCxcclxuICAgIGRhdGFDYW52YXMgOiB7XHJcbiAgICAgICAgZnBzOiAwLFxyXG4gICAgICAgIGZyYW1lc0FsbDogMCwgXHJcbiAgICB9LFxyXG4gICAgc291bmQ6IHtcclxuICAgICAgICBlbmFibGU6IHRydWUsXHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIHdpbmRvdy5vYmogID0gb2JqO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChldmVudCk9PntcclxuICAgIGxldCBlID0gZXZlbnQgfHwgd2luZG93LmV2ZW50O1xyXG4gICAgb2JqLm1vdXNlLnggPSBlLng7XHJcbiAgICBvYmoubW91c2UueSA9IGUueTtcclxufSk7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGV2ZW50KT0+e1xyXG4gICAgbGV0IGUgPSBldmVudCB8fCB3aW5kb3cuZXZlbnQ7XHJcbiAgICBvYmoubW91c2UubW91c2VEb3duLnZhbHVlID0gdHJ1ZTtcclxuICAgIG9iai5tb3VzZS5tb3VzZURvd24uZXZlbnQgPSBlO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbGlzdGVuZXJGb3JNb3VzZVVwKTtcclxuICAgIGZ1bmN0aW9uIGxpc3RlbmVyRm9yTW91c2VVcCAoKSB7XHJcbiAgICAgICAgb2JqLm1vdXNlLm1vdXNlRG93bi52YWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgIG9iai5tb3VzZS5tb3VzZURvd24uZXZlbnQgPSBudWxsO1xyXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbGlzdGVuZXJGb3JNb3VzZVVwKTtcclxuICAgIH07XHJcblxyXG59KVxyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgb2JqOyIsIlxyXG5pbXBvcnQgQ2FudmFzR2FtZSBmcm9tICcuL0NhbnZhc0dhbWUnO1xyXG5pbXBvcnQgR2FtZUNvbXBvbmVudHNJbml0IGZyb20gJy4vR2FtZUNvbXBvbmVudHNJbml0L2luZGV4LmpzJztcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCk9PntcclxuICAgIGxldCBjYW52YXNHYW1lID0gbmV3IENhbnZhc0dhbWUoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYW52YXNfX2N0eCcpICk7XHJcbiAgICBuZXcgR2FtZUNvbXBvbmVudHNJbml0KCBjYW52YXNHYW1lICk7XHJcbn0pO1xyXG5cclxuXHJcbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn0iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIGZvcm1hdFJlZ0V4cCA9IC8lW3NkaiVdL2c7XG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uKGYpIHtcbiAgaWYgKCFpc1N0cmluZyhmKSkge1xuICAgIHZhciBvYmplY3RzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9iamVjdHMucHVzaChpbnNwZWN0KGFyZ3VtZW50c1tpXSkpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0cy5qb2luKCcgJyk7XG4gIH1cblxuICB2YXIgaSA9IDE7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICB2YXIgbGVuID0gYXJncy5sZW5ndGg7XG4gIHZhciBzdHIgPSBTdHJpbmcoZikucmVwbGFjZShmb3JtYXRSZWdFeHAsIGZ1bmN0aW9uKHgpIHtcbiAgICBpZiAoeCA9PT0gJyUlJykgcmV0dXJuICclJztcbiAgICBpZiAoaSA+PSBsZW4pIHJldHVybiB4O1xuICAgIHN3aXRjaCAoeCkge1xuICAgICAgY2FzZSAnJXMnOiByZXR1cm4gU3RyaW5nKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclZCc6IHJldHVybiBOdW1iZXIoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVqJzpcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnc1tpKytdKTtcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIHJldHVybiAnW0NpcmN1bGFyXSc7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfSk7XG4gIGZvciAodmFyIHggPSBhcmdzW2ldOyBpIDwgbGVuOyB4ID0gYXJnc1srK2ldKSB7XG4gICAgaWYgKGlzTnVsbCh4KSB8fCAhaXNPYmplY3QoeCkpIHtcbiAgICAgIHN0ciArPSAnICcgKyB4O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgKz0gJyAnICsgaW5zcGVjdCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cblxuLy8gTWFyayB0aGF0IGEgbWV0aG9kIHNob3VsZCBub3QgYmUgdXNlZC5cbi8vIFJldHVybnMgYSBtb2RpZmllZCBmdW5jdGlvbiB3aGljaCB3YXJucyBvbmNlIGJ5IGRlZmF1bHQuXG4vLyBJZiAtLW5vLWRlcHJlY2F0aW9uIGlzIHNldCwgdGhlbiBpdCBpcyBhIG5vLW9wLlxuZXhwb3J0cy5kZXByZWNhdGUgPSBmdW5jdGlvbihmbiwgbXNnKSB7XG4gIC8vIEFsbG93IGZvciBkZXByZWNhdGluZyB0aGluZ3MgaW4gdGhlIHByb2Nlc3Mgb2Ygc3RhcnRpbmcgdXAuXG4gIGlmIChpc1VuZGVmaW5lZChnbG9iYWwucHJvY2VzcykpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhwb3J0cy5kZXByZWNhdGUoZm4sIG1zZykuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHByb2Nlc3Mubm9EZXByZWNhdGlvbiA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgaWYgKHByb2Nlc3MudGhyb3dEZXByZWNhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy50cmFjZURlcHJlY2F0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIGRlcHJlY2F0ZWQ7XG59O1xuXG5cbnZhciBkZWJ1Z3MgPSB7fTtcbnZhciBkZWJ1Z0Vudmlyb247XG5leHBvcnRzLmRlYnVnbG9nID0gZnVuY3Rpb24oc2V0KSB7XG4gIGlmIChpc1VuZGVmaW5lZChkZWJ1Z0Vudmlyb24pKVxuICAgIGRlYnVnRW52aXJvbiA9IHByb2Nlc3MuZW52Lk5PREVfREVCVUcgfHwgJyc7XG4gIHNldCA9IHNldC50b1VwcGVyQ2FzZSgpO1xuICBpZiAoIWRlYnVnc1tzZXRdKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoJ1xcXFxiJyArIHNldCArICdcXFxcYicsICdpJykudGVzdChkZWJ1Z0Vudmlyb24pKSB7XG4gICAgICB2YXIgcGlkID0gcHJvY2Vzcy5waWQ7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbXNnID0gZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKTtcbiAgICAgICAgY29uc29sZS5lcnJvcignJXMgJWQ6ICVzJywgc2V0LCBwaWQsIG1zZyk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge307XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWJ1Z3Nbc2V0XTtcbn07XG5cblxuLyoqXG4gKiBFY2hvcyB0aGUgdmFsdWUgb2YgYSB2YWx1ZS4gVHJ5cyB0byBwcmludCB0aGUgdmFsdWUgb3V0XG4gKiBpbiB0aGUgYmVzdCB3YXkgcG9zc2libGUgZ2l2ZW4gdGhlIGRpZmZlcmVudCB0eXBlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcHJpbnQgb3V0LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdGhhdCBhbHRlcnMgdGhlIG91dHB1dC5cbiAqL1xuLyogbGVnYWN5OiBvYmosIHNob3dIaWRkZW4sIGRlcHRoLCBjb2xvcnMqL1xuZnVuY3Rpb24gaW5zcGVjdChvYmosIG9wdHMpIHtcbiAgLy8gZGVmYXVsdCBvcHRpb25zXG4gIHZhciBjdHggPSB7XG4gICAgc2VlbjogW10sXG4gICAgc3R5bGl6ZTogc3R5bGl6ZU5vQ29sb3JcbiAgfTtcbiAgLy8gbGVnYWN5Li4uXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDMpIGN0eC5kZXB0aCA9IGFyZ3VtZW50c1syXTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCkgY3R4LmNvbG9ycyA9IGFyZ3VtZW50c1szXTtcbiAgaWYgKGlzQm9vbGVhbihvcHRzKSkge1xuICAgIC8vIGxlZ2FjeS4uLlxuICAgIGN0eC5zaG93SGlkZGVuID0gb3B0cztcbiAgfSBlbHNlIGlmIChvcHRzKSB7XG4gICAgLy8gZ290IGFuIFwib3B0aW9uc1wiIG9iamVjdFxuICAgIGV4cG9ydHMuX2V4dGVuZChjdHgsIG9wdHMpO1xuICB9XG4gIC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5zaG93SGlkZGVuKSkgY3R4LnNob3dIaWRkZW4gPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5kZXB0aCkpIGN0eC5kZXB0aCA9IDI7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY29sb3JzKSkgY3R4LmNvbG9ycyA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmN1c3RvbUluc3BlY3QpKSBjdHguY3VzdG9tSW5zcGVjdCA9IHRydWU7XG4gIGlmIChjdHguY29sb3JzKSBjdHguc3R5bGl6ZSA9IHN0eWxpemVXaXRoQ29sb3I7XG4gIHJldHVybiBmb3JtYXRWYWx1ZShjdHgsIG9iaiwgY3R4LmRlcHRoKTtcbn1cbmV4cG9ydHMuaW5zcGVjdCA9IGluc3BlY3Q7XG5cblxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BTlNJX2VzY2FwZV9jb2RlI2dyYXBoaWNzXG5pbnNwZWN0LmNvbG9ycyA9IHtcbiAgJ2JvbGQnIDogWzEsIDIyXSxcbiAgJ2l0YWxpYycgOiBbMywgMjNdLFxuICAndW5kZXJsaW5lJyA6IFs0LCAyNF0sXG4gICdpbnZlcnNlJyA6IFs3LCAyN10sXG4gICd3aGl0ZScgOiBbMzcsIDM5XSxcbiAgJ2dyZXknIDogWzkwLCAzOV0sXG4gICdibGFjaycgOiBbMzAsIDM5XSxcbiAgJ2JsdWUnIDogWzM0LCAzOV0sXG4gICdjeWFuJyA6IFszNiwgMzldLFxuICAnZ3JlZW4nIDogWzMyLCAzOV0sXG4gICdtYWdlbnRhJyA6IFszNSwgMzldLFxuICAncmVkJyA6IFszMSwgMzldLFxuICAneWVsbG93JyA6IFszMywgMzldXG59O1xuXG4vLyBEb24ndCB1c2UgJ2JsdWUnIG5vdCB2aXNpYmxlIG9uIGNtZC5leGVcbmluc3BlY3Quc3R5bGVzID0ge1xuICAnc3BlY2lhbCc6ICdjeWFuJyxcbiAgJ251bWJlcic6ICd5ZWxsb3cnLFxuICAnYm9vbGVhbic6ICd5ZWxsb3cnLFxuICAndW5kZWZpbmVkJzogJ2dyZXknLFxuICAnbnVsbCc6ICdib2xkJyxcbiAgJ3N0cmluZyc6ICdncmVlbicsXG4gICdkYXRlJzogJ21hZ2VudGEnLFxuICAvLyBcIm5hbWVcIjogaW50ZW50aW9uYWxseSBub3Qgc3R5bGluZ1xuICAncmVnZXhwJzogJ3JlZCdcbn07XG5cblxuZnVuY3Rpb24gc3R5bGl6ZVdpdGhDb2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICB2YXIgc3R5bGUgPSBpbnNwZWN0LnN0eWxlc1tzdHlsZVR5cGVdO1xuXG4gIGlmIChzdHlsZSkge1xuICAgIHJldHVybiAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzBdICsgJ20nICsgc3RyICtcbiAgICAgICAgICAgJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVsxXSArICdtJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cblxuZnVuY3Rpb24gc3R5bGl6ZU5vQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgcmV0dXJuIHN0cjtcbn1cblxuXG5mdW5jdGlvbiBhcnJheVRvSGFzaChhcnJheSkge1xuICB2YXIgaGFzaCA9IHt9O1xuXG4gIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsLCBpZHgpIHtcbiAgICBoYXNoW3ZhbF0gPSB0cnVlO1xuICB9KTtcblxuICByZXR1cm4gaGFzaDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRWYWx1ZShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMpIHtcbiAgLy8gUHJvdmlkZSBhIGhvb2sgZm9yIHVzZXItc3BlY2lmaWVkIGluc3BlY3QgZnVuY3Rpb25zLlxuICAvLyBDaGVjayB0aGF0IHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIGFuIGluc3BlY3QgZnVuY3Rpb24gb24gaXRcbiAgaWYgKGN0eC5jdXN0b21JbnNwZWN0ICYmXG4gICAgICB2YWx1ZSAmJlxuICAgICAgaXNGdW5jdGlvbih2YWx1ZS5pbnNwZWN0KSAmJlxuICAgICAgLy8gRmlsdGVyIG91dCB0aGUgdXRpbCBtb2R1bGUsIGl0J3MgaW5zcGVjdCBmdW5jdGlvbiBpcyBzcGVjaWFsXG4gICAgICB2YWx1ZS5pbnNwZWN0ICE9PSBleHBvcnRzLmluc3BlY3QgJiZcbiAgICAgIC8vIEFsc28gZmlsdGVyIG91dCBhbnkgcHJvdG90eXBlIG9iamVjdHMgdXNpbmcgdGhlIGNpcmN1bGFyIGNoZWNrLlxuICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgIHZhciByZXQgPSB2YWx1ZS5pbnNwZWN0KHJlY3Vyc2VUaW1lcywgY3R4KTtcbiAgICBpZiAoIWlzU3RyaW5nKHJldCkpIHtcbiAgICAgIHJldCA9IGZvcm1hdFZhbHVlKGN0eCwgcmV0LCByZWN1cnNlVGltZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLy8gUHJpbWl0aXZlIHR5cGVzIGNhbm5vdCBoYXZlIHByb3BlcnRpZXNcbiAgdmFyIHByaW1pdGl2ZSA9IGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKTtcbiAgaWYgKHByaW1pdGl2ZSkge1xuICAgIHJldHVybiBwcmltaXRpdmU7XG4gIH1cblxuICAvLyBMb29rIHVwIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICB2YXIgdmlzaWJsZUtleXMgPSBhcnJheVRvSGFzaChrZXlzKTtcblxuICBpZiAoY3R4LnNob3dIaWRkZW4pIHtcbiAgICBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpO1xuICB9XG5cbiAgLy8gSUUgZG9lc24ndCBtYWtlIGVycm9yIGZpZWxkcyBub24tZW51bWVyYWJsZVxuICAvLyBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaWUvZHd3NTJzYnQodj12cy45NCkuYXNweFxuICBpZiAoaXNFcnJvcih2YWx1ZSlcbiAgICAgICYmIChrZXlzLmluZGV4T2YoJ21lc3NhZ2UnKSA+PSAwIHx8IGtleXMuaW5kZXhPZignZGVzY3JpcHRpb24nKSA+PSAwKSkge1xuICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICAvLyBTb21lIHR5cGUgb2Ygb2JqZWN0IHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWQuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW0Z1bmN0aW9uJyArIG5hbWUgKyAnXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfVxuICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdkYXRlJyk7XG4gICAgfVxuICAgIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgYmFzZSA9ICcnLCBhcnJheSA9IGZhbHNlLCBicmFjZXMgPSBbJ3snLCAnfSddO1xuXG4gIC8vIE1ha2UgQXJyYXkgc2F5IHRoYXQgdGhleSBhcmUgQXJyYXlcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgYXJyYXkgPSB0cnVlO1xuICAgIGJyYWNlcyA9IFsnWycsICddJ107XG4gIH1cblxuICAvLyBNYWtlIGZ1bmN0aW9ucyBzYXkgdGhhdCB0aGV5IGFyZSBmdW5jdGlvbnNcbiAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgdmFyIG4gPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICBiYXNlID0gJyBbRnVuY3Rpb24nICsgbiArICddJztcbiAgfVxuXG4gIC8vIE1ha2UgUmVnRXhwcyBzYXkgdGhhdCB0aGV5IGFyZSBSZWdFeHBzXG4gIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZGF0ZXMgd2l0aCBwcm9wZXJ0aWVzIGZpcnN0IHNheSB0aGUgZGF0ZVxuICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBEYXRlLnByb3RvdHlwZS50b1VUQ1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZXJyb3Igd2l0aCBtZXNzYWdlIGZpcnN0IHNheSB0aGUgZXJyb3JcbiAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCAmJiAoIWFycmF5IHx8IHZhbHVlLmxlbmd0aCA9PSAwKSkge1xuICAgIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgYnJhY2VzWzFdO1xuICB9XG5cbiAgaWYgKHJlY3Vyc2VUaW1lcyA8IDApIHtcbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tPYmplY3RdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cblxuICBjdHguc2Vlbi5wdXNoKHZhbHVlKTtcblxuICB2YXIgb3V0cHV0O1xuICBpZiAoYXJyYXkpIHtcbiAgICBvdXRwdXQgPSBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKTtcbiAgfSBlbHNlIHtcbiAgICBvdXRwdXQgPSBrZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGN0eC5zZWVuLnBvcCgpO1xuXG4gIHJldHVybiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnKTtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHZhciBzaW1wbGUgPSAnXFwnJyArIEpTT04uc3RyaW5naWZ5KHZhbHVlKS5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSArICdcXCcnO1xuICAgIHJldHVybiBjdHguc3R5bGl6ZShzaW1wbGUsICdzdHJpbmcnKTtcbiAgfVxuICBpZiAoaXNOdW1iZXIodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnbnVtYmVyJyk7XG4gIGlmIChpc0Jvb2xlYW4odmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnYm9vbGVhbicpO1xuICAvLyBGb3Igc29tZSByZWFzb24gdHlwZW9mIG51bGwgaXMgXCJvYmplY3RcIiwgc28gc3BlY2lhbCBjYXNlIGhlcmUuXG4gIGlmIChpc051bGwodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnbnVsbCcsICdudWxsJyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IodmFsdWUpIHtcbiAgcmV0dXJuICdbJyArIEVycm9yLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSArICddJztcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKSB7XG4gIHZhciBvdXRwdXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkodmFsdWUsIFN0cmluZyhpKSkpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAgU3RyaW5nKGkpLCB0cnVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dC5wdXNoKCcnKTtcbiAgICB9XG4gIH1cbiAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIGlmICgha2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBrZXksIHRydWUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3V0cHV0O1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpIHtcbiAgdmFyIG5hbWUsIHN0ciwgZGVzYztcbiAgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodmFsdWUsIGtleSkgfHwgeyB2YWx1ZTogdmFsdWVba2V5XSB9O1xuICBpZiAoZGVzYy5nZXQpIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmICghaGFzT3duUHJvcGVydHkodmlzaWJsZUtleXMsIGtleSkpIHtcbiAgICBuYW1lID0gJ1snICsga2V5ICsgJ10nO1xuICB9XG4gIGlmICghc3RyKSB7XG4gICAgaWYgKGN0eC5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSkgPCAwKSB7XG4gICAgICBpZiAoaXNOdWxsKHJlY3Vyc2VUaW1lcykpIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgcmVjdXJzZVRpbWVzIC0gMSk7XG4gICAgICB9XG4gICAgICBpZiAoc3RyLmluZGV4T2YoJ1xcbicpID4gLTEpIHtcbiAgICAgICAgaWYgKGFycmF5KSB7XG4gICAgICAgICAgc3RyID0gc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpLnN1YnN0cigyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHIgPSAnXFxuJyArIHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tDaXJjdWxhcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoaXNVbmRlZmluZWQobmFtZSkpIHtcbiAgICBpZiAoYXJyYXkgJiYga2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgbmFtZSA9IEpTT04uc3RyaW5naWZ5KCcnICsga2V5KTtcbiAgICBpZiAobmFtZS5tYXRjaCgvXlwiKFthLXpBLVpfXVthLXpBLVpfMC05XSopXCIkLykpIHtcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cigxLCBuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXlwifFwiJCkvZywgXCInXCIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICdzdHJpbmcnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZSArICc6ICcgKyBzdHI7XG59XG5cblxuZnVuY3Rpb24gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpIHtcbiAgdmFyIG51bUxpbmVzRXN0ID0gMDtcbiAgdmFyIGxlbmd0aCA9IG91dHB1dC5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VyKSB7XG4gICAgbnVtTGluZXNFc3QrKztcbiAgICBpZiAoY3VyLmluZGV4T2YoJ1xcbicpID49IDApIG51bUxpbmVzRXN0Kys7XG4gICAgcmV0dXJuIHByZXYgKyBjdXIucmVwbGFjZSgvXFx1MDAxYlxcW1xcZFxcZD9tL2csICcnKS5sZW5ndGggKyAxO1xuICB9LCAwKTtcblxuICBpZiAobGVuZ3RoID4gNjApIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICtcbiAgICAgICAgICAgKGJhc2UgPT09ICcnID8gJycgOiBiYXNlICsgJ1xcbiAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIG91dHB1dC5qb2luKCcsXFxuICAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIGJyYWNlc1sxXTtcbiAgfVxuXG4gIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgJyAnICsgb3V0cHV0LmpvaW4oJywgJykgKyAnICcgKyBicmFjZXNbMV07XG59XG5cblxuLy8gTk9URTogVGhlc2UgdHlwZSBjaGVja2luZyBmdW5jdGlvbnMgaW50ZW50aW9uYWxseSBkb24ndCB1c2UgYGluc3RhbmNlb2ZgXG4vLyBiZWNhdXNlIGl0IGlzIGZyYWdpbGUgYW5kIGNhbiBiZSBlYXNpbHkgZmFrZWQgd2l0aCBgT2JqZWN0LmNyZWF0ZSgpYC5cbmZ1bmN0aW9uIGlzQXJyYXkoYXIpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXIpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gaXNCb29sZWFuKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nO1xufVxuZXhwb3J0cy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5cbmZ1bmN0aW9uIGlzTnVsbChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsID0gaXNOdWxsO1xuXG5mdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGxPclVuZGVmaW5lZCA9IGlzTnVsbE9yVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG5mdW5jdGlvbiBpc1N0cmluZyhhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1N5bWJvbChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnO1xufVxuZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc1JlZ0V4cChyZSkge1xuICByZXR1cm4gaXNPYmplY3QocmUpICYmIG9iamVjdFRvU3RyaW5nKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5leHBvcnRzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICByZXR1cm4gaXNPYmplY3QoZCkgJiYgb2JqZWN0VG9TdHJpbmcoZCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGUpICYmXG4gICAgICAob2JqZWN0VG9TdHJpbmcoZSkgPT09ICdbb2JqZWN0IEVycm9yXScgfHwgZSBpbnN0YW5jZW9mIEVycm9yKTtcbn1cbmV4cG9ydHMuaXNFcnJvciA9IGlzRXJyb3I7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGwgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3ltYm9sJyB8fCAgLy8gRVM2IHN5bWJvbFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3VuZGVmaW5lZCc7XG59XG5leHBvcnRzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5cbmV4cG9ydHMuaXNCdWZmZXIgPSByZXF1aXJlKCcuL3N1cHBvcnQvaXNCdWZmZXInKTtcblxuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuXG5cbmZ1bmN0aW9uIHBhZChuKSB7XG4gIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuLnRvU3RyaW5nKDEwKSA6IG4udG9TdHJpbmcoMTApO1xufVxuXG5cbnZhciBtb250aHMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJyxcbiAgICAgICAgICAgICAgJ09jdCcsICdOb3YnLCAnRGVjJ107XG5cbi8vIDI2IEZlYiAxNjoxOTozNFxuZnVuY3Rpb24gdGltZXN0YW1wKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gIHZhciB0aW1lID0gW3BhZChkLmdldEhvdXJzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRNaW51dGVzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKCc6Jyk7XG4gIHJldHVybiBbZC5nZXREYXRlKCksIG1vbnRoc1tkLmdldE1vbnRoKCldLCB0aW1lXS5qb2luKCcgJyk7XG59XG5cblxuLy8gbG9nIGlzIGp1c3QgYSB0aGluIHdyYXBwZXIgdG8gY29uc29sZS5sb2cgdGhhdCBwcmVwZW5kcyBhIHRpbWVzdGFtcFxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coJyVzIC0gJXMnLCB0aW1lc3RhbXAoKSwgZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKSk7XG59O1xuXG5cbi8qKlxuICogSW5oZXJpdCB0aGUgcHJvdG90eXBlIG1ldGhvZHMgZnJvbSBvbmUgY29uc3RydWN0b3IgaW50byBhbm90aGVyLlxuICpcbiAqIFRoZSBGdW5jdGlvbi5wcm90b3R5cGUuaW5oZXJpdHMgZnJvbSBsYW5nLmpzIHJld3JpdHRlbiBhcyBhIHN0YW5kYWxvbmVcbiAqIGZ1bmN0aW9uIChub3Qgb24gRnVuY3Rpb24ucHJvdG90eXBlKS4gTk9URTogSWYgdGhpcyBmaWxlIGlzIHRvIGJlIGxvYWRlZFxuICogZHVyaW5nIGJvb3RzdHJhcHBpbmcgdGhpcyBmdW5jdGlvbiBuZWVkcyB0byBiZSByZXdyaXR0ZW4gdXNpbmcgc29tZSBuYXRpdmVcbiAqIGZ1bmN0aW9ucyBhcyBwcm90b3R5cGUgc2V0dXAgdXNpbmcgbm9ybWFsIEphdmFTY3JpcHQgZG9lcyBub3Qgd29yayBhc1xuICogZXhwZWN0ZWQgZHVyaW5nIGJvb3RzdHJhcHBpbmcgKHNlZSBtaXJyb3IuanMgaW4gcjExNDkwMykuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB3aGljaCBuZWVkcyB0byBpbmhlcml0IHRoZVxuICogICAgIHByb3RvdHlwZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHN1cGVyQ3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBpbmhlcml0IHByb3RvdHlwZSBmcm9tLlxuICovXG5leHBvcnRzLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuZXhwb3J0cy5fZXh0ZW5kID0gZnVuY3Rpb24ob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCAhaXNPYmplY3QoYWRkKSkgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn07XG5cbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG4iXX0=
