(function(propertySet) {

// fine tuning
var env = {
    players: 4,
    initialMoney: 5000,
    tradingTime: 11,
    tradingStep: 10,
    postTradeDisplay: 4,
    valueBase: 0.8,
    valueFactor: 0.5,
    _maxBar: 0.4,

    properties: [],

    Property: function(meta) {
        this.tag = meta.tag;
        this.type = meta.type;
        this.price = meta.price;
        this.img = meta.img;
        // calculate value
        this.value = (meta.value * env.valueBase) + (meta.value * Math.random() * env.valueFactor);
        this.value = Math.round(this.value - (this.value % 10));
        this.info = meta.info;
        this.build = meta.build;
        if (typeof this.build === 'undefined') {
            this.html = function(id) {
                return '<div id=' + id + ' class="prop"><img src="img/'
                    + this.img + '"><br><i>' + this.tag + '</i><br><b>$'
                    + this.price + '</b></div>';
            }
        } else {
            this.html = function(id) {
                return '<div id=' + id + ' class="prop"><img src="img/'
                    + this.img + '"><br><i>' + this.tag + '</i><br><i>' + this.info
                    + '</i></br><b>$' + this.price + ' (+$' + this.value + ')</b></div>';
            }
        }
    }
}
env.properties = propertySet;

var stat = {}

var scene = {
    help: 0,
    timer: 0,
    ptimer: 0,
    trader: -1,
    tradingProperty: null,
    players: [],
    properties: [],
    _maxBar: 0
}

var Player = function(name) {
    this.name = name;
    this.money = env.initialMoney;
    this.stake = 0;
    this.barStake = 0;
    this.minStake = 0;
    this.properties = [];

    this.stakeUp = function() {
        if (scene.timer === 0) return;
        this.stake += env.tradingStep;
        if (this.stake > this.money) this.stake = this.money;
        if (this.stake < this.minStake) this.stake = this.minStake;
        if (this.money < this.minStake) this.stake = 0;
    } 
    this.stakeDown = function() {
        if (scene.timer === 0) return;
        this.stake -= env.tradingStep;
        if (this.stake < this.minStake || this.stake < 0 || this.money < this.minStake) this.stake = 0;
    }
    this.trade = function(minStake) {
        this.stake = 0;
        this.minStake = minStake;
    }
}

var mutate = {
    init: function() {
        // generate properties
        var pc = 0;
        var sc = 0;
        var totalValue = 0;
        var projectsPrice = 0;
        var sitesPrice = 0;
        for (var p = 0; p < env.properties.length; p++) {
            console.log(env.properties[p].tag + ': ' + env.properties[p].quantity + 'x$' + env.properties[p].price);
            for (var i = 0; i < env.properties[p].quantity; i++) {
                var prop = new env.Property(env.properties[p]);
                scene.properties.push(prop);
                if (env.properties[p].type === 5) {
                    pc++;
                    projectsPrice += env.properties[p].price;
                    totalValue += env.properties[p].value;
                } else {
                    sc++;
                    sitesPrice += env.properties[p].price;
                }
            }
        }
        stat.sites = sc;
        stat.projects = pc;
        stat.totalSitePrice = sitesPrice;
        stat.avgSitePrice = Math.round(sitesPrice / sc);
        stat.totalProjectsPrice = projectsPrice;
        stat.avgProjectPrice = Math.round(projectsPrice / pc);
        stat.totalProjectsValue = totalValue;
        stat.avgProjectValue = Math.round(totalValue / pc);

        console.log('properties: ' + scene.properties.length);
        console.log('sites: ' + sc);
        console.log('total sites price: $' + sitesPrice);
        console.log('avg site price: $' + stat.avgSitePrice);
        console.log('projects: ' + pc);
        console.log('total projects price: $' + projectsPrice);
        console.log('avg project price: $' + stat.avgProjectPrice);
        console.log('total value: $' + totalValue);
        console.log('avg project value: $' + stat.avgProjectValue);
        
        // create players
        for (var i = 0; i < env.players; i++) {
            scene.players[i] = new Player('Player ' + (i + 1));
        }
    }, 
    cycle: function() {
        if (scene.timer > 0) {
            scene.timer--;
            if (scene.timer <= 0) {
                scene.timer = 0;
                mutate.closeTrade();
            }
        }
        if (scene.ptimer > 0) {
            scene.ptimer--;
            if (scene.ptimer <= 0) {
                affect.resetStakes();
            }
        }
        if (scene.help < 31) {
            scene.help++;
            var msg = null;
            switch(scene.help) {
            case 2: msg = 'Press Trade button or Shift to start trading'; break;
            case 6: msg = 'Click on a property to move it up'; break;
            case 10: msg = 'Double click on the top property to complete the project'; break;
            case 14: msg = 'Alt+click / Z+click on a property to put it on sale'; break;
            case 18: msg = 'Properties available: ' + scene.properties.length; break;
            case 22: msg = 'Projects available: ' + stat.projects; break;
            case 26: msg = 'Average project price: $' + stat.avgProjectPrice; break;
            case 30: msg = 'Average project value: $' + stat.avgProjectValue; break;
            }
            if (msg != null) mutate.log(msg);
        }
    },
    closeTrade: function() {
        var p = -1;
        var max = 0;
        for (var i = 0; i < scene.players.length; i++) {
            if (scene.players[i].stake > max) {
                p = i;
                max = scene.players[i].stake;
            } else if (scene.players[i].stake === max) {
                p = -1;
            }
        }
        if (p >= 0) {
            mutate.sell(p);
            refreshBase();
            scene.trader = -1;
            scene.ptimer = env.postTradeDisplay;
        } else {
            mutate.cancelTrade();
        }
    },
    cancelTrade: function() {
        mutate.log('Trading of [' + scene.tradingProperty.tag + '] is canceled');
        if (scene.trader !== -1) {
            // give the prop back to the trader
            scene.players[scene.trader].properties.push(scene.tradingProperty);
            scene.trader = -1;
            refreshBase();
        } else {
            // give the prop back to the stock
            scene.properties.push(scene.tradingProperty);
        }
        scene.ptimer = env.postTradeDisplay;
        scene.tradingProperty = null;
    },
    selectProperty: function() {
        var prop = null;
        if (scene.properties.length === 0) return prop;
        var p = Math.floor(Math.random() * scene.properties.length);
        prop = scene.properties[p];
        scene.properties = mutate.removeElement(scene.properties, p);
        return prop;
    },
    sell: function(player) {
        if (scene.tradingProperty == null) return;
        scene.tradingProperty.price = scene.players[player].stake;
        scene.players[player].money -= scene.tradingProperty.price; 
        scene.players[player].properties.push(scene.tradingProperty);
        if (scene.trader >= 0) {
            // put money on trader's account
            scene.players[scene.trader].money += scene.tradingProperty.price;
        }
        mutate.log('Player #' + (player + 1) + ' acquired property [' + scene.tradingProperty.tag + '] for $' + scene.players[player].stake);
        scene.tradingProperty = null;
    }, 
    adjustScene: function() {
        if (scene.timer === 0) return;
        // find max stake
        var max = 0;
        var mc = 0;
        for (var i = 0; i < scene.players.length; i++) {
            if (scene.players[i].stake > max) {
                mc = 1;
                max = scene.players[i].stake;
            } else if (scene.players[i].stake === max) {
                mc++;
            }
        }
        // adjust bar stakes
        for (var j = 0; j < scene.players.length; j++) {
            scene.players[j].barStake = scene.players[j].stake / max;
        }
        // adjust bar height
        scene._maxBar = screen.height * env._maxBar;
        // adjust css styles
        for (var p = 0; p < scene.players.length; p++) {
           $('#stake' + p).removeClass('stake stake-even stake-max');
           if (scene.players[p].stake === max) {
               if (mc > 1) {
                   $('#stake' + p).addClass('stake-even');
               } else {
                   $('#stake' + p).addClass('stake-max');
               }
           } else {
               $('#stake' + p).addClass('stake');
           }
        }
    },
    removeElement: function(array, index) {
        if (index < 0 || index >= array.length) return array;
        return array.slice(0, index).concat(array.slice(index + 1, array.length));
    },
    countTypes: function(properties, type) {
        var count = 0;
        for (var i = 0; i < properties.length; i++) {
            if (properties[i].type === type) count ++;
        }
        return count;
    },
    removeType: function(properties, type) {
        var index = -1;
        for (var i = 0; i < properties.length; i++) {
            if (properties[i].type === type) index = i;
        }
        if (index !== -1) {
            return mutate.removeElement(properties, index);
        } else {
            return properties;
        }
    },
    removeTypes: function(properties, type, number) {
        for (var i = 0; i < number; i++) {
            properties = mutate.removeType(properties, type);
        }
        return properties;
    },
    log: function(msg) {
        $('#log').html('<b>$</b> ' + msg + '<br>'  + $('#log').html() )
    }
}

var alt = false;
var keyMap = [];

var affect = {
    processEvents: function() {
        for (var i = 0; i < scene.players.length; i++) {
            var key = keyMap[i];
            if (key < 0) {
                scene.players[i].stakeDown();
            } else if (key > 0) {
                scene.players[i].stakeUp();
            }
        }
    },
    trade: function(selector) {
        if (scene.timer === 0) {
            scene.timer = env.tradingTime;
            scene.ptimer = 0;
            scene.tradingProperty = selector();
            if (scene.tradingProperty == null) {
                mutate.log('>>> NO PROPERTIES LEFT! <<<');
                return;
            }
            for (var i = 0; i < scene.players.length; i++) {
                scene.players[i].trade(scene.tradingProperty.price);
            }
        }
    },
    resetStakes: function() {
        if (scene.timer === 0) {
            for (var i = 0; i < scene.players.length; i++) {
                scene.players[i].stake = 0;
            }
        } else {
            // debug option - close trade
            mutate.log('Premature manual trade closure!');
            scene.timer = 0;
            mutate.closeTrade();
            for (var p = 0; p < scene.players.length; p++) {
                scene.players[p].stake = 0;
            }
        }
    },
    onPropertyClick: function() {
        var id = this.id;
        if (id === '_trading') return;
        id = id.substring(1);
        var q = id.split('.');
        var player = parseInt(q[0]);
        var property = parseInt(q[1]);
        if (alt) {
            affect.offer(player, property);
        } else {
            affect.swap(player, property);
        }
    }, 
    onPropertyDblClick: function() {
        var id = this.id;
        if (id === '_trading') return;
        id = id.substring(1);
        var q = id.split('.');
        var player = parseInt(q[0]);
        var property = parseInt(q[1]);
        affect.build(player, property);
    },
    offer: function(player, property) {
        if (scene.timer > 0) return;
        var properties = scene.players[player].properties;
        if (property < 0 || property >= properties.length) return;
        var o = properties[property];
        mutate.log(scene.players[player].name + ' sells [' + o.tag + '] acquired for $' + o.price);
        o.price = 0;
        scene.trader = player;
        scene.players[player].properties = mutate.removeElement(properties, property);
        affect.trade(function() { return o; });
        refreshBase();
    },
    swap: function(player, property) {
        var properties = scene.players[player].properties;
        if (property < 0 || property >= properties.length - 1) return;
        var e = properties[property + 1];
        properties[property + 1] = properties[property];
        properties[property] = e;
        refreshBase();
    },
    build: function(iplayer, iproperty) {
        var properties = scene.players[iplayer].properties;
        if (iproperty < 0 || iproperty >= properties.length) return;
        if (properties[iproperty].type === 5) {
            scene.players[iplayer].properties = scene.players[iplayer].properties[iproperty].build(scene.players[iplayer], properties, iproperty, mutate); 
        }
        refreshBase();
    }
}

var refresh = function() {
    affect.processEvents();
    mutate.adjustScene();

    // refresh top panel
    if (scene.tradingProperty == null) {
        $('#tradingProperty').html('');
    } else {
        $('#tradingProperty').html(scene.tradingProperty.html('_trading'));
    }
    $('#timer').html('<b>' + scene.timer + '<b>');
    // refresh stakes
    for (var i = 0; i < scene.players.length; i++) {
        $('#bank' + i).html('$' + scene.players[i].money + ' [' + scene.players[i].properties.length + ']');
        if (scene.players[i].stake === 0) {
            $('#stake' + i).height(0).html('');
        } else {
            $('#stake' + i).height(scene.players[i].barStake * scene._maxBar).html('$' + scene.players[i].stake);
        }
    }
}

var refreshBase = function() {
    for (var p = 0; p < scene.players.length; p++) {
        var base = '';
        for (var i = scene.players[p].properties.length - 1; i >= 0; i--) {
            base = base + scene.players[p].properties[i].html('P' + p + '.' + i);
        }
        $('#props' + p).html(base);
    }
    $('#props-in-stock').html(
            '<b><a href="help.html" target="help">Help</a><br>'
            + 'Properties Left: ' + scene.properties.length
            + '<br>Average Value: $' + stat.avgProjectValue + '</b>');
    // inject click event for all properties
    $('.prop').click(affect.onPropertyClick);
    $('.prop').dblclick(affect.onPropertyDblClick);
}

$(document).ready(function() {
    $('#trade').click(function(event) {
        affect.trade(mutate.selectProperty);
    });

    $(document).keydown( function(e) {
        switch(e.which) {
            case 49: keyMap[0] = 1; break;
            case 81: keyMap[0] = -1; break;
            case 70: keyMap[1] = 1; break;
            case 86: keyMap[1] = -1; break;
            case 74: keyMap[2] = 1; break;
            case 78: keyMap[2] = -1; break;
            case 8: keyMap[3] = 1; break;
            case 221: keyMap[3] = -1; break;
            case 18: case 90:  alt = true; break;
        }
    })

    $(document).keyup( function(e) {
        switch(e.which) {
            case 49: keyMap[0] = 0; break;
            case 81: keyMap[0] = 0; break;
            case 70: keyMap[1] = 0; break;
            case 86: keyMap[1] = 0; break;
            case 74: keyMap[2] = 0; break;
            case 78: keyMap[2] = 0; break;
            case 8: keyMap[3] = 0; break;
            case 221: keyMap[3] = 0; break;
            case 13: affect.resetStakes(); break;
            case 16: affect.trade(mutate.selectProperty); break;
            case 18: case 90: alt = false; break;
        }
    })

    mutate.init();
    setInterval(refresh, 125);
    setInterval(mutate.cycle, 1000);
    refreshBase();
});

}) (propertySet)
