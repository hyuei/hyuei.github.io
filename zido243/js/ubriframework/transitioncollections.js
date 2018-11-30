class TransitionCollections
{
    constructor()
    {
        this.EnteringTransition = StateTransition.createTransition({
            intro: true,
            props: {
                x: game => game.width
            },
            duration: 1000
        });
        this.OutTransition = StateTransition.createTransition({
            props: {
                x: game => -game.width
            },
            duration: 1000  
        });
    }
}