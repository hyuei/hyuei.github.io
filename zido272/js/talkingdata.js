class TalkingData{
    constructor()
    {
        this.talkingdata =
        {
            Prologue:[
                {
                    char:"",
                    en:"Welcome to the garden again",
                    ar:"السَّلَامُ عَلَيْكُمْ، مَرْحَباً بِكَ فِي الْحَديقَةِ مَرَّةأُخْرَىً",
                    voice:"1.mp3"
                },
                {
                    char:"",
                    en:"As you can see, there are a lot of trash here",
                    ar:"كَمَا تَرَى، تُوجَدُ هُنَا كَمِّيَّةٌ كَبِيرَةٌ مِنَ النُّفَايَاتِ!",
                    voice:"2.mp3"
                },
                {
                    char:"",
                    en:"There are organic and anorganic trashes, and each of them have their own benefit",
                    ar:"هُنَاكَ نُفَايَاتٌ عُضْوِيَّةٌ وَ أُخْرَى غَيْرُ عُضْوِيَّةٍ، وَ لِكُلِّ نَوْعٍ مِنْهَا اسْتِعْمَالَاتُهُ وَ فَوَائِدُهُ الْخَاصَّةُ", 
                    voice:"3.mp3"
                },
                {
                    char:"",
                    en:"Now, we want to make fertilizer from the organic trashes",
                    ar:"وَالْآنَ، لِنَصْنَعِ السَّمَادَ انْطِلَاقاً مِنَ النُّفَايَاتِ الْعُضْوِيَّةِ",
                    voice:"4.mp3"
                },
                {
                    char:"",
                    en:"Take a look on the pile of trash",
                    ar:"لِنُلْقِ نَظْرَةً عَلَى كَوْمَةِ النُّفَايَاتِ",
                    voice:"5.mp3"
                },
                {
                    char:"",
                    en:"For organic trashes such as apple, banana, drag them to the fertilizer bin",
                    ar:"بِالنِّسْبَةِ لِلنُّفَايَاتِ الْعُضْوِيَّةِ كَالتُّفَّاحِ وَالْمَوْزِ، اسْحَبْهَا إِلَى الصُّنْدُوقِ الْمُخَصَّصِ لِلسَّمَادِ",
                    voice:"6.mp3"
                },
                {
                    char:"",
                    en:"Fill it until full and wait until they are ready to use",
                    ar:"امْلَأْهُ عَنْ آخِرِهِ ثُمَّ انْتَظِرْ  إِلَى أَنْ يُصْبِحَ السَّمَادُ جَاهِزاً لِلْاِسْتِخْدَامِ",
                    voice:"7.mp3"
                },
                {
                    char:"",
                    en:"Drag the finished fertilizer to the soil on the right to help the plants grow",
                    ar:"اسْحَبِ السَّمَادَ نَحْوَ الْيَمِينِ فِي اتِّجَاهِ التُّرْبَةِ  لِمُسَاعَدَةِ النَّبَاتَاتِ عَلَى النُّمُوِّ",
                    voice:"8.mp3"
                },
                {
                    char:"",
                    en:"Drag the other anorganic trashes such as bottle to the recycling bin",
                    ar:"اسْحَبِ النُّفَايَاتِ غَيْرَ الْعُضْوِيَّةِ الْمُتَبَقِّيَةَ،  كَالزُّجَاجَةِ الْمُسْتَعْمَلَةِ مَثَلاً،  إِلَى الصُّنْدُوقِ الْمُخَصَّصِ لِإِعَادَةِ التَّدْويرِ",
                    voice:"9.mp3"
                },
                {
                    char:"",
                    en:"Grow as many plants as possible!",
                    ar:"ازْرَعْ أكْبَرَ عَدَدٍ مُمْكِنٍ مِنَ النَّبَاتَاتِ !",
                    voice:"9.mp3"
                }
            ],
            EndFailed:[
                {
                    char:"",
                    en:"Time's over!",
                    ar:"انْتَهَى الْوَقْتُ !",
                    voice:"11.mp3"
                },
                {
                    char:"",
                    en:"Thank you for your help with these",
                    ar:"شُكْراً عَلَى الْمُسَاعَدَةِ!",
                    voice:"12.mp3"
                },
                {
                    char:"",
                    en:"I'm sure we can do better next time",
                    ar:"يُمْكِنُنَا بِالتَّأْكِيدِ أَنْ نَكُونَ أفْضَلَ فِي الْمَرَّةِ الْقَادِمَةِ",
                    voice:"9.mp3"
                }
            ],
            EndFinish:[
                {
                    char:"",
                    en:"That's it, great job!",
                    ar:"تَمَاماً، أَحْسَنْتَ!",
                    voice:"13.mp3"
                },
                {
                    char:"",
                    en:"We have successfully grow so many plants thanks to your help",
                    ar:"اسْتَطَعْنَا بِفَضْلِ مُسَاعَدَتِكَ أَنْ نَزْرَعَ نَبَاتَاتٍ كَثِيرَةً",
                    voice:"14.mp3"
                },
                {
                    char:"",
                    en:"You can try growing plants near your houses too!",
                    ar:"يُمْكِنُكَ أَنْ تَزْرَعَ بَعْضَ النَّبَاتَاتِ الْجَمِيلَةِ بِالْقُرْبِ مِنْ مَنْزِلِكَ أَيْضاً!",
                    voice:"15.mp3"
                }
            ]
        };
    }

    loadAudios(game, talkingArray)
    {
        for (var itTalk = 0; itTalk < talkingArray.length; itTalk++)
        {
            if(talkingArray[itTalk].hasOwnProperty('voice'))
            {
                var fileName = talkingArray[itTalk].voice;
                if (fileName !== null && fileName !== "") {
                    game.load.audio(fileName, "assets/voice/" + fileName);
                }
            }
        }
    }

    
}