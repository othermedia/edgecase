Edgecase = new JS.Class('Edgecase', {
    initialize: function(element, options) {
        this._options   = options || {};
        this._element   = Ojay(element);
        this._visible   = true;
        
        if (this._options.container) {
            this._container = Ojay(this._options.container);
        }
        
        this._width  = this._options.width  || this._element.getWidth();
        this._height = this._options.height || this._element.getHeight();
        
        this._elementAspectRatio = this._options.aspectRatio || this._width / this._height;
    },
    
    setup: function() {
        Ojay(window).on('resize', function() {
            if (this._visible) {
                this.fitToContainer();
            }
        }, this);
        
        this.fitToContainer();
    },
    
    show: function() {
        if (this._visible) return;
        
        this.fitToContainer();
        this._element.show();
        
        this._visible = true;
        
        return this;
    },
    
    hide: function() {
        if (!this._visible) return;
        
        this._element.hide();
        
        this._visible = false;
        
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
        
        if (containerAspectRatio > this._elementAspectRatio) {
            y = containerWidth / this._elementAspectRatio;
            
            position = {
                width:  containerWidth + 'px',
                height: Math.ceil(y) + 'px',
                left:   0,
                top:    Math.ceil((containerHeight - y) / 2) + 'px'
            };
        } else {
            x = containerHeight * this._elementAspectRatio;
            
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
        style.display = 'block';
        style.position = 'absolute';
        this._element.setStyle(style);
    }
});
