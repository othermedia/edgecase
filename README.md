Edgecase
========

Elements that scale with the browser window size. Use the `Edgecase.Concrete`
class to create scaleable elements.

    var boxed = new Edgecase.Concrete('#image', {
        aspectRatio: 16 / 9,
        container:   '#box'
    });
    
    boxed.setup();

Alternatively, roll your own implementation by using the `Edgecase` module as
a mixin.

    Widescreen = new JS.Class({
        include: Edgecase,
        
        initialize: function(video) {
            this.setElement(video.getHTML());
            this.setContainer(video.getContainer());
            this.setAspectRatio(16 / 9);
        }
    });
