class CusRand {    
    static randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }
}