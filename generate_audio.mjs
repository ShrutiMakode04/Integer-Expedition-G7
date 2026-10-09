import fs from 'fs';
import path from 'path';
import https from 'https';

const API_KEY = 'sk_f0e92eeefe5008fab82e898640fe509f35828c7496799618';
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const OUTPUT_DIR = path.join(process.cwd(), 'integers-grade7', 'public', 'audio');

const VOICEOVERS = {
  'intro.mp3': "Welcome to the Integer Expedition! Get ready to discover the fascinating world of integers, rational numbers, and absolute values. Your mathematical adventure begins right now!",
  
  'wonder_1.mp3': "Sarah looked at a thermometer outside. It showed minus 3 degrees Celsius. Inside it was plus 22 degrees Celsius. How much warmer is it inside than outside? And what kind of numbers are these mysterious negatives? Numbers that go below zero are called negative integers. Numbers above zero are positive integers. Zero sits right in between!",
  
  'wonder_2.mp3': "Mike cut a pizza into 4 equal slices. He ate 3 slices. What fraction did he eat? Is 3 fourths a whole number? Can we place it on a number line between integers? Welcome to rational numbers! A rational number is any number written as p over q, where p and q are integers and q is not zero. This includes all integers, fractions, and terminating or repeating decimals!",
  
  'story_1.mp3': "The Temperature Mystery. Sarah stepped outside and gasped — the thermometer read minus 3 degrees! She ran back to tell John, who was cozy inside at plus 22 degrees. 'That's 25 degrees warmer!' said John, scribbling on paper. The numbers below zero are called negative integers. Numbers above zero are positive integers. Zero is the boundary between them — neither positive nor negative! Integers include minus 3, minus 2, minus 1, 0, plus 1, plus 2, plus 3 — whole numbers extending in both directions! Negative integers go left on the number line. Positive go right!",
  
  'story_2.mp3': "Mike's Number Line Adventure. Mike grabbed a marker and drew a long arrow on the whiteboard. He placed 0 in the centre, then marked plus 1, plus 2, plus 3 to the right in warm orange, and minus 1, minus 2, minus 3 to the left in cool blue. 'The further left you go, the smaller the number,' he told his class. Even minus 100 has a home on this infinite line! On the number line: the further left, the smaller. The further right, the larger! Numbers increase from left to right — always!",
  
  'story_3.mp3': "Splitting the Pizza — Rational Numbers! John ordered a pizza and cut it into 8 equal slices. Sarah took 3 slices — that's 3 eighths of the pizza. Mike took 2 slices — that's 2 eighths, which simplifies to 1 fourth. These fractions are called rational numbers — any number that can be written as p over q where p and q are integers and q is not zero! Rational Number equals p over q, where p and q are integers and q is not zero. Includes all integers, fractions, and decimals! Every integer is also rational: 5 equals 5 over 1. So integers are a subset of rationals!",
  
  'story_4.mp3': "Ordering Integers and Rational Numbers. Mike challenged Sarah and John: 'Put these in order from least to greatest: minus 5, minus 1 half, 0, 3 fourths, 3.' Sarah converted everything to decimals: minus 5.0, minus 0.5, 0, 0.75, 3.0. Then she placed them left to right on the number line. The trick: negative fractions are still negative — they fall between negative integers and zero! To compare rational numbers — convert to decimals, then use the number line: left is less, right is more! Minus 1 half is greater than minus 5 because minus 0.5 is greater than minus 5.0 on the number line!",
  
  'story_5.mp3': "Integers and Rationals in the Real World. John, Mike, and Sarah found integers everywhere! Banks show plus 50 dollars for deposits and minus 30 dollars for withdrawals. Mountain peaks rise to plus 8,849 meters; valleys sink to minus 430 meters below sea level. A football team gains plus 7 yards or loses minus 3 yards. Even exam scores, temperatures, and profit and loss use these numbers every single day! Integers model gain and loss, above and below, profit and debt. Rational numbers model parts, percentages, and measurements! You now see integers and rationals in the real world — you're a Math Explorer!",
  
  'sim_intro.mp3': "Welcome to the Simulation Lab! Choose a station to explore integers and rational numbers in action.",
  'sim_station_0.mp3': "City Temperature Mission. Order the cities from coldest to warmest using their integer temperatures!",
  'sim_station_1.mp3': "Number Line Architect. Place integers and rational numbers in their exact positions on the number line.",
  'sim_station_2.mp3': "Number Classifier. Sort each number into the correct category — negative integer, zero, positive integer, or rational fraction!",
  'sim_station_3.mp3': "Comparing Numbers. Pick the correct symbol — less than, equal to, or greater than.",
  'sim_station_4.mp3': "Integer Hopper! Pick a card to hop the frog on the number line. Land exactly on the target in limited hops!",
  
  'sim_story.mp3': "Integer Story Solver. Read the story problem carefully and pick the correct answer.",
  
  'feedback_correct.mp3': "Very good!",
  
  'feedback_incorrect.mp3': "Incorrect.",
  
  'practice_intro.mp3': "Welcome to the Practice Arena! Choose a challenge to test your skills.",
  
  'reflect_intro.mp3': "Reflect and Review. Let's consolidate everything you've learned about Integers and Rational Numbers!"
};

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateAudio(filename, text) {
  const outPath = path.join(OUTPUT_DIR, filename);
  if (fs.existsSync(outPath)) {
    console.log(`Skipping ${filename}, already exists.`);
    return true;
  }

  const data = JSON.stringify({
    text: text,
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75
    }
  });

  const options = {
    hostname: 'api.elevenlabs.io',
    port: 443,
    path: `/v1/text-to-speech/${VOICE_ID}`,
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(outPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          console.log(`✅ Generated ${filename}`);
          resolve(true);
        });
      } else {
        let errorData = '';
        res.on('data', chunk => errorData += chunk);
        res.on('end', () => {
          console.error(`❌ Failed ${filename}: ${res.statusCode} - ${errorData}`);
          resolve(false);
        });
      }
    });

    req.on('error', (e) => {
      console.error(`❌ Request error for ${filename}:`, e.message);
      resolve(false);
    });

    req.write(data);
    req.end();
  });
}

async function run() {
  console.log("Starting ElevenLabs TTS generation...");
  let successCount = 0;
  for (const [filename, text] of Object.entries(VOICEOVERS)) {
    console.log(`Generating ${filename}...`);
    const success = await generateAudio(filename, text);
    if (success) successCount++;
    else {
      console.log("Stopping generation due to an error (likely out of credits).");
      break;
    }
    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log(`Finished generating ${successCount}/${Object.keys(VOICEOVERS).length} files.`);
}

run();
