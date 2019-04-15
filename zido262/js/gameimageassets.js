class GameImageAssets extends ImageAssetsData
{
    constructor()
    {
        super(); 
        this.data =
        [   

            {id:"bg", file:"assets/images/bg.png"},
            {id:"next-arrow", file:"assets/images/next-arrow.png"},
            {id:"btn-taptoplay", file:"assets/images/btn-taptoplay.png"},

            {id:"hand-pointer", file:"assets/images/hand-pointer.png"},
            {id:"zido-logo", file:"assets/images/zido-logo.png"},

            {id:"star-particle", file:"assets/images/star-particle.png"},

            {id:"balloon", file:"assets/images/balloon.png"},
            {id:"btn-rety", file:"assets/images/btn-retry.png"},
        ];

        this.atlas = [
            {id:"uibox", file:"assets/images/uibox.png", json:"assets/images/uibox.json"},
            {id:"endscreen", file:"assets/images/endscreen.png", json:"assets/images/endscreen.json"},
            {id:"ingame", file:"assets/images/ingame.png", json:"assets/images/ingame.json"},
        ];
    }
}