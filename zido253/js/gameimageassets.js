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

            {id:"trio-cheers", file:"assets/images/trio-cheers.png"},
            {id:"congrats-title", file:"assets/images/congrats-title.png"},
            {id:"btn-retry", file:"assets/images/btn-retry.png"},
            {id:"star-particle", file:"assets/images/star-particle.png"},
            {id:"scorebox", file:"assets/images/scorebox.png"},

            {id:"balloon", file:"assets/images/balloon.png"},
            {id:"time-logo", file:"assets/images/time-logo.png"},

            {id:"friend-1", file:"assets/images/friend-1.png"},
            {id:"friend-2", file:"assets/images/friend-2.png"},
            {id:"friend-3", file:"assets/images/friend-3.png"},
            {id:"friend-4", file:"assets/images/friend-4.png"},
            {id:"friend-5", file:"assets/images/friend-5.png"},
            {id:"obstacle", file:"assets/images/obstacle.png"},
        ];

        this.atlas = [
            {id:"cling", file:"assets/images/cling.png", json:"assets/images/cling.json"},
            {id:"b-particle", file:"assets/images/b-particle.png", json:"assets/images/b-particle.json"},
            {id:"char", file:"assets/images/sprites-char.png", json:"assets/images/sprites-char.json"},
        ];
    }
}