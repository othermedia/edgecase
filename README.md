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

`EdgeGallery` is lightweight gallery that fills the viewport, built on
`Edgecase`.

    var json = {
        "images": [
            {
                "uri":         "/images/first.jpg",
                "description": "The first image",
                "width":       1024,
                "height":      768
            },
            
            {
                "uri":         "/images/second.jpg",
                "description": "The second image",
                "width":        1280,
                "height":       960
            }
        ],
        
        "rotate":        "auto",
        "rotationTime":  5.0,
        "animationTime": 0.5
    },
    
    gallery = EdgeGallery.fromJSON(json);
    gallery.insertInto(document.body);
