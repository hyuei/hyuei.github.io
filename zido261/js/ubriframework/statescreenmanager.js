class StateScreenManager
{
    constructor(game, screenQueue)
    {
        this._currentScreenIndex = 0;
        this._screenQueue = screenQueue;
    }

    init()
    {
        console.log("INIT");
        this._currentScreenIndex = 0;
    }

    getNext()
    {
        var index = this._currentScreenIndex++;
        var nextScreen = this._screenQueue[index];

        console.log("Next screen:" + nextScreen);
        return nextScreen;
    }

    getFirst()
    {
        return this._screenQueue[0];
    }
}