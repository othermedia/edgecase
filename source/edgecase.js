Edgecase = new JS.Module('Edgecase', {
    include: Ojay.Observable,
    
    _visible: true,
    
    setElement: function(element) {
        this._element = Ojay(element);
        
        return this;
    },
    
    setContainer: function(container) {
        this._container = container ? Ojay(container) : null;
        
        return this;
    },
    
    setAspectRatio: function(ratio) {
        this._aspectRatio = ratio;
        
        if (this._element) this.fitToContainer();
        
        return this;
    },
    
    getAspectRatio: function() {
        return this._aspectRatio;
    },
    
    setup: function() {
        Ojay(window).on('resize', function() {
            if (this._visible) {
                this.fitToContainer();
            }
        }, this);
        
        this.fitToContainer();
        this.notifyObservers('load', this);
        
        return this;
    },
    
    show: function() {
        if (this._visible) return;
        
        this.fitToContainer();
        this._element.show();
        
        this._visible = true;
        
        this.notifyObservers('show', this);
        
        return this;
    },
    
    hide: function() {
        if (!this._visible) return;
        
        this._element.hide();
        
        this._visible = false;
        
        this.notifyObservers('hide', this);
        
        return this;
    },
    
    getHTML: function() {
        return this._element;
    },
    
    fitToContainer: function() {
        if (this._container) {
            this.fitToContainerXY(this._container.getWidth(), this._container.getHeight());
        } else {
            this.fitToViewport();
        }
        
        return this;
    },
    
    fitToViewport: function() {
        var portsize = Ojay.getViewportSize();
        
        this.fitToContainerXY(portsize.width, portsize.height);
        
        return this;
    },
    
    fitToContainerXY: function(containerWidth, containerHeight) {
        var containerAspectRatio = containerWidth / containerHeight,
            style = {display: 'block', position: 'absolute'},
            x, y;
        
        if (containerAspectRatio > this.getAspectRatio()) {
            y = containerWidth / this.getAspectRatio();
            
            style.width  = containerWidth + 'px';
            style.height = Math.ceil(y) + 'px';
            style.left   = 0;
            style.top    = Math.ceil((containerHeight - y) / 2) + 'px';
        } else {
            x = containerHeight * this.getAspectRatio();
            
            style.width  = Math.ceil(x) + 'px';
            style.height = containerHeight + 'px';
            style.left   = Math.ceil((containerWidth - x) / 2) + 'px';
            style.top    = 0;
        }
        
        this._element.setStyle(style);
    }
});

Edgecase.Concrete = new JS.Class('Edgecase.Concrete', {
    include: Edgecase,
    
    initialize: function(image, options) {
        var ratio, html, x, y;
        
        options = options || {};
        
        this.setElement(image);
        this.setContainer(options.container);
        this.getHTML().setStyle({display: 'block'});
        
        if (options.aspectRatio) {
            ratio = options.aspectRatio;
        } else {
            html  = this.getHTML();
            x     = html.getWidth();
            y     = html.getHeight();
            ratio = x / y;
        }
        
        this.setAspectRatio(ratio);
    }
});
