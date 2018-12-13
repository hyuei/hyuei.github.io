class TalkingData{
    constructor()
    {
        this.talkingdata =
        {
            Prologue:[
                {
                    char:"",
                    en:"Hello everyone, welcome to the classroom!",
                    ar:"السَّلَامُ عَلَيْكُمْ أَحِبَّائِي، مَرْحَباً بِكُمْ إِلَى الْفَصْلِ الدِّرَاسِيِّ!",
                    voice:"line1.mp3"
                },
                {
                    char:"",
                    en:"We are having a little game in the class right now.",
                    ar:"نَحْنُ الْآنَ بِصَدَدِ لُعْبَةٍ صَغِيرَةٍ فِي الْفَصْلِ.",
                    voice:"line2.mp3"
                },
                {
                    char:"",
                    en:"So how does it play?",
                    ar:"حَسَناً كَيْفَ يُمْكِنُنَا لَعِبُهَا؟",
                    voice:"line3.mp3"
                },
                {
                    char:"",
                    en:"Easy! There will be some numbers shown on the blackboard.",
                    ar:"الْأَمْرُ بَسِيطٌ لِلْغَايَةِ! سَتَظْهَرُ بَعْضُ الْأَرْقَامِ عَلَى السَّبُّورَةِ.",
                    voice:"line4.mp3"
                },
                {
                    char:"",
                    en:"You'll also see the kids wearing number 0-9 on their body.",
                    ar:"وَسَنُشَاهِدُ كَذَلِكَ أَطْفَالاً يَحْمِلُونَ عَلَى أَجْسَادِهِمْ أَرْقَاماً مِنْ 0 إِلَى 9 .",
                    voice:"line5.mp3"
                },
                {
                    char:"",
                    en:"Just click on the kids who have the right numbers to form the number on the blackboard.",
                    ar:"عَلَيْك فَقَطِ النَّقْرُ عَلَى الْأَطْفَالِ الَّذِينَ يَحْمِلُونَ الْاَرْقَامَ الصَّحِيحَةَ لِتَشْكِيلِ الرَّقْمِ الْمَوْجُودِ عَلَى السَّبُّورَةِ.",
                    voice:"line6.mp3"
                },
                {
                    char:"",
                    en:"Among them, there'll be one kid who didn't want to put on their number.",
                    ar:"سَنَجِدُ طِفْلاً وَاحِداً ضِمْنَ الْمَجْمُوعَةِ لَا يُرِيدُ أَنْ يَرْتَدِيَ رَقْمَهُ.",
                    voice:"line7.mp3"
                },
                {
                    char:"",
                    en:"You'll have to guess its number by seeing the missing number among the kids.",
                    ar:"يَتَعَيَّنُ عَلَيْك حَزْرُ رَقْمِهِ مِنْ خِلَالِ مُلَاحَظَةِ الرَّقْمِ الْمَفْقُودِ ضِمْنَ مَجْمُوعَةِ الْأَطْفَالِ.",
                    voice:"line8.mp3"
                },
                {
                    char:"",
                    en:"There will be some math question on the blackboard, too. Answer them using the kids number!",
                    ar:"وَسَتَكُونُ هُنَاكَ أَيْضاً بَعْضُ عَمَلِيَّاتِ الْحِسَابِ عَلَى السَّبُّورَةِ. حَاوِلِ الْإِجَابَةُ عَنْهَا بِاسْتِخْدَامٍ أَرْقَامِ الْأَطْفَالِ!",
                    voice:"line9.mp3"
                },
                {
                    char:"",
                    en:"Easy, right? Then let's get ready!",
                    ar:"الْأَمْرُ فِي غَايَةِ السُّهُولَةِ، أَلَيْسَ كَذَلِكَ؟ إِذَنْ لِنَسْتَعِدَّ!",
                    voice:"line10.mp3"
                }
            ],
            EndFailed:[
                {
                    char:"",
                    en:"That's all!",
                    ar:"هَذَا كُلُّ شَيْءٍ!",
                    voice:"line12.mp3"
                },
                {
                    char:"",
                    en:"I think your score could be better than this.",
                    ar:"أَعْتَقِدُ أَنَّهُ بِإِمْكَانِكَ إِحْرَازُ نَتِيجَةٍ أَفْضَلَ مِنْ هَذِهِ.",
                    voice:"line13.mp3"
                },
                {
                    char:"",
                    en:"Try to play again and see if you can score better!",
                    ar:"حَاوِلْ مَرَّةً أُخْرَى لِنَنْظُرَ أَيُمْكِنُكَ إِحْرَازُ نَتِيجَةٍ أَفْضَلَ!",
                    voice:"line14.mp3"
                }
            ],
            EndFinish:[
                {
                    char:"",
                    en:"That's all, great job!",
                    ar:"هَذَا كُلُّ شَيْءٍ، عَمَلٌ رَائِعٌ!",
                    voice:"line15.mp3"
                },
                {
                    char:"",
                    en:"The teacher is satisfied with your performance. The kids are having fun, too!",
                    ar:"الْمُعَلِّمُ رَاضٍ عَنْ أَدَائِك. كَمَا أَنَّ الْأَطْفَالَ يَقْضُونَ وَقْتاً مُمْتِعاً!",
                    voice:"line16.mp3"
                },
                {
                    char:"",
                    en:"Thank you for playing and see you next time!",
                    ar:"شُكْراً عَلَى اللَّعِبِ نَرَاك فِي الْمَرَّةِ الْقَادِمَةِ!",
                    voice:"line17.mp3"
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