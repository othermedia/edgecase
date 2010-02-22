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
        
        return this;
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
            this._fitToContainer(this._container.width(), this._container.height());
        } else {
            this.fitToViewport();
        }
        
        return this;
    },
    
    fitToViewport: function() {
        var portsize = Ojay.getViewportSize();
        
        this._fitToContainer(portsize.width, portsize.height);
        
        return this;
    },
    
    _fitToContainer: function(containerWidth, containerHeight) {
        var containerAspectRatio = containerWidth / containerHeight,
            position, x, y;
        
        if (containerAspectRatio > this._aspectRatio) {
            y = containerWidth / this._aspectRatio;
            
            position = {
                width:  containerWidth + 'px',
                height: Math.ceil(y) + 'px',
                left:   0,
                top:    Math.ceil((containerHeight - y) / 2) + 'px'
            };
        } else {
            x = containerHeight * this._aspectRatio;
            
            position = {
                width:  Math.ceil(x) + 'px',
                height: containerHeight + 'px',
                left:   Math.ceil((containerWidth - x) / 2) + 'px',
                top:    0
            };
        }
        
        this._styleElement(position);
    },
    
    _styleElement: function(style) {
        style.display  = 'block';
        style.position = 'absolute';
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
