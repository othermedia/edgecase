EdgeGallery = new JS.Class('EdgeGallery', {
    initialize: function(images, options) {
        this._options = options || {};
        this._current = 0;
        
        this._items = images.map(function(img) {
            return new this.klass.Item(img, this._options);
        }, this);
        
        if (this._options.rotate === 'auto') {
            this._rotating = true;
            this._rotationTime = (this._options.rotationTime || this.klass.ROTATION_TIME) * 1000;
            
            setInterval(function() {
                this.nextPage();
            }.bind(this), this._rotationTime);
        }
    },
    
    insertInto: function(container, position) {
        container = Ojay(container);
        
        this._items.forEach(function(item, i) {
            var insert = function() {
                if (this._current === i) {
                    item.show({animate: false});
                }
                
                container.insert(item.getHTML(), position || 'bottom');
            }.bind(this);
            
            if (item.loaded()) {
                insert();
            } else {
                item.on('load', insert);
            }
        }, this);
    },
    
    nextPage: function() {
        var next = this._current + 1;
        
        if (next >= this._items.length) {
            next = 0;
        }
        
        this.setPage(next);
    },
    
    setPage: function(index) {
        if (this._current === index) return;
        
        this._items[this._current].hide();
        this._items[index].show();
        
        this._current = index;
    },
    
    extend: {
        ROTATION_TIME: 5.0,
        
        Item: new JS.Class('EdgeGallery.Item', {
            include: Edgecase,
            
            extend: {
                ANIM_TIME: 1.0
            },
            
            initialize: function(image, options) {
                this._selectFader();
                
                this.setAspectRatio(image.width / image.height);
                this._animTime = options.animationTime || this.klass.ANIM_TIME;
                
                var html = Ojay(Ojay.HTML.img({
                    alt: image.name
                }));
                
                html.on('load', function() {
                    this.setElement(html);
                    this.hide({animate: false});
                    this._loaded = true;
                    this.setup();
                }, this);
                
                html.set({src: image.uri});
            },
            
            loaded: function() {
                return !!this._loaded;
            },
            
            _selectFader: function() {
                var fader = EdgeGallery.Faders.Default,
                    test  = document.createElement('div');
                
                'o moz webkit'.split(' ').forEach(function(prefix) {
                    test.style.cssText = '-' + prefix + '-transition-property: opacity;';
                    if (prefix === "moz") {
                        prefix = "Moz";
                    } else if (prefix === "o") {
                        prefix = "O";
                    }
                    if (typeof test.style[prefix + 'TransitionProperty'] !== 'undefined') {
                        fader = EdgeGallery.Faders.Transition;
                        fader.use(prefix);
                    }
                });
                
                if (typeof fader === 'object') {
                    this.extend(fader);
                }
            }
        }),
        
        fromJSON: function(data) {
            var options = {
                rotate: data.rotate
            };
            
            return new this(data.images, options);
        }
    }
});

EdgeGallery.Faders = {};

EdgeGallery.Faders.FadeOut = new JS.Module('EdgeGallery.Faders.FadeOut', {
    hide: function(options) {
        options = options || {};
        
        var chain        = new JS.MethodChain(),
            currentSuper = this.callSuper;
        
        chain.getHTML();
        
        if (options.animate === false) {
            chain.setStyle({zIndex: 1, opacity: 0});
        } else {
            chain.setStyle({zIndex: 1});
            chain.wait(this._animTime + 0.1);
            chain.setStyle({opacity: 0});
        }
        
        chain._(function() {
            this.callSuper = currentSuper;
            this.callSuper();
        }.bind(this));
        
        return chain.fire(this);
    }
});

EdgeGallery.Faders.Default = new JS.Module('EdgeGallery.Faders.Default', {
    include: EdgeGallery.Faders.FadeOut,
    
    show: function(options) {
        options = options || {};
        
        this.callSuper();
        
        var chain = new JS.MethodChain();
        
        chain.getHTML();
        
        if (options.animate === false) {
            chain.setStyle({opacity: 1, zIndex: 3});
        } else {
            chain.setStyle({zIndex: 3});
            
            chain.animate({
                opacity: {
                    from: 0,
                    to:   1
                }
            }, this._animTime);
        }
        
        return chain.fire(this);
    }
});

EdgeGallery.Faders.Transition = new JS.Module('EdgeGallery.Faders.Transition', {
    extend: {
        use: function(prefix) {
            this.include({
                transitionPrefix: function() {
                    return prefix + 'Transition';
                }
            });
        }
    },
    
    transitionPrefix: function() {
        var prefix = this.callSuper();
        return prefix || 'transition';
    },
    
    show: function(options) {
        options = options || {};
        
        this.callSuper();
        
        var chain = new JS.MethodChain();
        
        chain.getHTML();
        
        if (options.animate === false) {
            chain.setStyle({opacity: 1, zIndex: 3});
        } else {
            chain.setStyle({zIndex: 3}).show().wait(0.01).setStyle({opacity: 1});
        }
        
        return chain.fire(this);
    },
    
    hide: function(options) {
        options = options || {};
        
        var chain        = new JS.MethodChain(),
            currentSuper = this.callSuper,
            hiddenState;
        
        chain.getHTML();
        
        if (options.animate === false /* setup state */) {
            hiddenState = {
                opacity: 0,
                zIndex:  1
            };
            
            hiddenState[this.transitionPrefix() + 'Duration'] = this._animTime + 's';
            hiddenState[this.transitionPrefix() + 'Property'] = 'opacity';
            
            chain.hide().setStyle(hiddenState);
        } else {
            chain.setStyle({zIndex: 1});
            chain.wait(this._animTime + 0.01);
            chain.hide().setStyle({opacity: 0});
        }
        
        chain._(function() {
            this.callSuper = currentSuper;
            this.callSuper();
        }.bind(this));
        
        return chain.fire(this);
    }
});
