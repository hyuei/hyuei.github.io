ImageAssetsData = function(){

};

ImageAssetsData.prototype = {
    init:function()
    {
        this.data = [];

        // sample
        // {id:"avatar-cheer", file:"assets/avatar-cheer.png"}
    },

    loadAsset:function(game)
    {
        for (var itAsset = 0; itAsset < this.data.length; itAsset++)
        {
            game.load.image(this.data[itAsset].id, this.data[itAsset].file);
        }
    }   
};