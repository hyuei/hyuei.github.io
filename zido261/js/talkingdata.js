TalkingData = function(){
    this.talkingdata =
    {
        Game1Screen:{
            part1:[
                {char:"", en:"Hello there, welcome!", talk:"السَّلَامُ عَلَيْكُمْ، مَرْحَباً بِكَ! ", voice:"voice1"},
                {char:"", en:"Do you see these houses? They comes from various countries?", talk:"هَلْ شَاهَدْتَ مِثْلَ هَذِهِ الْمَنَازِلِ مِنْ قَبْلُ؟ إِنَّهَا تَنْتَمِي لِدُوَلٍ مُخْتَلِفَةٍ!", voice:"voice2"},
                {char:"", en:"We  have some friends visiting us, but they have difficulties finding their way home. ", talk:"قُومُ بَعْضُ الْأَصْدِقَاءِ بِزِيَارَتِنَا، لَكِنَّهُمْ يُوَاجِهُونَ صُعُوبَاتٍ فِي الْعُثُورِ عَلَى طَرِيقِ الْعَوْدَةِ إِلَى مَنَازِلِهِمْ.", voice:"voice3"},
                {char:"", en:"Could you help them?", talk:"هَلْ يُمْكِنُكَ مُسَاعَدَتُهُمْ فِي ذَلِكَ؟ ", voice:"voice4"},
                {char:"", en:"It’s easy: see those circles? Just put any character in each of the circle.", talk:"الْأَمْرُ سَهْلٌ: لَاحِظْ جَيِّداً الدَّوَائِرَ، ثُمَّ ضَعْ كُلَّ شَخْصِيَّةٍ فِي الدَّائِرَةِ الْمُنَاسِبَةِ لَهَا.", voice:"voice5"},
                {char:"", en:"Once you’ve put them all, they will start walking through the path!", talk:"بِمُجَرَّدِ الْاِنْتِهَاءِ مِنْ وَضْعِ جَمِيعِ الشَّخْصِيَّاتِ فِي الدَّوَائِرِ، سَتَشْرَعُ فِي السَّيْرِ فِي اتِّجَاهِ الْمَنْزِلِ !", voice:"voice6"},
                {char:"", en:"They have tendencies to always turn at every available turn, though, so you might want to consider that before putting the character.", talk:"يُمْكِنُ لِلشَّخْصِيَّةِ أَنْ تَتْبَعَ الْمُنْعَطَفَاتِ الْمَوْجُودَةِ عَلَى الطَّرِيقِ، لِذَلِكَ يَتَوَجَّبُ عَلَيْكَ أَنْ تَنْتَبِهَ جَيِّداً قَبْلَ وَضْعِهَا فِي الدَّائِرَةِ.", voice:"voice7"},
                {char:"", en:"Sometimes there are fake path like this, too, and the character won’t walk through this path. Be careful when you saw this kind of path!", talk:"هُنَاكَ طُرُقٌ مُزَيَّفَةٌ كَهَذَا الطَّرِيقِ، لَا يُمْكِنُ لِلشَّخْصِيَّةِ أَنْ تَسِيرَ عَلَيْهِ، تَوَخَّ الْحَذَرَ مِنْهُ!", voice:"voice8"},
                {char:"", en:"That’s it. Good luck finding which path leads to which house!", talk:"هَذَا كُلُّ شَيْءٍ. حَظّاً مُوَفَّقاً فِي الْعُثُورِ عَلَى الطَّرِيقِ  الْمُؤَدِّي إِلَى الْمَنْزِلِ !", voice:"voice9"},
                {char:"", en:"Remember: they will always turn when walking, except for the fake paths! ", talk:"تَذَكَّرْ: يُمْكِنُهُمْ دَائِماً الْاِنْعِطَافُ أَثْنَاءَ السَّيْرِ إِلَّا إِذَا كَانَ الطَّرِيقُ مُزَيَّفاً !", voice:"voice10"},
            ],
            part2:[
                {char:"", en:"Aww too bad,  it seems that there are still a lot of chara which hasn't found their home yet.", talk:"لِلْأَسَفِ، يَبْدُو أَنَّ كَثِيراً مِنْهُمْ لَمْ يُفْلِحُوا فِي الْوُصُولِ إِلَى مَنَازِلِهِمْ.", voice:"voice11"},
                {char:"", en:"Maybe you can try again next time to help more characters and raise your score.", talk:"يُمْكِنُكَ فِي الْمَرَّةِ الْقَادِمَةِ، أَنْ تُحَاوِلَ مُسَاعَدَةَ بَاقِي الشَّخْصِيَّاتِ وَأَنْ تَرْفَعَ نِقَاطَ رَصِيدِكَ.", voice:"voice12"}
            ],
            part3:[
                {char:"", en:"Great job! You have helped a lot of characters to find their way back home.", talk:"أَحْسَنْتَ! سَاعَدْتَ الْكَثِيرَ مِنَ الشَّخْصِيَّاتِ فِي الْعُثُورِ عَلَى طَرِيقِ الْعَوْدَةِ إِلَى الْمَنْزِلِ. ", voice:"voice13"},
                {char:"", en:"There are so  many culture out there, and these houses are only a small part of it.", talk:"إِنَّهَا ثَقَافَاتٌ مُتَعَدِّدَةٌ وَمُتَنَوِّعَةٌ، وَهَذِهِ الْمَنَازِلُ تُمَثِّلُ جُزْءاً صَغِيراً مِنْهَا فَقَطْ.", voice:"voice14"},
                {char:"", en:"I hope you learned about foreign houses from playing this.", talk:"آمُلُ أَنْ تَكُونَ هَذِهِ اللُّعْبَةُ قَدْ مَكَّنَتْكَ مِنْ اسْتِكْشَافِ مُخْتَلَفِ الْمَنَازِلِ مِنْ سَائِرِ أَنْحَاءِ الْعَالَمِ.", voice:"voice15"}
                // {char:"", en:"", talk:"", voice:""},
            ],
        },
    };
}