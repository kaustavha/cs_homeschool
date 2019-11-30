//Write a function that will find the character that most frequently occurs in a string. If there is a tie, then return the character that occurs earliest in the string.  
//For example: "Hello" returns 'l'. "Mississippi" returns 'i'. "Here's a complex sentence with 9 words in it." returns ' '.

function charFreq(word) {
    let chars = word.split('');
    let freqStore = {};
    let indexStore = {};
    let maxFreq = 0;
    let maxFreqChar = '';
    let ties = [];
    let minIndex = word.length;
    //
    
    chars.forEach((char, i) => {
        if (!freqStore[char]) {
            freqStore[char] = {
                index: i,
                count: 0
            };
        }
        freqStore[char].count++;
        
        if (maxFreq < freqStore[char].count) {
            maxFreq = freqStore[char].count;
            maxFreqChar = char;
        }
        
        if (maxFreq === freqStore[char].count) {
            if (minIndex >= freqStore[char].index) {
                minIndex = i;
                maxFreqChar = char;
            }
        }
    });
    
    console.log(minIndex, maxFreqChar, maxFreq)
    
    // let minIndex = word.length;
    // Object.keys(freqStore).forEach(char => {
    //     let obj = freqStore[char];
    //     let count = obj.count;
    //     let index = obj.index;
        
    //     if (index < minIndex && maxFreq === count) {
    //         minIndex = index;
    //         maxFreqChar = char;
    //     }
    // });
    
    return maxFreqChar;
}

console.log('hi')
console.log(charFreq("Hello"))
console.log(charFreq("Mississippi"))
console.log(charFreq("Here's a complex sentence with 9 words in it."))