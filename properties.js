var propertySet = [
    {
        tag: "residential construction site",
        quantity: 24,
        type: 1,
        price: 50,
        img: "residential.jpg"
    },
    {
        tag: "commercial construction site",
        quantity: 30,
        type: 2,
        price: 60,
        img: "commercial.jpg"
    },
    {
        tag: "industrial construction site",
        quantity: 24,
        type: 3,
        price: 80,
        img: "industrial.jpg"
    },
    {
        tag: "public construction site",
        quantity: 12,
        type: 4,
        price: 40,
        img: "public.jpg"
    },
    {
        tag: "home x2 construction project",
        quantity: 4,
        type: 5,
        price: 50,
        img: "project.png",
        value: 400,
        info: "<b>requires:</b> 2 residential sites",
        build: function(player, props, iproperty, mutate) {
            if (mutate.countTypes(props, 1) < 2) {
                mutate.log(player.name + ': not enough construction sites to start the project');
                return props;
            }
            var construction = props[iproperty];
            mutate.log('building [' + construction.tag + ']->$' + construction.value + ' for ' + player.name);
            props = mutate.removeElement(props, iproperty);
            props = mutate.removeTypes(props, 1, 2);
            player.money += construction.value;
            return props;
        }
    },
    {
        tag: "home x4 construction project",
        quantity: 2,
        type: 5,
        price: 100,
        img: "project.png",
        value: 800,
        info: "<b>requires:</b> 4 residential sites",
        build: function(player, props, iproperty, mutate) {
            if (mutate.countTypes(props, 1) < 4) {
                mutate.log(player.name + ': not enough construction sites to start the project');
                return props;
            }
            var construction = props[iproperty];
            mutate.log('building [' + construction.tag + '] for ' + player.name);
            props = mutate.removeElement(props, iproperty);
            props = mutate.removeTypes(props, 1, 4);
            player.money += construction.value;
            return props;
        }
    },
    {
        tag: "business center",
        quantity: 4,
        type: 5,
        price: 100,
        img: "project.png",
        value: 500,
        info: "<b>requires:</b> 2 commercial sites",
        build: function(player, props, iproperty, mutate) {
            if (mutate.countTypes(props, 2) < 2) {
                mutate.log(player.name + ': not enough construction sites to start the project');
                return props;
            }
            var construction = props[iproperty];
            mutate.log('building [' + construction.tag + '] for ' + player.name);
            props = mutate.removeElement(props, iproperty);
            props = mutate.removeTypes(props, 2, 2);
            player.money += construction.value;
            return props;
        }
    },
    {
        tag: "shopping mall",
        quantity: 2,
        type: 5,
        price: 200,
        img: "project.png",
        value: 1500,
        info: "<b>requires:</b> 4 commercial sites",
        build: function(player, props, iproperty, mutate) {
            if (mutate.countTypes(props, 2) < 4) {
                mutate.log(player.name + ': not enough construction sites to start the project');
                return props;
            }
            var construction = props[iproperty];
            mutate.log('building [' + construction.tag + '] for ' + player.name);
            props = mutate.removeElement(props, iproperty);
            props = mutate.removeTypes(props, 2, 4);
            player.money += construction.value;
            return props;
        }
    },
    {
        tag: "factory",
        quantity: 4,
        type: 5,
        price: 100,
        img: "project.png",
        value: 750,
        info: "<b>requires:</b> 2 industrial sites",
        build: function(player, props, iproperty, mutate) {
            if (mutate.countTypes(props, 3) < 2) {
                mutate.log(player.name + ': not enough construction sites to start the project');
                return props;
            }
            var construction = props[iproperty];
            mutate.log('building [' + construction.tag + '] for ' + player.name);
            props = mutate.removeElement(props, iproperty);
            props = mutate.removeTypes(props, 3, 2);
            player.money += construction.value;
            return props;
        }
    },
    {
        tag: "plant",
        quantity: 2,
        type: 5,
        price: 200,
        img: "project.png",
        value: 2000,
        info: "<b>requires:</b> 4 industrial sites",
        build: function(player, props, iproperty, mutate) {
            if (mutate.countTypes(props, 3) < 4) {
                mutate.log(player.name + ': not enough construction sites to start the project');
                return props;
            }
            var construction = props[iproperty];
            mutate.log('building [' + construction.tag + '] for ' + player.name);
            props = mutate.removeElement(props, iproperty);
            props = mutate.removeTypes(props, 3, 4);
            player.money += construction.value;
            return props;
        }
    },
    {
        tag: "library",
        quantity: 1,
        type: 5,
        price: 150,
        img: "project.png",
        value: 1000,
        info: "<b>requires:</b> 2 public sites",
        build: function(player, props, iproperty, mutate) {
            if (mutate.countTypes(props, 4) < 2) {
                mutate.log(player.name + ': not enough construction sites to start the project');
                return props;
            }
            var construction = props[iproperty];
            mutate.log('building [' + construction.tag + '] for ' + player.name);
            props = mutate.removeElement(props, iproperty);
            props = mutate.removeTypes(props, 4, 2);
            player.money += construction.value;
            return props;
        }
    },
    {
        tag: "park",
        quantity: 1,
        type: 5,
        price: 250,
        img: "project.png",
        value: 2000,
        info: "<b>requires:</b> 4 public sites",
        build: function(player, props, iproperty, mutate) {
            if (mutate.countTypes(props, 4) < 4) {
                mutate.log(player.name + ': not enough construction sites to start the project');
                return props;
            }
            var construction = props[iproperty];
            mutate.log('building [' + construction.tag + '] for ' + player.name);
            props = mutate.removeElement(props, iproperty);
            props = mutate.removeTypes(props, 4, 4);
            player.money += construction.value;
            return props;
        }
    },
    {
        tag: "trade complex",
        quantity: 1,
        type: 5,
        price: 400,
        img: "project.png",
        value: 5000,
        info: "<b>requires:</b> 4 commercial & 2 public sites",
        build: function(player, props, iproperty, mutate) {
            if (mutate.countTypes(props, 2) < 4 || mutate.countTypes(props, 4) < 2) {
                mutate.log(player.name + ': not enough construction sites to start the project');
                return props;
            }
            var construction = props[iproperty];
            mutate.log('building [' + construction.tag + '] for ' + player.name);
            props = mutate.removeElement(props, iproperty);
            props = mutate.removeTypes(props, 2, 4);
            props = mutate.removeTypes(props, 4, 2);
            player.money += construction.value;
            return props;
        }
    },
    {
        tag: "port",
        quantity: 1,
        type: 5,
        price: 500,
        img: "project.png",
        value: 6000,
        info: "<b>requires:</b> 2 commercial & 4 industrial sites",
        build: function(player, props, iproperty, mutate) {
            if (mutate.countTypes(props, 2) < 2 || mutate.countTypes(props, 3) < 4) {
                mutate.log(player.name + ': not enough construction sites to start the project');
                return props;
            }
            var construction = props[iproperty];
            mutate.log('building [' + construction.tag + '] for ' + player.name);
            props = mutate.removeElement(props, iproperty);
            props = mutate.removeTypes(props, 2, 2);
            props = mutate.removeTypes(props, 3, 4);
            player.money += construction.value;
            return props;
        }
    }

]
